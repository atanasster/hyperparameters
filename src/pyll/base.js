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
