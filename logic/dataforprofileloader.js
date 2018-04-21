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
//const DataMeta = require('../models/data_meta');
//const Flow = require('../models/flow');
//const FlowCum = require('../models/flow_cum');
//const Stage = require('../models/stage');
//const TimeInterval = require('../models/time_interval');
const Profile = require('../models/profile');

class DataForProfileLoader{
	constructor(file_path){
		this.file_path = file_path;
		this.data = [];
	}

	async readFile(){
		let that = this;
		try{
			let data_from_file = await readFile(that.file_path, 'latin1');
			//console.log(data_from_file);
			let line_array = data_from_file.split('\n');
			//console.log(line_array);
			let data = [];
			//console.log(line_array);
			while(line_array[0] != 'END FILE\r'){ 
				let series = line_array.splice(0, line_array.indexOf('END DATA\r')+1);

				let type=null;
				let date_time = null;
				//Első sor feldolgozása -> Típus és idő
				if(series[0].includes('LOCATION-FLOW')){
					type = 'location_flow';
				}else if(series[0].includes('LOCATION-STAGE')){
					type = 'location_stage';
				}else{
					return null;
				}
				let date_time_unformat = series[0].match(/[0-9]{2}[A-Z]{3}[0-9]{4} [0-9]{4}/g);
				if(date_time_unformat){
					moment.locale('en');
					date_time = moment(date_time_unformat, 'DDMMMYYYY HHmm').format('YYYY-MM-DD HH:mm:ss');
				}
				
				//Harmadik sor feldolgozása -> Érték párok száma
				let value_count_unformat = series[2].match(/, ([0-9]{1,6}) Ordinates/g);
				let value_count = value_count_unformat[0].match(/[0-9]{1,6}/g);

				let index1_from = 3+1;
				let index1_to = 3+parseInt(value_count);
				//let index2_from = 3+parseInt(value_count)+1;
				//let index2_to = 3+parseInt(value_count)+parseInt(value_count);
				let values = [];
				for(let i=index1_from; i<index1_to+1;i++){
					values.push({profile:series[i].replace(/(\r\n|\n|\r)/gm,""), value:series[i+parseInt(value_count)].replace(/(\r\n|\n|\r)/gm,"")});
				}

				data.push({type: type, date_time: date_time, values: values});
			}
			that.data = data;
			return that;
		}catch(err){
			console.log(err);
		}
	}

	async saveData(modelling_id){
		let that = this;
		//console.log(that.data[0]);
		const modelling = await Modelling.findById(modelling_id);
		try{

			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();

		    const tableLocationFlow = new sql.Table('TmpLocationFlow') // or temporary table, e.g. #temptable
			//tableLocationFlow.create = true
			tableLocationFlow.columns.add('date_time_id', sql.Int, {nullable: true});
			tableLocationFlow.columns.add('profile_id', sql.Int, {nullable: true});
			tableLocationFlow.columns.add('modelling_id', sql.Int, {nullable: true});
			tableLocationFlow.columns.add('value', sql.Float, {nullable: true});			
			tableLocationFlow.columns.add('updatedAt', sql.NVarChar, {nullable: true});
			tableLocationFlow.columns.add('createdAt', sql.NVarChar, {nullable: true});

			const tableLocationStage = new sql.Table('TmpLocationStage') // or temporary table, e.g. #temptable
			tableLocationStage.create = true
			tableLocationStage.columns.add('date_time_id', sql.Int, {nullable: true});
			tableLocationStage.columns.add('profile_id', sql.Int, {nullable: true});
			tableLocationStage.columns.add('modelling_id', sql.Int, {nullable: true});
			tableLocationStage.columns.add('value', sql.Float, {nullable: true});			
			tableLocationStage.columns.add('updatedAt', sql.NVarChar, {nullable: true});
			tableLocationStage.columns.add('createdAt', sql.NVarChar, {nullable: true});

			let data_to_insert = [];
			for(let i=0; i<that.data.length; i++){
		    //that.data.forEach(async function(d){
		    	let d = that.data[i];
		    	//DateTime Megkeresése, ha nics új bejegyzés
				let date_time = await DateTime.findByDt(d.date_time);
				if(!date_time){
					date_time = new DateTime(null, d.date_time);
					date_time = await date_time.save();
				}
				//console.log(date_time);

				d.values.forEach(async function(v){
					//Profile Megkeresése, ha nincs új bejegyzés
					let profile = await Profile.findByNameRiver(v.profile, modelling.river_id);
					//Ha nem létezik még a szelvény a vízfolyásra, akkor létrehoz
					if(!profile){		
						profile = new Profile(null, v.profile, modelling.river_id);
						profile = await profile.save();
					}
					//console.log(profile);

					let ca = moment().format("YYYY-MM-DD HH:mm:ss");
					if(d.type == "location_flow"){
						//Ellenőrizni, hogy van-e már ilyen
						let location_flow_check = await LocationFlow.findByProfileDateTimeModelling(profile.id, date_time.id, modelling.id);
						if(!location_flow_check){
							tableLocationFlow.rows.add(date_time.id, profile.id, modelling.id, v.value, ca, ca);
						}
					}else if(d.type == "location_stage"){
						//Ellenőrizni, hogy van-e már ilyen
						let location_stage_check = await LocationStage.findByProfileDateTimeModelling(profile.id, date_time.id, modelling.id);
						if(!location_stage_check){
							tableLocationStage.rows.add(date_time.id, profile.id, modelling.id, v.value, ca, ca);
						}
					}
				});
			}

			console.log(tableLocationStage.rows);

			//Bulk insert hívása
		    const request = new sql.Request(dbConn);
		    let result_location_flow = await request.bulk(tableLocationFlow);

		    const request_move_location_flow = new sql.Request(dbConn);
	    	let result_move_location_flow = await request_move_location_flow.query('INSERT INTO '+
	    		'dbo.LocationFlow(date_time_id, profile_id, modelling_id, value, updatedAt, createdAt) '+
	    		'SELECT date_time_id, profile_id,modelling_id , value, updatedAt, createdAt FROM dbo.TmpLocationFlow; '+
	    		'TRUNCATE TABLE dbo.TmpLocationFlow;');


	    	let result_location_stage = await request.bulk(tableLocationStage);

		    const request_move_location_stage = new sql.Request(dbConn);
	    	let result_move_location_stage = await request_move_location_stage.query('INSERT INTO '+
	    		'dbo.LocationStage(date_time_id, profile_id, modelling_id, value, updatedAt, createdAt) '+
	    		'SELECT date_time_id, profile_id,modelling_id , value, updatedAt, createdAt FROM dbo.TmpLocationStage; '+
	    		'TRUNCATE TABLE dbo.TmpLocationStage;');

		    pool.close();

		} catch (err) {
	    	console.log(err);
	    }		
	}
}

module.exports = DataForProfileLoader;