/** directorate.js **/
const sql = require('mssql');
// var schemas = require("./schemas.js");
// var _ = require("lodash");
const moment = require('moment');
moment.locale('hu');

class Directorate{
	constructor(id, name, full_name=null, city=null, address=null, phone=null, email=null, map_id=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.name = name;
		this.full_name = full_name;
		this.city = city;
		this.address = address;
		this.phone = phone;
		this.email = email;
		this.map_id = map_id;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){
	    try {
			let pool = new sql.ConnectionPool(sqlConfig);
			//console.log(pool);
			await pool.connect();
			//console.log('Connected...');
	        let result = await pool.request().query('select * from Directorate');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new Directorate(r.id, r.name, r.full_name, r.city, r.address, r.phone, r.email,r.map_id));
	        	}
	        	return returnArray;
	        }
	        else
	        	return null;

	    } catch (err) {
	    	callback(err, null);
	    	pool.close();
	    }
	}

	static async findById(id){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter', sql.Int, id)
	            .query('select * from Directorate where id = @input_parameter')
	        pool.close();
	        if(result.recordset.length != 0)
	        	return new Directorate(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['full_name'],
	        			result.recordset[0]['city'],
	        			result.recordset[0]['address'],
	        			result.recordset[0]['phone'],
	        			result.recordset[0]['email'],
	        			result.recordset[0]['map_id'],
	        			result.recordset[0]['createdAt'],
	        			result.recordset[0]['updatedAt']);
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
			request.input('full_name', sql.NVarChar, that.full_name);
			request.input('city', sql.NVarChar, that.city);
			request.input('address', sql.NVarChar, that.address);
			request.input('phone', sql.NVarChar, that.phone);
			request.input('email', sql.NVarChar, that.email);
			request.input('map_id', sql.Int, that.map_id);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			// let result = await request.query("INSERT INTO Directorate (name, createdAt, updatedAt) VALUES (@name, @createdAt, @updatedAt);SELECT SCOPE_IDENTITY() AS id;");
			let result = await request.query("INSERT INTO Directorate (name, full_name, city, address, phone, email, map_id, createdAt, updatedAt) "
						+"OUTPUT Inserted.id VALUES (@name, @full_name, @city, @address, @phone, @email, @map_id, @createdAt, @updatedAt);");
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
			request.input('id', sql.Int, that.id);
			request.input('name', sql.NVarChar, that.name);
			request.input('full_name', sql.NVarChar, that.full_name);
			request.input('city', sql.NVarChar, that.city);
			request.input('address', sql.NVarChar, that.address);
			request.input('phone', sql.NVarChar, that.phone);
			request.input('email', sql.NVarChar, that.email);
			request.input('map_id', sql.Int, that.map_id);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query("UPDATE Directorate SET "
											+"name=@name, "
											+"full_name=@full_name, "
											+"city=@city, "
											+"address=@address, "
											+"phone=@phone, "
											+"email=@email, "
											+"map_id=@map_id, "
											+"updatedAt=@updatedAt "
											+"WHERE id=@id;");
			console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = Directorate;