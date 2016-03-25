'use strict';

const zeroPad = require('../zero-pad');

module.exports = function transformDate(date) {
    date = new Date(date);

    return zeroPad(date.getHours() + 1) + ':' +
        zeroPad(date.getMinutes()) + ':' +
        zeroPad(date.getSeconds());
};
