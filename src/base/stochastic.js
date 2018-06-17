import BaseSpace from './base';

export class RandomSearch extends BaseSpace {
  choice = (params, rng) => {
    const { options } = params;
    const idx = rng.randrange(0, options.length, 1);
    const option = options[idx];
    const arg = this.eval(option, { rng });
    return arg;
  };

  randint = (params, rng) => rng.randrange(0, params.upper, 1)

  uniform = (params, rng) => {
    const { low, high } = params;
    return rng.uniform(low, high);
  };

  quniform = (params, rng) => {
    const { low, high, q } = params;
    return Math.round(rng.uniform(low, high) / q) * q;
  };

  loguniform = (params, rng) => {
    const { low, high } = params;
    return Math.exp(rng.uniform(low, high));
  };

  qloguniform = (params, rng) => {
    const { low, high, q } = params;
    return Math.round(Math.exp(rng.uniform(low, high)) / q) * q;
  };

  normal = (params, rng) => {
    const { mu, sigma } = params;
    return rng.gauss(mu, sigma);
  };

  qnormal = (params, rng) => {
    const { mu, sigma, q } = params;
    return Math.round(rng.gauss(mu, sigma) / q) * q;
  };

  lognormal = (params, rng) => {
    const { mu, sigma } = params;
    return Math.exp(rng.gauss(mu, sigma));
  };

  qlognormal = (params, rng) => {
    const { mu, sigma, q } = params;
    return Math.round(Math.exp(rng.gauss(mu, sigma)) / q) * q;
  };
}

export const sample = (space, params = {}) => {
  const rs = new RandomSearch();
  const args = rs.eval(space, params);
  if (Object.keys(args).length === 1) {
    const results = Object.keys(args).map(key => args[key]);
    return results.length === 1 ? results[0] : results;
  }
  return args;
};

