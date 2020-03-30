const logger = require('../../Logger/Logger');

const consoleConfig = require('../../config/LoggerConfigs/console');
console.log('setup Logger');
logger.configLogger({
    methods: [
        consoleConfig
    ],
    level: process.env.LEVEL || 4,
}, 'Bowling-scores');