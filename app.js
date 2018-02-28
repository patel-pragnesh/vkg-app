var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var sql = require('mssql');

//const util = require('util');

Directorate = require("./models/directorate");
//DatabaseHandler = require("./models/database_handler");

global.sqlConfig = {
  user: 'horcsa',
  password: 'csacsa',
  server: 'localhost\\sqlexpress',
  database: 'vizkeszlet_gazdalkodas'
}

//var dh = new DatabaseHandler('table1',{id: 'integer', name: 'string'});
//dh.create();

// sql.connect(global.sqlConfig, function(err){
//   if(err){
//     console.log('Failed to connect to SQL server.');
//   }else{
//     console.log('Connected to SQL server!');
//   }
// });

var ig1 = new Directorate("VALAMI");
//console.log(ig1.name);
ig1.save();
//console.log(util.inspect(ig1, false, null));
//console.log(ig1.get('name')+', '+ig1.get('id'));
//console.log(Directorate.getTotalObjects());
// Directorate.findById(4, function(err, directorate){
//   if(err)
//     console.log(err);
//   else
//     if(directorate)
//       console.log(directorate.get('name'));
//     else
//       console.log('No result for id: 1');
// });

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
