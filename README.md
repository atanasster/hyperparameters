# ES6 hyperparameters optimization

[![Build Status](https://travis-ci.org/atanasster/hyperparameters.svg?branch=master)](https://travis-ci.org/atanasster/hyperparameters) [![dependencies Status](https://david-dm.org/atanasster/hyperjs/status.svg)](https://david-dm.org/atanasster/hyperjs) [![devDependencies Status](https://david-dm.org/atanasster/hyperjs/dev-status.svg)](https://david-dm.org/atanasster/hyperjs?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**IN DEVELOMENT, DO NOT USE !!!**



## Features

* **hyperopt inspired** - somewhat compatible with [https://github.com/hyperopt/hyperopt](https://github.com/hyperopt/hyperopt) 



## Installation

  ```
  $ npm install hyperparameters
  ```


## Parameter Expressions

  ```
  import * as hpjs from 'hyperparameters';
  ```

### hpjs.choice(options)

- Randomly returns one of the options

### hpjs.randint(upper)

- Return a random integer in the range [0, upper)

### hpjs.uniform(low, high)

- Returns a single value uniformly between `low` and `high` i.e. any value between `low` and `high` has an equal probability of being selected

### hpjs.quniform(low, high, q)

- returns a quantized value of `hp.uniform` calculated as `round(uniform(low, high) / q) * q`

### hpjs.loguniform(low, high)

- Returns a value `exp(uniform(low, high))` so the logarithm of the return value is uniformly distributed.

### hpjs.qloguniform(low, high, q)

- Returns a value `round(exp(uniform(low, high)) / q) * q`

### hpjs.normal(mu, sigma)

- Returns a real number that's normally-distributed with mean mu and standard deviation sigma

### hpjs.qnormal(mu, sigma, q)

- Returns a value `round(normal(mu, sigma) / q) * q`

### hpjs.lognormal(mu, sigma)

- Returns a value `exp(normal(mu, sigma))`

### hpjs.qlognormal(mu, sigma, q)

- Returns a value `round(exp(normal(mu, sigma)) / q) * q`



## Random numbers generator

  ```
  import { RandomState } from 'hyperparameters';
  ```
  
  **example:**
  ```
  const rng = new RandomState(12345);
  console.log(rng.randrange(0, 5, 0.5));

  ```


## Spaces

  ```
  import { sample } from 'hyperparameters';
  ```
  
  **example:**
  ```
  import * as hpjs from 'hyperparameters';
  
  const space = {
    x: hpjs.normal(0, 2),
    y: hpjs.uniform(0, 1),
    choice: hpjs.choice([
      undefined, hp.uniform('float', 0, 1),
    ]),
    array: [
      hpjs.normal(0, 2), hpjs.uniform(0, 3), hpjs.choice([false, true]),
    ],
    obj: {
      u: hpjs.uniform(0, 3),
      v: hpjs.uniform(0, 3),
      w: hpjs.uniform(-3, 0)
    }
  };

  console.log(hpjs.sample.randomSample(space));

  ```
## fmin - find best value of a function over the arguments 

  ```
  import * as hpjs from 'hyperparameters';
  const trials = hpjs.fmin(optimizationFunction, space, estimator, max_estimates, options); 
  ```
  
  **example:**
  ```
  import * as hpjs from 'hyperparameters';

  const fn = x => ((x ** 2) - (x + 1));
  const space = hpjs.uniform(-5, 5);
  fmin(fn, space, hpjs.search.randomSearch, 1000, { rng: new hpjs.RandomState(123456) })
    .then(trials => console.log(result.argmin));
  ```
## Getting started with tensorflow.js

### 1. [include javascript file](https://github.com/atanasster/hyperparameters/tree/master/examples/tiny)  

* include (latest) version from cdn

`<script src="https://cdn.jsdelivr.net/npm/hyperparameters@0.25.2/dist/hyperparameters.min.js" />`

* create search space
```
  const space = {
    optimizer: hpjs.choice(['sgd', 'adam', 'adagrad', 'rmsprop']),
    epochs: hpjs.quniform(50, 250, 50),
  };

```
* create tensorflow.js train function. Parameters are optimizer and epochs. input and output data passed as second argument
```
const trainModel = async ({ optimizer, epochs }, { xs, ys }) => {
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({
    loss: 'meanSquaredError',
    optimizer
  });
  // Train the model using the data.
  const h = await model.fit(xs, ys, { epochs });
  return { model, loss: h.history.loss[h.history.loss.length - 1] };
};
```
* create optimization function
```
const modelOpt = async ({ optimizer, epochs }, { xs, ys }) => {
  const { loss } = await trainModel({ optimizer, epochs }, { xs, ys });
  return { loss, status: hpjs.STATUS_OK };
};
```

* find optimal hyperparameters
```
const trials = await hpjs.fmin(
    modelOpt, space, hpjs.search.randomSearch, 10,
    { rng: new hpjs.RandomState(654321), xs, ys }
  );
  const opt = trials.argmin;
  console.log('best optimizer',opt.optimizer);
  console.log('best no of epochs', opt.epochs);
```

### 2. [install with npm](https://github.com/atanasster/hyperparameters/tree/master/examples/react-sample)
* install hyperparameters in your package.json
```
$ npm install hyperparameters 
```

* import hyperparameters
```
import * as tf from '@tensorflow/tfjs';
import * as hpjs from 'hyperparameters';
```

* create search space
```
  const space = {
    optimizer: hpjs.choice(['sgd', 'adam', 'adagrad', 'rmsprop']),
    epochs: hpjs.quniform(50, 250, 50),
  };

```
* create tensorflow.js train function. Parameters are optimizer and epochs. input and output data passed as second argument
```
const trainModel = async ({ optimizer, epochs }, { xs, ys }) => {
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({
    loss: 'meanSquaredError',
    optimizer
  });
  // Train the model using the data.
  const h = await model.fit(xs, ys, { epochs });
  return { model, loss: h.history.loss[h.history.loss.length - 1] };
};
```
* create optimization function
```
const modelOpt = async ({ optimizer, epochs }, { xs, ys }) => {
  const { loss } = await trainModel({ optimizer, epochs }, { xs, ys });
  return { loss, status: hpjs.STATUS_OK };
};
```

* find optimal hyperparameters
```
const trials = await hpjs.fmin(
  modelOpt, space, hpjs.search.randomSearch, 10,
  { rng: new hpjs.RandomState(654321), xs, ys }
);
const opt = trials.argmin;
console.log('best optimizer',opt.optimizer);
console.log('best no of epochs', opt.epochs);
```


## License

MIT © Atanas Stoyanov & Martin Stoyanov
