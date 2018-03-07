const River = require('../models/river');

exports.index = function(req, res){
	res.send('TODO: vízfolyások megjelenítése');
}

exports.get_by_directorate_post = async function(req, res){
	// console.log(req.body.id);
	let river = await River.findByDirectorate(req.body.id);
	res.json(river);
}