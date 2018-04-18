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
			console.log(line_array);
			line_array.forEach(function(l){
				
			});
			that.data = data;
			return that;
		}catch(err){
			console.log(err);
		}
	}

	async saveData(modelling_id){
		let that = this;
		// try{
		// 	const m = await Modelling.findById(modelling_id);
		// 	for(let i=0; i<that.data.length; i++){
		// 		let p = await Profile.findByNameRiver(that.data[i].B, m.river_id);

		// 		//Ha nem létezik még a szelvény a vízfolyásra, akkor létrehoz
		// 		if(!p){		
		// 			p = new Profile(null, that.data[i].B, m.river_id);
		// 			p = await p.save();
		// 		}
		// 		//console.log(p);
		// 		let ti = await TimeInterval.findByName(that.data[i].E);
		// 		//console.log(ti);
		// 		let fm = new DataMeta(null, that.data[i].A, null, null, ti.id, that.data[i].unit, modelling_id, p.id, that.data[i].F, that.data[i].C);
		// 		fm = await fm.save();
		// 		let date_from = moment("3000-01-01 01:01", "YYYY-MM-DD HH:mm");
		// 		let date_to = moment("1900-01-01 01:01", "YYYY-MM-DD HH:mm");

		// 		if(that.data[i].C == 'FLOW'){
					
		// 			let pool = new sql.ConnectionPool(sqlConfig);
		// 			let dbConn = await pool.connect();

		// 		    const table = new sql.Table('TmpFlow') // or temporary table, e.g. #temptable
		// 			table.create = true
		// 			table.columns.add('date_time_for', sql.NVarChar, {nullable: true});
		// 			table.columns.add('value', sql.Float, {nullable: true});
		// 			table.columns.add('data_meta_id', sql.Int, {nullable: true});
		// 			table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
		// 			table.columns.add('createdAt', sql.NVarChar, {nullable: true});

		// 		    that.data[i].values.forEach(async function(v){
		// 		    	date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
		// 				date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;

		// 				let ca = moment().format("YYYY-MM-DD HH:mm:ss");
		// 				table.rows.add(v.datetime, v.val, fm.id, ca, ca);

		// 			});

		// 		    const request = new sql.Request(dbConn);
		// 		    let result = await request.bulk(table);

		// 		    const request_move = new sql.Request(dbConn);
		// 	    	let result1 = await request_move.query('INSERT INTO dbo.Flow(date_time_for, value, data_meta_id, updatedAt, createdAt) '+
		// 	    		'SELECT date_time_for, value, data_meta_id, updatedAt, createdAt FROM dbo.TmpFlow; '+
		// 	    		'TRUNCATE TABLE dbo.TmpFlow;');
		// 		    pool.close();
		// 		}else if(that.data[i].C == 'FLOW-CUM'){
		// 			that.data[i].values.forEach(function(v){
		// 				date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
		// 				date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;
		// 				let f = new FlowCum(null, v.datetime, v.val, fm.id);
		// 				f.save();
		// 			});
		// 		}else if(that.data[i].C == 'STAGE'){
		// 			let pool = new sql.ConnectionPool(sqlConfig);
		// 			let dbConn = await pool.connect();

		// 		    const table = new sql.Table('TmpStage') // or temporary table, e.g. #temptable
		// 			//table.create = true
		// 			table.columns.add('date_time_for', sql.NVarChar, {nullable: true});
		// 			table.columns.add('value', sql.Float, {nullable: true});
		// 			table.columns.add('data_meta_id', sql.Int, {nullable: true});
		// 			table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
		// 			table.columns.add('createdAt', sql.NVarChar, {nullable: true});

		// 		    that.data[i].values.forEach(async function(v){
		// 		    	//console.log(v.val);
		// 		    	date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
		// 				date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;

		// 				let ca = moment().format("YYYY-MM-DD HH:mm:ss");
		// 				table.rows.add(v.datetime, v.val, fm.id, ca, ca);

		// 			});

		// 		    const request = new sql.Request(dbConn);
		// 		    let result = await request.bulk(table);

		// 		    const request_move = new sql.Request(dbConn);
		// 	    	let result1 = await request_move.query('INSERT INTO dbo.Stage(date_time_for, value, data_meta_id, updatedAt, createdAt) '+
		// 	    		'SELECT date_time_for, value, data_meta_id, updatedAt, createdAt FROM dbo.TmpStage; '+
		// 	    		'TRUNCATE TABLE dbo.TmpStage;');
		// 		    pool.close();
		// 		}

		// 		fm.date_from = date_from.format("YYYY-MM-DD HH:mm:ss");
		// 		fm.date_to = date_to.format("YYYY-MM-DD HH:mm:ss");
		// 		fm.update();
		// 	}
			
		// 	return true;
		// } catch (err) {
	 //    	console.log(err);
	 //    }
	}

}

module.exports = DataForProfileLoader;