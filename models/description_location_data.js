/** description.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class DescriptionLocationData{
	constructor(id, additional_description, createdAt=null, updatedAt=null){
		this.id = id;
		this.additional_description = additional_description;
		createdAt ? this.createdAt = moment(createdAt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss") : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = moment(updatedAt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss") : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT id, additional_description, createdAt, updatedAt FROM DescriptionLocationData');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new DescriptionLocationData(r.id, r.additional_description, r.createdAt, r.updatedAt));
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
	            .query('SELECT id, additional_description, createdAt, updatedAt FROM DescriptionLocationData '+
	            	'WHERE id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new DescriptionLocationData(result.recordset[0]['id'],
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
			request.input('additional_description', sql.NVarChar, that.additional_description);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO DescriptionLocationData (additional_description, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@additional_description, @createdAt, @updatedAt);');
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
			request.input('additional_description', sql.NVarChar, that.additional_description);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE DescriptionLocationData SET '
				+'additional_description=@additional_description, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = DescriptionLocationData;