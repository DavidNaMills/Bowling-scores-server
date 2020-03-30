import calculateStats from './calculateStats';


const newFrame =165;
const testId = '5fvsd6av4d34vd53sa';
const emptyRec = {
    average: 0,
    ttlFrames: 0,
    ttlGames: 0,
    ttlPinFall: 0,
}

const baseState = { 
    playerId: testId,
    average: 137,
    ttlFrames: 115,
    ttlGames: 1,
    ttlPinFall: 15748,
    lastUpdated: null
}

describe('calculateStats helper test suite', ()=>{
    it('increments the stats from zero', ()=>{
        const res = calculateStats.addStats({state: emptyRec, score: newFrame});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(newFrame);
        expect(res.ttlFrames).toBe(1);
        expect(res.ttlGames).toBe(0);
        expect(res.ttlPinFall).toBe(newFrame);
        expect(res.lastUpdated).not.toBeNull();
    });

    it('increments the stats with existing values', ()=>{
        const score = 136;
        const res = calculateStats.addStats({state: baseState, score});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(137);
        expect(res.ttlFrames).toBe(baseState.ttlFrames+1);
        expect(res.ttlGames).toBe(1);
        expect(res.ttlPinFall).toBe(baseState.ttlPinFall+score);
        expect(res.lastUpdated).not.toBeNull();
    });

    it('resets the values to zero', ()=>{
        const res = calculateStats.reset({playerId: testId});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(0);
        expect(res.ttlFrames).toBe(0);
        expect(res.ttlGames).toBe(0);
        expect(res.ttlPinFall).toBe(0);
        expect(res.lastUpdated).toBeNull()
    });

    it('updates stats when a game is removed', ()=>{
        const updated = {
            old: 111,
            new: 2
        }

        const nTtl = (+baseState.ttlPinFall-+updated.old)+updated.new;
        const res = calculateStats.updateScores({state: baseState, newScores: updated});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(136);
        expect(res.ttlFrames).toBe(baseState.ttlFrames);
        expect(res.ttlGames).toBe(baseState.ttlGames);
        expect(res.ttlPinFall).toBe(nTtl);
        expect(res.lastUpdated).not.toBeNull();
    });

    it('updates the score and ensures average cannot be lower than 0', ()=>{
        const updated = {
            old: 15790,
            new: 0
        }

        const res = calculateStats.updateScores({state: baseState, newScores: updated});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(0);
        expect(res.ttlFrames).toBe(baseState.ttlFrames);
        expect(res.ttlGames).toBe(1);
        expect(res.ttlPinFall).toBe(0);
        expect(res.lastUpdated).not.toBeNull();
    });

    it('re-calculates the average if a game is removed', ()=>{
        const ttlPinfall = 456;

        const res = calculateStats.removeScores({state: baseState, pinfall: ttlPinfall});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(135);
        expect(res.ttlFrames).toBe(baseState.ttlFrames-1);
        expect(res.ttlGames).toBe(0);
        expect(res.ttlPinFall).toBe(baseState.ttlPinFall-ttlPinfall);
        expect(res.lastUpdated).not.toBeNull();
    });
    
    it('re-calculates the average and ensure average, ttlFrames and ttlPinFall cannot be less than 0', ()=>{
        const ttlPinfall = 456;

        const res = calculateStats.removeScores({state: baseState, pinfall: ttlPinfall});
        expect(Object.keys(res).length).toBe(5);
        expect(res.average).toBe(135);
        expect(res.ttlGames).toBe(0);
        expect(res.ttlFrames).toBe(114);
        expect(res.ttlFrames).toBe(baseState.ttlFrames-1);
        expect(res.ttlPinFall).toBe(baseState.ttlPinFall-ttlPinfall);
        expect(res.lastUpdated).not.toBeNull();
    });

    describe('addPreExistingGame tests', () => {
        it('updates the stats if the user is present in the game object', () => {
            const fullGame = {
                players: {
                    [testId]: {name: 'alan', color: '12, 123, 123'}
                },
                games: {
                    '1' : {[testId]: {score: 123}, ['gfdsgfsd']: {score: 300}},
                    '2' : {[testId]: {score: 456}}
                }
            }

            const newStats = calculateStats.addPreExistingGame({state: emptyRec, newGame: fullGame, userId: testId});
            expect(newStats).toHaveProperty('ttlFrames', 2);
            expect(newStats).toHaveProperty('ttlPinFall', 579);
            expect(newStats).toHaveProperty('average', 290);
        });
        
        it('handles an empty games object', ()=>{
            const fullGame = {
                players: {
                    [testId]: {name: 'alan', color: '12, 123, 123'}
                },
                games: {}
            }

            const newStats = calculateStats.addPreExistingGame({state: baseState, newGame: fullGame, userId: testId});
            expect(newStats).toHaveProperty('ttlFrames', baseState.ttlFrames);
            expect(newStats).toHaveProperty('ttlGames', baseState.ttlGames+1);
            expect(newStats).toHaveProperty('ttlPinFall', baseState.ttlPinFall);
            expect(newStats).toHaveProperty('average', baseState.average);
        });
        
        it('updates the stats if the user is not present in the game object', () => {
            const fullGame = {
                players: {
                    [testId]: {name: 'alan', color: '12, 123, 123'}
                },
                games: {
                    '1' : {['gdfsgfdsgf']: {score: 123}, ['gfdsgfsd']: {score: 300}},
                    '2' : {['gdfsgfdsgfd']: {score: 456}}
                }
            }

            const newStats = calculateStats.addPreExistingGame({state: baseState, newGame: fullGame, userId: testId});
            expect(newStats).toHaveProperty('ttlFrames', baseState.ttlFrames);
            expect(newStats).toHaveProperty('ttlGames', baseState.ttlGames+1);
            expect(newStats).toHaveProperty('ttlPinFall', baseState.ttlPinFall);
            expect(newStats).toHaveProperty('average', baseState.average);
        });

    });
});