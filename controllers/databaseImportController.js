//var DatabaseImport = require('../models/databaseImport');
const Directorate = require('../models/directorate');
const Modelling = require('../models/modelling');

var async = require('async');

exports.index = async function(req, res){
	let countPerPage = 1;
	let page = req.query.page ? req.query.page - 1 : 0;
	directorates = Directorate.all();
	modellings = await Modelling.all();
	modellings_page = modellings.slice(page, page + countPerPage);
	console.log(modellings_page);
  	res.render('databaseImport/index', {title: 'Modellezések', directorates: await directorates, modellings: modellings_page});
	
}

exports.new = async function(req, res){
	directorates = Directorate.all();
  	res.render('databaseImport/new', {title: 'Új modellezés', directorates: await directorates});
}