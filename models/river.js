/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class River{
	constructor(id, name, directorate_id=null, directorate_name=null, parent_id=null, parent_connect_profile_id=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.name = name;
		this.directorate_id = directorate_id;
		this.directorate_name = directorate_name;
		this.parent_id = parent_id;
		this.parent_connect_profile_id = parent_connect_profile_id;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static async all(){		
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request().query('select River.*, Directorate.name as directorate_name FROM River LEFT JOIN Directorate ON River.directorate_id=Directorate.id');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new River(r.id, r.name, r.directorate_id, r.directorate_name, r.parent_id, r.parent_connect_profile_id));
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
	            .query('select River.*, Directorate.name as directorate_name FROM River LEFT JOIN Directorate ON River.directorate_id=Directorate.id WHERE River.id = @input_parameter')
	        pool.close();
	        if(result.recordset.length != 0)
	        	return new River(result.recordset[0]['id'], 
	        			result.recordset[0]['name'],
	        			result.recordset[0]['directorate_id'],
						result.recordset[0]['directorate_name'],
						result.recordset[0]['parent_id'],
						result.recordset[0]['parent_connect_profile_id'],
					);
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByDirectorate(id){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter', sql.Int, id)
	            .query('select * from River where directorate_id = @input_parameter AND parent_id IS NULL')
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new River(r.id, r.name, r.directorate_id, r.parent_id, r.parent_connect_profile_id));
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
			request.input('directorate_id', sql.Int, that.directorate_id);
			request.input('parent_id', sql.Int, that.parent_id);
			request.input('parent_connect_profile_id', sql.Int, that.parent_connect_profile_id);
			request.input('createdAt', sql.NVarChar, that.createdAt);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('INSERT INTO River (name,directorate_id, parent_id, parent_connect_profile_id, createdAt, updatedAt) '
				+'OUTPUT Inserted.id VALUES (@name, @directorate_id, @parent_id, @parent_connect_profile_id, @createdAt, @updatedAt);');
			//console.log(result);
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
			request.input('directorate_id', sql.Int, that.directorate_id);
			request.input('parent_id', sql.Int, that.parent_id);
			request.input('parent_connect_profile_id', sql.Int, that.parent_connect_profile_id);
			request.input('updatedAt', sql.NVarChar, that.updatedAt);
			let result = await request.query('UPDATE River SET '
				+'name=@name, directorate_id=@directorate_id, parent_id=@parent_id, parent_connect_profile_id=@parent_connect_profile_id, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = River;