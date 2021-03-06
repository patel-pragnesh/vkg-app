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

/* GET request to show data import for time series for Modelling. */
router.get('/:id/data_for_time', /*common.user,*/ modellingImportcontroller.data_for_time_get);

/* POST request to save data import for time series for Modelling. */
router.post('/:id/data_for_time', /*common.user,*/ modellingImportcontroller.data_for_time_post);

/* GET request to show data import for location series for Modelling. */
router.get('/:id/data_for_profile', /*common.user,*/ modellingImportcontroller.data_for_profile_get);

/* POST request to save data import for location series for Modelling. */
router.post('/:id/data_for_profile', /*common.user,*/ modellingImportcontroller.data_for_profile_post);

/* GET request to show data import for flow in for Modelling. */
router.get('/:id/data_for_flow_in_out', /*common.user,*/ modellingImportcontroller.data_for_flow_in_out_get);

/* POST request to save data import for flow in for Modelling. */
router.post('/:id/data_for_flow_in_out', /*common.user,*/ modellingImportcontroller.data_for_flow_in_out_post);

/* GET request to delete meta_data for Modelling. */
router.get('/meta_data/:id/delete', /*common.user,*/ modellingImportcontroller.meta_data_delete_get);

/* GET request to delete location_flow for Modelling. */
router.get('/location_flow/:modelling_id/:description_id/delete', /*common.user,*/ modellingImportcontroller.location_flow_delete_get);

/* GET request to delete location_flow for Modelling. */
router.get('/location_stage/:modelling_id/:description_id/delete', /*common.user,*/ modellingImportcontroller.location_stage_delete_get);

module.exports = router;