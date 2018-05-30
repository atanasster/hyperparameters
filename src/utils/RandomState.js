/* eslint-disable no-bitwise */
// from: https://gist.github.com/banksean/300494
// https://github.com/jrus/random-js/blob/master/random.coffee

const POW_NEG_26 = 2 ** -26;
const POW_NEG_27 = 2 ** -27;
const POW_32 = 2 ** 32;

export default class RandomState {
  constructor(seed) {
    this.bits = {};
    this.seed = seed === undefined ? new Date().getTime() : seed;
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df; /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

    this.initGen(seed);
  }

  /* initializes mt[N] with a seed */
  initGen(seed) {
    this.mt[0] = seed >>> 0;
    for (this.mti = 1; this.mti < this.N; this.mti += 1) {
      const s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
      this.mt[this.mti] =
        // eslint-disable-next-line no-mixed-operators
        (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
        + this.mti;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.mt[this.mti] >>>= 0;
      /* for >32 bit machines */
    }
    this.next_gauss = null;
  }
  randint() {
    let y;
    const mag01 = [0x0, this.MATRIX_A];
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= this.N) { /* generate N words at one time */
      let kk;

      if (this.mti === this.N + 1) { /* if init_genrand() has not been called, */
        this.init_genrand(5489);
      } /* a default initial seed is used */

      for (kk = 0; kk < this.N - this.M; kk += 1) {
        y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
        this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      for (;kk < this.N - 1; kk += 1) {
        y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
        this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
      }
      y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
      this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

      this.mti = 0;
    }

    y = this.mt[this.mti += 1];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
  }

  random() {
    // Return a random float in the range [0, 1), with a full 53
    // bits of entropy.
    const val = this.randint();
    const lowBits = val >>> 6;
    const highBits = val >>> 5;
    return (highBits + (lowBits * POW_NEG_26)) * POW_NEG_27;
  }

  randbelow(upperBound) {
    const lg = x => (Math.LOG2E * Math.log(x + 1e-10)) >> 0;
    if (upperBound <= 0x100000000) {
      let r;
      const bits = this.bits[upperBound] ||
        (this.bits[upperBound] = (lg(upperBound - 1)) + 1); // memoize values for `bits`
      while (true) {
        r = this.randint() >>> (32 - bits);
        if (r < 0) { r += POW_32; }
        if (r < upperBound) { break; }
      }
      return r;
    }
    return this.randint() % upperBound;
  }
  randrange(start, stop, step) {
    // Return a random integer N in range `[start...stop] by step`
    if (stop === undefined) {
      return this.randbelow(start);
    } else if (!step) {
      return start + this.randbelow(stop - start);
    }
    return start + (step * this.randbelow(Math.floor((stop - start) / step)));
  }
  gauss(mu = 0, sigma = 1) {
    // Gaussian distribution. `mu` is the mean, and `sigma` is the standard
    // deviation. Notes:
    //   * uses the "polar method"
    //   * we generate pairs; keep one in a cache for next time
    let z = this.next_gauss;
    if (z != null) {
      this.next_gauss = null;
    } else {
      let s;
      let u;
      let v;
      while (!s || !(s < 1)) {
        u = (2 * this.random()) - 1;
        v = (2 * this.random()) - 1;
        s = (u * u) + (v * v);
      }
      const w = Math.sqrt((-2 * (Math.log(s))) / s);
      z = u * w; this.next_gauss = v * w;
    }
    return mu + (z * sigma); // Alias for the `gauss` function
  }
  uniform(a, b) {
    // Return a random floating point number N such that a <= N <= b for
    // a <= b and b <= N <= a for b < a.
    return a + (this.random() * (b - a));
  }
}
