const CopyPlugin = require('copy-webpack-plugin')
const { merge } = require('webpack-merge')

const config = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return merge(
        {
          plugins: [
            new CopyPlugin({
              patterns: [{ from: './src/config/config.json', to: 'config/config.json' }]
            })
          ]
        },
        webpackConfig
      )
    }
  }
}
module.exports = config
