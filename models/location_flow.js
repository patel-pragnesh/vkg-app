/** profile.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class LocationFlow{
	constructor(id, date_time_id, profile_id, modelling_id, createdAt=null, updatedAt=null){
		this.id = id;
		this.date_time_id = date_time_id;
		this.profile_id = profile_id;
		this.modelling_id = modelling_id;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT * FROM LocationFlow');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationFlow(r.id, r.date_time_id, r.profile_id));
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
	            .query('SELECT * FROM LocationFlow '+
	            	'WHERE id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new LocationFlow(result.recordset[0]['id'], 
	        			result.recordset[0]['date_time_id'],
	        			result.recordset[0]['profile_id']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByModelling(n){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.Int, n)
	            .query('SELECT * FROM LocationFlow '+
	            	'WHERE modelling_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationFlow(r.id, r.date_time_id, r.profile_id, r.modelling_id));
	        	}
	        	return returnArray;
	        }else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByProfile(n){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.Int, n)
	            .query('SELECT * FROM LocationFlow '+
	            	'WHERE profile_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationFlow(r.id, r.date_time_id, r.profile_id));
	        	}
	        	return returnArray;
	        }else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByDateTime(n){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.Int, n)
	            .query('SELECT * FROM LocationFlow '+
	            	'WHERE date_time_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationFlow(r.id, r.date_time_id, r.profile_id));
	        	}
	        	return returnArray;
	        }else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByProfileDateTime(p, dt){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.Int, p)
	            .input('input_parameter2', sql.Int, dt)
	            .query('SELECT * FROM LocationFlow '+
	            	'WHERE date_time_id = @input_parameter2 AND profile_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationFlow(r.id, r.date_time_id, r.profile_id));
	        	}
	        	return returnArray;
	        }else
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
			request.input('date_time_id', sql.Int, that.date_time_id);
			request.input('profile_id', sql.Int, that.profile_id);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO LocationFlow (date_time_id, profile_id, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@date_time_id, @profile_id, @createdAt, @updatedAt);');
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
			request.input('date_time_id', sql.Int, that.date_time_id);
			request.input('profile_id', sql.Int, that.profile_id);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE LocationFlow SET '
				+'date_time_id=@date_time_id, profile_id=@profile_id, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = LocationFlow;