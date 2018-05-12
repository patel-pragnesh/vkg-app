/** profile.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class LocationStage{
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
	        let result = await pool.request().query('SELECT * FROM LocationStage');
	        pool.close();
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationStage(r.id, r.date_time_id, r.profile_id));
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
	            .query('SELECT * FROM LocationStage '+
	            	'WHERE id = @input_parameter');
	        pool.close();
	        // console.log(result.recordset[0]);
	        if(result.recordset.length != 0)
	        	return new LocationStage(result.recordset[0]['id'], 
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
	            .query('SELECT * FROM LocationStage '+
	            	'WHERE modelling_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationStage(r.id, r.date_time_id, 
	        			r.profile_id, r.modelling_id));
	        	}
	        	return returnArray;
	        }else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	//!!!NEM JÓ LEKÉRDEZÉS MERT TIMEOUTOL!!!
	static async findByModellingGroupByUserDescription(n){
		//console.log(n);
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.Int, n)
	            // .query('SELECT count(LocationStage.modelling_id) as modelling_count, LocationStage.description_id, CAST([Description].user_description AS NVARCHAR(200)) user_description '+
	            // 	'FROM LocationStage '+
	            // 	'LEFT JOIN Description ON LocationStage.description_id = Description.id '+
	            // 	'WHERE LocationStage.modelling_id = @input_parameter1 '+
				// 	'GROUP BY LocationStage.description_id, CAST([Description].user_description AS NVARCHAR(200)) ORDER BY LocationStage.description_id');
				.query('select [description_id], b.user_description '+
				'from '+
				'( '+
				'SELECT DISTINCT [description_id] FROM [LocationStage] a '+
				'WHERE [modelling_id]=@input_parameter1 '+
				') a '+
				'LEFT JOIN [vizkeszlet_gazdalkodas].[dbo].[Description] b ON a.description_id = b.id');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push({user_description: r.user_description, description_id: r.description_id, location_type:'location_stage'});
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
	            .query('SELECT * FROM LocationStage '+
	            	'WHERE profile_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationStage(r.id, r.date_time_id, r.profile_id));
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
	            .query('SELECT * FROM LocationStage '+
	            	'WHERE date_time_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationStage(r.id, r.date_time_id, r.profile_id));
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
	            .query('SELECT * FROM LocationStage '+
	            	'WHERE date_time_id = @input_parameter2 AND profile_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationStage(r.id, r.date_time_id, r.profile_id));
	        	}
	        	return returnArray;
	        }else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	static async findByProfileDateTimeModelling(p, dt, m){
	    try {
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter1', sql.Int, p)
	            .input('input_parameter2', sql.Int, dt)
	            .input('input_parameter3', sql.Int, m)
	            .query('SELECT * FROM LocationStage '+
	            	'WHERE date_time_id = @input_parameter2 '+
	            	'AND modelling_id = @input_parameter3 '+
	            	'AND profile_id = @input_parameter1');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push(new LocationStage(r.id, r.date_time_id, r.profile_id));
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
			let result = await request.query('INSERT INTO LocationStage (date_time_id, profile_id, createdAt, updatedAt) '
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
			let result = await request.query('UPDATE LocationStage SET '
				+'date_time_id=@date_time_id, profile_id=@profile_id, updatedAt=@updatedAt WHERE id=@id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}

	static async deleteByModellingIdDescriptionId(modelling_id, description_id){
		let that = this;
		//console.log(date_time_id);
		try{
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			await transaction.begin();
			const request = new sql.Request(transaction);
			request.input('modelling_id', sql.Int, modelling_id);
			request.input('description_id', sql.Int, description_id);
			let result = await request.query('DELETE FROM LocationStage WHERE modelling_id=@modelling_id AND description_id=@description_id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}

	static async deleteByDescriptionId(description_id){
		let that = this;
		//console.log(date_time_id);
		try{
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			await transaction.begin();
			const request = new sql.Request(transaction);
			request.input('description_id', sql.Int, description_id);
			let result = await request.query('DELETE FROM LocationStage WHERE description_id=@description_id;');
			//console.log(result);
			await transaction.commit();
			pool.close();
			return that;
		}catch (err){
			console.log(err);
		}
	}
}
module.exports = LocationStage;