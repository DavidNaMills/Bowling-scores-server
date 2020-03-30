

module.exports={
    port: process.env.PORT || 7800,
    databaseURL : process.env.URI || 'mongodb://localhost/bowling-scores',

    logs: process.env.LOG_LEVEL || 'silly',

    signature: process.env.SIGNATURE || '56ds5f6dsf5d6sg5fdc3g5r6v235g96',

    jwtSecret : process.env.JWT_SECRET || 'this_is_a_temp_secret'
}