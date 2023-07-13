if(process.env.NODE_ENV !== "production" ){
    require('dotenv').config();
}

const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const Joi=require('joi');
const Campground =require("./models/pdf");
const Review=require('./models/review');
const {campgroundSchema,reviewSchema}=require('./schemas.js');
const exp = require('constants');
const catchAsync=require('./utilities/catchAsync');
const expressError=require('./utilities/expressError');
const methodOverride=require('method-override');
const campgroundsRoutes=require('./routes/pdfs');
const reviewsRoutes=require('./routes/reviews');
const passport=require('passport');
const localStrategy=require('passport-local');
const User=require('./models/user');
const userRoutes=require('./routes/users');


mongoose.connect('mongodb+srv://dmnsingh007:Daman123@pdfmanagment.evfx1ph.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const app=express();

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig={
    secret: 'snerocks',
    resave: false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires: Date.now()+1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})

// app.get('/fakeUser',async(req,res)=>{
//     const user=new User({email:'snehal@gmail.com',username:'snehal'});
//     const newUser=await User.register(user,'iloved');
//     res.send(newUser);
// })

app.use('/pdfs',campgroundsRoutes)
app.use('/pdfs/:id/reviews',reviewsRoutes)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next(new expressError('Page not found',404))
})
app.use((err,req,res,next)=>{
    const{statusCode=500}=err;
    if(!err.message)err.message='Something is wrong'
    res.status(statusCode).render('error',{err});
})
app.listen(3000, ()=>{
    console.log('listening on port 3000')
})