import chai, { assert } from 'chai';
import snapshots from 'chai-snapshot-tests';
import hp, { fmin } from '../src';
import RandomState from '../src/utils/RandomState';
import { sample } from '../src/pyll/stochastic';
import { suggest as randSuggest } from '../src/rand';

chai.use(snapshots(__filename));
const seededSample = (space) => sample(space, { rng: new RandomState(12345) });
const randFMinSeeded = (opt, space) => fmin(opt, space, randSuggest, 100, { rng: new RandomState(12345) });


describe('hp.choice.', () => {
  it('is a string', () => {
    const val = seededSample(hp.choice('choice', ['cat', 'dog']));
    assert.typeOf(val, 'string');
  });
  it('is one of the elements', () => {
    const val = seededSample(hp.choice('choice', ['cat', 'dog']));
    assert(['cat', 'dog'].indexOf(val) >= 0, 'val was actually ' + val);
  });
  it('picks a number', () => {
    const val = seededSample(hp.choice('numbers', [1, 2, 3, 4]));
    assert(val===4, 'val was actually: ' + val);
  });
  it('Choice selection of expressions', () => {
    const space = hp.choice('a',
      [
        hp.lognormal('c1', 0, 1),
        hp.uniform('c2', -10, 10)
      ]
    );

    assert.snapshot('choice: array', seededSample(space));
  });
});

