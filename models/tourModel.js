/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:'difficulty is either easy meduim or difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min:[1,'Raating must be above 1.0'],
      max:[5,'rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number
    },
    summary: {
      type: String,
      required: [true, 'A true must have a description'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    slug: String,

    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation:{
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String
    },
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ],
    guides:[
      {
        type:mongoose.Schema.ObjectId,
        ref:'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ⁡⁢⁣⁢document⁡ ⁡⁢⁣⁢middleware⁡ run before .save() and create()

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//document middleware runs after .save() and create()

// tourSchema.post('save',function(doc,next){
//   console.log(doc)
//   next();
// })

// tourSchema.virtual('durationWeeks').get(function(){
//   return this.duration/7
// })

//virtual populate

tourSchema.virtual('reviews',{
  ref:'Review',
  foreignField:'tour',
  localField:'_id'
})

// ⁡⁢⁣⁢query middlewre⁡
// all strings starts with find

// this in query middleware points to the current query

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();

  next();
});

tourSchema.pre(/^find/,function(next){

  this.populate({
    path:'guides',
    select:'-_v -passwordChangedAt'
  })

  next();
})

tourSchema.post(/^find/, function(docs, next) {
  console.log(`query took ${Date.now() - this.start}`);
  next();
});

// aggregation middleware

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { $ne: true } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
