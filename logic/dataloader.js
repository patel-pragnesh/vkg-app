const fs = require('fs');
const util = require('util');
const readline = require('readline');
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');
const uniqid = require('uniqid');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const Modelling = require('../models/modelling');
const DataMeta = require('../models/data_meta');
const Flow = require('../models/flow');
const FlowCum = require('../models/flow_cum');
const Stage = require('../models/stage');
const TimeInterval = require('../models/time_interval');
const Profile = require('../models/profile');

class DataLoader{
	constructor(file_path){
		this.file_path = file_path;
		this.progress = 0;
		this.progressStep = 0;
		this.data = [];
	}

	// async test(){
	// 	console.log('child process test');
	// }

	//DSSVue-val DSSutl Write Data File formátumban exportált adatok beolvasása
	async readFile(process){
		let that = this;

		try{
			let data_from_file = await readFile(that.file_path, 'latin1');
			let line_array = data_from_file.split('\n');
			let count = 0;
			line_array.forEach(function(element){
				if(element == 'END DATA\r'){
					count++;
				}
			});
			that.progressStep = 100 / (count*2);

			let data = [];
			let data_counter = 1;
			while(line_array[0] != 'END FILE\r'){

				// Send message to progressbar
				that.progress += that.progressStep;
				process.send(that.progress.toFixed(0));
				let series = line_array.splice(0, line_array.indexOf('END DATA\r')+1);

				let A = null;
				let B = null;
				let C = null;
				let E = null;
				let F = null;
				let type=null;
				let unit=null;
				let date_time = null;
				let value_count = null;
				let values = [];

				// Első sor feldolgozása
				let first_row_array = series[0].split('/');
				A = first_row_array[1];
				B = parseFloat(first_row_array[2]).toFixed(1);
				C = first_row_array[3];
				E = first_row_array[5];
				F = first_row_array[6];

				// Negyedik sor feldolgozás -> unit, type
				//let unit_unformat = series[3].match(/(Units: ([\S]{1,}))/g);
				//let type_unformat = series[3].match(/Type: ([\S]{1,})/g);

				let regExUnit = /Units: ([\S]{1,})/ig;				
				let regExType = /Type: ([\S]{1,})/ig;				
				let matchUnit = regExUnit.exec(series[3]);
				let matchType = regExType.exec(series[3]);
				unit = matchUnit[1];
				type = matchType[1];

				// Harmadik sor feldolgozása -> Érték párok száma
				let regExValueCount = /Number: ([\S]{1,})/ig;				
				let matchValueCount = regExValueCount.exec(series[2]);
				value_count = matchValueCount[1];
				
				// Csak FLOW vagy STAGE betöltése
				if(C !='FLOW' && C != 'STAGE'){
					console.log('Rossz típus...');
					return null;
				}

				if(type && value_count){
					let counter = 1;
					let index1_from = 3+1;
					let index1_to = 3+parseInt(value_count);					
					for(let i=index1_from; i<index1_to+1;i++){
						//31DEC2214, 2400;   40,000
						//console.log(counter);
						let formatted_series = series[i].replace(/(\r\n|\n|\r|\s)/gm,"");
						let data_array = formatted_series.split(';');
						moment.locale('en');
						values.push({nr: counter, 
							datetime: moment(data_array[0], "DDMMMYYYY,HHmm").format("YYYY-MM-DD HH:mm:ss"), 
							val: data_array[1].replace(',', '.')});	
						counter++;
					}
				}
				data.push({A: A, B: B, C: C, E: E, F: F, type: type, unit: unit, values: values});
				data_counter++;
			}

			that.data = data;
			return that;
		}catch(err){
			console.log(err);
			return null;
		}
	}

