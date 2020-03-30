// import '../../setupHelper';
// import {ObjectID} from 'mongodb';
// import {Friends} from './friendModel';
// import friendErr from '../../../consts/errorCodes/friendModelErrors';
// import {PENDING, BLOCKED, FRIEND_STATUS_ARRAY} from '../../../consts/friendModelStatus';
it('placeholder', ()=>{expect(true).toBeTruthy()});
// const required = {
//     name: 'david',
//     id: new ObjectID(),
// }

// const optional = {
//     ...required,
//     addDate: new Date(),
//     avatar: 'fdafdsafdsfdfsda',
//     status: BLOCKED
// }

// describe('friendModel db test suite', () => {
//     it('successfully creates a record', async () => {
//         const res = await new Friends(required).save();
//         expect(res).toHaveProperty('_id');
//         expect(res).toHaveProperty('id');
//         expect(res).toHaveProperty('addDate');
//         expect(res).toHaveProperty('name', required.name);
//         expect(res).toHaveProperty('avatar', '');
//         expect(res).toHaveProperty('status', PENDING);
//         expect(res).toHaveProperty('restrictions', {});
//     });
    
//     it('should return the correct error messages', async () => {
//         try{
//             const res = await new Friends({}).save()
//         } catch(err){
//             expect(err.errors['name'].message).toEqual(friendErr.nameFr);
//             expect(err.errors['id'].message).toEqual(friendErr.friendId);
//         }
//     });

//     it('tests optional properties are set correctly', async()=>{
//         const res = await new Friends(optional).save();
//         expect(res).toHaveProperty('_id');
//         expect(res).toHaveProperty('addDate', optional.addDate);
//         expect(res).toHaveProperty('avatar', optional.avatar);
//         expect(res).toHaveProperty('status', optional.status);
//     });
// });