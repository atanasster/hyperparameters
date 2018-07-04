# TensorFlow.js Tiny Example with HyperParameters.js 

This minimal tfjs example builds and trains a minimal model, showing the trials history and the best optimizer and number of epochs with a react sample application

## Getting started

* install hyperparameters in pavkage.json
```
$ npm install hyperparameters 
```

* import hyperparameters
```
import * as tf from '@tensorflow/tfjs';
import * as hpjs from 'hyperparameters';
```

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

