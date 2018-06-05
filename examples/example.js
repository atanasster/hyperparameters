const hp = require('../lib').default;
const { fmin } = require('../lib');
const { suggest } = require('../lib/rand');
const { sample } = require('../lib/pyll/stochastic');
const RandomState = require('../lib/utils/RandomState');

const choice = hp.choice('choice', ['cat', 'dog']);

// val === one of cat or dog
console.log(choice);

// evaluated - cat or dog
console.log(sample(choice));

// evaluated, with a fixed seed - always dog
console.log(sample(choice, { rng: new RandomState(123456) }));

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

// loss calculation function
const opt = params => params.learning_rate ** 2;

fmin(opt, space, suggest, 100, { rng: new RandomState(123456) })
  .then(result => console.log(result));
