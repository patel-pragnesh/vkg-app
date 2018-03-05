var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var sql = require('mssql');

//const util = require('util');

// Directorate = require("./models/directorate");
// Modelling = require("./models/modelling");
//DatabaseHandler = require("./models/database_handler");

global.sqlConfig = {
  user: 'horcsa',
  password: 'csacsa',
  server: 'localhost\\sqlexpress',
  database: 'vizkeszlet_gazdalkodas'
}

// Modelling.all().then(result => {
//   console.log(result);
// });
//var dh = new DatabaseHandler('table1',{id: 'integer', name: 'string'});
//dh.create();
// let a;
//Directorate.findById(3).then(r => console.log(r));
// Directorate.findById(82).then(r => {
//   if(r){
//     a = r; 
//     console.log(a); 
//     a.name = "új név";
//     console.log(a);
//     a.update().then(d => console.log(d))
//   }
// });

// let ig1 = new Directorate(null, "name");
// ig1.save().then(result => ig1 = result);
// ig1.save().then(result => {ig1 = result;console.log(ig1);});

var index = require('./routes/index');
var users = require('./routes/users');
var directorates = require('./routes/directorates');
var databaseImport = require('./routes/databaseImport');

var app = express();

//app.set('models', require('./models'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/directorates', directorates);
app.use('/databaseImport', databaseImport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
