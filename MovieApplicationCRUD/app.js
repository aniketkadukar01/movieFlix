const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const movieRouter = require('./routes/movieRoutes');
const CustomError = require('./utils/customError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config({ path: './config.env' });

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/movies', movieRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'error',
    //     message: `Invalid Route ${req.originalUrl}`
    // });

    // const err = new Error(`Invalid Route ${req.originalUrl}`);
    // err.statusCode = 404;
    // err.status = 'fail';

    const err = new CustomError(`Invalid Route ${req.originalUrl}`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;