describe('hp.randint.', () => {
  it('in range [0,5)', () => {
    const val  = seededSample(hp.randint('randint', 5));
    assert(val >= 0 && val < 5, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('upper: negative', seededSample(hp.randint('randint', -2)));
    assert.snapshot('upper: 0', seededSample(hp.randint('randint', 0)));
    assert.snapshot('upper: 1', seededSample(hp.randint('randint', 1)));
    assert.snapshot('upper: 1000000', seededSample(hp.randint('randint', 1000000)));
  });

});

describe('hp.uniform.', () => {
  it('between 0 and 1', () => {
    const val  = seededSample(hp.uniform('uniform', 0, 1));
    assert(val >= 0 && val <= 1, `actual value ${val}`);
  });
  it('between -1 and 1', () => {
    const val  = seededSample(hp.uniform('uniform', -1, 1));
    assert(val >= -1 && val <= 1, `actual value ${val}`);
  });

  it('Snapshot tests', () => {
    assert.snapshot('uniform -1, 1', seededSample(hp.uniform('uniform', -1, 1)));
    assert.snapshot('uniform -100000, -1', seededSample(hp.uniform('uniform', -100000, -1)));
    assert.snapshot('uniform -1, -10', seededSample(hp.uniform('uniform', -1, -10)));
    assert.snapshot('uniform 5, 1', seededSample(hp.uniform('uniform', 5, 1)));
    assert.snapshot('uniform 1, 1000000', seededSample(hp.uniform('uniform', 1, 1000000)));
    assert.snapshot('uniform 1, 1', seededSample(hp.uniform('uniform', 1, 1)));
  });
});

describe('hp.quniform.', () => {
  it('between 0 and 1', () => {
    const val  = seededSample(hp.quniform('quniform', 0, 1, 0.2));
    assert(val >= 0 && val <= 1, `actual value ${val}`);
  });
  it('between -1 and 1, step 1', () => {
    const val  = seededSample(hp.quniform('quniform', -1, 1, 1));
    assert(val === -1 || val === 0 || val === 1, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('quniform -1, 1, 0.1', seededSample(hp.quniform('quniform', -1, 1, 0.1)));
    assert.snapshot('quniform -100000, -1, -1', seededSample(hp.quniform('quniform', -100000, -1, -1)));
    assert.snapshot('quniform -1, -10, 0.22222', seededSample(hp.quniform('quniform', -1, -10, 0.22222)));
    assert.snapshot('quniform 5, 1, -0.111', seededSample(hp.quniform('quniform', 5, 1, -0.111)));
    assert.snapshot('quniform 1, 1000000, 50', seededSample(hp.quniform('quniform', 1, 1000000, 50)));
    assert.snapshot('quniform 1, 1, 0.001', seededSample(hp.quniform('quniform', 1, 1, 0.001)));
  });
});

describe('hp.loguniform.', () => {
  it('between e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hp.loguniform('loguniform', low, high));
    assert(val >= Math.exp(low) && val <= Math.exp(high), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('loguniform -1, 1', seededSample(hp.loguniform('loguniform', -1, 1)));
    assert.snapshot('loguniform -100000, -1', seededSample(hp.loguniform('loguniform', -100000, -1)));
    assert.snapshot('loguniform -1, -10', seededSample(hp.loguniform('loguniform', -1, -10)));
    assert.snapshot('loguniform 5, 1', seededSample(hp.loguniform('loguniform', 5, 1)));
    assert.snapshot('loguniform 100, 100', seededSample(hp.loguniform('loguniform', 100, 100)));
    assert.snapshot('loguniform 1, 1', seededSample(hp.loguniform('loguniform', 1, 1)));
  });
});

describe('hp.qloguniform.', () => {
  it('e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hp.qloguniform('qloguniform', low, high, 0.2));
    assert(val >= Math.exp(low) && val <= Math.exp(high), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qloguniform -1, 1, 0.1', seededSample(hp.qloguniform('qloguniform', -1, 1, 0.1)));
    assert.snapshot('qloguniform -100000, -1, -1', seededSample(hp.qloguniform('qloguniform', -100000, -1, -1)));
    assert.snapshot('qloguniform -1, -10, 0.2222', seededSample(hp.qloguniform('qloguniform', -1, -10, 0.22222)));
    assert.snapshot('qloguniform 5, 1, -0.111', seededSample(hp.qloguniform('qloguniform', 5, 1, -0.111)));
    assert.snapshot('qloguniform 100, 50, 50', seededSample(hp.qloguniform('qloguniform', 100, 50, 50)));
    assert.snapshot('qloguniform 1, 1, 0.001', seededSample(hp.qloguniform('qloguniform', 1, 1, 0.001)));
  });
});

describe('hp.normal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hp.normal('normal', mu, sigma));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hp.normal('normal', mu, sigma));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('normal -1, 1', seededSample(hp.normal('normal', -1, 1)));
    assert.snapshot('normal -100000, -1', seededSample(hp.normal('normal', -100000, -1)));
    assert.snapshot('normal -1, -10', seededSample(hp.normal('normal', -1, -10)));
    assert.snapshot('normal 5, 1', seededSample(hp.normal('normal', 5, 1)));
    assert.snapshot('normal 100, 100', seededSample(hp.normal('normal', 100, 100)));
    assert.snapshot('normal 1, 1', seededSample(hp.normal('normal', 1, 1)));
  });
});

describe('hp.qnormal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hp.normal('normal', mu, sigma));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hp.qnormal('qnormal', mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qnormal -1, 1, 0.1', seededSample(hp.qnormal('qnormal', -1, 1, 0.1)));
    assert.snapshot('qnormal -100000, -1, -1', seededSample(hp.qnormal('qnormal', -100000, -1, -1)));
    assert.snapshot('qnormal -1, -10, 0.22222', seededSample(hp.qnormal('qnormal', -1, -10, 0.22222)));
    assert.snapshot('qnormal 5, 1, -0.111', seededSample(hp.qnormal('qnormal', 5, 1, -0.111)));
    assert.snapshot('qnormal 1, 1000000, 50', seededSample(hp.qnormal('qnormal', 1, 1000000, 50)));
    assert.snapshot('qnormal 1, 1, 0.001', seededSample(hp.qnormal('qnormal', 1, 1, 0.001)));
  });
});

