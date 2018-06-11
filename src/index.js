import { Choice, Randint, Uniform, QUniform, LogUniform, QLogUniform, Normal, QNormal, LogNormal, QLogNormal } from './base/stochastic';
import fmin from './base/fmin';
import { suggest as randSuggest } from './optimizers/rand';
import RandomState from './utils/RandomState';

export * from './base/stochastic';
export * from './base/base';

export { fmin, RandomState };

export const choice = (label, options) => new Choice(label, { options });
export const randint = (label, upper) => new Randint(label, { upper });
export const uniform = (label, low, high) => new Uniform(label, { low, high });
export const quniform = (label, low, high, q) => new QUniform(label, { low, high, q });
export const loguniform = (label, low, high) => new LogUniform(label, { low, high });
export const qloguniform = (label, low, high, q) => new QLogUniform(label, { low, high, q });
export const normal = (label, mu, sigma) => new Normal(label, { mu, sigma });
export const qnormal = (label, mu, sigma, q) => new QNormal(label, { mu, sigma, q });
export const lognormal = (label, mu, sigma) => new LogNormal(label, { mu, sigma });
export const qlognormal = (label, mu, sigma, q) => new QLogNormal(label, { mu, sigma, q });

export const estimators = {
  rand: {
    suggest: randSuggest,
  }
};
