module.exports= (app) =>{
    require('./accessRoutes/accessRoutes')(app);
    require('./gameRoutes/gameRoutes')(app);
    require('./userRoutes/userRoutes')(app);
}