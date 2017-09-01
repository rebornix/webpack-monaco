/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/async", "vs/base/common/lifecycle", "vs/base/common/event", "vs/platform/registry/common/platform", "vs/editor/common/editorCommon", "vs/editor/common/core/range", "vs/platform/configuration/common/configurationRegistry", "vs/platform/instantiation/common/instantiation", "vs/workbench/parts/preferences/common/preferences", "vs/workbench/parts/preferences/common/preferencesModels", "vs/editor/browser/editorBrowser", "vs/platform/contextview/browser/contextView", "vs/workbench/parts/preferences/browser/preferencesWidgets", "vs/platform/telemetry/common/telemetry", "vs/workbench/common/editor/rangeDecorations", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/services/textfile/common/textfiles", "vs/platform/configuration/common/model", "vs/platform/markers/common/markers", "vs/workbench/services/configuration/common/configuration", "vs/platform/message/common/message", "vs/workbench/services/editor/common/editorService", "vs/editor/common/model/textModelWithDecorations", "vs/platform/workspace/common/workspace", "vs/base/common/htmlContent"], function (require, exports, winjs_base_1, nls, async_1, lifecycle_1, event_1, platform_1, editorCommon, range_1, configurationRegistry_1, instantiation_1, preferences_1, preferencesModels_1, editorBrowser_1, contextView_1, preferencesWidgets_1, telemetry_1, rangeDecorations_1, configurationEditing_1, textfiles_1, model_1, markers_1, configuration_1, message_1, editorService_1, textModelWithDecorations_1, workspace_1, htmlContent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserSettingsRenderer = (function (_super) {
        __extends(UserSettingsRenderer, _super);
        function UserSettingsRenderer(editor, preferencesModel, _associatedPreferencesModel, preferencesService, telemetryService, textFileService, configurationEditingService, messageService, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.preferencesModel = preferencesModel;
            _this._associatedPreferencesModel = _associatedPreferencesModel;
            _this.preferencesService = preferencesService;
            _this.telemetryService = telemetryService;
            _this.textFileService = textFileService;
            _this.configurationEditingService = configurationEditingService;
            _this.messageService = messageService;
            _this.instantiationService = instantiationService;
            _this.modelChangeDelayer = new async_1.Delayer(200);
            _this._onFocusPreference = new event_1.Emitter();
            _this.onFocusPreference = _this._onFocusPreference.event;
            _this._onUpdatePreference = new event_1.Emitter();
            _this.onUpdatePreference = _this._onUpdatePreference.event;
            _this._onClearFocusPreference = new event_1.Emitter();
            _this.onClearFocusPreference = _this._onClearFocusPreference.event;
            _this._register(preferencesModel);
            _this.settingHighlighter = _this._register(instantiationService.createInstance(SettingHighlighter, editor, _this._onFocusPreference, _this._onClearFocusPreference));
            _this.highlightMatchesRenderer = _this._register(instantiationService.createInstance(HighlightMatchesRenderer, editor));
            _this.editSettingActionRenderer = _this._register(_this.instantiationService.createInstance(EditSettingRenderer, _this.editor, _this.preferencesModel, _this.settingHighlighter));
            _this._register(_this.editSettingActionRenderer.onUpdateSetting(function (_a) {
                var key = _a.key, value = _a.value, source = _a.source;
                return _this.updatePreference(key, value, source);
            }));
            _this._register(_this.editor.getModel().onDidChangeContent(function () { return _this.modelChangeDelayer.trigger(function () { return _this.onModelChanged(); }); }));
            _this.createHeader();
            return _this;
        }
        Object.defineProperty(UserSettingsRenderer.prototype, "associatedPreferencesModel", {
            get: function () {
                return this._associatedPreferencesModel;
            },
            set: function (associatedPreferencesModel) {
                this._associatedPreferencesModel = associatedPreferencesModel;
                this.editSettingActionRenderer.associatedPreferencesModel = associatedPreferencesModel;
            },
            enumerable: true,
            configurable: true
        });
        UserSettingsRenderer.prototype.createHeader = function () {
            this._register(new preferencesWidgets_1.SettingsHeaderWidget(this.editor, '')).setMessage(nls.localize('emptyUserSettingsHeader', "Place your settings here to overwrite the Default Settings."));
        };
        UserSettingsRenderer.prototype.render = function () {
            this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this.associatedPreferencesModel);
            if (this.filterResult) {
                this.filterPreferences(this.filterResult);
            }
        };
        UserSettingsRenderer.prototype.updatePreference = function (key, value, source) {
            var _this = this;
            this.telemetryService.publicLog('defaultSettingsActions.copySetting', { userConfigurationKeys: [key] });
            var overrideIdentifier = source.overrideOf ? model_1.overrideIdentifierFromKey(source.overrideOf.key) : null;
            var resource = this.preferencesModel.uri;
            this.configurationEditingService.writeConfiguration(this.preferencesModel.configurationTarget, { key: key, value: value }, { donotSave: this.textFileService.isDirty(resource), donotNotifyError: true, scopes: { overrideIdentifier: overrideIdentifier, resource: resource } })
                .then(function () { return _this.onSettingUpdated(source); }, function (error) {
                _this.messageService.show(message_1.Severity.Error, _this.toErrorMessage(error, _this.preferencesModel.configurationTarget));
            });
        };
        UserSettingsRenderer.prototype.toErrorMessage = function (error, target) {
            switch (error.code) {
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION:
                    {
                        return nls.localize('errorInvalidConfiguration', "Unable to write into settings. Correct errors/warnings in the file and try again.");
                    }
                    ;
            }
            return error.message;
        };
        UserSettingsRenderer.prototype.onModelChanged = function () {
            if (!this.editor.getModel()) {
                // model could have been disposed during the delay
                return;
            }
            this.render();
        };
        UserSettingsRenderer.prototype.onSettingUpdated = function (setting) {
            this.editor.focus();
            setting = this.getSetting(setting);
            if (setting) {
                // TODO:@sandy Selection range should be template range
                this.editor.setSelection(setting.valueRange);
                this.settingHighlighter.highlight(setting, true);
            }
        };
        UserSettingsRenderer.prototype.getSetting = function (setting) {
            var key = setting.key, overrideOf = setting.overrideOf;
            if (overrideOf) {
                var setting_1 = this.getSetting(overrideOf);
                for (var _i = 0, _a = setting_1.overrides; _i < _a.length; _i++) {
                    var override = _a[_i];
                    if (override.key === key) {
                        return override;
                    }
                }
                return null;
            }
            return this.preferencesModel.getPreference(key);
        };
        UserSettingsRenderer.prototype.filterPreferences = function (filterResult) {
            this.filterResult = filterResult;
            this.settingHighlighter.clear(true);
            this.highlightMatchesRenderer.render(filterResult ? filterResult.matches : []);
        };
        UserSettingsRenderer.prototype.focusPreference = function (setting) {
            var s = this.getSetting(setting);
            if (s) {
                this.settingHighlighter.highlight(s, true);
            }
            else {
                this.settingHighlighter.clear(true);
            }
        };
        UserSettingsRenderer.prototype.clearFocus = function (setting) {
            this.settingHighlighter.clear(true);
        };
        UserSettingsRenderer = __decorate([
            __param(3, preferences_1.IPreferencesService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, textfiles_1.ITextFileService),
            __param(6, configurationEditing_1.IConfigurationEditingService),
            __param(7, message_1.IMessageService),
            __param(8, instantiation_1.IInstantiationService)
        ], UserSettingsRenderer);
        return UserSettingsRenderer;
    }(lifecycle_1.Disposable));
    exports.UserSettingsRenderer = UserSettingsRenderer;
    var WorkspaceSettingsRenderer = (function (_super) {
        __extends(WorkspaceSettingsRenderer, _super);
        function WorkspaceSettingsRenderer(editor, preferencesModel, associatedPreferencesModel, preferencesService, telemetryService, textFileService, configurationEditingService, messageService, instantiationService) {
            var _this = _super.call(this, editor, preferencesModel, associatedPreferencesModel, preferencesService, telemetryService, textFileService, configurationEditingService, messageService, instantiationService) || this;
            _this.untrustedSettingRenderer = _this._register(instantiationService.createInstance(UnsupportedWorkspaceSettingsRenderer, editor, preferencesModel));
            _this.workspaceConfigurationRenderer = _this._register(instantiationService.createInstance(WorkspaceConfigurationRenderer, editor, preferencesModel));
            return _this;
        }
        WorkspaceSettingsRenderer.prototype.createHeader = function () {
            this._register(new preferencesWidgets_1.SettingsHeaderWidget(this.editor, '')).setMessage(nls.localize('emptyWorkspaceSettingsHeader', "Place your settings here to overwrite the User Settings."));
        };
        WorkspaceSettingsRenderer.prototype.render = function () {
            _super.prototype.render.call(this);
            this.untrustedSettingRenderer.render();
            this.workspaceConfigurationRenderer.render();
        };
        WorkspaceSettingsRenderer = __decorate([
            __param(3, preferences_1.IPreferencesService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, textfiles_1.ITextFileService),
            __param(6, configurationEditing_1.IConfigurationEditingService),
            __param(7, message_1.IMessageService),
            __param(8, instantiation_1.IInstantiationService)
        ], WorkspaceSettingsRenderer);
        return WorkspaceSettingsRenderer;
    }(UserSettingsRenderer));
    exports.WorkspaceSettingsRenderer = WorkspaceSettingsRenderer;
    var FolderSettingsRenderer = (function (_super) {
        __extends(FolderSettingsRenderer, _super);
        function FolderSettingsRenderer(editor, preferencesModel, associatedPreferencesModel, preferencesService, telemetryService, textFileService, configurationEditingService, messageService, instantiationService) {
            var _this = _super.call(this, editor, preferencesModel, associatedPreferencesModel, preferencesService, telemetryService, textFileService, configurationEditingService, messageService, instantiationService) || this;
            _this.unsupportedWorkbenchSettingsRenderer = _this._register(instantiationService.createInstance(UnsupportedWorkbenchSettingsRenderer, editor, preferencesModel));
            return _this;
        }
        FolderSettingsRenderer.prototype.createHeader = function () {
            this._register(new preferencesWidgets_1.SettingsHeaderWidget(this.editor, '')).setMessage(nls.localize('emptyFolderSettingsHeader', "Place your folder settings here to overwrite those from the Workspace Settings."));
        };
        FolderSettingsRenderer.prototype.render = function () {
            _super.prototype.render.call(this);
            this.unsupportedWorkbenchSettingsRenderer.render();
        };
        FolderSettingsRenderer = __decorate([
            __param(3, preferences_1.IPreferencesService),
            __param(4, telemetry_1.ITelemetryService),
            __param(5, textfiles_1.ITextFileService),
            __param(6, configurationEditing_1.IConfigurationEditingService),
            __param(7, message_1.IMessageService),
            __param(8, instantiation_1.IInstantiationService)
        ], FolderSettingsRenderer);
        return FolderSettingsRenderer;
    }(UserSettingsRenderer));
    exports.FolderSettingsRenderer = FolderSettingsRenderer;
    var DefaultSettingsRenderer = (function (_super) {
        __extends(DefaultSettingsRenderer, _super);
        function DefaultSettingsRenderer(editor, preferencesModel, preferencesService, editorService, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.preferencesModel = preferencesModel;
            _this.preferencesService = preferencesService;
            _this.editorService = editorService;
            _this.instantiationService = instantiationService;
            _this._onUpdatePreference = new event_1.Emitter();
            _this.onUpdatePreference = _this._onUpdatePreference.event;
            _this._onFocusPreference = new event_1.Emitter();
            _this.onFocusPreference = _this._onFocusPreference.event;
            _this._onClearFocusPreference = new event_1.Emitter();
            _this.onClearFocusPreference = _this._onClearFocusPreference.event;
            _this.settingHighlighter = _this._register(instantiationService.createInstance(SettingHighlighter, editor, _this._onFocusPreference, _this._onClearFocusPreference));
            _this.settingsHeaderRenderer = _this._register(instantiationService.createInstance(DefaultSettingsHeaderRenderer, editor, preferencesModel.configurationScope));
            _this.settingsGroupTitleRenderer = _this._register(instantiationService.createInstance(SettingsGroupTitleRenderer, editor));
            _this.filteredMatchesRenderer = _this._register(instantiationService.createInstance(FilteredMatchesRenderer, editor));
            _this.editSettingActionRenderer = _this._register(instantiationService.createInstance(EditSettingRenderer, editor, preferencesModel, _this.settingHighlighter));
            _this._register(_this.editSettingActionRenderer.onUpdateSetting(function (e) { return _this._onUpdatePreference.fire(e); }));
            var paranthesisHidingRenderer = _this._register(instantiationService.createInstance(StaticContentHidingRenderer, editor, preferencesModel.settingsGroups));
            _this.hiddenAreasRenderer = _this._register(instantiationService.createInstance(HiddenAreasRenderer, editor, [_this.settingsGroupTitleRenderer, _this.filteredMatchesRenderer, paranthesisHidingRenderer]));
            _this._register(_this.settingsGroupTitleRenderer.onHiddenAreasChanged(function () { return _this.hiddenAreasRenderer.render(); }));
            return _this;
        }
        Object.defineProperty(DefaultSettingsRenderer.prototype, "associatedPreferencesModel", {
            get: function () {
                return this._associatedPreferencesModel;
            },
            set: function (associatedPreferencesModel) {
                this._associatedPreferencesModel = associatedPreferencesModel;
                this.editSettingActionRenderer.associatedPreferencesModel = associatedPreferencesModel;
            },
            enumerable: true,
            configurable: true
        });
        DefaultSettingsRenderer.prototype.render = function () {
            this.settingsGroupTitleRenderer.render(this.preferencesModel.settingsGroups);
            this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this._associatedPreferencesModel);
            this.hiddenAreasRenderer.render();
            this.settingHighlighter.clear(true);
            this.settingsGroupTitleRenderer.showGroup(1);
            this.hiddenAreasRenderer.render();
        };
        DefaultSettingsRenderer.prototype.filterPreferences = function (filterResult) {
            this.filterResult = filterResult;
            if (!filterResult) {
                this.settingHighlighter.clear(true);
                this.filteredMatchesRenderer.render(null);
                this.settingsHeaderRenderer.render(this.preferencesModel.settingsGroups);
                this.settingsGroupTitleRenderer.render(this.preferencesModel.settingsGroups);
                this.settingsGroupTitleRenderer.showGroup(1);
                this.editSettingActionRenderer.render(this.preferencesModel.settingsGroups, this._associatedPreferencesModel);
            }
            else {
                this.filteredMatchesRenderer.render(filterResult);
                this.settingsHeaderRenderer.render(filterResult.filteredGroups);
                this.settingsGroupTitleRenderer.render(filterResult.filteredGroups);
                this.settingHighlighter.clear(true);
                this.editSettingActionRenderer.render(filterResult.filteredGroups, this._associatedPreferencesModel);
            }
            this.hiddenAreasRenderer.render();
        };
        DefaultSettingsRenderer.prototype.focusPreference = function (s) {
            var setting = this.getSetting(s);
            if (setting) {
                this.settingsGroupTitleRenderer.showSetting(setting);
                this.settingHighlighter.highlight(setting, true);
            }
            else {
                this.settingHighlighter.clear(true);
            }
        };
        DefaultSettingsRenderer.prototype.getSetting = function (setting) {
            var key = setting.key, overrideOf = setting.overrideOf;
            if (overrideOf) {
                var setting_2 = this.getSetting(overrideOf);
                for (var _i = 0, _a = setting_2.overrides; _i < _a.length; _i++) {
                    var override = _a[_i];
                    if (override.key === key) {
                        return override;
                    }
                }
                return null;
            }
            var settingsGroups = this.filterResult ? this.filterResult.filteredGroups : this.preferencesModel.settingsGroups;
            return this.getPreference(key, settingsGroups);
        };
        DefaultSettingsRenderer.prototype.getPreference = function (key, settingsGroups) {
            for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
                var group = settingsGroups_1[_i];
                for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                    var section = _b[_a];
                    for (var _c = 0, _d = section.settings; _c < _d.length; _c++) {
                        var setting = _d[_c];
                        if (setting.key === key) {
                            return setting;
                        }
                    }
                }
            }
            return null;
        };
        DefaultSettingsRenderer.prototype.clearFocus = function (setting) {
            this.settingHighlighter.clear(true);
        };
        DefaultSettingsRenderer.prototype.collapseAll = function () {
            this.settingsGroupTitleRenderer.collapseAll();
        };
        DefaultSettingsRenderer.prototype.updatePreference = function (key, value, source) {
        };
        DefaultSettingsRenderer = __decorate([
            __param(2, preferences_1.IPreferencesService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, instantiation_1.IInstantiationService)
        ], DefaultSettingsRenderer);
        return DefaultSettingsRenderer;
    }(lifecycle_1.Disposable));
    exports.DefaultSettingsRenderer = DefaultSettingsRenderer;
    var StaticContentHidingRenderer = (function (_super) {
        __extends(StaticContentHidingRenderer, _super);
        function StaticContentHidingRenderer(editor, settingsGroups) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.settingsGroups = settingsGroups;
            return _this;
        }
        Object.defineProperty(StaticContentHidingRenderer.prototype, "hiddenAreas", {
            get: function () {
                var model = this.editor.getModel();
                return [
                    {
                        startLineNumber: 1,
                        startColumn: model.getLineMinColumn(1),
                        endLineNumber: 2,
                        endColumn: model.getLineMaxColumn(2)
                    },
                    {
                        startLineNumber: this.settingsGroups[0].range.endLineNumber + 1,
                        startColumn: model.getLineMinColumn(this.settingsGroups[0].range.endLineNumber + 1),
                        endLineNumber: this.settingsGroups[0].range.endLineNumber + 4,
                        endColumn: model.getLineMaxColumn(this.settingsGroups[0].range.endLineNumber + 4)
                    },
                    {
                        startLineNumber: model.getLineCount() - 1,
                        startColumn: model.getLineMinColumn(model.getLineCount() - 1),
                        endLineNumber: model.getLineCount(),
                        endColumn: model.getLineMaxColumn(model.getLineCount())
                    }
                ];
            },
            enumerable: true,
            configurable: true
        });
        return StaticContentHidingRenderer;
    }(lifecycle_1.Disposable));
    exports.StaticContentHidingRenderer = StaticContentHidingRenderer;
    var DefaultSettingsHeaderRenderer = (function (_super) {
        __extends(DefaultSettingsHeaderRenderer, _super);
        function DefaultSettingsHeaderRenderer(editor, scope) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            var title = scope === configurationRegistry_1.ConfigurationScope.RESOURCE ? nls.localize('defaultFolderSettingsTitle', "Default Folder Settings") : nls.localize('defaultSettingsTitle', "Default Settings");
            _this.settingsHeaderWidget = _this._register(new preferencesWidgets_1.SettingsHeaderWidget(editor, title));
            return _this;
        }
        DefaultSettingsHeaderRenderer.prototype.render = function (settingsGroups) {
            if (settingsGroups.length) {
                this.settingsHeaderWidget.setMessage('');
            }
            else {
                this.settingsHeaderWidget.setMessage(nls.localize('noSettingsFound', "No Settings Found."));
            }
        };
        return DefaultSettingsHeaderRenderer;
    }(lifecycle_1.Disposable));
    var SettingsGroupTitleRenderer = (function (_super) {
        __extends(SettingsGroupTitleRenderer, _super);
        function SettingsGroupTitleRenderer(editor, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.instantiationService = instantiationService;
            _this._onHiddenAreasChanged = new event_1.Emitter();
            _this.hiddenGroups = [];
            _this.disposables = [];
            return _this;
        }
        Object.defineProperty(SettingsGroupTitleRenderer.prototype, "onHiddenAreasChanged", {
            get: function () { return this._onHiddenAreasChanged.event; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(SettingsGroupTitleRenderer.prototype, "hiddenAreas", {
            get: function () {
                var hiddenAreas = [];
                for (var _i = 0, _a = this.hiddenGroups; _i < _a.length; _i++) {
                    var group = _a[_i];
                    hiddenAreas.push(group.range);
                }
                return hiddenAreas;
            },
            enumerable: true,
            configurable: true
        });
        SettingsGroupTitleRenderer.prototype.render = function (settingsGroups) {
            var _this = this;
            this.disposeWidgets();
            this.settingsGroups = settingsGroups.slice();
            this.settingsGroupTitleWidgets = [];
            var _loop_1 = function (group) {
                var settingsGroupTitleWidget = this_1.instantiationService.createInstance(preferencesWidgets_1.SettingsGroupTitleWidget, this_1.editor, group);
                settingsGroupTitleWidget.render();
                this_1.settingsGroupTitleWidgets.push(settingsGroupTitleWidget);
                this_1.disposables.push(settingsGroupTitleWidget);
                this_1.disposables.push(settingsGroupTitleWidget.onToggled(function (collapsed) { return _this.onToggled(collapsed, settingsGroupTitleWidget.settingsGroup); }));
            };
            var this_1 = this;
            for (var _i = 0, _a = this.settingsGroups.slice().reverse(); _i < _a.length; _i++) {
                var group = _a[_i];
                _loop_1(group);
            }
            this.settingsGroupTitleWidgets.reverse();
        };
        SettingsGroupTitleRenderer.prototype.showGroup = function (group) {
            this.hiddenGroups = this.settingsGroups.filter(function (g, i) { return i !== group - 1; });
            for (var _i = 0, _a = this.settingsGroupTitleWidgets.filter(function (g, i) { return i !== group - 1; }); _i < _a.length; _i++) {
                var groupTitleWidget = _a[_i];
                groupTitleWidget.toggleCollapse(true);
            }
            this._onHiddenAreasChanged.fire();
        };
        SettingsGroupTitleRenderer.prototype.showSetting = function (setting) {
            var settingsGroupTitleWidget = this.settingsGroupTitleWidgets.filter(function (widget) { return range_1.Range.containsRange(widget.settingsGroup.range, setting.range); })[0];
            if (settingsGroupTitleWidget && settingsGroupTitleWidget.isCollapsed()) {
                settingsGroupTitleWidget.toggleCollapse(false);
                this.hiddenGroups.splice(this.hiddenGroups.indexOf(settingsGroupTitleWidget.settingsGroup), 1);
                this._onHiddenAreasChanged.fire();
            }
        };
        SettingsGroupTitleRenderer.prototype.collapseAll = function () {
            this.editor.setPosition({ lineNumber: 1, column: 1 });
            this.hiddenGroups = this.settingsGroups.slice();
            for (var _i = 0, _a = this.settingsGroupTitleWidgets; _i < _a.length; _i++) {
                var groupTitleWidget = _a[_i];
                groupTitleWidget.toggleCollapse(true);
            }
            this._onHiddenAreasChanged.fire();
        };
        SettingsGroupTitleRenderer.prototype.onToggled = function (collapsed, group) {
            var index = this.hiddenGroups.indexOf(group);
            if (collapsed) {
                var currentPosition = this.editor.getPosition();
                if (group.range.startLineNumber <= currentPosition.lineNumber && group.range.endLineNumber >= currentPosition.lineNumber) {
                    this.editor.setPosition({ lineNumber: group.range.startLineNumber - 1, column: 1 });
                }
                this.hiddenGroups.push(group);
            }
            else {
                this.hiddenGroups.splice(index, 1);
            }
            this._onHiddenAreasChanged.fire();
        };
        SettingsGroupTitleRenderer.prototype.disposeWidgets = function () {
            this.hiddenGroups = [];
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        SettingsGroupTitleRenderer.prototype.dispose = function () {
            this.disposeWidgets();
            _super.prototype.dispose.call(this);
        };
        SettingsGroupTitleRenderer = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], SettingsGroupTitleRenderer);
        return SettingsGroupTitleRenderer;
    }(lifecycle_1.Disposable));
    exports.SettingsGroupTitleRenderer = SettingsGroupTitleRenderer;
    var HiddenAreasRenderer = (function (_super) {
        __extends(HiddenAreasRenderer, _super);
        function HiddenAreasRenderer(editor, hiddenAreasProviders, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.hiddenAreasProviders = hiddenAreasProviders;
            _this.instantiationService = instantiationService;
            return _this;
        }
        HiddenAreasRenderer.prototype.render = function () {
            var ranges = [];
            for (var _i = 0, _a = this.hiddenAreasProviders; _i < _a.length; _i++) {
                var hiddenAreaProvider = _a[_i];
                ranges.push.apply(ranges, hiddenAreaProvider.hiddenAreas);
            }
            this.editor.setHiddenAreas(ranges);
        };
        HiddenAreasRenderer.prototype.dispose = function () {
            this.editor.setHiddenAreas([]);
            _super.prototype.dispose.call(this);
        };
        HiddenAreasRenderer = __decorate([
            __param(2, instantiation_1.IInstantiationService)
        ], HiddenAreasRenderer);
        return HiddenAreasRenderer;
    }(lifecycle_1.Disposable));
    exports.HiddenAreasRenderer = HiddenAreasRenderer;
    var FilteredMatchesRenderer = (function (_super) {
        __extends(FilteredMatchesRenderer, _super);
        function FilteredMatchesRenderer(editor, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.instantiationService = instantiationService;
            _this.decorationIds = [];
            _this.hiddenAreas = [];
            return _this;
        }
        FilteredMatchesRenderer.prototype.render = function (result) {
            var _this = this;
            var model = this.editor.getModel();
            this.hiddenAreas = [];
            this.editor.changeDecorations(function (changeAccessor) {
                _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, []);
            });
            if (result) {
                this.hiddenAreas = this.computeHiddenRanges(result.filteredGroups, result.allGroups, model);
                this.editor.changeDecorations(function (changeAccessor) {
                    _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, result.matches.map(function (match) { return _this.createDecoration(match, model); }));
                });
            }
        };
        FilteredMatchesRenderer.prototype.createDecoration = function (range, model) {
            return {
                range: range,
                options: {
                    stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                    className: 'findMatch'
                }
            };
        };
        FilteredMatchesRenderer.prototype.computeHiddenRanges = function (filteredGroups, allSettingsGroups, model) {
            var notMatchesRanges = [];
            var _loop_2 = function (group) {
                var filteredGroup = filteredGroups.filter(function (g) { return g.title === group.title; })[0];
                if (!filteredGroup) {
                    notMatchesRanges.push({
                        startLineNumber: group.range.startLineNumber - 1,
                        startColumn: model.getLineMinColumn(group.range.startLineNumber - 1),
                        endLineNumber: group.range.endLineNumber,
                        endColumn: model.getLineMaxColumn(group.range.endLineNumber),
                    });
                }
                else {
                    for (var _i = 0, _a = group.sections; _i < _a.length; _i++) {
                        var section = _a[_i];
                        if (section.titleRange) {
                            if (!this_2.containsLine(section.titleRange.startLineNumber, filteredGroup)) {
                                notMatchesRanges.push(this_2.createCompleteRange(section.titleRange, model));
                            }
                        }
                        for (var _b = 0, _c = section.settings; _b < _c.length; _b++) {
                            var setting = _c[_b];
                            if (!this_2.containsLine(setting.range.startLineNumber, filteredGroup)) {
                                notMatchesRanges.push(this_2.createCompleteRange(setting.range, model));
                            }
                        }
                    }
                }
            };
            var this_2 = this;
            for (var _i = 0, allSettingsGroups_1 = allSettingsGroups; _i < allSettingsGroups_1.length; _i++) {
                var group = allSettingsGroups_1[_i];
                _loop_2(group);
            }
            return notMatchesRanges;
        };
        FilteredMatchesRenderer.prototype.containsLine = function (lineNumber, settingsGroup) {
            if (settingsGroup.titleRange && lineNumber >= settingsGroup.titleRange.startLineNumber && lineNumber <= settingsGroup.titleRange.endLineNumber) {
                return true;
            }
            for (var _i = 0, _a = settingsGroup.sections; _i < _a.length; _i++) {
                var section = _a[_i];
                if (section.titleRange && lineNumber >= section.titleRange.startLineNumber && lineNumber <= section.titleRange.endLineNumber) {
                    return true;
                }
                for (var _b = 0, _c = section.settings; _b < _c.length; _b++) {
                    var setting = _c[_b];
                    if (lineNumber >= setting.range.startLineNumber && lineNumber <= setting.range.endLineNumber) {
                        return true;
                    }
                }
            }
            return false;
        };
        FilteredMatchesRenderer.prototype.createCompleteRange = function (range, model) {
            return {
                startLineNumber: range.startLineNumber,
                startColumn: model.getLineMinColumn(range.startLineNumber),
                endLineNumber: range.endLineNumber,
                endColumn: model.getLineMaxColumn(range.endLineNumber)
            };
        };
        FilteredMatchesRenderer.prototype.dispose = function () {
            var _this = this;
            if (this.decorationIds) {
                this.decorationIds = this.editor.changeDecorations(function (changeAccessor) {
                    return changeAccessor.deltaDecorations(_this.decorationIds, []);
                });
            }
            _super.prototype.dispose.call(this);
        };
        FilteredMatchesRenderer = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], FilteredMatchesRenderer);
        return FilteredMatchesRenderer;
    }(lifecycle_1.Disposable));
    exports.FilteredMatchesRenderer = FilteredMatchesRenderer;
    var HighlightMatchesRenderer = (function (_super) {
        __extends(HighlightMatchesRenderer, _super);
        function HighlightMatchesRenderer(editor, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.instantiationService = instantiationService;
            _this.decorationIds = [];
            return _this;
        }
        HighlightMatchesRenderer.prototype.render = function (matches) {
            var _this = this;
            var model = this.editor.getModel();
            this.editor.changeDecorations(function (changeAccessor) {
                _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, []);
            });
            if (matches.length) {
                this.editor.changeDecorations(function (changeAccessor) {
                    _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, matches.map(function (match) { return _this.createDecoration(match, model); }));
                });
            }
        };
        HighlightMatchesRenderer.prototype.createDecoration = function (range, model) {
            return {
                range: range,
                options: HighlightMatchesRenderer._FIND_MATCH
            };
        };
        HighlightMatchesRenderer.prototype.dispose = function () {
            var _this = this;
            if (this.decorationIds) {
                this.decorationIds = this.editor.changeDecorations(function (changeAccessor) {
                    return changeAccessor.deltaDecorations(_this.decorationIds, []);
                });
            }
            _super.prototype.dispose.call(this);
        };
        HighlightMatchesRenderer._FIND_MATCH = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'findMatch'
        });
        HighlightMatchesRenderer = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], HighlightMatchesRenderer);
        return HighlightMatchesRenderer;
    }(lifecycle_1.Disposable));
    exports.HighlightMatchesRenderer = HighlightMatchesRenderer;
    var EditSettingRenderer = (function (_super) {
        __extends(EditSettingRenderer, _super);
        function EditSettingRenderer(editor, masterSettingsModel, settingHighlighter, preferencesService, instantiationService, contextMenuService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.masterSettingsModel = masterSettingsModel;
            _this.settingHighlighter = settingHighlighter;
            _this.preferencesService = preferencesService;
            _this.instantiationService = instantiationService;
            _this.contextMenuService = contextMenuService;
            _this._onUpdateSetting = new event_1.Emitter();
            _this.onUpdateSetting = _this._onUpdateSetting.event;
            _this.editPreferenceWidgetForCusorPosition = _this._register(_this.instantiationService.createInstance(preferencesWidgets_1.EditPreferenceWidget, editor));
            _this.editPreferenceWidgetForMouseMove = _this._register(_this.instantiationService.createInstance(preferencesWidgets_1.EditPreferenceWidget, editor));
            _this.toggleEditPreferencesForMouseMoveDelayer = new async_1.Delayer(75);
            _this._register(_this.editPreferenceWidgetForCusorPosition.onClick(function (e) { return _this.onEditSettingClicked(_this.editPreferenceWidgetForCusorPosition, e); }));
            _this._register(_this.editPreferenceWidgetForMouseMove.onClick(function (e) { return _this.onEditSettingClicked(_this.editPreferenceWidgetForMouseMove, e); }));
            _this._register(_this.editor.onDidChangeCursorPosition(function (positionChangeEvent) { return _this.onPositionChanged(positionChangeEvent); }));
            _this._register(_this.editor.onMouseMove(function (mouseMoveEvent) { return _this.onMouseMoved(mouseMoveEvent); }));
            _this._register(_this.editor.onDidChangeConfiguration(function () { return _this.onConfigurationChanged(); }));
            return _this;
        }
        EditSettingRenderer.prototype.render = function (settingsGroups, associatedPreferencesModel) {
            this.editPreferenceWidgetForCusorPosition.hide();
            this.editPreferenceWidgetForMouseMove.hide();
            this.settingsGroups = settingsGroups;
            this.associatedPreferencesModel = associatedPreferencesModel;
            var settings = this.getSettings(this.editor.getPosition().lineNumber);
            if (settings.length) {
                this.showEditPreferencesWidget(this.editPreferenceWidgetForCusorPosition, settings);
            }
        };
        EditSettingRenderer.prototype.isDefaultSettings = function () {
            return this.masterSettingsModel instanceof preferencesModels_1.DefaultSettingsEditorModel;
        };
        EditSettingRenderer.prototype.onConfigurationChanged = function () {
            if (!this.editor.getConfiguration().viewInfo.glyphMargin) {
                this.editPreferenceWidgetForCusorPosition.hide();
                this.editPreferenceWidgetForMouseMove.hide();
            }
        };
        EditSettingRenderer.prototype.onPositionChanged = function (positionChangeEvent) {
            this.editPreferenceWidgetForMouseMove.hide();
            var settings = this.getSettings(positionChangeEvent.position.lineNumber);
            if (settings.length) {
                this.showEditPreferencesWidget(this.editPreferenceWidgetForCusorPosition, settings);
            }
            else {
                this.editPreferenceWidgetForCusorPosition.hide();
            }
        };
        EditSettingRenderer.prototype.onMouseMoved = function (mouseMoveEvent) {
            var _this = this;
            var editPreferenceWidget = this.getEditPreferenceWidgetUnderMouse(mouseMoveEvent);
            if (editPreferenceWidget) {
                this.onMouseOver(editPreferenceWidget);
                return;
            }
            this.settingHighlighter.clear();
            this.toggleEditPreferencesForMouseMoveDelayer.trigger(function () { return _this.toggleEidtPreferenceWidgetForMouseMove(mouseMoveEvent); });
        };
        EditSettingRenderer.prototype.getEditPreferenceWidgetUnderMouse = function (mouseMoveEvent) {
            if (mouseMoveEvent.target.type === editorBrowser_1.MouseTargetType.GUTTER_GLYPH_MARGIN) {
                var line = mouseMoveEvent.target.position.lineNumber;
                if (this.editPreferenceWidgetForMouseMove.getLine() === line && this.editPreferenceWidgetForMouseMove.isVisible()) {
                    return this.editPreferenceWidgetForMouseMove;
                }
                if (this.editPreferenceWidgetForCusorPosition.getLine() === line && this.editPreferenceWidgetForCusorPosition.isVisible()) {
                    return this.editPreferenceWidgetForCusorPosition;
                }
            }
            return null;
        };
        EditSettingRenderer.prototype.toggleEidtPreferenceWidgetForMouseMove = function (mouseMoveEvent) {
            var settings = mouseMoveEvent.target.position ? this.getSettings(mouseMoveEvent.target.position.lineNumber) : null;
            if (settings && settings.length) {
                this.showEditPreferencesWidget(this.editPreferenceWidgetForMouseMove, settings);
            }
            else {
                this.editPreferenceWidgetForMouseMove.hide();
            }
        };
        EditSettingRenderer.prototype.showEditPreferencesWidget = function (editPreferencesWidget, settings) {
            var line = settings[0].valueRange.startLineNumber;
            if (this.editor.getConfiguration().viewInfo.glyphMargin && this.marginFreeFromOtherDecorations(line)) {
                editPreferencesWidget.show(line, nls.localize('editTtile', "Edit"), settings);
                var editPreferenceWidgetToHide = editPreferencesWidget === this.editPreferenceWidgetForCusorPosition ? this.editPreferenceWidgetForMouseMove : this.editPreferenceWidgetForCusorPosition;
                editPreferenceWidgetToHide.hide();
            }
        };
        EditSettingRenderer.prototype.marginFreeFromOtherDecorations = function (line) {
            var decorations = this.editor.getLineDecorations(line);
            if (decorations) {
                for (var _i = 0, decorations_1 = decorations; _i < decorations_1.length; _i++) {
                    var options = decorations_1[_i].options;
                    if (options.glyphMarginClassName && options.glyphMarginClassName.indexOf(preferencesWidgets_1.EditPreferenceWidget.GLYPH_MARGIN_CLASS_NAME) === -1) {
                        return false;
                    }
                }
            }
            return true;
        };
        EditSettingRenderer.prototype.getSettings = function (lineNumber) {
            var _this = this;
            var configurationMap = this.getConfigurationsMap();
            return this.getSettingsAtLineNumber(lineNumber).filter(function (setting) {
                var configurationNode = configurationMap[setting.key];
                if (configurationNode) {
                    if (_this.isDefaultSettings()) {
                        return true;
                    }
                    if (configurationNode.type === 'boolean' || configurationNode.enum) {
                        if (_this.masterSettingsModel.configurationTarget !== configurationEditing_1.ConfigurationTarget.FOLDER) {
                            return true;
                        }
                        if (configurationNode.scope === configurationRegistry_1.ConfigurationScope.RESOURCE) {
                            return true;
                        }
                    }
                }
                return false;
            });
        };
        EditSettingRenderer.prototype.getSettingsAtLineNumber = function (lineNumber) {
            var settings = [];
            for (var _i = 0, _a = this.settingsGroups; _i < _a.length; _i++) {
                var group = _a[_i];
                if (group.range.startLineNumber > lineNumber) {
                    break;
                }
                if (lineNumber >= group.range.startLineNumber && lineNumber <= group.range.endLineNumber) {
                    for (var _b = 0, _c = group.sections; _b < _c.length; _b++) {
                        var section = _c[_b];
                        for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                            var setting = _e[_d];
                            if (setting.range.startLineNumber > lineNumber) {
                                break;
                            }
                            if (lineNumber >= setting.range.startLineNumber && lineNumber <= setting.range.endLineNumber) {
                                if (!this.isDefaultSettings() && setting.overrides.length) {
                                    // Only one level because override settings cannot have override settings
                                    for (var _f = 0, _g = setting.overrides; _f < _g.length; _f++) {
                                        var overrideSetting = _g[_f];
                                        if (lineNumber >= overrideSetting.range.startLineNumber && lineNumber <= overrideSetting.range.endLineNumber) {
                                            settings.push(overrideSetting);
                                        }
                                    }
                                }
                                else {
                                    settings.push(setting);
                                }
                            }
                        }
                    }
                }
            }
            return settings;
        };
        EditSettingRenderer.prototype.onMouseOver = function (editPreferenceWidget) {
            this.settingHighlighter.highlight(editPreferenceWidget.preferences[0]);
        };
        EditSettingRenderer.prototype.onEditSettingClicked = function (editPreferenceWidget, e) {
            var _this = this;
            var anchor = { x: e.event.posx + 1, y: e.event.posy + 10 };
            var actions = this.getSettings(editPreferenceWidget.getLine()).length === 1 ? this.getActions(editPreferenceWidget.preferences[0], this.getConfigurationsMap()[editPreferenceWidget.preferences[0].key])
                : editPreferenceWidget.preferences.map(function (setting) { return new contextView_1.ContextSubMenu(setting.key, _this.getActions(setting, _this.getConfigurationsMap()[setting.key])); });
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () { return winjs_base_1.TPromise.wrap(actions); }
            });
        };
        EditSettingRenderer.prototype.getConfigurationsMap = function () {
            return platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        };
        EditSettingRenderer.prototype.getActions = function (setting, jsonSchema) {
            var _this = this;
            if (jsonSchema.type === 'boolean') {
                return [{
                        id: 'truthyValue',
                        label: 'true',
                        enabled: true,
                        run: function () { return _this.updateSetting(setting.key, true, setting); }
                    }, {
                        id: 'falsyValue',
                        label: 'false',
                        enabled: true,
                        run: function () { return _this.updateSetting(setting.key, false, setting); }
                    }];
            }
            if (jsonSchema.enum) {
                return jsonSchema.enum.map(function (value) {
                    return {
                        id: value,
                        label: JSON.stringify(value),
                        enabled: true,
                        run: function () { return _this.updateSetting(setting.key, value, setting); }
                    };
                });
            }
            return this.getDefaultActions(setting);
        };
        EditSettingRenderer.prototype.getDefaultActions = function (setting) {
            var _this = this;
            var settingInOtherModel = this.associatedPreferencesModel.getPreference(setting.key);
            if (this.isDefaultSettings()) {
                return [{
                        id: 'setDefaultValue',
                        label: settingInOtherModel ? nls.localize('replaceDefaultValue', "Replace in Settings") : nls.localize('copyDefaultValue', "Copy to Settings"),
                        enabled: true,
                        run: function () { return _this.updateSetting(setting.key, setting.value, setting); }
                    }];
            }
            return [];
        };
        EditSettingRenderer.prototype.updateSetting = function (key, value, source) {
            this._onUpdateSetting.fire({ key: key, value: value, source: source });
        };
        EditSettingRenderer = __decorate([
            __param(3, preferences_1.IPreferencesService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, contextView_1.IContextMenuService)
        ], EditSettingRenderer);
        return EditSettingRenderer;
    }(lifecycle_1.Disposable));
    var SettingHighlighter = (function (_super) {
        __extends(SettingHighlighter, _super);
        function SettingHighlighter(editor, focusEventEmitter, clearFocusEventEmitter, instantiationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.focusEventEmitter = focusEventEmitter;
            _this.clearFocusEventEmitter = clearFocusEventEmitter;
            _this.fixedHighlighter = _this._register(instantiationService.createInstance(rangeDecorations_1.RangeHighlightDecorations));
            _this.volatileHighlighter = _this._register(instantiationService.createInstance(rangeDecorations_1.RangeHighlightDecorations));
            _this.fixedHighlighter.onHighlghtRemoved(function () { return _this.clearFocusEventEmitter.fire(_this.highlightedSetting); });
            _this.volatileHighlighter.onHighlghtRemoved(function () { return _this.clearFocusEventEmitter.fire(_this.highlightedSetting); });
            return _this;
        }
        SettingHighlighter.prototype.highlight = function (setting, fix) {
            if (fix === void 0) { fix = false; }
            this.highlightedSetting = setting;
            this.volatileHighlighter.removeHighlightRange();
            this.fixedHighlighter.removeHighlightRange();
            var highlighter = fix ? this.fixedHighlighter : this.volatileHighlighter;
            highlighter.highlightRange({
                range: setting.valueRange,
                resource: this.editor.getModel().uri
            }, this.editor);
            this.editor.revealLinesInCenterIfOutsideViewport(setting.valueRange.startLineNumber, setting.valueRange.endLineNumber - 1);
            this.focusEventEmitter.fire(setting);
        };
        SettingHighlighter.prototype.clear = function (fix) {
            if (fix === void 0) { fix = false; }
            this.volatileHighlighter.removeHighlightRange();
            if (fix) {
                this.fixedHighlighter.removeHighlightRange();
            }
            this.clearFocusEventEmitter.fire(this.highlightedSetting);
        };
        SettingHighlighter = __decorate([
            __param(3, instantiation_1.IInstantiationService)
        ], SettingHighlighter);
        return SettingHighlighter;
    }(lifecycle_1.Disposable));
    var UnsupportedWorkspaceSettingsRenderer = (function (_super) {
        __extends(UnsupportedWorkspaceSettingsRenderer, _super);
        function UnsupportedWorkspaceSettingsRenderer(editor, workspaceSettingsEditorModel, configurationService, markerService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.workspaceSettingsEditorModel = workspaceSettingsEditorModel;
            _this.configurationService = configurationService;
            _this.markerService = markerService;
            _this._register(_this.configurationService.onDidUpdateConfiguration(function () { return _this.render(); }));
            return _this;
        }
        UnsupportedWorkspaceSettingsRenderer.prototype.getMarkerMessage = function (settingKey) {
            switch (settingKey) {
                case 'php.validate.executablePath':
                    return nls.localize('unsupportedPHPExecutablePathSetting', "This setting must be a User Setting. To configure PHP for the workspace, open a PHP file and click on 'PHP Path' in the status bar.");
                default:
                    return nls.localize('unsupportedWorkspaceSetting', "This setting must be a User Setting.");
            }
        };
        UnsupportedWorkspaceSettingsRenderer.prototype.render = function () {
            var unsupportedWorkspaceKeys = this.configurationService.getUnsupportedWorkspaceKeys();
            if (unsupportedWorkspaceKeys.length) {
                var markerData = [];
                for (var _i = 0, unsupportedWorkspaceKeys_1 = unsupportedWorkspaceKeys; _i < unsupportedWorkspaceKeys_1.length; _i++) {
                    var unsupportedKey = unsupportedWorkspaceKeys_1[_i];
                    var setting = this.workspaceSettingsEditorModel.getPreference(unsupportedKey);
                    if (setting) {
                        markerData.push({
                            severity: message_1.Severity.Warning,
                            startLineNumber: setting.keyRange.startLineNumber,
                            startColumn: setting.keyRange.startColumn,
                            endLineNumber: setting.keyRange.endLineNumber,
                            endColumn: setting.keyRange.endColumn,
                            message: this.getMarkerMessage(unsupportedKey)
                        });
                    }
                }
                if (markerData.length) {
                    this.markerService.changeOne('preferencesEditor', this.workspaceSettingsEditorModel.uri, markerData);
                }
                else {
                    this.markerService.remove('preferencesEditor', [this.workspaceSettingsEditorModel.uri]);
                }
            }
        };
        UnsupportedWorkspaceSettingsRenderer.prototype.dispose = function () {
            this.markerService.remove('preferencesEditor', [this.workspaceSettingsEditorModel.uri]);
            _super.prototype.dispose.call(this);
        };
        UnsupportedWorkspaceSettingsRenderer = __decorate([
            __param(2, configuration_1.IWorkspaceConfigurationService),
            __param(3, markers_1.IMarkerService)
        ], UnsupportedWorkspaceSettingsRenderer);
        return UnsupportedWorkspaceSettingsRenderer;
    }(lifecycle_1.Disposable));
    var UnsupportedWorkbenchSettingsRenderer = (function (_super) {
        __extends(UnsupportedWorkbenchSettingsRenderer, _super);
        function UnsupportedWorkbenchSettingsRenderer(editor, workspaceSettingsEditorModel, configurationService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.workspaceSettingsEditorModel = workspaceSettingsEditorModel;
            _this.configurationService = configurationService;
            _this.decorationIds = [];
            _this.renderingDelayer = new async_1.Delayer(200);
            _this._register(_this.editor.getModel().onDidChangeContent(function () { return _this.renderingDelayer.trigger(function () { return _this.render(); }); }));
            return _this;
        }
        UnsupportedWorkbenchSettingsRenderer.prototype.render = function () {
            var _this = this;
            var ranges = [];
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
            for (var _i = 0, _a = this.workspaceSettingsEditorModel.settingsGroups; _i < _a.length; _i++) {
                var settingsGroup = _a[_i];
                for (var _b = 0, _c = settingsGroup.sections; _b < _c.length; _b++) {
                    var section = _c[_b];
                    for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                        var setting = _e[_d];
                        if (configurationRegistry[setting.key] && configurationRegistry[setting.key].scope === configurationRegistry_1.ConfigurationScope.WINDOW) {
                            ranges.push({
                                startLineNumber: setting.keyRange.startLineNumber,
                                startColumn: setting.keyRange.startColumn - 1,
                                endLineNumber: setting.valueRange.endLineNumber,
                                endColumn: setting.valueRange.endColumn
                            });
                        }
                    }
                }
            }
            this.editor.changeDecorations(function (changeAccessor) { return _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, ranges.map(function (range) { return _this.createDecoration(range, _this.editor.getModel()); })); });
        };
        UnsupportedWorkbenchSettingsRenderer.prototype.createDecoration = function (range, model) {
            return {
                range: range,
                options: UnsupportedWorkbenchSettingsRenderer._DIM_CONFIGUARATION_
            };
        };
        UnsupportedWorkbenchSettingsRenderer.prototype.dispose = function () {
            var _this = this;
            if (this.decorationIds) {
                this.decorationIds = this.editor.changeDecorations(function (changeAccessor) {
                    return changeAccessor.deltaDecorations(_this.decorationIds, []);
                });
            }
            _super.prototype.dispose.call(this);
        };
        UnsupportedWorkbenchSettingsRenderer._DIM_CONFIGUARATION_ = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            inlineClassName: 'dim-configuration',
            beforeContentClassName: 'unsupportedWorkbenhSettingInfo',
            hoverMessage: new htmlContent_1.MarkdownString().appendText(nls.localize('unsupportedWorkbenchSetting', "This setting cannot be applied now. It will be applied when you open this folder directly."))
        });
        UnsupportedWorkbenchSettingsRenderer = __decorate([
            __param(2, configuration_1.IWorkspaceConfigurationService)
        ], UnsupportedWorkbenchSettingsRenderer);
        return UnsupportedWorkbenchSettingsRenderer;
    }(lifecycle_1.Disposable));
    var WorkspaceConfigurationRenderer = (function (_super) {
        __extends(WorkspaceConfigurationRenderer, _super);
        function WorkspaceConfigurationRenderer(editor, workspaceSettingsEditorModel, workspaceContextService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.workspaceSettingsEditorModel = workspaceSettingsEditorModel;
            _this.workspaceContextService = workspaceContextService;
            _this.decorationIds = [];
            _this.renderingDelayer = new async_1.Delayer(200);
            _this._register(_this.editor.getModel().onDidChangeContent(function () { return _this.renderingDelayer.trigger(function () { return _this.render(); }); }));
            return _this;
        }
        WorkspaceConfigurationRenderer.prototype.render = function () {
            var _this = this;
            if (this.workspaceContextService.hasMultiFolderWorkspace()) {
                this.editor.changeDecorations(function (changeAccessor) { return _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, []); });
                var ranges_1 = [];
                for (var _i = 0, _a = this.workspaceSettingsEditorModel.settingsGroups; _i < _a.length; _i++) {
                    var settingsGroup = _a[_i];
                    for (var _b = 0, _c = settingsGroup.sections; _b < _c.length; _b++) {
                        var section = _c[_b];
                        for (var _d = 0, _e = section.settings; _d < _e.length; _d++) {
                            var setting = _e[_d];
                            if (setting.key !== 'settings') {
                                ranges_1.push({
                                    startLineNumber: setting.keyRange.startLineNumber,
                                    startColumn: setting.keyRange.startColumn - 1,
                                    endLineNumber: setting.valueRange.endLineNumber,
                                    endColumn: setting.valueRange.endColumn
                                });
                            }
                        }
                    }
                }
                this.editor.changeDecorations(function (changeAccessor) { return _this.decorationIds = changeAccessor.deltaDecorations(_this.decorationIds, ranges_1.map(function (range) { return _this.createDecoration(range, _this.editor.getModel()); })); });
            }
        };
        WorkspaceConfigurationRenderer.prototype.createDecoration = function (range, model) {
            return {
                range: range,
                options: WorkspaceConfigurationRenderer._DIM_CONFIGURATION_
            };
        };
        WorkspaceConfigurationRenderer.prototype.dispose = function () {
            var _this = this;
            if (this.decorationIds) {
                this.decorationIds = this.editor.changeDecorations(function (changeAccessor) {
                    return changeAccessor.deltaDecorations(_this.decorationIds, []);
                });
            }
            _super.prototype.dispose.call(this);
        };
        WorkspaceConfigurationRenderer._DIM_CONFIGURATION_ = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            inlineClassName: 'dim-configuration'
        });
        WorkspaceConfigurationRenderer = __decorate([
            __param(2, workspace_1.IWorkspaceContextService)
        ], WorkspaceConfigurationRenderer);
        return WorkspaceConfigurationRenderer;
    }(lifecycle_1.Disposable));
});
//# sourceMappingURL=preferencesRenderers.js.map