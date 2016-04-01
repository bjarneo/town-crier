'use strict';

const spread = require('array-spread');
const parse = require('xml2js').parseString;
const fetch = require('./fetch');
const transformData = require('./transformation/transform-data');
const sortByDate = require('./sort/sort-by-date');
const write = require('./write');
const config = require('../config');

function toJSON(resolvedPromises) {
    const jsonFeeds = [];

    resolvedPromises.forEach(res => {
        parse(res.body, (err, json) => {
            if (err) {
                throw new Error(err);
            }

            jsonFeeds.push(json);
        });
    });

    return jsonFeeds;
}

function runner() {
    fetch(config.sources)
        .then(toJSON)
        .then(jsonFeeds => jsonFeeds.map(transformData))
        .then(data => spread(data))
        .then(data => data.sort(sortByDate))
        .then(data => data.forEach(write))
        .then(() => setTimeout(runner, config.interval))
        .catch(console.error)
}

module.exports = runner;
