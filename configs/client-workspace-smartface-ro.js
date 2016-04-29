/* global module, require */
// Smartface workspace file
module.exports = function(options) {
    "use strict";
    
    var plugins = require("./client-workspace-smartface")(options);
    
    return plugins;
};
