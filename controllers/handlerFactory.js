/* eslint-disable prettier/prettier */
const AppError = require("../utils/apiError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model => catchAsync(async (req,res,next) => {
    
    const doc = await Model.findByIdAndDelete(req.params.id);

    if(!doc) return next(new AppError(`no document found with this is`));

    res.status(204).json({
        status:'success',
        data:null
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
