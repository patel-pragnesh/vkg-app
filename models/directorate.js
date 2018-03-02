/** directorate.js **/
const sql = require('mssql');
// var schemas = require("./schemas.js");
// var _ = require("lodash");
const moment = require('moment');
moment.locale('hu');

class Directorate{
	constructor(id, name, full_name=null, city=null, address=null, phone=null, email=null, createdAt=null, updatedAt=null){
		this.id = id;
		this.name = name;
		this.full_name = full_name;
		this.city = city;
		this.address = address;
		this.phone = phone;
		this.email = email;
		createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
		updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	}

	static all(callback){
		(async function () {
		    try {
		    	let pool = new sql.ConnectionPool(sqlConfig);
		    	await pool.connect();
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

	static async findById(id, callback){
		// ( function () {
		    try {
		    	let pool = new sql.ConnectionPool(sqlConfig);
		    	await pool.connect();
		        let result = await pool.request()
		            .input('input_parameter', sql.Int, id)
		            .query('select * from Directorate where id = @input_parameter')
		        sql.close();    
		        pool.close();
		        if(result.recordset.length != 0)
		        	callback(null, 
		        		new Directorate(result.recordset[0]['id'], 
		        			result.recordset[0]['name'],
		        			result.recordset[0]['full_name'],
		        			result.recordset[0]['city'],
		        			result.recordset[0]['address'],
		        			result.recordset[0]['phone'],
		        			result.recordset[0]['email'],
		        			result.recordset[0]['createdAt'],
		        			result.recordset[0]['updatedAt']));
		        else
		        	callback(null, null);

		    } catch (err) {
		        callback(err, null);
		        sql.close();
		    }
		// })()
	 
		// sql.on('error', err => {
		//     // ... error handler
		// })
	}

	async save(){
		let that = this;
		try{
			let pool = new sql.ConnectionPool(sqlConfig);
			let dbConn = await pool.connect();
			let transaction = new sql.Transaction(dbConn);
			transaction.begin(function(error){
				let rollBack = false;
				transaction.on('rollback',
		        	function (aborted) {
		        		rollBack = true;
	        		});
				const request = new sql.Request(transaction)
		            .input('name', sql.NVarChar, that.name)
		            .input('createdAt', sql.NVarChar, that.createdAt)
		            .input('updatedAt', sql.NVarChar, that.updatedAt)
		            .query("INSERT INTO Directorate (name, createdAt, updatedAt) VALUES (@name, @createdAt, @updatedAt);SELECT SCOPE_IDENTITY() AS id;",
		            // .query("INSERT INTO Directorate (name, createdAt, updatedAt) OUTPUT Inserted.id VALUES (@name, @createdAt, @updatedAt);",
		                function (err, recordset, affected) {
		                	console.log(recordset);
		                	that.id = recordset.recordset[0]['id'];
		                    if (err) {
		                        if (!rollBack) {
		                            transaction.rollback(function (err) {
		                                console.log(err);
		                                sql.close();
		                            });
		                        }
		                    } else {
		                        transaction.commit().then(function (recordset) {
		                        	console.log('Database insert operation:');
		                            console.dir(that);
		                            sql.close();
		                            return(that);
		                        }).catch(function (err) {
		                            console.log('Error in transaction commit ' + err);
		                            sql.close();
		                        });
		                    }
		        });
			})
			
		}catch (err){

		}
		// return new Promise((resolve, reject) => {
	 //      let that = this;
		// //let now_data_time = moment().format("YYYY-MM-DD HH:mm:ss");
		// let dbConn = new sql.connect(sqlConfig,
		//     function (err) {
		//         let transaction = new sql.Transaction(dbConn);
		//         transaction.begin(function (error) {
		//             let rollBack = false;
		//             transaction.on('rollback',
		//                 function (aborted) {
		//                     rollBack = true;
		//                 });
		//             new sql.Request(transaction)
		//             	.input('name', sql.NVarChar, that.name)
		//             	.input('createdAt', sql.NVarChar, that.createdAt)
		//             	.input('updatedAt', sql.NVarChar, that.updatedAt)
		//                 .query("INSERT INTO Directorate (name, createdAt, updatedAt) VALUES (@name, @createdAt, @updatedAt);SELECT SCOPE_IDENTITY() AS id;",
		//                 // .query("INSERT INTO Directorate (name, createdAt, updatedAt) OUTPUT Inserted.id VALUES (@name, @createdAt, @updatedAt);",
		//                 function (err, recordset, affected) {
		//                 	console.log(recordset);
		//                 	that.id = recordset.recordset[0]['id'];
		//                     if (err) {
		//                         if (!rollBack) {
		//                             transaction.rollback(function (err) {
		//                                 console.log(err);
		//                                 sql.close();
		//                             });
		//                         }
		//                     } else {
		//                         transaction.commit().then(function (recordset) {
		//                         	console.log('Database insert operation:');
		//                             console.dir(that);
		//                             sql.close();
		//                             resolve(that);
		//                         }).catch(function (err) {
		//                             console.log('Error in transaction commit ' + err);
		//                             sql.close();
		//                         });
		//                     }
		//                 });
		//         });
		//     });
	 //    });

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
		                        sql.close();
		                    } else {
		                        transaction.commit().then(function () {
		                        	console.log('Database update operation:');
		                            console.dir(that);
		                            sql.close();
		                            resolve(that);
		                        }).catch(function (err) {
		                            console.log('Error in transaction commit ' + err);
		                            sql.close();
		                        });
		                    }
		                });
		        });
		    });
	    });
	}
}
module.exports = Directorate;