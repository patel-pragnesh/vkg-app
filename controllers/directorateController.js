var Directorate = require('../models/directorate');

var async = require('async');

exports.index = function(req, res){

	Directorate.all(function(err, directorates){
		res.render('directorate', {title: 'Igazgatóságok', data: directorates});
	});
	// async.parallel({
	// 	directorates: function(){
	// 		console.log('valami');
	// 		Directorate.all();
	// 	}
	// }, function(err, results){
	// 	console.log(err);
	// 	res.render('directorate', {title: 'Igazgatóságok', data: results.directorates});
	// });

	
}