	//!!! DEPRICATED !!!
	//DSSVue-val Excel-be mentett és .csv formátumba konvertált adatok beolvasása
	async readFileFromCsv(){
		// let that = this;
		// try{
		// 	let data_from_file = await readFile(that.file_path, 'latin1');
			
		// 	let line_array = data_from_file.split('\n');
			
		// 	let data = [];
		// 	line_array.forEach(function(l){
		// 		let line_data = l.split(';');
		// 		if(line_data[0] == 'A'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				let data_item = {A:line_data[i].replace(/(\r\n|\n|\r)/gm,"")};
		// 				data.push(data_item);
		// 			}
		// 		}else if(line_data[0] == 'B'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				data[i-2].B = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
		// 			}
		// 		}else if(line_data[0] == 'C'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				data[i-2].C = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
		// 			}
		// 		}else if(line_data[0] == 'E'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				data[i-2].E = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
		// 			}
		// 		}else if(line_data[0] == 'F'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				data[i-2].F = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
		// 			}
		// 		}else if(line_data[0] == 'Units'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				data[i-2].unit = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
		// 			}
		// 		}else if(line_data[0] == 'Type'){
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				data[i-2].type = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
		// 			}
		// 		}else{
		// 			for (let i = 2; i<line_data.length; i++) {
		// 				if(!data[i-2].values){
		// 					data[i-2].values = [];
		// 				}
		// 				//let datetime = line_data[1].replace(/(\r\n|\n|\r)/gm,"");
		// 				//console.log(datetime);
		// 				data[i-2].values.push({nr: line_data[0].replace(/(\r\n|\n|\r)/gm,""), 
		// 					datetime: moment(line_data[1].replace(/(\r\n|\n|\r)/gm,""), "DDMMMYYYY HHmm").format("YYYY-MM-DD HH:mm:ss"), 
		// 					val: line_data[i].replace(',', '.').replace(/(\r\n|\n|\r)/gm,"")});	
		// 			}
		// 		}		
		// 	});
		// 	console.log(data);
		// 	that.data = data;
		// 	return that;
		// }catch(err){
		// 	console.log(err);
		// }
	}

	async saveData(process, modelling_id, user_description){
		let that = this;
		try{
			// Egyedi azonosító az aktuálsi adatbetöltéshez (több együttes betöltésnél meg kell különböztetni)
			let dataloadUniqId = uniqid();

			const m = await Modelling.findById(modelling_id);
			for(let i=0; i<that.data.length; i++){

				// Send message to progressbar
				that.progress += that.progressStep;
				process.send(that.progress.toFixed(0));
				let p = await Profile.findByNameRiver(that.data[i].B, m.river_id);

				//Ha nem létezik még a szelvény a vízfolyásra, akkor létrehoz
				if(!p){		
					p = new Profile(null, that.data[i].B, m.river_id);
					p = await p.save();
				}
				
				let ti = await TimeInterval.findByName(that.data[i].E);
				
				let fm = new DataMeta(null, that.data[i].A, null, null, ti.id, that.data[i].unit, modelling_id, p.id, that.data[i].F, user_description, that.data[i].C);
				fm = await fm.save();
				let date_from = moment("3000-01-01 01:01", "YYYY-MM-DD HH:mm");
				let date_to = moment("1900-01-01 01:01", "YYYY-MM-DD HH:mm");

				if(that.data[i].C == 'FLOW'){
					
					let pool = new sql.ConnectionPool(sqlConfig);
					let dbConn = await pool.connect();

				    const table = new sql.Table('TmpFlow') // or temporary table, e.g. #temptable
					table.create = true
					table.columns.add('date_time_for', sql.NVarChar, {nullable: true});
					table.columns.add('value', sql.Float, {nullable: true});
					table.columns.add('data_meta_id', sql.Int, {nullable: true});
					table.columns.add('uniqid', sql.NVarChar, {nullable: true});
					table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
					table.columns.add('createdAt', sql.NVarChar, {nullable: true});

				    that.data[i].values.forEach(async function(v){
						
				    	date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
						date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;

						let ca = moment().format("YYYY-MM-DD HH:mm:ss");
						table.rows.add(v.datetime, v.val, fm.id, dataloadUniqId, ca, ca);

					});

				    const request = new sql.Request(dbConn);
				    let result = await request.bulk(table);

				    const request_move = new sql.Request(dbConn);
			    	let result1 = await request_move.query('INSERT INTO dbo.Flow(date_time_for, value, data_meta_id, updatedAt, createdAt) '+
			    		'SELECT date_time_for, value, data_meta_id, updatedAt, createdAt FROM dbo.TmpFlow WHERE uniqid=\''+dataloadUniqId+'\'; '+
			    		'TRUNCATE TABLE dbo.TmpFlow;');
				    pool.close();
				}else if(that.data[i].C == 'STAGE'){
					let pool = new sql.ConnectionPool(sqlConfig);
					let dbConn = await pool.connect();

				    const table = new sql.Table('TmpStage') // or temporary table, e.g. #temptable
					//table.create = true
					table.columns.add('date_time_for', sql.NVarChar, {nullable: true});
					table.columns.add('value', sql.Float, {nullable: true});
					table.columns.add('data_meta_id', sql.Int, {nullable: true});
					table.columns.add('uniqid', sql.NVarChar, {nullable: true});
					table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
					table.columns.add('createdAt', sql.NVarChar, {nullable: true});

				    that.data[i].values.forEach(async function(v){
				    	//console.log(v.val);
				    	date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
						date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;

						let ca = moment().format("YYYY-MM-DD HH:mm:ss");
						table.rows.add(v.datetime, v.val, fm.id, dataloadUniqId, ca, ca);

					});

				    const request = new sql.Request(dbConn);
				    let result = await request.bulk(table);

				    const request_move = new sql.Request(dbConn);
			    	let result1 = await request_move.query('INSERT INTO dbo.Stage(date_time_for, value, data_meta_id, updatedAt, createdAt) '+
			    		'SELECT date_time_for, value, data_meta_id, updatedAt, createdAt FROM dbo.TmpStage WHERE uniqid=\''+dataloadUniqId+'\'; '+
			    		'TRUNCATE TABLE dbo.TmpStage;');
				    pool.close();
				}

				fm.date_from = date_from.format("YYYY-MM-DD HH:mm:ss");
				fm.date_to = date_to.format("YYYY-MM-DD HH:mm:ss");
				fm.update();
			}
			
			return true;
		} catch (err) {
	    	console.log(err);
	    }
	}

