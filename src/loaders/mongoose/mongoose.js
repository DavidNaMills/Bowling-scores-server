const Logger = require ('../../Logger/Logger');
const mongoose = require('mongoose');
const config = require ('../../config/index.js');

class Connection {
    constructor(){
        Logger.info(`establishing a new connection with ${config.databaseURL}`);
        mongoose.Promise = global.Promise;
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useCreateIndex", true);
        mongoose.set('useUnifiedTopology', true);
        mongoose.connect(config.databaseURL)
        .then(()=>{
            Logger.info(`connected to ${config.databaseURL}`);
        })
        .catch(e=>{
        })

    }
}

const create = async() =>{
    await new Connection();
}
module.exports = create();