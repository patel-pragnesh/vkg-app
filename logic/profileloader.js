const fs = require('fs');
const util = require('util');
const readline = require('readline');
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const Profile = require('../models/profile');
// const DataMeta = require('../models/data_meta');
// const Flow = require('../models/flow');
// const FlowCum = require('../models/flow_cum');
// const Stage = require('../models/stage');
// const TimeInterval = require('../models/time_interval');
// const River = require('../models/river');
//const RiverMongoDB = require('../models/mongodb_river');

class ProfileLoader{
	constructor(file_path){
		this.file_path = file_path;
		this.data = [];
	}

	async readFile(){
		let that = this;
		try{
			let data_from_file = await readFile(that.file_path, 'utf8');
			//console.log(data_from_file);
			//let json = parser.toJson(data_from_file);
			//console.log(json['kml']);
			//let obj = JSON.parse(json);
			//let line_array = data_from_file.split('\n');
			//let coordinates = obj.kml.Document.Placemark.MultiGeometry.LineString.coordinates;
			//let coordinate_data = coordinates.split(' ');
			//console.log(coordinate_data);
			let profiles = data_from_file.split(';');
			let data = [];
			for(let i=0; i<profiles.length; i++){
				// let e = coordinate_data[i].split(',');
				// let lat = e[1];
				// let lng = e[0];
				data.push({profile: profiles[i]});
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
			//Már létező profil adatok lekérdezése
			let profiles = await Profile.findByRiver(r_id);

			//Duplikált profil adatok eltávolítása a listából
			for(let i=0; i<profiles.length; i++){
				that.data = that.data.filter(e => e.profile != profiles[i].name);
			}

			if(that.data.length > 0){
				let pool = new sql.ConnectionPool(sqlConfig);
				let dbConn = await pool.connect();

			    const table = new sql.Table('TmpProfile') // or temporary table, e.g. #temptable
				table.create = true
				table.columns.add('name', sql.NVarChar, {nullable: true});
				table.columns.add('river_id', sql.Int, {nullable: true});
				table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
				table.columns.add('createdAt', sql.NVarChar, {nullable: true});

				for(let i=0; i<that.data.length; i++){
					
			    	let ca = moment().format("YYYY-MM-DD HH:mm:ss");
					table.rows.add(that.data[i].profile, r_id, ca, ca);

				}

			    const request = new sql.Request(dbConn);
			    let result = await request.bulk(table);

			    const request_move = new sql.Request(dbConn);
		    	let result1 = await request_move.query('INSERT INTO dbo.Profile(name, river_id, updatedAt, createdAt) '+
		    		'SELECT name, river_id, updatedAt, createdAt FROM dbo.TmpProfile; '+
		    		'TRUNCATE TABLE dbo.TmpProfile;');
			    pool.close();
				
			}
			
			return true;
		} catch (err) {
	    	console.log(err);
	    }
	}

}

module.exports = ProfileLoader;