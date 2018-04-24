/** profile.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class DateTime{
	constructor(id, dt, createdAt=null, updatedAt=null){
		this.id = id;
		this.dt = moment(dt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss");
		createdAt ? this.createdAt = moment(createdAt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss") : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = moment(updatedAt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss") : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT id, CONVERT(VARCHAR, dt, 120) as dt_, createdAt, updatedAt FROM DateTime');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		//console.log(r.dt_);
	        		//console.log(moment(r.dt_).format("YYYY-MM-DD HH:mm:ss"));
	        		returnArray.push(new DateTime(r.id, r.dt_, r.createdAt, r.updatedAt));
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
	            .query('SELECT id, CONVERT(VARCHAR, dt, 120) as dt_, createdAt, updatedAt FROM DateTime '+
	            	'WHERE id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new DateTime(result.recordset[0]['id'], 
	        			result.recordset[0]['dt_']);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByDt(n){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.NVarChar, n)
	            .query('SELECT id, CONVERT(VARCHAR, dt, 120) as dt_, createdAt, updatedAt FROM DateTime '+
	            	'WHERE dt = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new DateTime(result.recordset[0]['id'], 
	        			result.recordset[0]['dt_']);
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
			request.input('dt', sql.NVarChar, that.dt);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO DateTime (dt, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@dt, @createdAt, @updatedAt);');
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
			request.input('dt', sql.NVarChar, that.dt);
			request.input('river_id', sql.NVarChar, that.river_id);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE DateTime SET '
				+'dt=@dt, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = DateTime;