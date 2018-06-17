import { Choice, Randint, Uniform, QUniform, LogUniform, QLogUniform, Normal, QNormal, LogNormal, QLogNormal } from './base/stochastic';
import fmin from './base/fmin';
import { suggest as randSuggest } from './optimizers/rand';
import RandomState from './utils/RandomState';

export * from './base/stochastic';
export * from './base/base';

export { fmin, RandomState };

export const choice = options => new Choice({ options });
export const randint = upper => new Randint({ upper });
export const uniform = (low, high) => new Uniform({ low, high });
export const quniform = (low, high, q) => new QUniform({ low, high, q });
export const loguniform = (low, high) => new LogUniform({ low, high });
export const qloguniform = (low, high, q) => new QLogUniform({ low, high, q });
export const normal = (mu, sigma) => new Normal({ mu, sigma });
export const qnormal = (mu, sigma, q) => new QNormal({ mu, sigma, q });
export const lognormal = (mu, sigma) => new LogNormal({ mu, sigma });
export const qlognormal = (mu, sigma, q) => new QLogNormal({ mu, sigma, q });

export const estimators = {
  rand: {
    suggest: randSuggest,
  }
};
