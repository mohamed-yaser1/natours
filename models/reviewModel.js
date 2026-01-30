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

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review

