'use strict';

const meow = require('meow');
const argv = require('minimist')(process.argv.slice(2));

if (argv.help) {
    meow(`
        Usage
          $ town-crier <input>

        Options
             ,  --help           Help
          -i ,  --interval       interval in seconds
          -dF,  --dateFormat     how you'd like your date format
          -s ,  --sources        comma separated list of rss sources

        Examples
          $ town-crier --interval 60
          $ town-crier --dateFormat mm-dd-yyyy
          $ town-crier --sources=http://www.vg.no/rss/feed/,http://www.aftenposten.no/rss/
    `);

    process.exit(-1);
}

const config = {
    interval: ((argv.interval || argv.i) || 60) * 1000, // 60 seconds,
    dateFormat: (argv.dateFormat || argv.dF) || 'dd-mm-yyyy', // mm-dd-yyyy
    sources: [
        'http://www.vg.no/rss/feed/?categories=1068&keywords=&limit=10&format=rss',
        'http://rss.nytimes.com/services/xml/rss/nyt/InternationalHome.xml',
        'http://feeds.reuters.com/reuters/topNews',
        'http://www.theguardian.com/world/rss'
    ]
};

// TODO: create a RSS XML feed validator
if (argv.sources || argv.s) {
    Array.prototype.push.apply(config.sources, argv.sources.split(','));
}

module.exports = config;
