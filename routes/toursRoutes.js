/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const tourController = require('../controllers/toursController');
const authController = require('../controllers/authController')
const reviewRout = require('./reviewRoutes');
//router.param('id', tourController.checkID);

router.use('/:tourId/reviews', reviewRout);

router
  .route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year').get(authController.protect, authController.restrictedTo('user', 'admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router.route('/tour-within/:distance/center/:latLng/unit/:unit')
  .get(tourController.getTourWithin);
router
  .route('/distance/:latLng/unit/:unit')
  .get(tourController.getDistance);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictedTo('admin', 'lead-guide'), tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect, authController.restrictedTo('user', 'admin', 'lead-guide'), tourController.updateTour)
  .delete(authController.protect, authController.restrictedTo('admin', 'lead-guide'), tourController.deleteTour);


module.exports = router;
