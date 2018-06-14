import chai, { assert } from 'chai';
import snapshots from 'chai-snapshot-tests';
import * as hpjs from '../src';

chai.use(snapshots(__filename));

const seededSample = (space) => hpjs.sample(space, { rng: new hpjs.RandomState(12345) });

const floatSeededSample = (space) => hpjs.sample(space, { rng: new hpjs.RandomState(12345) }).toFixed(7);

const objectToFixed = (obj) => Object.keys(obj).reduce((final, key) => {
  const value = typeof obj[key] === 'number' ? obj[key].toFixed(7) : obj[key];
  return { ...final, [key]: value};
}, {});

const randFMinSeeded = async (opt, space) => {
  const trials = await hpjs.fmin(opt, space, hpjs.estimators.rand.suggest, 100, { rng: new hpjs.RandomState(12345) });
  return objectToFixed(trials.argmin);
}


describe('hpjs.choice.', () => {
  it('is a string', () => {
    const val = seededSample(hpjs.choice('choice', ['cat', 'dog']));
    assert.typeOf(val, 'string');
  });
  it('is one of the elements', () => {
    const val = seededSample(hpjs.choice('choice', ['cat', 'dog']));
    assert(['cat', 'dog'].indexOf(val) >= 0, 'val was actually ' + val);
  });
  it('picks a number', () => {
    const val = seededSample(hpjs.choice('numbers', [1, 2, 3, 4]));
    assert(val === 4, 'val was actually: ' + val);
  });
});

describe('hpjs.randint.', () => {
  it('in range [0,5)', () => {
    const val  = seededSample(hpjs.randint('randint', 5));
    assert(val >= 0 && val < 5, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('upper: negative', floatSeededSample(hpjs.randint('randint', -2)));
    assert.snapshot('upper: 0', floatSeededSample(hpjs.randint('randint', 0)));
    assert.snapshot('upper: 1', floatSeededSample(hpjs.randint('randint', 1)));
    assert.snapshot('upper: 1000000', floatSeededSample(hpjs.randint('randint', 1000000)));
  });

});

describe('hpjs.uniform.', () => {
  it('between 0 and 1', () => {
    const val  = seededSample(hpjs.uniform('uniform', 0, 1));
    assert(val >= 0 && val <= 1, `actual value ${val}`);
  });
  it('between -1 and 1', () => {
    const val  = seededSample(hpjs.uniform('uniform', -1, 1));
    assert(val >= -1 && val <= 1, `actual value ${val}`);
  });

  it('Snapshot tests', () => {
    assert.snapshot('uniform -1, 1', floatSeededSample(hpjs.uniform('uniform', -1, 1)));
    assert.snapshot('uniform -100000, -1', floatSeededSample(hpjs.uniform('uniform', -100000, -1)));
    assert.snapshot('uniform -1, -10', floatSeededSample(hpjs.uniform('uniform', -1, -10)));
    assert.snapshot('uniform 5, 1', floatSeededSample(hpjs.uniform('uniform', 5, 1)));
    assert.snapshot('uniform 1, 1000000', floatSeededSample(hpjs.uniform('uniform', 1, 1000000)));
    assert.snapshot('uniform 1, 1', floatSeededSample(hpjs.uniform('uniform', 1, 1)));
  });
});

describe('hpjs.quniform.', () => {
  it('between 0 and 1', () => {
    const val  = seededSample(hpjs.quniform('quniform', 0, 1, 0.2));
    assert(val >= 0 && val <= 1, `actual value ${val}`);
  });
  it('between -1 and 1, step 1', () => {
    const val  = seededSample(hpjs.quniform('quniform', -1, 1, 1));
    assert(val === -1 || val === 0 || val === 1, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('quniform -1, 1, 0.1', floatSeededSample(hpjs.quniform('quniform', -1, 1, 0.1)));
    assert.snapshot('quniform -100000, -1, -1', floatSeededSample(hpjs.quniform('quniform', -100000, -1, -1)));
    assert.snapshot('quniform -1, -10, 0.22222', floatSeededSample(hpjs.quniform('quniform', -1, -10, 0.22222)));
    assert.snapshot('quniform 5, 1, -0.111', floatSeededSample(hpjs.quniform('quniform', 5, 1, -0.111)));
    assert.snapshot('quniform 1, 1000000, 50', floatSeededSample(hpjs.quniform('quniform', 1, 1000000, 50)));
    assert.snapshot('quniform 1, 1, 0.001', floatSeededSample(hpjs.quniform('quniform', 1, 1, 0.001)));
  });
});

describe('hpjs.loguniform.', () => {
  it('between e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hpjs.loguniform('loguniform', low, high));
    assert(val >= Math.exp(low) && val <= Math.exp(high), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('loguniform -1, 1', floatSeededSample(hpjs.loguniform('loguniform', -1, 1)));
    assert.snapshot('loguniform -100000, -1', floatSeededSample(hpjs.loguniform('loguniform', -100000, -1)));
    assert.snapshot('loguniform -1, -10', floatSeededSample(hpjs.loguniform('loguniform', -1, -10)));
    assert.snapshot('loguniform 5, 1', floatSeededSample(hpjs.loguniform('loguniform', 5, 1)));
    assert.snapshot('loguniform 100, 100', floatSeededSample(hpjs.loguniform('loguniform', 100, 100)));
    assert.snapshot('loguniform 1, 1', floatSeededSample(hpjs.loguniform('loguniform', 1, 1)));
  });
});

describe('hpjs.qloguniform.', () => {
  it('e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hpjs.qloguniform('qloguniform', low, high, 0.2));
    assert(val >= Math.exp(low) && val <= Math.exp(high), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qloguniform -1, 1, 0.1', floatSeededSample(hpjs.qloguniform('qloguniform', -1, 1, 0.1)));
    assert.snapshot('qloguniform -100000, -1, -1', floatSeededSample(hpjs.qloguniform('qloguniform', -100000, -1, -1)));
    assert.snapshot('qloguniform -1, -10, 0.2222', floatSeededSample(hpjs.qloguniform('qloguniform', -1, -10, 0.22222)));
    assert.snapshot('qloguniform 5, 1, -0.111', floatSeededSample(hpjs.qloguniform('qloguniform', 5, 1, -0.111)));
    assert.snapshot('qloguniform 100, 50, 50', floatSeededSample(hpjs.qloguniform('qloguniform', 100, 50, 50)));
    assert.snapshot('qloguniform 1, 1, 0.001', floatSeededSample(hpjs.qloguniform('qloguniform', 1, 1, 0.001)));
  });
});

describe('hpjs.normal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hpjs.normal('normal', mu, sigma));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.normal('normal', mu, sigma));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('normal -1, 1', floatSeededSample(hpjs.normal('normal', -1, 1)));
    assert.snapshot('normal -100000, -1', floatSeededSample(hpjs.normal('normal', -100000, -1)));
    assert.snapshot('normal -1, -10', floatSeededSample(hpjs.normal('normal', -1, -10)));
    assert.snapshot('normal 5, 1', floatSeededSample(hpjs.normal('normal', 5, 1)));
    assert.snapshot('normal 100, 100', floatSeededSample(hpjs.normal('normal', 100, 100)));
    assert.snapshot('normal 1, 1', floatSeededSample(hpjs.normal('normal', 1, 1)));
  });
});

