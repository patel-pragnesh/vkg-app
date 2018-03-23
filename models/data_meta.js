/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class DataMeta{
	constructor(id, projekt_name, date_from, date_to, time_interval_id, unit, modelling_id, profile_id, additional_description, type=null, time_interval_name=null, profile_name=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.projekt_name = projekt_name;
		this.date_from = date_from;
		this.date_to = date_to;
		this.time_interval_id = time_interval_id;
		this.unit = unit;
		this.modelling_id = modelling_id;
		this.profile_id = profile_id;
		this.additional_description = additional_description;
		this.type = type;
		this.time_interval_name = time_interval_name;
		this.profile_name = profile_name;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT Data_meta.* FROM Data_meta;');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new DataMeta(r.id, r.projekt_name, r.date_from, r.date_to, r.time_interval_id, r.unit, r.modelling_id, r.profile_id, r.additional_description, r.type));
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
	            .query('SELECT Data_meta.* FROM Data_meta '+
	            	'WHERE Data_meta.id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new DataMeta(result.recordset[0]['id'], 
	        			result.recordset[0]['projekt_name'],
	        			moment(result.recordset[0]['date_from'], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"),
	        			moment(result.recordset[0]['date_to'], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"),
	        			result.recordset[0]['time_interval_id'],
	        			result.recordset[0]['unit'],
	        			result.recordset[0]['modelling_id'],
	        			result.recordset[0]['profile_id'],
	        			result.recordset[0]['additional_description'],
	        			result.recordset[0]['type']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByModelling(modelling_id){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter', sql.Int, modelling_id)
	            .query('SELECT Data_meta.*, Time_interval.name as time_interval_name, Profile.name as profile_name FROM Data_meta '+
	            	'LEFT JOIN Time_interval ON Data_meta.time_interval_id=Time_interval.id '+
	            	'LEFT JOIN Profile ON Data_meta.profile_id=Profile.id '+
	            	'WHERE Data_meta.modelling_id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new DataMeta(r.id, r.projekt_name, 
	        			moment(r.date_from, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"), 
	        			moment(r.date_to, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"), 
	        			r.time_interval_id, r.unit, r.modelling_id, r.profile_id, r.additional_description, r.type, r.time_interval_name, r.profile_name));
	        	}
	        	return returnArray;
	        }
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByDate(profile_id, type, date_from, date_to){
	    try {
	    	let d_from = moment(date_from, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	    	let d_to = moment(date_to, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('profile_id', sql.Int, profile_id)
	            .input('type', sql.NVarChar, type)
	            .input('date_from', sql.NVarChar, d_from)
				.input('date_to', sql.NVarChar, d_to)
	            .query('SELECT Data_meta.*, Time_interval.name as time_interval_name, Profile.name as profile_name FROM Data_meta '+
	            	'LEFT JOIN Time_interval ON Data_meta.time_interval_id=Time_interval.id '+
	            	'LEFT JOIN Profile ON Data_meta.profile_id=Profile.id '+
	            	'WHERE Data_meta.profile_id = @profile_id AND Data_meta.type=@type AND '+
	            	'Data_meta.date_from !> @date_to AND '+
	            	'Data_meta.date_to !< @date_from AND '+
	            	'('+
	            	'(Data_meta.date_from <= @date_from AND Data_meta.date_to >= @date_to) OR '+
	            	'(Data_meta.date_from >= @date_from AND Data_meta.date_to >= @date_to) OR '+
	            	'(Data_meta.date_from <= @date_from AND Data_meta.date_to <= @date_to) OR '+
	            	'(Data_meta.date_from >= @date_from AND Data_meta.date_to <= @date_to)'+
	            	')');
	        pool.close();
	        // console.log(result.recordset);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new DataMeta(r.id, r.projekt_name, 
	        			moment(r.date_from, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"), 
	        			moment(r.date_to, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"), 
	        			r.time_interval_id, r.unit, r.modelling_id, r.profile_id, r.additional_description, r.type, r.time_interval_name, r.profile_name));
	        	}
	        	return returnArray;
	        }
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
			request.input('profile_id', sql.NVarChar, that.profile_id);
			request.input('additional_description', sql.NVarChar, that.additional_description);
			request.input('type', sql.NVarChar, that.type);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO Data_meta (projekt_name, date_from, date_to, time_interval_id, unit, modelling_id, profile_id, additional_description, type, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@projekt_name, @date_from, @date_to, @time_interval_id, @unit, @modelling_id, @profile_id, @additional_description, @type, @createdAt, @updatedAt);');
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
			request.input('profile_id', sql.NVarChar, that.profile_id);
			request.input('additional_description', sql.NVarChar, that.additional_description);
			request.input('type', sql.NVarChar, that.type);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE Data_meta SET '
				+'projekt_name=@projekt_name, date_from=@date_from, date_to=@date_to, time_interval_id=@time_interval_id, '
				+'unit=@unit, modelling_id=@modelling_id, profile_id=@profile_id, additional_description=@additional_description, type=@type, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}

	async delete(){
		let that = this;
		try{
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			await transaction.begin();
			const request = new sql.Request(transaction);
			request.input('id', sql.NVarChar, that.id);
			let result = await request.query('DELETE FROM Data_meta WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = DataMeta;