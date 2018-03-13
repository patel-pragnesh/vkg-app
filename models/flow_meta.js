/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class FlowMeta{
	constructor(id, projekt_name, date_from, date_to, time_interval_id, unit, modelling_id, additional_description, createdAt=null, updatedAt=null){
		this.id = id;
		this.projekt_name = projekt_name;
		this.date_from = date_from;
		this.date_to = date_to;
		this.time_interval_id = time_interval_id;
		this.unit = unit;
		this.modelling_id = modelling_id;
		this.additional_description = additional_description;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT Flow_meta.* FROM Flow_meta;');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new Flow(r.id, r.projekt_name, r.date_from, r.date_to, r.time_interval_id, r.unit, r.modelling_id, r.additional_description));
	        	}
	        	return returnArray;
	        }
	        else
	        	return null;

	    } catch (err) {
	    	console.log(err);
	    }
	}

	static async findById(id){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter', sql.Int, id)
	            .query('SELECT Flow_meta.* FROM Flow_meta '+
	            	'WHERE Flow_meta.id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new Modelling(result.recordset[0]['id'], 
	        			result.recordset[0]['projekt_name'],
	        			result.recordset[0]['date_from'],
	        			result.recordset[0]['date_to'],
	        			result.recordset[0]['time_interval_id'],
	        			result.recordset[0]['unit'],
	        			result.recordset[0]['modelling_id'],
	        			result.recordset[0]['additional_description']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	async save(){
		let that = this;
		try{
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			await transaction.begin();
			const request = new sql.Request(transaction);
			request.input('projekt_name', sql.NVarChar, that.projekt_name);
			request.input('date_from', sql.NVarChar, that.date_from);
			request.input('date_to', sql.NVarChar, that.date_to);
			request.input('time_interval_id', sql.NVarChar, that.time_interval_id);
			request.input('unit', sql.NVarChar, that.unit);
			request.input('modelling_id', sql.NVarChar, that.modelling_id);
			request.input('additional_description', sql.NVarChar, that.additional_description);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO Flow_meta (projekt_name, date_from, date_to, time_interval_id, unit, modelling_id, additional_description, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@projekt_name, @date_from, @date_to, @time_interval_id, @unit, @modelling_id, @additional_description, @createdAt, @updatedAt);');
			that.id = result.recordset[0]['id'];
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}

	async update(){
		let that = this;
		that.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
		try{
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			await transaction.begin();
			const request = new sql.Request(transaction);
			request.input('id', sql.NVarChar, that.id);
			request.input('projekt_name', sql.NVarChar, that.projekt_name);
			request.input('date_from', sql.NVarChar, that.date_from);
			request.input('date_to', sql.NVarChar, that.date_to);
			request.input('time_interval_id', sql.NVarChar, that.time_interval_id);
			request.input('unit', sql.NVarChar, that.unit);
			request.input('modelling_id', sql.NVarChar, that.modelling_id);
			request.input('additional_description', sql.NVarChar, that.additional_description);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE Flow_meta SET '
				+'projekt_name=@projekt_name, date_from=@date_from, date_to=@date_to, time_interval_id=@time_interval_id, '
				+'unit=@unit, modelling_id=@modelling_id, additional_description=@additional_description, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = FlowMeta;