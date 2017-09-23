'use strict';

const test = require('tape');

const pipeline = require('../lib');

const errorTask = () => { return Promise.reject(new Error('Failed generating Fibonacci sequence')); };

const fibonacci = (num, memo) => {

  if (num === 0) { return 0; }
  if (num === 1) { return 1; }
  if (memo[num]) { return memo[num] };

  return fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
};

const getFibonacciTask = num => {

  return input => {

    const fibonacciNumber = fibonacci(num, input);
    input.push(fibonacciNumber);

    return Promise.resolve(input);
  };
};

test('should require an iterable as first argument', t => {

  const tasks = {};

  pipeline(tasks)
    .then(output => t.fail('should never be executed'))
    .catch(err => {

      t.ok(err);
      t.equal(err.message, 'expecting an array or an iterable object but got [object Null]');
      t.end();
    });
});

test('should require an iterable of functions as first argument', t => {

  const tasks = [''];

  pipeline(tasks)
    .then(output => t.fail('should never be executed'))
    .catch(err => {

      t.ok(err);
      t.equal(err.message, 'task is not a function');
      t.end();
    });
});

test('should rejects immediatly when the promise of one of the tasks rejects', t => {

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
    .then(output => t.fail('should never be executed'))
    .catch(err => {

      t.ok(err);
      t.equal(err.message, 'Failed generating Fibonacci sequence');
      t.end();
    });
});

test('should outputs an array of the seventh first numbers of the Fibonacci sequence', t => {

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
    .then(output => {

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
    .catch(err => t.fail('should never be executed'));
});


