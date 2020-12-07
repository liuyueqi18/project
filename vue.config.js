/* eslint-disable prettier/prettier */
module.exports = {
    chainWebpack: config => {
        config.module
            .rule('eslint')
            .use('eslint-loader')
            .loader('eslint-loader')
            .tap(options => {
                options.fix = true
                return options
            })
    },
    devServer: {
        proxy: {
            "/services/DLMAppService/requestHandling/*": {
                target: "https://map.dev.lyq168.com",
                changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
                // ws: true, // 是否启用websockets
                secure: false,
                pathRewrite: {}
            }
        }
    }
};