/** directorate.js **/
const sql = require('mssql');
// var schemas = require("./schemas.js");
// var _ = require("lodash");
const moment = require('moment');
moment.locale('hu');

class Directorate{
	constructor(name){
		this.id = null;
		this.name = name;
		this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static all(callback){
		(async function () {
		    try {
		    	let pool = await sql.connect(sqlConfig);
		        let result = await pool.request().query('select * from Directorate');
		        sql.close();
		        pool.close();
		        if(result.recordset.length != 0){
		        	let returnArray = [];
		        	for(let r of result.recordset){
		        		returnArray.push({id:r.id, name: r.name});
		        	}
		        	callback(null, returnArray);
		        }
		        else
		        	callback(null, null);

		    } catch (err) {
		    	callback(err, null);
		    }
		})()
	 
		sql.on('error', err => {
		    // ... error handler
		})
	}

	static findById(id, callback){
		(async function () {
		    try {
		    	let pool = await sql.connect(sqlConfig);
		        let result = await pool.request()
		            .input('input_parameter', sql.Int, id)
		            .query('select * from Directorate where id = @input_parameter')
		        sql.close();    
		        pool.close();
		        if(result.recordset.length != 0)
		        	callback(null, new Directorate(result.recordset[0]['name']));
		        else
		        	callback(null, null);

		    } catch (err) {
		        callback(err, null);
		    }
		})()
	 
		sql.on('error', err => {
		    // ... error handler
		})
	}

	save(){
		return new Promise((resolve, reject) => {
	      let that = this;
		//let now_data_time = moment().format("YYYY-MM-DD HH:mm:ss");
		let dbConn = new sql.connect(sqlConfig,
		    function (err) {
		        let transaction = new sql.Transaction(dbConn);
		        transaction.begin(function (error) {
		            let rollBack = false;
		            transaction.on('rollback',
		                function (aborted) {
		                    rollBack = true;
		                });
		            new sql.Request(transaction)
		            	.input('name', sql.NVarChar, that.name)
		            	.input('createdAt', sql.NVarChar, that.createdAt)
		            	.input('updatedAt', sql.NVarChar, that.updatedAt)
		                .query("INSERT INTO Directorate (Name, createdAt, updatedAt) VALUES (@name, @createdAt, @updatedAt);SELECT SCOPE_IDENTITY() AS id;",
		                function (err, recordset, affected) {

		                	that.id = recordset.recordset[0]['id'];
		                    if (err) {
		                        if (!rollBack) {
		                            transaction.rollback(function (err) {
		                                console.log(err);
		                            });
		                        }
		                    } else {
		                        transaction.commit().then(function (recordset) {
		                        	console.log('Database insert operation:');
		                            console.dir(that);
		                            sql.close();
		                            resolve(that);
		                        }).catch(function (err) {
		                            console.log('Error in transaction commit ' + err);
		                        });
		                    }
		                });
		        });
		    });
	    });

	}

	update(){
		return new Promise((resolve, reject) => {
	      	let that = this;
	      	that.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
			let dbConn = new sql.connect(sqlConfig,
		    function (err) {
		        let transaction = new sql.Transaction(dbConn);
		        transaction.begin(function (error) {
		            let rollBack = false;
		            transaction.on('rollback',
		                function (aborted) {
		                    rollBack = true;
		                });
		            new sql.Request(transaction)
		            	.input('id', sql.NVarChar, that.id)
		            	.input('name', sql.NVarChar, that.name)
		            	.input('updatedAt', sql.NVarChar, that.updatedAt)
		                .query("UPDATE Directorate SET Name=@name, updatedAt=@updatedAt WHERE id=@id;",
		                function (err) {
		                    if (err) {
		                        if (!rollBack) {
		                            transaction.rollback(function (err) {
		                                console.log(err);
		                            });
		                        }
		                    } else {
		                        transaction.commit().then(function () {
		                        	console.log('Database update operation:');
		                            console.dir(that);
		                            sql.close();
		                            resolve(that);
		                        }).catch(function (err) {
		                            console.log('Error in transaction commit ' + err);
		                        });
		                    }
		                });
		        });
		    });
	    });
	}
}
module.exports = Directorate;