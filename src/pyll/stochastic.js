import BaseSymbol from './base';
import RandomState from '../utils/RandomState';

export class Choice extends BaseSymbol {
  eval(rng) {
    const { options } = this.params;
    const idx = rng.randrange(0, options.length, 1);
    const option = options[idx];
    if (!Array.isArray(option)) {
      return option;
    }
    if (option.length !== 2) {
      throw new Error('Array of choice options must consist of label and value');
    }
    const value = option[1];
    return typeof value.eval === 'function' ? value.eval(rng) : value;
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
  let { rng } = params;
  if (!rng) {
    rng = new RandomState();
  }
  return space.eval(rng);
};

