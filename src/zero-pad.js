'use strict';

module.exports = function zeroPad(num) {
    return num <= 9 ? ('0' + num) : num;
};
