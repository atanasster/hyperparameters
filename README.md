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
    x: hpjs.normal('x', 0, 2),
    y: hpjs.uniform('y', 0, 1),
    choice: hpjs.choice('choice', [
      undefined, hp.uniform('float', 0, 1),
    ]),
    array: [
      hpjs.normal('a', 0, 2), hpjs.uniform('b', 0, 3), hpjs.choice('c', [false, true]),
    ],
    obj: {
      u: hpjs.uniform('u', 0, 3),
      v: hpjs.uniform('v', 0, 3),
      w: hpjs.uniform('w', -3, 0)
    }
  };

  console.log(hpjs.sample(space));

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
  const space = hpjs.uniform('x', -5, 5);
  fmin(fn, space, hpjs.estimators.rand.suggest, 1000, { rng: new hpjs.RandomState(123456) })
    .then(trials => console.log(result.argmin));
  ```
## License

MIT © Atanas Stoyanov & Martin Stoyanov
