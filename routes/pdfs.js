const express=require('express');
const router=express.Router();
const campgrounds=require('../controllers/pdfs');
const catchAsync=require('../utilities/catchAsync');
const Campground =require("../models/pdf");
const {isLoggedIn,validateCampground,isAuth}=require('../middleware');
const multer  = require('multer');
const {storage}=require('../cloudinary');
const upload = multer({storage});


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn,isAuth,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
.delete(isAuth,isLoggedIn,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuth,catchAsync(campgrounds.renderEditForm))

module.exports=router;