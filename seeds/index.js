const mongoose=require('mongoose');
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers');
const Campground =require("../models/pdf");
const campground = require('../models/pdf');

mongoose.connect('mongodb://127.0.0.1:27017/help-camp')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

const sample= (array) => array[Math.floor(Math.random()*array.length)];

const seedDB= async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
        const random1000=Math.floor(Math.random()*1000);
        const camp= new Campground({
            author: '63da7f74fa60fb7031cdef65',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:[
                {
                    url:'https://res.cloudinary.com/dsff7jseu/image/upload/v1675664983/HelpCamp/yjwadnemskfquodbglee.png',
                    filename: 'HelpCamp/yjwadnemskfquodbglee',              },
                {
                url: 'https://res.cloudinary.com/dsff7jseu/image/upload/v1675438824/HelpCamp/nynuwhlpdry4qyfqpple.jpg',
                filename: 'HelpCamp/nynuwhlpdry4qyfqpple',              }     
            ],
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close();
})