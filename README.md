# promises-pipeline

Sequentially executes an array of functions whose return values are promises, passing the output of one function as the input of the next one

[![Build status](https://travis-ci.org/alexismenest/promises-pipeline.svg?branch=master)](https://travis-ci.org/alexismenest/promises-pipeline)


## Installation

```sh
npm install promises-pipeline --save
```

## API

### pipeline(tasks[, initialInput])

* `tasks` `{Array<Function>}` An array of functions whose return values are promises
* `initialInput` `{*}` An optional initial input that can be of any type

`pipeline()` returns a promise that resolves when all of the promises in the given functions have resolved or, if any of the promises rejects, rejects immediately with the reason of the first promise that rejected, discarding all the other promises whether or not they have resolved. 

## Usage

```js
const pipeline = require('promises-pipeline');

const errorTask = function (input) {

  const err = new Error('Failed generating "Hello, World!"');

  return Promise.reject(err);
};

const helloTask = function () {

  const output = 'Hello,';

  return Promise.resolve(output);
};

const hiTask = function (input) {

  const output = `Hi${input}`;

  return Promise.resolve(output);
};

const worldTask = function (input) {

  const output = `${input} World!`;
  
  return Promise.resolve(output);
};

const errorHelloWorldTasks = [helloTask, errorTask, worldTask];
const hiWorldInitialInput = ',';
const hiWorldTasks = [hiTask, worldTask];
const normalHelloWorldTasks = [helloTask, worldTask];

pipeline(normalHelloWorldTasks)
  .then((output) => {

    console.log(output);// 'Hello, World!'
  })
  .catch(() => {});// Never reached

pipeline(hiWorldTasks, hiWorldInitialInput)
  .then((output) => {

    console.log(output);// 'Hi, World!'
  })
  .catch(() => {});// Never reached

pipeline(errorHelloWorldTasks)
  .then(() => {})// Never reached
  .catch((err) => {

    console.error(err.message);// 'Failed generating "Hello, World!"'
  });
```

## Tests

```sh
npm test
```

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
