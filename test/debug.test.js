var rewire = require("../lib/index.js");

// add breakpoints in testModules/debuggerModule.js and debug this file with your IDE to
// check if debugging works with rewire.
var debuggerModule = rewire("./testModules/debuggerModule.js");

debugger;

debuggerModule.__set__("myNumber", 1);

debuggerModule();