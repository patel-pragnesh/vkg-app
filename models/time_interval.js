/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class TimeInterval{
	constructor(id, name, sort=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.name = name;
		this.sort = sort;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('select * from Time_interval');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new TimeInterval(r.id, r.name, r.sort));
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
	            .query('select * from Time_interval where id = @input_parameter')
	        pool.close();
	        if(result.recordset.length != 0)
	        	return new TimeInterval(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['sort']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByName(n){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter', sql.NVarChar, n)
	            .query('select * from Time_interval where name = @input_parameter')
	        pool.close();
	        // console.log(result);
	        if(result.recordset.length != 0)
	        	return new TimeInterval(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['sort']);
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
			request.input('sort', sql.NVarChar, that.sort);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO Time_interval (name, sort, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@name, @sort, @createdAt, @updatedAt);');
			console.log(result);
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
			request.input('sort', sql.NVarChar, that.sort);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE Time_interval SET '
				+'name=@name, sort=@sort, updatedAt=@updatedAt WHERE id=@id;');
			console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = TimeInterval;