'use strict';

const zeroPad = require('../zero-pad');
const config = require('../../config');

module.exports = function transformDate(date) {
    date = new Date(date);

    var dateFormat;
    if (config.dateFormat === 'mm-dd-yyyy') {
        dateFormat = zeroPad(date.getMonth()) +
            '-' + zeroPad(date.getDate()) +
            '-' + date.getFullYear();
    } else if (config.dateFormat === 'yyyy-mm-dd') {
        dateFormat = date.getFullYear() +
            '-' + zeroPad(date.getMonth()) +
            '-' + zeroPad(date.getDate());
    } else {
        dateFormat = zeroPad(date.getDate()) +
            '-' + zeroPad(date.getMonth()) +
            '-' + date.getFullYear();
    }

    return dateFormat +
        ' ' + zeroPad(date.getHours() + 1) +
        ':' + zeroPad(date.getMinutes()) +
        ':' + zeroPad(date.getSeconds());
};
