/** modelling.js **/
const sql = require('mssql');
const moment = require('moment');
moment.locale('hu');

class FlowInOut{
	// constructor(id, date_time_for, value, data_meta_id, flow_meta_projekt_name=null, createdAt=null, updatedAt=null){
	// 	this.id = id;
	// 	this.date_time_for = date_time_for;
	// 	this.value = value;
	// 	this.data_meta_id = data_meta_id;
	// 	this.flow_meta_projekt_name = flow_meta_projekt_name;
	// 	createdAt ? this.createdAt = createdAt : this.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
	// 	updatedAt ? this.updatedAt = updatedAt : this.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	// }

	// static async all(){		
	//     try {
	//     	let pool = new sql.ConnectionPool(sqlConfig);
	//     	await pool.connect();
	//         let result = await pool.request().query('SELECT FlowInOut.*, Data_meta.projekt_name as projekt_name FROM FlowInOut LEFT JOIN Data_meta ON FlowInOut.data_meta_id=Data_meta.id');
	//         pool.close();
	//         if(result.recordset.length != 0){
	//         	let returnArray = [];
	//         	for(let r of result.recordset){
	//         		returnArray.push(new FlowInOut(r.id, r.date_time_for, r.value, r.data_meta_id, r.projekt_name));
	//         	}
	//         	return returnArray;
	//         }
	//         else
	//         	return null;

	//     } catch (err) {
	//     	console.log(err);
	//     }
	// }

	// static async findById(id){
	//     try {
	//     	let pool = new sql.ConnectionPool(sqlConfig);
	//     	await pool.connect();
	//         let result = await pool.request()
	//             .input('input_parameter', sql.Int, id)
	//             .query('SELECT FlowInOut.*, Data_meta.projekt_name as projekt_name FROM FlowInOut '+
	//             	'LEFT JOIN Data_meta ON FlowInOut.data_meta_id=Data_meta.id '+
	//             	'WHERE FlowInOut.id = @input_parameter');
	//         pool.close();
	//         // console.log(result.recordset[0]);
	//         if(result.recordset.length != 0)
	//         	return new FlowInOut(result.recordset[0]['id'], 
	//         			result.recordset[0]['date_time_for'],
	//         			result.recordset[0]['value'],
	//         			result.recordset[0]['data_meta_id'],
	//         			result.recordset[0]['projekt_name']);
	//         else
	//         	return null;

	//     } catch (err) {
	//         console.log(err);
	//     }
	// }

	// static async findByMetaData(id){
	//     try {
	//     	let pool = new sql.ConnectionPool(sqlConfig);
	//     	await pool.connect();
	//         let result = await pool.request()
	//             .input('input_parameter', sql.Int, id)
	//             .query('SELECT FlowInOut.*, Data_meta.projekt_name as projekt_name FROM FlowInOut '+
	//             	'LEFT JOIN Data_meta ON FlowInOut.data_meta_id=Data_meta.id '+
	//             	'WHERE FlowInOut.data_meta_id = @input_parameter ORDER BY FlowInOut.date_time_for;');
	//         pool.close();
	//         // console.log(result.recordset[0]);
	//         if(result.recordset.length != 0){
	//         	let returnArray = [];
	//         	for(let r of result.recordset){
	//         		returnArray.push(new FlowInOut(r.id, r.date_time_for, r.value, r.data_meta_id, r.projekt_name));
	//         	}
	//         	return returnArray;
	//         }
	//         else
	//         	return null;

	//     } catch (err) {
	//         console.log(err);
	//     }
	// }

	// //Minden adatpont lekérdezése
	// static async findByMetaDataAndDate(id, date_from, date_to){
	//     try {
	//     	let d_from = moment(date_from, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	//     	let d_to = moment(date_to, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	//     	let pool = new sql.ConnectionPool(sqlConfig);
	//     	await pool.connect();
	//         let result = await pool.request()
	//             .input('input_parameter', sql.Int, id)
	//             .input('date_from', sql.NVarChar, d_from)
	// 			.input('date_to', sql.NVarChar, d_to)
	//             .query('SELECT FlowInOut.*, Data_meta.projekt_name as projekt_name FROM FlowInOut '+
	//             	'LEFT JOIN Data_meta ON FlowInOut.data_meta_id=Data_meta.id '+
	//             	'WHERE FlowInOut.data_meta_id = @input_parameter '+
	//             	'AND FlowInOut.date_time_for >= @date_from '+
	//             	'AND FlowInOut.date_time_for <= @date_to '+
	//             	'ORDER BY FlowInOut.date_time_for;');
	//         pool.close();
	//         //console.log(result.recordset[0]);
	//         if(result.recordset.length != 0){
	//         	let returnArray = [];
	//         	for(let r of result.recordset){
	//         		returnArray.push(new FlowInOut(r.id, r.date_time_for, r.value, r.data_meta_id, r.projekt_name));
	//         	}
	//         	return returnArray;
	//         }
	//         else
	//         	return null;

	//     } catch (err) {
	//         console.log(err);
	//     }
	// }

