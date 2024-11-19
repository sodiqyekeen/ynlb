const path = require('path');

const workerConfig = {
    entry: './wwwroot/js/translatorWorker.js',
    output: {
        filename: 'bundle.worker.js',
        path: path.resolve(__dirname, 'wwwroot/dist'),
    },
    target: 'webworker',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    resolve: {
        alias: {
            '@huggingface/transformers': path.resolve(__dirname, 'node_modules/@huggingface/transformers'),
        },
    },
};

const mainConfig = {
    entry: './wwwroot/js/translatorService.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'wwwroot/dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            }
        ],
    }
};


module.exports = [workerConfig, mainConfig];