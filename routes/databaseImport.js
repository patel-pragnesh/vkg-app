var express = require('express');
var router = express.Router();

// Require controller modules
var databaseImport_controller = require('../controllers/databaseImportController');

/* GET directorates listing. */
router.get('/', databaseImport_controller.index);

module.exports = router;