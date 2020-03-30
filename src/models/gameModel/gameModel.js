const mongoose =require ('mongoose');

const gameSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: new Date()
    },
    players:{
        type: Object
    },
    games: {
        type: Object
    }
});

const Game = mongoose.model('game', gameSchema);
module.exports= Game;