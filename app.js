/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const errorHandler = require('./controllers/errorController');
const AppError = require('./util/appError');
const tourRout = require('./routes/toursRoutes');
const userRout = require('./routes/userRoutes');
const reviewRout = require('./routes/reviewRoutes');
const viewRout = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

app.use(express.json({ limit: '10kb' }));

//console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, try again in an hour',
});
app.use('/api', limiter);
// app.use((req,res,next)=>{
//     console.log("Hello from the middleware");
//     next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//const users = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/users.json`));
app.get('/', (req, res) => {
  res.status(200).render('base');
});
app.use('/', viewRout);
app.use('/api/v1/tours', tourRout);
app.use('/api/v1/users', userRout);
app.use('/api/v1/reviews', reviewRout);

app.all('*', (req, res, next) => {
  // const err = new Error(`can't find URL : ${req.originalUrl} on the server.`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find URL : ${req.originalUrl} on the server.`, 404));
});
app.use(errorHandler);
module.exports = app;
