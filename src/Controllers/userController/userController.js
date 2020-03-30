const BaseController = require( '../BaseController/BaseController.js');
const UserService = require( '../../services/db/UserService/UserService.js');
const User = require( '../../models/userModel/userModel.js');
const Logger = require( '../../Logger/Logger');

//create new service
const userService = new UserService(User);

class UserController{
    constructor(service){
        this.service = service;

        this.getRecord = this.getRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.usernameUnique = this.usernameUnique.bind(this);
    }
    
    /**
     * @param {*} req 
     * @param {Object} req.query 
     * @param {*} res 
     */
    async getRecord(req, res) {
        let response = await this.service.fetchRecords(req.query);
        return res.status(response.statusCode).json(response);
    };
  
    /**
     * @param {*} req 
     * @param {Object} req.query 
     * @param {*} res 
     */
    async usernameUnique(req, res) {
        const exists = await this.service.fetchRecords({username: req.params.username})
        if(exists.data.length>0){
            return res.status(400).json({
                taken: true,
                message: 'usrTaken'
            });
        }
        return res.status(200).json({taken: false});
    };


    

    //TODO: AS SIGNUP
    // /**
    //  * @param {*} req 
    //  * @param {Object} req.body
    //  * @param {*} res 
    //  */
    async signup(req, res, next) {
        Logger.info('inside signup');
        Logger.info(req.body);
        
        const exists = await this.service.fetchRecords({username: req.body.username})
        .catch(err=>{
            Logger.error(err)
        });
        Logger.info(exists);
        if(exists.data.length>0){
            Logger.error('A) user exists');            
            return res.status(500).json({message: 'exists'}).end();
        }

        const newRecord = await this.service.createRecord(req.body)
        .catch(err=>{
            Logger.error(err)
        });
        if(!newRecord.error){
            Logger.info('B) all good');
            req.body = newRecord;
            return next();
        }
        
        Logger.error('C) problem');
        Logger.error(newRecord);
        return res.status(newRecord.statusCode).json(newRecord).end();
    }


    /**
     * @param {*} req 
     * @param {Object} req.body
     * @param {*} res 
     */
    async updateRecord(req, res) {
        const { id } = req.params;
        response = await this.service.updateRecord(id, req.body);
        return res.status(response.statusCode).json(response);
    }


    /**
     * @param {*} req 
     * @param {Object} req.body
     * @param {*} res 
     */
    async deleteRecord(req, res) {
        const { id } = req.params;
        response = await this.service.updateRecord(id, req.body);
        return res.status(response.statusCode).json(response);
    }
}

module.exports = new UserController(userService);

//export default new controller (service)