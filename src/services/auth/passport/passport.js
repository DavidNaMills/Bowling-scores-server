const ExtractJwt = require ('passport-jwt').ExtractJwt;
const JwtStrategy = require ('passport-jwt').Strategy;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const  Logger = require ( '../../../Logger/Logger');

const User = require ('../../../models/userModel/userModel.js');
const StatsController = require('../../../Controllers/StatsController/StatsController')
const config = require ('../../../config/index');
const buildUserObject = require ('../../../Helpers/buildUserObject/buildUserObject.js');


const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
    secretOrKey : config.jwtSecret
}

const localOptions = {
    usernameField: 'username',
    passwordField: 'password'
};

passport.serializeUser(function(user, cb) {
    Logger.info('[serializeUser]');
    Logger.info(user);
    
    cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
    Logger.info('[deserializeUser]');
    db.users.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });


const jwtLogin = new JwtStrategy(jwtOptions, (payload, done)=>{
    Logger.info('passport.js [jwtLogin]');
    Logger.info(payload);
    User.findById(payload.sub)
    .then(user=>{
        if(user){
            done(null, buildUserObject(user));
        } else {
            done(null, false);
        }
    })
    .catch(err=>done(err, false));
})

const localLogin = new LocalStrategy(localOptions, (username, password, done)=>{
    Logger.info('inside localLogin');
    
    User.findOne({username}).then((user)=>{
        if(!user){
            return done(null, false);
        }
        
        if(user.password === password){
            return done(null, user);
        }

        return done(null, false);

        // user.comparePassword(password, (err, isMatch)=>{
        //     if(err) {
        //         return done(err);
        //     }
        //     if(!isMatch){
        //         return done(null, false);
        //     }

        //     return done(null, user);
        // });

    }).catch((err)=>{done(err);});
});

passport.use(jwtLogin);
passport.use(localLogin);