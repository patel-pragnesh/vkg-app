"use strict";
/** directorate.js **/
const sql = require('mssql');
var schemas = require("./schemas.js");
var _ = require("lodash");

class Directorate{
	constructor(name){
		this.name = name;
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
		// Insert data - Start
		var dbConn = new sql.connect(sqlConfig,
		    function (err) {
		        var myTransaction = new sql.Transaction(dbConn);
		        myTransaction.begin(function (error) {
		            var rollBack = false;
		            myTransaction.on('rollback',
		                function (aborted) {
		                    rollBack = true;
		                });
		            new sql.Request(myTransaction)
		                .query("INSERT INTO Directorate (Name) VALUES ('Node js')",
		                function (err, recordset) {
		                    if (err) {
		                        if (!rollBack) {
		                            myTransaction.rollback(function (err) {
		                                console.dir(err);
		                            });
		                        }
		                    } else {
		                        myTransaction.commit().then(function (recordset) {
		                            console.dir('Data is inserted successfully!');
		                        }).catch(function (err) {
		                            console.dir('Error in transaction commit ' + err);
		                        });
		                    }
		                });
		        });
		    });
		// Insert data - End
		// var connection = sql.connect(sqlConfig, function(err) {
		//     var transaction = new sql.Transaction(connection);
		//     transaction.begin(function(err) {
		//         console.log('begin transaction');
  //   			    const request = new connection.Request(transaction);
		// 		    request.query('insert into `Directorate` (`name`) values ("Teszt")', (err, result) => {
		// 		        // ... error checks
		// 		 		console.log(result);
		// 		        transaction.commit(err => {
		// 		            // ... error checks

		// 		            if(err)
		// 		            	console.log("2: "+err);
		// 		 			else
		// 		            	console.log("Transaction committed.")
		// 		        })
		// 		    });
		//     });
		// });
		// (async function () {
		//     try {
		//         let pool = await sql.connect(sqlConfig);
		//         const transaction = new sql.Transaction(pool/* [pool] */);
		// 		transaction.begin(err => {
		// 		    // ... error checks
		// 		 	if(err)
		//             	console.log("1: "+err);
		//             else{
		// 			    // const request = new sql.Request(transaction);
		// 			    // request.query('insert into Directorate (name) values ("Teszt")', (err, result) => {
		// 			    //     // ... error checks
					 
		// 			    //     transaction.commit(err => {
		// 			    //         // ... error checks

		// 			    //         if(err)
		// 			    //         	console.log("2: "+err);
		// 			 			// else
		// 			    //         	console.log("Transaction committed.")
		// 			    //     })
		// 			    // });
		// 			}
		// 		})
		//         // const transaction = pool.transaction();
		//         // const request = transaction.request();
		//         // request.input('name', sql.NVarChar, 'teszt');
		//         // request.query('INSERT INTO Directorate (name) values (@name)', (err, result)=>{
	 //        	// 	transaction.commit
		//         // });
		//         sql.close();    
		//         pool.close();
		//         //callback(null, self);

		//     } catch (err) {
		//         console.log(err);
		//     }
		// })()
	 
		// sql.on('error', err => {
		//     // ... error handler
		// })
	}
}

// Directorate.prototype.sanitize = function (data) {
//     data = data || {};
//     schema = schemas.directorate;
//     return _.pick(_.defaults(data, schema), _.keys(schema)); 
// }

// Directorate.prototype.save = function(callback){
// 	var self = this;
// 	//TODO: mssql hívás

// 	(async function () {
// 	    try {
// 	        let pool = await sql.connect(sqlConfig);
// 	        const transaction = pool.transaction();
// 	        const request = transaction.request();
// 	        request.query('insert into Directorates () values ()', (err, result)=>{
//         		transaction.commit
// 	        });

// 	        //callback(null, self);

// 	    } catch (err) {
// 	        console.log(err);
// 	    }
// 	})()
 
// 	sql.on('error', err => {
// 	    // ... error handler
// 	})
// }

module.exports = Directorate;