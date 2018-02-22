var DatabaseImport = require('../models/databaseImport');
var Directorate = require('../models/directorate');

var async = require('async');

exports.index = function(req, res){
	//let directorates;
	Directorate.all(function(err, directorates){
  		//directorates = directorates;
  		res.render('databaseImport', {title: 'Adat betöltés', directorates:directorates});
	});
	
}