/* eslint-disable */
/*
 * decaffeinate suggestions:
 * DS001: Remove Babel/TypeScript constructor workaround
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
A fairly direct port of the Python `random` module to JavaScript
*/

const {
  log, sqrt, cos, acos, floor, LOG2E, exp
} = Math;
const POW_32 = 2 ** 32;
const POW_NEG_32 = 2 ** -32;

const lg = x =>
// The log base 2, rounded down to the integer below
  (LOG2E * log(x + 1e-10)) >> 0;
const mod = function (x, y) {
  let jsmod;
  if ((!(jsmod = x % y)) || (!((x > 0) ^ (y > 0)))) { return jsmod; } return jsmod + y;
};

const bind = (fn, obj, ...rest) => function () { return fn.apply(obj, rest); };

class NotImplementedError extends Error {}

var BaseRandom = (function () {
  let POW_NEG_26;
  let POW_NEG_27;
  let _bits;
  let TAU;
  let LOG4;
  let SG_MAGICCONST;
  let E;
  BaseRandom = class BaseRandom {
    static initClass() {
      POW_NEG_26 = 2 ** -26;
      POW_NEG_27 = 2 ** -27;

      _bits = {};

      this.prototype.normalvariate = this.prototype.gauss;

      TAU = 2 * Math.PI;

      LOG4 = log(4);
      SG_MAGICCONST = 1 + log(4.5);
      E = { Math };
    }

    // # Override these first four methods in a custom Random class.

    _randint32() {
      // Override this method to generate a pseudorandom number
      throw new NotImplementedError();
    }

    _getstate() {
      // Override this method to fetch the internal PRNG state. Should
      // return an Array.
      throw new NotImplementedError();
    }

    _setstate(state) {
      // Override this method to set the internal PRNG state from the
      // argument `state`, an Array.
      throw new NotImplementedError();
    }

    _seed(...args) {
      // Override this method to seed the PRNG
      throw new NotImplementedError();
    }

    // # Generally no need to override the methods below in a custom class.
    // # (Under some circumstances it might make sense to implement a custom
    // # version of the `random` method or add to the constructor.)

    constructor() {
      // bind `normalvariate` (def. below as a `gauss` alias) to the instance
      this.seed = this.seed.bind(this);
      this.random = this.random.bind(this);
      this.setstate = this.setstate.bind(this);
      this.getstate = this.getstate.bind(this);
      this.uniform = this.uniform.bind(this);
      this.randrange = this.randrange.bind(this);
      this.randint = this.randint.bind(this);
      this.choice = this.choice.bind(this);
      this.sample = this.sample.bind(this);
      this.shuffle = this.shuffle.bind(this);
      this.gauss = this.gauss.bind(this);
      this.triangular = this.triangular.bind(this);
      this.lognormvariate = this.lognormvariate.bind(this);
      this.expovariate = this.expovariate.bind(this);
      this.vonmisesvariate = this.vonmisesvariate.bind(this);
      this.gammavariate = this.gammavariate.bind(this);
      this.betavariate = this.betavariate.bind(this);
      this.paretovariate = this.paretovariate.bind(this);
      this.weibullvariate = this.weibullvariate.bind(this);
      this.normalvariate = bind(this.normalvariate, this);

      // By default, just seed the PRNG with the date. Some PRNGs
      // can take longer and more complex seeds.
      this._next_gauss = null;
      this.seed(+new Date());
    }

    seed(...args) {
      // Seed the PRNG.
      return this._seed(...Array.from(args || []));
    }
    random() {
      // Return a random float in the range [0, 1), with a full 53
      // bits of entropy.
      const low_bits = this._randint32() >>> 6;
      const high_bits = this._randint32() >>> 5;
      return (high_bits + (low_bits * POW_NEG_26)) * POW_NEG_27;
    }

    setstate(...args) {
      // Set the state of the PRNG. Should accept the output of `@getstate`
      // as its only argument.
      let state;
      [this._next_gauss, ...state] = Array.from(args[0]);
      return this._setstate(state);
    }

    getstate() {
      // Get the internal state of the PRNG. Returns an array of state
      // information suitable for passing into `@setstate`.
      return [this._next_gauss, ...Array.from(this._getstate())];
    }
    _randbelow(n) {
      // Return a random int in the range [0,n).
      // If n > 2^32, then use floating point math
      if (n <= 0x100000000) {
        let r;
        const bits = _bits[n] || (_bits[n] = (lg(n - 1)) + 1); // memoize values for `bits`
        while (true) {
          r = this._randint32() >>> (32 - bits);
          if (r < 0) { r += POW_32; }
          if (r < n) { break; }
        }
        return r;
      }
      return floor(this.random() * n);
    }

    uniform(a, b) {
      // Return a random floating point number N such that a <= N <= b for
      // a <= b and b <= N <= a for b < a.
      return a + (this.random() * (b - a));
    }

    randrange(start, stop, step) {
      // Return a random integer N in range `[start...stop] by step`
      if (stop == null) {
        return this._randbelow(start);
      } else if (!step) {
        return start + this._randbelow(stop - start);
      }
      return start + (step * this._randbelow(floor((stop - start) / step)));
    }

    randint(a, b) {
      // Return a random integer N in range `[a..b]`
      return a + this._randbelow((1 + b) - a);
    }

    choice(seq) {
      // Return a random element from the non-empty sequence `seq`.
      return seq[this._randbelow(seq.length)];
    }

    sample(population, k) {
      // Return a `k` length list of unique elements chosen from the
      // `population` sequence. Used for random sampling without replacement.
      if (k == null) { k = 1; }
      const n = population.length;
      if (k > n) {
        throw new Error("can't take a sample bigger than the population");
      }
      if ((k * 3) > n) { // for large samples, copy the
        const pool = [...Array.from(population)]; // population as a new array
        return (() => {
          const result = [];
          for (let i = n, end = n - k; i > end; i--) {
            const j = this._randbelow(i);
            const val = pool[j];
            pool[j] = pool[i - 1]; // move non-chosen item into vacancy
            result.push(val);
          }
          return result;
        })();
      } // for small samples, treat an Array
      const selected = []; // as a set to keep track of selection
      return (() => {
        const result1 = [];
        for (let i = 0, end1 = k; i < end1; i++) {
          var j;
          while (true) {
            var needle;
            if (((needle = j = this._randbelow(n)), !Array.from(selected).includes(needle))) { break; }
          }
          selected.push(j);
          result1.push(population[j]);
        }
        return result1;
      })();
    }

    shuffle(x) {
      // Shuffle the sequence x in place.
      for (let i = x.length - 1; i >= 1; i--) {
        const j = this._randbelow(i + 1);
        const tmp = x[i]; x[i] = x[j]; x[j] = tmp;
      } // swap x[i], x[j]
      return x;
    }

    gauss(mu, sigma) {
      // Gaussian distribution. `mu` is the mean, and `sigma` is the standard
      // deviation. Notes:
      //   * uses the "polar method"
      //   * we generate pairs; keep one in a cache for next time
      let z;
      if (mu == null) { mu = 0; }
      if (sigma == null) { sigma = 1; }
      if ((z = this._next_gauss) != null) {
        this._next_gauss = null;
      } else {
        let s,
          u,
          v;
        while (!s || !(s < 1)) {
          u = (2 * this.random()) - 1;
          v = (2 * this.random()) - 1;
          s = (u * u) + (v * v);
        }
        const w = sqrt((-2 * (log(s))) / s);
        z = u * w; this._next_gauss = v * w;
      }
      return mu + (z * sigma); // Alias for the `gauss` function
    }

    triangular(low, high, mode) {
      // Triangular distribution. See wikipedia
      let c;
      if (low == null) {
        high = 1; low = 0;
      } else if (high == null) { high = low; low = 0; }
      if (mode == null) {
        c = 0.5;
      } else {
        c = (mode - low) / (high - low);
      }
      const u = this.random();
      if (u <= c) {
        return low + ((high - low) * sqrt(u * c));
      }
      return high - ((high - low) * sqrt((1 - u) * (1 - c)));
    }

    lognormvariate(mu, sigma) {
      // Log normal distribution.
      return exp(this.normalvariate(mu, sigma));
    }

    expovariate(lambda) {
      // Exponential distribution.
      //
      // `lambda` is 1.0 divided by the desired mean.  It should be nonzero.
      // Returned values range from 0 to positive infinity if lambda is positive,
      // and from negative infinity to 0 if lambda is negative.
      //
      // we use 1 - random() instead of random() to preclude the
      // possibility of taking the log of zero.
      return (-log(1 - this.random())) / lambda;
    }
    vonmisesvariate(mu, kappa) {
      // Circular data distribution.
      //
      // mu is the mean angle, expressed in radians between 0 and 2*pi, and
      // kappa is the concentration parameter, which must be greater than or
      // equal to zero.  If kappa is equal to zero, this distribution reduces
      // to a uniform random angle over the range 0 to 2*pi.
      //
      // Based upon an algorithm published in: Fisher, N.I.,
      // "Statistical Analysis of Circular Data", Cambridge
      // University Press, 1993.
      let f;
      const rand = this.random;
      if (kappa <= 1e-6) { return TAU * rand(); }

      const a = 1 + sqrt(1 + (4 * kappa * kappa));
      const b = ((1 - sqrt(2)) * a) / 2 / kappa;
      const r = (1 + (b * b)) / 2 / b;

      while (true) {
        const u1 = rand();

        const z = cos((TAU * u1) / 2);
        f = (1 + (r * z)) / (r + z);
        const c = kappa * (r - f);

        const u2 = rand();
        if ((u2 < (c * (2 - c))) || (u2 <= (c * exp(1 - c)))) { break; }
      }

      const u3 = rand();
      return (mod(mu, TAU)) + (u3 > 0.5 ? acos(f) : -acos(f));
    }
    gammavariate(alpha, beta) {
      // Gamma distribution.  Not the gamma function!
      //
      // Conditions on the parameters are alpha > 0 and beta > 0.
      //
      // The probability distribution function is:
      //
      //             x ** (alpha - 1) * exp( -x / beta)
      //   pdf(x) =  ----------------------------------
      //                gamma(alpha) * beta ** alpha

      // alpha > 0, beta > 0, mean is alpha * beta, variance is alpha * beta**2
      //
      // Warning: a few older sources define the gamma distribution in terms
      // of alpha > -1

      let u1,
        u2,
        x;
      const rand = this.random;
      if (alpha > 1) {
        // Uses R.C.H. Cheng, "The generation of Gamma
        // variables with non-integral shape parameters",
        // Applied Statistics, (1977), 26, No. 1, p71-74
        const ainv = sqrt((2 * alpha) - 1);
        const bbb = alpha - LOG4;
        const ccc = alpha + ainv;
        while (true) {
          u1 = rand();
          if (!(u1 > 1e-7 && u1 < 1 - 1e-7)) { continue; }
          u2 = 1 - rand();
          const v = (log(u1 / (1 - u1))) / ainv;
          x = alpha * exp(v);
          const z = u1 * u1 * u2;
          const r = (bbb + (ccc * v)) - x;
          if ((((r + SG_MAGICCONST) - (4.5 * z)) >= 0.0) || (r >= log(z))) { break; }
        }
        return beta * x;
      } else if (alpha === 1) {
        // expovariate(1)
        let u;
        while (true) {
          u = rand();
          if (u > 1e-7) { break; }
        }
        return -beta * log(u);
      } // alpha is between 0 and 1 (exclusive)
      // Uses ALGORITHM GS of Statistical Computing - Kennedy & Gentle
      while (true) {
        u1 = rand();
        const b = (E + alpha) / E;
        const p = b * u1;
        u2 = rand();
        if (p > 1) {
          x = -log((b - p) / alpha);
          if (u2 <= x ** (alpha - 1)) { break; }
        } else {
          x = p ** (1 / alpha);
          if (u2 <= exp(-x)) { break; }
        }
      }
      return beta * x;
    }

    betavariate(alpha, beta) {
      // Beta distribution.
      //
      // Conditions on the parameters are alpha > 0 and beta > 0.
      // Returned values range between 0 and 1.

      // This version due to Janne Sinkkonen, and matches all the std
      // texts (e.g., Knuth Vol 2 Ed 3 pg 134 "the beta distribution").
      const y = this.gammavariate(alpha, 1);
      if (y === 0) {
        return 0;
      } return y / (y + this.gammavariate(beta, 1));
    }

    paretovariate(alpha) {
      // Pareto distribution.  alpha is the shape parameter.
      const u = 1 - this.random();
      return 1 / (u ** (1 / alpha)); // Jain, pg. 495
    }

    weibullvariate(alpha, beta) {
      // Weibull distribution.
      //
      // alpha is the scale parameter and beta is the shape parameter.
      const u = 1 - this.random();
      return alpha * (-log(u, 1 / beta));
    }
  };
  BaseRandom.initClass();
  return BaseRandom; // Jain, pg. 499; bug fix by Bill Arms
}());


