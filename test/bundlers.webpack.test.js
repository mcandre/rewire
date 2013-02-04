var vm = require("vm"),
    fs = require("fs"),
    expect = require("expect.js"),
    webpack = require("webpack"),
    path = require("path"),
    configureWebpack = require("../lib/bundlers/webpack/configureWebpack.js");

/**
 * Executes the source in a context that pretends to be a browser
 * @param {!String} src
 */
function runInFakeBrowserContext(src, filename) {
    var context =  {
        describe: describe,
        it: it,
        before: before,
        after: after,
        beforeEach: beforeEach,
        afterEach: afterEach,
        setTimeout: setTimeout,
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        parseFloat: parseFloat,
        parseInt: parseInt,
        encodeURIComponent: function () {},
        decodeURIComponent: function () {},
        location: {
            origin: "http://localhost",
            pathname: "/"
        },
        document: {},
        console: console,
        testEnv: "webpack"
    };
    context.window = context;
    vm.runInNewContext(src, context, filename);
}

describe("rewire bundled with webpack", function () {
    before(require("./testHelpers/createFakePackageJSON.js"));
    after(require("./testHelpers/removeFakePackageJSON.js"));
    it("should run all sharedTestCases without exception", function (done) {
        var outputDir = path.join(__dirname, "bundlers", "webpack"),
            bundleFile = path.join(outputDir, "bundle.js"),
            webpackOptions,
            src,
            browserBundle;

        webpackOptions = {
            context: path.join(__dirname, "testModules"),
            entry: "./sharedTestCases.js",
            output: {
                path: outputDir
            },
            debug: true
        };
        configureWebpack(webpackOptions);

        try {
            fs.unlinkSync(bundleFile);
        } catch (err) { }

        webpack(webpackOptions, function onWebpackFinished(err, stats) {
            expect(err).to.be(null);
            expect(stats.compilation.errors).to.have.length(0);
            expect(stats.compilation.warnings).to.have.length(0);

            // Read generated source
            src = fs.readFileSync(bundleFile, "utf8");

            // Setup for mocha
            browserBundle = "function enableTests() { " + src + " }";

            // Output for browser-testing
            fs.writeFileSync(bundleFile, browserBundle, "utf8");

            // This should throw no exception.
            runInFakeBrowserContext(src, bundleFile);

            done();
        });
    });
});