	//Napi átlag vízhozam adat lekérdezése
	static async findByMetaDataAndDateDailyAVG(id, date_from, date_to, isIn){
	    try {
			let inOutFiler = '';
			if(isIn){
				inOutFiler = 'AND FlowInOut.value >= 0 ';
			}else{
				inOutFiler = 'AND FlowInOut.value < 0 ';
			}
	    	let d_from = moment(date_from, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	    	let d_to = moment(date_to, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	    	let pool = new sql.ConnectionPool(sqlConfig);
	    	await pool.connect();
	        let result = await pool.request()
	            .input('input_parameter', sql.Int, id)
	            .input('date_from', sql.NVarChar, d_from)
				.input('date_to', sql.NVarChar, d_to)
				.query('SELECT CAST(date_time_for AS DATE) date_time_for, ROUND(AVG([value]),6) value FROM FlowInOut '+
							'LEFT JOIN Data_meta ON FlowInOut.data_meta_id=Data_meta.id '+
							'WHERE FlowInOut.data_meta_id = @input_parameter '+
							inOutFiler+
							'AND FlowInOut.date_time_for >= @date_from '+
	            			'AND FlowInOut.date_time_for < @date_to '+
							'GROUP BY CAST(date_time_for AS DATE) '+
							'ORDER BY CAST(date_time_for AS DATE)');
	        pool.close();
	        //console.log(result.recordset[0]);
	        if(result.recordset.length != 0){
	        	let returnArray = [];
	        	for(let r of result.recordset){
	        		returnArray.push({date_time_for: moment(r.date_time_for, "YYYY-MM-DD HH:mm").format("YYYY. MM. DD."), value: r.value});
	        	}
	        	return returnArray;
	        }
	        else
	        	return null;

	    } catch (err) {
	        console.log(err);
	    }
	}

	// //Napi átfolyt vízmennyiség adat lekérdezése
	// static async findByMetaDataAndDateDailySum(id, date_from, date_to){
	//     try {
	//     	let d_from = moment(date_from, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	//     	let d_to = moment(date_to, "YYYY. MM. DD.").format("YYYY-MM-DD HH:mm");
	//     	let pool = new sql.ConnectionPool(sqlConfig);
	//     	await pool.connect();
	//         let result = await pool.request()
	//             .input('input_parameter', sql.Int, id)
	//             .input('date_from', sql.NVarChar, d_from)
	// 			.input('date_to', sql.NVarChar, d_to)
	// 			.query('SELECT CAST(date_time_for AS DATE) date_time_for, ROUND(AVG([value]),6) value FROM FlowInOut '+
	// 						'LEFT JOIN Data_meta ON FlowInOut.data_meta_id=Data_meta.id '+
	// 						'WHERE FlowInOut.data_meta_id = @input_parameter '+
	// 						'AND FlowInOut.date_time_for >= @date_from '+
	//             			'AND FlowInOut.date_time_for <= @date_to '+
	// 						'GROUP BY CAST(date_time_for AS DATE) '+
	// 						'ORDER BY CAST(date_time_for AS DATE)');
	//         pool.close();
	//         //console.log(result.recordset[0]);
	//         if(result.recordset.length != 0){
	//         	let returnArray = [];
	//         	for(let r of result.recordset){
	// 				let daily_sum = r.value * 86400;
	//         		returnArray.push({date_time_for: moment(r.date_time_for, "YYYY-MM-DD HH:mm").format("YYYY. MM. DD."), value: parseFloat(daily_sum.toFixed(6))});
	//         	}
	//         	return returnArray;
	//         }
	//         else
	//         	return null;

	//     } catch (err) {
	//         console.log(err);
	//     }
	// }

	// async save(){
	// 	let that = this;
	// 	try{
	// 		let pool = new sql.ConnectionPool(sqlConfig);
	// 		let dbConn = await pool.connect();
	// 		let transaction = new sql.Transaction(dbConn);
	// 		await transaction.begin();
	// 		const request = new sql.Request(transaction);
	// 		request.input('date_time_for', sql.NVarChar, that.date_time_for);
	// 		request.input('value', sql.Float, that.value);
	// 		request.input('data_meta_id', sql.NVarChar, that.data_meta_id);
	// 		request.input('createdAt', sql.NVarChar, that.createdAt);
	// 		request.input('updatedAt', sql.NVarChar, that.updatedAt);
	// 		let result = await request.query('INSERT INTO FlowInOut (date_time_for, value, data_meta_id, createdAt, updatedAt) '
	// 			+'OUTPUT Inserted.id VALUES (@date_time_for, @value, @data_meta_id, @createdAt, @updatedAt);');
	// 		that.id = result.recordset[0]['id'];
	// 		await transaction.commit();
	// 		pool.close();
	// 		return that;
	// 	}catch (err){
	// 		console.log(err);
	// 	}
	// }

	// async update(){
	// 	let that = this;
	// 	that.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
	// 	try{
	// 		let pool = new sql.ConnectionPool(sqlConfig);
	// 		let dbConn = await pool.connect();
	// 		let transaction = new sql.Transaction(dbConn);
	// 		await transaction.begin();
	// 		const request = new sql.Request(transaction);
	// 		request.input('id', sql.NVarChar, that.id);
	// 		request.input('date_time_for', sql.NVarChar, that.date_time_for);
	// 		request.input('value', sql.Float, that.value);
	// 		request.input('data_meta_id', sql.NVarChar, that.data_meta_id);
	// 		request.input('updatedAt', sql.NVarChar, that.updatedAt);
	// 		let result = await request.query('UPDATE FlowInOut SET '
	// 			+'date_time_for=@date_time_for, value=@value, data_meta_id=@data_meta_id, updatedAt=@updatedAt WHERE id=@id;');
	// 		//console.log(result);
	// 		await transaction.commit();
	// 		pool.close();
	// 		return that;
	// 	}catch (err){
	// 		console.log(err);
	// 	}
	// }
}
module.exports = FlowInOut;