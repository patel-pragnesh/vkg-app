/** directorate.js **/
const sql = require('mssql');
var schemas = require("./schemas.js");
var _ = require("lodash");


//private variable
var total = 0;

function Directorate(data){
	this.data = this.sanitize(data);
	total++;
}

Directorate.getTotalObjects = function(){
	return total;
}

Directorate.prototype.data = {}

Directorate.prototype.changeName = function (name){
	this.data.name = name;
}

Directorate.prototype.get = function(name){
	return this.data[name];
}

Directorate.prototype.set = function(name, value){
	this.data[name] = value;
}

Directorate.prototype.sanitize = function (data) {
    data = data || {};
    schema = schemas.directorate;
    return _.pick(_.defaults(data, schema), _.keys(schema)); 
}

Directorate.prototype.save = function(callback){
	var self = this;
	//TODO: mssql hívás

	(async function () {
	    try {
	        let pool = await sql.connect(sqlConfig);
	        const transaction = pool.transaction();
	        const request = transaction.request();
	        request.query('insert into Directorates () values ()', (err, result)=>{
        		transaction.commit
	        });

	        //callback(null, self);

	    } catch (err) {
	        console.log(err);
	    }
	})()
 
	sql.on('error', err => {
	    // ... error handler
	})
}

//static method to find directorate
Directorate.findById = function(id, callback){
	//TODO: mssql hívás
	//var self = this;
	//TODO: mssql hívás

	(async function () {
	    try {
	    	let pool = await sql.connect(sqlConfig);
	        let result = await pool.request()
	            .input('input_parameter', sql.Int, id)
	            .query('select * from Directorates where id = @input_parameter')
	            
	        //console.dir(result)
	        if(result.recordset.length != 0)
	        	callback(null, new Directorate({id:result.recordset[0]['id'], name: result.recordset[0]['name']}));
	        else
	        	callback(null, null);

	    } catch (err) {
	        console.log(err);
	    }
	})()
 
	sql.on('error', err => {
	    // ... error handler
	})
}

module.exports = Directorate;