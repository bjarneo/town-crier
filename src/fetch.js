'use strict';

const got = require('got');

module.exports = function fetch(sources) {
    var promises = [];

    sources.forEach(source => promises.push(got(source)));

    return Promise.all(promises);
};
