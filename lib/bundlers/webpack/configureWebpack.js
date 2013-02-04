"use strict"; // run code in ES5 strict mode

var path = require("path");

var pathToWebpackRewire = path.join(__dirname, "webpackRewire.js"),
    pathToPostLoader = path.join(__dirname, "webpackPostLoader.js");

/**
 * Configures webpack so it can be used with rewire. Make sure that the options aren't modified
 * after calling this function. It's important that the rewire()-postLoader is the last loader called on a module.
 *
 * @see https://github.com/webpack/webpack
 *
 * @param {Object} options a webpack option object
 */
function configureWebpack(options) {
    options.module = options.module || {};
    options.module.postLoaders = options.module.postLoaders || [];

    options.resolve = options.resolve || {};
    options.resolve.alias = options.resolve.alias || {};

    options.module.postLoaders.push({
        loader: pathToPostLoader,
        test: /\.js$/,
        exclude: /[\/\\](webpack|rewire[\/\\]lib)[\/\\]/
    });

    // Replaces "rewire/lib/index.js" with "rewire/lib/bundlers/webpack/webpackRewire.js"
    options.resolve.alias.rewire = pathToWebpackRewire;
}

module.exports = configureWebpack;