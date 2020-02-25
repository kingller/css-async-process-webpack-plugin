"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _schemaUtils = _interopRequireDefault(require("schema-utils"));

var _pluginOptions = _interopRequireDefault(require("./plugin-options.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pluginName = 'mini-css-process-webpack-plugin';

class MiniCssProcessPlugin {
  constructor(options = {}) {
    (0, _schemaUtils.default)(_pluginOptions.default, options, 'Mini CSS Process Webpack Plugin');
    this.options = Object.assign({
      process: undefined
    }, options);
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      const {
        mainTemplate
      } = compilation;
      mainTemplate.hooks.requireEnsure.tap(pluginName, (source, chunk, hash) => {
        const {
          process
        } = this.options;

        if (process) {
          if (typeof process === 'function') {
            return process(source, chunk, hash);
          }
        } else {
          if (source) {
            source = source.replace(/head.appendChild\(linkTag\);/, 'head.insertBefore(linkTag, document.getElementById("less:theme:color"));');
            console.log('source', source);
          }
        }

        return source;
      });
    });
  }

}

var _default = MiniCssProcessPlugin;
exports.default = _default;