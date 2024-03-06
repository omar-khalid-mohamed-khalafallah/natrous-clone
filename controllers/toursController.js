/* eslint-disable prettier/prettier */
const Tour = require('../models/toursModel');
// const APIFeatures = require('../util/apiFeatures');
const catchAsync = require('../util/catchAsync');
const AppError = require('../util/appError');
const handlerFactory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};


exports.getAllTours = handlerFactory.getAll(Tour);
exports.createTour = handlerFactory.createOne(Tour);
exports.getTour = handlerFactory.getOne(Tour, { path: 'reviews' });
exports.updateTour = handlerFactory.updateOne(Tour);

exports.deleteTour = handlerFactory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('the tour is not Found', 404));
//   }
//   res.status(204).json({
//     message: 'Successful Delete',
//     data: {
//       tour: '<Deleted Tour>',
//     },
//   });
// });
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    }

  ]);
  res.status(200).json({
    message: 'Successful read',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursMonthly: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { numToursMonthly: -1 }
    }
  ])
  res.status(200).json({
    message: 'successful plan',
    data: {
      plan,
    },
  })
});
//'/tour-within/300/center/:30.595623, 32.262002/unit/mi'
exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latLng, unit } = req.params
  if (!latLng) {
    next(new AppError('Please provide latLng.', 400));
    return;
  }
  const [lat, lng] = latLng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    next(new AppError('please provide lat - lng', 400));
  }
  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lat, lng], radius] } }
  });
  res.status(200).json({
    message: 'success',
    results: tour.length,
    data: {
      tour,
    }
  });
});
exports.getDistance = catchAsync(async (req, res, next) => {
  const { latLng, unit } = req.params;
  const [lat, lng] = latLng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});