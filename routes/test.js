var express = require('express');
var router = express.Router();

var test_controller = require('../controllers/testController');

/* GET users listing. */
router.get('/', test_controller.index);

module.exports = router;
