const fs = require('fs');
const readline = require('readline');

class DataLoader{
	constructor(file_path){
		this.file_path = file_path;
	}

	async readFile(){
		console.log("Reading " + this.file_path + " file...");
		// fs.readFile(this.file_path, 'utf8', function(err, contents) {
		//     console.log(contents);
		// });
		let instream = fs.createReadStream(this.file_path);
		let outstream = new (require('stream'))();
		let rl = readline.createInterface(instream, outstream);
		rl.on('line', function(line){
			console.log("Line: " + line);
		});

		rl.on('cloe', function(line){
			console.log("Line close: " + line);ű
			console.log("Done reading file...");
		});
	}

}

module.exports = DataLoader;