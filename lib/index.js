'use strict';

const Promise = require('bluebird');

module.exports = function (tasks = null, initialInput = null) {

  return Promise.reduce(tasks, (results, task) => {

    return task(results).then(result => { return result; });
  }, initialInput);
};
