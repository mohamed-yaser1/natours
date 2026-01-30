/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const Tour = require('../models/tourModel');
const catchAsync  = require('../utils/catchAsync')
const factory = require('./handlerFactory')



//we should wrap all the functions with this to 
//avoid repeatig try catch block 

/////////////////////////////////////////////////////

exports.aliasBestTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,price';
  next();
};
// query = query object comming from mongoose ( Tour.find() )
// queryString = comming from url ( req.query )

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //filtering
    const excludes = ['page', 'limit', 'sort', 'fields'];
    const queryObject = { ...this.queryString };
    excludes.forEach(e => delete queryObject[e]);
    //advanced filtering
    let queryStr = JSON.stringify(queryObject);
    queryStr = JSON.parse(queryStr.replace(/\b(gte|gt|lte|lt)\b/g, e => `$${e}`));

    this.query = this.query.find(queryStr);
    //return object so we can use .filter().sort() or any methode in the class
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // sort(price,duration)
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('createdAt  _id');
    }
    return this;
  }

  fields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    //filtering
    // console.log(req.query)
    // const excludes = ['page','sort','limit','fields']
    // const queryObject = {...req.query}
    // excludes.forEach(exc => delete queryObject[exc])

    //Advanced filtering

    // let queryString = JSON.stringify(queryObject);
    // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g,e => `$${e}`);
    // console.log(JSON.parse(queryString))

    // let query = Tour.find(JSON.parse(queryString)); //It returns a Mongoose Query object, not the data itself.
    // // sorting
    // if(req.query.sort)
    // {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy)
    //   // sort('price','duration')
    // }
    // else{
    //    query = query.sort('createdAt  _id')
    // }

    // fields

    // if(req.query.fields)
    // {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // }
    // else{
    //   query = query.select('-__v');
    // }

    //pagination
    // const page = req.query.page*1 || 1;
    // const limit = req.query.limit*1 || 100;
    // const skip = (page - 1) * limit

    // query = query.skip(skip).limit(limit);
    // if(req.query.page)
    // {
    //   const documentsNumber = await Tour.countDocuments()
    //   if(skip >= documentsNumber) throw new Error('page is not found')
    // }
    // page=3&limit=2
    // console.log(query)

    const query = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();
    const tours = await query.query; // await here means excute the query

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours }
    });
  } catch (error) {
    res.status(404).json({
      success: 'false',
      message: error.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    res.status(200).json({
      success: 'true',
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(404).json({
      success: 'false',
      message: error.message
    });
  }
};

exports.createTour = async (req, res) => {
  // console.log(req.body);
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};

// 1

// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'success',
//       data: null
//     });
//   } catch (error) {
//     res.status(404).json({
//       status: 'fail',
//       message: error.message
//     });
//   }
// };

 // 2

// exports.deleteTout = catchAsync(async (req,res,next) => {
    
//     const tour = await Model.findByIdAndDelete(req.params.id);

//     if(!tour) return next(new AppError(`no tour found with this is`));

//     res.status(204).json({
//         status:'success',
//         data:null
//     })
// })

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$difficulty",
          numTours: {$sum:1},
          averageRating: { $avg: '$ratingsAverage' },
          numRatings: {$sum:"$ratingsQuantity"},
          avgPrice: { $avg: '$price' },
          minPrice: {$min:'$price'},
          maxPrice: {$max:'$price'}
        },
        
      },
      {
        $sort:{avgPrice:-1}
      }
    ]);

    res.status(200).json({
      status:'success',
      data:stats
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
};


exports.getMonthlyPlan = async (req,res) => {
  try {
    const year = req.params.year*1;
    const plan = await Tour.aggregate([
      {
        $unwind:"$startDates"
      },
      {
        $match:{
          startDates:{
            $gte:new Date(`${year}-01-01`),
            $lte:new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{$month: "$startDates"},
          numTourStarts:{$sum:1},
          tours:{$push:"$name"}
        }
      },
      {
        $addFields:{month:"$_id"}
      },
      {
        $project:{_id:0}
      },
      {
        $sort:{numTourStarts:-1}
      }
    ])
    res.status(200).json({
      status:'success',
      results:plan.length,
      data:plan
    }) 

  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error.message
    });
  }
}
