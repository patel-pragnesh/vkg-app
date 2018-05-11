const fs = require('fs');
const util = require('util');
const readline = require('readline');
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const Modelling = require('../models/modelling');
const LocationFlow = require('../models/location_flow');
const LocationStage = require('../models/location_stage');
const DateTime = require('../models/date_time');
const Profile = require('../models/profile');
const DescriptionLocationData = require('../models/description_location_data');
const Description = require('../models/description');

class DataForProfileLoader{
	constructor(file_path){
		this.file_path = file_path;
		this.data = [];
	}

	async readFile(){
		let that = this;
		try{
			let data_from_file = await readFile(that.file_path, 'latin1');
			let line_array = data_from_file.split('\n');
			let data = [];
			
			while(line_array[0] != 'END FILE\r'){ 
				let series = line_array.splice(0, line_array.indexOf('END DATA\r')+1);

				let type=null;
				let date_time = null;
				let value_count = null;
				let additional_description = null;
				//Első sor feldolgozása -> Típus és idő
				let first_row_array = series[0].split('/');
				additional_description = first_row_array[6];
				//console.log(first_row_array);
				//console.log(additional_description);
				//TODO: A splittelt array-ből ez fixen kinyerhető
				if(series[0].includes('LOCATION-FLOW')){
					type = 'location_flow';
				}else if(series[0].includes('LOCATION-ELEV')){
					type = 'location_elev';
				}else{
					return null;
				} 

				//TODO: A splittelt array-ből ez fixen kinyerhető
				let date_time_unformat = series[0].match(/[0-9]{2}[A-Z]{3}[0-9]{4} [0-9]{4}/g);
				if(date_time_unformat){
					moment.locale('en');
					date_time = moment(date_time_unformat, 'DDMMMYYYY HHmm').format('YYYY-MM-DD HH:mm:ss');
				}
				
				//Harmadik sor feldolgozása -> Érték párok száma
				let value_count_unformat = series[2].match(/, ([0-9]{1,6}) Ordinates/g);
				if(value_count_unformat){
					value_count = value_count_unformat[0].match(/[0-9]{1,6}/g);
				}

				if(type && date_time && value_count){

					let index1_from = 3+1;
					let index1_to = 3+parseInt(value_count);
					let values = [];
					for(let i=index1_from; i<index1_to+1;i++){
						let profile_string = series[i].replace(/(\r\n|\n|\r)/gm,"");
						let profile_float = parseFloat(profile_string).toFixed(1);
						values.push({profile: profile_float.toString(), value:series[i+parseInt(value_count)].replace(/(\r\n|\n|\r)/gm,"")});
					}

					data.push({type: type, date_time: date_time, values: values, additional_description: additional_description});
				}
			}
			that.data = data;
			return that;
		}catch(err){
			console.log(err);
		}
	}

