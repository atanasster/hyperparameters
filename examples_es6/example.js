/* eslint-disable no-console */
import hp, { fmin } from '../src';
import { suggest } from '../src/rand';
import { sample } from '../src/pyll/stochastic';
import RandomState from '../src/utils/RandomState';


export const printRandomInt = () => {
  const rng = new RandomState(12345);
  for (let i = 0; i < 10; i += 1) {
    console.log(sample(hp.randint('randint', 5), { rng }));
  }
};

export const ChoiceSpace = () => {
  const space = hp.choice(
    'a',
    [
      hp.lognormal('c1', 0, 1),
      hp.uniform('c2', -10, 10)
    ]
  );
  const opt = ({ c1, c2 }) => (c1 !== undefined ? c1 ** 2 : c2 ** 2);
  return fmin(opt, space, suggest, 100);
};

export const DLSpaceFMin = () => {
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

  return fmin(opt, space, suggest, 100, { rng: new RandomState(123456) });
};


export const OptFunctionFMin = () => {
  const opt = x => ((x ** 2) - (x + 1));

  return fmin(opt, hp.uniform('x', -5, 5), suggest, 1000);
};


export const HyperParameterFMin = () => {
  const space = {
    x: hp.uniform('x', -5, 5),
    y: hp.uniform('y', -5, 5)
  };
  const opt = ({ x, y }) => ((x ** 2) + (y ** 2));

  return fmin(opt, space, suggest, 1000);
};


export const MultipleChoicesSpace = () => {
  const space = {
    x: hp.normal('x', 0, 2),
    y: hp.uniform('y', 0, 1),
    choice: hp.choice('choice', [
      undefined, hp.uniform('float', 0, 1),
    ]),
    array: [
      hp.normal('a', 0, 2), hp.uniform('b', 0, 3), hp.choice('c', [false, true]),
    ],
    obj: {
      u: hp.uniform('u', 0, 3),
      v: hp.uniform('v', 0, 3),
      w: hp.uniform('w', -3, 0)
    }
  };

  return sample(space);
};

for (let i = 0; i < 10; i += 1) {
  console.log(MultipleChoicesSpace());
}
