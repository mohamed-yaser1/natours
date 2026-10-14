/* eslint-disable prettier/prettier */
const AppError = require("../utils/apiError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

// exports.deleteOne = Model => catchAsync(async (req,res,next) => {
    
//     const doc = await Model.findByIdAndDelete(req.params.id);

//     if(!doc) return next(new AppError(`no document found with this is`));

//     res.status(204).json({
//         status:'success',
//         data:null
//     })
// })

exports.deleteOne = Model => catchAsync(async (req,res,next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) return next(new AppError("no tour found with this id ",404));

    res.status(204).json({
        status:'success',
        data:null
    })
})

exports.createOne = Model => catchAsync(async(req,res,next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
        status:'success',
        data:{
            data:doc
        }
    })
})

exports.updateOne = Model => catchAsync(async(req,res,next) => {
    const doc = Model.findByIdAndUpdate(req.params.id,{
        runValidators:true,
        new:true
    });

    if(!doc) return next(new AppError("this document is not found ",404));

    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    })
})

exports.getOne = (Model,populateOptions) => catchAsync(async(req,res,next) => {
    let query = Model.findById(req.params.id);
    if(populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    if(!doc) return next(new AppError("this document is not existed",404));

    res.status(200).json({
        status:'success',
        data:{
            data:doc
        }
    })

})

exports.getAll = (Model) => catchAsync(async(req,res,next) => {
    let filter = {}  // for nested routes like thus 
    //GET /api/v1/tours/12345/reviews
    // when i get all reviews for a specific tour
    if(req.params.tourId) filter = {tour:req.params.tourId};
    const features = new APIFeatures(Model.find(filter),req.query)
        .filter().sort().limitFields().paginate();

    const docs = await features.query;

    res.status(200).json({
        status:'success',
        results:docs.length,
        data:{
            data:docs
        }
    })
})

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
