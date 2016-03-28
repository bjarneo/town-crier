'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const register = require('hoki').register;
const unregister = require('hoki').unregister;
const dispatch = require('hoki').dispatch;
const observer = require('hoki').observer;

function inquiries(config) {
    const feeds = [];
    const customRssFeed = [];
    const sources = config.initialSources || config.sources;

    sources.forEach((source) => {
        feeds.push({
            name: source
        });
    });

    register(['config:before:finish', 'config:finish']);

    const questions = [{
        type: 'input',
        name: 'interval',
        message: 'What interval in seconds do you wish to fetch RSS data?',
        default: 30,
        validate: interval => {
            interval = parseInt(interval, 10);

            if (interval < 30) {
                return 'Interval need to be greater than equal 30 seconds';
            }

            return true;
        }
    }, {
        type: 'input',
        name: 'dateFormat',
        message: 'What date format do you wish to use? (dd-mm-yyyy | mm-dd-yyyy | yyyy-mm-dd)',
        default: 'dd-mm-yyyy'
    }, {
        type: 'checkbox',
        message: 'Select RSS feed(s)',
        name: 'sources',
        choices: feeds
    }, {
        type: 'confirm',
        name: 'customRssFeeds',
        message: 'Do you want to enter custom RSS feed(s)?',
        default: true,
    }];

    const customRssQuestions = [{
        type: 'input',
        name: 'customRss',
        message: 'Add custom RSS feed (url):'
    }, {
        type: 'confirm',
        name: 'askAgain',
        message: 'Want to enter another RSS feed?',
        default: true
    }];

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
        if (!config.build) {
            config.build = true;
        }

        observer('config:before:finish', writeConfig);

        updateSources(items.sources);

        updateInterval(items.interval);

        if (items.customRssFeeds) {
            customFeeds();
        } else {
            dispatch('config:before:finish');
        }
    }

    function updateCustomFeed(answers) {
        if (answers.customRss.length) {
            customRssFeed.push(answers.customRss);
        }

        if (answers.askAgain) {
            customFeeds();
        } else {
            updateSources(customRssFeed, true);

            dispatch('config:before:finish');
        }
    }

    function writeConfig() {
        var data = 'module.exports = ' + JSON.stringify(config);

        fs.writeFile('config.js', data, 'utf-8', err => dispatch('config:finish', err));
    }

    function customFeeds() {
        inquirer.prompt(customRssQuestions, updateCustomFeed);
    }

    function init(cb) {
        inquirer.prompt(questions, updateConfig);

        observer('config:finish', cb);
    }

    return {
        init: init
    };
}

module.exports = inquiries;
