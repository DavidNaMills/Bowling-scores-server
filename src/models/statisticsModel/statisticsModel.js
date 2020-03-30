const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    playerId : {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        required: 'stRequired'
    },
    average: {
        type: Number,
        default: 0
    },
    ttlGames: {
        type: Number,
        default: 0
    },
    ttlFrames: {
        type: Number,
        default: 0
    },
    ttlPinFall: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: new Date()
    },
    lastUpdated: {
        type: Date,
        default: null
    }
});

const Stats = mongoose.model('stats', statsSchema);
module.exports = Stats;