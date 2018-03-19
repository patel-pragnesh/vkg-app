const Directorate = require('../models/directorate');
const River = require('../models/river');

exports.directorates = async function(req, res, next){
	let directorates_array = await Directorate.all();
	req.app.locals.directorates = await Promise.all(directorates_array.map(async (d)=>{
		d.rivers = await River.findByDirectorate(d.id);
		return d;
	})); 
	next();
}