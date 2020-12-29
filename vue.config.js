/* eslint-disable prettier/prettier */
module.exports = {
    chainWebpack: config => {
        config.resolve.symlinks(false);
        config.module
            .rule('eslint')
            .use('eslint-loader')
            .tap(option => {
                return {
                    ...option,
                    fix: true
                };
            });

    },

    devServer: {
        disableHostCheck: true, //webpack4.0 开启热更新
        // proxy: {
        // "/github/api/*": {
        //     target: "https://api.github.com",
        //     changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        //     // ws: true, // 是否启用websockets
        //     secure: false,
        //     pathRewrite: {}
        // }
        // }
    },

    configureWebpack: {
        externals: { 'AMap': "AMap" }
    }
};
