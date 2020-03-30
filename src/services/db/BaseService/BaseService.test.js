import '../../../models/setupHelper';
import {ObjectID} from 'mongodb';
import User from '../../../models/userModel/userModel';
import BaseService from './BaseService';
import { requiredFields, requiredFieldsMissing, fullRecord } from '../../../testData/userModelTestData';



describe('BaseService test suite', () => {
    const service = new BaseService(User);
    let testItem = null;

    beforeEach(async () => {
        await User.deleteMany({});
        testItem = await service.createRecord(fullRecord);
    });


    describe('create record tests', () => {
        it('successfully creates a record in the db', async () => {
            const result = await service.createRecord(fullRecord);
            expect(result.error).toBeFalsy();
            expect(result.item).toHaveProperty('_id');
            expect(result.item.name).toEqual(fullRecord.name);
        });

        it('returns error messages when fields are missing', async () => {
            const result = await service.createRecord({});
            expect(result.error).toBeTruthy();
            expect(result.statusCode).toBe(500);
            expect(Object.keys(result.errors).length).toBe(3);
        });
        //thirdPartyid already exists
        //username already exists
    });

    describe('fetchRecords tests', () => {
        it('tests the DB has been seeded', async () => {
            const result = await User.find({});
            expect(result.length).toBe(1);
            expect(result[0]).toHaveProperty('_id', testItem.item._id);
        });

        it('fetches a single record successfully', async () => {
            const result = await service.fetchRecords({ _id: testItem.item._id });
            expect(result.error).toBeFalsy();
            expect(result.statusCode).toBe(200);
            expect(result.data[0]).toHaveProperty('_id', testItem.item._id);
            expect(result.data.length).toBe(1);
        });

        it('returns an error if there is a problem with the query esp. the _id', async () => {
            const result = await service.fetchRecords({ _id: 'bxcv-bvcx-bvcx-23' });
            expect(result.error).toBeTruthy();
            expect(result.statusCode).toBe(500);
            expect(result).toHaveProperty('errors')
        });
    });


    describe('update record tests', () => {
        //successful update
        it('successfully updates the record and returns the updated record', async()=>{
            const testUpdate = {
                name: 'David Mills',
                location: 'Gotham City'
            };
            const result = await service.updateRecord(testItem.item._id, testUpdate);

            expect(result.error).toBeFalsy();
            expect(result.statusCode).toBe(202);
            expect(result.item.name).toEqual(testUpdate.name);
            expect(result.item.location).toEqual(testUpdate.location);
        });
        
        
        it('returns an error as the id is invalid', async()=>{
            const testUpdate = {
                name: 'David Mills',
                location: 'Gotham City'
            };
            const result = await service.updateRecord('cxz1-cxz-cxz-cxz', testUpdate);
            expect(result.error).toBeTruthy();
            expect(result.statusCode).toBe(500);
            expect(result).toHaveProperty('errors');
        });
    });

    describe('delete record test suite', ()=>{
        //deletes and returns id
        it('removes the record from the database', async()=>{
            const result = await service.deleteRecord(testItem.item._id);
            expect(result).toHaveProperty('error', false);
            expect(result).toHaveProperty('deleted', true);
            expect(result).toHaveProperty('statusCode', 202);
            expect(result.item._id).toEqual(testItem.item._id);
        });
        
        it('returns error as id is invalid', async()=>{
            const result = await service.deleteRecord('cfsda-vfd-vds452-12-1-2');
            expect(result).toHaveProperty('error', true);
            expect(result).toHaveProperty('deleted', false);
            expect(result).toHaveProperty('statusCode', 500);
            expect(result).toHaveProperty('errors');
        });
        
        it('returns error as id does not exist', async()=>{
            const result = await service.deleteRecord(new ObjectID());
            expect(result).toHaveProperty('error', true);
            expect(result).toHaveProperty('deleted', false);
            expect(result).toHaveProperty('statusCode', 500);
        });
    });
});