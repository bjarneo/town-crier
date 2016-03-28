'use strict';

const spread = require('array-spread');
const fetch = require('./fetch');
const transformData = require('./transformation/transform-data');
const sortByDate = require('./sort/sort-by-date');
const write = require('./write');
const config = require('../config');

function handleData(providers) {
    providers = providers.map(transformData);

    // Same as ...providers (ES6)
    providers = spread(providers);

    providers = providers.sort(sortByDate);

    providers.forEach(write);

    return true;
}

function runner() {
    fetch(config.sources)
        .then(handleData)
        .then(() => setTimeout(runner, config.interval))
        .catch(console.error)
}

module.exports = runner;

