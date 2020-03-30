const GameService = require('../../services/db/GameService/GameService.js');
const Game = require('../../models/gameModel/gameModel.js');
const { removePlayer } = require('../../Helpers/removePlayer/removePlayer.js');
const { updatePlayerScores } = require('../../Helpers/updatePlayerScores/updatePlayerScores.js');
const Logger = require('../../Logger/Logger');

const gameService = new GameService(Game);

class GameController {
    constructor(service) {
        this.service = service;

        this.createNewGame = this.createNewGame.bind(this);
        this._gameExists = this._gameExists.bind(this);
        this.addNewFrame = this.addNewFrame.bind(this);
        this.addNewPlayer = this.addNewPlayer.bind(this);
        this.findPersonalGames = this.findPersonalGames.bind(this);
        this.removePlayer = this.removePlayer.bind(this);
        this.updateGameScores = this.updateGameScores.bind(this);
    }

    //create new game
    /**
     * 
     * @param {*} req 
     * @param {*} req.body: date, players obj,game obj 
     * @param {*} res 
     */
    async createNewGame(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(500).json({ statusCode: 500, error: true, message: 'invalid' });
        }
        let response = await this.service.createRecord(req.body);
        return res.status(response.statusCode).json({ ...response, stats: res.locals.updatedStats });
    }


    async _gameExists(id) {
        return await this.service.fetchRecords({ _id: id });
    }

    /**
     * 
     * @param {*} req 
     * @param {*} req.params (game id) 
     * @param {*} req.body.key (frame #) 
     * @param {*} req.body.data (new frame data)
     * @param {*} res 
     */
    async addNewFrame(req, res) {
        const { id } = req.params;
        const exists = await this._gameExists(id);
        if (exists) {
            const query = { $set: { [`games.${req.body.key}`]: req.body.data } }
            const response = await this.service.updateRecord(id, query);
            return res.status(response.statusCode).json({ ...response, stats: res.locals.updatedStats });
        }
        return res.status(501).json({ error: true, errors: 'missing' });
    }


    /**
     * 
     * @param {*} req 
     * @param {*} req.params (game id) 
     * @param {*} req.body.key (new player id) 
     * @param {*} req.body.data (new player data)
     * @param {*} res 
     */
    async addNewPlayer(req, res) {
        // Logger.info('[addNewPlayer]');
        const { id } = req.params;
        const exists = await this._gameExists(id);

        if (exists) {
            const query = { $set: { [`players.${req.body.key}`]: req.body.data } }
            const response = await this.service.updateRecord(id, query);
            return res.status(response.statusCode).json(response);
        }
        return res.status(500).json({ error: 'missing' });
    }


    //find players games
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async findPersonalGames(req, res) {
        const { _id } = req.user;
        const skip = req.params.skip ? +req.params.skip : 0;
        const limit = req.params.limit ? req.params.limit : 0;

        if (!_id) {
            const errResult = {
                error: true,
                statusCode: 401,
                errors: ['unauthorised', 'noUserId']
            }
            return res.status(401).json(errResult);
        }

        const query = { [`players.${_id}`]: { $exists: true } };
        const allGames = await this.service.fetchRecords(query, skip, +limit);
        const ttl = await this.service.countRecords(query);

        Promise.all([allGames, ttl]).then(result => {
            if (result[0].error) {
                return res.status(result[0].statusCode).json(result[0].errors);
            }

            if (result[1].error) {
                return res.status(result[1].statusCode).json(result[0].errors);
            }

            // setTimeout(()=>{    // TESTING

            return res.status(200).json({
                items: result[0].data,
                totalCount: result[1].data
            });

            // }, 2500);       // TESTING

        })
            .catch(err => {
                return res.status(result[0].statusCode).json(result);
                Logger.error(err)
            })

    }


    //remove player
    /**
     * 
     * @param {*} req 
     * @param {*} req.params    (gameId) 
     * @param {*} req.body      (playerId to remove)
     * @param {*} res 
     */
    async removePlayer(req, res) {
        const { id } = req.params;
        const { playerId } = req.params;

        const exists = await this._gameExists(id);
        if (exists.data.length > 0) {
            const temp = removePlayer(exists.data[0], playerId);
            const query = { $set: { players: temp.players, games: temp.games } }
            const results = await this.service.updateRecord(id, query);
            return res.status(results.statusCode).json(results);
        }
        return res.status(500).json({ error: true, statusCode: 500, errors: ['invalidGame'] });
    }



    //update game
    /**
     * 
     * @param {*} req 
     * @param {*} req.params (game id) 
     * @param {*} req.body.userId (user id) 
     * @param {*} req.body.scores (new scores object) 
     * @param {*} res 
     */
    async updateGameScores(req, res) {

        Logger.dev('[updateGameScores]');
        Logger.dev(req.body);


        const { id } = req.params;
        const exists = await this._gameExists(id);
        if (exists.data.length > 0) {
            const game = await this.service.fetchRecords({ _id: id });
            const result = updatePlayerScores(game.data[0], req.body.userId, req.body.scores);
            const query = { $set: { players: result.players, games: result.games } };
            const updatedRes = await this.service.updateRecord(id, query);
            return res.status(updatedRes.statusCode).json(updatedRes);
        }
        return res.status(500).json({ error: true, statusCode: 500, errors: ['invalidGame'] });
    }

}

module.exports = new GameController(gameService);