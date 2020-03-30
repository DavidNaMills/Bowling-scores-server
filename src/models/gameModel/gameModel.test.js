import '../setupHelper';
import Game from './gameModel';

process.env.TEST_SUITE = 'gameModel';

const testData = {
    createdAt: new Date(),
    players: {
        123456: {
            name: 'david',
            color: 'blue'
        }
    },
    games:{
        1:{ 
            123456:{score: 156, name: 'david'}
        }
    }
}

describe('Redux Game model test suite', ()=>{
    it('adds a date to the model', async ()=>{
        const res = await new Game(testData).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('createdAt', testData.createdAt);
        expect(res).toHaveProperty('players', testData.players);
        expect(res).toHaveProperty('games', testData.games);
    });
});

//takes date
//players: {}
//games: {}