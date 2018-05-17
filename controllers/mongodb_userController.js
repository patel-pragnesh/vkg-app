var User = require('../models/mongodb_user');

exports.logout_get = async function(req, res, next){
	if (req.session) {
    	// delete session object
    	req.session.destroy(function(err) {
      		if(err) {
        		return next(err);
      		} else {
        		return res.redirect('/users/login');
      		}
    	});
  	}
}

exports.login_get = async function(req, res, next){
	 res.render('user/login', {title: 'Bejelentkezés'});
	//return res.redirect('/users/login');
}

exports.login_post = async function(req, res, next){
	if (req.body.username && req.body.password) {
    	User.authenticate(req.body.username, req.body.password, function (error, user) {
      		if (error || !user) {
        		var err = new Error('Wrong username or password.');
        		err.status = 401;
        		return next(err);
      		} else {
        		req.session.userId = user._id;
        		return res.redirect('/');
      		}
    	});
  	} else {
    	var err = new Error('All fields required.');
    	err.status = 400;
    	return next(err);
  	}
}

exports.register_get = async function(req, res, next){
	res.render('user/register', {title: 'Regisztráció'});
}

exports.register_post = async function(req, res, next){
	// confirm that user typed same password twice
  	if (req.body.password !== req.body.password_conf) {
    	var err = new Error('Passwords do not match.');
    	err.status = 400;
    	res.send("passwords dont match");
    	return next(err);
  	}

	if (req.body.email &&
	    req.body.username &&
	    req.body.password &&
	    req.body.password_conf) {

	    var userData = {
	      email: req.body.email,
	      username: req.body.username,
	      password: req.body.password,
	      password_conf: req.body.password_conf,
	    }

	    User.create(userData, function (error, user) {
	      	if (error) {
	        	return next(error);
	      	} else {
	        	req.session.userId = user._id;
	        	return res.redirect('/profile/'+user._id);
	      	}
	    });
    } else {
    	var err = new Error('All fields required.');
    	err.status = 400;
    	return next(err);
  	}
}

exports.new_password_get = async function(req, res, next){
	res.render('user/remember_password', {title: 'Elfelejtett jelszó'});
}

exports.new_password_post = async function(req, res, next){
	
}