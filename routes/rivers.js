var express = require('express');
var router = express.Router();
const common = require('../controllers/commonController');

var river_controller = require('../controllers/riverController');

/* GET rivers listing. */
router.get('/', /*common.user,*/ river_controller.index);

/* GET request for one River. */
router.get('/:id/data-type/:data_type', /*common.user,*/ river_controller.river_detail);

/* GET river data (AJAX) */
// router.post('/data', common.user, river_controller.get_data_by_type_post)
//router.post('/data', /*common.user,*/ river_controller.get_data_by_type_post_opt)

/* GET river dataloads data by modelling (AJAX) */
router.post('/filter/time_data/dataloads/', /*common.user,*/ river_controller.get_time_data_dataloads_by_modelling_post)

/* GET river profiles by dataload (AJAX) */
router.post('/filter/time_data/profiles/', /*common.user,*/ river_controller.get_time_data_profiles_by_dataload_post)

/* GET river coordinate (AJAX) */
//router.post('/coordinates', /*common.user,*/ river_controller.get_coordinates_post)

/* GET river profile coordinate (AJAX) */
//HORCSA: Ez nem kell mert a profilok az MSSQL adatbázisból kerülnek megjelenítésre
//router.post('/profiles_coordinate', /*common.user,*/ river_controller.get_profiles_post)

/* SAVE river profile coordinate (AJAX) */
//HORCSA: Ez nem kell mert a profilok nem a térképi megjelenítés közben kerülnek tárolásra
//router.post('/profiles_coordinate_save', /*common.user,*/ river_controller.save_profile_coordinate_post)

/* GET rivers by directorate */
router.post('/directorate', /*common.user,*/ river_controller.get_by_directorate_post)

module.exports = router;
