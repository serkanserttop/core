/* global module, require */
// Smartface workspace file
module.exports = function(options) {
    "use strict";
    
    //make changes in options before creating config variable
    options.dashboardUrl = "https://cloud.smartface.io/";
    options.accountUrl = "https://cloud.smartface.io/Account";
    
    var config;
    try {
        config = options.readonly
            ? require("configs/client-default-ro")
            : require("configs/client-default-hosted");
    } catch(e) {
        console.log(e);
        config = require("configs/client-default");
    }
    config = config(options);
    
    var loadingHTML = getLoadingHTML(options);
    
    var staticPrefix = options.staticPrefix;
    var workspaceDir = options.workspaceDir;
    var hosted = !options.local && !options.dev;
    
    var includes = [{
            packagePath: "plugins/c9.ide.editors/tabmanager",
            loadFilesAtInit: false,
            ideProviderName: "Smartface"
        }, {
            packagePath: "plugins/c9.ide.language.javascript.tern/tern",
            plugins: [
                {
                    name: "doc_comment",
                    path: "tern/plugin/doc_comment",
                    enabled: true,
                    hidden: true,
                },
                {
                    name: "smartface",
                    path: "plugins/@smartface/smartface.language/loadInclude",
                    enabled: true,
                    hidden: true,
                },
            ],
            defs: [{
                name: "ecma5",
                enabled: true,
                path: "lib/tern/defs/ecma5.json"
            }, {
                name: "Smartface",
                enabled: true,
                path: "plugins/@smartface/smartface.language/SMF.json"
            }]
        }, {
            packagePath: "plugins/c9.ide.terminal/terminal",
            tmux: options.tmux,
            root: workspaceDir,
            tmpdir: options.tmpdir,
            shell: options.shell || "",
            staticPrefix: staticPrefix + "/plugins/c9.ide.terminal",
            installPath: options.correctedInstallPath,
            defaults: {
                "dark": ["#111111", "#FFFFFF", "#FF0000", true],
                "dark-gray": ["#000000", "#FFFFFF", "#FF0000", true]
            }
        },
        {
            packagePath: "plugins/c9.core/settings",
            settings: options.settings,
            userConfigPath: options.settingDir,
            hosted: hosted,
            html: loadingHTML
        },

        "plugins/c9.ide.analytics/mock_analytics",

        // end of original C9 plugin configuration
        "plugins/@smartface/smartface.language/tern", 
        {
            packagePath: "plugins/@smartface/smartface.ide.theme/theme",
            staticPrefix: staticPrefix + "/plugins/@smartface/smartface.ide.theme"
        },  {
            packagePath: "plugins/@smartface/smartface.about/about",
            staticPrefix: staticPrefix + "/plugins/@smartface/smartface.about"
        }, {
            packagePath: "plugins/@smartface/smartface.welcome/welcome",
            staticPrefix: staticPrefix + "/plugins/@smartface/smartface.welcome"
        },
    ];
    if (!options.readonly) {
        includes.push({
            packagePath: "plugins/@smartface/smartface.emulator/main",
            staticPrefix: staticPrefix + "/plugins/@smartface/smartface.emulator",
            workspaceDir: workspaceDir
        }, {
            packagePath: "plugins/@smartface/smartface.newfile/newfile"
        }, {
            packagePath: "plugins/@smartface/smartface.updater/smf.updater",
            staticPrefix: staticPrefix + "/plugins/@smartface/smartface.updater"
        },
        "plugins/@smartface/smartface.publish.wizard/smf.utils", {
            packagePath: "plugins/@smartface/smartface.publish.wizard/smf.publish.wizard",
            staticPrefix: staticPrefix + "/plugins/@smartface/smartface.publish.wizard"
        }, {
            packagePath: "plugins/c9.ide.closeconfirmation/closeconfirmation",
            defaultValue: options.local,
            ideProviderName: "Smartface"
        }, {
            packagePath: "plugins/@smartface/smartface.jquery/main"
            // staticPrefix: staticPrefix + "/plugins/@smartface/smartface.jquery"
        });
    }
    
    var excludes = {
        "plugins/c9.ide.hackhands/hackhands": true,
        "plugins/c9.ide.hackhands/hackhands_analytics": true,
        "plugins/c9.ide.run/run": true,
        "plugins/c9.ide.run/gui": true,
        "plugins/c9.ide.run.build/build": true,
        "plugins/c9.ide.run/run_analytics": true,
        "plugins/c9.ide.run.debug/debuggers/debugger": true,
        "plugins/c9.ide.run.debug/debuggers/sourcemap": true,
        "plugins/c9.ide.run.debug/debuggers/v8/v8debugger": true,
        "plugins/c9.ide.run.debug/debuggers/gdb/gdbdebugger": true,
        "plugins/c9.ide.immediate/evaluators/debugnode": true,
        "plugins/c9.ide.run.debug.xdebug/xdebug": true,
        "plugins/c9.ide.run.debug/liveinspect": true,
        "plugins/c9.ide.run.debug/breakpoints": true,
        "plugins/c9.ide.run.debug/debugpanel": true,
        "plugins/c9.ide.run.debug/callstack": true,
        "plugins/c9.ide.run.debug/variables": true,
        "plugins/c9.ide.run.debug/watches": true,
        "plugins/c9.ide.run/output": true,
        "plugins/c9.ide.deploy.mongolab/mongolab": true,
        "plugins/c9.ide.deploy.heroku/heroku": true,
        "plugins/c9.ide.deploy.heroku/libheroku": true,
        "plugins/c9.ide.deploy.openshift/openshift": true,
        "plugins/c9.ide.deploy.gae/gae": true,
        "plugins/c9.ide.deploy.gae/libgae": true,
        "plugins/c9.ide.run.build/gui": true,
        "plugins/c9.ide.deploy.openshift/libopenshift": true,
        "plugins/c9.ide.deploy/deploy": true,
        "plugins/c9.ide.deploy/instance": true,
        "plugins/c9.ide.deploy/target": true,
        "plugins/c9.ide.preview/preview": true,
        "plugins/c9.ide.plugins/test": true,
        "plugins/c9.ide.test/all": true,
        "plugins/c9.ide.test/results": true,
        "plugins/c9.ide.test/coverage": true,
        "plugins/c9.ide.test/coverageview": true,
        "plugins/c9.ide.test.mocha/mocha": true,
        "plugins/c9.ide.test/testpanel": true,
        "plugins/c9.ide.test/testrunner": true,
        "plugins/c9.ide.mount/mount": true,
        "plugins/c9.ide.mount/ftp": true,
        "plugins/c9.ide.mount/sftp": true,
        "plugins/c9.ide.preview/previewer": true,
        "plugins/c9.ide.preview/previewers/raw": true,
        "plugins/c9.ide.preview.browser/browser": true,
        "plugins/c9.ide.preview.markdown/markdown": true,
        "plugins/saucelabs.preview/preview": true,
        "plugins/c9.ide.welcome/welcome": true,
        "plugins/c9.core/settings": true,
        // "plugins/c9.ide.performancestats/stats": true,
        // "plugins/c9.ide.performancestats/stats_analytics": true,
        "plugins/c9.ide.analytics/analytics": true,
    };
    
    var includedPluginIndex, includedPlugin;
    for (includedPluginIndex in includes) {
        includedPlugin = includes[includedPluginIndex];
        includedPlugin = includedPlugin.packagePath || includedPlugin;
        excludes[includedPlugin] = true;
    }

    config = config.filter(function(p) {
        if (p.packagePath === "plugins/c9.ide.layout.classic/preload") {
            p.defaultTheme = "flat-light";
        }
        if (p.packagePath === "plugins/c9.ide.collab/share/share") {
            p.silent = true;
        }
        return !excludes[p] && !excludes[p.packagePath];
    }).concat(includes);
    return config;
    
    
    function getLoadingHTML(options) {
        return '<link rel="stylesheet" type="text/css" href="' + options.staticPrefix + '/plugins/c9.ide.layout.classic/loading-flat.css" />' +
            '<link href="https://fonts.googleapis.com/css?family=Lato:300,400,400italic,600,700|Raleway:300,400,500,600,700|Crete+Round:400italic" rel="stylesheet" type="text/css" />' +
            '<link href="https://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,700italic,300,400,700" rel="stylesheet" type="text/css" />' +
            '<link rel="stylesheet" type="text/css" href="https://az793023.vo.msecnd.net/c9-dashboard/ide-loading/loading.css" />' +
            '<div class="smflogo"></div>' +
            '<div class="cool-message"></div>' +
            '<div class="status" style="display:none"><div class="spinner2"></div></div>' +
            '<div id="content" class="loading-progress">' +
            '</div>' +
            '<div class="footer">' +
            '    <a href="https://docs.smartface.io" target="_blank">Documentation</a> | ' +
            '    <a href="http://support.smartface.io" target="_blank">Support</a>' +
            '</div>' +
            '<script src="https://az793023.vo.msecnd.net/c9-dashboard/ide-loading/loading.js"></script>';
    }
};
