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
const DataMeta = require('../models/data_meta');
const LocationFlow = require('../models/location_flow');
const LocationStage = require('../models/location_stage');
const Description = require('../models/description');

const DataLoader = require('../logic/dataloader');
const DataForProfileLoader = require('../logic/dataforprofileloader');

exports.index = async function(req, res, next){
	let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let modellings_page = null;
    let page_count = 0;
    let modellings = await Modelling.all();
    if(modellings){
        page_count = modellings.length/countPerPage;
        modellings_page = modellings.slice(page*countPerPage, page * countPerPage + countPerPage);
    }
    res.render('modelling_import/index', {title: 'Adatbetöltések', modellings: modellings_page, page_count: page_count});
	
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
            res.render('modelling_import/create', { title: 'Új modellezés', modelling: req.body, rivers: rivers, errors: errors.array() });
            return;
        }
        else {
            //Modellezés mentése
			//console.log(req.body.name);
            const m = new Modelling(null,req.body.name,req.body.description,req.body.date_for,req.body.river_id);
            await m.save();
			//Modellezések megjelenítése
			let countPerPage = 15;
			let page = req.query.page ? req.query.page - 1 : 0;
			let modellings = await Modelling.all();
            let page_count = modellings.length/countPerPage;
            //console.log(page_count);
			let modellings_page = modellings.slice(page*countPerPage, page * countPerPage + countPerPage);
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
            //console.log(errors.array());
            let rivers = null;
            if(req.body.directorate)
                rivers = await River.findByDirectorate(req.body.directorate);
            res.render('modelling_import/create', { title: 'Új modellezés', modelling: req.body, rivers: rivers, errors: errors.array() });
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
            // let modellings_page = modellings.slice(page*countPerPage, page * countPerPage + countPerPage);
            res.redirect('/modelling_import');
        }
    }
];

exports.modelling_detail = async function(req, res, next){
    res.send('TODO Modelling details page');
}

//Idősor adatok betöltés megjelenítés
exports.data_for_time_get = async function(req, res, next){

    let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    //console.log('page:' + page);
    let meta_datas = await DataMeta.findByModelling(req.params.id);
    let page_count = meta_datas ? meta_datas.length/countPerPage : 0;
    //console.log('page_count: '+page_count)
    let meta_datas_page = meta_datas ? meta_datas.slice(page*countPerPage, page * countPerPage + countPerPage) : [];
    

    const m = await Modelling.findById(req.params.id);
    const form_link = "/modelling_import/"+m.id+"/data_for_time";
    const data_type = "data_for_time"
    res.render('modelling_import/data', { title: 'Modellezés vízhozam, vízszint adatok', modelling: m, 
        form_link: form_link, meta_datas: meta_datas_page, page_count: page_count,
        data_type:data_type });
}

//Idősor adatok betöltés mentés
exports.data_for_time_post = async function(req, res, next){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let modelling = fields.modelling;
      let user_description = fields.user_description;
      let oldpath = files.fileUploaded.path;
      let oldFileName = files.fileUploaded.name;
      let oldFileNameArray = oldFileName.split('.');
      oldFileNameArray.pop();
      let newFileName = oldFileNameArray.join('.');
      let newpath = __dirname +'/../public/DSS/' + newFileName + '_' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.csv';
      mv(oldpath, newpath, async function(err){
        console.log('File moved...');
        let dataloader = new DataLoader(newpath);
        await dataloader.readFile();
        await dataloader.saveData(modelling,user_description+' '+moment().format("YYYY-MM-DD_HHmmssSSS"));
        console.log('ok');
        res.redirect('/modelling_import/'+modelling+'/data_for_time');
      });
    });
    
}

//Szelvény adatok betöltés megjelenítés
exports.data_for_profile_get = async function(req, res, next){

    let countPerPage = 15;
    let page_count = 0;
    let page = req.query.page ? req.query.page - 1 : 0;
    let location_flows = await LocationFlow.findByModellingGroupByUserDescription(req.params.id);
    //let location_flows = [];
    let location_stages = await LocationStage.findByModellingGroupByUserDescription(req.params.id);
    // let location_stages = [];
    let locations = [];
    if(location_flows){
        locations = location_flows.concat(location_stages);
    }else{
        locations = location_stages;
    }
    
    let locations_page = [];
    //console.log(locations);
    if(locations){
        page_count = locations.length/countPerPage;
        locations_page = locations.slice(page*countPerPage, page * countPerPage + countPerPage);
        //console.log(locations_page);
    } 

    const m = await Modelling.findById(req.params.id);
    const form_link = "/modelling_import/"+m.id+"/data_for_profile";
    const data_type = "data_for_profile"
    res.render('modelling_import/data', { title: 'Modellezés hossz-szelvény adatok', 
        modelling: m, form_link: form_link, locations_page: locations_page, 
        page_count: page_count, data_type:data_type });
}

