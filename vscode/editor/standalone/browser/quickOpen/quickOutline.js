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
define(["require", "exports", "vs/nls", "vs/base/common/filters", "vs/base/common/strings", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/base/parts/quickopen/common/quickOpen", "vs/editor/common/editorContextKeys", "vs/editor/common/modes", "./editorQuickOpen", "vs/editor/contrib/quickOpen/common/quickOpen", "vs/editor/common/editorCommonExtensions", "vs/editor/common/core/range", "vs/css!./quickOutline"], function (require, exports, nls, filters_1, strings, quickOpenModel_1, quickOpen_1, editorContextKeys_1, modes_1, editorQuickOpen_1, quickOpen_2, editorCommonExtensions_1, range_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SCOPE_PREFIX = ':';
    var SymbolEntry = (function (_super) {
        __extends(SymbolEntry, _super);
        function SymbolEntry(name, type, description, range, highlights, editor, decorator) {
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.type = type;
            _this.description = description;
            _this.range = range;
            _this.setHighlights(highlights);
            _this.editor = editor;
            _this.decorator = decorator;
            return _this;
        }
        SymbolEntry.prototype.getLabel = function () {
            return this.name;
        };
        SymbolEntry.prototype.getAriaLabel = function () {
            return nls.localize('entryAriaLabel', "{0}, symbols", this.name);
        };
        SymbolEntry.prototype.getIcon = function () {
            return this.type;
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
        SymbolEntry.prototype.run = function (mode, context) {
            if (mode === quickOpen_1.Mode.OPEN) {
                return this.runOpen(context);
            }
            return this.runPreview();
        };
        SymbolEntry.prototype.runOpen = function (context) {
            // Apply selection and focus
            var range = this.toSelection();
            this.editor.setSelection(range);
            this.editor.revealRangeInCenter(range);
            this.editor.focus();
            return true;
        };
        SymbolEntry.prototype.runPreview = function () {
            // Select Outline Position
            var range = this.toSelection();
            this.editor.revealRangeInCenter(range);
            // Decorate if possible
            this.decorator.decorateLine(this.range, this.editor);
            return false;
        };
        SymbolEntry.prototype.toSelection = function () {
            return new range_1.Range(this.range.startLineNumber, this.range.startColumn || 1, this.range.startLineNumber, this.range.startColumn || 1);
        };
        return SymbolEntry;
    }(quickOpenModel_1.QuickOpenEntryGroup));
    var QuickOutlineAction = (function (_super) {
        __extends(QuickOutlineAction, _super);
        function QuickOutlineAction() {
            return _super.call(this, nls.localize('quickOutlineActionInput', "Type the name of an identifier you wish to navigate to"), {
                id: 'editor.action.quickOutline',
                label: nls.localize('QuickOutlineAction.label', "Go to Symbol..."),
                alias: 'Go to Symbol...',
                precondition: editorContextKeys_1.EditorContextKeys.hasDocumentSymbolProvider,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 45 /* KEY_O */
                },
                menuOpts: {
                    group: 'navigation',
                    order: 3
                }
            }) || this;
        }
        QuickOutlineAction.prototype.run = function (accessor, editor) {
            var _this = this;
            var model = editor.getModel();
            if (!modes_1.DocumentSymbolProviderRegistry.has(model)) {
                return null;
            }
            // Resolve outline
            return quickOpen_2.getDocumentSymbols(model).then(function (result) {
                if (result.entries.length === 0) {
                    return;
                }
                _this._run(editor, result.entries);
            });
        };
        QuickOutlineAction.prototype._run = function (editor, result) {
            var _this = this;
            this._show(this.getController(editor), {
                getModel: function (value) {
                    return new quickOpenModel_1.QuickOpenModel(_this.toQuickOpenEntries(editor, result, value));
                },
                getAutoFocus: function (searchValue) {
                    // Remove any type pattern (:) from search value as needed
                    if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                        searchValue = searchValue.substr(SCOPE_PREFIX.length);
                    }
                    return {
                        autoFocusPrefixMatch: searchValue,
                        autoFocusFirstEntry: !!searchValue
                    };
                }
            });
        };
        QuickOutlineAction.prototype.toQuickOpenEntries = function (editor, flattened, searchValue) {
            var controller = this.getController(editor);
            var results = [];
            // Convert to Entries
            var normalizedSearchValue = searchValue;
            if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                normalizedSearchValue = normalizedSearchValue.substr(SCOPE_PREFIX.length);
            }
            for (var i = 0; i < flattened.length; i++) {
                var element = flattened[i];
                var label = strings.trim(element.name);
                // Check for meatch
                var highlights = filters_1.matchesFuzzy(normalizedSearchValue, label);
                if (highlights) {
                    // Show parent scope as description
                    var description = null;
                    if (element.containerName) {
                        description = element.containerName;
                    }
                    // Add
                    results.push(new SymbolEntry(label, modes_1.symbolKindToCssClass(element.kind), description, range_1.Range.lift(element.location.range), highlights, editor, controller));
                }
            }
            // Sort properly if actually searching
            if (searchValue) {
                if (searchValue.indexOf(SCOPE_PREFIX) === 0) {
                    results = results.sort(this.sortScoped.bind(this, searchValue.toLowerCase()));
                }
                else {
                    results = results.sort(this.sortNormal.bind(this, searchValue.toLowerCase()));
                }
            }
            // Mark all type groups
            if (results.length > 0 && searchValue.indexOf(SCOPE_PREFIX) === 0) {
                var currentType = null;
                var currentResult = null;
                var typeCounter = 0;
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    // Found new type
                    if (currentType !== result.getType()) {
                        // Update previous result with count
                        if (currentResult) {
                            currentResult.setGroupLabel(this.typeToLabel(currentType, typeCounter));
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
                    currentResult.setGroupLabel(this.typeToLabel(currentType, typeCounter));
                }
            }
            else if (results.length > 0) {
                results[0].setGroupLabel(nls.localize('symbols', "symbols ({0})", results.length));
            }
            return results;
        };
        QuickOutlineAction.prototype.typeToLabel = function (type, count) {
            switch (type) {
                case 'module': return nls.localize('modules', "modules ({0})", count);
                case 'class': return nls.localize('class', "classes ({0})", count);
                case 'interface': return nls.localize('interface', "interfaces ({0})", count);
                case 'method': return nls.localize('method', "methods ({0})", count);
                case 'function': return nls.localize('function', "functions ({0})", count);
                case 'property': return nls.localize('property', "properties ({0})", count);
                case 'variable': return nls.localize('variable', "variables ({0})", count);
                case 'var': return nls.localize('variable2', "variables ({0})", count);
                case 'constructor': return nls.localize('_constructor', "constructors ({0})", count);
                case 'call': return nls.localize('call', "calls ({0})", count);
            }
            return type;
        };
        QuickOutlineAction.prototype.sortNormal = function (searchValue, elementA, elementB) {
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
        QuickOutlineAction.prototype.sortScoped = function (searchValue, elementA, elementB) {
            // Remove scope char
            searchValue = searchValue.substr(SCOPE_PREFIX.length);
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
                var r_1 = elementAName.localeCompare(elementBName);
                if (r_1 !== 0) {
                    return r_1;
                }
            }
            // Default to sort by range
            var elementARange = elementA.getRange();
            var elementBRange = elementB.getRange();
            return elementARange.startLineNumber - elementBRange.startLineNumber;
        };
        QuickOutlineAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], QuickOutlineAction);
        return QuickOutlineAction;
    }(editorQuickOpen_1.BaseEditorQuickOpenAction));
    exports.QuickOutlineAction = QuickOutlineAction;
});
//# sourceMappingURL=quickOutline.js.map