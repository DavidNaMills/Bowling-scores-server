import '../setupHelper';
import {ObjectID} from 'mongodb';
import {PrivateEvent} from './privateEvent';

import privateEventErr from '../../consts/errorCodes/privateEventModelErrors';
import {FRIEND_REQUEST, NEW_GAME} from '../../consts/eventTypes';


const required = {
    eventId: new ObjectID()
};

const optional = {
    ...required,
    name: 'david',
    avatar: 'davidfsdadfsa',
    message: 'this is a message',
    eventType: NEW_GAME,
    hasViewed: true
}


describe.skip('privateEvents model db testsuite', ()=>{
    it('creates a record with required fields and default values', async()=>{
        const res = await new PrivateEvent(required).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('date');
        expect(res).toHaveProperty('eventId');
        expect(res).toHaveProperty('name', '');
        expect(res).toHaveProperty('avatar', '');
        expect(res).toHaveProperty('message', '');
        expect(res).toHaveProperty('eventType', FRIEND_REQUEST);
        expect(res).toHaveProperty('hasViewed', false);
    });
    
    
    it('creates a record when optional values are present', async()=>{
        try{
            await new PrivateEvent(required).save();
        } catch(err){
            expect(err.errors['eventId'].message).toEqual(privateEventErr.eventId);
            expect(err.errors['eventType'].message).toEqual(privateEventErr.noType);
        }
    });
    
    
    it('returns correct error messages if required values are missing', async()=>{
        const res = await new PrivateEvent(optional).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('name', optional.name);
        expect(res).toHaveProperty('avatar', optional.avatar);
        expect(res).toHaveProperty('message', optional.message);
        expect(res).toHaveProperty('eventType', optional.eventType);
        expect(res).toHaveProperty('hasViewed', optional.hasViewed);
    });
});


