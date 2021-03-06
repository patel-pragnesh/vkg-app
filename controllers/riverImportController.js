const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');
const moment = require('moment');
moment.locale('hu');

const Directorate = require('../models/directorate');
// const Modelling = require('../models/modelling');
const River = require('../models/river');
const Profile = require('../models/profile');
// const DataMeta = require('../models/data_meta');

const KmlLoader = require('../logic/kmlloader');
const ProfileLoader = require('../logic/profileloader');

exports.index = async function(req, res, next){
	let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let page_count = 0;
    let rivers_page = null
    let rivers = await River.all();
    if(rivers){
        page_count = rivers.length/countPerPage;
        rivers_page = rivers.slice(page*countPerPage, page * countPerPage + countPerPage);
    }
    res.render('river_import/index', {title: 'Modellterületek', rivers: rivers_page, page_count: page_count});
	
}

exports.create_get = async function(req, res, next){
    let form_link = "/river_import/create";
	res.render('river_import/create', {title: 'Új modellterület', form_link: form_link});
}

exports.create_post = [

	// Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
        // .isAlphanumeric('hu-HU').withMessage('Name has non-alphanumeric characters.'),
    body('directorate').isInt({ min: 0 }).trim().withMessage('Igazgatóság választása kötelező'),

    async (req, res, next) =>{

    	// Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('river_import/create', { title: 'Új modellezés', river: req.body, errors: errors.array() });
            return;
        }
        else {
            //Modellezés mentése
			//console.log(req.body.name);
            const r = new River(null,req.body.name,req.body.directorate);
            await r.save();
			//Modellezések megjelenítése
			let countPerPage = 15;
			let page = req.query.page ? req.query.page - 1 : 0;
			let rivers = await River.all();
            let page_count = rivers.length/countPerPage;
			let rivers_page = rivers.slice(page*countPerPage, page * countPerPage + countPerPage);
		  	res.render('river_import/index', {title: 'Modellterületek', rivers: rivers_page, page_count: page_count});
        }
    }
];

exports.update_get = async function(req, res, next){
    const r = await River.findById(req.params.id);
    const form_link = "/river_import/"+r.id+"/update";
    res.render('river_import/create', { title: 'Modellterület módosítás', river: r, form_link: form_link });
}

exports.update_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
        // .isAlphanumeric('hu-HU').withMessage('Name has non-alphanumeric characters.'),
    body('directorate').isInt({ min: 0 }).trim().withMessage('Igazgatóság választása'),

    async (req, res, next) =>{

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('river_import/create', { title: 'Vízfolyás módosítás', river: req.body, errors: errors.array() });
            return;
        }
        else {
            //Modellezés mentése
            const r = await River.findById(req.body.id);
            r.name = req.body.name;
            r.directorate_id = req.body.directorate;
            await r.update();

            //Modellezések megjelenítése
            // let countPerPage = 15;
            // let page = req.query.page ? req.query.page - 1 : 0;
            // let modellings = await Modelling.all();
            // let page_count = modellings.length/countPerPage;
            // let modellings_page = modellings.slice(page*countPerPage, page * countPerPage + countPerPage);
            res.redirect('/river_import');
        }
    }
];

exports.modelling_detail = async function(req, res, next){
    res.send('TODO Modelling details page');
}

// exports.data_get = async function(req, res, next){
//     const r = await River.findById(req.params.id);
//     const form_link = "/river_import/"+r.id+"/data";
//     res.render('river_import/data', { title: 'Vízfolyás adatok', river: r, form_link: form_link});
// }

// exports.data_post = async function(req, res, next){
//     let form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       let river = fields.river;
//       let oldpath = files.fileUploaded.path;
//       let oldFileName = files.fileUploaded.name;
//       let oldFileNameArray = oldFileName.split('.');
//       oldFileNameArray.pop();
//       let newFileName = oldFileNameArray.join('.');
//       let newpath = __dirname +'/../public/KML/' + newFileName + '_' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.kml';
//       mv(oldpath, newpath, async function(err){
//         console.log('File moved...');
//         let kmlloader = new KmlLoader(newpath);
//         await kmlloader.readFile();
//         await kmlloader.saveData(river);
//         console.log('ok');
//         res.redirect('/river_import/'+river+'/data');
//       });
//     });
    
// }

exports.profiles_get = async function(req, res, next){
    const river = await River.findById(req.params.id);
    const form_link = "/river_import/"+r.id+"/profiles";
    res.render('river_import/data', { title: 'Vízfolyás profil adatok', river: river, form_link: form_link});
}

exports.profiles_post = async function(req, res, next){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let river = fields.river;
      let oldpath = files.fileUploaded.path;
      let oldFileName = files.fileUploaded.name;
      let oldFileNameArray = oldFileName.split('.');
      oldFileNameArray.pop();
      let newFileName = oldFileNameArray.join('.');
      let newpath = __dirname +'/../public/PROFILES/' + newFileName + '_' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.kml';
      mv(oldpath, newpath, async function(err){
        console.log('File moved...');
        let profileloader = new ProfileLoader(newpath);
        await profileloader.readFile();
        await profileloader.saveData(river);
        console.log('ok');
        res.redirect('/river_import/'+river+'/profiles');
      });
    });
    
}

exports.reach_create_get = async function(req, res, next){
    let parent_river_id = req.params.id;

    // Szülő vízfolyás lekérdezése
    //const parent_river = await River.findById(parent_river_id);

    // Szülő vízfolyás profilok lekérdezése
    const parent_river_profiles = await Profile.findByRiver(parent_river_id);

    let form_link = "/river_import/"+parent_river_id+"/reach/create";

	res.render('river_import/reach', {title: 'Új reach', form_link: form_link, parent_river_id:parent_river_id, parent_river_profiles: parent_river_profiles});
}

exports.reach_create_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
    body('parent_connect_profile').isInt(body.new_or_exists == 'exists' ? { min: 1 } : { min: -1}).trim().withMessage('Szelvény választása kötelező'),
    body('parent_connect_profile_name').isLength(body.new_or_exists == 'new' ? { min: 1 } : { min: 0}).trim().withMessage('Szelvény megadása kötelező'),

    async (req, res, next) =>{
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        console.log(req.body);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            console.log(errors.array());
            // Szülő vízfolyás profilok lekérdezése
            const parent_river_profiles = await Profile.findByRiver(req.body.parent_river_id);

            res.render('river_import/reach', { title: 'Új reach', river: req.body, parent_river_profiles:parent_river_profiles, errors: errors.array() });
            return;
        }
        else {
            // //Modellezés mentése
            // const r = new River(null,req.body.name,req.body.directorate);
            // await r.save();

            // //Modellezések megjelenítése
            // let countPerPage = 15;
            // let page = req.query.page ? req.query.page - 1 : 0;
            // let rivers = await River.all();
            // let page_count = rivers.length/countPerPage;
            // let rivers_page = rivers.slice(page*countPerPage, page * countPerPage + countPerPage);
            res.render('river_import/index', {title: 'Modellterületek', rivers: rivers_page, page_count: page_count});
        }
    }
    
]

exports.reach_update_get = async function(req, res, next){

}

exports.reach_update_post = async function(req, res, next){
    
}

exports.meta_data_delete_get = async function(req, res, next){
    // let meta_data = await DataMeta.findById(req.params.id);
    // let modelling_id = meta_data.modelling_id;
    // meta_data.delete();
    // res.redirect('/modelling_import/'+modelling_id+'/data');
}