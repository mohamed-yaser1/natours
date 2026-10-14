/* eslint-disable prettier/prettier */
// review / rating / createdAt / ref to tour / ref to usr

//   {
//     "_id": "5c8a34ed14eb5c17645c9108",
//     "review": "Cras mollis nisi parturient mi nec aliquet suspendisse sagittis eros condimentum scelerisque taciti mattis praesent feugiat eu nascetur a tincidunt",
//     "rating": 5,
//     "user": "5c8a1dfa2f8fb814b56fa181",
//     "tour": "5c88fa8cf4afda39709c2955"
//   },
const mongoose = require('mongoose')
const Tour = require('./tourModel')
const { findOne } = require('./userModel')

const reviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review can not be empty']
        
    },
    rating:{
        type:Number,
        min:[1,'rating must be between 1 and 5'],
        max:[5,'rating must be between 1 and 5']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'review must belong to a User']
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'review must belong to a tour']
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

reviewSchema.pre(/^find/,function(next){
    
    this.populate({
        path:'tour',
        select:'name'
    }).populate({
        path:'user',
        select:'name photo'
    })
    
    next()
})

reviewSchema.statics.calcAverageRatings = async function(tourId){
    // this points to the current Model
    const stats = await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'tour',
                nRatings:{$sum:1},
                avgRating:{$avg:"$rating"}
            }
        }
    ])
    // console.log(stats)
    await Tour.findByIdAndUpdate(tourId,{
        ratingsQuantity:stats[0].nRatings,
        ratingsAverage:stats[0].avgRating
    })
}

reviewSchema.post('save',function(){
    // this points to the current document being saved 
    // this.constructor points to the Model the document was created from
    this.constructor.calcAverageRatings(this.tourID);
})
//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/,async function(next){
    //accessing the document through the query
    this.r = await this.findOne();
    next();
})

reviewSchema.post(/^findeOneAnd/,async function(){
    // this.findOne(); can not work here query has already excuted
    await this.r.constructor.calcAverageRatings(this.r.tourId)
})

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review
/*
query middleware

reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'tour',
        select:'name
    }).populate({
        path:'user',
        select:'name photo'
    })
})

 */


