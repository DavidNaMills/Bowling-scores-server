const {ObjectID} = require ('mongodb');
const mongoose = require('mongoose');

const privateEventErr = require('../../consts/errorCodes/privateEventModelErrors');
const {eventTypesArray, FRIEND_REQUEST} = require ('../../consts/eventTypes');

const privateEventSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: new Date()
    },
    eventId:{    //id of friend/game
        type: ObjectID,
        required: [true, privateEventErr.eventId]
    },
    name:{
        type: String,
        default: ''
    },
    avatar:{
        type: String,
        default: ''
    },
    message:{
        type: String,
        default: ''
    },
    eventType:{
        type: String,
        enum: eventTypesArray,
        default: FRIEND_REQUEST,
        required: [true, privateEventErr.noType]
    },
    hasViewed:{
        type: Boolean,
        default: false
    }
});

exports.PrivateEvent = mongoose.model('PrivateEvent', privateEventSchema);
module.exports = privateEventSchema;