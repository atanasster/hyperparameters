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
export const expressionEval = (expr, params) => {
  let { rng } = params;
  if (!rng) {
    rng = new RandomState();
  }
  if (typeof expr.eval !== 'function') {
    if (Array.isArray(expr) && expr.length === 2) {
      return { [expr[0]]: expressionEval(expr[1], params) };
    }
    if (typeof expr === 'object') {
      return Object.keys(expr)
        .reduce((r, key) => ({ ...r, ...expressionEval(expr[key], params) }), {});
    }
    return expr;
  }
  return { [expr.label]: expr.eval(rng) };
};
