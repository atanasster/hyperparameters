import RandomState from './utils/RandomState';
import { expressionEval } from './pyll/base';

// eslint-disable-next-line import/prefer-default-export
export const suggest = (newIds, domain, trials, seed) => {
  const rng = new RandomState(seed);
  let rval = [];
  newIds.forEach((newId) => {
    const paramsEval = expressionEval(domain.expr, { rng });
    const result = domain.newResult();
    rval = [...rval, ...trials.newTrialDocs([newId], [null], [result], [paramsEval])];
  });
  return rval;
};
