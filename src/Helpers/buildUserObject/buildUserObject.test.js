import buildUserObject from './buildUserObject';

describe('buidUserObject test suite', ()=>{
    const testData = {
        username: 'test',
        thirdPartyId: 'dsafsdafsda',
        avatar: 'fsdafdsfdsfdsfdsfsda',
        color: '123, 123 ,123 ',
        location: 'fgdsgvfsd',
        games: [],
        showMsg: [],
        _id: '5gh6fd5gh6f5dh6gf5dh6gf',
        name: 'gbdfsghfgdf',
        friends: 'gfsgfsgfdsgfdgfd',
        privateEvents: 'jhjgjhgjhj',
        password: 'gfdsgffdsgfd'
    }

    it('should return an object minus the password', ()=>{
        const res = buildUserObject(testData);
        expect(res).not.toHaveProperty('password');

        for(let k in res){
            expect(testData[k]).toEqual(res[k]);
        }
    });
});