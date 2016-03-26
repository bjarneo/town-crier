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
    interval: 60 * 1000, // 60 seconds,
    dateFormat: 'dd-mm-yyyy', // mm-dd-yyyy
    sources: [
        'http://www.dagbladet.no/rss/nyheter/',
        'http://www.aftenposten.no/rss/',
        'http://www.vg.no/rss/feed/?categories=1068&keywords=&limit=10&format=rss',
        'http://rss.nytimes.com/services/xml/rss/nyt/InternationalHome.xml',
        'http://feeds.reuters.com/reuters/topNews',
        'http://www.nasa.gov/rss/image_of_the_day.rss'
    ]
}
