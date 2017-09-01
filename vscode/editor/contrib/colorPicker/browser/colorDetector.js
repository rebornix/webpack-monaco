/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/color", "vs/base/common/hash", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/editor/browser/editorBrowserExtensions", "vs/editor/common/core/range", "vs/editor/common/modes", "vs/editor/common/services/codeEditorService", "vs/editor/contrib/colorPicker/common/color", "vs/platform/configuration/common/configuration"], function (require, exports, color_1, hash_1, lifecycle_1, winjs_base_1, editorBrowserExtensions_1, range_1, modes_1, codeEditorService_1, color_2, configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_DECORATORS = 500;
    var ColorDetector = (function () {
        function ColorDetector(_editor, _codeEditorService, _configurationService) {
            var _this = this;
            this._editor = _editor;
            this._codeEditorService = _codeEditorService;
            this._configurationService = _configurationService;
            this._globalToDispose = [];
            this._localToDispose = [];
            this._decorationsIds = [];
            this._colorRanges = new Map();
            this._colorDecoratorIds = [];
            this._decorationsTypes = {};
            this._globalToDispose.push(_editor.onDidChangeModel(function (e) {
                _this._isEnabled = _this.isEnabled();
                _this.onModelChanged();
            }));
            this._globalToDispose.push(_editor.onDidChangeModelLanguage(function (e) { return _this.onModelChanged(); }));
            this._globalToDispose.push(modes_1.ColorProviderRegistry.onDidChange(function (e) { return _this.onModelChanged(); }));
            this._globalToDispose.push(_editor.onDidChangeConfiguration(function (e) {
                var prevIsEnabled = _this._isEnabled;
                _this._isEnabled = _this.isEnabled();
                if (prevIsEnabled !== _this._isEnabled) {
                    if (_this._isEnabled) {
                        _this.onModelChanged();
                    }
                    else {
                        _this.removeAllDecorations();
                    }
                }
            }));
            this._timeoutPromise = null;
            this._computePromise = null;
            this._isEnabled = this.isEnabled();
            this.onModelChanged();
        }
        ColorDetector_1 = ColorDetector;
        ColorDetector.prototype.isEnabled = function () {
            var model = this._editor.getModel();
            if (!model) {
                return false;
            }
            var languageId = model.getLanguageIdentifier();
            // handle deprecated settings. [languageId].colorDecorators.enable
            var deprecatedConfig = this._configurationService.getConfiguration(languageId.language);
            if (deprecatedConfig) {
                var colorDecorators = deprecatedConfig['colorDecorators']; // deprecatedConfig.valueOf('.colorDecorators.enable');
                if (colorDecorators && colorDecorators['enable'] !== undefined && !colorDecorators['enable']) {
                    return colorDecorators['enable'];
                }
            }
            return this._editor.getConfiguration().contribInfo.colorDecorators;
        };
        ColorDetector.prototype.getId = function () {
            return ColorDetector_1.ID;
        };
        ColorDetector.get = function (editor) {
            return editor.getContribution(this.ID);
        };
        ColorDetector.prototype.dispose = function () {
            this.stop();
            this.removeAllDecorations();
            this._globalToDispose = lifecycle_1.dispose(this._globalToDispose);
        };
        ColorDetector.prototype.onModelChanged = function () {
            var _this = this;
            this.stop();
            if (!this._isEnabled) {
                return;
            }
            var model = this._editor.getModel();
            // if (!model) {
            // 	return;
            // }
            if (!modes_1.ColorProviderRegistry.has(model)) {
                return;
            }
            this._localToDispose.push(this._editor.onDidChangeModelContent(function (e) {
                if (!_this._timeoutPromise) {
                    _this._timeoutPromise = winjs_base_1.TPromise.timeout(ColorDetector_1.RECOMPUTE_TIME);
                    _this._timeoutPromise.then(function () {
                        _this._timeoutPromise = null;
                        _this.beginCompute();
                    });
                }
            }));
            this.beginCompute();
        };
        ColorDetector.prototype.beginCompute = function () {
            var _this = this;
            this._computePromise = color_2.getColors(this._editor.getModel()).then(function (colorInfos) {
                _this.updateDecorations(colorInfos);
                _this.updateColorDecorators(colorInfos);
                _this._computePromise = null;
            });
        };
        ColorDetector.prototype.stop = function () {
            if (this._timeoutPromise) {
                this._timeoutPromise.cancel();
                this._timeoutPromise = null;
            }
            if (this._computePromise) {
                this._computePromise.cancel();
                this._computePromise = null;
            }
            this._localToDispose = lifecycle_1.dispose(this._localToDispose);
        };
        ColorDetector.prototype.updateDecorations = function (colorInfos) {
            var _this = this;
            var decorations = colorInfos.map(function (c) { return ({
                range: {
                    startLineNumber: c.range.startLineNumber,
                    startColumn: c.range.startColumn,
                    endLineNumber: c.range.endLineNumber,
                    endColumn: c.range.endColumn
                },
                options: {}
            }); });
            var colorRanges = colorInfos.map(function (c) { return ({
                range: c.range,
                color: c.color,
                formatters: c.formatters
            }); });
            this._decorationsIds = this._editor.deltaDecorations(this._decorationsIds, decorations);
            this._colorRanges = new Map();
            this._decorationsIds.forEach(function (id, i) { return _this._colorRanges.set(id, colorRanges[i]); });
        };
        ColorDetector.prototype.updateColorDecorators = function (colorInfos) {
            var decorations = [];
            var newDecorationsTypes = {};
            for (var i = 0; i < colorInfos.length && decorations.length < MAX_DECORATORS; i++) {
                var _a = colorInfos[i].color, red = _a.red, green = _a.green, blue = _a.blue, alpha = _a.alpha;
                var rgba = new color_1.RGBA(Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255), alpha);
                var subKey = hash_1.hash(rgba).toString(16);
                var color = "rgba(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ", " + rgba.a + ")";
                var key = 'colorBox-' + subKey;
                if (!this._decorationsTypes[key] && !newDecorationsTypes[key]) {
                    this._codeEditorService.registerDecorationType(key, {
                        before: {
                            contentText: ' ',
                            border: 'solid 0.1em #000',
                            margin: '0.1em 0.2em 0 0.2em',
                            width: '0.8em',
                            height: '0.8em',
                            backgroundColor: color
                        },
                        dark: {
                            before: {
                                border: 'solid 0.1em #eee'
                            }
                        }
                    });
                }
                newDecorationsTypes[key] = true;
                decorations.push({
                    range: {
                        startLineNumber: colorInfos[i].range.startLineNumber,
                        startColumn: colorInfos[i].range.startColumn,
                        endLineNumber: colorInfos[i].range.endLineNumber,
                        endColumn: colorInfos[i].range.endColumn
                    },
                    options: this._codeEditorService.resolveDecorationOptions(key, true)
                });
            }
            for (var subType in this._decorationsTypes) {
                if (!newDecorationsTypes[subType]) {
                    this._codeEditorService.removeDecorationType(subType);
                }
            }
            this._colorDecoratorIds = this._editor.deltaDecorations(this._colorDecoratorIds, decorations);
        };
        ColorDetector.prototype.removeAllDecorations = function () {
            this._decorationsIds = this._editor.deltaDecorations(this._decorationsIds, []);
            this._colorDecoratorIds = this._editor.deltaDecorations(this._colorDecoratorIds, []);
            for (var subType in this._decorationsTypes) {
                this._codeEditorService.removeDecorationType(subType);
            }
        };
        ColorDetector.prototype.getColorRange = function (position) {
            var _this = this;
            var decorations = this._editor.getModel()
                .getDecorationsInRange(range_1.Range.fromPositions(position, position))
                .filter(function (d) { return _this._colorRanges.has(d.id); });
            if (decorations.length === 0) {
                return null;
            }
            return this._colorRanges.get(decorations[0].id);
        };
        ColorDetector.ID = 'editor.contrib.colorDetector';
        ColorDetector.RECOMPUTE_TIME = 1000; // ms
        ColorDetector = ColorDetector_1 = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, codeEditorService_1.ICodeEditorService),
            __param(2, configuration_1.IConfigurationService)
        ], ColorDetector);
        return ColorDetector;
        var ColorDetector_1;
    }());
    exports.ColorDetector = ColorDetector;
});
//# sourceMappingURL=colorDetector.js.map