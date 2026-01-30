/* eslint-disable prettier/prettier */
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

 

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch("/resetpassword/:token",authController.resetPassword)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);


module.exports = router;
// {
//   "name":"mohamed",
//   "email":"momo@gmail.com",
//   "password":"123456",
//   "confirmpassword":"123456"
// }
