import RandomState from '../utils/RandomState';
import BaseSpace from '../base/base';

export class GridSearch extends BaseSpace {
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
  numSamples = (expr) => {
    if (expr === undefined || expr === null) {
      return 1;
    }
    const { name } = expr;
    const space = this[name];
    if (typeof space !== 'function') {
      if (Array.isArray(expr)) {
        return expr.reduce((r, el) => (r * this.numSamples(el)), 1);
      }
      if (typeof expr === 'string') {
        return 1;
      }
      if (typeof expr === 'object') {
        return Object.keys(expr).reduce((r, key) => (r * this.numSamples(expr[key])), 1);
      }
      return 1;
    }
    switch (name) {
      case 'choice':
        return expr.options.reduce((r, e) => (r + this.numSamples(e)), 0);
      case 'randint':
        return expr.upper;
      case 'quniform':
      case 'qloguniform':
        return Math.floor((expr.high - expr.low) / expr.q) + 1;
      case 'qnormal':
      case 'qlognormal':
        return Math.floor((4 * expr.sigma) / expr.q) + 1;
      default:
        throw new Error(`Can not evaluate length of non-discrete parameter "${name}"`);
    }
  }
}

export const gridSample = (space, params = {}) => {
  const gs = new GridSearch();
  const args = gs.eval(space, params);
  if (Object.keys(args).length === 1) {
    const results = Object.keys(args).map(key => args[key]);
    return results.length === 1 ? results[0] : results;
  }
  return args;
};

export const gridSearch = (newIds, domain, trials, seed) => {
  const rng = new RandomState(seed);
  let rval = [];
  const gs = new GridSearch();
  newIds.forEach((newId) => {
    const paramsEval = gs.eval(domain.expr, { rng });
    const result = domain.newResult();
    rval = [...rval, ...trials.newTrialDocs([newId], [result], [paramsEval])];
  });
  return rval;
};
