var express = require('express');
var router = express.Router();

var Directorate = require('../models/directorate');

/* GET home page. */
router.get('/', async function(req, res, next) {
	res.render('index', { title: 'Igazgatóságok'});
});

module.exports = router;
