var express = require('express');
var router = express.Router();

var directorate_controller = require('../controllers/directorateController');

/* GET directorates listing. */
router.get('/', directorate_controller.index);

module.exports = router;
