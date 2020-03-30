require( './mongoose/mongoose.js');
const expressLoader = require ('./expressLoader/expressLoader.js');

module.exports = async ({expressApp}) =>{
    await expressLoader({app: expressApp});
    //load routes
};