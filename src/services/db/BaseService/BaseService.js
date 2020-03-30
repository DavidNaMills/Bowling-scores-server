const mongoose = require ('mongoose');

const Logger = require ('../../../Logger/Logger');

class BaseService {
    constructor(model) {
        this.model = model;
        this.createRecord = this.createRecord.bind(this);
        this.fetchRecords = this.fetchRecords.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    //create new record
    async createRecord(query) {
        try {
            const item = await this.model(query)
            .save()
            .catch(err=>{
                // Logger.error('error 1a');
                // Logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    message: 'unexpected create',
                    errors: err.errors
                }
            });

            if(item.error){
                return item;
            }

            if (item) {
                return {
                    error: false,
                    statusCode: 201,
                    item
                }
            } else {
                Logger.error('error 1b');
                return {
                    error: true,
                    statusCode: 500,
                    message: 'unexpected',
                }
            }
        } catch (err) {
            Logger.error('error 1c');
            Logger.error(err);
            return {
                error: true,
                statusCode: 500,
                message: err.errmsg,
                errors: err.errors
            }
        }
    }

    async countRecords(query){
        try {
            const item = await this.model
            .find(query)
            .count()
            .catch(err=>{
                Logger.error('error 2a');
                Logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    message: 'unexpected fetch',
                    errors: err.errors
                }
            });

            if(item.error){
                return item
            }

            return {
                error: false,
                statusCode: 200,
                data: item
            }
        } catch (err) {
            Logger.error('error 2b');
            Logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            }
        }
    }


    async fetchRecords(query, skip=0, limit=0) {
        try {
            const item = await this.model
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({createdAt: -1})
            .catch(err=>{
                Logger.error('error 2a');
                Logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    message: 'unexpected fetch',
                    errors: err.errors
                }
            });

            if(item.error){
                return item
            }
            return {
                error: false,
                statusCode: 200,
                data: item
            }
        } catch (err) {
            Logger.error('error 2b');
            Logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            }
        }
    }

    //update existing record
    async updateRecord(id, data) {
        try {
            const item = await this.model
            .findByIdAndUpdate(id, data, { new: true })
            .catch(err=>{
                return {
                    error: true,
                    statusCode: 500,
                    message: 'unexpected update',
                    errors: err.errors
                }
            });
        if(item.error){
                return item;
            }

            return {
                error: false,
                statusCode: 202,
                item
            }
        }
        catch (err) {
            return {
                error: true,
                statusCode: 500,
                errors: err
            }
        }
    }

    //delete record
    async deleteRecord(id){
        try{
            const item = await this.model
            .findByIdAndDelete(id)
            .catch(err=>{
                return {
                    error: true,
                    deleted: false,
                    statusCode: 500,
                    errors: err.errors
                }
            });
            if(item.error){
                return item
            }
            
            if(!item){
                return{
                    error: true,
                    deleted: false,
                    statusCode: 404,
                    errors: []
                }
            }

            return {
                error: false,
                deleted: true,
                statusCode: 202,
                item
            }

        }catch(err){
            return {
                error: true,
                statusCode: 500,
                deleted: false,
                errors: err
            }
        }
    }

}

module.exports = BaseService