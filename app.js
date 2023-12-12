var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// import the sequelize instance 
var { sequelize } = require('./models');

var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', booksRouter);

// testing connection to database
sequelize.authenticate()
  .then(() => {
    console.log("Connection established")
    // syncing models
    return sequelize.sync()
  })
  .then(() => {
    console.log('Models are synced correctly')
  })
  .catch(err => {
    console.log('Unable to sync to the database', err)
  })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // Create a new error object with a 404 status and a friendly message
  const err = new Error('The requested page could not be found');
  err.status = 404;
  
  // Render 'page-not-found' view, passing the error object
  res.status(404).render('page-not-found', { error: err });
});


// error handler
app.use(function(err, req, res, next) {
  // If there's no status code on the error, set it to 500
  if (!err.status) {
    err.status = 500;
  }
  // If there's no custom message, set a default message
  if (!err.message || err.status === 500) {
    err.message = 'An unexpected error occurred on the server';
  }

  console.error(`Error (${err.status}): ${err.message}`);

  // set locals, only providing error in development
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status).render('error', { error: err });
});

module.exports = app;
