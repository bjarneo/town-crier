'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const config = require('./src/configurator');
const run = require('./src/runner');

const feeds = [];
const sources = config.initialSources || config.sources;

sources.forEach((source) => {
    feeds.push({
        name: source
    });
});

function updateConfig(items) {
    console.log(items);

    if (!config.initialSources) {
        config.initialSources = config.sources;
    }

    config.sources = items.sources;

    var data = 'module.exports = ' + JSON.stringify(config);

    fs.writeFile('config.js', data, 'utf-8', err => console.error);

    run();
}

// TODO: All interaction should be in the configurator
inquirer.prompt([
    {
        type: 'checkbox',
        message: 'Select RSS feed(s)',
        name: 'sources',
        choices: feeds,
        validate: sources => {
            if (!sources.length) {
                return false;
            }

            return true;
        }
    }
], updateConfig);
