'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const config = require('./src/configurator');
const run = require('./src/runner');

const feeds = [];
const customRssFeed = [];
const sources = config.initialSources || config.sources;

sources.forEach((source) => {
    feeds.push({
        name: source
    });
});

function updateSources(sources, append) {
    if (!config.initialSources) {
        config.initialSources = config.sources;
    }

    if (append) {
        Array.prototype.push.apply(config.sources, sources);
    } else {
        config.sources = sources;
    }
}

function updateInterval(interval) {
    if (!config.initialInterval) {
        config.initialInterval = config.interval;
    }

    config.interval = interval;
}

function updateConfig(items) {
    updateSources(items.sources);

    updateInterval(items.interval);

    customFeeds(function(customSources) {
        updateSources(customSources, true);

        var data = 'module.exports = ' + JSON.stringify(config);

        fs.writeFile('config.js', data, 'utf-8', err => console.error);

        run();
    });
}

function customFeeds(cb) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'customRss',
            message: 'Add custom RSS feed:'
        },
        {
            type: 'confirm',
            name: 'askAgain',
            message: 'Want to enter another RSS feed?',
            default: true
        }
    ], answers => {
        if (answers.customRss.length) {
            customRssFeed.push(answers.customRss);
        }

        if (answers.askAgain) {
            customFeeds();
        } else {
            cb(customRssFeed);
        }
    });
}

// TODO: All interaction should be in the configurator
inquirer.prompt([
    {
        type: 'input',
        name: 'interval',
        message: 'What interval in seconds do you wish to fetch RSS data?',
        default: () => {
            return 30;
        },
        validate: interval => {
            interval = parseInt(interval, 10);

            if (interval < 30) {
                return 'Interval need to be greater than equal 30 seconds';
            }

            return true;
        }
    },
    {
        type: 'checkbox',
        message: 'Select RSS feed(s)',
        name: 'sources',
        choices: feeds
    }
], updateConfig);
