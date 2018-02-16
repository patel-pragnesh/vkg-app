const Models = require('../models/');

exports.list = Models.Directorate
.findAll({
	order:[['id', 'DESC']]
})
.then((result)=>{
	return result;
});