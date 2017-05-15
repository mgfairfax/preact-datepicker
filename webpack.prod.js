const path = require('path');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let UglifyJsPlugin = require('webpack-uglify-harmony');

module.exports = {
    devtool: 'source-map',
    entry: ['./src/app'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.js'
    },
    resolve: {
        extensions: ['*', '.ts', '.tsx', '.css']
    },
    module: {

        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ],
                exclude: /node_modules/
            },
            {
                // Transform our own .(less|css) files with PostCSS and CSS-modules
                test: /\.(less|css)$/,
                include: [path.resolve(__dirname, 'src/css')],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { modules: true, sourceMap: true, importLoaders: 1, camelCase: true }
                        }
                        // {
                        //     loader: `postcss-loader`,
                        //     options: {
                        //         plugins: () => {
                        //             autoprefixer({ browsers: ['last 2 versions'] });
                        //         }
                        //     }
                        // },
                        // {
                        //     loader: 'less-loader',
                        //     options: { sourceMap: true }
                        // }
                    ]
                })
            },
        ]

    },
    plugins: ([
        new UglifyJsPlugin(),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
            //disable: ENV !== 'production'
        })
    ]
    )

};