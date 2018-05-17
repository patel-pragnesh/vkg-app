var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var sql = require('mssql');
var mongoose = require('mongoose');
var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);

//const util = require('util');

// Directorate = require("./models/directorate");
DataMeta = require("./models/data_meta");
// Modelling = require("./models/modelling");
//DatabaseHandler = require("./models/database_handler");

global.sqlConfig = {
  user: 'horcsa',
  password: 'csacsa',
  server: 'localhost\\sqlexpress',
  database: 'vizkeszlet_gazdalkodas',
  connectionTimeout: 300000,
  requestTimeout: 300000
}

const common = require('./controllers/commonController');
const index = require('./routes/index');
const users = require('./routes/users');
const directorates = require('./routes/directorates');
const rivers = require('./routes/rivers');
const modelling_import = require('./routes/modelling_import');
const river_import = require('./routes/river_import');
const test = require('./routes/test');

var app = express();

//Set up mongoose connection
var mongoDB = 'mongodb://localhost:27017/vizkeszlet_gazdalkodas';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//app.set('models', require('./models'));

//TESZT
// DataMeta.findByDate(12, 'FLOW', '2000-01-01 00:00:00', '2000-01-02 09:00:00').then(function(d){
//     console.log(d);
//   });



//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  // store: new MongoStore({
  //   mongooseConnection: db
  // })
}));

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

//TODO: Windows commit
app.use(common.directorates);


//app.all('*',common.user);

app.use('/', index);
app.use('/users', users);
app.use('/directorates', directorates);
app.use('/rivers', rivers);
app.use('/modelling_import', modelling_import);
app.use('/river_import', river_import);
app.use('/test', test);

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
