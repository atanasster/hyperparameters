/* eslint-disable class-methods-use-this */
import BaseSpace from '../base/base';

class GridSearchParam {
  constructor(params, gs) {
    this.params = params;
    this.gs = gs;
  }

  get numSamples() {
    return 1;
  }

  getSample = () => undefined;
  sample = (index) => {
    if (index < 0 || index >= this.numSamples) {
      throw new Error(`invalid sample index "${index}"`);
    }
    return this.getSample(index);
  }
}


class GridSearchNotImplemented extends GridSearchParam {
  get numSamples() {
    throw new Error(`Can not evaluate length of non-discrete parameter "${this.params.name}"`);
  }
  getSample = index => this.params.options[index];
}

class GridSearchChoice extends GridSearchParam {
  get numSamples() {
    return this.params.options.reduce((r, e) => (r + this.gs.numSamples(e)), 0);
  }
  getSample = index => this.params.options[index];
}

class GridSearchRandInt extends GridSearchParam {
  get numSamples() {
    return this.params.upper;
  }
  getSample = index => index;
}

class GridSearchUniform extends GridSearchParam {
  get numSamples() {
    return Math.floor((this.params.high - this.params.low) / this.params.q) + 1;
  }
  getSample = index => this.params.low + (index * this.params.q);
}

class GridSearchNormal extends GridSearchParam {
  get numSamples() {
    return Math.floor((4 * this.params.sigma) / this.params.q) + 1;
  }
  getSample = index => (this.params.mu - (2 * this.params.sigma)) + (index * this.params.q);
}

const GridSearchParamas = {
  choice: GridSearchChoice,
  randint: GridSearchRandInt,
  quniform: GridSearchUniform,
  qloguniform: GridSearchUniform,
  qnormal: GridSearchNormal,
  qlognormal: GridSearchNormal,
  uniform: GridSearchNotImplemented,
  loguniform: GridSearchNotImplemented,
  normal: GridSearchNotImplemented,
  lognormal: GridSearchNotImplemented,
};

export class GridSearch extends BaseSpace {
  numSamples = (expr) => {
    const flat = this.samples(expr);
    return flat.reduce((r, o) => r * o.samples, 1);
  };
  samples = (expr) => {
    if (!expr) {
      return expr;
    }
    const flat = [];
    const { name } = expr;
    const Param = GridSearchParamas[name];
    if (Param === undefined) {
      if (Array.isArray(expr)) {
        expr.forEach(el => flat.push(...this.samples(el)));
      }
      if (typeof expr === 'string') {
        flat.push({ name, samples: 1, expr });
      }
      if (typeof expr === 'object') {
        Object.keys(expr).forEach(key => flat.push(...this.samples(expr[key])));
      }
    } else {
      flat.push({ name, samples: (new Param(expr, this)).numSamples, expr });
    }
    return flat;
  };
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

export const gridSearch = (newIds, domain, trials) => {
  let rval = [];
  const gs = new GridSearch();
  newIds.forEach((newId) => {
    const paramsEval = gs.eval(domain.expr, {rng: undefined});
    const result = domain.newResult();
    rval = [...rval, ...trials.newTrialDocs([newId], [result], [paramsEval])];
  });
  return rval;
};
