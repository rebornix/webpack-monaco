/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/paths", "vs/base/common/json", "vs/base/common/color", "vs/workbench/services/themes/common/workbenchThemeService", "vs/workbench/services/themes/electron-browser/themeCompatibility", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/types", "vs/base/common/objects", "fast-plist", "vs/base/node/pfs", "vs/platform/theme/common/colorRegistry", "vs/platform/registry/common/platform", "vs/base/common/jsonErrorMessages"], function (require, exports, Paths, Json, color_1, workbenchThemeService_1, themeCompatibility_1, winjs_base_1, nls, types, objects, plist, pfs, colorRegistry_1, platform_1, jsonErrorMessages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var colorRegistry = platform_1.Registry.as(colorRegistry_1.Extensions.ColorContribution);
    var tokenGroupToScopesMap = {
        comments: 'comment',
        strings: 'string',
        keywords: 'keyword',
        numbers: 'constant.numeric',
        types: 'entity.name.type',
        functions: 'entity.name.function',
        variables: 'variable'
    };
    var ColorThemeData = (function () {
        function ColorThemeData() {
            this.themeTokenColors = [];
            this.customTokenColors = [];
            this.colorMap = {};
            this.customColorMap = {};
        }
        Object.defineProperty(ColorThemeData.prototype, "tokenColors", {
            get: function () {
                // Add the custom colors after the theme colors
                // so that they will override them
                return this.themeTokenColors.concat(this.customTokenColors);
            },
            enumerable: true,
            configurable: true
        });
        ColorThemeData.prototype.getColor = function (colorId, useDefault) {
            var color = this.customColorMap[colorId];
            if (color) {
                return color;
            }
            color = this.colorMap[colorId];
            if (useDefault !== false && types.isUndefined(color)) {
                color = this.getDefault(colorId);
            }
            return color;
        };
        ColorThemeData.prototype.getDefault = function (colorId) {
            return colorRegistry.resolveDefaultColor(colorId, this);
        };
        ColorThemeData.prototype.defines = function (colorId) {
            return this.customColorMap.hasOwnProperty(colorId) || this.colorMap.hasOwnProperty(colorId);
        };
        ColorThemeData.prototype.setCustomColors = function (colors) {
            this.customColorMap = {};
            for (var id in colors) {
                var colorVal = colors[id];
                if (typeof colorVal === 'string') {
                    this.customColorMap[id] = color_1.Color.fromHex(colorVal);
                }
            }
            if (this.themeTokenColors && this.themeTokenColors.length) {
                updateDefaultRuleSettings(this.themeTokenColors[0], this);
            }
        };
        ColorThemeData.prototype.setCustomTokenColors = function (customTokenColors) {
            var generalRules = [];
            var value, settings, scope;
            Object.keys(tokenGroupToScopesMap).forEach(function (key) {
                value = customTokenColors[key];
                settings = typeof value === 'string'
                    ? { foreground: value }
                    : value;
                scope = tokenGroupToScopesMap[key];
                if (!settings) {
                    return;
                }
                generalRules.push({
                    scope: scope,
                    settings: settings
                });
            });
            var textMateRules = customTokenColors.textMateRules || [];
            // Put the general customizations such as comments, strings, etc. first so that
            // they can be overriden by specific customizations like "string.interpolated"
            this.customTokenColors = generalRules.concat(textMateRules);
        };
        ColorThemeData.prototype.ensureLoaded = function (themeService) {
            var _this = this;
            if (!this.isLoaded) {
                this.themeTokenColors = [];
                this.colorMap = {};
                if (this.path) {
                    return _loadColorThemeFromFile(this.path, this.themeTokenColors, this.colorMap).then(function (_) {
                        _this.isLoaded = true;
                        _sanitizeTokenColors(_this);
                    });
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        ColorThemeData.prototype.toThemeFile = function () {
            if (!this.isLoaded) {
                return '';
            }
            var content = { name: this.label, colors: {}, tokenColors: this.tokenColors };
            for (var key in this.colorMap) {
                content.colors[key] = color_1.Color.Format.CSS.formatHexA(this.colorMap[key], true);
            }
            return JSON.stringify(content, null, '\t');
        };
        ColorThemeData.prototype.toStorageData = function () {
            var colorMapData = {};
            for (var key in this.colorMap) {
                colorMapData[key] = color_1.Color.Format.CSS.formatHexA(this.colorMap[key], true);
            }
            // no need to persist custom colors, they will be taken from the settings
            return JSON.stringify({
                id: this.id,
                label: this.label,
                settingsId: this.settingsId,
                selector: this.id.split(' ').join('.'),
                themeTokenColors: this.themeTokenColors,
                extensionData: this.extensionData,
                colorMap: colorMapData
            });
        };
        ColorThemeData.prototype.hasEqualData = function (other) {
            return objects.equals(this.colorMap, other.colorMap) && objects.equals(this.tokenColors, other.tokenColors);
        };
        Object.defineProperty(ColorThemeData.prototype, "type", {
            get: function () {
                var baseTheme = this.id.split(' ')[0];
                switch (baseTheme) {
                    case workbenchThemeService_1.VS_LIGHT_THEME: return 'light';
                    case workbenchThemeService_1.VS_HC_THEME: return 'hc';
                    default: return 'dark';
                }
            },
            enumerable: true,
            configurable: true
        });
        return ColorThemeData;
    }());
    exports.ColorThemeData = ColorThemeData;
    function createUnloadedTheme(id) {
        var themeData = new ColorThemeData();
        themeData.id = id;
        themeData.label = '';
        themeData.settingsId = null;
        themeData.isLoaded = false;
        themeData.themeTokenColors = [{ settings: {} }];
        return themeData;
    }
    exports.createUnloadedTheme = createUnloadedTheme;
    function fromStorageData(input) {
        try {
            var data = JSON.parse(input);
            var theme = new ColorThemeData();
            for (var key in data) {
                switch (key) {
                    case 'colorMap':
                        var colorMapData = data[key];
                        for (var id in colorMapData) {
                            theme.colorMap[id] = color_1.Color.fromHex(colorMapData[id]);
                        }
                        break;
                    case 'themeTokenColors':
                    case 'id':
                    case 'label':
                    case 'settingsId':
                    case 'extensionData':
                        theme[key] = data[key];
                        break;
                }
            }
            return theme;
        }
        catch (e) {
            return null;
        }
    }
    exports.fromStorageData = fromStorageData;
    function fromExtensionTheme(theme, normalizedAbsolutePath, extensionData) {
        var baseTheme = theme['uiTheme'] || 'vs-dark';
        var themeSelector = toCSSSelector(extensionData.extensionId + '-' + Paths.normalize(theme.path));
        var themeData = new ColorThemeData();
        themeData.id = baseTheme + " " + themeSelector;
        themeData.label = theme.label || Paths.basename(theme.path);
        themeData.settingsId = theme.id || themeData.label;
        themeData.description = theme.description;
        themeData.path = normalizedAbsolutePath;
        themeData.extensionData = extensionData;
        themeData.isLoaded = false;
        return themeData;
    }
    exports.fromExtensionTheme = fromExtensionTheme;
    function toCSSSelector(str) {
        str = str.replace(/[^_\-a-zA-Z0-9]/g, '-');
        if (str.charAt(0).match(/[0-9\-]/)) {
            str = '_' + str;
        }
        return str;
    }
    function _loadColorThemeFromFile(themePath, resultRules, resultColors) {
        if (Paths.extname(themePath) === '.json') {
            return pfs.readFile(themePath).then(function (content) {
                var errors = [];
                var contentValue = Json.parse(content.toString(), errors);
                if (errors.length > 0) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotparsejson', "Problems parsing JSON theme file: {0}", errors.map(function (e) { return jsonErrorMessages_1.getParseErrorMessage(e.error); }).join(', '))));
                }
                var includeCompletes = winjs_base_1.TPromise.as(null);
                if (contentValue.include) {
                    includeCompletes = _loadColorThemeFromFile(Paths.join(Paths.dirname(themePath), contentValue.include), resultRules, resultColors);
                }
                return includeCompletes.then(function (_) {
                    if (Array.isArray(contentValue.settings)) {
                        themeCompatibility_1.convertSettings(contentValue.settings, resultRules, resultColors);
                        return null;
                    }
                    var colors = contentValue.colors;
                    if (colors) {
                        if (typeof colors !== 'object') {
                            return winjs_base_1.TPromise.wrapError(new Error(nls.localize({ key: 'error.invalidformat.colors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'colors' is not of type 'object'.", themePath)));
                        }
                        // new JSON color themes format
                        for (var colorId in colors) {
                            var colorHex = colors[colorId];
                            if (typeof colorHex === 'string') {
                                resultColors[colorId] = color_1.Color.fromHex(colors[colorId]);
                            }
                        }
                    }
                    var tokenColors = contentValue.tokenColors;
                    if (tokenColors) {
                        if (Array.isArray(tokenColors)) {
                            resultRules.push.apply(resultRules, tokenColors);
                            return null;
                        }
                        else if (typeof tokenColors === 'string') {
                            return _loadSyntaxTokensFromFile(Paths.join(Paths.dirname(themePath), tokenColors), resultRules, {});
                        }
                        else {
                            return winjs_base_1.TPromise.wrapError(new Error(nls.localize({ key: 'error.invalidformat.tokenColors', comment: ['{0} will be replaced by a path. Values in quotes should not be translated.'] }, "Problem parsing color theme file: {0}. Property 'tokenColors' should be either an array specifying colors or a path to a TextMate theme file", themePath)));
                        }
                    }
                    return null;
                });
            });
        }
        else {
            return _loadSyntaxTokensFromFile(themePath, resultRules, resultColors);
        }
    }
    function _loadSyntaxTokensFromFile(themePath, resultRules, resultColors) {
        return pfs.readFile(themePath).then(function (content) {
            try {
                var contentValue = plist.parse(content.toString());
                var settings = contentValue.settings;
                if (!Array.isArray(settings)) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.plist.invalidformat', "Problem parsing tmTheme file: {0}. 'settings' is not array.")));
                }
                themeCompatibility_1.convertSettings(settings, resultRules, resultColors);
                return winjs_base_1.TPromise.as(null);
            }
            catch (e) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotparse', "Problems parsing tmTheme file: {0}", e.message)));
            }
        }, function (error) {
            return winjs_base_1.TPromise.wrapError(new Error(nls.localize('error.cannotload', "Problems loading tmTheme file {0}: {1}", themePath, error.message)));
        });
    }
    /**
     * Place the default settings first and add add the token-info rules
     */
    function _sanitizeTokenColors(theme) {
        var hasDefaultTokens = false;
        var updatedTokenColors = [updateDefaultRuleSettings({ settings: {} }, theme)];
        theme.tokenColors.forEach(function (rule) {
            if (rule.scope) {
                if (rule.scope === 'token.info-token') {
                    hasDefaultTokens = true;
                }
                updatedTokenColors.push(rule);
            }
        });
        if (!hasDefaultTokens) {
            updatedTokenColors.push.apply(updatedTokenColors, defaultThemeColors[theme.type]);
        }
        theme.themeTokenColors = updatedTokenColors;
    }
    function updateDefaultRuleSettings(defaultRule, theme) {
        var foreground = theme.getColor(colorRegistry_1.editorForeground) || theme.getDefault(colorRegistry_1.editorForeground);
        var background = theme.getColor(colorRegistry_1.editorBackground) || theme.getDefault(colorRegistry_1.editorBackground);
        defaultRule.settings.foreground = color_1.Color.Format.CSS.formatHexA(foreground);
        defaultRule.settings.background = color_1.Color.Format.CSS.formatHexA(background);
        return defaultRule;
    }
    var defaultThemeColors = {
        'light': [
            { scope: 'token.info-token', settings: { foreground: '#316bcd' } },
            { scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
            { scope: 'token.error-token', settings: { foreground: '#cd3131' } },
            { scope: 'token.debug-token', settings: { foreground: '#800080' } }
        ],
        'dark': [
            { scope: 'token.info-token', settings: { foreground: '#6796e6' } },
            { scope: 'token.warn-token', settings: { foreground: '#cd9731' } },
            { scope: 'token.error-token', settings: { foreground: '#f44747' } },
            { scope: 'token.debug-token', settings: { foreground: '#b267e6' } }
        ],
        'hc': [
            { scope: 'token.info-token', settings: { foreground: '#6796e6' } },
            { scope: 'token.warn-token', settings: { foreground: '#008000' } },
            { scope: 'token.error-token', settings: { foreground: '#FF0000' } },
            { scope: 'token.debug-token', settings: { foreground: '#b267e6' } }
        ],
    };
});
//# sourceMappingURL=colorThemeData.js.map