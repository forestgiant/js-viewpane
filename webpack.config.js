// var webpack = require("webpack");

module.exports = {
    // resolve paths from this directory
    context: __dirname,
    // add sourcemap
    devtool: "eval",
	// main entry file
	entry: ["./lib/index.js"],
    // generated output
	output: {
	    path: "dist",
	    publicPath: "/dist",
	    filename: "viewpane.js",
	    library: "Viewpane"
	},
    // configure modules
    module: {
        // configure loaders
        loaders: [
            {
                test: /(app|lib|test).*\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel"
                // loader: 'babel?optional[]=runtime'
            },
            {
                test: /(app|lib|test).*\.html/,
                loader: "html"
            }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin()
    ],
    // configure the console output
    stats: {
        colors: false,
        modules: true,
        reasons: true
    },
    // Don't show progress
    progress: false,
    // don't report error to grunt if webpack find errors
    failOnError: true,
    // use webpacks watcher
    watch: false,
    // don't finish the grunt task
    keepalive: false,
};
