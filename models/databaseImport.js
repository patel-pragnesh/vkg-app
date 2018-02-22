/** directorate.js **/
const sql = require('mssql');
//var schemas = require("./schemas.js");
//var _ = require("lodash");

//private variable
var total = 0;

function DatabaseImport(data){
	this.data = data;
	total++;
}

DatabaseImport.prototype.data = {}

module.exports = DatabaseImport;