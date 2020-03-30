import '../../models/setupHelper';
import { ObjectId } from 'mongodb';
import { mockRequest, mockResponse, mockNext } from '../testHelpers/interceptor';
import StatsController from './StatsController';
import Stats from '../../models/statisticsModel/statisticsModel';
import User from '../../models/userModel/userModel';
import { fullRecord } from '../../testData/userModelTestData';

const newRec = {
    average: 456,
    ttlFrames: 156,
    ttlGames: 1,
    ttlPinFall: 234,
}


afterEach(() => {
    jest.clearAllMocks();
});

let testStat;
let usr;
beforeEach(async () => {
    // populate the dbs
    usr = await new User(fullRecord).save();
    testStat = await new Stats({ playerId: usr._id, ...newRec }).save();
});

describe('StatsController test suite', () => {
    describe('fetchStats tests', () => {

        it('fetches the players stats', async () => {
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext();
            req.user = usr;

            await StatsController.fetchStats(req, res, next);

            expect(res.locals).toHaveProperty('origStats');

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.locals.origStats).toHaveProperty('average', newRec.average);
            expect(res.locals.origStats).toHaveProperty('ttlPinFall', newRec.ttlPinFall);
        });

        it('returns status 500 if there is a problem', async () => {
            const badPlayer = {
                _id: 'fdfdfds'
            }
            const req = mockRequest();
            const res = mockResponse();
            const next = mockNext()
            req.user = { _id: 'sdf2a' };

            expect(res).not.toHaveProperty('locals');

            await StatsController.fetchStats(req, res, next);
            expect(next).toHaveBeenCalledTimes(0);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
        });
    });

    describe('updates scores tests', () => {
        it('adds stats with default values', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};
            res.locals.origStats = testStat;
            req.body = { key: 1, data: { [usr._id]: { name: "testtesttest", score: 999 } } }
            req.user = usr;

            await StatsController.addStats(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.locals.updatedStats).toHaveProperty('average', 8);
            expect(res.locals.updatedStats).toHaveProperty('ttlFrames', 157);
            expect(res.locals.updatedStats).toHaveProperty('ttlPinFall', 1233);

            expect(res.locals).not.toHaveProperty('origStats');
            expect(res.locals).toHaveProperty('updatedStats');

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('playerId', usr._id);
            expect(usrst).toHaveProperty('average', 8);
            expect(usrst).toHaveProperty('ttlFrames', 157);
            expect(usrst).toHaveProperty('ttlPinFall', 1233);
        });

        it('returns status 500 if the user does not exist in the game', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};
            res.locals.origStats = testStat;
            req.body = {
                data: { [new ObjectId()]: {} }
            };
            req.user = usr;

            await StatsController.addStats(req, res, next);
            expect(next).toHaveBeenCalledTimes(0);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledTimes(1);

            expect(res.locals).not.toHaveProperty('origStats');
            expect(res.locals).not.toHaveProperty('updatedStats');

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('average', 456);
            expect(usrst).toHaveProperty('ttlFrames', 156);
            expect(usrst).toHaveProperty('ttlPinFall', 234);
        });

        it('returns status 500 if there is an error with the data', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};
            res.locals.origStats = testStat;
            req.body = { "key": 1, "data": { [usr._id]: { "name": "testtesttest", "score": 'fdsa' } } }
            req.user = usr;

            await StatsController.addStats(req, res, next);
            expect(next).toHaveBeenCalledTimes(0);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);

            expect(res.locals).not.toHaveProperty('origStats');
            expect(res.locals).not.toHaveProperty('updatedStats');

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('average', 456);
            expect(usrst).toHaveProperty('ttlFrames', 156);
            expect(usrst).toHaveProperty('ttlPinFall', 234);
        });
    });

    // TODO: not implemented frontend
    describe.skip('updates scores if a frame has been amended', () => {
        it('amends the stats (if a game is changed)', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};
            res.locals.origStats = testStat;
            req.body = {
                scores: 999
            }

            await StatsController.fetchStats(req, res, next);

            expect(res.locals).toHaveProperty('origStats');

            expect(next).toHaveBeenCalledTimes(1);
            expect(res.locals.origStats).toHaveProperty('average', newRec.average);
            expect(res.locals.origStats).toHaveProperty('ttlPinFall', newRec.ttlPinFall);
        });

        it('returns status 500 if there is a problem', async () => { });
    });

    // TODO: not implemented frontend
    it.skip('decrements the stats (if a game is deleted)', () => { });

    describe('reset stats tests', () => {
        it('resets the stats', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();

            res.locals = {};
            req.params = {};
            res.locals.origStats = testStat;
            req.params.id = testStat._id;


            await StatsController.resetStats(req, res);

            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledTimes(1);

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('average', 0);
            expect(usrst).toHaveProperty('ttlFrames', 0);
            expect(usrst).toHaveProperty('ttlPinFall', 0);
            expect(usrst).toHaveProperty('lastUpdated', null)
        });

        it('returns status code 400 if no id is present in params', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();

            await StatsController.resetStats(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledTimes(1);
        });

        it('returns status code 500 if error with id', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            req.params = {};
            req.params.id = 'dsadasDAS';

            await StatsController.resetStats(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledTimes(1);
        });
    });

    describe('create stats tests', () => {
        it('successfully creates stats for a new user', async () => {
            const newUsr = new ObjectId();

            const newStats = await StatsController.newStats({ id: newUsr });
            const rec = await Stats.findOne({ playerId: newUsr });

            expect(newStats).toHaveProperty('playerId', newUsr);
            expect(newStats).toHaveProperty('average', 0);
            expect(newStats).toHaveProperty('ttlPinFall', 0);

            expect(rec).toHaveProperty('playerId', newUsr);
            expect(rec).toHaveProperty('average', 0);
            expect(rec).toHaveProperty('ttlPinFall', 0);
        });

        it('returns an error if the id is missing', async () => {
            const newStats = await StatsController.newStats({});
            expect(newStats).toHaveProperty('error', true);
            expect(newStats).toHaveProperty('message', 'noId');
        });

        it('returns an error if the id is invalid', async () => {
            const newStats = await StatsController.newStats({ id: 'fasd23' });
            expect(newStats).toHaveProperty('error', true);
            expect(newStats).toHaveProperty('errors');
        });
    });

    describe('create newGame tests', () => {
        it('increments the ttlGame count', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};
            res.locals.origStats = testStat;

            await StatsController.addGame(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.locals.updatedStats).toHaveProperty('average', 456);
            expect(res.locals.updatedStats).toHaveProperty('ttlFrames', 156);
            expect(res.locals.updatedStats).toHaveProperty('ttlGames', 2);
            expect(res.locals.updatedStats).toHaveProperty('ttlPinFall', 234);

            expect(res.locals).not.toHaveProperty('origStats');
            expect(res.locals).toHaveProperty('updatedStats');

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('playerId', usr._id);
            expect(usrst).toHaveProperty('average', 456);
            expect(usrst).toHaveProperty('ttlFrames', 156);
            expect(usrst).toHaveProperty('ttlGames', 2);
            expect(usrst).toHaveProperty('ttlPinFall', 234);
        });

        it('returns an error if the id is invalid', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};
            res.locals.origStats = { _id: 'gdfsgfds' };

            await StatsController.addGame(req, res, next);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
        });

        it('returns an error if the id is missing', async () => {
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();

            res.locals = {};

            await StatsController.addGame(req, res, next);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledTimes(1);
        });

        it('updates the stats if a new game is added that already has games', async()=>{
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();
            
            // average: 456,
            // ttlFrames: 156,
            // ttlGames: 1,
            // ttlPinFall: 234,
            req.user = usr;
            req.body = {
                players: {
                    [usr._id]: {name: 'alan', color: '12, 123, 123'}
                },
                games: {
                    '1' : {[usr._id]: {score: 123}, ['gfdsgfsd']: {score: 300}},
                    '2' : {[usr._id]: {score: 456}}
                }
            }
            res.locals = {};
            res.locals.origStats = testStat;

            await StatsController.addGame(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.locals.updatedStats).toHaveProperty('average', 6);
            expect(res.locals.updatedStats).toHaveProperty('ttlFrames', 158);
            expect(res.locals.updatedStats).toHaveProperty('ttlGames', 2);
            expect(res.locals.updatedStats).toHaveProperty('ttlPinFall', 813);

            expect(res.locals).not.toHaveProperty('origStats');
            expect(res.locals).toHaveProperty('updatedStats');

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('playerId', usr._id);
            expect(usrst).toHaveProperty('average', 6);
            expect(usrst).toHaveProperty('ttlFrames', 158);
            expect(usrst).toHaveProperty('ttlGames', 2);
            expect(usrst).toHaveProperty('ttlPinFall', 813);
        });

        it('updates the stats if game has been claimed but game object is empty', async()=>{
            const req = mockRequest({ key: 'user', data: usr });
            const res = mockResponse();
            const next = mockNext();
            
            // average: 456,
            // ttlFrames: 156,
            // ttlGames: 1,
            // ttlPinFall: 234,
            req.user = usr;
            req.body = {
                players: {
                    [usr._id]: {name: 'alan', color: '12, 123, 123'}
                },
                games: {}
            }
            res.locals = {};
            res.locals.origStats = testStat;

            await StatsController.addGame(req, res, next);
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.locals.updatedStats).toHaveProperty('average', 456);
            expect(res.locals.updatedStats).toHaveProperty('ttlFrames', 156);
            expect(res.locals.updatedStats).toHaveProperty('ttlGames', 2);
            expect(res.locals.updatedStats).toHaveProperty('ttlPinFall', 234);

            expect(res.locals).not.toHaveProperty('origStats');
            expect(res.locals).toHaveProperty('updatedStats');

            const usrst = await Stats.findOne({ playerId: usr._id });
            expect(usrst).toHaveProperty('playerId', usr._id);
            expect(usrst).toHaveProperty('average', 456);
            expect(usrst).toHaveProperty('ttlFrames', 156);
            expect(usrst).toHaveProperty('ttlGames', 2);
            expect(usrst).toHaveProperty('ttlPinFall', 234);
        });
    });
});