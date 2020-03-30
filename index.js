global.__basedir = __dirname;
require('dotenv').config();
require('./src/loaders/Logging/LoggerSetup');

const express = require( 'express');
const config = require ('./src/config/index.js');

const Logger = require('./src/Logger/Logger');

const startServer = async () => {
  const app = express();
  await require('./src/loaders/index.js')({ expressApp: app });

  app.listen(config.port, err => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`Server listening on ${config.port}`);
  })
}

startServer();
