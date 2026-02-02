/* eslint-disable prettier/prettier */
const crypto = require('crypto')
const {promisify} = require("util");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/apiError');
const sendEmail = require('../utils/email');


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) email and passwords actually exist
  if (!email || !password)
    return next(new AppError('please enter email and password', 400));

  // 2) user exist and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(new AppError('password or email is not correct', 401));
  // 3) evry thing is fine send jwt to the client

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});


exports.protect = catchAsync(async (req, res, next) => {
  //getting token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log("AUTH HEADER:", req.headers.authorization);
  if (!token)
    return next(new AppError('you are not loged in leg in to get access', 401));

  //verifacation token
  // const verifyAsync = promisify(jwt.verify);
  // const decoded = await verifyAsync(token, process.env.JWT_SECRET);


  const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
  //  decoded be like this => { id: '68853a2b0afa0291f07075e6', iat: 1756627464, exp: 1757491464 }

  //check if user still exist
  const currentUser = await User.findById(decoded.id)
  if(!currentUser) return next(new AppError('this user no longer exists',401));


  //check if the user changed the password after the token was issued
  if(currentUser.changePasswordAfter(decoded.iat))
    return next(new AppError("the password has been changed log in again" ,401));

  req.user = currentUser;

  next();
});



exports.restrictTo = (...roles) => {
  // roles here is an array 
  // restrictTo("admin","guide")

  return (req,res,next) => {
    if(!roles.includes(req.user.role)){
      return next(new AppError('you dont have permission for this action',403));
    }
    next();
  }
} 



exports.forgotPassword = catchAsync(async (req,res,next) => {

  // get user based on posted email
  const user = await User.findOne({email:req.body.email})

  if(!user) return next(new AppError("there is no user with this email",404));

  //generate the random reset token

  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave:false});
  console.log('momomomom')

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`

  const message = `Forgot yr password ? submit a patch request 
  with your new pssword and password confirm to \n ${resetUrl}\n if y didnt ignore it`

  //send it to  user email
  await sendEmail({
    email:user.email,
    subject:'your password reset token valid for 10min',
    message,
  })

  res.status(200).json({
    status:'success',
    message:'token sent to email'
  })

})

exports.resetPassword = catchAsync(async (req,res,next) => {
  // 1) get user based on the token 

  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({passwordResetToken:hashedToken,passwordResetexpires:{
    $gt:Date.now()
  }})
  if(!user) return next(new AppError("token is invalid or has expired",400))
   
  //2)if the token has not expired and there is a user set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordChangedAt = Date.now() - 1000;
  user.passwordResetToken = undefined;
  user.passwordResetexpires = undefined;

  await user.save()

  //3)update the changed passwordAt prooperty
  
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
  //4)log the user in
})

exports.updatePassword = catchAsync(async(req,res,next) => {
  const  user  = await User.findById(req.user.id).select('+password');

  const isMatch = await bcrypt.compare(req.body.oldPassword,user.password);
  if(!isMatch) return next(new AppError("password is in correct",401));

  user.password = req.body.newPassword
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordChangedAt = Date.now() - 1000;

  await user.save()

  const token = signToken(user._id);

  res.status(200).json({
    status:'success',
    token,
    message:'password updated correctly'
  })
})



/**
 * 
 * export.forgetPassword = catchAsync(async(req,res,next) => {
 *    const user = await user.find({email:req.body.email});
 *    
 *    if(!user) return next(new AppError('the email does not exist',404))
 * 
 *    const resetToken = user.createPasswordResetToken();
 *    await user.save({validateBeforeSave:false});
 * })
 * 
 * 
 * 
 * 
 */