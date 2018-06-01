const Description = require('../models/description');

var configuration = require('../settings');
global.sqlConfig = configuration.db;

const moment = require('moment');
moment.locale('hu');
const DataForProfileLoader = require('../logic/dataforprofileloader');


process.on('message', async function(data){
    //console.log('File path from parent: ', data);

    let dataloader = new DataForProfileLoader(data.file_path);
    let success_file_read = await dataloader.readFile(process);
    if(success_file_read){
        // Betöltés elindítás, de a klinesnek a hosszú idő miatt nem kell megvárni...
        let description = new Description(null, data.user_description+'_'+moment().format("YYYY-MM-DD_HHmmssSSS"), null, null, null, null);
        description = await description.save();
        await dataloader.saveData(process, data.modelling, description.id);
        process.send('SavedToDB');
        //console.log('Data is inserted to db.'); 
        //res.redirect('/modelling_import/'+modelling+'/data_for_profile');
    }else{
        process.send('Nem megfelelő a fájl formátuma.');
        //console.log('Error reading file.');
        //res.redirect('/modelling_import/'+modelling+'/data_for_profile?error=error_loading_data');
    }

    // let dataloader = new DataLoader(data.file_path);
    // await dataloader.readFile(process);
    // await dataloader.saveData(process, data.modelling, data.user_description+' '+moment().format("YYYY-MM-DD_HHmmssSSS"));
    // process.send('SavedToDB');
});