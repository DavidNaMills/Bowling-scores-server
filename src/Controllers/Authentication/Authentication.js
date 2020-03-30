const jwt = require('jwt-simple');
const User = require ('../../models/userModel/userModel.js');
const StatsController = require('../../Controllers/StatsController/StatsController');

const config = require('../../config/index.js');
const buildUserObject = require( '../../Helpers/buildUserObject/buildUserObject.js');
const Logger = require( '../../Logger/Logger');

const tokenForUser=(user)=>{
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user._id, iat:timeStamp}, config.jwtSecret);
};


exports.signin = async(req, res, next)=>{
    console.log('in signin part');

    Logger.dev(req.stats);
    const stats = await StatsController.fetchStatsLogin(req.user._id)

    res.send({
        token:tokenForUser(req.user), 
        user: buildUserObject(req.user),
        stats: stats
    });
};


exports.signup = async(req, res, next)=>{
    const username= req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(422).json({error:"invalEmPwd"});       //add more validation for email
    }

    const existingUser = await User.findOne({username})
    .catch(err=>{
        return res.status(500).json({error:err});
    });
        if(existingUser){
            return res.status(422).json({error:"emExist"});
        }

        const user = await User(req.body).save()
        .catch(err=>{
            Logger.error('error save')
            Logger.error(err)
            return res.status(500).json({error:err});
        });

        if(!user){
            return res.status(500).json({error:user.errors});
        }

        Logger.dev('make call here');
        const stats = await StatsController.newStats({id: user._id});

        return res.json({
            token: tokenForUser(user),
            user: buildUserObject(user),
            stats
        });
};