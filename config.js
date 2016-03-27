module.exports = {
    interval: 60 * 1000, // 60 seconds,
    dateFormat: 'dd-mm-yyyy', // mm-dd-yyyy | yyyy-mm-dd
    sources: [
        'http://www.vg.no/rss/feed/?categories=1068&limit=10&format=rss',
        'http://rss.nytimes.com/services/xml/rss/nyt/InternationalHome.xml',
        'http://feeds.reuters.com/reuters/topNews',
        'http://www.theguardian.com/world/rss',
        'https://news.ycombinator.com/rss'
    ]
};
