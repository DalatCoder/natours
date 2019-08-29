const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Middleware body-parser
app.use(express.json());

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handle invalid URL
app.all('*', (req, res, next) => {
  // Invoke global middleware to handle error
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// Global middleware to handle error with 4 arguments
app.use(globalErrorHandler);

module.exports = app;
