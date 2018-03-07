const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const Directorate = require('../models/directorate');
const Modelling = require('../models/modelling');
const River = require('../models/river');

exports.index = async function(req, res, next){
	let countPerPage = 15;
    let page = req.query.page ? req.query.page - 1 : 0;
    let modellings = await Modelling.all();
    let page_count = modellings.length/countPerPage;
    let modellings_page = modellings.slice(page, page + countPerPage);
  	res.render('modelling_import/index', {title: 'Modellezések', modellings: modellings_page, page_count: page_count});
	
}

exports.create_get = async function(req, res, next){
	res.render('modelling_import/new', {title: 'Új modellezés'});
}

exports.create_post = [

	// Validate fields.
    body('name').isLength({ min: 1 }).trim().withMessage('A megnevezés megadása kötelező'),
        // .isAlphanumeric('hu-HU').withMessage('Name has non-alphanumeric characters.'),
    body('description').isLength({ min: 1 }).trim().withMessage('A leírás megadása kötelező'),
    body('date_for').isLength({ min: 1 }).trim().withMessage('A modellezés időszakának megadása kötelező'),
    body('river').isInt({ min: 0 }).trim().withMessage('Vízfolyás választása kötelező'),
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

exports.edit_get = async function(req, res, next){
    const m = await Modelling.findById(req.params.id);
    const rivers = await River.findByDirectorate(10);
    res.render('modelling_import/new', { title: 'Modellezés módosíítás', modelling: m, rivers: rivers });
}