const mongoose = require("mongoose");
const Review = require("./review");
const { coordinates } = require("@maptiler/client");
const Schema = mongoose.Schema;

const ImageSchema= new Schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/c_limit,h_200,w_200');
});

const opts = {toJSON:{virtuals:true}};


const  CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
},opts);


CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return ` <a href="/campgrounds/${this._id}">${this.title}</a>`
});


CampgroundSchema.post('findOneAndDelete',async function(doc){ //removes reviews when delete an campground(specific)
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground",CampgroundSchema);