'use strict';

const Promise = require('bluebird');

module.exports = function (tasks, initialInput = null) {

  if (!Array.isArray(tasks)) {
    const message = 'Expecting an array as first argument';
    const error = new TypeError(message);
    
    return Promise.reject(error);
  }

  for (const task of tasks) {
    if (typeof task !== 'function') {
      const message = 'Expecting an array of functions only as first argument';
      const error = new TypeError(message);
      
      return Promise.reject(error);
    }
  };

  return Promise.reduce(tasks, (results, task) => {

    return task(results).then((result) => {

      return result;
    });
  }, initialInput);
};
