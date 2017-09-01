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
define(["require", "exports", "vs/nls", "vs/base/common/actions", "vs/base/common/arrays", "vs/base/common/keyCodes", "vs/platform/actions/common/actions", "vs/platform/message/common/message", "vs/platform/registry/common/platform", "vs/workbench/common/actionRegistry", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/services/themes/common/workbenchThemeService", "vs/workbench/parts/extensions/common/extensions", "vs/platform/extensionManagement/common/extensionManagement", "vs/workbench/services/viewlet/browser/viewlet", "vs/base/common/async", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/services/configuration/common/configuration", "vs/platform/theme/common/colorRegistry", "vs/workbench/services/editor/common/editorService", "vs/base/common/color"], function (require, exports, nls_1, actions_1, arrays_1, keyCodes_1, actions_2, message_1, platform_1, actionRegistry_1, quickOpen_1, workbenchThemeService_1, extensions_1, extensionManagement_1, viewlet_1, async_1, configurationEditing_1, configuration_1, colorRegistry_1, editorService_1, color_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectColorThemeAction = (function (_super) {
        __extends(SelectColorThemeAction, _super);
        function SelectColorThemeAction(id, label, quickOpenService, messageService, themeService, extensionGalleryService, viewletService, configurationService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            _this.messageService = messageService;
            _this.themeService = themeService;
            _this.extensionGalleryService = extensionGalleryService;
            _this.viewletService = viewletService;
            _this.configurationService = configurationService;
            return _this;
        }
        SelectColorThemeAction.prototype.run = function () {
            var _this = this;
            return this.themeService.getColorThemes().then(function (themes) {
                var currentTheme = _this.themeService.getColorTheme();
                var pickInMarketPlace = findInMarketplacePick(_this.viewletService, 'category:themes', nls_1.localize('installColorThemes', "Install Additional Color Themes..."));
                var picks = themes
                    .map(function (theme) { return ({ id: theme.id, label: theme.label, description: theme.description }); })
                    .sort(function (t1, t2) { return t1.label.localeCompare(t2.label); });
                var selectTheme = function (theme, applyTheme) {
                    if (theme === pickInMarketPlace) {
                        theme = currentTheme;
                    }
                    var target = null;
                    if (applyTheme) {
                        var confValue = _this.configurationService.lookup(workbenchThemeService_1.COLOR_THEME_SETTING);
                        target = typeof confValue.workspace !== 'undefined' ? configurationEditing_1.ConfigurationTarget.WORKSPACE : configurationEditing_1.ConfigurationTarget.USER;
                    }
                    _this.themeService.setColorTheme(theme.id, target).done(null, function (err) {
                        _this.themeService.setColorTheme(currentTheme.id, null);
                    });
                };
                var placeHolder = nls_1.localize('themes.selectTheme', "Select Color Theme (Up/Down Keys to Preview)");
                var autoFocusIndex = arrays_1.firstIndex(picks, function (p) { return p.id === currentTheme.id; });
                var delayer = new async_1.Delayer(100);
                if (_this.extensionGalleryService.isEnabled()) {
                    picks.push(pickInMarketPlace);
                }
                return _this.quickOpenService.pick(picks, { placeHolder: placeHolder, autoFocus: { autoFocusIndex: autoFocusIndex } })
                    .then(function (theme) { return delayer.trigger(function () { return selectTheme(theme || currentTheme, true); }, 0); }, null, function (theme) { return delayer.trigger(function () { return selectTheme(theme, false); }); });
            });
        };
        SelectColorThemeAction.ID = 'workbench.action.selectTheme';
        SelectColorThemeAction.LABEL = nls_1.localize('selectTheme.label', "Color Theme");
        SelectColorThemeAction = __decorate([
            __param(2, quickOpen_1.IQuickOpenService),
            __param(3, message_1.IMessageService),
            __param(4, workbenchThemeService_1.IWorkbenchThemeService),
            __param(5, extensionManagement_1.IExtensionGalleryService),
            __param(6, viewlet_1.IViewletService),
            __param(7, configuration_1.IWorkspaceConfigurationService)
        ], SelectColorThemeAction);
        return SelectColorThemeAction;
    }(actions_1.Action));
    exports.SelectColorThemeAction = SelectColorThemeAction;
    var SelectIconThemeAction = (function (_super) {
        __extends(SelectIconThemeAction, _super);
        function SelectIconThemeAction(id, label, quickOpenService, messageService, themeService, extensionGalleryService, viewletService, configurationService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            _this.messageService = messageService;
            _this.themeService = themeService;
            _this.extensionGalleryService = extensionGalleryService;
            _this.viewletService = viewletService;
            _this.configurationService = configurationService;
            return _this;
        }
        SelectIconThemeAction.prototype.run = function () {
            var _this = this;
            return this.themeService.getFileIconThemes().then(function (themes) {
                var currentTheme = _this.themeService.getFileIconTheme();
                var pickInMarketPlace = findInMarketplacePick(_this.viewletService, 'tag:icon-theme', nls_1.localize('installIconThemes', "Install Additional File Icon Themes..."));
                var picks = themes
                    .map(function (theme) { return ({ id: theme.id, label: theme.label, description: theme.description }); })
                    .sort(function (t1, t2) { return t1.label.localeCompare(t2.label); });
                picks.splice(0, 0, { id: '', label: nls_1.localize('noIconThemeLabel', 'None'), description: nls_1.localize('noIconThemeDesc', 'Disable file icons') });
                var selectTheme = function (theme, applyTheme) {
                    if (theme === pickInMarketPlace) {
                        theme = currentTheme;
                    }
                    var target = null;
                    if (applyTheme) {
                        var confValue = _this.configurationService.lookup(workbenchThemeService_1.ICON_THEME_SETTING);
                        target = typeof confValue.workspace !== 'undefined' ? configurationEditing_1.ConfigurationTarget.WORKSPACE : configurationEditing_1.ConfigurationTarget.USER;
                    }
                    _this.themeService.setFileIconTheme(theme && theme.id, target).done(null, function (err) {
                        _this.messageService.show(message_1.Severity.Info, nls_1.localize('problemChangingIconTheme', "Problem setting icon theme: {0}", err.message));
                        _this.themeService.setFileIconTheme(currentTheme.id, null);
                    });
                };
                var placeHolder = nls_1.localize('themes.selectIconTheme', "Select File Icon Theme");
                var autoFocusIndex = arrays_1.firstIndex(picks, function (p) { return p.id === currentTheme.id; });
                var delayer = new async_1.Delayer(100);
                if (_this.extensionGalleryService.isEnabled()) {
                    picks.push(pickInMarketPlace);
                }
                return _this.quickOpenService.pick(picks, { placeHolder: placeHolder, autoFocus: { autoFocusIndex: autoFocusIndex } })
                    .then(function (theme) { return delayer.trigger(function () { return selectTheme(theme || currentTheme, true); }, 0); }, null, function (theme) { return delayer.trigger(function () { return selectTheme(theme, false); }); });
            });
        };
        SelectIconThemeAction.ID = 'workbench.action.selectIconTheme';
        SelectIconThemeAction.LABEL = nls_1.localize('selectIconTheme.label', "File Icon Theme");
        SelectIconThemeAction = __decorate([
            __param(2, quickOpen_1.IQuickOpenService),
            __param(3, message_1.IMessageService),
            __param(4, workbenchThemeService_1.IWorkbenchThemeService),
            __param(5, extensionManagement_1.IExtensionGalleryService),
            __param(6, viewlet_1.IViewletService),
            __param(7, configuration_1.IWorkspaceConfigurationService)
        ], SelectIconThemeAction);
        return SelectIconThemeAction;
    }(actions_1.Action));
    function findInMarketplacePick(viewletService, query, label) {
        return {
            id: 'themes.findmore',
            label: label,
            separator: { border: true },
            alwaysShow: true,
            run: function () { return viewletService.openViewlet(extensions_1.VIEWLET_ID, true).then(function (viewlet) {
                viewlet.search(query);
                viewlet.focus();
            }); }
        };
    }
    var GenerateColorThemeAction = (function (_super) {
        __extends(GenerateColorThemeAction, _super);
        function GenerateColorThemeAction(id, label, themeService, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.themeService = themeService;
            _this.editorService = editorService;
            return _this;
        }
        GenerateColorThemeAction.prototype.run = function () {
            var theme = this.themeService.getColorTheme();
            var colorRegistry = platform_1.Registry.as(colorRegistry_1.Extensions.ColorContribution);
            var resultingColors = {};
            colorRegistry.getColors().map(function (c) {
                var color = theme.getColor(c.id, false);
                if (color) {
                    resultingColors[c.id] = color_1.Color.Format.CSS.formatHexA(color, true);
                }
            });
            var contents = JSON.stringify({
                type: theme.type,
                colors: resultingColors,
                tokenColors: theme.tokenColors
            }, null, '\t');
            return this.editorService.openEditor({ contents: contents, language: 'json' });
        };
        GenerateColorThemeAction.ID = 'workbench.action.generateColorTheme';
        GenerateColorThemeAction.LABEL = nls_1.localize('generateColorTheme.label', "Generate Color Theme From Current Settings");
        GenerateColorThemeAction = __decorate([
            __param(2, workbenchThemeService_1.IWorkbenchThemeService),
            __param(3, editorService_1.IWorkbenchEditorService)
        ], GenerateColorThemeAction);
        return GenerateColorThemeAction;
    }(actions_1.Action));
    var category = nls_1.localize('preferences', "Preferences");
    var colorThemeDescriptor = new actions_2.SyncActionDescriptor(SelectColorThemeAction, SelectColorThemeAction.ID, SelectColorThemeAction.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 50 /* KEY_T */) });
    platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions).registerWorkbenchAction(colorThemeDescriptor, 'Preferences: Color Theme', category);
    var iconThemeDescriptor = new actions_2.SyncActionDescriptor(SelectIconThemeAction, SelectIconThemeAction.ID, SelectIconThemeAction.LABEL);
    platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions).registerWorkbenchAction(iconThemeDescriptor, 'Preferences: File Icon Theme', category);
    var developerCategory = nls_1.localize('developer', "Developer");
    var generateColorThemeDescriptor = new actions_2.SyncActionDescriptor(GenerateColorThemeAction, GenerateColorThemeAction.ID, GenerateColorThemeAction.LABEL);
    platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions).registerWorkbenchAction(generateColorThemeDescriptor, 'Developer: Generate Color Theme From Current Settings', developerCategory);
});
//# sourceMappingURL=themes.contribution.js.map