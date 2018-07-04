import chai, { assert } from 'chai';
import snapshots from 'chai-snapshot-tests';
import * as hpjs from '../src';
import { GridSearch } from '../src/search/grid';

chai.use(snapshots(__filename));

const seededSample = (space) => hpjs.sample.randomSample(space, { rng: new hpjs.RandomState(12345) });

const floatSeededSample = (space) => hpjs.sample.randomSample(space, { rng: new hpjs.RandomState(12345) }).toFixed(7);

const objectToFixed = (obj) => Object.keys(obj).reduce((final, key) => {
  const value = typeof obj[key] === 'number' ? obj[key].toFixed(7) : obj[key];
  return { ...final, [key]: value};
}, {});

const randFMinSeeded = async (opt, space) => {
  const trials = await hpjs.fmin(opt, space, hpjs.search.randomSearch, 100, { rng: new hpjs.RandomState(12345) });
  return objectToFixed(trials.argmin);
}


/*describe('hpjs.choice.', () => {
  it('is a string', () => {
    const val = seededSample(hpjs.choice(['cat', 'dog']));
    assert.typeOf(val, 'string');
  });
  it('is one of the elements', () => {
    const val = seededSample(hpjs.choice(['cat', 'dog']));
    assert(['cat', 'dog'].indexOf(val) >= 0, 'val was actually ' + val);
  });
  it('picks a number', () => {
    const val = seededSample(hpjs.choice([1, 2, 3, 4]));
    assert(val === 4, 'val was actually: ' + val);
  });
});

describe('hpjs.randint.', () => {
  it('in range [0,5)', () => {
    const val  = seededSample(hpjs.randint(5));
    assert(val >= 0 && val < 5, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('upper: negative', floatSeededSample(hpjs.randint(-2)));
    assert.snapshot('upper: 0', floatSeededSample(hpjs.randint(0)));
    assert.snapshot('upper: 1', floatSeededSample(hpjs.randint(1)));
    assert.snapshot('upper: 1000000', floatSeededSample(hpjs.randint(1000000)));
  });

});

describe('hpjs.uniform.', () => {
  it('between 0 and 1', () => {
    const val  = seededSample(hpjs.uniform(0, 1));
    assert(val >= 0 && val <= 1, `actual value ${val}`);
  });
  it('between -1 and 1', () => {
    const val  = seededSample(hpjs.uniform(-1, 1));
    assert(val >= -1 && val <= 1, `actual value ${val}`);
  });

  it('Snapshot tests', () => {
    assert.snapshot('uniform -1, 1', floatSeededSample(hpjs.uniform(-1, 1)));
    assert.snapshot('uniform -100000, -1', floatSeededSample(hpjs.uniform(-100000, -1)));
    assert.snapshot('uniform -1, -10', floatSeededSample(hpjs.uniform(-1, -10)));
    assert.snapshot('uniform 5, 1', floatSeededSample(hpjs.uniform(5, 1)));
    assert.snapshot('uniform 1, 1000000', floatSeededSample(hpjs.uniform(1, 1000000)));
    assert.snapshot('uniform 1, 1', floatSeededSample(hpjs.uniform(1, 1)));
  });
});

describe('hpjs.quniform.', () => {
  it('between 0 and 1', () => {
    const val  = seededSample(hpjs.quniform(0, 1, 0.2));
    assert(val >= 0 && val <= 1, `actual value ${val}`);
  });
  it('between -1 and 1, step 1', () => {
    const val  = seededSample(hpjs.quniform(-1, 1, 1));
    assert(val === -1 || val === 0 || val === 1, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('quniform -1, 1, 0.1', floatSeededSample(hpjs.quniform(-1, 1, 0.1)));
    assert.snapshot('quniform -100000, -1, -1', floatSeededSample(hpjs.quniform(-100000, -1, -1)));
    assert.snapshot('quniform -1, -10, 0.22222', floatSeededSample(hpjs.quniform(-1, -10, 0.22222)));
    assert.snapshot('quniform 5, 1, -0.111', floatSeededSample(hpjs.quniform(5, 1, -0.111)));
    assert.snapshot('quniform 1, 1000000, 50', floatSeededSample(hpjs.quniform(1, 1000000, 50)));
    assert.snapshot('quniform 1, 1, 0.001', floatSeededSample(hpjs.quniform(1, 1, 0.001)));
  });
});

describe('hpjs.loguniform.', () => {
  it('between e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hpjs.loguniform(low, high));
    assert(val >= Math.exp(low) && val <= Math.exp(high), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('loguniform -1, 1', floatSeededSample(hpjs.loguniform(-1, 1)));
    assert.snapshot('loguniform -100000, -1', floatSeededSample(hpjs.loguniform(-100000, -1)));
    assert.snapshot('loguniform -1, -10', floatSeededSample(hpjs.loguniform(-1, -10)));
    assert.snapshot('loguniform 5, 1', floatSeededSample(hpjs.loguniform(5, 1)));
    assert.snapshot('loguniform 5, 1', floatSeededSample(hpjs.loguniform(5, 1)));
    assert.snapshot('loguniform 1, 1', floatSeededSample(hpjs.loguniform(1, 1)));
  });
});

describe('hpjs.qloguniform.', () => {
  it('e^0 and e^1', () => {
    const low = 0;
    const high = 1;
    const val  = seededSample(hpjs.qloguniform(low, high, 0.2));
    assert(val >= Math.exp(low) && val <= Math.exp(high), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qloguniform -1, 1, 0.1', floatSeededSample(hpjs.qloguniform(-1, 1, 0.1)));
    assert.snapshot('qloguniform -100000, -1, -1', floatSeededSample(hpjs.qloguniform(-100000, -1, -1)));
    assert.snapshot('qloguniform -1, -10, 0.2222', floatSeededSample(hpjs.qloguniform(-1, -10, 0.22222)));
    assert.snapshot('qloguniform 5, 1, -0.111', floatSeededSample(hpjs.qloguniform(5, 1, -0.111)));
    assert.snapshot('qloguniform 5, 1, 0.1', floatSeededSample(hpjs.qloguniform(5, 1, 0.1)));
    assert.snapshot('qloguniform 1, 1, 0.001', floatSeededSample(hpjs.qloguniform(1, 1, 0.001)));
  });
});

describe('hpjs.normal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hpjs.normal(mu, sigma));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.normal(mu, sigma));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('normal -1, 1', floatSeededSample(hpjs.normal(-1, 1)));
    assert.snapshot('normal -100000, -1', floatSeededSample(hpjs.normal(-100000, -1)));
    assert.snapshot('normal -1, -10', floatSeededSample(hpjs.normal(-1, -10)));
    assert.snapshot('normal 5, 1', floatSeededSample(hpjs.normal(5, 1)));
    assert.snapshot('normal 5, 1', floatSeededSample(hpjs.normal(5, 1)));
    assert.snapshot('normal 1, 1', floatSeededSample(hpjs.normal(1, 1)));
  });
});

describe('hpjs.qnormal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hpjs.normal(mu, sigma));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.qnormal(mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qnormal -1, 1, 0.1', floatSeededSample(hpjs.qnormal(-1, 1, 0.1)));
    assert.snapshot('qnormal -100000, -1, -1', floatSeededSample(hpjs.qnormal(-100000, -1, -1)));
    assert.snapshot('qnormal -1, -10, 0.22222', floatSeededSample(hpjs.qnormal(-1, -10, 0.22222)));
    assert.snapshot('qnormal 5, 1, -0.111', floatSeededSample(hpjs.qnormal(5, 1, -0.111)));
    assert.snapshot('qnormal 1, 1000000, 50', floatSeededSample(hpjs.qnormal(1, 100, 50)));
    assert.snapshot('qnormal 1, 1, 0.001', floatSeededSample(hpjs.qnormal(1, 1, 0.001)));
  });
});

describe('hpjs.lognormal.', () => {
  it('positive', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.lognormal(mu, sigma));
    assert(val >= 0, `actual value ${val}`);
  });
  it('less ~e^3 from the mean, or less than ~3 standard deviations from it', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.lognormal(mu, sigma));
    assert(val <= 50, `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('lognormal -1, 1', floatSeededSample(hpjs.lognormal(-1, 1)));
    assert.snapshot('lognormal -100000, -1', floatSeededSample(hpjs.lognormal(-100000, -1)));
    assert.snapshot('lognormal -1, -10', floatSeededSample(hpjs.lognormal(-1, -10)));
    assert.snapshot('lognormal 5, 1', floatSeededSample(hpjs.lognormal(5, 1)));
    assert.snapshot('lognormal 5, 1', floatSeededSample(hpjs.lognormal(5, 1)));
    assert.snapshot('lognormal 1, 1', floatSeededSample(hpjs.lognormal(1, 1)));
  });
});

describe('hpjs.qlognormal.', () => {
  it('a number', () => {
    const mu = -1;
    const sigma = 1;
    const val  = seededSample(hpjs.qlognormal(mu, sigma, 0.2));
    assert(!isNaN(val), `actual value ${val}`);
  });
  it('within 3 standard deviations of mean', () => {
    const mu = 0;
    const sigma = 1;
    const val  = seededSample(hpjs.qlognormal(mu, sigma, 0.1));
    assert(val >= mu - (3*sigma) && val <= mu + (3*sigma), `actual value ${val}`);
  });
  it('Snapshot tests', () => {
    assert.snapshot('qlognormal -1, 1, 0.1', floatSeededSample(hpjs.qlognormal(-1, 1, 0.1)));
    assert.snapshot('qlognormal -100000, -1, -1', floatSeededSample(hpjs.qlognormal(-100000, -1, -1)));
    assert.snapshot('qlognormal -1, -10, 0.22222', floatSeededSample(hpjs.qlognormal(-1, -10, 0.22222)));
    assert.snapshot('qlognormal 5, 1, -0.111', floatSeededSample(hpjs.qlognormal(5, 1, -0.111)));
    assert.snapshot('qlognormal 5, 1, 0.1', floatSeededSample(hpjs.qlognormal(5, 1, 0.1)));
    assert.snapshot('qlognormal 1, 1, 0.001', floatSeededSample(hpjs.qlognormal(1, 1, 0.001)));
  });
});

describe('random sample', () => {
  it('Choice as array', () => {
    const space = hpjs.choice(
      [
        hpjs.lognormal(0, 1),
        hpjs.uniform(-10, 10)
      ]
    );

    assert.snapshot('sample: array', floatSeededSample(space));
  });
  it('more complex space with depth', () => {
    const space = {
      x: hpjs.normal(0, 2),
      y: hpjs.uniform(0, 1),
      choice: hpjs.choice([
        null, hpjs.uniform(0, 1),
      ]),
      array: [
        hpjs.normal(0, 2), hpjs.uniform(0, 3), hpjs.choice([false, true]),
      ],
      obj: {
        u: hpjs.uniform(0, 3),
        v: hpjs.uniform(0, 3),
        w: hpjs.uniform(-3, 0)
      }
    };
    assert.snapshot('sample: depth', objectToFixed(seededSample(space)));
  });
});*/
describe('grid search', () => {
  const gs = new GridSearch();
  /*it('choice', () => {
    const space = hpjs.choice(['cat', 'dog']);
    assert(gs.numSamples(space) === 2, `choice num samples ${gs.numSamples(space)}`);
  });
  it('randint', () => {
    const space = hpjs.randint(5);
    assert(gs.numSamples(space) === 5, `randint [0, 5) ${gs.numSamples(space)}`);
  });
  it('quniform', () => {
    let space = hpjs.quniform(0, 1, 0.1);
    assert(gs.numSamples(space) === 11, `quniform 0,1,0.1 ${gs.numSamples(space)}`);
    space = hpjs.quniform(-5, 5, 1);
    assert(gs.numSamples(space) === 11, `quniform -5,5,1 ${gs.numSamples(space)}`);
    space = hpjs.quniform(1, 10, 2);
    assert(gs.numSamples(space) === 5, `quniform 1,10,2 ${gs.numSamples(space)}`);
  });
  it('qloguniform', () => {
    let space = hpjs.qloguniform(0,1,0.1);
    assert(gs.numSamples(space) === 11, `qloguniform 0,1,0.1 ${gs.numSamples(space)}`);
    space = hpjs.qloguniform(-5,5,1);
    assert(gs.numSamples(space) === 11, `qloguniform -5,5,1 ${gs.numSamples(space)}`);
    space = hpjs.qloguniform(1,10,2);
    assert(gs.numSamples(space) === 5, `qloguniform 1,10,2 ${gs.numSamples(space)}`);
  });

  it('qnormal', () => {
    let space = hpjs.qnormal(0, 1, 0.1);
    assert(gs.numSamples(space) === 41, `qnormal 0,1,0.1 ${gs.numSamples(space)}`);
    space = hpjs.qnormal(-5,5,1);
    assert(gs.numSamples(space) === 21, `qnormal -5,5,1 ${gs.numSamples(space)}`);
    space = hpjs.qnormal(1,10,2);
    assert(gs.numSamples(space) === 21, `qnormal 1,10,2 ${gs.numSamples(space)}`);

  });
  it('uniform', () => {
    try {
      gs.numSamples(hpjs.uniform(0, 1));
      assert(false, 'hpjs.uniform not allowed for grid search');
    } catch (e) {
      assert(e.message === 'Can not evaluate length of non-discrete parameter "uniform"', `exception message ${e.message}`);
    }
  });
  it('loguniform', () => {
    try {
      gs.numSamples(hpjs.loguniform(0, 1));
      assert(false, 'hpjs.loguniform not allowed for grid search');
    } catch (e) {
      assert(e.message === 'Can not evaluate length of non-discrete parameter "loguniform"', `exception message ${e.message}`);
    }
  });
  it('normal', () => {
    try {
      gs.numSamples(hpjs.normal(0, 1));
      assert(false, 'hpjs.normal not allowed for grid search');
    } catch (e) {
      assert(e.message === 'Can not evaluate length of non-discrete parameter "normal"', `exception message ${e.message}`);
    }
  });
  it('lognormal', () => {
    try {
      gs.numSamples(hpjs.lognormal(0, 1));
      assert(false, 'hpjs.lognormal not allowed for grid search');
    } catch (e) {
      assert(e.message === 'Can not evaluate length of non-discrete parameter "lognormal"', `exception message ${e.message}`);
    }
  });
  it('choice grid search', () => {
    const space = hpjs.choice(
      [
        hpjs.qlognormal(0, 1, 1), //5
        hpjs.quniform(-10, 10, 1) //21
      ]
    );
    assert(gs.numSamples(space) === 26, `choice  ${gs.numSamples(space)}`);
  });
  it('more complex space with depth', () => {
    const space = {
      choice: hpjs.choice([
        null, hpjs.randint(5),
      ]),
      array: [
        hpjs.qnormal(0, 2, 1), hpjs.quniform(0, 3, 1), hpjs.choice([false, true]),
      ],
      obj: {
        u: hpjs.quniform(0, 3,  0.2),
        v: hpjs.quniform(0, 3,  0.2),
        w: hpjs.quniform(-3, 0,  0.2)
      }
    };
    assert(gs.numSamples(space) === 1769472, `complex  ${gs.numSamples(space)}`);
  });*/
  const space = hpjs.choice(
      [
        hpjs.qlognormal(0, 1, 1), //5
        hpjs.quniform(-10, 10, 1) //21
      ]
    );
    let i = 1;
    for (let sample of gs.samples(space)) {
      console.log(i,sample);
      i += 1;
    }
});