	async saveDataFlowInFlowOut(modelling_id, user_description){
		let that = this;
		try{
			// Egyedi azonosító az aktuálsi adatbetöltéshez (több együttes betöltésnél meg kell különböztetni)
			let dataloadUniqId = uniqid();

			const m = await Modelling.findById(modelling_id);
			for(let i=0; i<that.data.length; i++){
				let p = await Profile.findByNameRiver(that.data[i].B, m.river_id);

				//Ha nem létezik még a szelvény a vízfolyásra, akkor létrehoz
				if(!p){		
					p = new Profile(null, that.data[i].B, m.river_id);
					p = await p.save();
				}
				//console.log(p);
				let ti = await TimeInterval.findByName(that.data[i].E);
				//console.log(ti);

				let type = 'FLOWINOUT';

				let fm = new DataMeta(null, that.data[i].A, null, null, ti.id, that.data[i].unit, modelling_id, p.id, that.data[i].F, user_description, type);
				fm = await fm.save();
				let date_from = moment("3000-01-01 01:01", "YYYY-MM-DD HH:mm");
				let date_to = moment("1900-01-01 01:01", "YYYY-MM-DD HH:mm");

				
					
				let pool = new sql.ConnectionPool(sqlConfig);
				let dbConn = await pool.connect();

				const table = new sql.Table('TmpFlow') // or temporary table, e.g. #temptable
				//table.create = true
				table.columns.add('date_time_for', sql.NVarChar, {nullable: true});
				table.columns.add('value', sql.Float, {nullable: true});
				table.columns.add('data_meta_id', sql.Int, {nullable: true});
				table.columns.add('uniqid', sql.NVarChar, {nullable: true});
				table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
				table.columns.add('createdAt', sql.NVarChar, {nullable: true});

				that.data[i].values.forEach(async function(v){
					date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
					date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;

					let ca = moment().format("YYYY-MM-DD HH:mm:ss");
					table.rows.add(v.datetime, v.val, fm.id, dataloadUniqId, ca, ca);

				});

				const request = new sql.Request(dbConn);
				let result = await request.bulk(table);

				const request_move = new sql.Request(dbConn);

				let result1 = await request_move.query('INSERT INTO dbo.FlowInOut(date_time_for, value, data_meta_id, updatedAt, createdAt) '+
					'SELECT date_time_for, value, data_meta_id, updatedAt, createdAt FROM dbo.TmpFlow WHERE uniqid=\''+dataloadUniqId+'\'; '+
					'TRUNCATE TABLE dbo.TmpFlow;');
				
				pool.close();
				

				fm.date_from = date_from.format("YYYY-MM-DD HH:mm:ss");
				fm.date_to = date_to.format("YYYY-MM-DD HH:mm:ss");
				fm.update();
			}
			
			return true;
		} catch (err) {
	    	console.log(err);
	    }
	}

}

module.exports = DataLoader;