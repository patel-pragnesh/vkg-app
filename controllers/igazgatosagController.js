const Models = require('../models/');
exports.list = Models.Igazgatosag
.findAll({
	order:[['id', 'DESC']]
})
.then((result)=>{
	return result[0].name1;
});