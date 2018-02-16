import jsx from 'rollup-plugin-jsx';

export default {
  input: 'dist/lib/index.js',
  output: {
    file: 'dist/lib/index.cjs.js',
    format: 'cjs',
    name: 'ef.carbon.react.native.async.button',
    exports: 'named',
    sourcemap: true
  },
  plugins: [
    jsx({
      factory: 'React.createElement',
      passUnknownTagsToFactory: true,
      arrayChildren: false
    })
  ],
  external: [
    'react',
    'react-native',
    '@ef-carbon/react-render-component'
  ],
  context: 'global'
};
