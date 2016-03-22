'use strict';

const request = require('request');
const parse = require('xml2js').parseString;

const promisify = (source) => {
    return new Promise((resolve, reject) => {
        request(source, (error, res, body) => {
            if (error && res.statusCode !== 200) {
                reject(error);
            }

            parse(body, (err, result) => {
                if (err) {
                    reject(err);
                }

                return resolve(result);
            });
        });
    });
};

const fetch = (sources) => {
    var promises = [];

    sources.forEach(source => promises.push(promisify(source)));

    return Promise.all(promises);
};

module.exports = fetch;
