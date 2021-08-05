/* eslint-disable */
const postcssPresetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const postcssPxToViewport = require('postcss-px-to-viewport');
const mixins = require('postcss-mixins');
const atImport = require('postcss-import');
const tailwindcss = require('tailwindcss');
const postcssFunctions = require('postcss-functions');

module.exports = {
  plugins: [
    atImport(),
    mixins(),
    postcssPresetEnv({
      stage: 4,
      features: {
        'nesting-rules': true
      }
      // autoprefixer: {} // auto run
    }),
    cssnano({
      preset: [
        'default',
        {}
      ]
    }),
    postcssFunctions({
      functions: {
          px: function (value) {
            return `${Number.parseFloat(value/375) * 20}rem`
          }
      }
    }),
    tailwindcss,
    postcssPxToViewport({
      unitToConvert: 'px',
      viewportWidth: 375,
    })
  ]
};
