const River = require('../models/river');

exports.index = function(req, res){
	res.send('TODO: vízfolyások megjelenítése');
}

exports.river_detail = async function(req, res, next){
	let river = await River.findById(req.params.id);
	data_types = [
		{name: "Vízhozam idősor"},
		{name: "Vízszint idősor"},
		{name: "Vízszint hossz-szelvény"},
		{name: "Vízhozam hossz-szelvény"},
		{name: "Vízkészlet"},
		{name: "Vízkivételek hozamok"},
		{name: "Vízbeeresztés hozamok"},
		{name: "Beszivárgás a mederbe"},
		{name: "Elszivárgás a mederből"},
		{name: "Csapadékátlag"},
		{name: "Párolgás"},
		{name: "Evapotranspiráció"},
		{name: "Hőmérséklet"},
		{name: "Zsilipadatok"},
		{name: "Vízkészlet változása idősor grafikon"},
		{name: "Vízkészlet változás hossz-szelvény"},
	];
	res.render('river/index', {title: river.name, river_page: true, data_types: data_types});
}

exports.get_by_directorate_post = async function(req, res){
	// console.log(req.body.id);
	let river = await River.findByDirectorate(req.body.id);
	res.json(river);
}