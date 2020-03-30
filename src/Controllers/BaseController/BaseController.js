class Controller {
    constructor(service) {
        this.service = service;
        this.getRecord = this.getRecord.bind(this);
        this.insertRecord = this.insertRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
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
     * @param {Object} req.body
     * @param {*} res 
     */
    async insertRecord(req, res) {
        response = await this.service.createRecord(req.body);
        return res.status(response.statusCode).json(response);
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
};

module.exports = Controller;