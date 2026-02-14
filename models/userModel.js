/* eslint-disable prettier/prettier */

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please enter yr name']
  },

  email: {
    type: String,
    required: [true, 'enter yr email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(el) {
        return validator.isEmail(el);
      }
    }
  },
  photo: String,
  role:{
    type:String,
    enum:['user','guide','lead-guide','admin'],
    default:'user'
  },
  password: {
    type: String,
    required: [true, 'please provide password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm yr password'],
    validate: {
      validator: function(el) {
        // this is only work on save()
        return el === this.password;
      },
      message: 'passwors are not the same'
    }
  },
  passwordChangedAt:Date,
  passwordResetToken:String,
  passwordResetexpires:Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});

// between recieving the data and storing it in the database
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save" , function(next){
  if(!this.isModified("password") || this.isNew){
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000 ;
  next()
})

userSchema.pre(/^find/,function(next){
  this.find({active:{$ne:false}});
  next();
})
//instance method available just for all documents from this schema

userSchema.methods.changePasswordAfter = function(jwtTimeStamp){
  if(this.passwordChangedAt)
  {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
    return changedTimestamp > jwtTimeStamp;
  }

  return false;
}

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetexpires = Date.now() + 10*60*1000;

  return resetToken;

}

const User = mongoose.model('user', userSchema);
module.exports = User;
