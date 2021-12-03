import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import nodeGlobals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

const babelOptions = {
  exclude: /node_modules/,
  // We are using @babel/plugin-transform-runtime
  runtimeHelpers: true,
  extensions: ['.js', '.ts', '.tsx'],
  configFile: path.resolve(__dirname, './babel.config.js'),
};
const nodeOptions = {
  extensions: ['.js', '.tsx', '.ts'],
};

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/,
  namedExports: {
    '../../node_modules/prop-types/index.js': ['elementType', 'bool', 'func', 'object', 'oneOfType', 'element'],
    '../../node_modules/react/jsx-runtime.js': ['jsx', 'jsxs'],
    '../../node_modules/react-is/index.js': [
      'ForwardRef',
      'isFragment',
      'isLazy',
      'isMemo',
      'Memo',
      'isValidElementType',
    ],
  },
};

function onwarn(warning) {
  if (
    warning.code === 'UNUSED_EXTERNAL_IMPORT' &&
    warning.source === 'react' &&
    warning.names.filter((identifier) => identifier !== 'useDebugValue').length === 0
  ) {
    // only warn for
    // import * as React from 'react'
    // if (__DEV__) React.useDebugValue()
    // React.useDebug not fully dce'd from prod bundle
    // in the sense that it's still imported but unused. Downgrading
    // it to a warning as a reminder to fix at some point
    console.warn(warning.message);
  } else {
    throw Error(warning.message);
  }
}

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
};

export default {
  input: 'src/index.ts',
  // onwarn,
  output: [
    {
      file: './lib/cjs/index.js',
      format: 'cjs',
      // name: 'datamotto-ui',
      // globals
    },
    {
      file: './lib/esm/index.js',
      format: 'es',
      // name: 'datamotto-ui',
      // globals
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    postcss({
      plugins: [],
    }),
    nodeResolve(nodeOptions),
    babel(babelOptions),
    commonjs(commonjsOptions),
    nodeGlobals(),
    terser(),
  ],
};
