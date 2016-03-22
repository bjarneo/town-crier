'use strict';

const cache = require('memory-cache');
const spread = require('array-spread');
const chalk = require('chalk');
const fetch = require('./fetch');

const write = (data) => {
    console.log(
        '[%s] <%s> %s - %s \n [%s]\n\n',
        chalk.dim(transformDate(data.date)),
        chalk.bold(data.provider),
        data.title,
        data.description,
        chalk.dim(data.link)
    );
};

const zeroPad = (num) => {
    return num <= 9 ? ('0' + num) : num;
};

const transformDate = (date) => {
    date = new Date(date);

    return zeroPad(date.getHours() + 1) + ':' +
        zeroPad(date.getMinutes()) + ':' +
        zeroPad(date.getSeconds());
};

var initial = true;
const transformData = (provider) => {
    var channel = provider.rss.channel[0];
    var lastBuild = new Date(channel.item[0].pubDate).getTime();
    var getCacheItem = cache.get(channel.title);
    var shouldUpdate = (getCacheItem && getCacheItem < lastBuild);

    if (shouldUpdate === false) {
        return null;
    }

    initial = false;

    cache.put(channel.title, lastBuild);

    var items = channel.item;
    if (!initial) {
        items = items.map((item) => {
            if (getCacheItem < new Date(item.pubDate).getTime()) {
                return item;
            }
        });
    }

    items = items.map((item) => {
        return {
            provider: channel.title,
            title: item.title,
            description: item.description,
            link: item.link,
            date: item.pubDate
        };
    });

    return items;
};

const sortByDate = (a, b) => {
    var n;
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();

    if (aDate > bDate) {
        n = 1;
    } else if (aDate < bDate) {
        n = -1;
    } else {
        n = 0;
    }

    return n;
};

const daemon = (config) => {
    const handleData = (providers) => {
        providers = providers.map(transformData);

        providers = spread(providers);

        if (providers[0]) {
            providers = providers.sort(sortByDate);

            providers.forEach(write);
        }

        setTimeout(runner, 60000);
    };

    const runner = () => {
        fetch(config.sources)
            .then(data => {
                handleData(data);
            })
            .catch(console.error);
    };

    runner();
};

module.exports = daemon;

