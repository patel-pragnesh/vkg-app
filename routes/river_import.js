var express = require('express');
var router = express.Router();
const common = require('../controllers/commonController');

// Require controller modules
var riverImportcontroller = require('../controllers/riverImportcontroller');

/* GET request for list of all Rivers. */
router.get('/', /*common.user,*/ riverImportcontroller.index);

/* GET request for creating a River. */
router.get('/create', /*common.user,*/ riverImportcontroller.create_get);

/* POST request for creating a River. */
router.post('/create', /*common.user,*/ riverImportcontroller.create_post);

/* GET request to update a River. */
router.get('/:id/update', /*common.user,*/ riverImportcontroller.update_get);

/* POST request to update a River. */
router.post('/:id/update', /*common.user,*/ riverImportcontroller.update_post);

/* GET request for one River. */
//router.get('/:id', common.user, modellingImportcontroller.modelling_detail);

/* GET request to update data for River. */
router.get('/:id/data', /*common.user,*/ riverImportcontroller.data_get);

/* POST request to update data for River. */
router.post('/:id/data', /*common.user,*/ riverImportcontroller.data_post);

/* GET request to delete for River. */
router.get('/:id/delete', /*common.user,*/ riverImportcontroller.meta_data_delete_get);

module.exports = router;