var express = require('express');
var router = express.Router();
const common = require('../controllers/commonController');

var Directorate = require('../models/directorate');

/* GET home page. */
router.get('/', /*common.user,*/ async function(req, res, next) {
	res.render('index_google_maps', { title: 'Igazgatóságok'});
});

module.exports = router;
