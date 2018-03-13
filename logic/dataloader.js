const fs = require('fs');
const util = require('util');
const readline = require('readline');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

const Modelling = require('../models/modelling');
const FlowMeta = require('../models/flow_meta');
const Flow = require('../models/flow');

class DataLoader{
	constructor(file_path){
		this.file_path = file_path;
		this.data = [];
	}

	async readFile(){
		let that = this;
		try{
			let data_from_file = await readFile(that.file_path, 'utf8');
			//console.log(data_from_file);
			let line_array = data_from_file.split('\n');
			//console.log(line_array);
			let data = [];
			line_array.forEach(function(l){
				let line_data = l.split(';');
				if(line_data[0] == 'A'){
					for (let i = 2; i<line_data.length; i++) {
						let data_item = {A:line_data[i]};
						data.push(data_item);
					}
				}else if(line_data[0] == 'B'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].B = line_data[i];	
					}
				}else if(line_data[0] == 'C'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].C = line_data[i];	
					}
				}else if(line_data[0] == 'E'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].E = line_data[i];	
					}
				}else if(line_data[0] == 'F'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].F = line_data[i];	
					}
				}else if(line_data[0] == 'Units'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].unit = line_data[i];	
					}
				}else if(line_data[0] == 'Type'){
					for (let i = 2; i<line_data.length; i++) {
						data[i-2].type = line_data[i];	
					}
				}else{
					for (let i = 2; i<line_data.length; i++) {
						if(!data[i-2].values){
							data[i-2].values = [];
						}
						data[i-2].values.push({nr: line_data[0], datetime: line_data[1], val: line_data[i]});	
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
			console.log("Modelling id: "+modelling_id);
			console.log(that.data[0]);
			//const m = await Modelling.findById(modelling_id);
			const fm = new FlowMeta(null, that.data[0].A, null, null, 1, that.data[0].unit, modelling_id, that.data[0].F);
			await fm.save();
			if(that.data[0].C == 'FLOW'){
				that.data[0].values.forEach(function(v){
					let f = new Flow(null, v.datetime, v.val);
					f.save();
				});
			}			
			return true;
		} catch (err) {
	    	console.log(err);
	    }
	}

}

module.exports = DataLoader;