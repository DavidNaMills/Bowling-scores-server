import '../setupHelper';
import mongoose from 'mongoose';
import Stats from './statisticsModel';

process.env.TEST_SUITE = 'statisticsModel';

const testId = mongoose.Types.ObjectId();


describe('statisticsModel test suite', () => {
    it('generates a record with default values', async () => {
        const newRec = {
            playerId: testId
        }
        const res = await new Stats(newRec).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('average', 0);
        expect(res).toHaveProperty('ttlFrames', 0);
        expect(res).toHaveProperty('ttlGames', 0);
        expect(res).toHaveProperty('ttlPinFall', 0);
        expect(res).toHaveProperty('startDate');
        expect(res).toHaveProperty('lastUpdated', null);
    });

    it('generates a record with values', async () => {
        const t = new Date();
        const newRec = {
            playerId: testId,
            average: 456,
            ttlFrames: 156,
            ttlPinFall: 234,
            lastUpdated: t
        }
        const res = await new Stats(newRec).save();
        expect(res).toHaveProperty('_id');
        expect(res).toHaveProperty('playerId', testId);
        expect(res).toHaveProperty('average', newRec.average);
        expect(res).toHaveProperty('ttlFrames', newRec.ttlFrames);
        expect(res).toHaveProperty('ttlGames', 0);
        expect(res).toHaveProperty('ttlPinFall', newRec.ttlPinFall);
        expect(res).toHaveProperty('startDate');
        expect(res).toHaveProperty('lastUpdated', t);
    });

    it('returns an error if the playerId is not a valid object', async () => {
        const newRec = {
            playerId: '5f6dzsf5d6x'
        }
        try {
            await new Stats(newRec).save();
        } catch (err) {
            expect(err.errors['playerId'].message).toEqual("Cast to ObjectID failed for value \"5f6dzsf5d6x\" at path \"playerId\"");
        }
    });

    it('returns an error if the values are not of type number', async () => {
        const newRec = {
            playerId: testId,
            average: 'hjk',
            ttlFrames: 'hjk',
            ttlPinFall: 'hjk',
            lastUpdated: 'hjk'
        }
        try {
            await new Stats(newRec).save();
        } catch (err) {
            expect(err.errors['average'].message).toEqual("Cast to Number failed for value \"hjk\" at path \"average\"");
            expect(err.errors['ttlFrames'].message).toEqual("Cast to Number failed for value \"hjk\" at path \"ttlFrames\"");
            expect(err.errors['ttlPinFall'].message).toEqual("Cast to Number failed for value \"hjk\" at path \"ttlPinFall\"");
            expect(err.errors['lastUpdated'].message).toEqual("Cast to Date failed for value \"hjk\" at path \"lastUpdated\"");
        }
    });
});