describe('hpjs.qnormal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hpjs.normal('normal', mu, sigma));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.qnormal('qnormal', mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qnormal -1, 1, 0.1', floatSeededSample(hpjs.qnormal('qnormal', -1, 1, 0.1)));
    assert.snapshot('qnormal -100000, -1, -1', floatSeededSample(hpjs.qnormal('qnormal', -100000, -1, -1)));
    assert.snapshot('qnormal -1, -10, 0.22222', floatSeededSample(hpjs.qnormal('qnormal', -1, -10, 0.22222)));
    assert.snapshot('qnormal 5, 1, -0.111', floatSeededSample(hpjs.qnormal('qnormal', 5, 1, -0.111)));
    assert.snapshot('qnormal 1, 1000000, 50', floatSeededSample(hpjs.qnormal('qnormal', 1, 1000000, 50)));
    assert.snapshot('qnormal 1, 1, 0.001', floatSeededSample(hpjs.qnormal('qnormal', 1, 1, 0.001)));
  });
});

describe('hpjs.lognormal.', () => {
  it('positive', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.lognormal('lognormal', mu, sigma));
    assert(val >= 0, `actual value ${val}`);
  });
  it('less ~e^3 from the mean, or less than ~3 standard deviations from it', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.lognormal('lognormal', mu, sigma));
    assert(val <= 50, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('lognormal -1, 1', floatSeededSample(hpjs.lognormal('lognormal', -1, 1)));
    assert.snapshot('lognormal -100000, -1', floatSeededSample(hpjs.lognormal('lognormal', -100000, -1)));
    assert.snapshot('lognormal -1, -10', floatSeededSample(hpjs.lognormal('lognormal', -1, -10)));
    assert.snapshot('lognormal 5, 1', floatSeededSample(hpjs.lognormal('lognormal', 5, 1)));
    assert.snapshot('lognormal 100, 100', floatSeededSample(hpjs.lognormal('lognormal', 100, 100)));
    assert.snapshot('lognormal 1, 1', floatSeededSample(hpjs.lognormal('lognormal', 1, 1)));
  });
});

