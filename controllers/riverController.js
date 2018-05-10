const River = require('../models/river');
const Profile = require('../models/profile');
const DataMeta = require('../models/data_meta');
const Flow = require('../models/flow');
const Stage = require('../models/stage');
//const RiverMongoDB = require('../models/mongodb_river');
//const ProfileMongoDB = require('../models/mongodb_profile');
const Modelling = require('../models/modelling');

exports.index = function(req, res){
	res.send('TODO: vízfolyások megjelenítése');
}

exports.river_detail = async function(req, res, next){
	let river = await River.findById(req.params.id);
	let modellings = await Modelling.findByRiverId(req.params.id);
	let ud = await DataMeta.selectUserDescriptions('FLOW', 8);
	//let profiles = await Profile.findByRiver(req.params.id);
	let act_data_type = req.params.data_type;
	data_types = [
		{id: 0, name: "Vízhozam idősor"},
		{id: 1, name: "Vízszint idősor"},
		{id: 2, name: "Vízszint hossz-szelvény"},
		{id: 3, name: "Vízhozam hossz-szelvény"},
		{id: 4, name: "Vízkészlet"},
		{id: 5, name: "Vízkivételek hozamok"},
		{id: 6, name: "Vízbeeresztés hozamok"},
		//{id: 7, name: "Beszivárgás a mederbe"}, //Peremfeltétel, még nincs
		//{id: 8, name: "Elszivárgás a mederből"}, //Peremfeltétel, még nincs
		{id: 9, name: "Csapadékátlag"},
		//{id: 10, name: "Párolgás"}, //Nincs és nem is lesznek ilyen adatok
		//{id: 11, name: "Evapotranspiráció"},
		//{id: 12, name: "Hőmérséklet"},
		//{id: 13, name: "Zsilipadatok"},
		//{id: 14, name: "Vízkészlet változása idősor grafikon"},
		//{id: 15, name: "Vízkészlet változás hossz-szelvény"},
	];
	// let profile_names = [];
	// if(profiles){
	// 	for(let i=0; i<profiles.length; i++){
	// 		profile_names.push(profiles[i].name);
	// 	}
	// }	
	res.render('river/index', {
		title: river.name, 
		river: river, 
		river_page: true, 
		modellings: modellings,
		data_types: data_types, 
		//profiles: profiles, 
		//profile_names: profile_names,
		act_data_type: act_data_type
	});
}

//Ajax hívás az adatbetöltések lekérdezésére modellezésenként
exports.get_time_data_dataloads_by_modelling_post = async function(req, res){
	let modelling_id = req.body.modelling_id;
	let data_type = req.body.data_type;
	//console.log(modelling_id);
	let type_filer = data_type == 0 ? 'FLOW' : 'STAGE';
	let data_meta_array = await DataMeta.selectUserDescriptions(type_filer, modelling_id);
	res.json(data_meta_array);
}

//Ajax hívás az adatbetöltéshez tartozó profilok lekérdezésére
exports.get_time_data_profiles_by_dataload_post = async function(req, res){
	let user_description = req.body.user_description;
	let profile_array = await DataMeta.selectProfilesByUserDescription(user_description);
	res.json(profile_array);
}

//Ajax hívás az idősor adatok lekérdezésére
exports.get_time_data_data_post = async function(req, res){
	let data_type = req.body.data_type;
	let profile_id = req.body.profile_id;
	let date_start = req.body.date_start;
	let date_end = req.body.date_end;

	let datapoints = null;
	let data_type_string = '';

	if(data_type == 0){	//FLOW
		data_type_string = 'FLOW';
		let data_meta = await DataMeta.findByTypeProfile(data_type_string, profile_id);
		datapoints = await Flow.findByMetaDataAndDate(data_meta.id, date_start, date_end);
	}else if(data_type == 1){	//STAGE
		data_type_string = 'STAGE';
		let data_meta = await DataMeta.findByTypeProfile(data_type_string, profile_id);
		datapoints = await Stage.findByMetaDataAndDate(data_meta.id, date_start, date_end);
	}
	res.json(datapoints);
}

//Ajax hívás az adatok megjelenítésére
//Visszaadja az adatbetöltéseket és a hozzájuk tartozó adatokat
// exports.get_data_by_type_post_opt = async function(req, res){
// 	//console.log("Data request received.");
// 	let river_id = req.body.river_id;
// 	let data_type = req.body.data_type;
// 	let profile_id = req.body.profile_id;
// 	let date_start = req.body.date_start;
// 	let date_end = req.body.date_end;
	
// 	if(data_type == 0){	//FLOW
// 		//Összes DataMeta lekérése, ami a kijelölt dátum tartományba esik és FLOW típusú és profilhoz köthető
// 		let data_meta_array = await DataMeta.findByDate(profile_id, 'FLOW', date_start, date_end)
		
// 		if(data_meta_array){
// 			//Összes FLOW lekérése a DataMetakból, ami a dátum tartományba esik			
// 	    	for(let data_meta of data_meta_array){
// 	    		data_meta.datapoints = await Flow.findByMetaDataAndDate(data_meta.id, date_start, date_end);
// 	    	}
//     	}

//     	res.json(data_meta_array);
// 	}else if(data_type == 1){	//STAGE
// 		//Összes DataMeta lekérése, ami a kijelölt dátum tartományba esik és FLOW típusú és profilhoz köthető
// 		let data_meta_array = await DataMeta.findByDate(profile_id, 'STAGE', date_start, date_end)
		
// 		if(data_meta_array){
// 			//Összes STAGE lekérése a DataMetakból, ami a dátum tartományba esik			
// 	    	for(let data_meta of data_meta_array){
// 	    		data_meta.datapoints = await Stage.findByMetaDataAndDate(data_meta.id, date_start, date_end);
// 	    	}
//     	}

//     	res.json(data_meta_array);
// 	}

// }

//Ajax hívás az adatok megjelenítésére
// exports.get_coordinates_post = async function(req, res){
// 	//console.log("Data request received.");
// 	let river_id = req.body.river_id;

// 	RiverMongoDB.find({river_id: river_id}).sort({sort: 'asc'}).exec(function(err, result){
// 		if(err){console.log(err);}
// 		else{
// 			//console.log(result);
// 			res.json(result);
// 		}
// 	});
// }

//Ajax hívás a profil adatok megjelenítésére
// exports.get_profiles_post = async function(req, res){
// 	//console.log("Data request received.");
// 	let river_id = req.body.river_id;

// 	ProfileMongoDB.find({river_id: river_id}).exec(function(err, result){
// 		if(err){console.log(err);}
// 		else{
// 			//console.log(result);
// 			res.json(result);
// 		}
// 	});
// }

// exports.save_profile_coordinate_post = async function(req, res){
// 	let river_id = req.body.river_id;
// 	let point_lat = req.body.point_lat;
// 	let point_lng = req.body.point_lng;
// 	let point_profile = req.body.point_profile;
	
// 	let profile = new ProfileMongoDB(
// 	                {
// 	                    river_id: river_id,
// 	                    profile: point_profile,
// 	                    lat: point_lat,
// 	                    lng: point_lng
// 	                });
// 	            profile.save(function (err) {
// 	                if (err) { 
// 	                	console.log(err)
// 	                	//return next(err); 
// 	                }
// 	                // Successful - redirect to new author record.
// 	                //res.redirect(author.url);
// 	            });
// }

exports.get_by_directorate_post = async function(req, res){
	// console.log(req.body.id);
	let river = await River.findByDirectorate(req.body.id);
	res.json(river);
}