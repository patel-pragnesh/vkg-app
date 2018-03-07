var express = require('express');
var router = express.Router();

var river_controller = require('../controllers/riverController');

/* GET rivers listing. */
router.get('/', river_controller.index);

/* GET rivers by directorate */
router.post('/directorate', river_controller.get_by_directorate_post)

module.exports = router;
