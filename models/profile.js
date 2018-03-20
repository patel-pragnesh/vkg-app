/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class Profile{
	constructor(id, name, river_id, river_name=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.name = name;
		this.river_id = river_id;
		this.river_name = river_name;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT Profile.*, River.name as river_name FROM Profile LEFT JOIN River ON Profile.river_id=River.id');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new Profile(r.id, r.name, r.river_id, r.river_name));
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
	            .query('SELECT Profile.*, River.name as river_name FROM Profile '+
	            	'LEFT JOIN River ON Profile.river_id=River.id '+
	            	'WHERE Profile.id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new Profile(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['river_id'],
	        			result.recordset[0]['river_name']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByNameRiver(n, r_id){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.NVarChar, n)
	            .input('input_parameter2', sql.Int, r_id)
	            .query('SELECT Profile.*, River.name as river_name FROM Profile '+
	            	'LEFT JOIN River ON Profile.river_id=River.id '+
	            	'WHERE Profile.name = @input_parameter1 AND Profile.river_id = @input_parameter2');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new Profile(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['river_id'],
	        			result.recordset[0]['river_name']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByRiver(id){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        // let result = await pool.request().query('SELECT Profile.*, River.name as river_name FROM Profile LEFT JOIN River ON Profile.river_id=River.id');
	        let result = await pool.request()
	        	.input('input_parameter', sql.Int, id)
	        	.query('SELECT Profile.* FROM Profile WHERE Profile.river_id = @input_parameter');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new Profile(r.id, r.name, r.river_id));
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
			request.input('name', sql.NVarChar, that.name);
			request.input('river_id', sql.NVarChar, that.river_id);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO Profile (name, river_id, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@name, @river_id, @createdAt, @updatedAt);');
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
			request.input('name', sql.NVarChar, that.name);
			request.input('river_id', sql.NVarChar, that.river_id);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE Profile SET '
				+'name=@name, river_id=@river_id, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = Profile;