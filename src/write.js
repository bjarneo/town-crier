'use strict';

const chalk = require('chalk');
const transformDate = require('./transformation/transform-date');

module.exports = function write(data) {
    console.log(
        chalk.underline('[%s] [%s]') + '\n%s \n%s\n%s\n\n',
        chalk.dim(transformDate(data.date)),
        chalk.dim(data.provider),
        data.title,
        data.description,
        chalk.dim(data.link)
    );
};
