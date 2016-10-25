module.exports = {
    module: {
    loaders: 
        [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel', // 'babel-loader' is also a valid name to reference
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    entry: './src/entry.js',
    output: { filename: 'out/bundle.js' }
}