'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const register = require('hoki').register;
const dispatch = require('hoki').dispatcher;
const observe = require('hoki').observer;

// TODO: Refactor
function inquiries(config) {
    const feeds = [];
    const customSources = [];
    const sources = config.initialSources || config.sources;

    sources.forEach((source) => {
        feeds.push({
            name: source
        });
    });

    register([
        'config:initialize',
        'config:items:sources',
        'config:items:interval',
        'config:items:customSources',
        'config:items:customSources:after',
        'config:finish:before',
        'config:finish'
    ]);

    const initialQuestions = [{
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
        name: 'customSources',
        message: 'Do you want to enter custom RSS feed(s)?',
        default: true,
    }];

    const customSourcesQuestions = [{
        type: 'input',
        name: 'customRss',
        message: 'Add custom RSS feed (url):'
    }, {
        type: 'confirm',
        name: 'askAgain',
        message: 'Want to enter another RSS feed?',
        default: true
    }];

    function initialize(cb) {
        // update sources
        observe('config:items:sources', updateSources);

        // update poll interval
        observe('config:items:interval', updateInterval);

        // run custom sources
        observe('config:items:customSources', () => inquirer.prompt(
            customSourcesQuestions,
            updateCustomSources
        ));

        // write the new config before we finish the configuration
        observe('config:finish:before', writeConfig);

        // kick start the inquiries
        observe('config:initialize', () => inquirer.prompt(initialQuestions, handleAnswers));

        // run the callback when finished to start the application
        observe('config:finish', cb);

        // initialize, yo
        dispatch('config:initialize');
    }

    function handleAnswers(items) {
        if (!config.build) {
            config.build = true;
        }

        if (items.sources) {
            dispatch('config:items:sources', items.sources);
        }

        if (items.interval) {
            dispatch('config:items:interval', items.interval);
        }

        if (items.customSources) {
            dispatch('config:items:customSources');
        } else {
            dispatch('config:finish:before');
        }
    }

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

    function updateCustomSources(answers) {
        if (answers.customRss.length) {
            customSources.push(answers.customRss);
        }

        if (answers.askAgain) {
            customSources();
        } else {
            updateSources(customSources, true);

            dispatch('config:finish:before');
        }
    }

    function writeConfig() {
        var data = 'module.exports = ' + JSON.stringify(config);

        fs.writeFile('config.js', data, 'utf-8', err => dispatch('config:finish', err));
    }

    return {
        init: initialize
    };
}

module.exports = inquiries;
