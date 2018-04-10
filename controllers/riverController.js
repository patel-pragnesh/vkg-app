const River = require('../models/river');
const Profile = require('../models/profile');
const DataMeta = require('../models/data_meta');
const Flow = require('../models/flow');
const RiverMongoDB = require('../models/mongodb_river');
const ProfileMongoDB = require('../models/mongodb_profile');

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
	let profile_names = [];
	if(profiles){
		for(let i=0; i<profiles.length; i++){
			profile_names.push(profiles[i].name);
		}
	}	
	res.render('river/index', {
		title: river.name, 
		river: river, 
		river_page: true, 
		data_types: data_types, 
		profiles: profiles, 
		profile_names: profile_names,
		act_data_type: act_data_type
	});
}

//Ajax hívás az adatok megjelenítésére
//Visszaadja az adatbetöltéseket és a hozzájuk tartozó adatokat
exports.get_data_by_type_post_opt = async function(req, res){
	//console.log("Data request received.");
	let river_id = req.body.river_id;
	let data_type = req.body.data_type;
	let profile_id = req.body.profile_id;
	let date_start = req.body.date_start;
	let date_end = req.body.date_end;
	
	if(data_type == 0){	//FLOW
		//Összes DataMeta lekérése, ami a kijelölt dátum tartományba esik és FLOW típusú és profilhoz köthető
		let data_meta_array = await DataMeta.findByDate(profile_id, 'FLOW', date_start, date_end)
		
		if(data_meta_array){
			//Összes FLOW lekérése a DataMetakból, ami a dátum tartományba esik			
	    	for(let data_meta of data_meta_array){
	    		data_meta.flows = await Flow.findByMetaDataAndDate(data_meta.id, date_start, date_end);
	    	}
    	}

    	res.json(data_meta_array);
	}
}

//Ajax hívás az adatok megjelenítésére
exports.get_coordinates_post = async function(req, res){
	//console.log("Data request received.");
	let river_id = req.body.river_id;

	RiverMongoDB.find({river_id: river_id}).sort({sort: 'asc'}).exec(function(err, result){
		if(err){console.log(err);}
		else{
			//console.log(result);
			res.json(result);
		}
	});
}

//Ajax hívás a profil adatok megjelenítésére
exports.get_profiles_post = async function(req, res){
	//console.log("Data request received.");
	let river_id = req.body.river_id;

	ProfileMongoDB.find({river_id: river_id}).exec(function(err, result){
		if(err){console.log(err);}
		else{
			//console.log(result);
			res.json(result);
		}
	});
}

exports.save_profile_coordinate_post = async function(req, res){
	let river_id = req.body.river_id;
	let point_lat = req.body.point_lat;
	let point_lng = req.body.point_lng;
	let point_profile = req.body.point_profile;
	
	let profile = new ProfileMongoDB(
	                {
	                    river_id: river_id,
	                    profile: point_profile,
	                    lat: point_lat,
	                    lng: point_lng
	                });
	            profile.save(function (err) {
	                if (err) { 
	                	console.log(err)
	                	//return next(err); 
	                }
	                // Successful - redirect to new author record.
	                //res.redirect(author.url);
	            });
}

exports.get_by_directorate_post = async function(req, res){
	// console.log(req.body.id);
	let river = await River.findByDirectorate(req.body.id);
	res.json(river);
}