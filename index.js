const { inlineSource } = require('inline-source');
const htmlWebpackPlugin = require('html-webpack-plugin');

class HtmlWebpackInlinePlugin {
  constructor(options) {
    // Setup the plugin instance with options...
    this.options = options
  }

  apply(compiler) {
    let self = this

    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap('HtmlWebpackInlinePlugin', compilation => {
        const afterTemplateExecutionHook = htmlWebpackPlugin.getHooks(
          compilation
        ).afterTemplateExecution

        if (!afterTemplateExecutionHook) {
          throw new Error(
            'The expected HtmlWebpackPlugin hook was not found! Ensure HtmlWebpackPlugin is installed and was initialized before this plugin.'
          );
        }

        afterTemplateExecutionHook.tapPromise(
          'HtmlWebpackInlinePlugin',
          async htmlPluginData => {
            htmlPluginData.html = await inlineSource(
              htmlPluginData.html,
              self.options
            )

            return Promise.resolve()
          }
        )
      })
    } else {
      compiler.plugin('compilation', compilation => {
        compilation.plugin(
          'html-webpack-plugin-before-html-processing',
          async (htmlPluginData, callback) => {
            htmlPluginData.html = await inlineSource(
              htmlPluginData.html,
              self.options
            )
            callback(null, htmlPluginData)
          }
        )
      })
    }
  }
}

module.exports = HtmlWebpackInlinePlugin
