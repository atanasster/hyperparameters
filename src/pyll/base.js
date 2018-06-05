import RandomState from '../utils/RandomState';

class NotImplementedError extends Error {}

export default class BaseSymbol {
  constructor(label, params) {
    this.label = label;
    this.params = params;
  }
  // eslint-disable-next-line no-unused-vars
  eval(rng) {
    // Override this method to generate a new value
    throw new NotImplementedError(this.params);
  }
}
export const expressionEval = (expr, { rng: rState }) => {
  let rng = rState;
  if (!rng) {
    rng = new RandomState();
  }
  if (expr === undefined) {
    return expr;
  }
  if (typeof expr.eval !== 'function') {
    if (Array.isArray(expr)) {
      return expr.map(item => expressionEval(item, { rng }));
    }
    if (typeof expr === 'object') {
      return Object.keys(expr)
        .reduce((r, key) => ({ ...r, [key]: expressionEval(expr[key], { rng }) }), {});
    }
    return expr;
  }
  return expr.eval(rng);
};
