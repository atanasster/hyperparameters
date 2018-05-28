import { Random } from './random';

const random = new Random();

const HyperoptJS = {
  choice: (label, options) => {
    const idx = random.randrange(0, options.length, 1);
    return options[idx];
  },
  // Return random integer in range [a, b], including both end points.
  randint: (label, upper) => random.randrange(0, upper, 1),
  uniform: (label, low, high) => random.uniform(low, high),
  quniform: (label, low, high, q) => Math.round(random.uniform(low, high) / q) * q,
  loguniform: (label, low, high) => Math.exp(random.uniform(low, high)),
  qloguniform: (label, low, high, q) => Math.round(Math.exp(random.uniform(low, high)) / q) * q,
  normal: (label, mu, sigma) => random.normalvariate(mu, sigma),
  qnormal: (label, mu, sigma, q) => Math.round(random.normalvariate(mu, sigma) / q) * q,
  lognormal: (label, mu, sigma) => Math.exp(random.normalvariate(mu, sigma)),
  qlognormal: (label, mu, sigma, q) =>
    Math.round(Math.exp(random.normalvariate(mu, sigma)) / q) * q,
};
export default HyperoptJS;

