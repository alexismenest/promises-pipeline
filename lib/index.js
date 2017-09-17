'use strict';

const Promise = require('bluebird');

const pipeline = function (tasks, initialInput = null) {

  if (!Array.isArray(tasks)) {
    const err = new TypeError('Expecting an array as first argument');
    
    return Promise.reject(err);
  }

  for (const task of tasks) {
    if (typeof task !== 'function') {
      const err = new TypeError('Expecting an array of functions only as first argument');
      
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
