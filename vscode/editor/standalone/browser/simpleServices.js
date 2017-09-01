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
define(["require", "exports", "vs/base/common/network", "vs/base/common/severity", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/platform/configuration/common/configuration", "vs/platform/commands/common/commands", "vs/platform/keybinding/common/abstractKeybindingService", "vs/platform/keybinding/common/usLayoutResolvedKeybinding", "vs/platform/keybinding/common/keybindingResolver", "vs/platform/keybinding/common/keybinding", "vs/editor/common/editorCommon", "vs/base/common/event", "vs/platform/configuration/common/model", "vs/base/common/lifecycle", "vs/base/browser/dom", "vs/base/browser/keyboardEvent", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/actions/common/menu", "vs/base/common/keyCodes", "vs/platform/keybinding/common/resolvedKeybindingItem", "vs/base/common/platform"], function (require, exports, network_1, severity_1, uri_1, winjs_base_1, configuration_1, commands_1, abstractKeybindingService_1, usLayoutResolvedKeybinding_1, keybindingResolver_1, keybinding_1, editorCommon, event_1, model_1, lifecycle_1, dom, keyboardEvent_1, keybindingsRegistry_1, menu_1, keyCodes_1, resolvedKeybindingItem_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimpleEditor = (function () {
        function SimpleEditor(editor) {
            this._widget = editor;
        }
        SimpleEditor.prototype.getId = function () { return 'editor'; };
        SimpleEditor.prototype.getControl = function () { return this._widget; };
        SimpleEditor.prototype.getSelection = function () { return this._widget.getSelection(); };
        SimpleEditor.prototype.focus = function () { this._widget.focus(); };
        SimpleEditor.prototype.isVisible = function () { return true; };
        SimpleEditor.prototype.withTypedEditor = function (codeEditorCallback, diffEditorCallback) {
            if (editorCommon.isCommonCodeEditor(this._widget)) {
                // Single Editor
                return codeEditorCallback(this._widget);
            }
            else {
                // Diff Editor
                return diffEditorCallback(this._widget);
            }
        };
        return SimpleEditor;
    }());
    exports.SimpleEditor = SimpleEditor;
    var SimpleModel = (function () {
        function SimpleModel(model) {
            this.model = model;
            this._onDispose = new event_1.Emitter();
        }
        Object.defineProperty(SimpleModel.prototype, "onDispose", {
            get: function () {
                return this._onDispose.event;
            },
            enumerable: true,
            configurable: true
        });
        SimpleModel.prototype.load = function () {
            return winjs_base_1.TPromise.as(this);
        };
        Object.defineProperty(SimpleModel.prototype, "textEditorModel", {
            get: function () {
                return this.model;
            },
            enumerable: true,
            configurable: true
        });
        SimpleModel.prototype.dispose = function () {
            this._onDispose.fire();
        };
        return SimpleModel;
    }());
    exports.SimpleModel = SimpleModel;
    var SimpleEditorService = (function () {
        function SimpleEditorService() {
            this.openEditorDelegate = null;
        }
        SimpleEditorService.prototype.setEditor = function (editor) {
            this.editor = new SimpleEditor(editor);
        };
        SimpleEditorService.prototype.setOpenEditorDelegate = function (openEditorDelegate) {
            this.openEditorDelegate = openEditorDelegate;
        };
        SimpleEditorService.prototype.openEditor = function (typedData, sideBySide) {
            var _this = this;
            return winjs_base_1.TPromise.as(this.editor.withTypedEditor(function (editor) { return _this.doOpenEditor(editor, typedData); }, function (diffEditor) { return (_this.doOpenEditor(diffEditor.getOriginalEditor(), typedData) ||
                _this.doOpenEditor(diffEditor.getModifiedEditor(), typedData)); }));
        };
        SimpleEditorService.prototype.doOpenEditor = function (editor, data) {
            var model = this.findModel(editor, data);
            if (!model) {
                if (data.resource) {
                    if (this.openEditorDelegate) {
                        this.openEditorDelegate(data.resource.toString());
                        return null;
                    }
                    else {
                        var schema = data.resource.scheme;
                        if (schema === network_1.Schemas.http || schema === network_1.Schemas.https) {
                            // This is a fully qualified http or https URL
                            window.open(data.resource.toString());
                            return this.editor;
                        }
                    }
                }
                return null;
            }
            var selection = data.options.selection;
            if (selection) {
                if (typeof selection.endLineNumber === 'number' && typeof selection.endColumn === 'number') {
                    editor.setSelection(selection);
                    editor.revealRangeInCenter(selection);
                }
                else {
                    var pos = {
                        lineNumber: selection.startLineNumber,
                        column: selection.startColumn
                    };
                    editor.setPosition(pos);
                    editor.revealPositionInCenter(pos);
                }
            }
            return this.editor;
        };
        SimpleEditorService.prototype.findModel = function (editor, data) {
            var model = editor.getModel();
            if (model.uri.toString() !== data.resource.toString()) {
                return null;
            }
            return model;
        };
        return SimpleEditorService;
    }());
    exports.SimpleEditorService = SimpleEditorService;
    var SimpleEditorModelResolverService = (function () {
        function SimpleEditorModelResolverService() {
        }
        SimpleEditorModelResolverService.prototype.setEditor = function (editor) {
            this.editor = new SimpleEditor(editor);
        };
        SimpleEditorModelResolverService.prototype.createModelReference = function (resource) {
            var _this = this;
            var model;
            model = this.editor.withTypedEditor(function (editor) { return _this.findModel(editor, resource); }, function (diffEditor) { return _this.findModel(diffEditor.getOriginalEditor(), resource) || _this.findModel(diffEditor.getModifiedEditor(), resource); });
            if (!model) {
                return winjs_base_1.TPromise.as(new lifecycle_1.ImmortalReference(null));
            }
            return winjs_base_1.TPromise.as(new lifecycle_1.ImmortalReference(new SimpleModel(model)));
        };
        SimpleEditorModelResolverService.prototype.registerTextModelContentProvider = function (scheme, provider) {
            return {
                dispose: function () { }
            };
        };
        SimpleEditorModelResolverService.prototype.findModel = function (editor, resource) {
            var model = editor.getModel();
            if (model.uri.toString() !== resource.toString()) {
                return null;
            }
            return model;
        };
        return SimpleEditorModelResolverService;
    }());
    exports.SimpleEditorModelResolverService = SimpleEditorModelResolverService;
    var SimpleProgressService = (function () {
        function SimpleProgressService() {
        }
        SimpleProgressService.prototype.show = function () {
            return SimpleProgressService.NULL_PROGRESS_RUNNER;
        };
        SimpleProgressService.prototype.showWhile = function (promise, delay) {
            return null;
        };
        SimpleProgressService.NULL_PROGRESS_RUNNER = {
            done: function () { },
            total: function () { },
            worked: function () { }
        };
        return SimpleProgressService;
    }());
    exports.SimpleProgressService = SimpleProgressService;
    var SimpleMessageService = (function () {
        function SimpleMessageService() {
        }
        SimpleMessageService.prototype.show = function (sev, message) {
            switch (sev) {
                case severity_1.default.Error:
                    console.error(message);
                    break;
                case severity_1.default.Warning:
                    console.warn(message);
                    break;
                default:
                    console.log(message);
                    break;
            }
            return SimpleMessageService.Empty;
        };
        SimpleMessageService.prototype.hideAll = function () {
            // No-op
        };
        SimpleMessageService.prototype.confirm = function (confirmation) {
            var messageText = confirmation.message;
            if (confirmation.detail) {
                messageText = messageText + '\n\n' + confirmation.detail;
            }
            return window.confirm(messageText);
        };
        SimpleMessageService.Empty = function () { };
        return SimpleMessageService;
    }());
    exports.SimpleMessageService = SimpleMessageService;
    var StandaloneCommandService = (function () {
        function StandaloneCommandService(instantiationService) {
            this._onWillExecuteCommand = new event_1.Emitter();
            this.onWillExecuteCommand = this._onWillExecuteCommand.event;
            this._instantiationService = instantiationService;
            this._dynamicCommands = Object.create(null);
        }
        StandaloneCommandService.prototype.addCommand = function (id, command) {
            var _this = this;
            this._dynamicCommands[id] = command;
            return {
                dispose: function () {
                    delete _this._dynamicCommands[id];
                }
            };
        };
        StandaloneCommandService.prototype.executeCommand = function (id) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var command = (commands_1.CommandsRegistry.getCommand(id) || this._dynamicCommands[id]);
            if (!command) {
                return winjs_base_1.TPromise.wrapError(new Error("command '" + id + "' not found"));
            }
            try {
                this._onWillExecuteCommand.fire({ commandId: id });
                var result = this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler].concat(args));
                return winjs_base_1.TPromise.as(result);
            }
            catch (err) {
                return winjs_base_1.TPromise.wrapError(err);
            }
        };
        return StandaloneCommandService;
    }());
    exports.StandaloneCommandService = StandaloneCommandService;
    var StandaloneKeybindingService = (function (_super) {
        __extends(StandaloneKeybindingService, _super);
        function StandaloneKeybindingService(contextKeyService, commandService, messageService, domNode) {
            var _this = _super.call(this, contextKeyService, commandService, messageService) || this;
            _this._cachedResolver = null;
            _this._dynamicKeybindings = [];
            _this.toDispose.push(dom.addDisposableListener(domNode, dom.EventType.KEY_DOWN, function (e) {
                var keyEvent = new keyboardEvent_1.StandardKeyboardEvent(e);
                var shouldPreventDefault = _this._dispatch(keyEvent, keyEvent.target);
                if (shouldPreventDefault) {
                    keyEvent.preventDefault();
                }
            }));
            return _this;
        }
        StandaloneKeybindingService.prototype.addDynamicKeybinding = function (commandId, keybinding, handler, when) {
            var _this = this;
            var toDispose = [];
            this._dynamicKeybindings.push({
                keybinding: keyCodes_1.createKeybinding(keybinding, platform_1.OS),
                command: commandId,
                when: when,
                weight1: 1000,
                weight2: 0
            });
            toDispose.push({
                dispose: function () {
                    for (var i = 0; i < _this._dynamicKeybindings.length; i++) {
                        var kb = _this._dynamicKeybindings[i];
                        if (kb.command === commandId) {
                            _this._dynamicKeybindings.splice(i, 1);
                            _this.updateResolver({ source: keybinding_1.KeybindingSource.Default });
                            return;
                        }
                    }
                }
            });
            var commandService = this._commandService;
            if (commandService instanceof StandaloneCommandService) {
                toDispose.push(commandService.addCommand(commandId, {
                    handler: handler
                }));
            }
            else {
                throw new Error('Unknown command service!');
            }
            this.updateResolver({ source: keybinding_1.KeybindingSource.Default });
            return lifecycle_1.combinedDisposable(toDispose);
        };
        StandaloneKeybindingService.prototype.updateResolver = function (event) {
            this._cachedResolver = null;
            this._onDidUpdateKeybindings.fire(event);
        };
        StandaloneKeybindingService.prototype._getResolver = function () {
            if (!this._cachedResolver) {
                var defaults = this._toNormalizedKeybindingItems(keybindingsRegistry_1.KeybindingsRegistry.getDefaultKeybindings(), true);
                var overrides = this._toNormalizedKeybindingItems(this._dynamicKeybindings, false);
                this._cachedResolver = new keybindingResolver_1.KeybindingResolver(defaults, overrides);
            }
            return this._cachedResolver;
        };
        StandaloneKeybindingService.prototype._toNormalizedKeybindingItems = function (items, isDefault) {
            var result = [], resultLen = 0;
            for (var i = 0, len = items.length; i < len; i++) {
                var item = items[i];
                var when = (item.when ? item.when.normalize() : null);
                var keybinding = item.keybinding;
                if (!keybinding) {
                    // This might be a removal keybinding item in user settings => accept it
                    result[resultLen++] = new resolvedKeybindingItem_1.ResolvedKeybindingItem(null, item.command, item.commandArgs, when, isDefault);
                }
                else {
                    var resolvedKeybindings = this.resolveKeybinding(keybinding);
                    for (var j = 0; j < resolvedKeybindings.length; j++) {
                        result[resultLen++] = new resolvedKeybindingItem_1.ResolvedKeybindingItem(resolvedKeybindings[j], item.command, item.commandArgs, when, isDefault);
                    }
                }
            }
            return result;
        };
        StandaloneKeybindingService.prototype.resolveKeybinding = function (keybinding) {
            return [new usLayoutResolvedKeybinding_1.USLayoutResolvedKeybinding(keybinding, platform_1.OS)];
        };
        StandaloneKeybindingService.prototype.resolveKeyboardEvent = function (keyboardEvent) {
            var keybinding = new keyCodes_1.SimpleKeybinding(keyboardEvent.ctrlKey, keyboardEvent.shiftKey, keyboardEvent.altKey, keyboardEvent.metaKey, keyboardEvent.keyCode);
            return new usLayoutResolvedKeybinding_1.USLayoutResolvedKeybinding(keybinding, platform_1.OS);
        };
        StandaloneKeybindingService.prototype.resolveUserBinding = function (userBinding) {
            return [];
        };
        return StandaloneKeybindingService;
    }(abstractKeybindingService_1.AbstractKeybindingService));
    exports.StandaloneKeybindingService = StandaloneKeybindingService;
    var SimpleConfigurationService = (function () {
        function SimpleConfigurationService() {
            this._onDidUpdateConfiguration = new event_1.Emitter();
            this.onDidUpdateConfiguration = this._onDidUpdateConfiguration.event;
            this._configuration = new configuration_1.Configuration(new model_1.DefaultConfigurationModel(), new configuration_1.ConfigurationModel());
        }
        SimpleConfigurationService.prototype.configuration = function () {
            return this._configuration;
        };
        SimpleConfigurationService.prototype.reloadConfiguration = function (section) {
            return winjs_base_1.TPromise.as(this.getConfiguration(section));
        };
        SimpleConfigurationService.prototype.getConfiguration = function (section, options) {
            return this.configuration().getValue(section, options);
        };
        SimpleConfigurationService.prototype.lookup = function (key, options) {
            return this.configuration().lookup(key, options);
        };
        SimpleConfigurationService.prototype.keys = function () {
            return this.configuration().keys();
        };
        SimpleConfigurationService.prototype.values = function () {
            return this._configuration.values();
        };
        SimpleConfigurationService.prototype.getConfigurationData = function () {
            return this.configuration().toData();
        };
        return SimpleConfigurationService;
    }());
    exports.SimpleConfigurationService = SimpleConfigurationService;
    var SimpleResourceConfigurationService = (function () {
        function SimpleResourceConfigurationService(configurationService) {
            var _this = this;
            this.configurationService = configurationService;
            this._onDidUpdateConfigurationEmitter = new event_1.Emitter();
            this.configurationService.onDidUpdateConfiguration(function () {
                _this._onDidUpdateConfigurationEmitter.fire();
            });
        }
        SimpleResourceConfigurationService.prototype.getConfiguration = function () {
            return this.configurationService.getConfiguration();
        };
        return SimpleResourceConfigurationService;
    }());
    exports.SimpleResourceConfigurationService = SimpleResourceConfigurationService;
    var SimpleMenuService = (function () {
        function SimpleMenuService(commandService) {
            this._commandService = commandService;
        }
        SimpleMenuService.prototype.createMenu = function (id, contextKeyService) {
            return new menu_1.Menu(id, winjs_base_1.TPromise.as(true), this._commandService, contextKeyService);
        };
        return SimpleMenuService;
    }());
    exports.SimpleMenuService = SimpleMenuService;
    var StandaloneTelemetryService = (function () {
        function StandaloneTelemetryService() {
            this.isOptedIn = false;
        }
        StandaloneTelemetryService.prototype.publicLog = function (eventName, data) {
            return winjs_base_1.TPromise.as(null);
        };
        StandaloneTelemetryService.prototype.getTelemetryInfo = function () {
            return null;
        };
        return StandaloneTelemetryService;
    }());
    exports.StandaloneTelemetryService = StandaloneTelemetryService;
    var SimpleWorkspaceContextService = (function () {
        function SimpleWorkspaceContextService() {
            this._onDidChangeWorkspaceName = new event_1.Emitter();
            this.onDidChangeWorkspaceName = this._onDidChangeWorkspaceName.event;
            this._onDidChangeWorkspaceRoots = new event_1.Emitter();
            this.onDidChangeWorkspaceRoots = this._onDidChangeWorkspaceRoots.event;
            this.legacyWorkspace = { resource: uri_1.default.from({ scheme: SimpleWorkspaceContextService.SCHEME, authority: 'model', path: '/' }) };
            this.workspace = { id: '4064f6ec-cb38-4ad0-af64-ee6467e63c82', roots: [this.legacyWorkspace.resource], name: this.legacyWorkspace.resource.fsPath };
        }
        SimpleWorkspaceContextService.prototype.getLegacyWorkspace = function () {
            return this.legacyWorkspace;
        };
        SimpleWorkspaceContextService.prototype.getWorkspace = function () {
            return this.workspace;
        };
        SimpleWorkspaceContextService.prototype.getRoot = function (resource) {
            return resource && resource.scheme === SimpleWorkspaceContextService.SCHEME ? this.workspace.roots[0] : void 0;
        };
        SimpleWorkspaceContextService.prototype.hasWorkspace = function () {
            return true;
        };
        SimpleWorkspaceContextService.prototype.hasFolderWorkspace = function () {
            return true;
        };
        SimpleWorkspaceContextService.prototype.hasMultiFolderWorkspace = function () {
            return false;
        };
        SimpleWorkspaceContextService.prototype.isInsideWorkspace = function (resource) {
            return resource && resource.scheme === SimpleWorkspaceContextService.SCHEME;
        };
        SimpleWorkspaceContextService.prototype.toResource = function (workspaceRelativePath) {
            return uri_1.default.file(workspaceRelativePath);
        };
        return SimpleWorkspaceContextService;
    }());
    exports.SimpleWorkspaceContextService = SimpleWorkspaceContextService;
});
//# sourceMappingURL=simpleServices.js.map