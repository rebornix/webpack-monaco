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
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/paths", "vs/base/common/mime", "vs/platform/extensions/common/extensions", "vs/platform/extensions/common/extensionsRegistry", "vs/editor/common/modes/modesRegistry", "vs/platform/configuration/common/configuration", "vs/editor/common/services/modeServiceImpl"], function (require, exports, nls, errors_1, paths, mime, extensions_1, extensionsRegistry_1, modesRegistry_1, configuration_1, modeServiceImpl_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.languagesExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('languages', [], {
        description: nls.localize('vscode.extension.contributes.languages', 'Contributes language declarations.'),
        type: 'array',
        items: {
            type: 'object',
            defaultSnippets: [{ body: { id: '${1:languageId}', aliases: ['${2:label}'], extensions: ['${3:extension}'], configuration: './language-configuration.json' } }],
            properties: {
                id: {
                    description: nls.localize('vscode.extension.contributes.languages.id', 'ID of the language.'),
                    type: 'string'
                },
                aliases: {
                    description: nls.localize('vscode.extension.contributes.languages.aliases', 'Name aliases for the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                extensions: {
                    description: nls.localize('vscode.extension.contributes.languages.extensions', 'File extensions associated to the language.'),
                    default: ['.foo'],
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                filenames: {
                    description: nls.localize('vscode.extension.contributes.languages.filenames', 'File names associated to the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                filenamePatterns: {
                    description: nls.localize('vscode.extension.contributes.languages.filenamePatterns', 'File name glob patterns associated to the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                mimetypes: {
                    description: nls.localize('vscode.extension.contributes.languages.mimetypes', 'Mime types associated to the language.'),
                    type: 'array',
                    items: {
                        type: 'string'
                    }
                },
                firstLine: {
                    description: nls.localize('vscode.extension.contributes.languages.firstLine', 'A regular expression matching the first line of a file of the language.'),
                    type: 'string'
                },
                configuration: {
                    description: nls.localize('vscode.extension.contributes.languages.configuration', 'A relative path to a file containing configuration options for the language.'),
                    type: 'string',
                    default: './language-configuration.json'
                }
            }
        }
    });
    var WorkbenchModeServiceImpl = (function (_super) {
        __extends(WorkbenchModeServiceImpl, _super);
        function WorkbenchModeServiceImpl(extensionService, configurationService) {
            var _this = _super.call(this) || this;
            _this._configurationService = configurationService;
            _this._extensionService = extensionService;
            exports.languagesExtPoint.setHandler(function (extensions) {
                var allValidLanguages = [];
                for (var i = 0, len = extensions.length; i < len; i++) {
                    var extension = extensions[i];
                    if (!Array.isArray(extension.value)) {
                        extension.collector.error(nls.localize('invalid', "Invalid `contributes.{0}`. Expected an array.", exports.languagesExtPoint.name));
                        continue;
                    }
                    for (var j = 0, lenJ = extension.value.length; j < lenJ; j++) {
                        var ext = extension.value[j];
                        if (isValidLanguageExtensionPoint(ext, extension.collector)) {
                            var configuration = (ext.configuration ? paths.join(extension.description.extensionFolderPath, ext.configuration) : ext.configuration);
                            allValidLanguages.push({
                                id: ext.id,
                                extensions: ext.extensions,
                                filenames: ext.filenames,
                                filenamePatterns: ext.filenamePatterns,
                                firstLine: ext.firstLine,
                                aliases: ext.aliases,
                                mimetypes: ext.mimetypes,
                                configuration: configuration
                            });
                        }
                    }
                }
                modesRegistry_1.ModesRegistry.registerLanguages(allValidLanguages);
            });
            _this._configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationChange(_this._configurationService.getConfiguration()); });
            _this.onDidCreateMode(function (mode) {
                _this._extensionService.activateByEvent("onLanguage:" + mode.getId()).done(null, errors_1.onUnexpectedError);
            });
            return _this;
        }
        WorkbenchModeServiceImpl.prototype._onReady = function () {
            var _this = this;
            if (!this._onReadyPromise) {
                var configuration_2 = this._configurationService.getConfiguration();
                this._onReadyPromise = this._extensionService.onReady().then(function () {
                    _this.onConfigurationChange(configuration_2);
                    return true;
                });
            }
            return this._onReadyPromise;
        };
        WorkbenchModeServiceImpl.prototype.onConfigurationChange = function (configuration) {
            var _this = this;
            // Clear user configured mime associations
            mime.clearTextMimes(true /* user configured */);
            // Register based on settings
            if (configuration.files && configuration.files.associations) {
                Object.keys(configuration.files.associations).forEach(function (pattern) {
                    var langId = configuration.files.associations[pattern];
                    var mimetype = _this.getMimeForMode(langId) || "text/x-" + langId;
                    mime.registerTextMime({ id: langId, mime: mimetype, filepattern: pattern, userConfigured: true });
                });
            }
        };
        WorkbenchModeServiceImpl = __decorate([
            __param(0, extensions_1.IExtensionService),
            __param(1, configuration_1.IConfigurationService)
        ], WorkbenchModeServiceImpl);
        return WorkbenchModeServiceImpl;
    }(modeServiceImpl_1.ModeServiceImpl));
    exports.WorkbenchModeServiceImpl = WorkbenchModeServiceImpl;
    function isUndefinedOrStringArray(value) {
        if (typeof value === 'undefined') {
            return true;
        }
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every(function (item) { return typeof item === 'string'; });
    }
    function isValidLanguageExtensionPoint(value, collector) {
        if (!value) {
            collector.error(nls.localize('invalid.empty', "Empty value for `contributes.{0}`", exports.languagesExtPoint.name));
            return false;
        }
        if (typeof value.id !== 'string') {
            collector.error(nls.localize('require.id', "property `{0}` is mandatory and must be of type `string`", 'id'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.extensions)) {
            collector.error(nls.localize('opt.extensions', "property `{0}` can be omitted and must be of type `string[]`", 'extensions'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.filenames)) {
            collector.error(nls.localize('opt.filenames', "property `{0}` can be omitted and must be of type `string[]`", 'filenames'));
            return false;
        }
        if (typeof value.firstLine !== 'undefined' && typeof value.firstLine !== 'string') {
            collector.error(nls.localize('opt.firstLine', "property `{0}` can be omitted and must be of type `string`", 'firstLine'));
            return false;
        }
        if (typeof value.configuration !== 'undefined' && typeof value.configuration !== 'string') {
            collector.error(nls.localize('opt.configuration', "property `{0}` can be omitted and must be of type `string`", 'configuration'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.aliases)) {
            collector.error(nls.localize('opt.aliases', "property `{0}` can be omitted and must be of type `string[]`", 'aliases'));
            return false;
        }
        if (!isUndefinedOrStringArray(value.mimetypes)) {
            collector.error(nls.localize('opt.mimetypes', "property `{0}` can be omitted and must be of type `string[]`", 'mimetypes'));
            return false;
        }
        return true;
    }
});
//# sourceMappingURL=workbenchModeService.js.map