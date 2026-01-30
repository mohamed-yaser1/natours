/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs')
const Tour = require('../../models/tourModel.js');

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
console.log('data',data)


const importData = async () => {
    try {
        await Tour.create(data)
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Tour.deleteMany()
    } catch (error) {
        console.log(error.message)
    }
    process.exit();
}
console.log(process.argv)

if(process.argv[2] === '--import')
    importData();
else if(process.argv[2] === '--delete')
    deleteData();

