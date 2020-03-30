const Logger = require ('../../../Logger/Logger');
const passport = require ('passport');
require ('../../../services/auth/passport/passport.js');

const Authentication = require ('../../../Controllers/Authentication/Authentication.js');

const StatsController = require('../../../Controllers/StatsController/StatsController')

const requireAuth = passport.authenticate('jwt', {session: false});   //for confirmation logged in
const requireSignin = passport.authenticate('local', {session: false});   //for basic login

module.exports =(app)=>{
    
    app.post('/access/signup', Authentication.signup, StatsController.newStats,(req, res, next)=>{
        Logger.info('1): request to signup');
    });

    app.post('/access/login', requireSignin, Authentication.signin);
    
    app.get('/access/jwt-login', requireAuth, (req, res)=>{
        res.status(200).json(req.user).end();
    });
}