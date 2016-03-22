'use strict';

const config = require('./config');
const daemon = require('./src/daemon');

daemon(config);
