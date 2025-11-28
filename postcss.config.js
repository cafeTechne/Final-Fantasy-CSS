module.exports = ({ env }) => {
  const plugins = [
    require('postcss-import'),
    require('autoprefixer')
  ];

  if (env === 'production' || process.env.NODE_ENV === 'production') {
    plugins.push(require('cssnano')({ preset: 'default' }));
  }

  return { plugins };
};
