'use strict';

const zeroPad = require('../zero-pad');
const config = require('../configurator');

module.exports = function transformDate(date) {
    date = new Date(date);

    var dateFormat = '';

    var format = {
        mm: zeroPad(date.getMonth()),
        dd: zeroPad(date.getDate()),
        yyyy: date.getFullYear()
    };

    config.dateFormat.split('-').forEach((f, i, a) => {
        dateFormat += format[f];

        if (i !== (a.length - 1)) {
            dateFormat += '-';
        }
    });

    return dateFormat +
        ' ' + zeroPad(date.getHours() + 1) +
        ':' + zeroPad(date.getMinutes()) +
        ':' + zeroPad(date.getSeconds());
};
