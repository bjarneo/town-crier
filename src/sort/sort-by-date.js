'use strict';

module.exports = function sortByDate(a, b) {
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
