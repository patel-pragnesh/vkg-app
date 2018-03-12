const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');
const moment = require('moment');
moment.locale('hu');

const Directorate = require('../models/directorate');
const Modelling = require('../models/modelling');
const River = require('../models/river');

const DataLoader = require('../logic/dataloader');

exports.index = async function(req, res, next){
	let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let modellings = await Modelling.all();
    let page_count = modellings.length/countPerPage;
    let modellings_page = modellings.slice(page, page + countPerPage);
    res.render('modelling_import/index', {title: 'Modellezések', modellings: modellings_page, page_count: page_count});
	
}

exports.create_get = async function(req, res, next){
    let form_link = "/modelling_import/create";
	res.render('modelling_import/create', {title: 'Új modellezés', form_link: form_link});
}

exports.create_post = [

	// Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
        // .isAlphanumeric('hu-HU').withMessage('Name has non-alphanumeric characters.'),
    body('description').isLength({ min: 1 }).trim().withMessage('A leírás megadása kötelező'),
    body('date_for').isLength({ min: 1 }).trim().withMessage('A modellezés időszakának megadása kötelező'),
    body('river_id').isInt({ min: 0 }).trim().withMessage('Vízfolyás választása kötelező'),
    body('directorate').isInt({ min: 0 }).trim().withMessage('Igazgatóság választása'),

    async (req, res, next) =>{

    	// Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            let rivers = null;
            if(req.body.directorate)
                rivers = await River.findByDirectorate(req.body.directorate);
            res.render('modelling_import/new', { title: 'Új modellezés', modelling: req.body, rivers: rivers, errors: errors.array() });
            return;
        }
        else {
            //Modellezés mentése
			console.log(req.body.name);
            const m = new Modelling(null,req.body.name,req.body.description,req.body.date_for,req.body.river);
            await m.save();
			//Modellezések megjelenítése
			let countPerPage = 15;
			let page = req.query.page ? req.query.page - 1 : 0;
			let modellings = await Modelling.all();
            let page_count = modellings.length/countPerPage;
            console.log(page_count);
			let modellings_page = modellings.slice(page, page + countPerPage);
		  	res.render('modelling_import/index', {title: 'Modellezések', modellings: modellings_page, page_count: page_count});
        }
    }
];

exports.update_get = async function(req, res, next){
    const m = await Modelling.findById(req.params.id);
    //console.log(m);
    const rivers = await River.findByDirectorate(m.directorate);
    const form_link = "/modelling_import/"+m.id+"/update";
    res.render('modelling_import/create', { title: 'Modellezés módosíítás', modelling: m, rivers: rivers, form_link: form_link });
}

exports.update_post = [

    // Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
        // .isAlphanumeric('hu-HU').withMessage('Name has non-alphanumeric characters.'),
    body('description').isLength({ min: 1 }).trim().withMessage('A leírás megadása kötelező'),
    body('date_for').isLength({ min: 1 }).trim().withMessage('A modellezés időszakának megadása kötelező'),
    body('river_id').isInt({ min: 0 }).trim().withMessage('Vízfolyás választása kötelező'),
    body('directorate').isInt({ min: 0 }).trim().withMessage('Igazgatóság választása'),

    async (req, res, next) =>{

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            let rivers = null;
            if(req.body.directorate)
                rivers = await River.findByDirectorate(req.body.directorate);
            res.render('modelling_import/new', { title: 'Új modellezés', modelling: req.body, rivers: rivers, errors: errors.array() });
            return;
        }
        else {
            //Modellezés mentése
            const m = await Modelling.findById(req.body.id);
            m.name = req.body.name;
            m.description = req.body.description;
            m.date_for = req.body.date_for;
            m.river_id = req.body.river_id;
            await m.update();

            //Modellezések megjelenítése
            // let countPerPage = 15;
            // let page = req.query.page ? req.query.page - 1 : 0;
            // let modellings = await Modelling.all();
            // let page_count = modellings.length/countPerPage;
            // let modellings_page = modellings.slice(page, page + countPerPage);
            res.redirect('/modelling_import');
        }
    }
];

exports.modelling_detail = async function(req, res, next){
    res.send('TODO Modelling details page');
}

exports.data_get = async function(req, res, next){
    const m = await Modelling.findById(req.params.id);
    const form_link = "/modelling_import/"+m.id+"/data";
    res.render('modelling_import/data', { title: 'Modellezés adatbetöltés', modelling: m, form_link: form_link });
}

exports.data_post = async function(req, res, next){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let oldpath = files.fileUploaded.path;
      let oldFileName = files.fileUploaded.name;
      let oldFileNameArray = oldFileName.split('.');
      oldFileNameArray.pop();
      let newFileName = oldFileNameArray.join('.');
      let newpath = __dirname +'/../public/DSS/' + newFileName + '_' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.csv';
      mv(oldpath, newpath, function(err){
        console.log('File moved...');
        let dataloader = new DataLoader(newpath);
        dataloader.readFile();
      });
    });
    res.send('TODO Modelling data import page');
}