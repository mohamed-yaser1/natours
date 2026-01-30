const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/apiError');
const errController = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/tourRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// if it doesnt match one of the above routes it will hit this middlewarw
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `cant find this path ${req.originalUrl}`
  // });

  ////////////////////////////////

  // const err = new Error(`cant find ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`cant find ${req.originalUrl}`), 404);
});

// Global error handling middleware
//we will seprate it into its error handler file in controller

app.use(errController);
// app.use((err,req,res,next) => {

// })

module.exports = app;
