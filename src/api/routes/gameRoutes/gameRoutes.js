const passport = require ('passport');
require ('../../../services/auth/passport/passport.js');
const gameController = require ('../../../Controllers/GameController/GameController.js');
const statsController = require('../../../Controllers/StatsController/StatsController');

const requireAuth = passport.authenticate('jwt', {session: true});

module.exports= (app)=>{
    //create new game
    app.post('/game/newGame', 
        requireAuth, 
        statsController.fetchStats,
        statsController.addGame,
        gameController.createNewGame
    );


    //add new frame
    app.post('/game/addFrame/:id', 
        requireAuth, 
        statsController.fetchStats,
        statsController.addStats,
        gameController.addNewFrame
    );


    //add new player
    app.post('/game/addPlayer/:id',
        requireAuth, 
        gameController.addNewPlayer
    );


    //remove player
    app.delete('/game/removePlayer/:id/:playerId',
        requireAuth, 
        gameController.removePlayer
    );


    // update players scores
    app.put('/game/updateScores/:id',
        requireAuth,
        //  statsController.updateStats,        // TODO: not implemented yet frontend
        gameController.updateGameScores
    );
    


    //find players games
    app.get('/game/personalGames/:skip/:limit', 
        requireAuth,
        gameController.findPersonalGames
    );

}