var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/nls", "vs/base/common/objects", "vs/base/common/platform", "vs/base/common/types", "vs/base/common/parsers"], function (require, exports, NLS, Objects, Platform, Types, parsers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Source;
    (function (Source) {
        Source[Source["stdout"] = 0] = "stdout";
        Source[Source["stderr"] = 1] = "stderr";
    })(Source = exports.Source || (exports.Source = {}));
    var TerminateResponseCode;
    (function (TerminateResponseCode) {
        TerminateResponseCode[TerminateResponseCode["Success"] = 0] = "Success";
        TerminateResponseCode[TerminateResponseCode["Unknown"] = 1] = "Unknown";
        TerminateResponseCode[TerminateResponseCode["AccessDenied"] = 2] = "AccessDenied";
        TerminateResponseCode[TerminateResponseCode["ProcessNotFound"] = 3] = "ProcessNotFound";
    })(TerminateResponseCode = exports.TerminateResponseCode || (exports.TerminateResponseCode = {}));
    var ExecutableParser = (function (_super) {
        __extends(ExecutableParser, _super);
        function ExecutableParser(logger) {
            return _super.call(this, logger) || this;
        }
        ExecutableParser.prototype.parse = function (json, parserOptions) {
            if (parserOptions === void 0) { parserOptions = { globals: null, emptyCommand: false, noDefaults: false }; }
            var result = this.parseExecutable(json, parserOptions.globals);
            if (this.problemReporter.status.isFatal()) {
                return result;
            }
            var osExecutable;
            if (json.windows && Platform.platform === Platform.Platform.Windows) {
                osExecutable = this.parseExecutable(json.windows);
            }
            else if (json.osx && Platform.platform === Platform.Platform.Mac) {
                osExecutable = this.parseExecutable(json.osx);
            }
            else if (json.linux && Platform.platform === Platform.Platform.Linux) {
                osExecutable = this.parseExecutable(json.linux);
            }
            if (osExecutable) {
                result = ExecutableParser.mergeExecutable(result, osExecutable);
            }
            if ((!result || !result.command) && !parserOptions.emptyCommand) {
                this.fatal(NLS.localize('ExecutableParser.commandMissing', 'Error: executable info must define a command of type string.'));
                return null;
            }
            if (!parserOptions.noDefaults) {
                parsers_1.Parser.merge(result, {
                    command: undefined,
                    isShellCommand: false,
                    args: [],
                    options: {}
                }, false);
            }
            return result;
        };
        ExecutableParser.prototype.parseExecutable = function (json, globals) {
            var command = undefined;
            var isShellCommand = undefined;
            var args = undefined;
            var options = undefined;
            if (this.is(json.command, Types.isString)) {
                command = json.command;
            }
            if (this.is(json.isShellCommand, Types.isBoolean, parsers_1.ValidationState.Warning, NLS.localize('ExecutableParser.isShellCommand', 'Warning: isShellCommand must be of type boolean. Ignoring value {0}.', json.isShellCommand))) {
                isShellCommand = json.isShellCommand;
            }
            if (this.is(json.args, Types.isStringArray, parsers_1.ValidationState.Warning, NLS.localize('ExecutableParser.args', 'Warning: args must be of type string[]. Ignoring value {0}.', json.isShellCommand))) {
                args = json.args.slice(0);
            }
            if (this.is(json.options, Types.isObject)) {
                options = this.parseCommandOptions(json.options);
            }
            return { command: command, isShellCommand: isShellCommand, args: args, options: options };
        };
        ExecutableParser.prototype.parseCommandOptions = function (json) {
            var result = {};
            if (!json) {
                return result;
            }
            if (this.is(json.cwd, Types.isString, parsers_1.ValidationState.Warning, NLS.localize('ExecutableParser.invalidCWD', 'Warning: options.cwd must be of type string. Ignoring value {0}.', json.cwd))) {
                result.cwd = json.cwd;
            }
            if (!Types.isUndefined(json.env)) {
                result.env = Objects.clone(json.env);
            }
            return result;
        };
        ExecutableParser.mergeExecutable = function (executable, other) {
            if (!executable) {
                return other;
            }
            parsers_1.Parser.merge(executable, other, true);
            return executable;
        };
        return ExecutableParser;
    }(parsers_1.Parser));
    exports.ExecutableParser = ExecutableParser;
});
//# sourceMappingURL=processes.js.map