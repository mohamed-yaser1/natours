/* eslint-disable prettier/prettier */
const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require("../routes/reviewRoutes")

const router = express.Router();

//base /api/v1/tours
// router.param('id', tourController.checkID);


  //post /tour/254665/reviews

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview);

router.use('/:tourId/reviews',reviewRouter);
  

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

  

module.exports = router;



