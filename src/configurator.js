'use strict';

const meow = require('meow');
const argv = require('minimist')(process.argv.slice(2));

function configurator(config, cb) {
    const inquiries = require('./interaction/inquiries')(config);

    if (argv.help) {
        meow(`
            Usage
              $ town-crier <input>

            Options
              --help           Help
              --interval       Interval in seconds
              --dateFormat     How you'd like your date format
              --sources        Comma separated list of rss sources you want to append current list
              --reset          Reset the config file

            Examples
              $ town-crier --interval=60
              $ town-crier --dateFormat=mm-dd-yyyy
              $ town-crier --sources=http://www.vg.no/rss/feed/,http://www.aftenposten.no/rss/
              $ town-crier --reset
        `);

        process.exit(-1);
    }

    // TODO: create a RSS XML feed validator
    if (argv.sources) {
        Array.prototype.push.apply(config.sources, argv.sources.split(','));
    }

    if (argv.interval) {
        config.interval = argv.interval * 1000;
    }

    if (argv.dateFormat) {
        config.dateFormat = argv.dateFormat;
    }

    if (!config.build || argv.reset) {
        inquiries.init(cb);
    } else {
        cb();
    }
}

module.exports = configurator;