//Szelvény adatok betöltés mentés
exports.data_for_profile_post = async function(req, res, next){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let modelling = fields.modelling;
      let user_description = fields.user_description;
      let oldpath = files.fileUploaded.path;
      let oldFileName = files.fileUploaded.name;
      let oldFileNameArray = oldFileName.split('.');
      oldFileNameArray.pop();
      let newFileName = oldFileNameArray.join('.');
      let newpath = __dirname +'/../public/DATAPROFILE/' + newFileName + ' ' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.csv';
      mv(oldpath, newpath, async function(err){
        console.log('File moved to ' + newpath);
        let dataloader = new DataForProfileLoader(newpath);
        let success_file_read = await dataloader.readFile();
        if(success_file_read){
            //Betöltés elindítás, de a klinesnek a hosszú idő miatt nem kell megvárni...
            let description = new Description(null, user_description+'_'+moment().format("YYYY-MM-DD_HHmmssSSS"), null, null, null, null);
            description = await description.save();
            await dataloader.saveData(modelling, description.id);
            console.log('Data is inserted to db.'); 
            res.redirect('/modelling_import/'+modelling+'/data_for_profile');
        }else{
            console.log('Error reading file.');
            res.redirect('/modelling_import/'+modelling+'/data_for_profile?error=error_loading_data');
        }
            
      });
    });
    
}

//Vízbeeresztés adatok betöltés megjelenítés
exports.data_for_flow_in_get = async function(req, res, next){

    let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let meta_datas = await DataMeta.findByModellingByType(req.params.id, 'FLOWIN');
    let page_count = meta_datas ? meta_datas.length/countPerPage : 0;
    let meta_datas_page = meta_datas ? meta_datas.slice(page*countPerPage, page * countPerPage + countPerPage) : [];

    const m = await Modelling.findById(req.params.id);
    const form_link = "/modelling_import/"+m.id+"/data_for_flow_in";
    const data_type = "data_for_flow_in"
    res.render('modelling_import/data', { title: 'Modellezés vízbeeresztés adatok', modelling: m, 
        form_link: form_link, meta_datas: meta_datas_page, page_count: page_count,
        data_type:data_type });
}

//Vízbeeresztés adatok betöltés mentés
exports.data_for_flow_in_post = async function(req, res, next){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let modelling = fields.modelling;
      let user_description = fields.user_description;
      let oldpath = files.fileUploaded.path;
      let oldFileName = files.fileUploaded.name;
      let oldFileNameArray = oldFileName.split('.');
      oldFileNameArray.pop();
      let newFileName = oldFileNameArray.join('.');
      let newpath = __dirname +'/../public/DSS/' + newFileName + '_' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.csv';
      mv(oldpath, newpath, async function(err){
        console.log('File moved...');
        let dataloader = new DataLoader(newpath);
        await dataloader.readFile();
        await dataloader.saveDataFlowInFlowOut(modelling,user_description+' '+moment().format("YYYY-MM-DD_HHmmssSSS"),true);
        console.log('ok');
        res.redirect('/modelling_import/'+modelling+'/data_for_flow_in');
      });
    });
}

//Vízkivétel adatok betöltés megjelenítés
exports.data_for_flow_out_get = async function(req, res, next){

    let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let meta_datas = await DataMeta.findByModellingByType(req.params.id, 'FLOWOUT');
    let page_count = meta_datas ? meta_datas.length/countPerPage : 0;
    let meta_datas_page = meta_datas ? meta_datas.slice(page*countPerPage, page * countPerPage + countPerPage) : [];

    const m = await Modelling.findById(req.params.id);
    const form_link = "/modelling_import/"+m.id+"/data_for_flow_out";
    const data_type = "data_for_flow_out"
    res.render('modelling_import/data', { title: 'Modellezés vízkivétel adatok', modelling: m, 
        form_link: form_link, meta_datas: meta_datas_page, page_count: page_count,
        data_type:data_type });
}

//Vízkivétel adatok betöltés mentés
exports.data_for_flow_out_post = async function(req, res, next){
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      let modelling = fields.modelling;
      let user_description = fields.user_description;
      let oldpath = files.fileUploaded.path;
      let oldFileName = files.fileUploaded.name;
      let oldFileNameArray = oldFileName.split('.');
      oldFileNameArray.pop();
      let newFileName = oldFileNameArray.join('.');
      let newpath = __dirname +'/../public/DSS/' + newFileName + '_' + moment().format("YYYY-MM-DD_HHmmssSSS") + '.csv';
      mv(oldpath, newpath, async function(err){
        console.log('File moved...');
        let dataloader = new DataLoader(newpath);
        await dataloader.readFile();
        await dataloader.saveDataFlowInFlowOut(modelling,user_description+' '+moment().format("YYYY-MM-DD_HHmmssSSS"),false);
        console.log('ok');
        res.redirect('/modelling_import/'+modelling+'/data_for_flow_out');
      });
    });
}

exports.meta_data_delete_get = async function(req, res, next){
    let meta_data = await DataMeta.findById(req.params.id);
    let modelling_id = meta_data.modelling_id;
    meta_data.delete();
    res.redirect('/modelling_import/'+modelling_id+'/data_for_time');
}

exports.location_flow_delete_get = async function(req, res, next){
    let modelling_id = req.params.modelling_id;
    let description_id = req.params.description_id;
    await LocationFlow.deleteByDescriptionId(description_id);
    await Description.deleteById(description_id);
    res.redirect('/modelling_import/'+modelling_id+'/data_for_profile');
}

exports.location_stage_delete_get = async function(req, res, next){    
    let modelling_id = req.params.modelling_id;
    let description_id = req.params.description_id;
    console.log('Deleting location-stage by description_id: ' + description_id);
    await LocationStage.deleteByDescriptionId(description_id);
    await Description.deleteById(description_id);
    res.redirect('/modelling_import/'+modelling_id+'/data_for_profile');
}