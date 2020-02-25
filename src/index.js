import validateOptions from 'schema-utils';

import schema from './plugin-options.json';

const pluginName = 'mini-css-process-webpack-plugin';

class MiniCssProcessPlugin {
  constructor(options = {}) {
    validateOptions(schema, options, 'Mini CSS Process Webpack Plugin');

    this.options = Object.assign(
      {
        process: undefined,
      },
      options
    );
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {

      const { mainTemplate } = compilation;

      mainTemplate.hooks.requireEnsure.tap(
        pluginName,
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
}

export default MiniCssProcessPlugin;
