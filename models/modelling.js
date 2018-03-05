/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class Modelling{
	constructor(id, name, description=null, date_for=null, river_id=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.name = name;
		this.description = description;
		this.date_for = date_for;
		this.river_id = river_id;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('select * from Modelling');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new Modelling(r.id, r.name, r.description, r.date_for));
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
	            .query('select * from Modelling where id = @input_parameter')
	        pool.close();
	        if(result.recordset.length != 0)
	        	return new Directorate(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['description'],
	        			result.recordset[0]['date_for'],
	        			result.recordset[0]['river_id']);
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
			request.input('description', sql.NVarChar, that.description);
			request.input('date_for', sql.NVarChar, that.date_for);
			request.input('river_id', sql.NVarChar, that.river_id);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO Modelling (name,description, date_for, river_id, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@name, @description, @date_for, @river_id, @createdAt, @updatedAt);');
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
			request.input('description', sql.NVarChar, that.description);
			request.input('date_for', sql.NVarChar, that.date_for);
			request.input('river_id', sql.NVarChar, that.river_id);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE Modelling SET '
				+'name=@name, description=@description, date_for=@date_for, river_id=@river_id, updatedAt=@updatedAt WHERE id=@id;');
			console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = Modelling;