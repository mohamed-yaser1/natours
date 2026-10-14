/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs')
const Tour = require('../../models/tourModel.js');
const Review = require('../../models/reviewModel.js');
const User = require('../../models/userModel.js');

// dotenv.config({ path: './config.env' });
dotenv.config({ path: `${__dirname}/../../config.env` }); 


mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology: true
}).then(()=>console.log('connected to mongo succesfully'))
.catch(err=>console.log(err.message,'error'))



const data = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`,'utf-8'))

// console.log('data',data)


const importData = async () => {
    try {
        await Tour.create(data)
        await Review.create(reviews)
        await User.create(users,{validateBeforeSave:false})
    } catch (error) {
        console.log(error.message)
    }
    console.log('created suc')
    process.exit();
}

const deleteData = async () => {
    try {
        await Tour.deleteMany()
        await User.deleteMany()
        await Review.deleteMany()
    } catch (error) {
        console.log(error.message)
    }
    console.log('done')
    process.exit();
}
console.log(process.argv)

if(process.argv[2] === '--import')
    importData();
else if(process.argv[2] === '--delete')
    deleteData();

