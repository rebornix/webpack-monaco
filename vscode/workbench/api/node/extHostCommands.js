define(["require", "exports", "vs/base/common/types", "vs/base/common/winjs.base", "vs/workbench/api/node/extHostTypes", "vs/workbench/api/node/extHostTypeConverters", "vs/base/common/objects", "./extHost.protocol", "vs/base/common/arrays"], function (require, exports, types_1, winjs_base_1, extHostTypes, extHostTypeConverter, objects_1, extHost_protocol_1, arrays_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostCommands = (function () {
        function ExtHostCommands(mainContext, heapService) {
            this._commands = new Map();
            this._argumentProcessors = [];
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadCommands);
            this._converter = new CommandsConverter(this, heapService);
        }
        Object.defineProperty(ExtHostCommands.prototype, "converter", {
            get: function () {
                return this._converter;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostCommands.prototype.registerArgumentProcessor = function (processor) {
            this._argumentProcessors.push(processor);
        };
        ExtHostCommands.prototype.registerCommand = function (id, callback, thisArg, description) {
            var _this = this;
            if (!id.trim().length) {
                throw new Error('invalid id');
            }
            if (this._commands.has(id)) {
                throw new Error("command '" + id + "' already exists");
            }
            this._commands.set(id, { callback: callback, thisArg: thisArg, description: description });
            this._proxy.$registerCommand(id);
            return new extHostTypes.Disposable(function () {
                if (_this._commands.delete(id)) {
                    _this._proxy.$unregisterCommand(id);
                }
            });
        };
        ExtHostCommands.prototype.executeCommand = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this._commands.has(id)) {
                // we stay inside the extension host and support
                // to pass any kind of parameters around
                return this.$executeContributedCommand.apply(this, [id].concat(args));
            }
            else {
                // automagically convert some argument types
                args = objects_1.cloneAndChange(args, function (value) {
                    if (value instanceof extHostTypes.Position) {
                        return extHostTypeConverter.fromPosition(value);
                    }
                    if (value instanceof extHostTypes.Range) {
                        return extHostTypeConverter.fromRange(value);
                    }
                    if (value instanceof extHostTypes.Location) {
                        return extHostTypeConverter.location.from(value);
                    }
                    if (!Array.isArray(value)) {
                        return value;
                    }
                });
                return this._proxy.$executeCommand(id, args);
            }
        };
        ExtHostCommands.prototype.$executeContributedCommand = function (id) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var command = this._commands.get(id);
            if (!command) {
                return winjs_base_1.TPromise.wrapError(new Error("Contributed command '" + id + "' does not exist."));
            }
            var callback = command.callback, thisArg = command.thisArg, description = command.description;
            if (description) {
                for (var i = 0; i < description.args.length; i++) {
                    try {
                        types_1.validateConstraint(args[i], description.args[i].constraint);
                    }
                    catch (err) {
                        return winjs_base_1.TPromise.wrapError(new Error("Running the contributed command:'" + id + "' failed. Illegal argument '" + description.args[i].name + "' - " + description.args[i].description));
                    }
                }
            }
            args = args.map(function (arg) { return _this._argumentProcessors.reduce(function (r, p) { return p.processArgument(r); }, arg); });
            try {
                var result = callback.apply(thisArg, args);
                return winjs_base_1.TPromise.as(result);
            }
            catch (err) {
                // console.log(err);
                // try {
                // 	console.log(toErrorMessage(err));
                // } catch (err) {
                // 	//
                // }
                return winjs_base_1.TPromise.wrapError(new Error("Running the contributed command:'" + id + "' failed."));
            }
        };
        ExtHostCommands.prototype.getCommands = function (filterUnderscoreCommands) {
            if (filterUnderscoreCommands === void 0) { filterUnderscoreCommands = false; }
            return this._proxy.$getCommands().then(function (result) {
                if (filterUnderscoreCommands) {
                    result = result.filter(function (command) { return command[0] !== '_'; });
                }
                return result;
            });
        };
        ExtHostCommands.prototype.$getContributedCommandHandlerDescriptions = function () {
            var result = Object.create(null);
            this._commands.forEach(function (command, id) {
                var description = command.description;
                if (description) {
                    result[id] = description;
                }
            });
            return winjs_base_1.TPromise.as(result);
        };
        return ExtHostCommands;
    }());
    exports.ExtHostCommands = ExtHostCommands;
    var CommandsConverter = (function () {
        // --- conversion between internal and api commands
        function CommandsConverter(commands, heap) {
            this._commands = commands;
            this._heap = heap;
            this._commands.registerCommand('_internal_command_delegation', this._executeConvertedCommand, this);
        }
        CommandsConverter.prototype.toInternal = function (command) {
            if (!command) {
                return undefined;
            }
            var result = {
                id: command.command,
                title: command.title
            };
            if (command.command && !arrays_1.isFalsyOrEmpty(command.arguments)) {
                // we have a contributed command with arguments. that
                // means we don't want to send the arguments around
                var id = this._heap.keep(command);
                extHost_protocol_1.ObjectIdentifier.mixin(result, id);
                result.id = '_internal_command_delegation';
                result.arguments = [id];
            }
            if (command.tooltip) {
                result.tooltip = command.tooltip;
            }
            return result;
        };
        CommandsConverter.prototype.fromInternal = function (command) {
            if (!command) {
                return undefined;
            }
            var id = extHost_protocol_1.ObjectIdentifier.of(command);
            if (typeof id === 'number') {
                return this._heap.get(id);
            }
            else {
                return {
                    command: command.id,
                    title: command.title,
                    arguments: command.arguments
                };
            }
        };
        CommandsConverter.prototype._executeConvertedCommand = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var actualCmd = this._heap.get(args[0]);
            return (_a = this._commands).executeCommand.apply(_a, [actualCmd.command].concat(actualCmd.arguments));
            var _a;
        };
        return CommandsConverter;
    }());
    exports.CommandsConverter = CommandsConverter;
});
//# sourceMappingURL=extHostCommands.js.map