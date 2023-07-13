const express=require('express');
const router=express.Router({mergeParams: true});
const catchAsync=require('../utilities/catchAsync');
const expressError=require('../utilities/expressError');
const Review=require('../models/review');
const Campground =require("../models/pdf");
const {validateReview,isLoggedIn,isReviewAuth}=require('../middleware')
const reviews=require('../controllers/reviews');

router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));
router.delete('/:reviewId',isLoggedIn,isReviewAuth,catchAsync(reviews.deleteReview));

module.exports=router;