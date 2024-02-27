const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const User = require('../models/userModel');
const handlerFactory = require('./handlerFactory');

const filterBody = function (obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
    return newObj;
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'do not use this route GO TO /signup',
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    message: 'Successful read',
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if the user want to update password
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'this rout is not for updating password, please use updatePassword',
        400,
      ),
    );
  }
  //filter out the fields that the user is not allowed to change like 'token','role',etc
  const filteredBody = filterBody(req.body, 'name', 'email');
  //update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    message: 'Successful read',
    data: {
      user: updatedUser,
    },
  });
});
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
