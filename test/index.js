import { assert } from 'chai';
import hp, {random} from '../src';

random.seed(123456);

describe('choice.', () => {
  it('is a string', () => {
    const val = hp.choice('choice', ['cat', 'dog']);
    assert.typeOf(val, 'string');
  });
  it('picks a number', () => {
    const val = hp.choice('numbers', [1, 2, 3, 4]);
    assert(val===4, 'val was actually: ' + val);
  });
  it('is one of the elements', () => {
    const val = hp.choice('choice', ['cat', 'dog']);
    assert(val==='cat', 'val was actually ' + val);
  });
});

describe('randint test.', () => {
  it('should be in range [0,5)', () => {
    const val  = hp.randint('randint', 5);
    assert(val >= 0 && val < 5, 'Value not in range :(. val was actually' + val);
  });
});

describe('uniform test.', () => {
  it('should be between 0 and 1', () => {
    const val  = hp.uniform('uniform', 0, 1);
    assert(val >= 0 && val <= 1, 'Value not in range :(. val was actually' + val);
  });
});

describe('quniform test.', () => {
  it('should be between 0 and 1', () => {
    const val  = hp.quniform('quniform', 0, 1, 0.2);
    assert(val >= 0 && val <= 1, 'Value not in range :(. val was actually' + val);
  });
});

describe('loguniform test.', () => {
  it('should be between e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = hp.loguniform('loguniform', low, high);
    assert(val >= Math.exp(low) && val <= Math.exp(high), 'Value not in range :(. val was actually' + val);
  });
});

describe('qloguniform test.', () => {
  it('should be between e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = hp.qloguniform('qloguniform', low, high, 0.2);
    assert(val >= Math.exp(low) && val <= Math.exp(high), 'Value not in range :(. val was actually' + val);
  });
});

describe('normal test.', () => {
  it('is a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.normal('normal', mu, sigma);
    assert(!isNaN(val), 'Value not in range :(. val was actually' + val);
  });
  it('is within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = hp.normal('normal', mu, sigma);
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), 'Value not in range :(. val was actually' + val);
  });
});

describe('qnormal test.', () => {
  it('is a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.normal('normal', mu, sigma);
    assert(!isNaN(val), 'Value not in range :(. val was actually' + val);
  });
  it('is within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = hp.qnormal('qnormal', mu, sigma, 0.1);
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), 'Value not in range :(. val was actually' + val);
  });
});

describe('lognormal test.', () => {
  it('should be positive', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.lognormal('lognormal', mu, sigma);
    assert(val >= 0, 'Value not in range :(. val was actually' + val);
  });
});

describe('qlognormal test.', () => {
  it('should be positive', () => {
    const mu = -1;
    const sigma = 1;
    const val  = hp.qlognormal('qlognormal', mu, sigma, .1);
    assert(val >= 0, 'Value not in range :(. val was actually' + val);
  });
});