	async saveData(modelling_id, description_id){
		let that = this;
		console.log("A fájl összesen "+that.data.length + " db időpontot tartalmaz.");
		const modelling = await Modelling.findById(modelling_id);

		let date_time_all = await DateTime.all();
		let additional_description_all = await DescriptionLocationData.all();
		let profile_all = await Profile.findByRiver(modelling.river_id);

		let date_from = moment("3000-01-01 01:01", "YYYY-MM-DD HH:mm");
		let date_to = moment("1900-01-01 01:01", "YYYY-MM-DD HH:mm");

		try{

			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();

			let data_to_insert = [];
			for(let i=0; i<that.data.length; i++){
				console.log("Adabetöltés: "+(i+1)+' / '+that.data.length);

				let tableLocationFlow = new sql.Table('TmpLocationFlow') // or temporary table, e.g. #temptable
				//tableLocationFlow.create = true
				tableLocationFlow.columns.add('date_time_id', sql.Int, {nullable: true});
				tableLocationFlow.columns.add('profile_id', sql.Int, {nullable: true});
				tableLocationFlow.columns.add('modelling_id', sql.Int, {nullable: true});
				tableLocationFlow.columns.add('additional_description_id', sql.Int, {nullable: true});
				tableLocationFlow.columns.add('description_id', sql.Int, {nullable: true});
				tableLocationFlow.columns.add('value', sql.Float, {nullable: true});			
				tableLocationFlow.columns.add('updatedAt', sql.NVarChar, {nullable: true});
				tableLocationFlow.columns.add('createdAt', sql.NVarChar, {nullable: true});

				let tableLocationStage = new sql.Table('TmpLocationStage') // or temporary table, e.g. #temptable
				// tableLocationStage.create = true
				tableLocationStage.columns.add('date_time_id', sql.Int, {nullable: true});
				tableLocationStage.columns.add('profile_id', sql.Int, {nullable: true});
				tableLocationStage.columns.add('modelling_id', sql.Int, {nullable: true});
				tableLocationStage.columns.add('additional_description_id', sql.Int, {nullable: true});
				tableLocationStage.columns.add('description_id', sql.Int, {nullable: true});
				tableLocationStage.columns.add('value', sql.Float, {nullable: true});			
				tableLocationStage.columns.add('updatedAt', sql.NVarChar, {nullable: true});
				tableLocationStage.columns.add('createdAt', sql.NVarChar, {nullable: true});

		    	let d = that.data[i];

		    	let date_time = null;
		    	if(date_time_all){
		    		date_time = date_time_all.find(x => x.dt == d.date_time);
		    	}

				if(!date_time){
					date_time = new DateTime(null, d.date_time);
					date_time = await date_time.save();
				}

				date_from = moment(d.date_time, "YYYY-MM-DD HH:mm") < date_from ? moment(d.date_time, "YYYY-MM-DD HH:mm") : date_from;
				date_to = moment(d.date_time, "YYYY-MM-DD HH:mm") > date_to ? moment(d.date_time, "YYYY-MM-DD HH:mm") : date_to;

				//additional_description ellenőrzése!
				let additional_description = null;
		    	if(additional_description_all){
		    		additional_description = additional_description_all.find(x => x.additional_description == d.additional_description);
		    	}

				if(!additional_description){
					additional_description = new DescriptionLocationData(null, d.additional_description);
					additional_description = await additional_description.save();
					additional_description_all = await DescriptionLocationData.all();
				}

				d.values.forEach(async function(v){
					let profile = null;
					if (profile_all)
						profile = profile_all.find(x => x.name == v.profile);

					if(!profile){		
						profile = new Profile(null, v.profile, modelling.river_id);
						profile = await profile.save();
						//Újra le kell kérni, hogy az új elem is bekerüljön
						profile_all = await Profile.findByRiver(modelling.river_id);
					}

					let ca = moment().format("YYYY-MM-DD HH:mm:ss");
					if(d.type == "location_flow"){
							tableLocationFlow.rows.add(date_time.id, profile.id, modelling.id, additional_description.id, description_id, v.value, ca, ca);
					}else if(d.type == "location_elev"){
							tableLocationStage.rows.add(date_time.id, profile.id, modelling.id, additional_description.id, description_id, v.value, ca, ca);
					}

				});

				//Bulk insert hívása
			    let request = new sql.Request(dbConn);
			    let result_location_flow = await request.bulk(tableLocationFlow);
			    let result_location_stage = await request.bulk(tableLocationStage);

			    let request_move_location_flow = new sql.Request(dbConn);
	    		let result_move_location_flow = await request_move_location_flow.query('INSERT INTO '+
	    			'dbo.LocationFlow(date_time_id, profile_id, modelling_id, additional_description_id, description_id, value, updatedAt, createdAt) '+
	    			'SELECT date_time_id, profile_id, modelling_id, additional_description_id, description_id, value, updatedAt, createdAt FROM dbo.TmpLocationFlow; '+
	    			'TRUNCATE TABLE dbo.TmpLocationFlow;');

	    		let request_move_location_stage = new sql.Request(dbConn);
		    	let result_move_location_stage = await request_move_location_stage.query('INSERT INTO '+
		    		'dbo.LocationStage(date_time_id, profile_id, modelling_id, additional_description_id, description_id, value, updatedAt, createdAt) '+
		    		'SELECT date_time_id, profile_id,modelling_id, additional_description_id, description_id, value, updatedAt, createdAt FROM dbo.TmpLocationStage; '+
		    		'TRUNCATE TABLE dbo.TmpLocationStage;');

			}

			let description = await Description.findById(description_id);
			console.log(description);
			description.date_from = date_from.format("YYYY-MM-DD HH:mm");
			description.date_to = date_to.format("YYYY-MM-DD HH:mm");
			console.log(description);
			description.update();

		    pool.close();

		} catch (err) {
	    	console.log(err);
	    }		
	}
}

module.exports = DataForProfileLoader;