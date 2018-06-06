import { Choice, Randint, Uniform, QUniform, LogUniform, QLogUniform, Normal, QNormal, LogNormal, QLogNormal } from './base/stochastic';
import fmin from './base/fmin';

export { fmin };

const HyperoptJS = {
  choice: (label, options) => new Choice(label, { options }),
  randint: (label, upper) => new Randint(label, { upper }),
  uniform: (label, low, high) => new Uniform(label, { low, high }),
  quniform: (label, low, high, q) => new QUniform(label, { low, high, q }),
  loguniform: (label, low, high) => new LogUniform(label, { low, high }),
  qloguniform: (label, low, high, q) => new QLogUniform(label, { low, high, q }),
  normal: (label, mu, sigma) => new Normal(label, { mu, sigma }),
  qnormal: (label, mu, sigma, q) => new QNormal(label, { mu, sigma, q }),
  lognormal: (label, mu, sigma) => new LogNormal(label, { mu, sigma }),
  qlognormal: (label, mu, sigma, q) => new QLogNormal(label, { mu, sigma, q }),
};
export default HyperoptJS;

