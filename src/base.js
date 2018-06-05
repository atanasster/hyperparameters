export const STATUS_NEW = 'new';
export const STATUS_RUNNING = 'running';
export const STATUS_SUSPENDED = 'suspended';
export const STATUS_OK = 'ok';
export const STATUS_FAIL = 'fail';
export const STATUS_STRINGS = [
  'new', // computations have not started
  'running', // computations are in prog
  'suspended', // computations have been suspended, job is not finished
  'ok', // computations are finished, terminated normally
  'fail']; // computations are finished, terminated with error


// -- named constants for job execution pipeline
export const JOB_STATE_NEW = 0;
export const JOB_STATE_RUNNING = 1;
export const JOB_STATE_DONE = 2;
export const JOB_STATE_ERROR = 3;
export const JOB_STATES = [
  JOB_STATE_NEW,
  JOB_STATE_RUNNING,
  JOB_STATE_DONE,
  JOB_STATE_ERROR];


export const TRIAL_KEYS = [
  'tid',
  'result',
  'args',
  'state',
  'book_time',
  'refresh_time',
  'expKey'];

export const range = (start, end) => Array.from({ length: (end - start) }, (v, k) => k + start);

export class Trials {
  constructor(expKey = null, refresh = true) {
    this.ids = [];
    this.dynamicTrials = [];
    this.trials = [];
    this.expKey = expKey;
    if (refresh) {
      this.refresh();
    }
  }

  get length() {
    return this.trials.length;
  }

  refresh = () => {
    if (this.expKey === null) {
      this.trials = this.dynamicTrials
        .filter(trial => trial.state !== JOB_STATE_ERROR);
    } else {
      this.trials = this.dynamicTrials
        .filter(trial => trial.state !== JOB_STATE_ERROR && trial.expKey === this.expKey);
      this.ids = [];
    }
  };

  get tids() {
    return this.trials.map(trial => trial.tid);
  }

  get results() {
    return this.trials.map(trial => trial.result);
  }

  get args() {
    return this.trials.map(trial => trial.args);
  }

  assertValidTrial = (trial) => {
    if (Object.keys(trial).length <= 0) {
      throw new Error('trial should be an object');
    }
    const missingTrialKey = TRIAL_KEYS.find(key => trial[key] === undefined);
    if (missingTrialKey !== undefined) {
      throw new Error(`trial missing key ${missingTrialKey}`);
    }
    if (trial.expKey !== this.expKey) {
      throw new Error(`wrong trial expKey ${trial.expKey}, expected ${this.expKey}`);
    }
    return trial;
  };

  internalIinsertTrialDocs = (docs) => {
    const rval = docs.map(doc => doc.tid);
    this.dynamicTrials = [...this.dynamicTrials, ...docs];
    return rval;
  };

  insertTrialDoc = (trial) => {
    const doc = this.assertValidTrial(trial);
    return this.internalIinsertTrialDocs([doc])[0];
  };

  insertTrialDocs = (trials) => {
    const docs = trials.map(trial => this.assertValidTrial(trial));
    return this.internalIinsertTrialDocs(docs);
  };

  newTrialIds = (N) => {
    const aa = this.ids.length;
    const rval = range(aa, aa + N);
    this.ids = [...this.ids, ...rval];
    return rval;
  };

  newTrialDocs = (tids, specs, results, args) => {
    const rval = [];
    for (let i = 0; i < tids.length; i += 1) {
      const doc = {
        state: JOB_STATE_NEW,
        tid: tids[i],
        spec: specs[i],
        result: results[i],
        args: args[i],
      };
      doc.expKey = this.expKey;
      doc.book_time = null;
      doc.refresh_time = null;
      rval.push(doc);
    }
    return rval;
  };

  deleteAll = () => {
    this.dynamicTrials = [];
    this.refresh();
  };

  countByStateSynced = (arg, trials = null) => {
    const vTrials = trials === null ? this.trials : trials;
    const vArg = Array.isArray(arg) ? arg : [arg];
    const queue = vTrials.filter(doc => vArg.indexOf(doc.state) >= 0);
    return queue.length;
  };

  countByStateUnsynced = (arg) => {
    const expTrials = this.expKey !== null ?
      this.dynamicTrials.map(trial => trial.expKey === this.expKey) : this.dynamicTrials;
    return this.countByStateSynced(arg, expTrials);
  };

  losses = () => this.results.map(r => r.loss);

  statuses = () => this.results.map(r => r.status);

  averageBestError = () => {
    /* const results = this.results.filter(result => result.status === STATUS_OK);
    const loss = results.map(r => r.loss);
    const loss_v = results.map(r => r.loss_variance);
    const true_loss = results.map(r => (r.true_loss === undefined ? r.loss : r.true_loss));

            if (loss_v.every(variance => variance === 0)) {
              return true_loss[argmin(loss)]
            }
            else {
                let cutoff = 0;
                const sigma = Math.sqrt(loss_v[0]);
                while (cutoff < len(loss3) &&loss[cutoff] < loss[0] + 3 * sigma) {
                  cutoff += 1
                }
                const pmin = pmin_sampled(loss3[:cutoff, 0], loss3[:cutoff, 1])
                const avg_true_loss = (pmin * loss3[:cutoff, 2]).sum()
                return avg_true_loss
    */
  };

  get bestTrial() {
    let best = this.trials[0];
    this.trials.forEach((trial) => {
      if (trial.result.status === STATUS_OK && trial.result.loss < best.result.loss) {
        best = trial;
      }
    });
    return best;
  }

  get argmin() {
    const { bestTrial } = this;
    return bestTrial !== undefined ? bestTrial.args : undefined;
  }
}

export class Domain {
  constructor(
    fn, expr,
    {
      name,
    } = {}
  ) {
    this.fn = fn;
    this.expr = expr;
    this.name = name;
  }

  evaluate = (args) => {
    const rval = this.fn(args);
    let result;
    if (!Number.isNaN(rval)) {
      result = { loss: rval, status: STATUS_OK };
    } else {
      if (result === undefined) {
        throw new Error('Optimization function should return a loss value');
      }
      const { status, loss } = result;
      if (STATUS_STRINGS.indexOf(status) < 0) {
        throw new Error(`invalid status ${status}`);
      }
      if (status === STATUS_OK && loss === undefined) {
        throw new Error(`invalid loss ${loss}`);
      }
    }
    return result;
  };
  newResult = () => ({
    status: STATUS_NEW,
  });
}
