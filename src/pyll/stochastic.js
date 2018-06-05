import BaseSymbol, { expressionEval } from './base';

export class Choice extends BaseSymbol {
  eval(rng) {
    const { options } = this.params;
    const idx = rng.randrange(0, options.length, 1);
    const option = options[idx];
    const arg = expressionEval(option, { rng });
    return arg;
  }
}

export class Randint extends BaseSymbol {
  eval(rng) {
    return rng.randrange(0, this.params.upper, 1);
  }
}

export class Uniform extends BaseSymbol {
  eval(rng) {
    const { low, high } = this.params;
    return rng.uniform(low, high);
  }
}

export class QUniform extends BaseSymbol {
  eval(rng) {
    const { low, high, q } = this.params;
    return Math.round(rng.uniform(low, high) / q) * q;
  }
}

export class LogUniform extends BaseSymbol {
  eval(rng) {
    const { low, high } = this.params;
    return Math.exp(rng.uniform(low, high));
  }
}

export class QLogUniform extends BaseSymbol {
  eval(rng) {
    const { low, high, q } = this.params;
    return Math.round(Math.exp(rng.uniform(low, high)) / q) * q;
  }
}

export class Normal extends BaseSymbol {
  eval(rng) {
    const { mu, sigma } = this.params;
    return rng.gauss(mu, sigma);
  }
}

export class QNormal extends BaseSymbol {
  eval(rng) {
    const { mu, sigma, q } = this.params;
    return Math.round(rng.gauss(mu, sigma) / q) * q;
  }
}

export class LogNormal extends BaseSymbol {
  eval(rng) {
    const { mu, sigma } = this.params;
    return Math.exp(rng.gauss(mu, sigma));
  }
}

export class QLogNormal extends BaseSymbol {
  eval(rng) {
    const { mu, sigma, q } = this.params;
    return Math.round(Math.exp(rng.gauss(mu, sigma)) / q) * q;
  }
}


export const sample = (space, params = {}) => {
  const args = expressionEval(space, params);
  const results = Object.keys(args).map(key => args[key]);
  return results.length === 1 ? results[0] : results;
};

