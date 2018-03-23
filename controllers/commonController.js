const Directorate = require('../models/directorate');
const River = require('../models/river');
var User = require('../models/mongodb_user');

exports.directorates = async function(req, res, next){
	let directorates_array = await Directorate.all();
	req.app.locals.directorates = await Promise.all(directorates_array.map(async (d)=>{
		d.rivers = await River.findByDirectorate(d.id);
		return d;
	})); 
	next();
}

exports.user = async function(req, res, next){
	if(req.session.userId){
		//User lekérdezése
		User.getUser(req.session.userId, function (error, user) {
      		if (error || !user) {
        		var err = new Error('Session user not found!');
        		err.status = 401;
        		return next(err);
      		} else {
        		req.app.locals.user = user;
      		}
    	});
		next();
	}else{
		res.redirect('/users/login');
	}
	
}