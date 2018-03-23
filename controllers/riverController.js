const River = require('../models/river');
const Profile = require('../models/profile');

exports.index = function(req, res){
	res.send('TODO: vízfolyások megjelenítése');
}

exports.river_detail = async function(req, res, next){
	let river = await River.findById(req.params.id);
	let profiles = await Profile.findByRiver(req.params.id);
	let act_data_type = req.params.data_type;
	data_types = [
		{id: 0, name: "Vízhozam idősor"},
		{id: 1, name: "Vízszint idősor"},
		{id: 2, name: "Vízszint hossz-szelvény"},
		{id: 3, name: "Vízhozam hossz-szelvény"},
		{id: 4, name: "Vízkészlet"},
		{id: 5, name: "Vízkivételek hozamok"},
		{id: 6, name: "Vízbeeresztés hozamok"},
		{id: 7, name: "Beszivárgás a mederbe"},
		{id: 8, name: "Elszivárgás a mederből"},
		{id: 9, name: "Csapadékátlag"},
		{id: 10, name: "Párolgás"},
		{id: 11, name: "Evapotranspiráció"},
		{id: 12, name: "Hőmérséklet"},
		{id: 13, name: "Zsilipadatok"},
		{id: 14, name: "Vízkészlet változása idősor grafikon"},
		{id: 15, name: "Vízkészlet változás hossz-szelvény"},
	];
	res.render('river/index', {
		title: river.name, 
		river: river, 
		river_page: true, 
		data_types: data_types, 
		profiles: profiles, 
		act_data_type: act_data_type
	});
}

//Ajax hívás az adatok megjelenítésére
exports.get_data_by_type_post = async function(req, res){
	let river_id = req.body.river_id;
	let data_type = req.body.data_type;
	let profile_id = req.body.profile_id;

	if(data_type == 0){	//FLOW
		//Összes DataMeta lekérése, ami a kijelölt dátum tartományba esik és FLOW típusú és profilhoz köthető

		//Összes FLOW lekérése a DataMetakból, ami a dátum tartományba esik

	}

	//Profil lekérdezése
}

//Ajax hívás az adat grafikonos megjelenítésére

exports.get_by_directorate_post = async function(req, res){
	// console.log(req.body.id);
	let river = await River.findByDirectorate(req.body.id);
	res.json(river);
}