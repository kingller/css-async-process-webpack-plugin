import validateOptions from 'schema-utils';

import schema from './plugin-options.json';

const PLUGIN_NAME = 'css-async-process-webpack-plugin';
const PRE_PLUGIN_NAME = 'mini-css-extract-plugin';

const error = msg => {
  console.error(`\u001b[31mERROR: [${PLUGIN_NAME}] ${msg}\u001b[39m`);
  process.exit(1);
};

class CssAsyncProcessWebpackPlugin {
  constructor(options = {}) {
    validateOptions(schema, options, 'CSS Async Process Webpack Plugin');

    this.options = Object.assign(
      {
        process: undefined,
      },
      options
    );
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {

      const { mainTemplate } = compilation;

      const isValid = this.validateEnvironment(mainTemplate);
      if (!isValid) {
        error(`Error running ${PLUGIN_NAME}, are you sure you have ${PRE_PLUGIN_NAME} before it in your webpack config's plugins?`)
        return;
      }

      mainTemplate.hooks.requireEnsure.tap(
        PLUGIN_NAME,
        (source, chunk, hash) => {

          const { process } = this.options;
          if (process) {
            if(typeof process === 'function') {
              return process(source, chunk, hash);
            }
          } else {
            if (source) {
              return source.replace(/head.appendChild\(linkTag\);/, 'head.insertBefore(linkTag, document.getElementById("less:theme:color"));');
            }
          }

          return source;
        }
      );
    });
  }

  validateEnvironment(mainTemplate) {
    if (mainTemplate.hooks.requireEnsure.taps && mainTemplate.hooks.requireEnsure.taps.length > 0) {
      return !!mainTemplate.hooks.requireEnsure.taps.find(function (tap) {
        return tap.name === PRE_PLUGIN_NAME;
      })
    }
    return false;
  }
}

export default CssAsyncProcessWebpackPlugin;
