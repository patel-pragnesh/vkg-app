var express = require('express');
var router = express.Router();

// Require controller modules
var modellingImportcontroller = require('../controllers/modellingImportcontroller');

/* GET request for list of all Modellings. */
router.get('/', modellingImportcontroller.index);

/* GET request for creating a Modelling. */
router.get('/create', modellingImportcontroller.create_get);

/* POST request for creating a Modelling. */
router.post('/create', modellingImportcontroller.create_post);

/* GET request to update a Modelling. */
router.get('/:id/update', modellingImportcontroller.update_get);

/* POST request to update a Modelling. */
router.post('/:id/update', modellingImportcontroller.update_post);

/* GET request for one Modelling. */
router.get('/:id', modellingImportcontroller.modelling_detail);

/* GET request to update data for Modelling. */
router.get('/:id/data', modellingImportcontroller.data_get);

/* POST request to update data for Modelling. */
router.post('/:id/data', modellingImportcontroller.data_post);

module.exports = router;