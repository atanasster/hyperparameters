import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  output: {
    name: 'HyperParameters',
    exports: 'named',
    format: 'umd'
  },
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    // due to https://github.com/rollup/rollup/wiki/Troubleshooting#name-is-not-exported-by-module
    commonjs({
      include: 'node_modules/**',
      namedExports: { './node_module/invariant.js': ['default'] }
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
};

if (env === 'production') {
  config.plugins.push(uglify({
    compress: {
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
      warnings: false
    }
  }));
}

export default config;
