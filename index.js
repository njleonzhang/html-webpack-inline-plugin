var inline = require('inline-source')

function HtmlWebpackInlinePlugin(options) {
  // Setup the plugin instance with options...
  this.options = options
}

HtmlWebpackInlinePlugin.prototype.apply = function(compiler) {
  if (compiler.hooks) {
    compiler.hooks.compilation.tap('HtmlWebpackInlinePlugin', compilation => {
      if (!compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
        throw new Error('The expected HtmlWebpackPlugin hook was not found! Ensure HtmlWebpackPlugin is installed and was initialized before this plugin.');
      }

      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        'HtmlWebpackInlinePlugin',
        (htmlPluginData, callback) => {
          var html = htmlPluginData.html
          console.log(html)
          inline(html, this.options, function(err, html) {
            if (!err) {
              htmlPluginData.html = html
              console.log(htmlPluginData.html)
            }
            callback(null, htmlPluginData)
          })
        }
      )
    })
  } else {
    compiler.plugin('compilation', function(compilation, options) {
      compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
        var html = htmlPluginData.html
        inline(html, self.options, function(err, html) {
          if (!err) {
            htmlPluginData.html = html
          }
          callback(null, htmlPluginData)
        })
      })
    })
  }
};

module.exports = HtmlWebpackInlinePlugin