describe('hp.lognormal.', () => {
  it('positive', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hp.lognormal('lognormal', mu, sigma));
    assert(val >= 0, `actual value ${val}`);
  });
  it('less ~e^3 from the mean, or less than ~3 standard deviations from it', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hp.lognormal('lognormal', mu, sigma));
    assert(val <= 50, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('lognormal -1, 1', seededSample(hp.lognormal('lognormal', -1, 1)));
    assert.snapshot('lognormal -100000, -1', seededSample(hp.lognormal('lognormal', -100000, -1)));
    assert.snapshot('lognormal -1, -10', seededSample(hp.lognormal('lognormal', -1, -10)));
    assert.snapshot('lognormal 5, 1', seededSample(hp.lognormal('lognormal', 5, 1)));
    assert.snapshot('lognormal 100, 100', seededSample(hp.lognormal('lognormal', 100, 100)));
    assert.snapshot('lognormal 1, 1', seededSample(hp.lognormal('lognormal', 1, 1)));
  });
});

describe('hp.qlognormal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hp.qlognormal('qlognormal', mu, sigma, 0.2));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hp.qlognormal('qlognormal', mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qlognormal -1, 1, 0.1', seededSample(hp.qlognormal('qlognormal', -1, 1, 0.1)));
    assert.snapshot('qlognormal -100000, -1, -1', seededSample(hp.qlognormal('qlognormal', -100000, -1, -1)));
    assert.snapshot('qlognormal -1, -10, 0.22222', seededSample(hp.qlognormal('qlognormal', -1, -10, 0.22222)));
    assert.snapshot('qlognormal 5, 1, -0.111', seededSample(hp.qlognormal('qlognormal', 5, 1, -0.111)));
    assert.snapshot('qlognormal 100, 100, 50', seededSample(hp.qlognormal('qlognormal', 100, 100, 50)));
    assert.snapshot('qlognormal 1, 1, 0.001', seededSample(hp.qlognormal('qlognormal', 1, 1, 0.001)));
  });
});

describe('fmin + rand', () => {
  it('FMin for x^2 - x + 1', () => {
    const space = hp.uniform('x', -5, 5);
    const opt = ({ x }) => ((x ** 2) - (x + 1));
    assert.snapshot('FMin for x^2 - x + 1', randFMinSeeded(opt, space));
  });
  it('Hyperparameters space', () => {
    const space = {
      x: hp.uniform('x', -5, 5),
      y: hp.uniform('y', -5, 5)
    };
    const opt = ({ x, y }) => ((x ** 2) + (y ** 2));
    assert.snapshot('Hyperparameters space', randFMinSeeded(opt, space));
  });
  it('Choice selection of expressions', () => {
    const space = hp.choice('a',
      [
        hp.lognormal('c1', 0, 1),
        hp.uniform('c2', -10, 10)
      ]
    );
    const opt = ({ a: { c1, c2 } }) => (c1 !== undefined ? c1 ** 2 : c2 ** 3);
    assert.snapshot('Choice array', randFMinSeeded(opt, space));
  });
  it('Deep learning space', () => {
    const space = {
      // Learning rate should be between 0.00001 and 1
      learning_rate:
        hp.loguniform('learning_rate', Math.log(1e-5), Math.log(1)),
      use_double_q_learning:
        hp.choice('use_double_q_learning', [true, false]),
      layer1_size: hp.quniform('layer1_size', 10, 100, 1),
      layer2_size: hp.quniform('layer2_size', 10, 100, 1),
      layer3_size: hp.quniform('layer3_size', 10, 100, 1),
      future_discount_max: hp.uniform('future_discount_max', 0.5, 0.99),
      future_discount_increment:
        hp.loguniform('future_discount_increment', Math.log(0.001), Math.log(0.1)),
      recall_memory_size: hp.quniform('recall_memory_size', 1, 100, 1),
      recall_memory_num_experiences_per_recall:
        hp.quniform('recall_memory_num_experiences_per_recall', 10, 2000, 1),
      num_epochs: hp.quniform('num_epochs', 1, 10, 1),
    };

    const opt = params => params.learning_rate ** 2;

    assert.snapshot('Deep learning space', randFMinSeeded(opt, space));
  });
});

