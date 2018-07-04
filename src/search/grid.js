/* eslint-disable class-methods-use-this */
import RandomState from '../utils/RandomState';
import BaseSpace from '../base/base';

export class GridSearch extends BaseSpace {
  * choice(params) {
    const { options } = params;
    for (let i = 0; i < options.length; i += 1) {
      yield this.eval(options[i]);
    }
  }

  * randint(params) {
    for (let i = 0; i < params.upper; i += 1) {
      yield i;
    }
  }


  * quniform(params) {
    const { low, high, q } = params;
    for (let i = low; i <= high; i += q) {
      yield i;
    }
  }


  * qloguniform(params) {
    const { low, high, q } = params;
    for (let i = low; i <= high; i += q) {
      yield i;
    }
  }

  * qnormal(params) {
    const { mu, sigma, q } = params;
    for (let i = mu - (2 * sigma); i <= mu + (2 * sigma); i += q) {
      yield i;
    }
  }


  * qlognormal(params) {
    const { mu, sigma, q } = params;
    for (let i = mu - (2 * sigma); i <= mu + (2 * sigma); i += q) {
      yield i;
    }
  }

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
  };

  * samples(expr) {
    if (expr === undefined || expr === null) {
      yield expr;
      return;
    }
    const { name } = expr;
    const space = this[name];
    if (space === undefined || space.constructor === null || space.constructor.name !== 'GeneratorFunction') {
      if (Array.isArray(expr)) {
        for (let i = 0; i < expr.length; i += 1) {
          yield* this.samples(expr[i]);
        }
      } else if (typeof expr === 'string') {
        yield expr;
      } else if (typeof expr === 'object') {
        const keys = Object.keys(expr);
        for (let i = 0; i < keys.length; i += 1) {
          yield* this.samples(expr[keys[i]]);
        }
      } else {
        yield expr;
      }
      return;
    }
    yield* space;
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
