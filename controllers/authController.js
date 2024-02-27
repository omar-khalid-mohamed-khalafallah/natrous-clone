/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const AppError = require('../util/appError');
const User = require('../models/userModel');
const catchAsync = require('../util/catchAsync');
const sendEmail = require('../util/emailSender');

const createTOkenRespond = function (user, statuscode, res) {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie('token', token, cookieOptions)
  res.status(statuscode).json({
    status: 'Successful sign up',
    token,
    data: user,
  });
};
//signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createTOkenRespond(newUser, 201, res);
});
//login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please enter email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }
  createTOkenRespond(user, 200, res);
});
//protect routs
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('not authorized user please log in', 401));
  }
  //verify
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check if the user exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError(
        'this user belonging to this token does no longer exist',
        401,
      ),
    );
  // check if the user has changed the password after the token issued
  if (freshUser.passwordChanged(decoded.iat)) {
    return next(new AppError('the password has changed log in again', 401));
  }
  req.user = freshUser;
  next();
});
//Authorizations in the site, You must know who is the BOSS here ,I mean 'admin'
exports.restrictedTo =
  (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("sorry you don't have the permission to this action", 403),
        );
      }
      next();
    };
// Forgot your Password while logging in
exports.forgetPassword = catchAsync(async (req, res, next) => {
  //check the email in DB
  const userExists = await User.findOne({ email: req.body.email });

  if (!userExists) {
    return next(new AppError('there is no user with this email', 404));
  }
  //create random token for password reset

  const resetToken = userExists.createPasswordResetToken();

  await userExists.save({ validateBeforeSave: false });
  // send the token to the user's email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/:${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your password and confirmPassword to : ${resetUrl}, Please if you did not forget the password ignore this email`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: 'your reset password token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email',
    });
  } catch (err) {
    userExists.passwordResetToken = undefined;
    userExists.passwordResetExpires = undefined;
    await userExists.save({ validateBeforeSave: false });
    return next(new AppError('there was an error in sending email, try later', 500));

  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //(1)# get the user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) {
    return next(new AppError('token expired or invalid', 400));
  }
  //(2)# check if the token expired or not
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //(3)# update changePasswordAt field
  //(4)# log the user in
  createTOkenRespond(user, 200, res);

});
// Updating Password but for the users who are logged in already
exports.updatePassword = catchAsync(async (req, res, next) => {
  //find user in the db
  const user = await User.findById(req.user.id).select('+password');
  //check the posted password is correct 
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('the current password is incorrect', 400));
  }
  //if so update the password
  user.password = req.body.password;
  user.confirmPassword = req.body.passwordConfirm; // Assuming confirmPassword is sent in the request
  await user.save();
  //log the user in
  createTOkenRespond(user, 200, res);
});

