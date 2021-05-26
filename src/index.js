import validateOptions from 'schema-utils';

import schema from './plugin-options.json';

const PLUGIN_NAME = 'css-async-process-webpack-plugin';
const PRE_PLUGIN_NAME = 'mini-css-extract-plugin';
const PRE_PLUGIN_CONSTRUCTOR_NAME = 'MiniCssExtractPlugin';

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

      const isValid = this.validateEnvironment(compiler);
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
              return source.replace(/head.appendChild\(linkTag\)/, 'head.insertBefore(linkTag, document.getElementById("less:theme:color"))');
            }
          }

          return source;
        }
      );
    });
  }

  validateEnvironment(compiler) {
    if (compiler.options.plugins && compiler.options.plugins.length > 0) {
      return !!compiler.options.plugins.find(function (plugin) {
        return plugin.constructor.name === PRE_PLUGIN_CONSTRUCTOR_NAME;
      });
    }
    return false;
  }
}

export default CssAsyncProcessWebpackPlugin;
