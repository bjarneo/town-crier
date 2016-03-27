'use strict';

const spread = require('array-spread');
const fetch = require('./fetch');
const transformData = require('./transformation/transform-data');
const sortByDate = require('./sort/sort-by-date');
const write = require('./write');
const config = require('./configurator');

function timeout() {
    setTimeout(runner, config.interval);
}

function handleData(providers) {
    providers = providers.map(transformData);

    // Same as ...providers (ES6)
    providers = spread(providers);

    providers = providers.sort(sortByDate);

    providers.forEach(write);

    timeout();
}

function runner() {
    fetch(config.sources)
        .then(handleData)
        .catch(console.error)
        .then(timeout);
}

module.exports = runner;

