import '../../models/setupHelper';
import { ObjectId } from 'mongodb';
import { mockRequest, mockResponse } from '../testHelpers/interceptor';
import Game from '../../models/gameModel/gameModel';
import GameController from './GameController';
import gameTestData, { deleteId, updateId } from '../../testData/gameControllerTestData';
import { updatePlayerScores } from '../../Helpers/updatePlayerScores/updatePlayerScores';

beforeEach(()=>{
    jest.clearAllMocks();
});

describe('GameController test suite', () => {
    describe('.createNewGame test suite', () => {
        it('should return 201 and correct values', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.body = gameTestData;
            res.locals = {};
            res.locals.updatedStats ={
                average:123,
                ttlGame:9
            };

            await GameController.createNewGame(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                statusCode: 201,
                // item: expect.objectContaining(gameTestData)
                stats: expect.objectContaining({
                    average:123,
                    ttlGame:9
                })
            }));
        });

        it('should return 500 and error messages', async () => {
            let req = mockRequest();
            const res = mockResponse();
            req.body = {};
            res.locals = {};
            res.locals.updatedStats ={
                average:123,
                ttlGame:9
            }

            await GameController.createNewGame(req, res);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                statusCode: 500,
                message: 'invalid'
            }));
        });
    });

    //addNewFrame
    describe('.addNewFrame test suite', () => {
        const testData = {
            1: {
                123: { name: "david", score: 178 },
                457: { name: "hello", score: 200 }
            }
        };

        it('adds a new frame to the game object and returns correct response', async () => {
            const temp = await new Game(gameTestData).save();
            const key = 2;
            const data = {
                '456456f45b6': {
                    "score": 158,
                    "name": "David"
                }
            };

            let req2 = mockRequest();
            const res2 = mockResponse();
            req2.body = {
                key,
                data
            }
            res2.locals = {};
            res2.locals.updatedStats ={
                average:123,
                ttlGame:9
            };

            req2.params.id = temp._id;
            await GameController.addNewFrame(req2, res2);
            expect(res2.json).toHaveBeenCalledTimes(1);
            expect(res2.status).toHaveBeenCalledWith(202);
            expect(res2.json).toHaveBeenCalledWith(expect.objectContaining({
                statusCode: 202,
                error: false,
                item: expect.objectContaining({
                    ...temp._doc,
                    games: {
                        1: {
                            "5dce078376087d15e0e20997": {
                                "score": 300,
                                "name": "David"
                            },
                            [deleteId]: {
                                "name": "bob",
                                "score": 156
                            }
                        },
                        2: {
                            '456456f45b6': {
                                "score": 158,
                                "name": "David"
                            }
                        }
                    }
                }),
                stats: expect.objectContaining({
                    average:123,
                    ttlGame:9
                })
            }));
        });
    });


    it('returns an error if the game ID doesnt exist', async () => {
        const id = new ObjectId();
        const key = 2;
        const data = {
            '456456f45b6': {
                "score": 158,
                "name": "David"
            }
        };

        let req = mockRequest();
        const res = mockResponse();
        req.body = {
            key,
            data
        }
        res.locals = {};
        res.locals.updatedStats ={
            average:123,
            ttlGame:9
        };
        req.params.id = id;
        
        await GameController.addNewFrame(req, res);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 500,
            error: true,
            errors: expect.anything()
        }));
    });


    describe('addNewPlayer tests', () => {
        it('adds a new player to the players object and returns correct response', async () => {
            const temp = await new Game(gameTestData).save();
            const key = 'fds6fd23sa2d13s';
            const data = {
                name: 'big bob billy',
                color: '87, 222, 213'
            }

            let req = mockRequest();
            const res = mockResponse();
            req.params.id = temp._id;
            req.body.key = key;
            req.body.data = data;

            await GameController.addNewPlayer(req, res);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: false,
                statusCode: 202,
                item: expect.objectContaining({
                    ...temp._doc,
                    players: {
                        "5dce078376087d15e0e20997": {
                            "name": "David",
                            "color": "168, 50, 160"
                        },
                        'fds6fd23sa2d13s': {
                            name: 'big bob billy',
                            color: '87, 222, 213'
                        },
                        [deleteId]: {
                            "name": "bob",
                            "color": "168, 50, 160"
                        }
                    }
                })
            }))
        });

        it('returns 500 and error message if game id doesnt exist', async () => {
            const id = new ObjectId();
            const req = mockRequest();
            const res = mockResponse();
            req.params.id = id;
            req.body.key = 'fdsa';
            req.body.data = { name: 'dsadsdas', color: 'dsadsdsdsa' }

            await GameController.addNewPlayer(req, res);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                statusCode: 500,
                errors: expect.anything()
            }))
        });

    });

    //findPersonalGames
    describe('findPersonalGames tests', () => {
        const userId = new ObjectId();
        const userId2 = new ObjectId();

        const data = {
            players: {
                [userId]: {
                    "name": "David",
                    "color": "168, 50, 160"
                }
            },
            games: {
                "1": {
                    [userId]: {
                        "score": 300,
                        "name": "David"
                    }
                }
            }
        };

        const data2 = {
            players: {
                [userId2]: {
                    "name": "Alan",
                    "color": "168, 50, 160"
                }
            },
            games: {
                "1": {
                    [userId2]: {
                        "score": 300,
                        "name": "David"
                    }
                }
            }
        }

        const data3 = {
            players: {
                [userId2]: {
                    "name": "Alan",
                    "color": "168, 50, 160"
                }
            },
            games: {
                "1": {
                    [userId2]: {
                        "score": 300,
                        "name": "David"
                    }
                }
            }
        }



        it('fetches the correct number of records and returns correct response', async () => {
            const game1 = await new Game(data).save();
            const game2 = await new Game(data2).save();
            const game3 = await new Game(data3).save();
            let req = mockRequest();
            const res = mockResponse();
            req.user = { _id: userId };

            await GameController.findPersonalGames(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledTimes(1);
        });

        it('returns a 500 and error message if the userId is missing', async () => {
            let req = mockRequest();
            const res = mockResponse();
            req.user = {};

            await GameController.findPersonalGames(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: true,
                statusCode: 401,
                errors: expect.any(Array)
            }));
        });
    });


    describe('removePlayer tests', () => {
        it('successfully removes the player from all games', async () => {
            const temp = await new Game(gameTestData).save();
            let req = mockRequest();
            const res = mockResponse();
            req.params.id = temp._id;
            req.params.playerId = deleteId;

            await GameController.removePlayer(req, res);

            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                error: false,
                statusCode: 202,
                item: expect.objectContaining({
                    ...gameTestData,
                    players: expect.objectContaining({
                        "5dce078376087d15e0e20997": {
                            "name": "David",
                            "color": "168, 50, 160"
                        }
                    }),
                    games: expect.objectContaining({
                        "1": {
                            "5dce078376087d15e0e20997": {
                                "score": 300,
                                "name": "David"
                            }
                        }
                    })
                })
            });
        });


        it('returns 500 if the game doesnt exist', async () => {
            const temp = await new Game(gameTestData).save();
            let req = mockRequest();
            const res = mockResponse();
            req.params.id = new ObjectId();
            req.params.playerId = new ObjectId();

            await GameController.removePlayer(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.status).toHaveBeenCalledTimes(1);

            expect(res.json).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                errors: expect.anything()
            });
        });
    });


    describe('updateGameScores test suite', () => {
        it('updates all amended scores', async () => {
            const temp = await new Game(gameTestData).save();
            const scores = { "1": 254 };

            let req = mockRequest();
            const res = mockResponse();
            req.params.id = temp._id;
            req.body.userId = updateId;
            req.body.scores = scores;

            const upRes = updatePlayerScores(temp, updateId, scores);
            await GameController.updateGameScores(req, res);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(202);
            // expect(res.json).toHaveBeenCalledWith({
            //     error: false,
            //     statusCode: 202,
            //     item: {...upRes}
            // });
        })
        it('returns 500 if game is not found', async()=>{
            let req = mockRequest();
            const res = mockResponse();
            req.params.id = new ObjectId();

            await GameController.updateGameScores(req, res);

            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledTimes(1);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                error: true,
                statusCode: 500,
                errors: expect.anything()
            });
        });
    });

});