var express = require('express');
var router = express.Router();

var igazgatosag_controller = require('../controllers/igazgatosagController');

/* GET users listing. */
// router.get('/', igazgatosag_controller.list);
router.get('/', function(req, res, next) {

	// igazgatosag_controller.list().then(function(result){
	// 	console.log(result);
	// })
	igazgatosag_controller.list.then(function(value){
		res.render('igazgatosag', {data: value});
	})
  	
});

module.exports = router;