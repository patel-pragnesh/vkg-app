const moment = require('moment');
moment.locale('hu');

exports.index = function(req, res, next){
	// res.send('TODO: test');
	// function newDate(days) {
 //            return moment().add(days, 'd').toDate();
 //    }
 //    function newDateString(days) {
 //        return moment().add(days, 'd').format();
 //    }
 	let days = 1;
 	let date = moment().add(days, 'd').format();
 	console.log(date)
	let Data = "TODO"
	res.render('_test/index', {title: 'Test', data: Data});
}