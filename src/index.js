import fmin from './base/fmin';
import { suggest as randSuggest } from './optimizers/rand';
import RandomState from './utils/RandomState';

export * from './base/stochastic';
export * from './base/base';

export { fmin, RandomState };

export const choice = options => ({ name: 'choice', options });
export const randint = upper => ({ name: 'randint', upper });
export const uniform = (low, high) => ({ name: 'uniform', low, high });
export const quniform = (low, high, q) => ({
  name: 'quniform', low, high, q
});
export const loguniform = (low, high) => ({ name: 'loguniform', low, high });
export const qloguniform = (low, high, q) => ({
  name: 'qloguniform', low, high, q
});
export const normal = (mu, sigma) => ({ name: 'normal', mu, sigma });
export const qnormal = (mu, sigma, q) => ({
  name: 'qnormal', mu, sigma, q
});
export const lognormal = (mu, sigma) => ({ name: 'lognormal', mu, sigma });
export const qlognormal = (mu, sigma, q) => ({
  name: 'qlognormal', mu, sigma, q
});

export const estimators = {
  rand: {
    suggest: randSuggest,
  }
};
