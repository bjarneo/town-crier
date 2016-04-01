'use strict';

const request = require('request');
const parse = require('xml2js').parseString;

function promisify(source) {
    function resolver(resolve, reject) {
        request({
            url: source,
            timeout: 15000
        }, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                reject(err);
            }

            parse(body, (err, res) => {
                if (err) {
                    reject(err);
                }

                 resolve(res);
            });
        }).end();
    }

    return new Promise(resolver);
}

function fetch(sources) {
    var promises = [];

    sources.forEach(source => promises.push(promisify(source)));

    return Promise.all(promises);
}

module.exports = fetch;
