import RandomState from '../utils/RandomState';
import { RandomSearch } from '../base/stochastic';

// eslint-disable-next-line import/prefer-default-export
export const suggest = (newIds, domain, trials, seed) => {
  const rng = new RandomState(seed);
  let rval = [];
  const rs = new RandomSearch();
  newIds.forEach((newId) => {
    const paramsEval = rs.eval(domain.expr, { rng });
    const result = domain.newResult();
    rval = [...rval, ...trials.newTrialDocs([newId], [result], [paramsEval])];
  });
  return rval;
};
