var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/nls", "path", "vs/base/common/json", "vs/base/common/types", "vs/base/common/objects", "vs/platform/extensions/common/extensions", "vs/platform/extensions/common/extensionsRegistry", "vs/workbench/services/themes/common/workbenchThemeService", "vs/platform/storage/common/storage", "vs/platform/telemetry/common/telemetry", "vs/platform/registry/common/platform", "vs/base/common/errors", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/configuration/common/configuration", "vs/platform/configuration/common/configurationRegistry", "vs/platform/environment/common/environment", "vs/platform/message/common/message", "vs/platform/instantiation/common/instantiation", "vs/base/common/severity", "./colorThemeData", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/base/common/color", "vs/base/browser/builder", "vs/base/common/event", "vs/base/node/pfs", "vs/workbench/services/themes/common/colorThemeSchema", "vs/workbench/services/themes/common/fileIconThemeSchema", "vs/base/common/jsonErrorMessages", "vs/platform/broadcast/electron-browser/broadcastService"], function (require, exports, winjs_base_1, uri_1, nls, Paths, Json, types, objects, extensions_1, extensionsRegistry_1, workbenchThemeService_1, storage_1, telemetry_1, platform_1, errors, configurationEditing_1, configuration_1, configurationRegistry_1, environment_1, message_1, instantiation_1, severity_1, colorThemeData_1, themeService_1, colorRegistry_1, color_1, builder_1, event_1, pfs, colorThemeSchema, fileIconThemeSchema, jsonErrorMessages_1, broadcastService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // implementation
    var DEFAULT_THEME_ID = 'vs-dark vscode-theme-defaults-themes-dark_plus-json';
    var DEFAULT_THEME_SETTING_VALUE = 'Default Dark+';
    var PERSISTED_THEME_STORAGE_KEY = 'colorThemeData';
    var defaultThemeExtensionId = 'vscode-theme-defaults';
    var oldDefaultThemeExtensionId = 'vscode-theme-colorful-defaults';
    var DEFAULT_ICON_THEME_SETTING_VALUE = 'vs-seti';
    var fileIconsEnabledClass = 'file-icons-enabled';
    var themingRegistry = platform_1.Registry.as(themeService_1.Extensions.ThemingContribution);
    function validateThemeId(theme) {
        // migrations
        switch (theme) {
            case workbenchThemeService_1.VS_LIGHT_THEME: return "vs " + defaultThemeExtensionId + "-themes-light_vs-json";
            case workbenchThemeService_1.VS_DARK_THEME: return "vs-dark " + defaultThemeExtensionId + "-themes-dark_vs-json";
            case workbenchThemeService_1.VS_HC_THEME: return "hc-black " + defaultThemeExtensionId + "-themes-hc_black-json";
            case "vs " + oldDefaultThemeExtensionId + "-themes-light_plus-tmTheme": return "vs " + defaultThemeExtensionId + "-themes-light_plus-json";
            case "vs-dark " + oldDefaultThemeExtensionId + "-themes-dark_plus-tmTheme": return "vs-dark " + defaultThemeExtensionId + "-themes-dark_plus-json";
        }
        return theme;
    }
    var themesExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('themes', [], {
        description: nls.localize('vscode.extension.contributes.themes', 'Contributes textmate color themes.'),
        type: 'array',
        items: {
            type: 'object',
            defaultSnippets: [{ body: { label: '${1:label}', id: '${2:id}', uiTheme: workbenchThemeService_1.VS_DARK_THEME, path: './themes/${3:id}.tmTheme.' } }],
            properties: {
                id: {
                    description: nls.localize('vscode.extension.contributes.themes.id', 'Id of the icon theme as used in the user settings.'),
                    type: 'string'
                },
                label: {
                    description: nls.localize('vscode.extension.contributes.themes.label', 'Label of the color theme as shown in the UI.'),
                    type: 'string'
                },
                uiTheme: {
                    description: nls.localize('vscode.extension.contributes.themes.uiTheme', 'Base theme defining the colors around the editor: \'vs\' is the light color theme, \'vs-dark\' is the dark color theme. \'hc-black\' is the dark high contrast theme.'),
                    enum: [workbenchThemeService_1.VS_LIGHT_THEME, workbenchThemeService_1.VS_DARK_THEME, workbenchThemeService_1.VS_HC_THEME]
                },
                path: {
                    description: nls.localize('vscode.extension.contributes.themes.path', 'Path of the tmTheme file. The path is relative to the extension folder and is typically \'./themes/themeFile.tmTheme\'.'),
                    type: 'string'
                }
            },
            required: ['path', 'uiTheme']
        }
    });
    var iconThemeExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('iconThemes', [], {
        description: nls.localize('vscode.extension.contributes.iconThemes', 'Contributes file icon themes.'),
        type: 'array',
        items: {
            type: 'object',
            defaultSnippets: [{ body: { id: '${1:id}', label: '${2:label}', path: './fileicons/${3:id}-icon-theme.json' } }],
            properties: {
                id: {
                    description: nls.localize('vscode.extension.contributes.iconThemes.id', 'Id of the icon theme as used in the user settings.'),
                    type: 'string'
                },
                label: {
                    description: nls.localize('vscode.extension.contributes.iconThemes.label', 'Label of the icon theme as shown in the UI.'),
                    type: 'string'
                },
                path: {
                    description: nls.localize('vscode.extension.contributes.iconThemes.path', 'Path of the icon theme definition file. The path is relative to the extension folder and is typically \'./icons/awesome-icon-theme.json\'.'),
                    type: 'string'
                }
            },
            required: ['path', 'id']
        }
    });
    var noFileIconTheme = {
        id: '',
        label: '',
        settingsId: null,
        hasFileIcons: false,
        hasFolderIcons: false,
        isLoaded: true,
        extensionData: null
    };
    var WorkbenchThemeService = (function () {
        function WorkbenchThemeService(container, extensionService, storageService, broadcastService, configurationService, environmentService, messageService, telemetryService, instantiationService) {
            var _this = this;
            this.extensionService = extensionService;
            this.storageService = storageService;
            this.broadcastService = broadcastService;
            this.configurationService = configurationService;
            this.environmentService = environmentService;
            this.messageService = messageService;
            this.telemetryService = telemetryService;
            this.instantiationService = instantiationService;
            this.themeExtensionsActivated = new Map();
            this.container = container;
            this.extensionsColorThemes = [];
            this.colorCustomizations = {};
            this.tokenColorCustomizations = {};
            this.onFileIconThemeChange = new event_1.Emitter();
            this.knownIconThemes = [];
            this.onColorThemeChange = new event_1.Emitter();
            this.currentIconTheme = {
                id: '',
                label: '',
                settingsId: null,
                isLoaded: false,
                hasFileIcons: false,
                hasFolderIcons: false,
                extensionData: null
            };
            this.updateColorCustomizations(false);
            // In order to avoid paint flashing for tokens, because
            // themes are loaded asynchronously, we need to initialize
            // a color theme document with good defaults until the theme is loaded
            var themeData = null;
            var persistedThemeData = this.storageService.get(PERSISTED_THEME_STORAGE_KEY);
            if (persistedThemeData) {
                themeData = colorThemeData_1.fromStorageData(persistedThemeData);
            }
            if (!themeData) {
                var isLightTheme = (Array.prototype.indexOf.call(document.body.classList, 'vs') >= 0);
                themeData = colorThemeData_1.createUnloadedTheme(isLightTheme ? workbenchThemeService_1.VS_LIGHT_THEME : workbenchThemeService_1.VS_DARK_THEME);
            }
            themeData.setCustomColors(this.colorCustomizations);
            themeData.setCustomTokenColors(this.tokenColorCustomizations);
            this.updateDynamicCSSRules(themeData);
            this.applyTheme(themeData, null, true);
            themesExtPoint.setHandler(function (extensions) {
                for (var _i = 0, extensions_2 = extensions; _i < extensions_2.length; _i++) {
                    var ext = extensions_2[_i];
                    var extensionData = {
                        extensionId: ext.description.id,
                        extensionPublisher: ext.description.publisher,
                        extensionName: ext.description.name,
                        extensionIsBuiltin: ext.description.isBuiltin
                    };
                    _this.onThemes(ext.description.extensionFolderPath, extensionData, ext.value, ext.collector);
                }
            });
            iconThemeExtPoint.setHandler(function (extensions) {
                for (var _i = 0, extensions_3 = extensions; _i < extensions_3.length; _i++) {
                    var ext = extensions_3[_i];
                    var extensionData = {
                        extensionId: ext.description.id,
                        extensionPublisher: ext.description.publisher,
                        extensionName: ext.description.name,
                        extensionIsBuiltin: ext.description.isBuiltin
                    };
                    _this.onIconThemes(ext.description.extensionFolderPath, extensionData, ext.value, ext.collector);
                }
            });
            this.migrate().then(function (_) {
                _this.initialize().then(null, errors.onUnexpectedError).then(function (_) {
                    _this.installConfigurationListener();
                });
            });
        }
        Object.defineProperty(WorkbenchThemeService.prototype, "onDidColorThemeChange", {
            get: function () {
                return this.onColorThemeChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorkbenchThemeService.prototype, "onDidFileIconThemeChange", {
            get: function () {
                return this.onFileIconThemeChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorkbenchThemeService.prototype, "onThemeChange", {
            get: function () {
                return this.onColorThemeChange.event;
            },
            enumerable: true,
            configurable: true
        });
        WorkbenchThemeService.prototype.backupSettings = function () {
            var resource = this.environmentService.appSettingsPath;
            var backupFileLocation = resource + '-' + new Date().getTime() + '.backup';
            return pfs.readFile(resource).then(function (content) {
                return pfs.writeFile(backupFileLocation, content).then(function (_) { return backupFileLocation; });
            }, function (err) {
                if (err && err.code === 'ENOENT') {
                    return winjs_base_1.TPromise.as(null); // ignore, user config file doesn't exist yet
                }
                ;
                return winjs_base_1.TPromise.wrapError(err);
            });
        };
        WorkbenchThemeService.prototype.migrate = function () {
            var _this = this;
            var legacyColorThemeId = this.storageService.get('workbench.theme', storage_1.StorageScope.GLOBAL, void 0);
            var legacyIconThemeId = this.storageService.get('workbench.iconTheme', storage_1.StorageScope.GLOBAL, void 0);
            if (types.isUndefined(legacyColorThemeId) && types.isUndefined(legacyIconThemeId)) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.backupSettings().then(function (backupLocation) {
                var promise = winjs_base_1.TPromise.as(null);
                if (!types.isUndefined(legacyColorThemeId)) {
                    _this.storageService.remove('workbench.theme', storage_1.StorageScope.GLOBAL);
                    promise = _this.findThemeData(legacyColorThemeId, DEFAULT_THEME_ID).then(function (theme) {
                        var value = theme ? theme.settingsId : DEFAULT_THEME_SETTING_VALUE;
                        return _this.configurationWriter.writeConfiguration(workbenchThemeService_1.COLOR_THEME_SETTING, value, configurationEditing_1.ConfigurationTarget.USER).then(null, function (error) { return null; });
                    });
                }
                if (!types.isUndefined(legacyIconThemeId)) {
                    _this.storageService.remove('workbench.iconTheme', storage_1.StorageScope.GLOBAL);
                    promise = promise.then(function (_) {
                        return _this._findIconThemeData(legacyIconThemeId).then(function (theme) {
                            var value = theme ? theme.settingsId : null;
                            return _this.configurationWriter.writeConfiguration(workbenchThemeService_1.ICON_THEME_SETTING, value, configurationEditing_1.ConfigurationTarget.USER).then(null, function (error) { return null; });
                        });
                    });
                }
                return promise.then(function (_) {
                    if (backupLocation) {
                        var message = nls.localize('migration.completed', 'New theme settings have been added to the user settings. Backup available at {0}.', backupLocation);
                        _this.messageService.show(severity_1.default.Info, message);
                        console.log(message);
                    }
                });
            });
        };
        WorkbenchThemeService.prototype.initialize = function () {
            var _this = this;
            this.updateColorCustomizations(false);
            var colorThemeSetting = this.configurationService.lookup(workbenchThemeService_1.COLOR_THEME_SETTING).value;
            var iconThemeSetting = this.configurationService.lookup(workbenchThemeService_1.ICON_THEME_SETTING).value || '';
            return winjs_base_1.Promise.join([
                this.findThemeDataBySettingsId(colorThemeSetting, DEFAULT_THEME_ID).then(function (theme) {
                    return _this.setColorTheme(theme && theme.id, null);
                }),
                this.findIconThemeBySettingsId(iconThemeSetting).then(function (theme) {
                    return _this.setFileIconTheme(theme && theme.id, null);
                }),
            ]);
        };
        WorkbenchThemeService.prototype.installConfigurationListener = function () {
            var _this = this;
            this.configurationService.onDidUpdateConfiguration(function (e) {
                var colorThemeSetting = _this.configurationService.lookup(workbenchThemeService_1.COLOR_THEME_SETTING).value;
                if (colorThemeSetting !== _this.currentColorTheme.settingsId) {
                    _this.findThemeDataBySettingsId(colorThemeSetting, null).then(function (theme) {
                        if (theme) {
                            _this.setColorTheme(theme.id, null);
                        }
                    });
                }
                var iconThemeSetting = _this.configurationService.lookup(workbenchThemeService_1.ICON_THEME_SETTING).value || '';
                if (iconThemeSetting !== _this.currentIconTheme.settingsId) {
                    _this.findIconThemeBySettingsId(iconThemeSetting).then(function (theme) {
                        _this.setFileIconTheme(theme && theme.id, null);
                    });
                }
                _this.updateColorCustomizations();
            });
        };
        WorkbenchThemeService.prototype.getTheme = function () {
            return this.getColorTheme();
        };
        WorkbenchThemeService.prototype.setColorTheme = function (themeId, settingsTarget) {
            var _this = this;
            if (!themeId) {
                return winjs_base_1.TPromise.as(null);
            }
            if (themeId === this.currentColorTheme.id && this.currentColorTheme.isLoaded) {
                return this.writeColorThemeConfiguration(settingsTarget);
            }
            themeId = validateThemeId(themeId); // migrate theme ids
            return this.findThemeData(themeId, DEFAULT_THEME_ID).then(function (themeData) {
                if (themeData) {
                    return themeData.ensureLoaded(_this).then(function (_) {
                        if (themeId === _this.currentColorTheme.id && !_this.currentColorTheme.isLoaded && _this.currentColorTheme.hasEqualData(themeData)) {
                            // the loaded theme is identical to the perisisted theme. Don't need to send an event.
                            _this.currentColorTheme = themeData;
                            themeData.setCustomColors(_this.colorCustomizations);
                            themeData.setCustomTokenColors(_this.tokenColorCustomizations);
                            return winjs_base_1.TPromise.as(themeData);
                        }
                        themeData.setCustomColors(_this.colorCustomizations);
                        themeData.setCustomTokenColors(_this.tokenColorCustomizations);
                        _this.updateDynamicCSSRules(themeData);
                        return _this.applyTheme(themeData, settingsTarget);
                    }, function (error) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotloadtheme', "Unable to load {0}: {1}", themeData.path, error.message)));
                    });
                }
                return null;
            });
        };
        WorkbenchThemeService.prototype.updateDynamicCSSRules = function (themeData) {
            var cssRules = [];
            var hasRule = {};
            var ruleCollector = {
                addRule: function (rule) {
                    if (!hasRule[rule]) {
                        cssRules.push(rule);
                        hasRule[rule] = true;
                    }
                }
            };
            themingRegistry.getThemingParticipants().forEach(function (p) { return p(themeData, ruleCollector); });
            _applyRules(cssRules.join('\n'), colorThemeRulesClassName);
        };
        WorkbenchThemeService.prototype.applyTheme = function (newTheme, settingsTarget, silent) {
            var _this = this;
            if (silent === void 0) { silent = false; }
            if (this.container) {
                if (this.currentColorTheme) {
                    builder_1.$(this.container).removeClass(this.currentColorTheme.id);
                }
                else {
                    builder_1.$(this.container).removeClass(workbenchThemeService_1.VS_DARK_THEME, workbenchThemeService_1.VS_LIGHT_THEME, workbenchThemeService_1.VS_HC_THEME);
                }
                builder_1.$(this.container).addClass(newTheme.id);
            }
            this.currentColorTheme = newTheme;
            if (!this.themingParticipantChangeListener) {
                this.themingParticipantChangeListener = themingRegistry.onThemingParticipantAdded(function (p) { return _this.updateDynamicCSSRules(_this.currentColorTheme); });
            }
            this.sendTelemetry(newTheme.id, newTheme.extensionData, 'color');
            if (silent) {
                return winjs_base_1.TPromise.as(null);
            }
            this.onColorThemeChange.fire(this.currentColorTheme);
            if (settingsTarget !== configurationEditing_1.ConfigurationTarget.WORKSPACE) {
                var background = color_1.Color.Format.CSS.formatHex(newTheme.getColor(colorRegistry_1.editorBackground)); // only take RGB, its what is used in the initial CSS
                var data = { id: newTheme.id, background: background };
                this.broadcastService.broadcast({ channel: 'vscode:changeColorTheme', payload: JSON.stringify(data) });
            }
            // remember theme data for a quick restore
            this.storageService.store(PERSISTED_THEME_STORAGE_KEY, newTheme.toStorageData());
            return this.writeColorThemeConfiguration(settingsTarget);
        };
        ;
        WorkbenchThemeService.prototype.writeColorThemeConfiguration = function (settingsTarget) {
            var _this = this;
            if (!types.isUndefinedOrNull(settingsTarget)) {
                return this.configurationWriter.writeConfiguration(workbenchThemeService_1.COLOR_THEME_SETTING, this.currentColorTheme.settingsId, settingsTarget).then(function (_) { return _this.currentColorTheme; });
            }
            return winjs_base_1.TPromise.as(this.currentColorTheme);
        };
        WorkbenchThemeService.prototype.getColorTheme = function () {
            return this.currentColorTheme;
        };
        WorkbenchThemeService.prototype.findThemeData = function (themeId, defaultId) {
            return this.getColorThemes().then(function (allThemes) {
                var defaultTheme = void 0;
                for (var _i = 0, allThemes_1 = allThemes; _i < allThemes_1.length; _i++) {
                    var t = allThemes_1[_i];
                    if (t.id === themeId) {
                        return t;
                    }
                    if (t.id === defaultId) {
                        defaultTheme = t;
                    }
                }
                return defaultTheme;
            });
        };
        WorkbenchThemeService.prototype.findThemeDataBySettingsId = function (settingsId, defaultId) {
            return this.getColorThemes().then(function (allThemes) {
                var defaultTheme = void 0;
                for (var _i = 0, allThemes_2 = allThemes; _i < allThemes_2.length; _i++) {
                    var t = allThemes_2[_i];
                    if (t.settingsId === settingsId) {
                        return t;
                    }
                    if (t.id === defaultId) {
                        defaultTheme = t;
                    }
                }
                return defaultTheme;
            });
        };
        WorkbenchThemeService.prototype.getColorThemes = function () {
            var _this = this;
            return this.extensionService.onReady().then(function (isReady) {
                return _this.extensionsColorThemes;
            });
        };
        WorkbenchThemeService.prototype.hasCustomizationChanged = function (newColorCustomizations, newColorIds, newTokenColorCustomizations) {
            if (newColorIds.length !== this.numberOfColorCustomizations) {
                return true;
            }
            for (var _i = 0, newColorIds_1 = newColorIds; _i < newColorIds_1.length; _i++) {
                var key = newColorIds_1[_i];
                var color = this.colorCustomizations[key];
                if (!color || color !== newColorCustomizations[key]) {
                    return true;
                }
            }
            if (!objects.equals(newTokenColorCustomizations, this.tokenColorCustomizations)) {
                return true;
            }
            return false;
        };
        WorkbenchThemeService.prototype.updateColorCustomizations = function (notify) {
            if (notify === void 0) { notify = true; }
            var newColorCustomizations = this.configurationService.lookup(workbenchThemeService_1.CUSTOM_WORKBENCH_COLORS_SETTING).value || {};
            var newColorIds = Object.keys(newColorCustomizations);
            if (newColorIds.length === 0) {
                newColorCustomizations = this.configurationService.lookup(workbenchThemeService_1.DEPRECATED_CUSTOM_COLORS_SETTING).value || {};
                newColorIds = Object.keys(newColorCustomizations);
            }
            var newTokenColorCustomizations = this.configurationService.lookup(workbenchThemeService_1.CUSTOM_EDITOR_COLORS_SETTING).value || {};
            if (this.hasCustomizationChanged(newColorCustomizations, newColorIds, newTokenColorCustomizations)) {
                this.colorCustomizations = newColorCustomizations;
                this.numberOfColorCustomizations = newColorIds.length;
                this.tokenColorCustomizations = newTokenColorCustomizations;
                if (this.currentColorTheme) {
                    this.currentColorTheme.setCustomColors(newColorCustomizations);
                    this.currentColorTheme.setCustomTokenColors(newTokenColorCustomizations);
                    if (notify) {
                        this.updateDynamicCSSRules(this.currentColorTheme);
                        this.onColorThemeChange.fire(this.currentColorTheme);
                    }
                }
            }
        };
        WorkbenchThemeService.prototype.onThemes = function (extensionFolderPath, extensionData, themes, collector) {
            var _this = this;
            if (!Array.isArray(themes)) {
                collector.error(nls.localize('reqarray', "Extension point `{0}` must be an array.", themesExtPoint.name));
                return;
            }
            themes.forEach(function (theme) {
                if (!theme.path || !types.isString(theme.path)) {
                    collector.error(nls.localize('reqpath', "Expected string in `contributes.{0}.path`. Provided value: {1}", themesExtPoint.name, String(theme.path)));
                    return;
                }
                var normalizedAbsolutePath = Paths.normalize(Paths.join(extensionFolderPath, theme.path));
                if (normalizedAbsolutePath.indexOf(Paths.normalize(extensionFolderPath)) !== 0) {
                    collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", themesExtPoint.name, normalizedAbsolutePath, extensionFolderPath));
                }
                var themeData = colorThemeData_1.fromExtensionTheme(theme, normalizedAbsolutePath, extensionData);
                _this.extensionsColorThemes.push(themeData);
                colorThemeSettingSchema.enum.push(themeData.settingsId);
                colorThemeSettingSchema.enumDescriptions.push(themeData.description || '');
            });
        };
        WorkbenchThemeService.prototype.onIconThemes = function (extensionFolderPath, extensionData, iconThemes, collector) {
            var _this = this;
            if (!Array.isArray(iconThemes)) {
                collector.error(nls.localize('reqarray', "Extension point `{0}` must be an array.", themesExtPoint.name));
                return;
            }
            iconThemes.forEach(function (iconTheme) {
                if (!iconTheme.path || !types.isString(iconTheme.path)) {
                    collector.error(nls.localize('reqpath', "Expected string in `contributes.{0}.path`. Provided value: {1}", themesExtPoint.name, String(iconTheme.path)));
                    return;
                }
                if (!iconTheme.id || !types.isString(iconTheme.id)) {
                    collector.error(nls.localize('reqid', "Expected string in `contributes.{0}.id`. Provided value: {1}", themesExtPoint.name, String(iconTheme.path)));
                    return;
                }
                var normalizedAbsolutePath = Paths.normalize(Paths.join(extensionFolderPath, iconTheme.path));
                if (normalizedAbsolutePath.indexOf(Paths.normalize(extensionFolderPath)) !== 0) {
                    collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", themesExtPoint.name, normalizedAbsolutePath, extensionFolderPath));
                }
                var themeData = {
                    id: extensionData.extensionId + '-' + iconTheme.id,
                    label: iconTheme.label || Paths.basename(iconTheme.path),
                    settingsId: iconTheme.id,
                    description: iconTheme.description,
                    path: normalizedAbsolutePath,
                    extensionData: extensionData,
                    isLoaded: false
                };
                _this.knownIconThemes.push(themeData);
                iconThemeSettingSchema.enum.push(themeData.settingsId);
                iconThemeSettingSchema.enumDescriptions.push(themeData.description || '');
            });
        };
        WorkbenchThemeService.prototype.sendTelemetry = function (themeId, themeData, themeType) {
            if (themeData) {
                var key = themeType + themeData.extensionId;
                if (!this.themeExtensionsActivated.get(key)) {
                    this.telemetryService.publicLog('activatePlugin', {
                        id: themeData.extensionId,
                        name: themeData.extensionName,
                        isBuiltin: themeData.extensionIsBuiltin,
                        publisherDisplayName: themeData.extensionPublisher,
                        themeId: themeId
                    });
                    this.themeExtensionsActivated.set(key, true);
                }
            }
        };
        WorkbenchThemeService.prototype.getFileIconThemes = function () {
            var _this = this;
            return this.extensionService.onReady().then(function (isReady) {
                return _this.knownIconThemes;
            });
        };
        WorkbenchThemeService.prototype.getFileIconTheme = function () {
            return this.currentIconTheme;
        };
        WorkbenchThemeService.prototype.setFileIconTheme = function (iconTheme, settingsTarget) {
            var _this = this;
            iconTheme = iconTheme || '';
            if (iconTheme === this.currentIconTheme.id && this.currentIconTheme.isLoaded) {
                return this.writeFileIconConfiguration(settingsTarget);
            }
            var onApply = function (newIconTheme) {
                if (newIconTheme) {
                    _this.currentIconTheme = newIconTheme;
                }
                else {
                    _this.currentIconTheme = noFileIconTheme;
                }
                if (_this.container) {
                    if (newIconTheme) {
                        builder_1.$(_this.container).addClass(fileIconsEnabledClass);
                    }
                    else {
                        builder_1.$(_this.container).removeClass(fileIconsEnabledClass);
                    }
                }
                if (newIconTheme) {
                    _this.sendTelemetry(newIconTheme.id, newIconTheme.extensionData, 'fileIcon');
                }
                _this.onFileIconThemeChange.fire(_this.currentIconTheme);
                return _this.writeFileIconConfiguration(settingsTarget);
            };
            return this._findIconThemeData(iconTheme).then(function (iconThemeData) {
                return _applyIconTheme(iconThemeData, onApply);
            });
        };
        WorkbenchThemeService.prototype.writeFileIconConfiguration = function (settingsTarget) {
            var _this = this;
            if (!types.isUndefinedOrNull(settingsTarget)) {
                return this.configurationWriter.writeConfiguration(workbenchThemeService_1.ICON_THEME_SETTING, this.currentIconTheme.settingsId, settingsTarget).then(function (_) { return _this.currentIconTheme; });
            }
            return winjs_base_1.TPromise.as(this.currentIconTheme);
        };
        Object.defineProperty(WorkbenchThemeService.prototype, "configurationWriter", {
            get: function () {
                // separate out the ConfigurationWriter to avoid a dependency of the IConfigurationEditingService
                if (!this._configurationWriter) {
                    this._configurationWriter = this.instantiationService.createInstance(ConfigurationWriter);
                }
                return this._configurationWriter;
            },
            enumerable: true,
            configurable: true
        });
        WorkbenchThemeService.prototype._findIconThemeData = function (iconTheme) {
            return this.getFileIconThemes().then(function (allIconSets) {
                for (var _i = 0, allIconSets_1 = allIconSets; _i < allIconSets_1.length; _i++) {
                    var iconSet = allIconSets_1[_i];
                    if (iconSet.id === iconTheme) {
                        return iconSet;
                    }
                }
                return null;
            });
        };
        WorkbenchThemeService.prototype.findIconThemeBySettingsId = function (settingsId) {
            return this.getFileIconThemes().then(function (allIconSets) {
                for (var _i = 0, allIconSets_2 = allIconSets; _i < allIconSets_2.length; _i++) {
                    var iconSet = allIconSets_2[_i];
                    if (iconSet.settingsId === settingsId) {
                        return iconSet;
                    }
                }
                return null;
            });
        };
        WorkbenchThemeService = __decorate([
            __param(1, extensions_1.IExtensionService),
            __param(2, storage_1.IStorageService),
            __param(3, broadcastService_1.IBroadcastService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, environment_1.IEnvironmentService),
            __param(6, message_1.IMessageService),
            __param(7, telemetry_1.ITelemetryService),
            __param(8, instantiation_1.IInstantiationService)
        ], WorkbenchThemeService);
        return WorkbenchThemeService;
    }());
    exports.WorkbenchThemeService = WorkbenchThemeService;
    function _applyIconTheme(data, onApply) {
        if (!data) {
            _applyRules('', iconThemeRulesClassName);
            return winjs_base_1.TPromise.as(onApply(data));
        }
        if (data.styleSheetContent) {
            _applyRules(data.styleSheetContent, iconThemeRulesClassName);
            return winjs_base_1.TPromise.as(onApply(data));
        }
        return _loadIconThemeDocument(data.path).then(function (iconThemeDocument) {
            var result = _processIconThemeDocument(data.id, data.path, iconThemeDocument);
            data.styleSheetContent = result.content;
            data.hasFileIcons = result.hasFileIcons;
            data.hasFolderIcons = result.hasFolderIcons;
            data.isLoaded = true;
            _applyRules(data.styleSheetContent, iconThemeRulesClassName);
            return onApply(data);
        }, function (error) {
            return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotloadicontheme', "Unable to load {0}", data.path)));
        });
    }
    function _loadIconThemeDocument(fileSetPath) {
        return pfs.readFile(fileSetPath).then(function (content) {
            var errors = [];
            var contentValue = Json.parse(content.toString(), errors);
            if (errors.length > 0) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotparseicontheme', "Problems parsing file icons file: {0}", errors.map(function (e) { return jsonErrorMessages_1.getParseErrorMessage(e.error); }).join(', '))));
            }
            return winjs_base_1.TPromise.as(contentValue);
        });
    }
    function _processIconThemeDocument(id, iconThemeDocumentPath, iconThemeDocument) {
        var result = { content: '', hasFileIcons: false, hasFolderIcons: false };
        if (!iconThemeDocument.iconDefinitions) {
            return result;
        }
        var selectorByDefinitionId = {};
        function resolvePath(path) {
            var uri = uri_1.default.file(Paths.join(Paths.dirname(iconThemeDocumentPath), path));
            return uri.toString();
        }
        function collectSelectors(associations, baseThemeClassName) {
            function addSelector(selector, defId) {
                if (defId) {
                    var list = selectorByDefinitionId[defId];
                    if (!list) {
                        list = selectorByDefinitionId[defId] = [];
                    }
                    list.push(selector);
                }
            }
            if (associations) {
                var qualifier = '.show-file-icons';
                if (baseThemeClassName) {
                    qualifier = baseThemeClassName + ' ' + qualifier;
                }
                var expanded = '.monaco-tree-row.expanded'; // workaround for #11453
                if (associations.folder) {
                    addSelector(qualifier + " .folder-icon::before", associations.folder);
                    result.hasFolderIcons = true;
                }
                if (associations.folderExpanded) {
                    addSelector(qualifier + " " + expanded + " .folder-icon::before", associations.folderExpanded);
                    result.hasFolderIcons = true;
                }
                var rootFolder = associations.rootFolder || associations.folder;
                var rootFolderExpanded = associations.rootFolderExpanded || associations.folderExpanded;
                if (rootFolder) {
                    addSelector(qualifier + " .rootfolder-icon::before", rootFolder);
                    result.hasFolderIcons = true;
                }
                if (rootFolderExpanded) {
                    addSelector(qualifier + " " + expanded + " .rootfolder-icon::before", rootFolderExpanded);
                    result.hasFolderIcons = true;
                }
                if (associations.file) {
                    addSelector(qualifier + " .file-icon::before", associations.file);
                    result.hasFileIcons = true;
                }
                var folderNames = associations.folderNames;
                if (folderNames) {
                    for (var folderName in folderNames) {
                        addSelector(qualifier + " ." + escapeCSS(folderName.toLowerCase()) + "-name-folder-icon.folder-icon::before", folderNames[folderName]);
                        result.hasFolderIcons = true;
                    }
                }
                var folderNamesExpanded = associations.folderNamesExpanded;
                if (folderNamesExpanded) {
                    for (var folderName in folderNamesExpanded) {
                        addSelector(qualifier + " " + expanded + " ." + escapeCSS(folderName.toLowerCase()) + "-name-folder-icon.folder-icon::before", folderNamesExpanded[folderName]);
                        result.hasFolderIcons = true;
                    }
                }
                var languageIds = associations.languageIds;
                if (languageIds) {
                    for (var languageId in languageIds) {
                        addSelector(qualifier + " ." + escapeCSS(languageId) + "-lang-file-icon.file-icon::before", languageIds[languageId]);
                        result.hasFileIcons = true;
                    }
                }
                var fileExtensions = associations.fileExtensions;
                if (fileExtensions) {
                    for (var fileExtension in fileExtensions) {
                        var selectors = [];
                        var segments = fileExtension.toLowerCase().split('.');
                        for (var i = 0; i < segments.length; i++) {
                            selectors.push("." + escapeCSS(segments.slice(i).join('.')) + "-ext-file-icon");
                        }
                        addSelector(qualifier + " " + selectors.join('') + ".file-icon::before", fileExtensions[fileExtension]);
                        result.hasFileIcons = true;
                    }
                }
                var fileNames = associations.fileNames;
                if (fileNames) {
                    for (var fileName in fileNames) {
                        var selectors = [];
                        fileName = fileName.toLowerCase();
                        selectors.push("." + escapeCSS(fileName) + "-name-file-icon");
                        var segments = fileName.split('.');
                        for (var i = 1; i < segments.length; i++) {
                            selectors.push("." + escapeCSS(segments.slice(i).join('.')) + "-ext-file-icon");
                        }
                        addSelector(qualifier + " " + selectors.join('') + ".file-icon::before", fileNames[fileName]);
                        result.hasFileIcons = true;
                    }
                }
            }
        }
        collectSelectors(iconThemeDocument);
        collectSelectors(iconThemeDocument.light, '.vs');
        collectSelectors(iconThemeDocument.highContrast, '.hc-black');
        if (!result.hasFileIcons && !result.hasFolderIcons) {
            return result;
        }
        var cssRules = [];
        var fonts = iconThemeDocument.fonts;
        if (Array.isArray(fonts)) {
            fonts.forEach(function (font) {
                var src = font.src.map(function (l) { return "url('" + resolvePath(l.path) + "') format('" + l.format + "')"; }).join(', ');
                cssRules.push("@font-face { src: " + src + "; font-family: '" + font.id + "'; font-weigth: " + font.weight + "; font-style: " + font.style + "; }");
            });
            cssRules.push(".show-file-icons .file-icon::before, .show-file-icons .folder-icon::before, .show-file-icons .rootfolder-icon::before { font-family: '" + fonts[0].id + "'; font-size: " + (fonts[0].size || '150%') + "}");
        }
        for (var defId in selectorByDefinitionId) {
            var selectors = selectorByDefinitionId[defId];
            var definition = iconThemeDocument.iconDefinitions[defId];
            if (definition) {
                if (definition.iconPath) {
                    cssRules.push(selectors.join(', ') + " { content: ' '; background-image: url(\"" + resolvePath(definition.iconPath) + "\"); }");
                }
                if (definition.fontCharacter || definition.fontColor) {
                    var body = '';
                    if (definition.fontColor) {
                        body += " color: " + definition.fontColor + ";";
                    }
                    if (definition.fontCharacter) {
                        body += " content: '" + definition.fontCharacter + "';";
                    }
                    if (definition.fontSize) {
                        body += " font-size: " + definition.fontSize + ";";
                    }
                    if (definition.fontId) {
                        body += " font-family: " + definition.fontId + ";";
                    }
                    cssRules.push(selectors.join(', ') + " { " + body + " }");
                }
            }
        }
        result.content = cssRules.join('\n');
        return result;
    }
    function escapeCSS(str) {
        return window['CSS'].escape(str);
    }
    var colorThemeRulesClassName = 'contributedColorTheme';
    var iconThemeRulesClassName = 'contributedIconTheme';
    function _applyRules(styleSheetContent, rulesClassName) {
        var themeStyles = document.head.getElementsByClassName(rulesClassName);
        if (themeStyles.length === 0) {
            var elStyle = document.createElement('style');
            elStyle.type = 'text/css';
            elStyle.className = rulesClassName;
            elStyle.innerHTML = styleSheetContent;
            document.head.appendChild(elStyle);
        }
        else {
            themeStyles[0].innerHTML = styleSheetContent;
        }
    }
    colorThemeSchema.register();
    fileIconThemeSchema.register();
    var ConfigurationWriter = (function () {
        function ConfigurationWriter(configurationService, configurationEditingService) {
            this.configurationService = configurationService;
            this.configurationEditingService = configurationEditingService;
        }
        ConfigurationWriter.prototype.writeConfiguration = function (key, value, settingsTarget) {
            var settings = this.configurationService.lookup(key);
            if (settingsTarget === configurationEditing_1.ConfigurationTarget.USER) {
                if (value === settings.user) {
                    return winjs_base_1.TPromise.as(null); // nothing to do
                }
                else if (value === settings.default) {
                    if (types.isUndefined(settings.user)) {
                        return winjs_base_1.TPromise.as(null); // nothing to do
                    }
                    value = void 0; // remove configuration from user settings
                }
            }
            else if (settingsTarget === configurationEditing_1.ConfigurationTarget.WORKSPACE) {
                if (value === settings.value) {
                    return winjs_base_1.TPromise.as(null); // nothing to do
                }
            }
            return this.configurationEditingService.writeConfiguration(settingsTarget, { key: key, value: value });
        };
        ConfigurationWriter = __decorate([
            __param(0, configuration_1.IConfigurationService), __param(1, configurationEditing_1.IConfigurationEditingService)
        ], ConfigurationWriter);
        return ConfigurationWriter;
    }());
    // Configuration: Themes
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    var colorThemeSettingSchema = {
        type: 'string',
        description: nls.localize('colorTheme', "Specifies the color theme used in the workbench."),
        default: DEFAULT_THEME_SETTING_VALUE,
        enum: [],
        enumDescriptions: [],
        errorMessage: nls.localize('colorThemeError', "Theme is unknown or not installed."),
    };
    var iconThemeSettingSchema = {
        type: ['string', 'null'],
        default: DEFAULT_ICON_THEME_SETTING_VALUE,
        description: nls.localize('iconTheme', "Specifies the icon theme used in the workbench or 'null' to not show any file icons."),
        enum: [null],
        enumDescriptions: [nls.localize('noIconThemeDesc', 'No file icons')],
        errorMessage: nls.localize('iconThemeError', "File icon theme is unknown or not installed.")
    };
    var colorCustomizationsSchema = {
        type: ['object'],
        description: nls.localize('workbenchColors', "Overrides colors from the currently selected color theme."),
        properties: colorThemeSchema.colorsSchema.properties,
        default: {},
        defaultSnippets: [{
                body: {
                    'statusBar.background': '#666666',
                    'panel.background': '#555555',
                    'sideBar.background': '#444444'
                }
            }]
    };
    var deprecatedColorCustomizationsSchema = objects.mixin({
        deprecationMessage: nls.localize('workbenchColors.deprecated', "The setting is no longer experimental and has been renamed to 'workbench.colorCustomizations'"),
        description: nls.localize('workbenchColors.deprecatedDescription', "Use 'workbench.colorCustomizations' instead")
    }, colorCustomizationsSchema, false);
    configurationRegistry.registerConfiguration({
        id: 'workbench',
        order: 7.1,
        type: 'object',
        properties: (_a = {},
            _a[workbenchThemeService_1.COLOR_THEME_SETTING] = colorThemeSettingSchema,
            _a[workbenchThemeService_1.ICON_THEME_SETTING] = iconThemeSettingSchema,
            _a[workbenchThemeService_1.CUSTOM_WORKBENCH_COLORS_SETTING] = colorCustomizationsSchema,
            _a[workbenchThemeService_1.DEPRECATED_CUSTOM_COLORS_SETTING] = deprecatedColorCustomizationsSchema,
            _a)
    });
    function tokenGroupSettings(description) {
        return {
            description: description,
            default: '#FF0000',
            anyOf: [
                {
                    type: 'string',
                    format: 'color',
                    defaultSnippets: [{ body: '#FF0000' }]
                },
                colorThemeSchema.tokenColorizationSettingSchema
            ]
        };
    }
    ;
    configurationRegistry.registerConfiguration({
        id: 'editor',
        order: 7.2,
        type: 'object',
        properties: (_b = {},
            _b[workbenchThemeService_1.CUSTOM_EDITOR_COLORS_SETTING] = {
                description: nls.localize('editorColors', "Overrides editor colors and font style from the currently selected color theme."),
                default: {},
                properties: (_c = {
                        comments: tokenGroupSettings(nls.localize('editorColors.comments', "Sets the colors and styles for comments")),
                        strings: tokenGroupSettings(nls.localize('editorColors.strings', "Sets the colors and styles for strings literals.")),
                        keywords: tokenGroupSettings(nls.localize('editorColors.keywords', "Sets the colors and styles for keywords.")),
                        numbers: tokenGroupSettings(nls.localize('editorColors.numbers', "Sets the colors and styles for number literals.")),
                        types: tokenGroupSettings(nls.localize('editorColors.types', "Sets the colors and styles for type declarations and references.")),
                        functions: tokenGroupSettings(nls.localize('editorColors.functions', "Sets the colors and styles for functions declarations and references.")),
                        variables: tokenGroupSettings(nls.localize('editorColors.variables', "Sets the colors and styles for variables declarations and references."))
                    },
                    _c[workbenchThemeService_1.CUSTOM_EDITOR_SCOPE_COLORS_SETTING] = colorThemeSchema.tokenColorsSchema(nls.localize('editorColors.textMateRules', 'Sets colors and styles using textmate theming rules (advanced).')),
                    _c)
            },
            _b)
    });
    var _a, _b, _c;
});
//# sourceMappingURL=workbenchThemeService.js.map