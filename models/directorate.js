/** directorate.js **/
var Directorate = function (data){
	this.data = data;
}

Directorate.prototype.data = {}

Directorate.prototype.changeName = function (name){
	this.data.name = name;
}

module.exports = Directorate;