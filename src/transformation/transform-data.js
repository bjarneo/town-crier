'use strict';

const cache = require('memory-cache');

function createItemObject(item, channel) {
    return {
        provider: channel.title,
        title: item.title,
        description: item.description,
        link: item.link,
        date: item.pubDate
    };
}

function getTime(date) {
    return new Date(date).getTime();
}

module.exports = function transformData(provider) {
    const channel = provider.rss.channel[0];
    const getCacheItem = cache.get(channel.title);
    const lastBuild = getTime(channel.item[0].pubDate);
    const shouldUpdate = (getCacheItem && getCacheItem < lastBuild);

    if (shouldUpdate === false) {
        return [];
    }

    cache.put(channel.title, lastBuild);

    var items = channel.item;
    if (getCacheItem) {
        items = items.filter(item => getTime(item.pubDate) > getCacheItem);
    }

    return items.map(item => createItemObject(item, channel));
}
