"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _pluginOptions = _interopRequireDefault(require("./plugin-options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PLUGIN_NAME = 'css-async-process-webpack-plugin';
const PRE_PLUGIN_NAME = 'mini-css-extract-plugin';
const PRE_PLUGIN_CONSTRUCTOR_NAME = 'MiniCssExtractPlugin';

const error = msg => {
  console.error(`\u001b[31mERROR: [${PLUGIN_NAME}] ${msg}\u001b[39m`);
  process.exit(1);
};

class CssAsyncProcessWebpackPlugin {
  constructor(options = {}) {
    (0, _schemaUtils.default)(_pluginOptions.default, options, 'CSS Async Process Webpack Plugin');
    this.options = Object.assign({
      process: undefined
    }, options);
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, compilation => {
      const {
        mainTemplate
      } = compilation;
      const isValid = this.validateEnvironment(compiler);

      if (!isValid) {
        error(`Error running ${PLUGIN_NAME}, are you sure you have ${PRE_PLUGIN_NAME} before it in your webpack config's plugins?`);
        return;
      }

      mainTemplate.hooks.requireEnsure.tap(PLUGIN_NAME, (source, chunk, hash) => {
        const {
          process
        } = this.options;

        if (process) {
          if (typeof process === 'function') {
            return process(source, chunk, hash);
          }
        } else {
          if (source) {
            return source.replace(/head.appendChild\(linkTag\)/, 'head.insertBefore(linkTag, document.getElementById("less:theme:color"))');
          }
        }

        return source;
      });
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

var _default = CssAsyncProcessWebpackPlugin;
exports.default = _default;