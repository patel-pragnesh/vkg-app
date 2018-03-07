var express = require('express');
var router = express.Router();

// Require controller modules
var modellingImportcontroller = require('../controllers/modellingImportcontroller');

/* GET directorates listing. */
router.get('/modelling', modellingImportcontroller.index);
router.get('/modelling/create', modellingImportcontroller.create_get);
router.post('/modelling/create', modellingImportcontroller.create_post);
router.get('/modelling/edit/:id', modellingImportcontroller.edit_get);

module.exports = router;