const StatsService = require('../../services/db/statsService/statsService')
const Stats = require('../../models/statisticsModel/statisticsModel');
const calculateStats = require('../../Helpers/calculateStats/calculateStats');
const Logger = require('../../Logger/Logger');

const statsService = new StatsService(Stats);

class StatsController {
    constructor(service) {
        this.service = service;

        this.addGame = this.addGame.bind(this);
        this.addStats = this.addStats.bind(this);
        this.fetchStats = this.fetchStats.bind(this);
        this.resetStats = this.resetStats.bind(this);
        this.newStats = this.newStats.bind(this);
    };

    async addGame(req, res, next) {
        const { origStats } = res.locals;

        if (!res.locals || !res.locals.origStats) {
            return res.status(500).json({ errors: 'noStats' });
        }

        let updatedRecord;
        let temp = null;
        // check if newGame has players and games
        if (req.body.games && Object.keys(req.body.games).length>0) {
            const temp = calculateStats.addPreExistingGame({state: origStats, newGame: req.body, userId: req.user._id});
            updatedRecord = await this.service.updateRecord(origStats._id, { $set: temp });
        } else {
            updatedRecord = await this.service.updateRecord(origStats._id, { $inc: { 'ttlGames': 1 } });
        }

        delete res.locals.origStats;

        if (updatedRecord.error) {
            return res.status(updatedRecord.statusCode).json(updatedRecord);
        }
        res.locals.updatedStats = updatedRecord.item;
        next();
    }



    async addStats(req, res, next) {
        const { user } = req;
        const { origStats } = res.locals;

        if (!req.body.data[user._id]) {
            delete res.locals.origStats;
            return res.status(400).json({ error: 'nonExistant' })
        }

        const updated = calculateStats.addStats({ state: origStats, score: req.body.data[user._id].score });
        const updatedRecord = await this.service.updateRecord(origStats._id, updated);

        delete res.locals.origStats;
        if (updatedRecord.error) {
            return res.status(updatedRecord.statusCode).json({ error: updatedRecord.message })
        }

        res.locals.updatedStats = updated;
        next();

    }


    async fetchStats(req, res, next) {
        const user = req.user;
        const tempStats = await this.service.fetchRecords({ playerId: user._id })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    errors: err
                }
            });
        if (tempStats.error || tempStats.data.length < 1) {
            return res.status(tempStats.statusCode).json({ errors: tempStats.errors });
        }

        res.locals = {}
        res.locals.origStats = tempStats.data[0];
        next();
    };

    // TODO: test
    async fetchStatsLogin(id) {
        const tempStats = await this.service.fetchRecords({ playerId: id })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    errors: err
                }
            });
        if (tempStats.error || tempStats.data.length < 1) {
            return res.status(tempStats.statusCode).json({ errors: tempStats.errors });
        }

        return tempStats.data[0];
    };

    async resetStats(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'noId' });
        }

        const resetStats = calculateStats.reset();
        const record = await this.service.updateRecord(id, resetStats);

        if (record.error) {
            return res.status(record.statusCode).json({ error: 'noId' });
        }
        res.status(record.statusCode).json(record.item);
    }


    async newStats({ id }) {
        Logger.dev(id);
        if (!id) {
            return {
                error: true,
                message: 'noId'
            }
        }

        const newStats = await this.service.createRecord({
            playerId: id
        });

        Logger.dev(newStats);
        if (newStats.error) {
            return {
                error: true,
                errors: newStats.errors
            }
        }
        return newStats.item;
    }
}

module.exports = new StatsController(statsService);