describe('hpjs.qlognormal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hpjs.qlognormal('qlognormal', mu, sigma, 0.2));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.qlognormal('qlognormal', mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qlognormal -1, 1, 0.1', floatSeededSample(hpjs.qlognormal('qlognormal', -1, 1, 0.1)));
    assert.snapshot('qlognormal -100000, -1, -1', floatSeededSample(hpjs.qlognormal('qlognormal', -100000, -1, -1)));
    assert.snapshot('qlognormal -1, -10, 0.22222', floatSeededSample(hpjs.qlognormal('qlognormal', -1, -10, 0.22222)));
    assert.snapshot('qlognormal 5, 1, -0.111', floatSeededSample(hpjs.qlognormal('qlognormal', 5, 1, -0.111)));
    assert.snapshot('qlognormal 100, 100, 50', floatSeededSample(hpjs.qlognormal('qlognormal', 100, 100, 50)));
    assert.snapshot('qlognormal 1, 1, 0.001', floatSeededSample(hpjs.qlognormal('qlognormal', 1, 1, 0.001)));
  });
});

describe('sample', () => {
  it('Choice as array', () => {
    const space = hpjs.choice('a',
      [
        hpjs.lognormal('c1', 0, 1),
        hpjs.uniform('c2', -10, 10)
      ]
    );

    assert.snapshot('sample: array', floatSeededSample(space));
  });
  it('more complex space with depth', () => {
    const space = {
      x: hpjs.normal('x', 0, 2),
      y: hpjs.uniform('y', 0, 1),
      choice: hpjs.choice('choice', [
        null, hpjs.uniform('float', 0, 1),
      ]),
      array: [
        hpjs.normal('a', 0, 2), hpjs.uniform('b', 0, 3), hpjs.choice('c', [false, true]),
      ],
      obj: {
        u: hpjs.uniform('u', 0, 3),
        v: hpjs.uniform('v', 0, 3),
        w: hpjs.uniform('w', -3, 0)
      }
    };
    assert.snapshot('sample: depth', objectToFixed(seededSample(space)));
  });
});
describe('fmin + rand', () => {
  it('FMin for x^2 - x + 1', async () => {
    const space = hpjs.uniform('x', -5, 5);
    const opt = x => ((x ** 2) - (x + 1));
    assert.snapshot('FMin for x^2 - x + 1', await randFMinSeeded(opt, space));
  });
  it('Hyperparameters space', async () => {
    const space = {
      x: hpjs.uniform('x', -5, 5),
      y: hpjs.uniform('y', -5, 5)
    };
    const opt = ({ x, y }) => ((x ** 2) + (y ** 2));
    assert.snapshot('Hyperparameters space', await randFMinSeeded(opt, space));
  });
  it('Choice selection of expressions', async () => {
    const space = hpjs.choice('a',
      [
        hpjs.lognormal('c1', 0, 1),
        hpjs.uniform('c2', -10, 10)
      ]
    );
    const opt = ( x ) => (x ** 2);
    assert.snapshot('choice as array space', await randFMinSeeded(opt, space));
  });
  it('Deep learning space', async () => {
    const space = {
      // Learning rate should be between 0.00001 and 1
      learning_rate:
        hpjs.loguniform('learning_rate', Math.log(1e-5), Math.log(1)),
      use_double_q_learning:
        hpjs.choice('use_double_q_learning', [true, false]),
      layer1_size: hpjs.quniform('layer1_size', 10, 100, 1),
      layer2_size: hpjs.quniform('layer2_size', 10, 100, 1),
      layer3_size: hpjs.quniform('layer3_size', 10, 100, 1),
      future_discount_max: hpjs.uniform('future_discount_max', 0.5, 0.99),
      future_discount_increment:
        hpjs.loguniform('future_discount_increment', Math.log(0.001), Math.log(0.1)),
      recall_memory_size: hpjs.quniform('recall_memory_size', 1, 100, 1),
      recall_memory_num_experiences_per_recall:
        hpjs.quniform('recall_memory_num_experiences_per_recall', 10, 2000, 1),
      num_epochs: hpjs.quniform('num_epochs', 1, 10, 1),
    };

    const opt = params => params.learning_rate ** 2;

    assert.snapshot('Deep learning space', await randFMinSeeded(opt, space));
  });
});

