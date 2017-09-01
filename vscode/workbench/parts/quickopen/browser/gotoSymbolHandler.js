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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/errors", "vs/base/common/types", "vs/base/common/strings", "vs/base/parts/quickopen/common/quickOpen", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/workbench/browser/quickopen", "vs/base/common/filters", "vs/editor/common/editorCommon", "vs/workbench/services/editor/common/editorService", "vs/platform/quickOpen/common/quickOpen", "vs/editor/contrib/quickOpen/common/quickOpen", "vs/editor/common/modes", "vs/editor/common/services/codeEditorService", "vs/platform/theme/common/themeService", "vs/editor/common/view/editorColorRegistry", "vs/css!./media/gotoSymbolHandler"], function (require, exports, winjs_base_1, nls, errors, types, strings, quickOpen_1, quickOpenModel_1, quickopen_1, filters, editorCommon_1, editorService_1, quickOpen_2, quickOpen_3, modes_1, codeEditorService_1, themeService_1, editorColorRegistry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GOTO_SYMBOL_PREFIX = '@';
    exports.SCOPE_PREFIX = ':';
    var GotoSymbolAction = (function (_super) {
        __extends(GotoSymbolAction, _super);
        function GotoSymbolAction(actionId, actionLabel, quickOpenService) {
            return _super.call(this, actionId, actionLabel, exports.GOTO_SYMBOL_PREFIX, quickOpenService) || this;
        }
        GotoSymbolAction.ID = 'workbench.action.gotoSymbol';
        GotoSymbolAction.LABEL = nls.localize('gotoSymbol', "Go to Symbol in File...");
        GotoSymbolAction = __decorate([
            __param(2, quickOpen_2.IQuickOpenService)
        ], GotoSymbolAction);
        return GotoSymbolAction;
    }(quickopen_1.QuickOpenAction));
    exports.GotoSymbolAction = GotoSymbolAction;
    var OutlineModel = (function (_super) {
        __extends(OutlineModel, _super);
        function OutlineModel(outline, entries) {
            var _this = _super.call(this, entries) || this;
            _this.outline = outline;
            return _this;
        }
        OutlineModel.prototype.applyFilter = function (searchValue) {
            // Normalize search
            var normalizedSearchValue = searchValue;
            if (searchValue.indexOf(exports.SCOPE_PREFIX) === 0) {
                normalizedSearchValue = normalizedSearchValue.substr(exports.SCOPE_PREFIX.length);
            }
            // Check for match and update visibility and group label
            this.entries.forEach(function (entry) {
                // Clear all state first
                entry.setGroupLabel(null);
                entry.setShowBorder(false);
                entry.setHighlights(null);
                entry.setHidden(false);
                // Filter by search
                if (normalizedSearchValue) {
                    var highlights = filters.matchesFuzzy(normalizedSearchValue, entry.getLabel());
                    if (highlights) {
                        entry.setHighlights(highlights);
                        entry.setHidden(false);
                    }
                    else if (!entry.isHidden()) {
                        entry.setHidden(true);
                    }
                }
            });
            // Sort properly if actually searching
            if (searchValue) {
                if (searchValue.indexOf(exports.SCOPE_PREFIX) === 0) {
                    this.entries.sort(this.sortScoped.bind(this, searchValue.toLowerCase()));
                }
                else {
                    this.entries.sort(this.sortNormal.bind(this, searchValue.toLowerCase()));
                }
            }
            else {
                this.entries.sort(function (a, b) { return a.getIndex() - b.getIndex(); });
            }
            // Mark all type groups
            var visibleResults = this.getEntries(true);
            if (visibleResults.length > 0 && searchValue.indexOf(exports.SCOPE_PREFIX) === 0) {
                var currentType = null;
                var currentResult = null;
                var typeCounter = 0;
                for (var i = 0; i < visibleResults.length; i++) {
                    var result = visibleResults[i];
                    // Found new type
                    if (currentType !== result.getType()) {
                        // Update previous result with count
                        if (currentResult) {
                            currentResult.setGroupLabel(this.renderGroupLabel(currentType, typeCounter, this.outline));
                        }
                        currentType = result.getType();
                        currentResult = result;
                        typeCounter = 1;
                        result.setShowBorder(i > 0);
                    }
                    else {
                        typeCounter++;
                    }
                }
                // Update previous result with count
                if (currentResult) {
                    currentResult.setGroupLabel(this.renderGroupLabel(currentType, typeCounter, this.outline));
                }
            }
            else if (visibleResults.length > 0) {
                visibleResults[0].setGroupLabel(nls.localize('symbols', "symbols ({0})", visibleResults.length));
            }
        };
        OutlineModel.prototype.sortNormal = function (searchValue, elementA, elementB) {
            // Handle hidden elements
            if (elementA.isHidden() && elementB.isHidden()) {
                return 0;
            }
            else if (elementA.isHidden()) {
                return 1;
            }
            else if (elementB.isHidden()) {
                return -1;
            }
            var elementAName = elementA.getLabel().toLowerCase();
            var elementBName = elementB.getLabel().toLowerCase();
            // Compare by name
            var r = elementAName.localeCompare(elementBName);
            if (r !== 0) {
                return r;
            }
            // If name identical sort by range instead
            var elementARange = elementA.getRange();
            var elementBRange = elementB.getRange();
            return elementARange.startLineNumber - elementBRange.startLineNumber;
        };
        OutlineModel.prototype.sortScoped = function (searchValue, elementA, elementB) {
            // Handle hidden elements
            if (elementA.isHidden() && elementB.isHidden()) {
                return 0;
            }
            else if (elementA.isHidden()) {
                return 1;
            }
            else if (elementB.isHidden()) {
                return -1;
            }
            // Remove scope char
            searchValue = searchValue.substr(exports.SCOPE_PREFIX.length);
            // Sort by type first if scoped search
            var elementAType = elementA.getType();
            var elementBType = elementB.getType();
            var r = elementAType.localeCompare(elementBType);
            if (r !== 0) {
                return r;
            }
            // Special sort when searching in scoped mode
            if (searchValue) {
                var elementAName = elementA.getLabel().toLowerCase();
                var elementBName = elementB.getLabel().toLowerCase();
                // Compare by name
                r = elementAName.localeCompare(elementBName);
                if (r !== 0) {
                    return r;
                }
            }
            // Default to sort by range
            var elementARange = elementA.getRange();
            var elementBRange = elementB.getRange();
            return elementARange.startLineNumber - elementBRange.startLineNumber;
        };
        OutlineModel.prototype.renderGroupLabel = function (type, count, outline) {
            var pattern = OutlineModel.getDefaultGroupLabelPatterns()[type];
            if (pattern) {
                return strings.format(pattern, count);
            }
            return type;
        };
        OutlineModel.getDefaultGroupLabelPatterns = function () {
            var result = Object.create(null);
            result['method'] = nls.localize('method', "methods ({0})");
            result['function'] = nls.localize('function', "functions ({0})");
            result['constructor'] = nls.localize('_constructor', "constructors ({0})");
            result['variable'] = nls.localize('variable', "variables ({0})");
            result['class'] = nls.localize('class', "classes ({0})");
            result['interface'] = nls.localize('interface', "interfaces ({0})");
            result['namespace'] = nls.localize('namespace', "namespaces ({0})");
            result['package'] = nls.localize('package', "packages ({0})");
            result['module'] = nls.localize('modules', "modules ({0})");
            result['property'] = nls.localize('property', "properties ({0})");
            result['enum'] = nls.localize('enum', "enumerations ({0})");
            result['string'] = nls.localize('string', "strings ({0})");
            result['rule'] = nls.localize('rule', "rules ({0})");
            result['file'] = nls.localize('file', "files ({0})");
            result['array'] = nls.localize('array', "arrays ({0})");
            result['number'] = nls.localize('number', "numbers ({0})");
            result['boolean'] = nls.localize('boolean', "booleans ({0})");
            result['object'] = nls.localize('object', "objects ({0})");
            result['key'] = nls.localize('key', "keys ({0})");
            return result;
        };
        return OutlineModel;
    }(quickOpenModel_1.QuickOpenModel));
    var SymbolEntry = (function (_super) {
        __extends(SymbolEntry, _super);
        function SymbolEntry(index, name, type, description, icon, range, highlights, editorService, handler) {
            var _this = _super.call(this) || this;
            _this.index = index;
            _this.name = name;
            _this.type = type;
            _this.icon = icon;
            _this.description = description;
            _this.range = range;
            _this.setHighlights(highlights);
            _this.editorService = editorService;
            _this.handler = handler;
            return _this;
        }
        SymbolEntry.prototype.getIndex = function () {
            return this.index;
        };
        SymbolEntry.prototype.getLabel = function () {
            return this.name;
        };
        SymbolEntry.prototype.getAriaLabel = function () {
            return nls.localize('entryAriaLabel', "{0}, symbols", this.getLabel());
        };
        SymbolEntry.prototype.getIcon = function () {
            return this.icon;
        };
        SymbolEntry.prototype.getDescription = function () {
            return this.description;
        };
        SymbolEntry.prototype.getType = function () {
            return this.type;
        };
        SymbolEntry.prototype.getRange = function () {
            return this.range;
        };
        SymbolEntry.prototype.getInput = function () {
            return this.editorService.getActiveEditorInput();
        };
        SymbolEntry.prototype.getOptions = function () {
            return {
                selection: this.toSelection()
            };
        };
        SymbolEntry.prototype.run = function (mode, context) {
            if (mode === quickOpen_1.Mode.OPEN) {
                return this.runOpen(context);
            }
            return this.runPreview();
        };
        SymbolEntry.prototype.runOpen = function (context) {
            // Check for sideBySide use
            var sideBySide = context.keymods.indexOf(2048 /* CtrlCmd */) >= 0;
            if (sideBySide) {
                this.editorService.openEditor(this.getInput(), this.getOptions(), true).done(null, errors.onUnexpectedError);
            }
            else {
                var range = this.toSelection();
                var activeEditor = this.editorService.getActiveEditor();
                if (activeEditor) {
                    var editor = activeEditor.getControl();
                    editor.setSelection(range);
                    editor.revealRangeInCenter(range);
                }
            }
            return true;
        };
        SymbolEntry.prototype.runPreview = function () {
            // Select Outline Position
            var range = this.toSelection();
            var activeEditor = this.editorService.getActiveEditor();
            if (activeEditor) {
                var editorControl = activeEditor.getControl();
                editorControl.revealRangeInCenter(range);
                // Decorate if possible
                if (types.isFunction(editorControl.changeDecorations)) {
                    this.handler.decorateOutline(this.range, range, editorControl, activeEditor.position);
                }
            }
            return false;
        };
        SymbolEntry.prototype.toSelection = function () {
            return {
                startLineNumber: this.range.startLineNumber,
                startColumn: this.range.startColumn || 1,
                endLineNumber: this.range.startLineNumber,
                endColumn: this.range.startColumn || 1
            };
        };
        return SymbolEntry;
    }(quickopen_1.EditorQuickOpenEntryGroup));
    var GotoSymbolHandler = (function (_super) {
        __extends(GotoSymbolHandler, _super);
        function GotoSymbolHandler(editorService) {
            var _this = _super.call(this) || this;
            _this.editorService = editorService;
            _this.outlineToModelCache = {};
            return _this;
        }
        GotoSymbolHandler.prototype.getResults = function (searchValue) {
            searchValue = searchValue.trim();
            // Remember view state to be able to restore on cancel
            if (!this.lastKnownEditorViewState) {
                var editor = this.editorService.getActiveEditor();
                this.lastKnownEditorViewState = editor.getControl().saveViewState();
            }
            // Resolve Outline Model
            return this.getActiveOutline().then(function (outline) {
                // Filter by search
                outline.applyFilter(searchValue);
                return outline;
            });
        };
        GotoSymbolHandler.prototype.getEmptyLabel = function (searchString) {
            if (searchString.length > 0) {
                return nls.localize('noSymbolsMatching', "No symbols matching");
            }
            return nls.localize('noSymbolsFound', "No symbols found");
        };
        GotoSymbolHandler.prototype.getAriaLabel = function () {
            return nls.localize('gotoSymbolHandlerAriaLabel', "Type to narrow down symbols of the currently active editor.");
        };
        GotoSymbolHandler.prototype.canRun = function () {
            var canRun = false;
            var editorControl = codeEditorService_1.getCodeEditor(this.editorService.getActiveEditor());
            if (editorControl) {
                var model = editorControl.getModel();
                if (model && model.modified && model.original) {
                    model = model.modified; // Support for diff editor models
                }
                if (model && types.isFunction(model.getLanguageIdentifier)) {
                    canRun = modes_1.DocumentSymbolProviderRegistry.has(model);
                }
            }
            return canRun ? true : editorControl !== null ? nls.localize('cannotRunGotoSymbolInFile', "No symbol information for the file") : nls.localize('cannotRunGotoSymbol', "Open a text file first to go to a symbol");
        };
        GotoSymbolHandler.prototype.getAutoFocus = function (searchValue) {
            searchValue = searchValue.trim();
            // Remove any type pattern (:) from search value as needed
            if (searchValue.indexOf(exports.SCOPE_PREFIX) === 0) {
                searchValue = searchValue.substr(exports.SCOPE_PREFIX.length);
            }
            return {
                autoFocusPrefixMatch: searchValue,
                autoFocusFirstEntry: !!searchValue
            };
        };
        GotoSymbolHandler.prototype.toQuickOpenEntries = function (flattened) {
            var results = [];
            for (var i = 0; i < flattened.length; i++) {
                var element = flattened[i];
                var label = strings.trim(element.name);
                // Show parent scope as description
                var description = element.containerName;
                var icon = modes_1.symbolKindToCssClass(element.kind);
                // Add
                results.push(new SymbolEntry(i, label, icon, description, icon, element.location.range, null, this.editorService, this));
            }
            return results;
        };
        GotoSymbolHandler.prototype.getActiveOutline = function () {
            if (!this.activeOutlineRequest) {
                this.activeOutlineRequest = this.doGetActiveOutline();
            }
            return this.activeOutlineRequest;
        };
        GotoSymbolHandler.prototype.doGetActiveOutline = function () {
            var _this = this;
            var editorControl = codeEditorService_1.getCodeEditor(this.editorService.getActiveEditor());
            if (editorControl) {
                var model = editorControl.getModel();
                if (model && model.modified && model.original) {
                    model = model.modified; // Support for diff editor models
                }
                if (model && types.isFunction(model.getLanguageIdentifier)) {
                    // Ask cache first
                    var modelId_1 = model.id;
                    if (this.outlineToModelCache[modelId_1]) {
                        return winjs_base_1.TPromise.as(this.outlineToModelCache[modelId_1]);
                    }
                    return quickOpen_3.getDocumentSymbols(model).then(function (outline) {
                        var model = new OutlineModel(outline, _this.toQuickOpenEntries(outline.entries));
                        _this.outlineToModelCache = {}; // Clear cache, only keep 1 outline
                        _this.outlineToModelCache[modelId_1] = model;
                        return model;
                    });
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        GotoSymbolHandler.prototype.decorateOutline = function (fullRange, startRange, editor, position) {
            var _this = this;
            editor.changeDecorations(function (changeAccessor) {
                var deleteDecorations = [];
                if (_this.rangeHighlightDecorationId) {
                    deleteDecorations.push(_this.rangeHighlightDecorationId.lineDecorationId);
                    deleteDecorations.push(_this.rangeHighlightDecorationId.rangeHighlightId);
                    _this.rangeHighlightDecorationId = null;
                }
                var newDecorations = [
                    // rangeHighlight at index 0
                    {
                        range: fullRange,
                        options: {
                            className: 'rangeHighlight',
                            isWholeLine: true
                        }
                    },
                    // lineDecoration at index 1
                    {
                        range: startRange,
                        options: {
                            overviewRuler: {
                                color: themeService_1.themeColorFromId(editorColorRegistry_1.editorRangeHighlight),
                                darkColor: themeService_1.themeColorFromId(editorColorRegistry_1.editorRangeHighlight),
                                position: editorCommon_1.OverviewRulerLane.Full
                            }
                        }
                    }
                ];
                var decorations = changeAccessor.deltaDecorations(deleteDecorations, newDecorations);
                var rangeHighlightId = decorations[0];
                var lineDecorationId = decorations[1];
                _this.rangeHighlightDecorationId = {
                    rangeHighlightId: rangeHighlightId,
                    lineDecorationId: lineDecorationId,
                    position: position
                };
            });
        };
        GotoSymbolHandler.prototype.clearDecorations = function () {
            var _this = this;
            if (this.rangeHighlightDecorationId) {
                this.editorService.getVisibleEditors().forEach(function (editor) {
                    if (editor.position === _this.rangeHighlightDecorationId.position) {
                        var editorControl = editor.getControl();
                        editorControl.changeDecorations(function (changeAccessor) {
                            changeAccessor.deltaDecorations([
                                _this.rangeHighlightDecorationId.lineDecorationId,
                                _this.rangeHighlightDecorationId.rangeHighlightId
                            ], []);
                        });
                    }
                });
                this.rangeHighlightDecorationId = null;
            }
        };
        GotoSymbolHandler.prototype.onClose = function (canceled) {
            // Clear Cache
            this.outlineToModelCache = {};
            // Clear Highlight Decorations if present
            this.clearDecorations();
            // Restore selection if canceled
            if (canceled && this.lastKnownEditorViewState) {
                var activeEditor = this.editorService.getActiveEditor();
                if (activeEditor) {
                    var editor = activeEditor.getControl();
                    editor.restoreViewState(this.lastKnownEditorViewState);
                }
            }
            this.lastKnownEditorViewState = null;
            this.activeOutlineRequest = null;
        };
        GotoSymbolHandler = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService)
        ], GotoSymbolHandler);
        return GotoSymbolHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.GotoSymbolHandler = GotoSymbolHandler;
});
//# sourceMappingURL=gotoSymbolHandler.js.map