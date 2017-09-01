define(["require", "exports", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/base/common/event", "vs/base/common/async", "./extHost.protocol"], function (require, exports, uri_1, winjs_base_1, event_1, async_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getIconPath(decorations) {
        if (!decorations) {
            return undefined;
        }
        else if (typeof decorations.iconPath === 'string') {
            return uri_1.default.file(decorations.iconPath).toString();
        }
        else if (decorations.iconPath) {
            return "" + decorations.iconPath;
        }
        return undefined;
    }
    var ExtHostSCMInputBox = (function () {
        function ExtHostSCMInputBox(_proxy, _sourceControlHandle) {
            this._proxy = _proxy;
            this._sourceControlHandle = _sourceControlHandle;
            this._value = '';
            this._onDidChange = new event_1.Emitter();
            // noop
        }
        Object.defineProperty(ExtHostSCMInputBox.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (value) {
                this._proxy.$setInputBoxValue(this._sourceControlHandle, value);
                this.updateValue(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSCMInputBox.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostSCMInputBox.prototype.$onInputBoxValueChange = function (value) {
            this.updateValue(value);
        };
        ExtHostSCMInputBox.prototype.updateValue = function (value) {
            this._value = value;
            this._onDidChange.fire(value);
        };
        return ExtHostSCMInputBox;
    }());
    exports.ExtHostSCMInputBox = ExtHostSCMInputBox;
    var ExtHostSourceControlResourceGroup = (function () {
        function ExtHostSourceControlResourceGroup(_proxy, _commands, _sourceControlHandle, _id, _label) {
            this._proxy = _proxy;
            this._commands = _commands;
            this._sourceControlHandle = _sourceControlHandle;
            this._id = _id;
            this._label = _label;
            this._resourceHandlePool = 0;
            this._resourceStates = [];
            this._resourceStatesMap = new Map();
            this._hideWhenEmpty = undefined;
            this._handle = ExtHostSourceControlResourceGroup._handlePool++;
            this._proxy.$registerGroup(_sourceControlHandle, this._handle, _id, _label);
        }
        Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "label", {
            get: function () {
                return this._label;
            },
            set: function (label) {
                this._label = label;
                this._proxy.$updateGroupLabel(this._sourceControlHandle, this._handle, label);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "hideWhenEmpty", {
            get: function () {
                return this._hideWhenEmpty;
            },
            set: function (hideWhenEmpty) {
                this._hideWhenEmpty = hideWhenEmpty;
                this._proxy.$updateGroup(this._sourceControlHandle, this._handle, { hideWhenEmpty: hideWhenEmpty });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "resourceStates", {
            get: function () {
                return this._resourceStates.slice();
            },
            set: function (resources) {
                var _this = this;
                this._resourceStatesMap.clear();
                this._resourceStates = resources.slice();
                var rawResources = resources.map(function (r) {
                    var handle = _this._resourceHandlePool++;
                    _this._resourceStatesMap.set(handle, r);
                    var sourceUri = r.resourceUri.toString();
                    var command = _this._commands.toInternal(r.command);
                    var iconPath = getIconPath(r.decorations);
                    var lightIconPath = r.decorations && getIconPath(r.decorations.light) || iconPath;
                    var darkIconPath = r.decorations && getIconPath(r.decorations.dark) || iconPath;
                    var icons = [];
                    if (lightIconPath || darkIconPath) {
                        icons.push(lightIconPath);
                    }
                    if (darkIconPath !== lightIconPath) {
                        icons.push(darkIconPath);
                    }
                    var tooltip = (r.decorations && r.decorations.tooltip) || '';
                    var strikeThrough = r.decorations && !!r.decorations.strikeThrough;
                    var faded = r.decorations && !!r.decorations.faded;
                    return [handle, sourceUri, command, icons, tooltip, strikeThrough, faded];
                });
                this._proxy.$updateGroupResourceStates(this._sourceControlHandle, this._handle, rawResources);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControlResourceGroup.prototype, "handle", {
            get: function () {
                return this._handle;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostSourceControlResourceGroup.prototype.getResourceState = function (handle) {
            return this._resourceStatesMap.get(handle);
        };
        ExtHostSourceControlResourceGroup.prototype.dispose = function () {
            this._proxy.$unregisterGroup(this._sourceControlHandle, this._handle);
        };
        ExtHostSourceControlResourceGroup._handlePool = 0;
        return ExtHostSourceControlResourceGroup;
    }());
    var ExtHostSourceControl = (function () {
        function ExtHostSourceControl(_proxy, _commands, _id, _label) {
            this._proxy = _proxy;
            this._commands = _commands;
            this._id = _id;
            this._label = _label;
            this._groups = new Map();
            this._count = undefined;
            this._quickDiffProvider = undefined;
            this._commitTemplate = undefined;
            this._acceptInputCommand = undefined;
            this._statusBarCommands = undefined;
            this._handle = ExtHostSourceControl._handlePool++;
            this._inputBox = new ExtHostSCMInputBox(this._proxy, this._handle);
            this._proxy.$registerSourceControl(this._handle, _id, _label);
        }
        Object.defineProperty(ExtHostSourceControl.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "label", {
            get: function () {
                return this._label;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "inputBox", {
            get: function () { return this._inputBox; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "count", {
            get: function () {
                return this._count;
            },
            set: function (count) {
                this._count = count;
                this._proxy.$updateSourceControl(this._handle, { count: count });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "quickDiffProvider", {
            get: function () {
                return this._quickDiffProvider;
            },
            set: function (quickDiffProvider) {
                this._quickDiffProvider = quickDiffProvider;
                this._proxy.$updateSourceControl(this._handle, { hasQuickDiffProvider: !!quickDiffProvider });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "commitTemplate", {
            get: function () {
                return this._commitTemplate;
            },
            set: function (commitTemplate) {
                this._commitTemplate = commitTemplate;
                this._proxy.$updateSourceControl(this._handle, { commitTemplate: commitTemplate });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "acceptInputCommand", {
            get: function () {
                return this._acceptInputCommand;
            },
            set: function (acceptInputCommand) {
                this._acceptInputCommand = acceptInputCommand;
                var internal = this._commands.toInternal(acceptInputCommand);
                this._proxy.$updateSourceControl(this._handle, { acceptInputCommand: internal });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostSourceControl.prototype, "statusBarCommands", {
            get: function () {
                return this._statusBarCommands;
            },
            set: function (statusBarCommands) {
                var _this = this;
                this._statusBarCommands = statusBarCommands;
                var internal = (statusBarCommands || []).map(function (c) { return _this._commands.toInternal(c); });
                this._proxy.$updateSourceControl(this._handle, { statusBarCommands: internal });
            },
            enumerable: true,
            configurable: true
        });
        ExtHostSourceControl.prototype.createResourceGroup = function (id, label) {
            var group = new ExtHostSourceControlResourceGroup(this._proxy, this._commands, this._handle, id, label);
            this._groups.set(group.handle, group);
            return group;
        };
        ExtHostSourceControl.prototype.getResourceGroup = function (handle) {
            return this._groups.get(handle);
        };
        ExtHostSourceControl.prototype.dispose = function () {
            this._proxy.$unregisterSourceControl(this._handle);
        };
        ExtHostSourceControl._handlePool = 0;
        return ExtHostSourceControl;
    }());
    var ExtHostSCM = (function () {
        function ExtHostSCM(mainContext, _commands) {
            var _this = this;
            this._commands = _commands;
            this._sourceControls = new Map();
            this._sourceControlsByExtension = new Map();
            this._onDidChangeActiveProvider = new event_1.Emitter();
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadSCM);
            _commands.registerArgumentProcessor({
                processArgument: function (arg) {
                    if (arg && arg.$mid === 3) {
                        var sourceControl = _this._sourceControls.get(arg.sourceControlHandle);
                        if (!sourceControl) {
                            return arg;
                        }
                        var group = sourceControl.getResourceGroup(arg.groupHandle);
                        if (!group) {
                            return arg;
                        }
                        return group.getResourceState(arg.handle);
                    }
                    else if (arg && arg.$mid === 4) {
                        var sourceControl = _this._sourceControls.get(arg.sourceControlHandle);
                        if (!sourceControl) {
                            return arg;
                        }
                        return sourceControl.getResourceGroup(arg.groupHandle);
                    }
                    else if (arg && arg.$mid === 5) {
                        var sourceControl = _this._sourceControls.get(arg.handle);
                        if (!sourceControl) {
                            return arg;
                        }
                        return sourceControl;
                    }
                    return arg;
                }
            });
        }
        Object.defineProperty(ExtHostSCM.prototype, "onDidChangeActiveProvider", {
            get: function () { return this._onDidChangeActiveProvider.event; },
            enumerable: true,
            configurable: true
        });
        ExtHostSCM.prototype.createSourceControl = function (extension, id, label) {
            var handle = ExtHostSCM._handlePool++;
            var sourceControl = new ExtHostSourceControl(this._proxy, this._commands.converter, id, label);
            this._sourceControls.set(handle, sourceControl);
            var sourceControls = this._sourceControlsByExtension.get(extension.id) || [];
            sourceControls.push(sourceControl);
            this._sourceControlsByExtension.set(extension.id, sourceControls);
            return sourceControl;
        };
        // Deprecated
        ExtHostSCM.prototype.getLastInputBox = function (extension) {
            var sourceControls = this._sourceControlsByExtension.get(extension.id);
            var sourceControl = sourceControls && sourceControls[sourceControls.length - 1];
            var inputBox = sourceControl && sourceControl.inputBox;
            return inputBox;
        };
        ExtHostSCM.prototype.$provideOriginalResource = function (sourceControlHandle, uri) {
            var sourceControl = this._sourceControls.get(sourceControlHandle);
            if (!sourceControl || !sourceControl.quickDiffProvider) {
                return winjs_base_1.TPromise.as(null);
            }
            return async_1.asWinJsPromise(function (token) {
                var result = sourceControl.quickDiffProvider.provideOriginalResource(uri, token);
                return result && uri_1.default.parse(result.toString());
            });
        };
        ExtHostSCM.prototype.$onInputBoxValueChange = function (sourceControlHandle, value) {
            var sourceControl = this._sourceControls.get(sourceControlHandle);
            if (!sourceControl || !sourceControl.quickDiffProvider) {
                return winjs_base_1.TPromise.as(null);
            }
            sourceControl.inputBox.$onInputBoxValueChange(value);
            return winjs_base_1.TPromise.as(null);
        };
        ExtHostSCM._handlePool = 0;
        return ExtHostSCM;
    }());
    exports.ExtHostSCM = ExtHostSCM;
});
//# sourceMappingURL=extHostSCM.js.map