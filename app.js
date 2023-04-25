const createError = require('http-errors');
const express = require('express');

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs=require('express-handlebars')
const hb=hbs.create({})
const session=require('express-session')
const mongoose = require("mongoose");
const handlebars = require("handlebars");//pagination
const env=require('dotenv').config()

// const cartCollection=require('./models/cartModel')
// const productcollection = require('./models/productmodel')

//router require 
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//engine path setted to partial
app.engine("hbs",hbs.engine({extname:"hbs",defaultLayout:"layout",layoutsDir:__dirname+"/views/layout",partialsDir:__dirname+'/views/partial'}))

hb.handlebars.registerHelper('eq', function (a, b) {
return a == b;
})
//connection of database to mongoose 
mongoose.set('strictQuery',false);
// mongoose.connect("mongodb://127.0.0.1:27017/project", {useNewUrlParser: true});
mongoose.connect(process.env.serverConnection, {useNewUrlParser: true});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session declare
// app.use(session({secret:"key",saveUninitialized:true,cookie:{maxAge:120000000},resave:false}))
app.use(session({secret:process.env.sessionKey,saveUninitialized:true,cookie:{maxAge:120000000},resave:false}))


//api setted
app.use('/', userRouter);

//admin router
app.use('/', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





// //index incrementing 

// handlebars.registerHelper("inc", function (value, options) {
//   return parseInt(value) + 1;
// });

//----------------------------pagination helpers----------------------------------------------

handlebars.registerHelper('gt', function(a, b) {
    return a > b;
  });
  handlebars.registerHelper('neq', function(a, b) {
    return a !== b;
  });
  handlebars.registerHelper('range', function(start, end) {
    const result = [];
    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    return result;
  });
  handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
  handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
  });
  handlebars.registerHelper('lt', function(a, b) {
    return a < b;
  });
  handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });
  handlebars.registerHelper('and', function() {
    var args = Array.prototype.slice.call(arguments);
    var result = true;
    for(var i = 0; i < args.length; i++) {
      if(!args[i]) {
        result = false;
        break;
      }
    }
    return result;
  });
  handlebars.registerHelper('or', function() {
    var args = Array.prototype.slice.call(arguments);
    var result = false;
  
    for (var i = 0; i < args.length; i++) {
      if (args[i]) {
        result = true;
        break;
      }
    }
  
    return result;
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('404');
});


app.listen(3000)

module.exports = app;
