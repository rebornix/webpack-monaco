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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "vs/base/common/errors", "vs/base/common/uri", "vs/platform/commands/common/commands", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/registry/common/platform", "vs/platform/telemetry/common/telemetry", "vs/editor/common/core/position", "vs/editor/common/services/modelService", "vs/platform/actions/common/actions", "vs/platform/editor/common/editor", "vs/platform/contextkey/common/contextkey", "vs/editor/common/services/codeEditorService"], function (require, exports, errors_1, uri_1, commands_1, keybindingsRegistry_1, platform_1, telemetry_1, position_1, modelService_1, actions_1, editor_1, contextkey_1, codeEditorService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Command = (function () {
        function Command(opts) {
            this.id = opts.id;
            this.precondition = opts.precondition;
            this._kbOpts = opts.kbOpts;
            this._description = opts.description;
        }
        Command.prototype.toCommandAndKeybindingRule = function (defaultWeight) {
            var _this = this;
            var kbOpts = this._kbOpts || { primary: 0 };
            var kbWhen = kbOpts.kbExpr;
            if (this.precondition) {
                if (kbWhen) {
                    kbWhen = contextkey_1.ContextKeyExpr.and(kbWhen, this.precondition);
                }
                else {
                    kbWhen = this.precondition;
                }
            }
            var weight = (typeof kbOpts.weight === 'number' ? kbOpts.weight : defaultWeight);
            return {
                id: this.id,
                handler: function (accessor, args) { return _this.runCommand(accessor, args); },
                weight: weight,
                when: kbWhen,
                primary: kbOpts.primary,
                secondary: kbOpts.secondary,
                win: kbOpts.win,
                linux: kbOpts.linux,
                mac: kbOpts.mac,
                description: this._description
            };
        };
        return Command;
    }());
    exports.Command = Command;
    // ----- Editor Command & Editor Contribution Command
    function findFocusedEditor(accessor) {
        return accessor.get(codeEditorService_1.ICodeEditorService).getFocusedCodeEditor();
    }
    function getWorkbenchActiveEditor(accessor) {
        var editorService = accessor.get(editor_1.IEditorService);
        var activeEditor = editorService.getActiveEditor && editorService.getActiveEditor();
        return codeEditorService_1.getCodeEditor(activeEditor);
    }
    var EditorCommand = (function (_super) {
        __extends(EditorCommand, _super);
        function EditorCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Create a command class that is bound to a certain editor contribution.
         */
        EditorCommand.bindToContribution = function (controllerGetter) {
            return (function (_super) {
                __extends(EditorControllerCommandImpl, _super);
                function EditorControllerCommandImpl(opts) {
                    var _this = _super.call(this, opts) || this;
                    _this._callback = opts.handler;
                    return _this;
                }
                EditorControllerCommandImpl.prototype.runEditorCommand = function (accessor, editor, args) {
                    var controller = controllerGetter(editor);
                    if (controller) {
                        this._callback(controllerGetter(editor));
                    }
                };
                return EditorControllerCommandImpl;
            }(EditorCommand));
        };
        EditorCommand.prototype.runCommand = function (accessor, args) {
            var _this = this;
            // Find the editor with text focus
            var editor = findFocusedEditor(accessor);
            if (!editor) {
                // Fallback to use what the workbench considers the active editor
                editor = getWorkbenchActiveEditor(accessor);
            }
            if (!editor) {
                // well, at least we tried...
                return;
            }
            return editor.invokeWithinContext(function (editorAccessor) {
                var kbService = editorAccessor.get(contextkey_1.IContextKeyService);
                if (!kbService.contextMatchesRules(_this.precondition)) {
                    // precondition does not hold
                    return;
                }
                return _this.runEditorCommand(editorAccessor, editor, args);
            });
        };
        return EditorCommand;
    }(Command));
    exports.EditorCommand = EditorCommand;
    var EditorAction = (function (_super) {
        __extends(EditorAction, _super);
        function EditorAction(opts) {
            var _this = _super.call(this, opts) || this;
            _this.label = opts.label;
            _this.alias = opts.alias;
            _this.menuOpts = opts.menuOpts;
            return _this;
        }
        EditorAction.prototype.toMenuItem = function () {
            if (!this.menuOpts) {
                return null;
            }
            return {
                command: {
                    id: this.id,
                    title: this.label
                },
                when: this.precondition,
                group: this.menuOpts.group,
                order: this.menuOpts.order
            };
        };
        EditorAction.prototype.runEditorCommand = function (accessor, editor, args) {
            this.reportTelemetry(accessor, editor);
            return this.run(accessor, editor, args || {});
        };
        EditorAction.prototype.reportTelemetry = function (accessor, editor) {
            accessor.get(telemetry_1.ITelemetryService).publicLog('editorActionInvoked', __assign({ name: this.label, id: this.id }, editor.getTelemetryData()));
        };
        return EditorAction;
    }(EditorCommand));
    exports.EditorAction = EditorAction;
    // --- Registration of commands and actions
    function editorAction(ctor) {
        CommonEditorRegistry.registerEditorAction(new ctor());
    }
    exports.editorAction = editorAction;
    function editorCommand(ctor) {
        registerEditorCommand(new ctor());
    }
    exports.editorCommand = editorCommand;
    function registerEditorCommand(editorCommand) {
        CommonEditorRegistry.registerEditorCommand(editorCommand);
        return editorCommand;
    }
    exports.registerEditorCommand = registerEditorCommand;
    function commonEditorContribution(ctor) {
        EditorContributionRegistry.INSTANCE.registerEditorContribution(ctor);
    }
    exports.commonEditorContribution = commonEditorContribution;
    var CommonEditorRegistry;
    (function (CommonEditorRegistry) {
        // --- Editor Actions
        function registerEditorAction(editorAction) {
            EditorContributionRegistry.INSTANCE.registerEditorAction(editorAction);
        }
        CommonEditorRegistry.registerEditorAction = registerEditorAction;
        function getEditorActions() {
            return EditorContributionRegistry.INSTANCE.getEditorActions();
        }
        CommonEditorRegistry.getEditorActions = getEditorActions;
        function getEditorCommand(commandId) {
            return EditorContributionRegistry.INSTANCE.getEditorCommand(commandId);
        }
        CommonEditorRegistry.getEditorCommand = getEditorCommand;
        // --- Editor Contributions
        function getEditorContributions() {
            return EditorContributionRegistry.INSTANCE.getEditorContributions();
        }
        CommonEditorRegistry.getEditorContributions = getEditorContributions;
        // --- Editor Commands
        function commandWeight(importance) {
            if (importance === void 0) { importance = 0; }
            return keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib(importance);
        }
        CommonEditorRegistry.commandWeight = commandWeight;
        function registerEditorCommand(editorCommand) {
            EditorContributionRegistry.INSTANCE.registerEditorCommand(editorCommand);
        }
        CommonEditorRegistry.registerEditorCommand = registerEditorCommand;
        function registerLanguageCommand(id, handler) {
            commands_1.CommandsRegistry.registerCommand(id, function (accessor, args) { return handler(accessor, args || {}); });
        }
        CommonEditorRegistry.registerLanguageCommand = registerLanguageCommand;
        function registerDefaultLanguageCommand(id, handler) {
            registerLanguageCommand(id, function (accessor, args) {
                var resource = args.resource, position = args.position;
                if (!(resource instanceof uri_1.default)) {
                    throw errors_1.illegalArgument('resource');
                }
                if (!position_1.Position.isIPosition(position)) {
                    throw errors_1.illegalArgument('position');
                }
                var model = accessor.get(modelService_1.IModelService).getModel(resource);
                if (!model) {
                    throw errors_1.illegalArgument('Can not find open model for ' + resource);
                }
                var editorPosition = position_1.Position.lift(position);
                return handler(model, editorPosition, args);
            });
        }
        CommonEditorRegistry.registerDefaultLanguageCommand = registerDefaultLanguageCommand;
    })(CommonEditorRegistry = exports.CommonEditorRegistry || (exports.CommonEditorRegistry = {}));
    // Editor extension points
    var Extensions = {
        EditorCommonContributions: 'editor.commonContributions'
    };
    var EditorContributionRegistry = (function () {
        function EditorContributionRegistry() {
            this.editorContributions = [];
            this.editorActions = [];
            this.editorCommands = Object.create(null);
        }
        EditorContributionRegistry.prototype.registerEditorContribution = function (ctor) {
            this.editorContributions.push(ctor);
        };
        EditorContributionRegistry.prototype.registerEditorAction = function (action) {
            var menuItem = action.toMenuItem();
            if (menuItem) {
                actions_1.MenuRegistry.appendMenuItem(actions_1.MenuId.EditorContext, menuItem);
            }
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(action.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
            this.editorActions.push(action);
        };
        EditorContributionRegistry.prototype.getEditorContributions = function () {
            return this.editorContributions.slice(0);
        };
        EditorContributionRegistry.prototype.getEditorActions = function () {
            return this.editorActions.slice(0);
        };
        EditorContributionRegistry.prototype.registerEditorCommand = function (editorCommand) {
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(editorCommand.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
            this.editorCommands[editorCommand.id] = editorCommand;
        };
        EditorContributionRegistry.prototype.getEditorCommand = function (commandId) {
            return (this.editorCommands[commandId] || null);
        };
        EditorContributionRegistry.INSTANCE = new EditorContributionRegistry();
        return EditorContributionRegistry;
    }());
    platform_1.Registry.add(Extensions.EditorCommonContributions, EditorContributionRegistry.INSTANCE);
});
//# sourceMappingURL=editorCommonExtensions.js.map