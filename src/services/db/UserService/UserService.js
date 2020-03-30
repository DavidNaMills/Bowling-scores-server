const BaseService = require ('../BaseService/BaseService.js');

class UserService extends BaseService{
    constructor(model){
        super(model);
    }
}

module.exports = UserService;