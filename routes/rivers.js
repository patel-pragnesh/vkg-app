var express = require('express');
var router = express.Router();
const common = require('../controllers/commonController');

var river_controller = require('../controllers/riverController');

/* GET rivers listing. */
router.get('/', common.user, river_controller.index);

/* GET request for one Modelling. */
router.get('/:id/data-type/:data_type', common.user, river_controller.river_detail);

/* GET river data (AJAX) */
// router.post('/data', common.user, river_controller.get_data_by_type_post)
router.post('/data', common.user, river_controller.get_data_by_type_post_opt)

/* GET rivers by directorate */
router.post('/directorate', common.user, river_controller.get_by_directorate_post)

module.exports = router;
