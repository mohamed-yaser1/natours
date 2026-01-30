/* eslint-disable prettier/prettier */
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/best-5-cheap')
  .get(tourController.aliasBestTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

  
  //post /tour/254665/reviews

router
  .route('/:tourId/reviews')
  .post(authController.protect,authController.restrictTo('user'),reviewController.createReview);

  

module.exports = router;



