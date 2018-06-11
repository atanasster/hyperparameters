/* eslint-disable no-undef */

// Starting with the tensorflow.js Tiny example, this sampple illustrates how little code is
// necessary to build / train / optimize / predict from a model
// in TensorFlow.js + Hyperparameters.js

// function to fit a model, given an optimizer and number of epochs
// returns the model and the final loss
const trainModel = async ({ optimizer, epochs }, { xs, ys }) => {
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({
    loss: 'meanSquaredError',
    optimizer
  });
  // Train the model using the data.
  const h = await model.fit(xs, ys, { epochs });
  return { model, loss: h.history.loss[h.history.loss.length - 1] };
};

// fmin optmization function, retuns the loss and a STATUS_OK
const modelOpt = async ({ optimizer, epochs }, { xs, ys }) => {
  const { loss } = await trainModel({ optimizer, epochs }, { xs, ys });
  return { loss, status: hpjs.STATUS_OK };
};

async function launchHPJS() {
  // hyperparameters search space
  // optmizer is a choice field
  // epochs ia an integer value from 10 to 250 with a step of 5
  const space = {
    optimizer: hpjs.choice('optimizer', ['sgd', 'adam', 'adagrad', 'rmsprop']),
    epochs: hpjs.quniform('epochs', 50, 250, 50),
  };
  // Generate some synthetic data for training. (y = 2x - 1) and pass to fmin as parameters
  // data will be passed as a parameters to the fmin
  const xs = tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]);
  const ys = tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]);

  const trials = await hpjs.fmin(
    modelOpt, space, hpjs.estimators.rand.suggest, 10,
    { rng: new hpjs.RandomState(654321), xs, ys }
  );
  const opt = trials.argmin;
  document.getElementById('optimizer_best').innerText = opt.optimizer;
  document.getElementById('epochs').innerText = opt.epochs;
  const { model } = await trainModel(opt, { xs, ys });
  const prediction = model.predict(tf.tensor2d([20], [1, 1]));
  document.getElementById('prediction').innerText += prediction.dataSync();
}

launchHPJS();
