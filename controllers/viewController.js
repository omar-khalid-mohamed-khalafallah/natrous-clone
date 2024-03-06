/* eslint-disable prettier/prettier */
const Tour = require('../models/toursModel');
const User = require('../models/userModel');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
    const tours = await Tour.find();
    res.render('overview', { tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
    //1) get the data, for the requested tour (including reviews and guides)

    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });

    console.log(tour.guides);
    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }
    //2) Build templete
    //3) Render that template using tour datat from 1)

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        },
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser,
    });
});
