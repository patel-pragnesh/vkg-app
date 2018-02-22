var express = require('express');
var router = express.Router();

var Directorate = require('../models/directorate');

/* GET home page. */
router.get('/', function(req, res, next) {
	Directorate.all(function(err, directorates){
  		res.render('index', { title: 'Igazgatóságok', directorates: directorates });
	});
});

module.exports = router;
