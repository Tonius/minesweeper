var webpack = require('webpack');


module.exports = {
    module: {
        loaders: [
            // Apply TypeScript loader to .js files.
            // {
            //     test: /\.tsx?$/,
            //     exclude: /node_modules/,
            //     loader: 'typescript?'
            // }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        })
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8000
    }
};