/*describe('fmin + rand', () => {
  it('FMin for x^2 - x + 1', async () => {
    const space = hpjs.uniform(-5, 5);
    const opt = x => ((x ** 2) - (x + 1));
    assert.snapshot('FMin for x^2 - x + 1', await randFMinSeeded(opt, space));
  });
  it('Hyperparameters space', async () => {
    const space = {
      x: hpjs.uniform(-5, 5),
      y: hpjs.uniform(-5, 5)
    };
    const opt = ({ x, y }) => ((x ** 2) + (y ** 2));
    assert.snapshot('Hyperparameters space', await randFMinSeeded(opt, space));
  });
  it('Choice selection of expressions', async () => {
    const space = hpjs.choice([
        hpjs.lognormal(0, 1),
        hpjs.uniform(-10, 10)
      ]
    );
    const opt = ( x ) => (x ** 2);
    assert.snapshot('choice as array space', await randFMinSeeded(opt, space));
  });
  it('Deep learning space', async () => {
    const space = {
      // Learning rate should be between 0.00001 and 1
      learning_rate:
        hpjs.loguniform(Math.log(1e-5), Math.log(1)),
      use_double_q_learning:
        hpjs.choice([true, false]),
      layer1_size: hpjs.quniform(10, 100, 1),
      layer2_size: hpjs.quniform(10, 100, 1),
      layer3_size: hpjs.quniform(10, 100, 1),
      future_discount_max: hpjs.uniform(0.5, 0.99),
      future_discount_increment: hpjs.loguniform(Math.log(0.001), Math.log(0.1)),
      recall_memory_size: hpjs.quniform(1, 100, 1),
      recall_memory_num_experiences_per_recall: hpjs.quniform(10, 2000, 1),
      num_epochs: hpjs.quniform(1, 10, 1),
    };

    const opt = params => params.learning_rate ** 2;

    assert.snapshot('Deep learning space', await randFMinSeeded(opt, space));
  });
});*/

