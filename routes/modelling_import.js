var express = require('express');
var router = express.Router();
const common = require('../controllers/commonController');

// Require controller modules
var modellingImportcontroller = require('../controllers/modellingImportcontroller');

/* GET request for list of all Modellings. */
router.get('/', /*common.user,*/ modellingImportcontroller.index);

/* GET request for creating a Modelling. */
router.get('/create', /*common.user,*/ modellingImportcontroller.create_get);

/* POST request for creating a Modelling. */
router.post('/create', /*common.user,*/ modellingImportcontroller.create_post);

/* GET request to update a Modelling. */
router.get('/:id/update', /*common.user,*/ modellingImportcontroller.update_get);

/* POST request to update a Modelling. */
router.post('/:id/update', /*common.user,*/ modellingImportcontroller.update_post);

/* GET request for one Modelling. */
router.get('/:id', /*common.user,*/ modellingImportcontroller.modelling_detail);

/* GET request to update data for Modelling. */
router.get('/:id/data', /*common.user,*/ modellingImportcontroller.data_get);

/* POST request to update data for Modelling. */
router.post('/:id/data', /*common.user,*/ modellingImportcontroller.data_post);

/* GET request to delete meta_data for Modelling. */
router.get('/meta_data/:id/delete', /*common.user,*/ modellingImportcontroller.meta_data_delete_get);

module.exports = router;