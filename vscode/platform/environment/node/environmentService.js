/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "crypto", "vs/base/node/paths", "os", "path", "fs", "vs/base/common/uri", "vs/base/common/uuid", "vs/base/common/decorators", "vs/platform/node/package", "vs/platform/node/product"], function (require, exports, crypto, paths, os, path, fs, uri_1, uuid_1, decorators_1, package_1, product_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getUniqueUserId() {
        var username;
        if (process.platform === 'win32') {
            username = process.env.USERNAME;
        }
        else {
            username = process.env.USER;
        }
        if (!username) {
            return ''; // fail gracefully if there is no user name
        }
        // use sha256 to ensure the userid value can be used in filenames and are unique
        return crypto.createHash('sha256').update(username).digest('hex').substr(0, 6);
    }
    function getNixIPCHandle(userDataPath, type) {
        if (process.env['XDG_RUNTIME_DIR']) {
            return path.join(process.env['XDG_RUNTIME_DIR'], package_1.default.name + "-" + package_1.default.version + "-" + type + ".sock");
        }
        return path.join(userDataPath, package_1.default.version + "-" + type + ".sock");
    }
    function getWin32IPCHandle(type) {
        // Support to run VS Code multiple times as different user
        // by making the socket unique over the logged in user
        var userId = getUniqueUserId();
        var name = product_1.default.applicationName + (userId ? "-" + userId : '');
        return "\\\\.\\pipe\\" + name + "-" + package_1.default.version + "-" + type + "-sock";
    }
    function getIPCHandle(userDataPath, type) {
        if (process.platform === 'win32') {
            return getWin32IPCHandle(type);
        }
        else {
            return getNixIPCHandle(userDataPath, type);
        }
    }
    var EnvironmentService = (function () {
        function EnvironmentService(_args, _execPath) {
            this._args = _args;
            this._execPath = _execPath;
            var machineIdPath = path.join(this.userDataPath, 'machineid');
            try {
                this.machineUUID = fs.readFileSync(machineIdPath, 'utf8');
            }
            catch (err) {
                this.machineUUID = uuid_1.generateUuid();
                try {
                    fs.writeFileSync(machineIdPath, this.machineUUID);
                }
                catch (err) {
                    console.warn('Could not store machine ID');
                }
            }
        }
        Object.defineProperty(EnvironmentService.prototype, "args", {
            get: function () { return this._args; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appRoot", {
            get: function () { return path.dirname(uri_1.default.parse(require.toUrl('')).fsPath); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "execPath", {
            get: function () { return this._execPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userHome", {
            get: function () { return os.homedir(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "userDataPath", {
            get: function () { return parseUserDataDir(this._args, process); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appNameLong", {
            get: function () { return product_1.default.nameLong; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appQuality", {
            get: function () { return product_1.default.quality; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appSettingsHome", {
            get: function () { return path.join(this.userDataPath, 'User'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appSettingsPath", {
            get: function () { return path.join(this.appSettingsHome, 'settings.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "appKeybindingsPath", {
            get: function () { return path.join(this.appSettingsHome, 'keybindings.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isExtensionDevelopment", {
            get: function () { return !!this._args.extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "backupHome", {
            get: function () { return path.join(this.userDataPath, 'Backups'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "backupWorkspacesPath", {
            get: function () { return path.join(this.backupHome, 'workspaces.json'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "workspacesHome", {
            get: function () { return path.join(this.userDataPath, 'Workspaces'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionsPath", {
            get: function () { return parsePathArg(this._args['extensions-dir'], process) || process.env['VSCODE_EXTENSIONS'] || path.join(this.userHome, product_1.default.dataFolderName, 'extensions'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionDevelopmentPath", {
            get: function () { return this._args.extensionDevelopmentPath ? path.normalize(this._args.extensionDevelopmentPath) : this._args.extensionDevelopmentPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "extensionTestsPath", {
            get: function () { return this._args.extensionTestsPath ? path.normalize(this._args.extensionTestsPath) : this._args.extensionTestsPath; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "disableExtensions", {
            get: function () { return this._args['disable-extensions']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "skipGettingStarted", {
            get: function () { return this._args['skip-getting-started']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "debugExtensionHost", {
            get: function () { return parseExtensionHostPort(this._args, this.isBuilt); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "isBuilt", {
            get: function () { return !process.env['VSCODE_DEV']; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "verbose", {
            get: function () { return this._args.verbose; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "wait", {
            get: function () { return this._args.wait; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "logExtensionHostCommunication", {
            get: function () { return this._args.logExtensionHostCommunication; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "performance", {
            get: function () { return this._args.performance; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "profileStartup", {
            get: function () {
                if (this._args['prof-startup']) {
                    return {
                        prefix: process.env.VSCODE_PROFILES_PREFIX,
                        dir: os.homedir()
                    };
                }
                else {
                    return undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "mainIPCHandle", {
            get: function () { return getIPCHandle(this.userDataPath, 'main'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "sharedIPCHandle", {
            get: function () { return getIPCHandle(this.userDataPath, 'shared'); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentService.prototype, "nodeCachedDataDir", {
            get: function () { return this.isBuilt ? path.join(this.userDataPath, 'CachedData', product_1.default.commit) : undefined; },
            enumerable: true,
            configurable: true
        });
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appRoot", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "userDataPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appSettingsHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appSettingsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "appKeybindingsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "isExtensionDevelopment", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "backupHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "backupWorkspacesPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "workspacesHome", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionDevelopmentPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "extensionTestsPath", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "debugExtensionHost", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "profileStartup", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "mainIPCHandle", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "sharedIPCHandle", null);
        __decorate([
            decorators_1.memoize
        ], EnvironmentService.prototype, "nodeCachedDataDir", null);
        return EnvironmentService;
    }());
    exports.EnvironmentService = EnvironmentService;
    function parseExtensionHostPort(args, isBuild) {
        var portStr = args.debugBrkPluginHost || args.debugPluginHost;
        var port = Number(portStr) || (!isBuild ? 5870 : null);
        var brk = port ? Boolean(!!args.debugBrkPluginHost) : false;
        return { port: port, break: brk, debugId: args.debugId };
    }
    exports.parseExtensionHostPort = parseExtensionHostPort;
    function parsePathArg(arg, process) {
        if (!arg) {
            return undefined;
        }
        // Determine if the arg is relative or absolute, if relative use the original CWD
        // (VSCODE_CWD), not the potentially overridden one (process.cwd()).
        var resolved = path.resolve(arg);
        if (path.normalize(arg) === resolved) {
            return resolved;
        }
        else {
            return path.resolve(process.env['VSCODE_CWD'] || process.cwd(), arg);
        }
    }
    function parseUserDataDir(args, process) {
        return parsePathArg(args['user-data-dir'], process) || path.resolve(paths.getDefaultUserDataPath(process.platform));
    }
    exports.parseUserDataDir = parseUserDataDir;
});
//# sourceMappingURL=environmentService.js.map