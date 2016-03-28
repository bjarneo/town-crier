'use strict';

const run = require('./src/runner');
const config = require('./config');
const configurator = require('./src/configurator');

configurator(config, function(err) {
    if (err) {
        throw new Error(err);
    }

    run();
});
