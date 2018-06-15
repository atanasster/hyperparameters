import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as tf from '@tensorflow/tfjs';
import * as hpjs from '../../../../src/index';

import withRoot from '../withRoot';
import ValuesRow from '../components/ValuesRow';
import Value from '../components/Value';
import ExperimentsTable from '../components/ExperimentsTable';

const trainModel = async ({ optimizer, epochs, onEpochEnd }, { xs, ys }) => {
  // Create a simple model.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: xs.shape.slice(1) }));
  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({
    loss: 'meanSquaredError',
    optimizer
  });
  // Train the model using the data.
  const h = await model.fit(xs, ys, { epochs, callbacks: { onEpochEnd } });
  return { model, loss: h.history.loss[h.history.loss.length - 1] };
};

// Generate some synthetic data for training. (y = 2x - 1) and pass to fmin as parameters
const createData = () => ({
  xs: tf.tensor2d([-1, 0, 1, 2, 3, 4], [6, 1]),
  ys: tf.tensor2d([-3, -1, 1, 3, 5, 7], [6, 1]),
});

class Home extends React.Component {
  state = {
    experiments: [],
    epoch: undefined,
    experimentBegin: undefined,
    experimentEnd: undefined,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  onEpochEnd = async (epoch, logs) => {
    const { experimentBegin } = this.state;
    this.setState({ epoch: { epoch, logs } });
    await tf.nextFrame();
  };

  onExperimentBegin = async (id, experiment) => {
    this.setState({ experimentBegin: { id, experiment } });
    await tf.nextFrame();
  };
  onExperimentEnd = async (id, experiment) => {
    this.setState({ experimentEnd: { id, experiment }, experiments: [...this.state.experiments, experiment] });
    await tf.nextFrame();
  };

  onRunClick = async () => {
    this.setState({
      epoch: undefined,
      experimentBegin: undefined,
      experimentEnd: undefined,
      experiments: [],
      best: undefined,
    });
    // fmin optmization function, retuns the loss and a STATUS_OK
    async function modelOpt({ optimizer, epochs }, { xs, ys, onEpochEnd }) {
      const { loss } = await trainModel({ optimizer, epochs, onEpochEnd }, { xs, ys });
      return { loss, status: hpjs.STATUS_OK };
    }

    // hyperparameters search space
    // optmizer is a choice field
    // epochs ia an integer value from 10 to 250 with a step of 5
    const space = {
      optimizer: hpjs.choice('optimizer', ['sgd', 'adam', 'adagrad', 'rmsprop']),
      epochs: hpjs.quniform('epochs', 10, 30, 10),
    };
    tf.ENV.engine.startScope();
    // Generate some synthetic data for training. (y = 2x - 1) and pass to fmin as parameters
    // data will be passed as a parameters to the fmin
    const { xs, ys } = createData();
    const experiments = await hpjs.fmin(
      modelOpt, space, hpjs.estimators.rand.suggest, 10,
      { rng: new hpjs.RandomState(654321),
        xs,
        ys,
        onEpochEnd: this.onEpochEnd,
        callbacks: { onExperimentBegin: this.onExperimentBegin, onExperimentEnd: this.onExperimentEnd } }
    );
    this.setState({ best: experiments.argmin });
    tf.ENV.engine.endScope();
  };

  onPredictClick = async () => {
    const { best } = this.state;
    tf.ENV.engine.startScope();
    const { xs, ys } = createData();
    const { model } = await trainModel(best, { xs, ys });
    const prediction = model.predict(tf.tensor2d([20], [1, 1]));
    this.setState({ prediction: prediction.dataSync() });
    tf.ENV.engine.endScope();
  };

  render() {
    const { classes } = this.props;
    const { epoch, experimentBegin, experimentEnd, experiments, best, prediction } = this.state;

    const spacing = 24;
    return (
      <div>
        <Typography variant="display4" color='primary' gutterBottom>
          TensorFlow 'tiny'
        </Typography>
        <Grid container spacing={spacing}>
          {experimentBegin && (
              <ValuesRow classes={classes} title='running'>
                <Value label='#' value={experimentBegin.id} size={2} />
                {Object.keys(experimentBegin.experiment.args).map(key => (
                  <Value key={`begin_${key}`} label={key} value={experimentBegin.experiment.args[key]} size={3} />
                ))}
                {epoch && (
                  <React.Fragment>
                    <Value label='epoch' value={epoch.epoch} size={2} />
                    <Value label='loss' value={epoch.logs.loss.toFixed(5)} size={2} />
                  </React.Fragment>
                )}

              </ValuesRow>
            )}
            {experimentEnd && (
              <ValuesRow classes={classes} title='completed'>
                <Value label='#' value={experimentEnd.id} size={2} />
                {Object.keys(experimentEnd.experiment.args).map(key => (
                  <Value key={`end_${key}`} label={key} value={experimentEnd.experiment.args[key]} size={3} />
                ))}

                <Value label='loss' value={experimentEnd.experiment.result.loss.toFixed(5)} size={4} />
              </ValuesRow>
            )}
            {best && (
              <ValuesRow classes={classes} title='best experiment'>
                {Object.keys(best).map(key => (
                  <Value key={`best_${key}`} label={key} value={best[key]} size={3} />
                ))}
                <Grid item md={3} align='end' >
                  <Button variant="contained" color="secondary" size="large" onClick={this.onPredictClick}>
                    predict
                  </Button>
                </Grid>
                {prediction && (
                  <Value label='prediction' value={prediction[0].toFixed(5)} size={3} />
                )}

              </ValuesRow>
            )}
          <Grid item xs={12}>
            <Button variant="contained" color="secondary" size="large" onClick={this.onRunClick}>
              run
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="display3">
              Experiments
            </Typography>
            <ExperimentsTable classes={classes} experiments={experiments} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(Home);
