const {campgroundSchema,reviewSchema}=require('./schemas');
const expressError=require('./utilities/expressError');
const Campground =require("./models/pdf");
const Review=require("./models/review");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body);

    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next();
    }
}

module.exports.isAuth=async(req,res,next)=>{
    const{id}=req.params
    const campgrounds=await Campground.findById(id);
    if(!campgrounds.author.equals(req.user._id)){
       req.flash('error','You do not have permission')
       res.redirect(`/pdfs/${id}`);
    }
    next();
}

module.exports.isReviewAuth=async(req,res,next)=>{
    const{id,reviewId}=req.params
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
       req.flash('error','You do not have permission')
       res.redirect(`/pdfs/${id}`);
    }
    next();
}

module.exports.validateReview=(req,res,next)=>{
    const{error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new expressError(msg,400)
    }else{
        next();
    }
}