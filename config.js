/*
const argv = require('argv');

argv.option([
    {
        name: 'interval',
        short: 'i',
        description: 'Poll interval in seconds',
        type: 'int',
        example: 'oyez --interval=60 or oyez -i 60'
    }
]);

argv.run();

console.log(argv);
*/
module.exports = {
    interval: 60 * 1000, // 60 seconds
    sources: [
        'http://www.dagbladet.no/rss/nyheter/',
        'http://www.aftenposten.no/rss/',
        'http://www.vg.no/rss/feed/?categories=1068&keywords=&limit=10&format=rss'
    ]
}