class Random extends BaseRandom {
  // Use a Multiply With Carry PRNG, with an XOR-shift successor
  // Both from Numerical Recipes, 3rd Edition [H1, G1]
  _randint32() {
    this.x = (62904 * (this.x & 0xffff)) + (this.x >>> 16);
    this.y = (41874 * (this.y & 0xffff)) + (this.y >>> 16);
    let z = (this.x << 16) + this.y;
    z ^= z >>> 13; z ^= z << 17; z ^= z >>> 5;
    return z;
  }

  _seed(j) {
    // these two numbers were arbitrarily chosen
    this.x = 3395989511 ^ j;
    return this.y = 1716319410 ^ j;
  }

  _getstate() { return [this.x, this.y]; }
  _setstate(...args) {
    [this.x, this.y] = Array.from(args[0]);
  }
}


class HighQualityRandom extends BaseRandom {
  // From Numerical Recipes, 3rd Edition

  _randint32() {
    let x = (this.u = (this.u * 2891336453) + 1640531513);
    let { v } = this; v ^= v >>> 13; v ^= v << 17; v ^= v >>> 5; this.v = v;
    let y = (this.w1 = (33378 * (this.w1 & 0xffff)) + (this.w1 >>> 16));
    this.w2 = (57225 * (this.w2 & 0xffff)) + (this.w2 >>> 16);

    x ^= x << 9; x ^= x >>> 17; x ^= x << 6;
    y ^= y << 17; y ^= y >>> 15; y ^= y << 5;
    return (x + v) ^ (y + this.w2);
  }

