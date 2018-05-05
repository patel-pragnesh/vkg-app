/*
!!! NEM HASZNÁLT !!!
A GoogleMaps helyett az OVF-es ESRI térképek megjelenítését alkalmazza a program.
Vízfolyás töréspontjainak betöltése.
*/

const fs = require('fs');
const util = require('util');
const readline = require('readline');
const parser = require('xml2json');
const moment = require('moment');
moment.locale('hu');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const RiverMongoDB = require('../models/mongodb_river');

class KmlLoader{
	constructor(file_path){
		this.file_path = file_path;
		this.data = [];
	}

	async readFile(){
		let that = this;
		try{
			let data_from_file = await readFile(that.file_path, 'utf8');
			//console.log(data_from_file);
			let json = parser.toJson(data_from_file);
			//console.log(json['kml']);
			let obj = JSON.parse(json);
			//let line_array = data_from_file.split('\n');
			let coordinates = obj.kml.Document.Placemark.MultiGeometry.LineString.coordinates;
			let coordinate_data = coordinates.split(' ');
			//console.log(coordinate_data);
			let data = [];
			for(let i=0; i<coordinate_data.length; i++){
				let e = coordinate_data[i].split(',');
				let lat = e[1];
				let lng = e[0];
				data.push({lat: lat, lng:lng});
			}
			that.data = data;
			return that;
		}catch(err){
			console.log(err);
		}
	}

	async saveData(r_id){
		let that = this;
		try{
			
	  		RiverMongoDB.remove({river_id: r_id}, function(err){
	  			if(err){console.log(err);}
	  		});
			for(let i=0; i<that.data.length; i++){

				//TODO: új pontok betötése
				// Create an Author object with escaped and trimmed data.
	            let point = new RiverMongoDB(
	                {
	                    river_id: r_id,
	                    sort: i,
	                    lat: that.data[i].lat,
	                    lng: that.data[i].lng
	                });
	            point.save(function (err) {
	                if (err) { 
	                	console.log(err)
	                	//return next(err); 
	                }
	                // Successful - redirect to new author record.
	                //res.redirect(author.url);
	            });

				//console.log(that.data[i]);
				
			}
			
			return true;
		} catch (err) {
	    	console.log(err);
	    }
	}

}

module.exports = KmlLoader;