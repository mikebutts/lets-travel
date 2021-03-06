require('dotenv').config();
var createError = require('http-errors');
var express = require('express')    
  ,flash = require('connect-flash')
  ,session = require('express-session')
  ,toastr = require('express-toastr');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//setup mongoose connect
mongoose.connect(process.env.DB);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => console.error(error.message));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

// Load express-toastr
// You can pass an object of default options to toastr(), see example/index.coffee
app.use(toastr());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(function (req, res, next)
{
    res.locals.toasts = req.toastr.render()
    next()
});
app.use((req, res, next)=> {
  res.locals.url = req.path
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
