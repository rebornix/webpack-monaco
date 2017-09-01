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
define(["require", "exports", "vs/nls", "vs/base/common/uri", "vs/base/browser/dom", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/browser/ui/widget", "vs/base/common/event", "vs/editor/browser/editorBrowser", "vs/editor/common/editorCommon", "vs/base/browser/ui/inputbox/inputBox", "vs/platform/instantiation/common/instantiation", "vs/platform/contextview/browser/contextView", "vs/workbench/parts/preferences/common/preferences", "vs/platform/keybinding/common/keybinding", "vs/platform/workspace/common/workspace", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/base/browser/ui/selectBox/selectBox", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/common/theme", "vs/workbench/services/configuration/common/configurationEditing", "vs/base/common/htmlContent"], function (require, exports, nls_1, uri_1, DOM, winjs_base_1, lifecycle_1, widget_1, event_1, editorBrowser_1, editorCommon, inputBox_1, instantiation_1, contextView_1, preferences_1, keybinding_1, workspace_1, styler_1, themeService_1, colorRegistry_1, selectBox_1, actionbar_1, theme_1, configurationEditing_1, htmlContent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsHeaderWidget = (function (_super) {
        __extends(SettingsHeaderWidget, _super);
        function SettingsHeaderWidget(editor, title) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.title = title;
            _this.create();
            _this._register(_this.editor.onDidChangeConfiguration(function () { return _this.layout(); }));
            _this._register(_this.editor.onDidLayoutChange(function () { return _this.layout(); }));
            return _this;
        }
        Object.defineProperty(SettingsHeaderWidget.prototype, "domNode", {
            get: function () {
                return this._domNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsHeaderWidget.prototype, "heightInLines", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsHeaderWidget.prototype, "afterLineNumber", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        SettingsHeaderWidget.prototype.create = function () {
            var _this = this;
            this._domNode = DOM.$('.settings-header-widget');
            this.titleContainer = DOM.append(this._domNode, DOM.$('.title-container'));
            if (this.title) {
                DOM.append(this.titleContainer, DOM.$('.title')).textContent = this.title;
            }
            this.messageElement = DOM.append(this.titleContainer, DOM.$('.message'));
            if (this.title) {
                this.messageElement.style.paddingLeft = '12px';
            }
            this.editor.changeViewZones(function (accessor) {
                _this.id = accessor.addZone(_this);
                _this.layout();
            });
        };
        SettingsHeaderWidget.prototype.setMessage = function (message) {
            this.messageElement.textContent = message;
        };
        SettingsHeaderWidget.prototype.layout = function () {
            var configuration = this.editor.getConfiguration();
            this.titleContainer.style.fontSize = configuration.fontInfo.fontSize + 'px';
            if (!configuration.contribInfo.folding) {
                this.titleContainer.style.paddingLeft = '12px';
            }
        };
        SettingsHeaderWidget.prototype.dispose = function () {
            var _this = this;
            this.editor.changeViewZones(function (accessor) {
                accessor.removeZone(_this.id);
            });
            _super.prototype.dispose.call(this);
        };
        return SettingsHeaderWidget;
    }(widget_1.Widget));
    exports.SettingsHeaderWidget = SettingsHeaderWidget;
    var SettingsGroupTitleWidget = (function (_super) {
        __extends(SettingsGroupTitleWidget, _super);
        function SettingsGroupTitleWidget(editor, settingsGroup) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.settingsGroup = settingsGroup;
            _this._onToggled = _this._register(new event_1.Emitter());
            _this.onToggled = _this._onToggled.event;
            _this.create();
            _this._register(_this.editor.onDidChangeConfiguration(function () { return _this.layout(); }));
            _this._register(_this.editor.onDidLayoutChange(function () { return _this.layout(); }));
            _this._register(_this.editor.onDidChangeCursorPosition(function (e) { return _this.onCursorChange(e); }));
            return _this;
        }
        Object.defineProperty(SettingsGroupTitleWidget.prototype, "domNode", {
            get: function () {
                return this._domNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsGroupTitleWidget.prototype, "heightInLines", {
            get: function () {
                return 1.5;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SettingsGroupTitleWidget.prototype, "afterLineNumber", {
            get: function () {
                return this._afterLineNumber;
            },
            enumerable: true,
            configurable: true
        });
        SettingsGroupTitleWidget.prototype.create = function () {
            var _this = this;
            this._domNode = DOM.$('.settings-group-title-widget');
            this.titleContainer = DOM.append(this._domNode, DOM.$('.title-container'));
            this.titleContainer.tabIndex = 0;
            this.onclick(this.titleContainer, function () { return _this.toggle(); });
            this.onkeydown(this.titleContainer, function (e) { return _this.onKeyDown(e); });
            var focusTracker = this._register(DOM.trackFocus(this.titleContainer));
            focusTracker.addFocusListener(function () { return _this.toggleFocus(true); });
            focusTracker.addBlurListener(function () { return _this.toggleFocus(false); });
            this.icon = DOM.append(this.titleContainer, DOM.$('.expand-collapse-icon'));
            this.title = DOM.append(this.titleContainer, DOM.$('.title'));
            this.title.textContent = this.settingsGroup.title + (" (" + this.settingsGroup.sections.reduce(function (count, section) { return count + section.settings.length; }, 0) + ")");
            this.layout();
        };
        SettingsGroupTitleWidget.prototype.render = function () {
            var _this = this;
            this._afterLineNumber = this.settingsGroup.range.startLineNumber - 2;
            this.editor.changeViewZones(function (accessor) {
                _this.id = accessor.addZone(_this);
                _this.layout();
            });
        };
        SettingsGroupTitleWidget.prototype.toggleCollapse = function (collapse) {
            DOM.toggleClass(this.titleContainer, 'collapsed', collapse);
        };
        SettingsGroupTitleWidget.prototype.toggleFocus = function (focus) {
            DOM.toggleClass(this.titleContainer, 'focused', focus);
        };
        SettingsGroupTitleWidget.prototype.isCollapsed = function () {
            return DOM.hasClass(this.titleContainer, 'collapsed');
        };
        SettingsGroupTitleWidget.prototype.layout = function () {
            var configuration = this.editor.getConfiguration();
            var layoutInfo = this.editor.getLayoutInfo();
            this._domNode.style.width = layoutInfo.contentWidth - layoutInfo.verticalScrollbarWidth + 'px';
            this.titleContainer.style.lineHeight = configuration.lineHeight + 3 + 'px';
            this.titleContainer.style.height = configuration.lineHeight + 3 + 'px';
            this.titleContainer.style.fontSize = configuration.fontInfo.fontSize + 'px';
            this.icon.style.minWidth = this.getIconSize(16) + "px";
        };
        SettingsGroupTitleWidget.prototype.getIconSize = function (minSize) {
            var fontSize = this.editor.getConfiguration().fontInfo.fontSize;
            return fontSize > 8 ? Math.max(fontSize, minSize) : 12;
        };
        SettingsGroupTitleWidget.prototype.onKeyDown = function (keyboardEvent) {
            switch (keyboardEvent.keyCode) {
                case 3 /* Enter */:
                case 10 /* Space */:
                    this.toggle();
                    break;
                case 15 /* LeftArrow */:
                    this.collapse(true);
                    break;
                case 17 /* RightArrow */:
                    this.collapse(false);
                    break;
                case 16 /* UpArrow */:
                    if (this.settingsGroup.range.startLineNumber - 3 !== 1) {
                        this.editor.focus();
                        var lineNumber_1 = this.settingsGroup.range.startLineNumber - 2;
                        this.editor.setPosition({ lineNumber: lineNumber_1, column: this.editor.getModel().getLineMinColumn(lineNumber_1) });
                    }
                    break;
                case 18 /* DownArrow */:
                    var lineNumber = this.isCollapsed() ? this.settingsGroup.range.startLineNumber : this.settingsGroup.range.startLineNumber - 1;
                    this.editor.focus();
                    this.editor.setPosition({ lineNumber: lineNumber, column: this.editor.getModel().getLineMinColumn(lineNumber) });
                    break;
            }
        };
        SettingsGroupTitleWidget.prototype.toggle = function () {
            this.collapse(!this.isCollapsed());
        };
        SettingsGroupTitleWidget.prototype.collapse = function (collapse) {
            if (collapse !== this.isCollapsed()) {
                DOM.toggleClass(this.titleContainer, 'collapsed', collapse);
                this._onToggled.fire(collapse);
            }
        };
        SettingsGroupTitleWidget.prototype.onCursorChange = function (e) {
            if (e.source !== 'mouse' && this.focusTitle(e.position)) {
                this.titleContainer.focus();
            }
        };
        SettingsGroupTitleWidget.prototype.focusTitle = function (currentPosition) {
            var previousPosition = this.previousPosition;
            this.previousPosition = currentPosition;
            if (!previousPosition) {
                return false;
            }
            if (previousPosition.lineNumber === currentPosition.lineNumber) {
                return false;
            }
            if (currentPosition.lineNumber === this.settingsGroup.range.startLineNumber - 1 || currentPosition.lineNumber === this.settingsGroup.range.startLineNumber - 2) {
                return true;
            }
            if (this.isCollapsed() && currentPosition.lineNumber === this.settingsGroup.range.endLineNumber) {
                return true;
            }
            return false;
        };
        SettingsGroupTitleWidget.prototype.dispose = function () {
            var _this = this;
            this.editor.changeViewZones(function (accessor) {
                accessor.removeZone(_this.id);
            });
            _super.prototype.dispose.call(this);
        };
        return SettingsGroupTitleWidget;
    }(widget_1.Widget));
    exports.SettingsGroupTitleWidget = SettingsGroupTitleWidget;
    var SettingsTargetsWidget = (function (_super) {
        __extends(SettingsTargetsWidget, _super);
        function SettingsTargetsWidget(parent, uri, target, workspaceContextService, preferencesService, contextMenuService, themeService) {
            var _this = _super.call(this) || this;
            _this.uri = uri;
            _this.target = target;
            _this.workspaceContextService = workspaceContextService;
            _this.preferencesService = preferencesService;
            _this.contextMenuService = contextMenuService;
            _this._onDidTargetChange = new event_1.Emitter();
            _this.onDidTargetChange = _this._onDidTargetChange.event;
            _this.borderColor = selectBox_1.defaultStyles.selectBorder;
            _this.create(parent);
            _this._register(styler_1.attachSelectBoxStyler(_this, themeService, {
                selectBackground: theme_1.SIDE_BAR_BACKGROUND
            }));
            return _this;
        }
        SettingsTargetsWidget.prototype.setTarget = function (uri, target) {
            this.uri = uri;
            this.target = target;
            this.updateLabel();
        };
        SettingsTargetsWidget.prototype.create = function (parent) {
            var _this = this;
            this.settingsTargetsContainer = DOM.append(parent, DOM.$('.settings-targets-widget'));
            this.settingsTargetsContainer.style.width = this.workspaceContextService.hasMultiFolderWorkspace() ? '200px' : '150px';
            var targetElement = DOM.append(this.settingsTargetsContainer, DOM.$('.settings-target'));
            this.targetLabel = DOM.append(targetElement, DOM.$('.settings-target-label'));
            this.targetDetails = DOM.append(targetElement, DOM.$('.settings-target-details'));
            this.updateLabel();
            this.onclick(this.settingsTargetsContainer, function (e) { return _this.showContextMenu(e); });
            DOM.append(this.settingsTargetsContainer, DOM.$('.settings-target-dropdown-icon.octicon.octicon-triangle-down'));
            this.applyStyles();
        };
        SettingsTargetsWidget.prototype.updateLabel = function () {
            this.targetLabel.textContent = preferences_1.getSettingsTargetName(this.target, this.uri, this.workspaceContextService);
            var details = configurationEditing_1.ConfigurationTarget.FOLDER === this.target ? nls_1.localize('folderSettingsDetails', "Folder Settings") : '';
            this.targetDetails.textContent = details;
            DOM.toggleClass(this.targetDetails, 'empty', !details);
        };
        SettingsTargetsWidget.prototype.showContextMenu = function (event) {
            var actions = this.getSettingsTargetsActions();
            var elementPosition = DOM.getDomNodePagePosition(this.settingsTargetsContainer);
            var anchor = { x: elementPosition.left, y: elementPosition.top + elementPosition.height + 5 };
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () { return winjs_base_1.TPromise.wrap(actions); }
            });
            event.stopPropagation();
            event.preventDefault();
        };
        SettingsTargetsWidget.prototype.getSettingsTargetsActions = function () {
            var _this = this;
            var actions = [];
            var userSettingsResource = this.preferencesService.userSettingsResource;
            actions.push({
                id: 'userSettingsTarget',
                label: preferences_1.getSettingsTargetName(configurationEditing_1.ConfigurationTarget.USER, userSettingsResource, this.workspaceContextService),
                checked: this.uri.fsPath === userSettingsResource.fsPath,
                enabled: true,
                run: function () { return _this.onTargetClicked(userSettingsResource); }
            });
            if (this.workspaceContextService.hasWorkspace()) {
                var workspaceSettingsResource_1 = this.preferencesService.workspaceSettingsResource;
                actions.push({
                    id: 'workspaceSettingsTarget',
                    label: preferences_1.getSettingsTargetName(configurationEditing_1.ConfigurationTarget.WORKSPACE, workspaceSettingsResource_1, this.workspaceContextService),
                    checked: this.uri.fsPath === workspaceSettingsResource_1.fsPath,
                    enabled: true,
                    run: function () { return _this.onTargetClicked(workspaceSettingsResource_1); }
                });
            }
            if (this.workspaceContextService.hasMultiFolderWorkspace()) {
                var currentRoot_1 = this.uri instanceof uri_1.default ? this.workspaceContextService.getRoot(this.uri) : null;
                actions.push(new actionbar_1.Separator());
                actions.push.apply(actions, this.workspaceContextService.getWorkspace().roots.map(function (root, index) {
                    return {
                        id: 'folderSettingsTarget' + index,
                        label: preferences_1.getSettingsTargetName(configurationEditing_1.ConfigurationTarget.FOLDER, root, _this.workspaceContextService),
                        checked: currentRoot_1 && currentRoot_1.fsPath === root.fsPath,
                        enabled: true,
                        run: function () { return _this.onTargetClicked(root); }
                    };
                }));
            }
            return actions;
        };
        SettingsTargetsWidget.prototype.onTargetClicked = function (target) {
            if (this.uri.fsPath === target.fsPath) {
                return;
            }
            this._onDidTargetChange.fire(target);
        };
        SettingsTargetsWidget.prototype.style = function (styles) {
            this.borderColor = styles.selectBorder;
            this.applyStyles();
        };
        SettingsTargetsWidget.prototype.applyStyles = function () {
            if (this.settingsTargetsContainer) {
                this.settingsTargetsContainer.style.border = this.borderColor ? "1px solid " + this.borderColor : null;
            }
        };
        SettingsTargetsWidget = __decorate([
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, preferences_1.IPreferencesService),
            __param(5, contextView_1.IContextMenuService),
            __param(6, themeService_1.IThemeService)
        ], SettingsTargetsWidget);
        return SettingsTargetsWidget;
    }(widget_1.Widget));
    exports.SettingsTargetsWidget = SettingsTargetsWidget;
    var SearchWidget = (function (_super) {
        __extends(SearchWidget, _super);
        function SearchWidget(parent, options, contextViewService, contextMenuService, instantiationService, themeService) {
            var _this = _super.call(this) || this;
            _this.options = options;
            _this.contextViewService = contextViewService;
            _this.contextMenuService = contextMenuService;
            _this.instantiationService = instantiationService;
            _this.themeService = themeService;
            _this._onDidChange = _this._register(new event_1.Emitter());
            _this.onDidChange = _this._onDidChange.event;
            _this._onNavigate = _this._register(new event_1.Emitter());
            _this.onNavigate = _this._onNavigate.event;
            _this._onFocus = _this._register(new event_1.Emitter());
            _this.onFocus = _this._onFocus.event;
            _this.create(parent);
            return _this;
        }
        SearchWidget.prototype.create = function (parent) {
            var _this = this;
            this.domNode = DOM.append(parent, DOM.$('div.settings-header-widget'));
            this.createSearchContainer(DOM.append(this.domNode, DOM.$('div.settings-search-container')));
            this.countElement = DOM.append(this.domNode, DOM.$('.settings-count-widget'));
            this._register(styler_1.attachStylerCallback(this.themeService, { badgeBackground: colorRegistry_1.badgeBackground, contrastBorder: colorRegistry_1.contrastBorder }, function (colors) {
                var background = colors.badgeBackground ? colors.badgeBackground.toString() : null;
                var border = colors.contrastBorder ? colors.contrastBorder.toString() : null;
                _this.countElement.style.backgroundColor = background;
                _this.countElement.style.borderWidth = border ? '1px' : null;
                _this.countElement.style.borderStyle = border ? 'solid' : null;
                _this.countElement.style.borderColor = border;
                _this.styleCountElementForeground();
            }));
            this.inputBox.inputElement.setAttribute('aria-live', 'assertive');
            var focusTracker = this._register(DOM.trackFocus(this.inputBox.inputElement));
            this._register(focusTracker.addFocusListener(function () { return _this._onFocus.fire(); }));
            if (this.options.focusKey) {
                this._register(focusTracker.addFocusListener(function () { return _this.options.focusKey.set(true); }));
                this._register(focusTracker.addBlurListener(function () { return _this.options.focusKey.set(false); }));
            }
        };
        SearchWidget.prototype.createSearchContainer = function (searchContainer) {
            var _this = this;
            this.searchContainer = searchContainer;
            var searchInput = DOM.append(this.searchContainer, DOM.$('div.settings-search-input'));
            this.inputBox = this._register(this.createInputBox(searchInput));
            this._register(this.inputBox.onDidChange(function (value) { return _this._onDidChange.fire(value); }));
            this.onkeydown(this.inputBox.inputElement, function (e) { return _this._onKeyDown(e); });
        };
        SearchWidget.prototype.createInputBox = function (parent) {
            var box = this._register(new inputBox_1.InputBox(parent, this.contextViewService, this.options));
            this._register(styler_1.attachInputBoxStyler(box, this.themeService));
            return box;
        };
        SearchWidget.prototype.showMessage = function (message, count) {
            this.countElement.textContent = message;
            this.inputBox.inputElement.setAttribute('aria-label', message);
            DOM.toggleClass(this.countElement, 'no-results', count === 0);
            this.inputBox.inputElement.style.paddingRight = DOM.getTotalWidth(this.countElement) + 20 + 'px';
            this.styleCountElementForeground();
        };
        SearchWidget.prototype.styleCountElementForeground = function () {
            var colorId = DOM.hasClass(this.countElement, 'no-results') ? colorRegistry_1.errorForeground : colorRegistry_1.badgeForeground;
            var color = this.themeService.getTheme().getColor(colorId);
            this.countElement.style.color = color ? color.toString() : null;
        };
        SearchWidget.prototype.layout = function (dimension) {
            if (dimension.width < 400) {
                DOM.addClass(this.countElement, 'hide');
                this.inputBox.inputElement.style.paddingRight = '0px';
            }
            else {
                DOM.removeClass(this.countElement, 'hide');
                this.inputBox.inputElement.style.paddingRight = DOM.getTotalWidth(this.countElement) + 20 + 'px';
            }
        };
        SearchWidget.prototype.focus = function () {
            this.inputBox.focus();
            if (this.getValue()) {
                this.inputBox.select();
            }
        };
        SearchWidget.prototype.hasFocus = function () {
            return this.inputBox.hasFocus();
        };
        SearchWidget.prototype.clear = function () {
            this.inputBox.value = '';
        };
        SearchWidget.prototype.getValue = function () {
            return this.inputBox.value;
        };
        SearchWidget.prototype.setValue = function (value) {
            return this.inputBox.value = value;
        };
        SearchWidget.prototype._onKeyDown = function (keyboardEvent) {
            var handled = false;
            switch (keyboardEvent.keyCode) {
                case 3 /* Enter */:
                    this._onNavigate.fire(keyboardEvent.shiftKey);
                    handled = true;
                    break;
                case 9 /* Escape */:
                    this.clear();
                    handled = true;
                    break;
            }
            if (handled) {
                keyboardEvent.preventDefault();
                keyboardEvent.stopPropagation();
            }
        };
        SearchWidget.prototype.dispose = function () {
            if (this.options.focusKey) {
                this.options.focusKey.set(false);
            }
            _super.prototype.dispose.call(this);
        };
        SearchWidget = __decorate([
            __param(2, contextView_1.IContextViewService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, themeService_1.IThemeService)
        ], SearchWidget);
        return SearchWidget;
    }(widget_1.Widget));
    exports.SearchWidget = SearchWidget;
    var FloatingClickWidget = (function (_super) {
        __extends(FloatingClickWidget, _super);
        function FloatingClickWidget(editor, label, keyBindingAction, keybindingService, themeService) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this.label = label;
            _this.keyBindingAction = keyBindingAction;
            _this.themeService = themeService;
            _this._onClick = _this._register(new event_1.Emitter());
            _this.onClick = _this._onClick.event;
            if (keyBindingAction) {
                var keybinding = keybindingService.lookupKeybinding(keyBindingAction);
                if (keybinding) {
                    _this.label += ' (' + keybinding.getLabel() + ')';
                }
            }
            return _this;
        }
        FloatingClickWidget.prototype.render = function () {
            var _this = this;
            this._domNode = DOM.$('.floating-click-widget');
            this._register(styler_1.attachStylerCallback(this.themeService, { buttonBackground: colorRegistry_1.buttonBackground, buttonForeground: colorRegistry_1.buttonForeground }, function (colors) {
                _this._domNode.style.backgroundColor = colors.buttonBackground;
                _this._domNode.style.color = colors.buttonForeground;
            }));
            DOM.append(this._domNode, DOM.$('')).textContent = this.label;
            this.onclick(this._domNode, function (e) { return _this._onClick.fire(); });
            this.editor.addOverlayWidget(this);
        };
        FloatingClickWidget.prototype.dispose = function () {
            this.editor.removeOverlayWidget(this);
            _super.prototype.dispose.call(this);
        };
        FloatingClickWidget.prototype.getId = function () {
            return 'editor.overlayWidget.floatingClickWidget';
        };
        FloatingClickWidget.prototype.getDomNode = function () {
            return this._domNode;
        };
        FloatingClickWidget.prototype.getPosition = function () {
            return {
                preference: editorBrowser_1.OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
            };
        };
        FloatingClickWidget = __decorate([
            __param(3, keybinding_1.IKeybindingService),
            __param(4, themeService_1.IThemeService)
        ], FloatingClickWidget);
        return FloatingClickWidget;
    }(widget_1.Widget));
    exports.FloatingClickWidget = FloatingClickWidget;
    var EditPreferenceWidget = (function (_super) {
        __extends(EditPreferenceWidget, _super);
        function EditPreferenceWidget(editor) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this._onClick = new event_1.Emitter();
            _this._editPreferenceDecoration = [];
            _this._register(_this.editor.onMouseDown(function (e) {
                if (e.target.type !== editorBrowser_1.MouseTargetType.GUTTER_GLYPH_MARGIN || e.target.detail || !_this.isVisible()) {
                    return;
                }
                _this._onClick.fire(e);
            }));
            return _this;
        }
        Object.defineProperty(EditPreferenceWidget.prototype, "onClick", {
            get: function () { return this._onClick.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditPreferenceWidget.prototype, "preferences", {
            get: function () {
                return this._preferences;
            },
            enumerable: true,
            configurable: true
        });
        EditPreferenceWidget.prototype.getLine = function () {
            return this._line;
        };
        EditPreferenceWidget.prototype.show = function (line, hoverMessage, preferences) {
            this._preferences = preferences;
            var newDecoration = [];
            this._line = line;
            newDecoration.push({
                options: {
                    glyphMarginClassName: EditPreferenceWidget.GLYPH_MARGIN_CLASS_NAME,
                    glyphMarginHoverMessage: new htmlContent_1.MarkdownString().appendText(hoverMessage),
                    stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                },
                range: {
                    startLineNumber: line,
                    startColumn: 1,
                    endLineNumber: line,
                    endColumn: 1
                }
            });
            this._editPreferenceDecoration = this.editor.deltaDecorations(this._editPreferenceDecoration, newDecoration);
        };
        EditPreferenceWidget.prototype.hide = function () {
            this._editPreferenceDecoration = this.editor.deltaDecorations(this._editPreferenceDecoration, []);
        };
        EditPreferenceWidget.prototype.isVisible = function () {
            return this._editPreferenceDecoration.length > 0;
        };
        EditPreferenceWidget.prototype.dispose = function () {
            this.hide();
            _super.prototype.dispose.call(this);
        };
        EditPreferenceWidget.GLYPH_MARGIN_CLASS_NAME = 'edit-preferences-widget';
        return EditPreferenceWidget;
    }(lifecycle_1.Disposable));
    exports.EditPreferenceWidget = EditPreferenceWidget;
});
//# sourceMappingURL=preferencesWidgets.js.map