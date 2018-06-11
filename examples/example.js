/* eslint-disable no-console */
import * as hpjs from '../src';


export const RandomInt = () => {
  const rng = new hpjs.RandomState(12345);
  return hpjs.sample(hpjs.randint('randint', 5), { rng });
};

export const ChoiceSpace = async () => {
  const space = hpjs.choice(
    'a',
    [
      hpjs.lognormal('c1', 0, 1),
      hpjs.uniform('c2', -10, 10)
    ]
  );
  const opt = (c1, c2) => (c1 !== undefined ? c1 ** 2 : c2 ** 2);
  return hpjs.fmin(opt, space, hpjs.estimators.rand.suggest, 100, { rng: new hpjs.RandomState(123456) });
};

export const DLSpaceFMin = async () => {
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

  return hpjs.fmin(opt, space, hpjs.estimators.rand.suggest, 100, { rng: new hpjs.RandomState(123456) });
};


export const OptFunctionFMin = async () => {
  const opt = x => ((x ** 2) - (x + 1));

  return hpjs.fmin(opt, hpjs.uniform('x', -5, 5), hpjs.estimators.rand.suggest, 1000);
};


export const HyperParameterFMin = async () => {
  const space = {
    x: hpjs.uniform('x', -5, 5),
    y: hpjs.uniform('y', -5, 5)
  };
  const opt = ({ x, y }) => ((x ** 2) + (y ** 2));

  return hpjs.fmin(opt, space, hpjs.estimators.rand.suggest, 1000);
};


export const MultipleChoicesSpace = () => {
  const space = {
    x: hpjs.normal('x', 0, 2),
    y: hpjs.uniform('y', 0, 1),
    choice: hpjs.choice('choice', [
      undefined, hpjs.uniform('float', 0, 1),
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

  return hpjs.sample(space, { rng: new hpjs.RandomState(12345) });
};

/*
export const optimizeStarterSample = () => {
  const modelOpt = async ({ optimizer, epochs }) => {
    // Create a simple model.
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({
      loss: 'meanSquaredError',
      optimizer
    });

    // Generate some synthetic data for training. (y = 2x - 1)
    const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
    const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);
    // Train the model using the data.
    const h = await model.fit(xs, ys, { epochs: epochs + 1 });
    return { loss: h.history.loss[h.history.loss.length - 1], status: STATUS_OK };
  };
  const space = {
    optimizer: hpjs.choice('optimizer', ['sgd', 'adam', 'adagrad', 'rmsprop']),
    epochs: hpjs.randint('epochs', 250),
  };
  return hpjs.fmin(modelOpt, space, hpjs.estimators.rand.suggest, 10, {
   rng: new hpjs.RandomState(12345)
 });
};

optimizeStarterSample()
  .then(result => console.log(result))
  .catch(e => console.error(e));
*/

for (let i = 0; i < 10; i += 1) {
  ChoiceSpace()
    .then(result => console.log(result))
    .catch(e => console.error(e));
}

