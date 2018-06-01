const uniqid = require('uniqid');
var cluster = require('cluster');
const Directorate = require('../models/directorate');
const River = require('../models/river');
var User = require('../models/user');

exports.directorates = async function(req, res, next){
	//console.log('Getting all directorates...');
	let directorates_array = await Directorate.all();
	req.app.locals.directorates = await Promise.all(directorates_array.map(async (d)=>{
		d.rivers = await River.findByDirectorate(d.id);
		return d;
	})); 
	next();
}

exports.user = async function(req, res, next){
	if ( /*req.path == '/' || */req.path == '/users/login' || req.path == '/users/register') return next();
	if(req.session.userId){ 
		//console.log('User lekérdezése...')
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

exports.setSessionID = function(req, res, next){
	if(req.session.session_uniqid == null){
        req.session.session_uniqid = uniqid();
        let session_clients = req.app.get('session_clients');
        session_clients[req.session.session_uniqid] = {isDataLoadProgress: false};  
	}
	console.log('Request is running on worker with id ==> ' + cluster.worker.id);
	//console.log('commonController.setSessionID', req.session.session_uniqid);
	next();
}