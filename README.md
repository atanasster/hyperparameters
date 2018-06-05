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
    import hp from 'hyperparameters';
  ```

### hp.choice(label, options)

- Randomly returns one of the options

###`hp.randint(label, upper)`

- Return a random integer in the range [0, upper)

###`hp.uniform(label, low, high)`

- Returns a single value uniformly between `low` and `high` i.e. any value between `low` and `high` has an equal probability of being selected

###`hp.quniform(label, low, high, q)`

- returns a quantized value of `hp.uniform` calculated as `round(uniform(low, high) / q) * q`

###`hp.loguniform(label, low, high)`

- Returns a value `exp(uniform(low, high))` so the logarithm of the return value is uniformly distributed.

###`hp.qloguniform(label, low, high, q)`

- Returns a value `round(exp(uniform(low, high)) / q) * q`

###`hp.normal(label, mu, sigma)`

- Returns a real number that's normally-distributed with mean mu and standard deviation sigma

###`hp.qnormal(label, mu, sigma, q)`

- Returns a value `round(normal(mu, sigma) / q) * q`

###`hp.lognormal(label, mu, sigma)`

- Returns a value `exp(normal(mu, sigma))`

###`hp.qlognormal(label, mu, sigma, q)`

- Returns a value `round(exp(normal(mu, sigma)) / q) * q`



## Random numbers generator

  ```
    import RandomState from 'hyperparameters/utils/RandomState';
  ```
  
  **example:**
  ```
  const rng = new RandomState(12345);
  console.log(rng.randrange(0, 5, 0.5));

  ```


## Spaces

  ```
    import { sample } from 'hyperparameters/pyll/stochastic';
  ```
  
  **example:**
  ```
  import hp from 'hyperparameters';
  import { sample } from 'hyperparameters/pyll/stochastic';
  
  const space = {
    x: hp.normal('x', 0, 2),
    y: hp.uniform('y', 0, 1),
    choice: hp.choice('choice', [
      undefined, hp.uniform('float', 0, 1),
    ]),
    array: [
      hp.normal('a', 0, 2), hp.uniform('b', 0, 3), hp.choice('c', [false, true]),
    ],
    obj: {
      u: hp.uniform('u', 0, 3),
      v: hp.uniform('v', 0, 3),
      w: hp.uniform('w', -3, 0)
    }
  };

  console.log(sample(space));

  ```
## fmin - find best value of a function over the arguments 

  ```
    import { fmin } from 'hyperparameters';
  ```
  
  **example:**
  ```
  import hp, { fmin } from 'hyperparameters';
  import { suggest } from 'hyperparameters/rand';
  import RandomState from 'hyperparameters/utils/RandomState';

  const fn = x => ((x ** 2) - (x + 1));
  const space = hp.uniform('x', -5, 5);
  console.log(fmin(fn, space, suggest, 1000, { rng: new RandomState(123456) }));
  ```
## License

MIT © Atanas Stoyanov & Martin Stoyanov
