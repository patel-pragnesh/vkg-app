const Directorate = require('../models/directorate');

exports.directorates = async function(req, res, next){
	req.app.locals.directorates = await Directorate.all();
	next();
}