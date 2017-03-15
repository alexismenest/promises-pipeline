'use strict';

const Promise = require('bluebird');

const pipeline = function (tasks, initialInput = null) {

  if (!Array.isArray(tasks)) {
    const message = 'Expecting an array as first argument';
    const err = new TypeError(message);
    
    return Promise.reject(err);
  }

  for (const task of tasks) {
    if (typeof task !== 'function') {
      const message = 'Expecting an array of functions only as first argument';
      const err = new TypeError(message);
      
      return Promise.reject(err);
    }
  }

  return Promise.reduce(tasks, (results, task) => {

    return task(results).then((result) => {

      return result;
    });
  }, initialInput);
};

module.exports = pipeline;
