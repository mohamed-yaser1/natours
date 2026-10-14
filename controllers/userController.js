/* eslint-disable prettier/prettier */
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/apiError');

exports.getAllUsers = catchAsync(async(req, res) => {
  const users = await User.find();

  res.status(200).json({
    status:'success',
    data:users
  })
});

const filterObj = (obj,...allowedFields) => {
  // obj that i want to ubdate 
  // allowed fields in object that can be updated
  const filteredObj = {};

  Object.keys(obj).forEach(key => {
    if(allowedFields.includes(key)) filteredObj[key] = obj[key];
  })

  return filteredObj;
}

exports.getMe = (req,res,next) => {
  req.params.id = req.user.id;

  next();
}

exports.updateMe = catchAsync(async(req,res,next) => {
  // 1 create errors if user posted password data
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError("y should not add password",400))
  }
  // 2 update user document

  // const user = await User.findById(req.user.id);
  // user.name = 'jonas';
  // await user.save();

  const filteredBody = filterObj(req.body,"name","email")
  console.log(filteredBody)
  //Validators run ONLY on the fields you are updating
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true});

  res.status(200).json({
    message:"success",
    user:updatedUser

  })
})

exports.deleteMe =catchAsync(async(req,res,next) => {
  await User.findByIdAndUpdate(req.user.id,{active:false});

  res.status(204).json({
    status:"success",
    data:null
  })
})


exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
