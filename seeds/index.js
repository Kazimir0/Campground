const mongoose = require("mongoose");
const cities = require("./cities");
const {descriptors,places} = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
});

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected!")
})


const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<300;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price =Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            //my user id
            author: '66e14d0b316226a74829ed8a',
            location:`${cities[random1000].city} , ${cities[random1000].state}`,
            title:`${sample(descriptors)},${sample(places)}`,
            description:"Lorem, ipsum dolor sit amet consectetur adipisicing elit. Porro ex omnis eaque? Distinctio a culpa nostrum nobis, iusto facere recusandae nisi non. Saepe maxime esse excepturi eveniet velit fuga quisquam!",
            price,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/dhh7dkomy/image/upload/v1726213678/YelpCamp/tvf9sgohebvb1kq2mn3c.jpg',
                  filename: 'YelpCamp/tvf9sgohebvb1kq2mn3c',
                },
                {
                  url: 'https://res.cloudinary.com/dhh7dkomy/image/upload/v1726213678/YelpCamp/zzjjovws4pyfgwksk8dv.jpg',
                  filename: 'YelpCamp/zzjjovws4pyfgwksk8dv',
                }
              ]
        })
        await camp.save();
    }
}

//seedDB returns a promise bcs its a async func
//we have to close after use it
seedDB().then(()=>{
    mongoose.connection.close();
})