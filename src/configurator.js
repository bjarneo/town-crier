'use strict';

const meow = require('meow');

function configurator(config, cb) {
    const inquiries = require('./interaction/inquiries')(config);

    const cli = meow(`
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

    if (!cli.flags.help && (!config.build || cli.flags.reset)) {
        inquiries.initialize(cb);

        return;
    }

    if (cli.flags.help) {
        process.exit(1);
    }

    // TODO: create a RSS XML feed validator
    if (cli.flags.sources) {
        Array.prototype.push.apply(config.sources, cli.flags.sources.split(','));
    }

    if (cli.flags.interval) {
        config.interval = cli.flags.interval * 1000;
    }

    if (cli.flags.dateFormat) {
        config.dateFormat = cli.flags.dateFormat;
    }

    cb();
}

module.exports = configurator;
