/* eslint-disable prettier/prettier */
const express = require('express');
const reviewController = require('./../controllers/reviewController')
const authController = require('../controllers/authController')
// base = /api/v1/reviews
const router = express.Router({mergeParams:true});

//get tours/123456/reviews
// post tours/125653/reviews

router.use(authController.protect)

router.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect
    ,authController.restrictTo('user'),
    reviewController.createReview)

router.route('/:id').delete(reviewController.deleteReview)



module.exports = router