const sql = require('mssql');

class DatabaseHandler{
	constructor(table, fields){
		this.name = table;
		this.fields = fields;
	}

	create(){
		console.log('Creating '+this.name+' table in database '+this.fields);
	}
}

module.exports = DatabaseHandler;