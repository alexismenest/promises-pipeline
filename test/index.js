'use strict';

const test = require('tape');

const pipeline = require('../lib');

const errorTask = function () {

  const err = new Error('Failed generating Fibonacci sequence');
  
  return Promise.reject(err);
};

const fibonacci = function (num, memo) {

  if (num === 0) {
    return 0;
  }

  if (num === 1) {
    return 1;
  }

  if (memo[num]) {
    return memo[num]
  };

  return fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
};

const getFibonacciTask = function (num) {

  return function (input) {

    const fibonacciNumber = fibonacci(num, input);
    
    input.push(fibonacciNumber);

    return Promise.resolve(input);
  };
};

test('should require an array as first argument', (t) => {

  const tasks = null;

  pipeline(tasks)
    .then((output) => {

      t.fail('should never be executed');
    })
    .catch((err) => {

      t.ok(err);
      t.equal(err.message, 'Expecting an array as first argument');
      t.end();
    });
});

test('should require an array of functions only as first argument', (t) => {

  const zeroFibonacciTask = getFibonacciTask(0);
  const oneFibonacciTask = getFibonacciTask(1);
  const twoFibonacciTask = getFibonacciTask(2);
  const threeFibonacciTask = getFibonacciTask(3);
  const fourFibonacciTask = getFibonacciTask(4);
  const fiveFibonacciTask = getFibonacciTask(5);
  const sixFibonacciTask = getFibonacciTask(6);

  const tasks = [
    zeroFibonacciTask,
    oneFibonacciTask,
    twoFibonacciTask,
    threeFibonacciTask,
    null,
    fourFibonacciTask,
    fiveFibonacciTask,
    sixFibonacciTask
  ];

  pipeline(tasks)
    .then((output) => {

      t.fail('should never be executed');
    })
    .catch((err) => {

      t.ok(err);
      t.equal(err.message, 'Expecting an array of functions only as first argument');
      t.end();
    });
});

test('should rejects immediatly when the promise of one of the tasks rejects', (t) => {

  const zeroFibonacciTask = getFibonacciTask(0);
  const oneFibonacciTask = getFibonacciTask(1);
  const twoFibonacciTask = getFibonacciTask(2);
  const threeFibonacciTask = getFibonacciTask(3);
  const fourFibonacciTask = getFibonacciTask(4);
  const fiveFibonacciTask = getFibonacciTask(5);
  const sixFibonacciTask = getFibonacciTask(6);

  const tasks = [
    zeroFibonacciTask,
    oneFibonacciTask,
    twoFibonacciTask,
    threeFibonacciTask,
    errorTask,
    fourFibonacciTask,
    fiveFibonacciTask,
    sixFibonacciTask
  ];
  const initialInput = [];

  pipeline(tasks, initialInput)
    .then((output) => {

      t.fail('should never be executed');
    })
    .catch((err) => {

      t.ok(err);
      t.equal(err.message, 'Failed generating Fibonacci sequence');
      t.end();
    });
});

test('should outputs an array of the seventh first numbers of the Fibonacci sequence', (t) => {

  const zeroFibonacciTask = getFibonacciTask(0);
  const oneFibonacciTask = getFibonacciTask(1);
  const twoFibonacciTask = getFibonacciTask(2);
  const threeFibonacciTask = getFibonacciTask(3);
  const fourFibonacciTask = getFibonacciTask(4);
  const fiveFibonacciTask = getFibonacciTask(5);
  const sixFibonacciTask = getFibonacciTask(6);

  const tasks = [
    zeroFibonacciTask,
    oneFibonacciTask,
    twoFibonacciTask,
    threeFibonacciTask,
    fourFibonacciTask,
    fiveFibonacciTask,
    sixFibonacciTask
  ];
  const initialInput = [];

  pipeline(tasks, initialInput)
    .then((output) => {

      t.equal(output.length, 7);
      t.equal(output[0], 0);
      t.equal(output[1], 1);
      t.equal(output[2], 1);
      t.equal(output[3], 2);
      t.equal(output[4], 3);
      t.equal(output[5], 5);
      t.equal(output[6], 8);
      t.end();
    })
    .catch((err) => {

      t.fail('should never be executed');
    });
});


