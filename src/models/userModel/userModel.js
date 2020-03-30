const mongoose = require('mongoose');
const errs = require('../../consts/errorCodes/userModelErrors.js');

const friendsSchema = require('./friendModel/friendModel.js');
const privateEventSchema = require('../privateEvent/privateEvent.js');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, errs.name01]
    },
    password: {
        type: String,
        required: [true, errs.pwd]
    },
    username:{
        type: String,
        required: [true, errs.usrNme]
    },
    thirdPartyid: {  //(google/facebook/wechat)
        type: String,
        // required: [true, errs.pwd]
    },
    avatar:{
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    friends: [friendsSchema],
    privateEvents: [privateEventSchema],
    games: [],
    privacySettings:{
        type: Object,
        default: {}
    },
    showMsg: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('user', userSchema);
module.exports = User;