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
// const DataMeta = require('../models/data_meta');

const KmlLoader = require('../logic/kmlloader');
const ProfileLoader = require('../logic/profileloader');

exports.index = async function(req, res, next){
	let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let rivers = await River.all();
    let page_count = rivers.length/countPerPage;
    let rivers_page = rivers.slice(page, page + countPerPage);
    res.render('river_import/index', {title: 'Vízfolyások', rivers: rivers_page, page_count: page_count});
	
}

exports.create_get = async function(req, res, next){
    let form_link = "/river_import/create";
	res.render('river_import/create', {title: 'Új vízfolyás', form_link: form_link});
}

exports.create_post = [

	// Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
        // .isAlphanumeric('hu-HU').withMessage('Name has non-alphanumeric characters.'),
    body('directorate').isInt({ min: 0 }).trim().withMessage('Igazgatóság választása'),

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
			console.log(req.body.name);
            const r = new River(null,req.body.name,req.body.directorate);
            await r.save();
			//Modellezések megjelenítése
			let countPerPage = 15;
			let page = req.query.page ? req.query.page - 1 : 0;
			let rivers = await River.all();
            let page_count = rivers.length/countPerPage;
			let rivers_page = rivers.slice(page, page + countPerPage);
		  	res.render('river_import/index', {title: 'Vízfolyások', rivers: rivers_page, page_count: page_count});
        }
    }
];

exports.update_get = async function(req, res, next){
    const r = await River.findById(req.params.id);
    const form_link = "/river_import/"+r.id+"/update";
    res.render('river_import/create', { title: 'Vízfolyás módosíítás', river: r, form_link: form_link });
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
            // let modellings_page = modellings.slice(page, page + countPerPage);
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
    const r = await River.findById(req.params.id);
    const form_link = "/river_import/"+r.id+"/profiles";
    res.render('river_import/data', { title: 'Vízfolyás profil adatok', river: r, form_link: form_link});
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

exports.meta_data_delete_get = async function(req, res, next){
    // let meta_data = await DataMeta.findById(req.params.id);
    // let modelling_id = meta_data.modelling_id;
    // meta_data.delete();
    // res.redirect('/modelling_import/'+modelling_id+'/data');
}