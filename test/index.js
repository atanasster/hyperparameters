import { assert } from 'chai';
import hp, { random } from '../src';
import RandomState from '../src/utils/RandomState';
import { sample } from '../src/pyll/stochastic';

const seededSample = (space) => sample(space, {rng: new RandomState(12345)});

describe('choice.', () => {
  it('two strings', () => {

    const val = seededSample(hp.choice('choice', ['cat', 'dog']));
    assert.typeOf(val, 'string');
  });
});
describe('randint test.', () => {
  it('should be between 0 and 4', () => {
    const val  = seededSample(hp.randint('randint', 5));
    assert(val >= 0 && val < 5, 'Value not in range :(');
  });
});

describe('uniform test.', () => {
  it('should be between 0 and 1', () => {
    const val  = seededSample(hp.uniform('uniform', 0, 1));
    assert(val >= 0 && val <= 1, 'Value not in range :(');
  });
});

describe('quniform test.', () => {
  it('should be between 0 and 1', () => {
    const val  = seededSample(hp.quniform('quniform', 0, 1, 0.2));
    assert(val >= 0 && val <= 1, 'Value not in range :(');
  });
});

describe('loguniform test.', () => {
  it('should be between 0 and 1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hp.loguniform('loguniform', low, high));
    assert(val >= Math.exp(low) && val <= Math.exp(high), 'Value not in range :(');
  });
});

describe('qloguniform test.', () => {
  it('should be between 0 and 1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hp.qloguniform('qloguniform', low, high, 0.2));
    assert(val >= Math.exp(low) && val <= Math.exp(high), 'Value not in range :(');
  });
});


describe('normal test.', () => {
  it('is a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hp.normal('normal', mu, sigma));
    assert(!isNaN(val), 'Value not in range :(');
  });
});

describe('qnormal test.', () => {
  it('should be between within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hp.qnormal('qnormal', mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), 'Value not in range :(');
  });
});

describe('lognormal test.', () => {
  it('should be positive', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hp.lognormal('lognormal', mu, sigma));
    assert(val >= 0, 'Value not in range :(');
  });
});

describe('qlognormal test.', () => {
  it('should be positive', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hp.qlognormal('qlognormal', mu, sigma, .1));
    assert(val >= 0, 'Value not in range :(');
  });
});
