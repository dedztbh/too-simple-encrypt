const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/too-simple-encrypt/" : "/",
  // uncomment if not visiting localhost
  // devServer: {
  //   https: true
  // }
})