  _seed(j) {
    this.w1 = 521288629;
    this.w2 = 362436069;
    return this.v = (this.u = j ^ 2244614371);
  }

  _getstate() { return [this.u, this.v, this.w1, this.w2]; }
  _setstate(...args) {
    [this.u, this.v, this.w1, this.w2] = Array.from(args[0]);
  }
}


var BuiltinRandom = (function () {
  let _rand;
  let _lowbits;
  BuiltinRandom = class BuiltinRandom extends BaseRandom {
    constructor(...args) {
      {
        // Hack: trick Babel/TypeScript into allowing this before super.
        if (false) { super(); }
        const thisFn = (() => this).toString();
        const thisName = thisFn.slice(thisFn.indexOf('return') + 6 + 1, thisFn.indexOf(';')).trim();
        eval(`${thisName} = this;`);
      }
      this._seed = this._seed.bind(this);
      super(...args);
    }

    static initClass() { // ignore seed
      // Test to see if our JavaScript engine creates random numbers
      // with more than 32 bits of entropy. If so, just use it directly.
      // Otherwise, combine two calls to `random` into each invocation.
      _rand = Math.random;
      _lowbits = () => (_rand() * (2 ** 64)) | 0; // `| 0` will chop out bits > 32
      if (_lowbits() | _lowbits() | _lowbits()) { // ~1e-18 chance of false negative
        ({ random: _rand });
      } else {
        ({
          random() {
            return (_rand() * POW_NEG_32) + _rand();
          }
        });
      }
    }
    // Use the built-in PRNG. Note that with the built-in
    // PRNG, which is implementation dependant, there is no
    // way to set the seed or save/restore state.

    _seed(j) {}

    _randint32() {
      return (_rand() * POW_32) | 0;
    }
  };
  BuiltinRandom.initClass();
  return BuiltinRandom;
}());


export {
  NotImplementedError,
  BaseRandom,
  Random,
  HighQualityRandom,
  BuiltinRandom
};
