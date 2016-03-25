'use strict';

const spread = require('array-spread');
const fetch = require('./fetch');
const transformData = require('./transformation/transform-data');
const sortByDate = require('./sort/sort-by-date');
const write = require('./write');

// "daemon"
function daemon(config) {
    function handleData(providers) {
        providers = providers.map(transformData);

        // Same as ...providers (ES6)
        providers = spread(providers);

        providers = providers.sort(sortByDate);

        providers.forEach(write);

        setTimeout(runner, config.interval);
    };

    function runner() {
        fetch(config.sources)
            .then(handleData)
            .catch(err => setTimeout(() => { throw new Error(err); })) // get full stack hack
            .catch(console.error);
    };

    runner();
}

module.exports = daemon;

