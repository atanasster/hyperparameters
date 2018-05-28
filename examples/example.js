/* eslint-disable no-console */
const hp = require('../lib').default;

const val = hp.choice('choice', ['cat', 'dog']);

// val === one of cat or dog
console.log(val);
