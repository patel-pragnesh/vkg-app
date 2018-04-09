const fs = require('fs');
const util = require('util');
const readline = require('readline');
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

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
			line_array.forEach(function(l){
				let line_data = l.split(';');
				if(line_data[0] == 'A'){
					for (let i = 2; i<line_data.length; i++) {
						let data_item = {A:line_data[i].replace(/(\r\n|\n|\r)/gm,"")};
						data.push(data_item);
					}
				}else if(line_data[0] == 'B'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].B = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
					}
				}else if(line_data[0] == 'C'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].C = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
					}
				}else if(line_data[0] == 'E'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].E = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
					}
				}else if(line_data[0] == 'F'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].F = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
					}
				}else if(line_data[0] == 'Units'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].unit = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
					}
				}else if(line_data[0] == 'Type'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].type = line_data[i].replace(/(\r\n|\n|\r)/gm,"");	
					}
				}else{
					for (let i = 2; i<line_data.length; i++) {
						if(!data[i-2].values){
							data[i-2].values = [];
						}
						//let datetime = line_data[1].replace(/(\r\n|\n|\r)/gm,"");
						//console.log(datetime);
						data[i-2].values.push({nr: line_data[0].replace(/(\r\n|\n|\r)/gm,""), 
							datetime: moment(line_data[1].replace(/(\r\n|\n|\r)/gm,""), "DDMMMYYYY HHmm").format("YYYY-MM-DD HH:mm:ss"), 
							val: line_data[i].replace(',', '.').replace(/(\r\n|\n|\r)/gm,"")});	
					}
				}		
			});
			that.data = data;
			return that;
		}catch(err){
			console.log(err);
		}
	}

	async saveData(modelling_id){
		let that = this;
		try{
			//console.log("Modelling id: "+modelling_id);
			//console.log(that.data);
			console.log('Keresztmetszetek száma: '+that.data.length);
			console.log('Adatok száma a 0. keresztmetszetben: ');
			// console.log(that.data[0].values[80]);
			// return false;
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
				let fm = new DataMeta(null, that.data[i].A, null, null, ti.id, that.data[i].unit, modelling_id, p.id, that.data[i].F, that.data[i].C);
				fm = await fm.save();
				let date_from = moment("3000-01-01 01:01", "YYYY-MM-DD HH:mm");
				let date_to = moment("1900-01-01 01:01", "YYYY-MM-DD HH:mm");

				if(that.data[i].C == 'FLOW'){
					let counter = 1;
					console.log(counter);

					let pool = new sql.ConnectionPool(sqlConfig);
					let dbConn = await pool.connect();
					// sql.connect(sqlConfig)
				  	// .then(() => {
				 //  	let pool = new sql.ConnectionPool(sqlConfig);
					// let dbConn = await pool.connect();
					// let transaction = new sql.Transaction(dbConn);
					// await transaction.begin();
				    // console.log('connected');

				    const table = new sql.Table('TmpFlow') // or temporary table, e.g. #temptable
					//table.create = true
					table.columns.add('date_time_for', sql.NVarChar, {nullable: true});
					table.columns.add('value', sql.Float, {nullable: true});
					table.columns.add('data_meta_id', sql.Int, {nullable: true});
					table.columns.add('updatedAt', sql.NVarChar, {nullable: true});
					table.columns.add('createdAt', sql.NVarChar, {nullable: true});

				    that.data[i].values.forEach(async function(v){
				    	date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
						date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;

						let ca = moment().format("YYYY-MM-DD HH:mm:ss");

						//console.log(v.datetime);
						//if(counter==80){
						//	console.log(v);
						//	return;
						//}

						// v.datetime = v.datetime.replace('á', 'a');
						// v.datetime = v.datetime.replace('ú', 'u');
						table.rows.add(v.datetime, v.val, fm.id, ca, ca);

						console.log(counter);
						counter++;
					});

				    const request = new sql.Request(dbConn);
				    let result = await request.bulk(table);

				    const request_move = new sql.Request(dbConn);
			    	let result1 = await request_move.query('INSERT INTO dbo.Flow(date_time_for, value, data_meta_id, updatedAt, createdAt) '+
			    		'SELECT date_time_for, value, data_meta_id, updatedAt, createdAt FROM dbo.TmpFlow; '+
			    		'TRUNCATE TABLE dbo.TmpFlow;');
				    pool.close();
				    console.log(result1);
				    //return result;
					// })
					// .then(data => {
					// console.log(data);
					//sql.close();
					// })
					// .catch(err => {
					// console.log(err);
					//sql.close();
					// });					  
				}else if(that.data[i].C == 'FLOW-CUM'){
					that.data[i].values.forEach(function(v){
						date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
						date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;
						let f = new FlowCum(null, v.datetime, v.val, fm.id);
						f.save();
					});
				}else if(that.data[i].C == 'STAGE'){
					that.data[i].values.forEach(function(v){
						date_from = moment(v.datetime, "YYYY-MM-DD HH:mm") < date_from ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_from;
						date_to = moment(v.datetime, "YYYY-MM-DD HH:mm") > date_to ? moment(v.datetime, "YYYY-MM-DD HH:mm") : date_to;
						let f = new Stage(null, v.datetime, v.val, fm.id);
						f.save();
					});
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

}

module.exports = DataLoader;