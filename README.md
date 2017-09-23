# promises-pipeline

Sequentially run promise-returning functions, passing the result of each one to its next

[![Build status](https://travis-ci.org/alexismenest/promises-pipeline.svg?branch=master)](https://travis-ci.org/alexismenest/promises-pipeline)

[![Coverage Status](https://coveralls.io/repos/github/alexismenest/promises-pipeline/badge.svg?branch=master)](https://coveralls.io/github/alexismenest/promises-pipeline?branch=master)


## Installation

```sh
npm install promises-pipeline --save
```

## API

### pipeline(tasks[, initialInput])

* `tasks` `{Iterable<Function>}` An iterable of promise-returning functions
* `initialInput` `{any}` An optional initial input of any type

`pipeline()` returns a promise that resolves when all of the promises in the given functions have resolved or, if any of the promises rejects, rejects immediately with the reason of the first promise that rejected, discarding all the other promises whether or not they have resolved. 

## Usage

```js
const pipeline = require('promises-pipeline');

const errorTask = input => { return Promise.reject(new Error('Failed generating "Hello, World!"')); };
const helloTask = () => { return Promise.resolve('Hello,'); };
const hiTask    = input => { return Promise.resolve(`Hi${input}`); };
const worldTask = input => { return Promise.resolve(`${input} World!`); };

const helloWorldTasks = new Map();
helloWorldTasks.set('helloTask', helloTask);
helloWorldTasks.set('worldTask', worldTask);

const hiWorldTasks = new Set();
hiWorldTasks.add(hiTask);
hiWorldTasks.add(worldTask);

const failureTasks = [helloTask, errorTask, worldTask];

pipeline(helloWorldTasks.values())
  .then(output => console.log(output))// => 'Hello, World!'
  .catch(err => console.error(err.message));// Never reached

pipeline(hiWorldTasks, ',')
  .then(output => console.log(output))// => 'Hi, World!'
  .catch(err => console.error(err.message));// Never reached

pipeline(failureTasks)
  .then(output => console.log(output))// Never reached
  .catch(err => console.error(err.message));// => 'Failed generating "Hello, World!"'
```

## Tests

```sh
npm test
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
