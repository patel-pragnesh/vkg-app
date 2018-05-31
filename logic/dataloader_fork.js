var configuration = require('../settings');
global.sqlConfig = configuration.db;

const moment = require('moment');
moment.locale('hu');
const DataLoader = require('../logic/dataloader');


process.on('message', async function(data){
    //console.log('File path from parent: ', data);

    let dataloader = new DataLoader(data.file_path);
    await dataloader.readFile(process);
    await dataloader.saveData(process, data.modelling, data.user_description+' '+moment().format("YYYY-MM-DD_HHmmssSSS"));
    process.send('SavedToDB');
});