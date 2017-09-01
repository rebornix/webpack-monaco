/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "child_process", "vs/base/common/winjs.base", "vs/base/common/objects", "vs/platform/environment/node/argv", "vs/platform/node/product", "vs/platform/node/package", "fs", "path", "os"], function (require, exports, child_process_1, winjs_base_1, objects_1, argv_1, product_1, package_1, fs, paths, os) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function shouldSpawnCliProcess(argv) {
        return argv['list-extensions'] || !!argv['install-extension'] || !!argv['uninstall-extension'];
    }
    function main(argv) {
        var args;
        try {
            args = argv_1.parseCLIProcessArgv(argv);
        }
        catch (err) {
            console.error(err.message);
            return winjs_base_1.TPromise.as(null);
        }
        if (args.help) {
            console.log(argv_1.buildHelpMessage(product_1.default.nameLong, product_1.default.applicationName, package_1.default.version));
        }
        else if (args.version) {
            console.log(package_1.default.version + "\n" + product_1.default.commit);
        }
        else if (shouldSpawnCliProcess(args)) {
            var mainCli = new winjs_base_1.TPromise(function (c) { return require(['vs/code/node/cliProcessMain'], c); });
            return mainCli.then(function (cli) { return cli.main(args); });
        }
        else {
            var env = objects_1.assign({}, process.env, {
                // this will signal Code that it was spawned from this module
                'VSCODE_CLI': '1',
                'ELECTRON_NO_ATTACH_CONSOLE': '1'
            });
            delete env['ELECTRON_RUN_AS_NODE'];
            if (args.verbose) {
                env['ELECTRON_ENABLE_LOGGING'] = '1';
            }
            // If we are started with --wait create a random temporary file
            // and pass it over to the starting instance. We can use this file
            // to wait for it to be deleted to monitor that the edited file
            // is closed and then exit the waiting process.
            var waitMarkerFilePath_1;
            if (args.wait) {
                var waitMarkerError = void 0;
                var randomTmpFile = paths.join(os.tmpdir(), Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10));
                try {
                    fs.writeFileSync(randomTmpFile, '');
                    waitMarkerFilePath_1 = randomTmpFile;
                    argv.push('--waitMarkerFilePath', waitMarkerFilePath_1);
                }
                catch (error) {
                    waitMarkerError = error;
                }
                if (args.verbose) {
                    if (waitMarkerError) {
                        console.error("Failed to create marker file for --wait: " + waitMarkerError.toString());
                    }
                    else {
                        console.log("Marker file for --wait created: " + waitMarkerFilePath_1);
                    }
                }
            }
            var options = {
                detached: true,
                env: env
            };
            if (!args.verbose) {
                options['stdio'] = 'ignore';
            }
            var child_1 = child_process_1.spawn(process.execPath, argv.slice(2), options);
            if (args.verbose) {
                child_1.stdout.on('data', function (data) { return console.log(data.toString('utf8').trim()); });
                child_1.stderr.on('data', function (data) { return console.log(data.toString('utf8').trim()); });
            }
            if (args.verbose) {
                return new winjs_base_1.TPromise(function (c) { return child_1.once('exit', function () { return c(null); }); });
            }
            if (args.wait && waitMarkerFilePath_1) {
                return new winjs_base_1.TPromise(function (c) {
                    // Complete when process exits
                    child_1.once('exit', function () { return c(null); });
                    // Complete when wait marker file is deleted
                    var interval = setInterval(function () {
                        fs.exists(waitMarkerFilePath_1, function (exists) {
                            if (!exists) {
                                clearInterval(interval);
                                c(null);
                            }
                        });
                    }, 1000);
                });
            }
        }
        return winjs_base_1.TPromise.as(null);
    }
    exports.main = main;
    function eventuallyExit(code) {
        setTimeout(function () { return process.exit(code); }, 0);
    }
    main(process.argv)
        .then(function () { return eventuallyExit(0); })
        .then(null, function (err) {
        console.error(err.stack ? err.stack : err);
        eventuallyExit(1);
    });
});
//# sourceMappingURL=cli.js.map