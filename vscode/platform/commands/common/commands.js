define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/types", "vs/platform/instantiation/common/instantiation"], function (require, exports, winjs_base_1, types_1, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ICommandService = instantiation_1.createDecorator('commandService');
    function isCommand(thing) {
        return typeof thing === 'object'
            && typeof thing.handler === 'function'
            && (!thing.description || typeof thing.description === 'object');
    }
    exports.CommandsRegistry = new (function () {
        function class_1() {
            this._commands = new Map();
        }
        class_1.prototype.registerCommand = function (id, commandOrDesc) {
            var _this = this;
            if (!commandOrDesc) {
                throw new Error("invalid command");
            }
            var command;
            if (!isCommand(commandOrDesc)) {
                // simple handler
                command = { handler: commandOrDesc };
            }
            else {
                var handler_1 = commandOrDesc.handler, description = commandOrDesc.description;
                if (description) {
                    // add argument validation if rich command metadata is provided
                    var constraints_1 = [];
                    for (var _i = 0, _a = description.args; _i < _a.length; _i++) {
                        var arg = _a[_i];
                        constraints_1.push(arg.constraint);
                    }
                    command = {
                        description: description,
                        handler: function (accessor) {
                            var args = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                args[_i - 1] = arguments[_i];
                            }
                            types_1.validateConstraints(args, constraints_1);
                            return handler_1.apply(void 0, [accessor].concat(args));
                        }
                    };
                }
                else {
                    // add as simple handler
                    command = { handler: handler_1 };
                }
            }
            // find a place to store the command
            var commandOrArray = this._commands.get(id);
            if (commandOrArray === void 0) {
                this._commands.set(id, command);
            }
            else if (Array.isArray(commandOrArray)) {
                commandOrArray.unshift(command);
            }
            else {
                this._commands.set(id, [command, commandOrArray]);
            }
            return {
                dispose: function () {
                    var commandOrArray = _this._commands.get(id);
                    if (Array.isArray(commandOrArray)) {
                        // remove from array, remove array
                        // if last element removed
                        var idx = commandOrArray.indexOf(command);
                        if (idx >= 0) {
                            commandOrArray.splice(idx, 1);
                            if (commandOrArray.length === 0) {
                                _this._commands.delete(id);
                            }
                        }
                    }
                    else if (isCommand(commandOrArray)) {
                        // remove from map
                        _this._commands.delete(id);
                    }
                }
            };
        };
        class_1.prototype.getCommand = function (id) {
            var commandOrArray = this._commands.get(id);
            if (Array.isArray(commandOrArray)) {
                return commandOrArray[0];
            }
            else {
                return commandOrArray;
            }
        };
        class_1.prototype.getCommands = function () {
            var _this = this;
            var result = Object.create(null);
            this._commands.forEach(function (value, key) {
                result[key] = _this.getCommand(key);
            });
            return result;
        };
        return class_1;
    }());
    exports.NullCommandService = {
        _serviceBrand: undefined,
        onWillExecuteCommand: function () { return ({ dispose: function () { } }); },
        executeCommand: function () {
            return winjs_base_1.TPromise.as(undefined);
        }
    };
});
//# sourceMappingURL=commands.js.map