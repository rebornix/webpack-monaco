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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/browser/dom", "vs/base/common/async", "vs/base/browser/builder", "vs/base/common/iterator", "vs/base/common/lifecycle", "vs/workbench/common/editor", "vs/workbench/browser/parts/editor/baseEditor", "vs/workbench/common/editor/resourceEditorInput", "vs/workbench/browser/parts/editor/textEditor", "vs/editor/browser/codeEditor", "vs/platform/instantiation/common/instantiation", "vs/workbench/parts/preferences/common/preferences", "vs/workbench/parts/preferences/common/preferencesModels", "vs/editor/browser/editorBrowserExtensions", "vs/workbench/parts/preferences/browser/preferencesWidgets", "vs/platform/contextkey/common/contextkey", "vs/editor/common/editorCommonExtensions", "vs/platform/telemetry/common/telemetry", "vs/platform/theme/common/themeService", "vs/editor/common/services/modelService", "vs/editor/common/services/modeService", "vs/platform/storage/common/storage", "vs/editor/common/services/resourceConfiguration", "vs/workbench/services/editor/common/editorService", "vs/editor/common/services/resolverService", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/environment/common/environment", "vs/base/browser/ui/sash/sash", "vs/base/browser/ui/widget", "vs/workbench/parts/preferences/browser/preferencesRenderers", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/services/group/common/groupService", "vs/editor/common/services/codeEditorService", "vs/editor/contrib/folding/browser/folding", "vs/editor/contrib/find/browser/find", "vs/editor/contrib/find/common/findController", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/theme/common/styler", "vs/platform/theme/common/colorRegistry", "vs/platform/workspace/common/workspace", "vs/base/common/event", "vs/platform/registry/common/platform"], function (require, exports, winjs_base_1, nls, DOM, async_1, builder_1, iterator_1, lifecycle_1, editor_1, baseEditor_1, resourceEditorInput_1, textEditor_1, codeEditor_1, instantiation_1, preferences_1, preferencesModels_1, editorBrowserExtensions_1, preferencesWidgets_1, contextkey_1, editorCommonExtensions_1, telemetry_1, themeService_1, modelService_1, modeService_1, storage_1, resourceConfiguration_1, editorService_1, resolverService_1, configurationEditing_1, environment_1, sash_1, widget_1, preferencesRenderers_1, textfiles_1, groupService_1, codeEditorService_1, folding_1, find_1, findController_1, keybindingsRegistry_1, styler_1, colorRegistry_1, workspace_1, event_1, platform_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PreferencesEditorInput = (function (_super) {
        __extends(PreferencesEditorInput, _super);
        function PreferencesEditorInput() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PreferencesEditorInput.prototype.getTypeId = function () {
            return PreferencesEditorInput.ID;
        };
        PreferencesEditorInput.prototype.getTitle = function (verbosity) {
            return this.master.getTitle(verbosity);
        };
        PreferencesEditorInput.ID = 'workbench.editorinputs.preferencesEditorInput';
        return PreferencesEditorInput;
    }(editor_1.SideBySideEditorInput));
    exports.PreferencesEditorInput = PreferencesEditorInput;
    var DefaultPreferencesEditorInput = (function (_super) {
        __extends(DefaultPreferencesEditorInput, _super);
        function DefaultPreferencesEditorInput(defaultSettingsResource, textModelResolverService) {
            return _super.call(this, nls.localize('settingsEditorName', "Default Settings"), '', defaultSettingsResource, textModelResolverService) || this;
        }
        DefaultPreferencesEditorInput.prototype.getTypeId = function () {
            return DefaultPreferencesEditorInput.ID;
        };
        DefaultPreferencesEditorInput.prototype.matches = function (other) {
            if (!_super.prototype.matches.call(this, other)) {
                return false;
            }
            if (!(other instanceof DefaultPreferencesEditorInput)) {
                return false;
            }
            return true;
        };
        DefaultPreferencesEditorInput.ID = 'workbench.editorinputs.defaultpreferences';
        DefaultPreferencesEditorInput = __decorate([
            __param(1, resolverService_1.ITextModelService)
        ], DefaultPreferencesEditorInput);
        return DefaultPreferencesEditorInput;
    }(resourceEditorInput_1.ResourceEditorInput));
    exports.DefaultPreferencesEditorInput = DefaultPreferencesEditorInput;
    var PreferencesEditor = (function (_super) {
        __extends(PreferencesEditor, _super);
        function PreferencesEditor(preferencesService, environmentService, telemetryService, editorService, contextKeyService, instantiationService, themeService, workspaceContextService) {
            var _this = _super.call(this, PreferencesEditor.ID, telemetryService, themeService) || this;
            _this.preferencesService = preferencesService;
            _this.environmentService = environmentService;
            _this.editorService = editorService;
            _this.contextKeyService = contextKeyService;
            _this.instantiationService = instantiationService;
            _this.workspaceContextService = workspaceContextService;
            _this.latestEmptyFilters = [];
            _this.lastFocusedWidget = null;
            _this.defaultSettingsEditorContextKey = preferences_1.CONTEXT_SETTINGS_EDITOR.bindTo(_this.contextKeyService);
            _this.focusSettingsContextKey = preferences_1.CONTEXT_SETTINGS_SEARCH_FOCUS.bindTo(_this.contextKeyService);
            _this.delayedFilterLogging = new async_1.Delayer(1000);
            return _this;
        }
        PreferencesEditor.prototype.createEditor = function (parent) {
            var _this = this;
            var parentElement = parent.getHTMLElement();
            DOM.addClass(parentElement, 'preferences-editor');
            this.headerContainer = DOM.append(parentElement, DOM.$('.preferences-header'));
            this.searchWidget = this._register(this.instantiationService.createInstance(preferencesWidgets_1.SearchWidget, this.headerContainer, {
                ariaLabel: nls.localize('SearchSettingsWidget.AriaLabel', "Search settings"),
                placeholder: nls.localize('SearchSettingsWidget.Placeholder', "Search Settings"),
                focusKey: this.focusSettingsContextKey
            }));
            this._register(this.searchWidget.onDidChange(function (value) { return _this.filterPreferences(value.trim()); }));
            this._register(this.searchWidget.onNavigate(function (shift) { return _this.preferencesRenderers.focusNextPreference(!shift); }));
            this._register(this.searchWidget.onFocus(function () { return _this.lastFocusedWidget = _this.searchWidget; }));
            this.lastFocusedWidget = this.searchWidget;
            this.settingsTargetsWidget = this._register(this.instantiationService.createInstance(preferencesWidgets_1.SettingsTargetsWidget, this.headerContainer, this.preferencesService.userSettingsResource, configurationEditing_1.ConfigurationTarget.USER));
            this._register(this.settingsTargetsWidget.onDidTargetChange(function (target) { return _this.switchSettings(target); }));
            var editorsContainer = DOM.append(parentElement, DOM.$('.preferences-editors-container'));
            this.sideBySidePreferencesWidget = this._register(this.instantiationService.createInstance(SideBySidePreferencesWidget, editorsContainer));
            this._register(this.sideBySidePreferencesWidget.onFocus(function () { return _this.lastFocusedWidget = _this.sideBySidePreferencesWidget; }));
            this.preferencesRenderers = this._register(new PreferencesRenderers());
        };
        PreferencesEditor.prototype.setInput = function (newInput, options) {
            var _this = this;
            this.defaultSettingsEditorContextKey.set(true);
            var oldInput = this.input;
            return _super.prototype.setInput.call(this, newInput, options).then(function () { return _this.updateInput(oldInput, newInput, options); });
        };
        PreferencesEditor.prototype.layout = function (dimension) {
            DOM.toggleClass(this.headerContainer, 'vertical-layout', dimension.width < 700);
            this.searchWidget.layout(dimension);
            var headerHeight = DOM.getTotalHeight(this.headerContainer);
            this.sideBySidePreferencesWidget.layout(new builder_1.Dimension(dimension.width, dimension.height - headerHeight));
        };
        PreferencesEditor.prototype.getControl = function () {
            return this.sideBySidePreferencesWidget.getControl();
        };
        PreferencesEditor.prototype.focus = function () {
            if (this.lastFocusedWidget) {
                this.lastFocusedWidget.focus();
            }
        };
        PreferencesEditor.prototype.focusSearch = function (filter) {
            if (filter) {
                this.searchWidget.setValue(filter);
            }
            this.searchWidget.focus();
        };
        PreferencesEditor.prototype.focusSettingsFileEditor = function () {
            if (this.sideBySidePreferencesWidget) {
                this.sideBySidePreferencesWidget.focus();
            }
        };
        PreferencesEditor.prototype.clearInput = function () {
            this.defaultSettingsEditorContextKey.set(false);
            this.sideBySidePreferencesWidget.clearInput();
            _super.prototype.clearInput.call(this);
        };
        PreferencesEditor.prototype.setEditorVisible = function (visible, position) {
            this.sideBySidePreferencesWidget.setEditorVisible(visible, position);
            _super.prototype.setEditorVisible.call(this, visible, position);
        };
        PreferencesEditor.prototype.changePosition = function (position) {
            this.sideBySidePreferencesWidget.changePosition(position);
            _super.prototype.changePosition.call(this, position);
        };
        PreferencesEditor.prototype.updateInput = function (oldInput, newInput, options) {
            var _this = this;
            var resource = editor_1.toResource(newInput.master);
            this.settingsTargetsWidget.setTarget(resource, this.getSettingsConfigurationTarget(resource));
            return this.sideBySidePreferencesWidget.setInput(newInput.details, newInput.master, options).then(function (_a) {
                var defaultPreferencesRenderer = _a.defaultPreferencesRenderer, editablePreferencesRenderer = _a.editablePreferencesRenderer;
                _this.preferencesRenderers.defaultPreferencesRenderer = defaultPreferencesRenderer;
                _this.preferencesRenderers.editablePreferencesRenderer = editablePreferencesRenderer;
                _this.filterPreferences(_this.searchWidget.getValue());
            });
        };
        PreferencesEditor.prototype.getSettingsConfigurationTarget = function (resource) {
            if (this.preferencesService.userSettingsResource.fsPath === resource.fsPath) {
                return configurationEditing_1.ConfigurationTarget.USER;
            }
            if (this.preferencesService.workspaceSettingsResource.fsPath === resource.fsPath) {
                return configurationEditing_1.ConfigurationTarget.WORKSPACE;
            }
            if (this.workspaceContextService.getRoot(resource)) {
                return configurationEditing_1.ConfigurationTarget.FOLDER;
            }
            return null;
        };
        PreferencesEditor.prototype.switchSettings = function (resource) {
            var _this = this;
            // Focus the editor if this editor is not active editor
            if (this.editorService.getActiveEditor() !== this) {
                this.focus();
            }
            var promise = this.input.isDirty() ? this.input.save() : winjs_base_1.TPromise.as(true);
            promise.done(function (value) { return _this.preferencesService.switchSettings(_this.getSettingsConfigurationTarget(resource), resource); });
        };
        PreferencesEditor.prototype.filterPreferences = function (filter) {
            var _this = this;
            var count = this.preferencesRenderers.filterPreferences(filter);
            var message = filter ? this.showSearchResultsMessage(count) : nls.localize('totalSettingsMessage', "Total {0} Settings", count);
            this.searchWidget.showMessage(message, count);
            if (count === 0) {
                this.latestEmptyFilters.push(filter);
            }
            this.delayedFilterLogging.trigger(function () { return _this.reportFilteringUsed(filter); });
        };
        PreferencesEditor.prototype.showSearchResultsMessage = function (count) {
            return count === 0 ? nls.localize('noSettingsFound', "No Results") :
                count === 1 ? nls.localize('oneSettingFound', "1 Setting matched") :
                    nls.localize('settingsFound', "{0} Settings matched", count);
        };
        PreferencesEditor.prototype.reportFilteringUsed = function (filter) {
            if (filter) {
                var data = {
                    filter: filter,
                    emptyFilters: this.getLatestEmptyFiltersForTelemetry()
                };
                this.latestEmptyFilters = [];
                this.telemetryService.publicLog('defaultSettings.filter', data);
            }
        };
        /**
         * Put a rough limit on the size of the telemetry data, since otherwise it could be an unbounded large amount
         * of data. 8192 is the max size of a property value. This is rough since that probably includes ""s, etc.
         */
        PreferencesEditor.prototype.getLatestEmptyFiltersForTelemetry = function () {
            var cumulativeSize = 0;
            return this.latestEmptyFilters.filter(function (filterText) { return (cumulativeSize += filterText.length) <= 8192; });
        };
        PreferencesEditor.ID = 'workbench.editor.preferencesEditor';
        PreferencesEditor = __decorate([
            __param(0, preferences_1.IPreferencesService),
            __param(1, environment_1.IEnvironmentService),
            __param(2, telemetry_1.ITelemetryService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, contextkey_1.IContextKeyService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, themeService_1.IThemeService),
            __param(7, workspace_1.IWorkspaceContextService)
        ], PreferencesEditor);
        return PreferencesEditor;
    }(baseEditor_1.BaseEditor));
    exports.PreferencesEditor = PreferencesEditor;
    var SettingsNavigator = (function () {
        function SettingsNavigator(settings) {
            this.iterator = new iterator_1.ArrayNavigator(settings);
        }
        SettingsNavigator.prototype.next = function () {
            return this.iterator.next() || this.iterator.first();
        };
        SettingsNavigator.prototype.previous = function () {
            return this.iterator.previous() || this.iterator.last();
        };
        SettingsNavigator.prototype.parent = function () {
            return this.iterator.parent();
        };
        SettingsNavigator.prototype.first = function () {
            return this.iterator.first();
        };
        SettingsNavigator.prototype.last = function () {
            return this.iterator.last();
        };
        SettingsNavigator.prototype.current = function () {
            return this.iterator.current();
        };
        return SettingsNavigator;
    }());
    var PreferencesRenderers = (function (_super) {
        __extends(PreferencesRenderers, _super);
        function PreferencesRenderers() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._disposables = [];
            return _this;
        }
        Object.defineProperty(PreferencesRenderers.prototype, "defaultPreferencesRenderer", {
            get: function () {
                return this._defaultPreferencesRenderer;
            },
            set: function (defaultPreferencesRenderer) {
                var _this = this;
                if (this._defaultPreferencesRenderer !== defaultPreferencesRenderer) {
                    this._defaultPreferencesRenderer = defaultPreferencesRenderer;
                    this._disposables = lifecycle_1.dispose(this._disposables);
                    this._defaultPreferencesRenderer.onUpdatePreference(function (_a) {
                        var key = _a.key, value = _a.value, source = _a.source;
                        return _this._updatePreference(key, value, source, _this._editablePreferencesRenderer);
                    }, this, this._disposables);
                    this._defaultPreferencesRenderer.onFocusPreference(function (preference) { return _this._focusPreference(preference, _this._editablePreferencesRenderer); }, this, this._disposables);
                    this._defaultPreferencesRenderer.onClearFocusPreference(function (preference) { return _this._clearFocus(preference, _this._editablePreferencesRenderer); }, this, this._disposables);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PreferencesRenderers.prototype, "editablePreferencesRenderer", {
            set: function (editableSettingsRenderer) {
                this._editablePreferencesRenderer = editableSettingsRenderer;
            },
            enumerable: true,
            configurable: true
        });
        PreferencesRenderers.prototype.filterPreferences = function (filter) {
            var defaultPreferencesFilterResult = this._filterPreferences(filter, this._defaultPreferencesRenderer);
            var editablePreferencesFilterResult = this._filterPreferences(filter, this._editablePreferencesRenderer);
            var defaultPreferencesFilteredGroups = defaultPreferencesFilterResult ? defaultPreferencesFilterResult.filteredGroups : this._getAllPreferences(this._defaultPreferencesRenderer);
            var editablePreferencesFilteredGroups = editablePreferencesFilterResult ? editablePreferencesFilterResult.filteredGroups : this._getAllPreferences(this._editablePreferencesRenderer);
            var consolidatedSettings = this._consolidateSettings(editablePreferencesFilteredGroups, defaultPreferencesFilteredGroups);
            this._settingsNavigator = new SettingsNavigator(filter ? consolidatedSettings : []);
            return consolidatedSettings.length;
        };
        PreferencesRenderers.prototype.focusNextPreference = function (forward) {
            if (forward === void 0) { forward = true; }
            var setting = forward ? this._settingsNavigator.next() : this._settingsNavigator.previous();
            this._focusPreference(setting, this._defaultPreferencesRenderer);
            this._focusPreference(setting, this._editablePreferencesRenderer);
        };
        PreferencesRenderers.prototype._getAllPreferences = function (preferencesRenderer) {
            return preferencesRenderer ? preferencesRenderer.preferencesModel.settingsGroups : [];
        };
        PreferencesRenderers.prototype._filterPreferences = function (filter, preferencesRenderer) {
            var filterResult = null;
            if (preferencesRenderer) {
                filterResult = filter ? preferencesRenderer.preferencesModel.filterSettings(filter) : null;
                preferencesRenderer.filterPreferences(filterResult);
            }
            return filterResult;
        };
        PreferencesRenderers.prototype._focusPreference = function (preference, preferencesRenderer) {
            if (preference && preferencesRenderer) {
                preferencesRenderer.focusPreference(preference);
            }
        };
        PreferencesRenderers.prototype._clearFocus = function (preference, preferencesRenderer) {
            if (preference && preferencesRenderer) {
                preferencesRenderer.clearFocus(preference);
            }
        };
        PreferencesRenderers.prototype._updatePreference = function (key, value, source, preferencesRenderer) {
            if (preferencesRenderer) {
                preferencesRenderer.updatePreference(key, value, source);
            }
        };
        PreferencesRenderers.prototype._consolidateSettings = function (editableSettingsGroups, defaultSettingsGroups) {
            var editableSettings = this._flatten(editableSettingsGroups);
            var defaultSettings = this._flatten(defaultSettingsGroups).filter(function (secondarySetting) { return !editableSettings.some(function (primarySetting) { return primarySetting.key === secondarySetting.key; }); });
            return editableSettings.concat(defaultSettings);
        };
        PreferencesRenderers.prototype._flatten = function (settingsGroups) {
            var settings = [];
            for (var _i = 0, settingsGroups_1 = settingsGroups; _i < settingsGroups_1.length; _i++) {
                var group = settingsGroups_1[_i];
                for (var _a = 0, _b = group.sections; _a < _b.length; _a++) {
                    var section = _b[_a];
                    settings.push.apply(settings, section.settings);
                }
            }
            return settings;
        };
        PreferencesRenderers.prototype.dispose = function () {
            lifecycle_1.dispose(this._disposables);
            _super.prototype.dispose.call(this);
        };
        return PreferencesRenderers;
    }(lifecycle_1.Disposable));
    var SideBySidePreferencesWidget = (function (_super) {
        __extends(SideBySidePreferencesWidget, _super);
        function SideBySidePreferencesWidget(parent, instantiationService, themeService) {
            var _this = _super.call(this) || this;
            _this.instantiationService = instantiationService;
            _this.themeService = themeService;
            _this._onFocus = new event_1.Emitter();
            _this.onFocus = _this._onFocus.event;
            _this.create(parent);
            return _this;
        }
        SideBySidePreferencesWidget.prototype.create = function (parentElement) {
            var _this = this;
            DOM.addClass(parentElement, 'side-by-side-preferences-editor');
            this.createSash(parentElement);
            this.defaultPreferencesEditorContainer = DOM.append(parentElement, DOM.$('.default-preferences-editor-container'));
            this.defaultPreferencesEditorContainer.style.position = 'absolute';
            this.defaultPreferencesEditor = this._register(this.instantiationService.createInstance(DefaultPreferencesEditor));
            this.defaultPreferencesEditor.create(new builder_1.Builder(this.defaultPreferencesEditorContainer));
            this.defaultPreferencesEditor.setVisible(true);
            this.defaultPreferencesEditor.getControl().onDidFocusEditor(function () { return _this.lastFocusedEditor = _this.defaultPreferencesEditor; });
            this.editablePreferencesEditorContainer = DOM.append(parentElement, DOM.$('.editable-preferences-editor-container'));
            this.editablePreferencesEditorContainer.style.position = 'absolute';
            this._register(styler_1.attachStylerCallback(this.themeService, { scrollbarShadow: colorRegistry_1.scrollbarShadow }, function (colors) {
                var shadow = colors.scrollbarShadow ? colors.scrollbarShadow.toString() : null;
                if (shadow) {
                    _this.editablePreferencesEditorContainer.style.boxShadow = "-6px 0 5px -5px " + shadow;
                }
                else {
                    _this.editablePreferencesEditorContainer.style.boxShadow = null;
                }
            }));
            var focusTracker = this._register(DOM.trackFocus(parentElement));
            this._register(focusTracker.addFocusListener(function () { return _this._onFocus.fire(); }));
        };
        SideBySidePreferencesWidget.prototype.setInput = function (defaultPreferencesEditorInput, editablePreferencesEditorInput, options) {
            var _this = this;
            return this.getOrCreateEditablePreferencesEditor(editablePreferencesEditorInput)
                .then(function () {
                _this.dolayout(_this.sash.getVerticalSashLeft());
                return winjs_base_1.TPromise.join([_this.updateInput(_this.defaultPreferencesEditor, defaultPreferencesEditorInput, DefaultSettingsEditorContribution.ID, editor_1.toResource(editablePreferencesEditorInput), options),
                    _this.updateInput(_this.editablePreferencesEditor, editablePreferencesEditorInput, SettingsEditorContribution.ID, defaultPreferencesEditorInput.getResource(), options)])
                    .then(function (_a) {
                    var defaultPreferencesRenderer = _a[0], editablePreferencesRenderer = _a[1];
                    return ({ defaultPreferencesRenderer: defaultPreferencesRenderer, editablePreferencesRenderer: editablePreferencesRenderer });
                });
            });
        };
        SideBySidePreferencesWidget.prototype.layout = function (dimension) {
            this.dimension = dimension;
            this.sash.setDimenesion(this.dimension);
        };
        SideBySidePreferencesWidget.prototype.focus = function () {
            if (this.lastFocusedEditor) {
                this.lastFocusedEditor.focus();
            }
        };
        SideBySidePreferencesWidget.prototype.getControl = function () {
            return this.editablePreferencesEditor ? this.editablePreferencesEditor.getControl() : null;
        };
        SideBySidePreferencesWidget.prototype.clearInput = function () {
            if (this.editablePreferencesEditor) {
                this.editablePreferencesEditor.clearInput();
            }
        };
        SideBySidePreferencesWidget.prototype.setEditorVisible = function (visible, position) {
            if (this.editablePreferencesEditor) {
                this.editablePreferencesEditor.setVisible(visible, position);
            }
        };
        SideBySidePreferencesWidget.prototype.changePosition = function (position) {
            if (this.editablePreferencesEditor) {
                this.editablePreferencesEditor.changePosition(position);
            }
        };
        SideBySidePreferencesWidget.prototype.getOrCreateEditablePreferencesEditor = function (editorInput) {
            var _this = this;
            if (this.editablePreferencesEditor) {
                return winjs_base_1.TPromise.as(this.editablePreferencesEditor);
            }
            var descriptor = platform_1.Registry.as(editor_1.Extensions.Editors).getEditor(editorInput);
            return this.instantiationService.createInstance(descriptor)
                .then(function (editor) {
                _this.editablePreferencesEditor = editor;
                _this.editablePreferencesEditor.create(new builder_1.Builder(_this.editablePreferencesEditorContainer));
                _this.editablePreferencesEditor.setVisible(true);
                _this.editablePreferencesEditor.getControl().onDidFocusEditor(function () { return _this.lastFocusedEditor = _this.editablePreferencesEditor; });
                _this.lastFocusedEditor = _this.editablePreferencesEditor;
                return editor;
            });
        };
        SideBySidePreferencesWidget.prototype.updateInput = function (editor, input, editorContributionId, associatedPreferencesModelUri, options) {
            return editor.setInput(input, options)
                .then(function () { return editor.getControl().getContribution(editorContributionId).updatePreferencesRenderer(associatedPreferencesModelUri); });
        };
        SideBySidePreferencesWidget.prototype.createSash = function (parentElement) {
            var _this = this;
            this.sash = this._register(new sash_1.VSash(parentElement, 220));
            this._register(this.sash.onPositionChange(function (position) { return _this.dolayout(position); }));
        };
        SideBySidePreferencesWidget.prototype.dolayout = function (splitPoint) {
            if (!this.editablePreferencesEditor || !this.dimension) {
                return;
            }
            var masterEditorWidth = this.dimension.width - splitPoint;
            var detailsEditorWidth = this.dimension.width - masterEditorWidth;
            this.defaultPreferencesEditorContainer.style.width = detailsEditorWidth + "px";
            this.defaultPreferencesEditorContainer.style.height = this.dimension.height + "px";
            this.defaultPreferencesEditorContainer.style.left = '0px';
            this.editablePreferencesEditorContainer.style.width = masterEditorWidth + "px";
            this.editablePreferencesEditorContainer.style.height = this.dimension.height + "px";
            this.editablePreferencesEditorContainer.style.left = splitPoint + "px";
            this.defaultPreferencesEditor.layout(new builder_1.Dimension(detailsEditorWidth, this.dimension.height));
            this.editablePreferencesEditor.layout(new builder_1.Dimension(masterEditorWidth, this.dimension.height));
        };
        SideBySidePreferencesWidget.prototype.disposeEditors = function () {
            if (this.defaultPreferencesEditor) {
                this.defaultPreferencesEditor.dispose();
                this.defaultPreferencesEditor = null;
            }
            if (this.editablePreferencesEditor) {
                this.editablePreferencesEditor.dispose();
                this.editablePreferencesEditor = null;
            }
        };
        SideBySidePreferencesWidget.prototype.dispose = function () {
            this.disposeEditors();
            _super.prototype.dispose.call(this);
        };
        SideBySidePreferencesWidget = __decorate([
            __param(1, instantiation_1.IInstantiationService), __param(2, themeService_1.IThemeService)
        ], SideBySidePreferencesWidget);
        return SideBySidePreferencesWidget;
    }(widget_1.Widget));
    var EditableSettingsEditor = (function (_super) {
        __extends(EditableSettingsEditor, _super);
        function EditableSettingsEditor(telemetryService, editorService, instantiationService, storageService, configurationService, themeService, preferencesService, modelService, modeService, textFileService, editorGroupService) {
            var _this = _super.call(this, EditableSettingsEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, modeService, textFileService, editorGroupService) || this;
            _this.editorService = editorService;
            _this.preferencesService = preferencesService;
            _this.modelService = modelService;
            _this.modelDisposables = [];
            _this._register({ dispose: function () { return lifecycle_1.dispose(_this.modelDisposables); } });
            _this.saveDelayer = new async_1.Delayer(1000);
            return _this;
        }
        EditableSettingsEditor.prototype.createEditor = function (parent) {
            var _this = this;
            _super.prototype.createEditor.call(this, parent);
            var codeEditor = codeEditorService_1.getCodeEditor(this);
            if (codeEditor) {
                this._register(codeEditor.onDidChangeModel(function () { return _this.onDidModelChange(); }));
            }
        };
        EditableSettingsEditor.prototype.getAriaLabel = function () {
            var input = this.input;
            var inputName = input && input.getName();
            var ariaLabel;
            if (inputName) {
                ariaLabel = nls.localize('fileEditorWithInputAriaLabel', "{0}. Text file editor.", inputName);
            }
            else {
                ariaLabel = nls.localize('fileEditorAriaLabel', "Text file editor.");
            }
            return ariaLabel;
        };
        EditableSettingsEditor.prototype.setInput = function (input, options) {
            var _this = this;
            return _super.prototype.setInput.call(this, input, options)
                .then(function () { return _this.input.resolve()
                .then(function (editorModel) { return editorModel.load(); })
                .then(function (editorModel) { return _this.getControl().setModel(editorModel.textEditorModel); }); });
        };
        EditableSettingsEditor.prototype.clearInput = function () {
            this.modelDisposables = lifecycle_1.dispose(this.modelDisposables);
            _super.prototype.clearInput.call(this);
        };
        EditableSettingsEditor.prototype.onDidModelChange = function () {
            var _this = this;
            this.modelDisposables = lifecycle_1.dispose(this.modelDisposables);
            var model = codeEditorService_1.getCodeEditor(this).getModel();
            if (model) {
                this.preferencesService.createPreferencesEditorModel(model.uri)
                    .then(function (preferencesEditorModel) {
                    var settingsEditorModel = preferencesEditorModel;
                    _this.modelDisposables.push(settingsEditorModel);
                    _this.modelDisposables.push(model.onDidChangeContent(function () { return _this.saveDelayer.trigger(function () { return settingsEditorModel.save(); }); }));
                });
            }
        };
        EditableSettingsEditor.ID = 'workbench.editor.settingsEditor';
        EditableSettingsEditor = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, storage_1.IStorageService),
            __param(4, resourceConfiguration_1.ITextResourceConfigurationService),
            __param(5, themeService_1.IThemeService),
            __param(6, preferences_1.IPreferencesService),
            __param(7, modelService_1.IModelService),
            __param(8, modeService_1.IModeService),
            __param(9, textfiles_1.ITextFileService),
            __param(10, groupService_1.IEditorGroupService)
        ], EditableSettingsEditor);
        return EditableSettingsEditor;
    }(textEditor_1.BaseTextEditor));
    exports.EditableSettingsEditor = EditableSettingsEditor;
    var DefaultPreferencesEditor = (function (_super) {
        __extends(DefaultPreferencesEditor, _super);
        function DefaultPreferencesEditor(telemetryService, editorService, instantiationService, storageService, configurationService, themeService, preferencesService, modelService, modeService, textFileService, editorGroupService) {
            var _this = _super.call(this, DefaultPreferencesEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, modeService, textFileService, editorGroupService) || this;
            _this.editorService = editorService;
            _this.preferencesService = preferencesService;
            _this.modelService = modelService;
            return _this;
        }
        DefaultPreferencesEditor.prototype.createEditorControl = function (parent, configuration) {
            return this.instantiationService.createInstance(DefaultPreferencesCodeEditor, parent.getHTMLElement(), configuration);
        };
        DefaultPreferencesEditor.prototype.getConfigurationOverrides = function () {
            var options = _super.prototype.getConfigurationOverrides.call(this);
            options.readOnly = true;
            if (this.input) {
                options.lineNumbers = 'off';
                options.renderLineHighlight = 'none';
                options.scrollBeyondLastLine = false;
                options.folding = false;
                options.renderWhitespace = 'none';
                options.wordWrap = 'on';
                options.renderIndentGuides = false;
                options.rulers = [];
                options.glyphMargin = true;
                options.minimap = {
                    enabled: false
                };
            }
            return options;
        };
        DefaultPreferencesEditor.prototype.setInput = function (input, options) {
            var _this = this;
            return _super.prototype.setInput.call(this, input, options)
                .then(function () { return _this.input.resolve()
                .then(function (editorModel) { return editorModel.load(); })
                .then(function (editorModel) { return _this.getControl().setModel(editorModel.textEditorModel); }); });
        };
        DefaultPreferencesEditor.prototype.layout = function (dimension) {
            this.getControl().layout(dimension);
        };
        DefaultPreferencesEditor.prototype.getAriaLabel = function () {
            return nls.localize('preferencesAriaLabel', "Default preferences. Readonly text editor.");
        };
        DefaultPreferencesEditor.ID = 'workbench.editor.defaultPreferences';
        DefaultPreferencesEditor = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, storage_1.IStorageService),
            __param(4, resourceConfiguration_1.ITextResourceConfigurationService),
            __param(5, themeService_1.IThemeService),
            __param(6, preferences_1.IPreferencesService),
            __param(7, modelService_1.IModelService),
            __param(8, modeService_1.IModeService),
            __param(9, textfiles_1.ITextFileService),
            __param(10, groupService_1.IEditorGroupService)
        ], DefaultPreferencesEditor);
        return DefaultPreferencesEditor;
    }(textEditor_1.BaseTextEditor));
    exports.DefaultPreferencesEditor = DefaultPreferencesEditor;
    var DefaultPreferencesCodeEditor = (function (_super) {
        __extends(DefaultPreferencesCodeEditor, _super);
        function DefaultPreferencesCodeEditor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultPreferencesCodeEditor.prototype._getContributions = function () {
            var contributions = _super.prototype._getContributions.call(this);
            var skipContributions = [folding_1.FoldingController.prototype, findController_1.SelectionHighlighter.prototype, find_1.FindController.prototype];
            contributions = contributions.filter(function (c) { return skipContributions.indexOf(c.prototype) === -1; });
            contributions.push(DefaultSettingsEditorContribution);
            return contributions;
        };
        return DefaultPreferencesCodeEditor;
    }(codeEditor_1.CodeEditor));
    var AbstractSettingsEditorContribution = (function (_super) {
        __extends(AbstractSettingsEditorContribution, _super);
        function AbstractSettingsEditorContribution(editor, instantiationService, preferencesService, workspaceContextService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.instantiationService = instantiationService;
            _this.preferencesService = preferencesService;
            _this.workspaceContextService = workspaceContextService;
            _this._register(_this.editor.onDidChangeModel(function () { return _this._onModelChanged(); }));
            return _this;
        }
        AbstractSettingsEditorContribution.prototype.updatePreferencesRenderer = function (associatedPreferencesModelUri) {
            var _this = this;
            if (!this.preferencesRendererCreationPromise) {
                this.preferencesRendererCreationPromise = this._createPreferencesRenderer();
            }
            if (this.preferencesRendererCreationPromise) {
                return this._hasAssociatedPreferencesModelChanged(associatedPreferencesModelUri)
                    .then(function (changed) { return changed ? _this._updatePreferencesRenderer(associatedPreferencesModelUri) : _this.preferencesRendererCreationPromise; });
            }
            return winjs_base_1.TPromise.as(null);
        };
        AbstractSettingsEditorContribution.prototype._onModelChanged = function () {
            var model = this.editor.getModel();
            this.disposePreferencesRenderer();
            if (model) {
                this.preferencesRendererCreationPromise = this._createPreferencesRenderer();
            }
        };
        AbstractSettingsEditorContribution.prototype._hasAssociatedPreferencesModelChanged = function (associatedPreferencesModelUri) {
            return this.preferencesRendererCreationPromise.then(function (preferencesRenderer) {
                return !(preferencesRenderer && preferencesRenderer.associatedPreferencesModel && preferencesRenderer.associatedPreferencesModel.uri.fsPath === associatedPreferencesModelUri.fsPath);
            });
        };
        AbstractSettingsEditorContribution.prototype._updatePreferencesRenderer = function (associatedPreferencesModelUri) {
            var _this = this;
            return this.preferencesService.createPreferencesEditorModel(associatedPreferencesModelUri)
                .then(function (associatedPreferencesEditorModel) {
                return _this.preferencesRendererCreationPromise.then(function (preferencesRenderer) {
                    if (preferencesRenderer) {
                        if (preferencesRenderer.associatedPreferencesModel) {
                            preferencesRenderer.associatedPreferencesModel.dispose();
                        }
                        preferencesRenderer.associatedPreferencesModel = associatedPreferencesEditorModel;
                    }
                    return preferencesRenderer;
                });
            });
        };
        AbstractSettingsEditorContribution.prototype.disposePreferencesRenderer = function () {
            if (this.preferencesRendererCreationPromise) {
                this.preferencesRendererCreationPromise.then(function (preferencesRenderer) {
                    if (preferencesRenderer) {
                        if (preferencesRenderer.associatedPreferencesModel) {
                            preferencesRenderer.associatedPreferencesModel.dispose();
                        }
                        preferencesRenderer.dispose();
                    }
                });
            }
        };
        AbstractSettingsEditorContribution.prototype.dispose = function () {
            this.disposePreferencesRenderer();
            _super.prototype.dispose.call(this);
        };
        AbstractSettingsEditorContribution = __decorate([
            __param(1, instantiation_1.IInstantiationService),
            __param(2, preferences_1.IPreferencesService),
            __param(3, workspace_1.IWorkspaceContextService)
        ], AbstractSettingsEditorContribution);
        return AbstractSettingsEditorContribution;
    }(lifecycle_1.Disposable));
    var DefaultSettingsEditorContribution = (function (_super) {
        __extends(DefaultSettingsEditorContribution, _super);
        function DefaultSettingsEditorContribution() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DefaultSettingsEditorContribution.prototype.getId = function () {
            return DefaultSettingsEditorContribution.ID;
        };
        DefaultSettingsEditorContribution.prototype._createPreferencesRenderer = function () {
            var _this = this;
            return this.preferencesService.createPreferencesEditorModel(this.editor.getModel().uri)
                .then(function (editorModel) {
                if (editorModel instanceof preferencesModels_1.DefaultSettingsEditorModel) {
                    var preferencesRenderer = _this.instantiationService.createInstance(preferencesRenderers_1.DefaultSettingsRenderer, _this.editor, editorModel);
                    preferencesRenderer.render();
                    return preferencesRenderer;
                }
                return null;
            });
        };
        DefaultSettingsEditorContribution.ID = 'editor.contrib.defaultsettings';
        return DefaultSettingsEditorContribution;
    }(AbstractSettingsEditorContribution));
    var SettingsEditorContribution = (function (_super) {
        __extends(SettingsEditorContribution, _super);
        function SettingsEditorContribution() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SettingsEditorContribution_1 = SettingsEditorContribution;
        SettingsEditorContribution.prototype.getId = function () {
            return SettingsEditorContribution_1.ID;
        };
        SettingsEditorContribution.prototype._createPreferencesRenderer = function () {
            var _this = this;
            if (this.isSettingsModel()) {
                return winjs_base_1.TPromise.join([this.preferencesService.createPreferencesEditorModel(this.preferencesService.defaultSettingsResource), this.preferencesService.createPreferencesEditorModel(this.editor.getModel().uri)])
                    .then(function (_a) {
                    var defaultSettingsModel = _a[0], settingsModel = _a[1];
                    if (settingsModel instanceof preferencesModels_1.SettingsEditorModel) {
                        switch (settingsModel.configurationTarget) {
                            case configurationEditing_1.ConfigurationTarget.USER:
                                return _this.instantiationService.createInstance(preferencesRenderers_1.UserSettingsRenderer, _this.editor, settingsModel, defaultSettingsModel);
                            case configurationEditing_1.ConfigurationTarget.WORKSPACE:
                                return _this.instantiationService.createInstance(preferencesRenderers_1.WorkspaceSettingsRenderer, _this.editor, settingsModel, defaultSettingsModel);
                            case configurationEditing_1.ConfigurationTarget.FOLDER:
                                return _this.instantiationService.createInstance(preferencesRenderers_1.FolderSettingsRenderer, _this.editor, settingsModel, defaultSettingsModel);
                        }
                    }
                    return null;
                })
                    .then(function (preferencesRenderer) {
                    if (preferencesRenderer) {
                        preferencesRenderer.render();
                    }
                    return preferencesRenderer;
                });
            }
            return null;
        };
        SettingsEditorContribution.prototype.isSettingsModel = function () {
            var model = this.editor.getModel();
            if (!model) {
                return false;
            }
            if (this.preferencesService.userSettingsResource && this.preferencesService.userSettingsResource.fsPath === model.uri.fsPath) {
                return true;
            }
            if (this.preferencesService.workspaceSettingsResource && this.preferencesService.workspaceSettingsResource.fsPath === model.uri.fsPath) {
                return true;
            }
            var workspace = this.workspaceContextService.getWorkspace();
            if (workspace) {
                for (var _i = 0, _a = workspace.roots; _i < _a.length; _i++) {
                    var root = _a[_i];
                    var folderSettingsResource = this.preferencesService.getFolderSettingsResource(root);
                    if (folderSettingsResource && folderSettingsResource.fsPath === model.uri.fsPath) {
                        return true;
                    }
                }
            }
            return false;
        };
        SettingsEditorContribution.ID = 'editor.contrib.settings';
        SettingsEditorContribution = SettingsEditorContribution_1 = __decorate([
            editorBrowserExtensions_1.editorContribution
        ], SettingsEditorContribution);
        return SettingsEditorContribution;
        var SettingsEditorContribution_1;
    }(AbstractSettingsEditorContribution));
    var SettingsCommand = (function (_super) {
        __extends(SettingsCommand, _super);
        function SettingsCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SettingsCommand.prototype.getPreferencesEditor = function (accessor) {
            var activeEditor = accessor.get(editorService_1.IWorkbenchEditorService).getActiveEditor();
            if (activeEditor instanceof PreferencesEditor) {
                return activeEditor;
            }
            return null;
        };
        return SettingsCommand;
    }(editorCommonExtensions_1.Command));
    var StartSearchDefaultSettingsCommand = (function (_super) {
        __extends(StartSearchDefaultSettingsCommand, _super);
        function StartSearchDefaultSettingsCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        StartSearchDefaultSettingsCommand.prototype.runCommand = function (accessor, args) {
            var preferencesEditor = this.getPreferencesEditor(accessor);
            if (preferencesEditor) {
                preferencesEditor.focusSearch();
            }
        };
        return StartSearchDefaultSettingsCommand;
    }(SettingsCommand));
    var command = new StartSearchDefaultSettingsCommand({
        id: preferences_1.SETTINGS_EDITOR_COMMAND_SEARCH,
        precondition: contextkey_1.ContextKeyExpr.and(preferences_1.CONTEXT_SETTINGS_EDITOR),
        kbOpts: { primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */ }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(command.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
    var FocusSettingsFileEditorCommand = (function (_super) {
        __extends(FocusSettingsFileEditorCommand, _super);
        function FocusSettingsFileEditorCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FocusSettingsFileEditorCommand.prototype.runCommand = function (accessor, args) {
            var preferencesEditor = this.getPreferencesEditor(accessor);
            if (preferencesEditor) {
                preferencesEditor.focusSettingsFileEditor();
            }
        };
        return FocusSettingsFileEditorCommand;
    }(SettingsCommand));
    var focusSettingsFileEditorCommand = new FocusSettingsFileEditorCommand({
        id: preferences_1.SETTINGS_EDITOR_COMMAND_FOCUS_FILE,
        precondition: preferences_1.CONTEXT_SETTINGS_SEARCH_FOCUS,
        kbOpts: { primary: 18 /* DownArrow */ }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(focusSettingsFileEditorCommand.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
});
//# sourceMappingURL=preferencesEditor.js.map