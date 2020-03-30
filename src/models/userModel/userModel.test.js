import '../setupHelper';
import User from './userModel';
import errs from '../../consts/errorCodes/userModelErrors';
import {requiredFields, requiredFieldsMissing, fullRecord} from '../../testData/userModelTestData';

process.env.TEST_SUITE = 'userModel';

describe('User schema test suite', ()=>{
    
    test('should create a record with the required and default values ', async()=>{
        const res = await new User(requiredFields).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('name', requiredFields.name);
        expect(res).toHaveProperty('password', requiredFields.password);
        expect(res).toHaveProperty('thirdPartyid');
        expect(res).toHaveProperty('avatar', '');
        expect(res).toHaveProperty('color', '');
        expect(Array.isArray(res.friends)).toBeTruthy();
        expect(Array.isArray(res.privateEvents)).toBeTruthy();
        expect(Array.isArray(res.games)).toBeTruthy();
        expect(typeof(res.privacySettings)).toBe('object');
        expect(res).toHaveProperty('showMsg', false);
    });
    
    
    it('should create a record with all possible values', async()=>{
        const res = await new User(fullRecord).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('thirdPartyid', fullRecord.thirdPartyid);
        expect(res).toHaveProperty('username', fullRecord.username);
        expect(res).toHaveProperty('avatar', fullRecord.avatar);
        expect(res).toHaveProperty('color', fullRecord.color);
        expect(res).toHaveProperty('location', fullRecord.location);
        expect(res).toHaveProperty('showMsg', fullRecord.showMsg);
    });
    

    test('should return errors when required properties are missing', async()=>{
        try{
            await new User(requiredFieldsMissing).save();
        } catch(err){
            expect(err.errors['name'].message).toEqual(errs.name01);
            expect(err.errors['password'].message).toEqual(errs.pwd);
            expect(err.errors['username'].message).toEqual(errs.usrNme);
        }
    }); 
});