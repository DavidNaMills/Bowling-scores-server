const {ObjectID} = require ('mongodb');
const mongoose = require('mongoose');
const friendErr = require('../../../consts/errorCodes/friendModelErrors.js');

const {PENDING, FRIEND_STATUS_ARRAY} = require ('../../../consts/friendModelStatus');

const friendsSchema = new mongoose.Schema({
    // friendid
    addDate:{
        type: Date,
        default: new Date().getTime()
    },
    id:{
        type: ObjectID,
        required: [true, friendErr.friendId]
    },
    name:{
        type: String,
        required: [true, friendErr.nameFr]
    },
    avatar:{
        type: String,
        default: ''
    },
    status:{
        type: String,
        enum: FRIEND_STATUS_ARRAY,
        default: PENDING
    },
    restrictions:{
        type: Object,
        default: {}
    }
});

exports.Friends = mongoose.model('friends', friendsSchema);
module.exports = friendsSchema;