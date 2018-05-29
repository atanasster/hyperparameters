import { assert } from 'chai';
import hp from '../src';

describe('choice.', () => {
  it('two strings', () => {
    const val  = hp.choice('choice', ['cat', 'dog']);
    assert.typeOf(val, 'string');
  });
});
describe('randint test.', () => {
  it('should be between 0 and 4', () => {
    const val  = hp.randint('randint', 5);
    assert(val >= 0 && val < 5, 'Value not in range :(');
  });
});

describe('uniform test.', () => {
  it('should be between 0 and 1', () => {
    const val  = hp.uniform('uniform', 0, 1);
    assert(val >= 0 && val <= 1, 'Value not in range :(');
  });
});

describe('quniform test.', () => {
  it('should be between 0 and 1', () => {
    const val  = hp.quniform('quniform', 0, 1, 0.2);
    assert(val >= 0 && val <= 1, 'Value not in range :(');
  });
});

describe('loguniform test.', () => {
  it('should be between 0 and 1', () => {
    const low = 0;
    const high = 1;
    const val  = hp.loguniform('loguniform', low, high);
    assert(val >= Math.exp(low) && val <= Math.exp(high), 'Value not in range :(');
  });
});

describe('qloguniform test.', () => {
  it('should be between 0 and 1', () => {
    const low = 0;
    const high = 1;
    const val  = hp.qloguniform('qloguniform', low, high, 0.2);
    assert(val >= Math.exp(low) && val <= Math.exp(high), 'Value not in range :(');
  });
});


describe('normal test.', () => {
  it('is a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.normal('normal', mu, sigma);
    assert(!isNaN(val), 'Value not in range :(');
  });
  it('is in a reasonable range', () => {
    const mu = 1;
    const sigma = 0.2;
    const val  = hp.normal('normal', mu, sigma);
    print(val)
    assert(val>=0 && val<=1 , 'Value not in range :(');
  });
});

describe('qnormal test.', () => {
  it('should be between -2 and 2', () => {
    const mu = 0;
    const sigma = 1;
    const val  = hp.qnormal('qnormal', mu, sigma, 0.1);
    assert(val >= mu - sigma && val <= mu + sigma, 'Value not in range :(');
  });
});

describe('lognormal test.', () => {
  it('should be positive', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.lognormal('lognormal', mu, sigma);
    assert(val >= 0, 'Value not in range :(');
  });
});

describe('qlognormal test.', () => {
  it('should be positive', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.qlognormal('qlognormal', mu, sigma, .1);
    assert(val >= 0, 'Value not in range :(');
  });
});
