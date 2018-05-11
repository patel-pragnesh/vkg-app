/** description.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class Description{
	constructor(id, user_description, date_from, date_to, createdAt=null, updatedAt=null){
		this.id = id;
		this.user_description = user_description;
		this.date_from = date_from;
		this.date_to = date_to;
		createdAt ? this.createdAt = moment(createdAt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss") : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = moment(updatedAt)/*.subtract(2, 'hours')*/.format("YYYY-MM-DD HH:mm:ss") : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('SELECT id, user_description, date_from, date_to, createdAt, updatedAt FROM Description');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){					
					returnArray.push(new Description(r.id, 
						r.user_description, 
						moment(r.date_from, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"),
	        			moment(r.date_to, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm"),
						r.createdAt, 
						r.updatedAt));
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
	            .query('SELECT id, user_description, date_from, date_to, createdAt, updatedAt FROM Description '+
	            	'WHERE id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
			if(result.recordset.length != 0){
				let df = result.recordset[0]['date_from'] ? moment(result.recordset[0]['date_from'], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm") : null;
				let dt = result.recordset[0]['date_to'] ? moment(result.recordset[0]['date_to'], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm") : null;
	        	return new Description(result.recordset[0]['id'],
						result.recordset[0]['user_description'],
						df,
	        			dt);
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
			request.input('user_description', sql.NVarChar, that.user_description);
			request.input('date_from', sql.NVarChar, that.date_from);
			request.input('date_to', sql.NVarChar, that.date_to);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO Description (user_description, date_from, date_to, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@user_description, @date_from, @date_to, @createdAt, @updatedAt);');
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
			request.input('user_description', sql.NVarChar, that.user_description);
			request.input('date_from', sql.NVarChar, that.date_from);
			request.input('date_to', sql.NVarChar, that.date_to);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE Description SET '
				+'user_description=@user_description, date_from=@date_from, date_to=@date_to, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = Description;