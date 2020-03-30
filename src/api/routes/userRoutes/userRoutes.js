const passport = require ('passport');
require ('../../../services/auth/passport/passport.js');
const userController = require ('../../../Controllers/userController/userController.js');

const requireAuth = passport.authenticate('jwt', {session: true});

module.exports = (app) =>{
    app.get('/user/userUnique/:username', 
        userController.usernameUnique
    )
}