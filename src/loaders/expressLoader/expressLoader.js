const express = require('express');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const config = require('../../config/index.js');
const routes = require('../../api/routes/index.js');
// const localStrategy = require( '../../a)pi/auth/localStrategy/localStrategy.js';


module.exports =({ app }) => {
    /**
     * Health check enpoints
     */
    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    /**
     * express setup
     */

    app.use(passport.initialize());
    app.use(passport.session());

    app.enable('trust proxy');
    app.use(cors());
    app.use(express.json());


    app.use(passport.initialize());
    app.use(passport.session());

    routes(app);



    app.use(express.static(path.join(__basedir, '/public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__basedir, 'public', 'index.html'));
    });

}