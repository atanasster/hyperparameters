# TensorFlow.js Tiny Example with HyperParameters.js 

This minimal example loads tfjs and hpjs from a CDN, builds and trains a minimal model,
and finds the optimal optimizer and number of epochs.

## Getting started

* include (latest) version from cdn

`<script src="https://cdn.jsdelivr.net/npm/hyperparameters@latest/dist/hyperparameters.min.js" />`

* create search space
```
  const space = {
    optimizer: hpjs.choice(['sgd', 'adam', 'adagrad', 'rmsprop']),
    epochs: hpjs.quniform(50, 250, 50),
  };

```
* create tensorflow.js train function. Parameters are optimizer and epochs. input and output data passed as second argument
```
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
```
* create optimization function
```
const modelOpt = async ({ optimizer, epochs }, { xs, ys }) => {
  const { loss } = await trainModel({ optimizer, epochs }, { xs, ys });
  return { loss, status: hpjs.STATUS_OK };
};
```

* find optimal hyperparameters
```
const trials = await hpjs.fmin(
    modelOpt, space, hpjs.search.randomSearch, 10,
    { rng: new hpjs.RandomState(654321), xs, ys }
  );
const opt = trials.argmin;
console.log('best optimizer',opt.optimizer);
console.log('best no of epochs', opt.epochs);
```
