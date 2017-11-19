'use strict';

const Promise = require('bluebird');

module.exports = function (tasks = null, initialValue = null) {

  return Promise.reduce(tasks, (results, task) => task(results).then(result => result), initialValue);
};
