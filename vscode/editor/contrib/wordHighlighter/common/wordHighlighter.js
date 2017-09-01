var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "vs/nls", "vs/base/common/async", "vs/base/common/errors", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/editorCommonExtensions", "vs/editor/common/modes", "vs/base/common/lifecycle", "vs/platform/theme/common/colorRegistry", "vs/platform/theme/common/themeService", "vs/editor/common/controller/cursorEvents", "vs/editor/common/model/textModelWithDecorations"], function (require, exports, nls, async_1, errors_1, range_1, editorCommon, editorCommonExtensions_1, modes_1, lifecycle_1, colorRegistry_1, themeService_1, cursorEvents_1, textModelWithDecorations_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.editorWordHighlight = colorRegistry_1.registerColor('editor.wordHighlightBackground', { dark: '#575757B8', light: '#57575740', hc: null }, nls.localize('wordHighlight', 'Background color of a symbol during read-access, like reading a variable.'));
    exports.editorWordHighlightStrong = colorRegistry_1.registerColor('editor.wordHighlightStrongBackground', { dark: '#004972B8', light: '#0e639c40', hc: null }, nls.localize('wordHighlightStrong', 'Background color of a symbol during write-access, like writing to a variable.'));
    function getOccurrencesAtPosition(model, position) {
        var orderedByScore = modes_1.DocumentHighlightProviderRegistry.ordered(model);
        var foundResult = false;
        // in order of score ask the occurrences provider
        // until someone response with a good result
        // (good = none empty array)
        return async_1.sequence(orderedByScore.map(function (provider) {
            return function () {
                if (!foundResult) {
                    return async_1.asWinJsPromise(function (token) {
                        return provider.provideDocumentHighlights(model, position, token);
                    }).then(function (data) {
                        if (Array.isArray(data) && data.length > 0) {
                            foundResult = true;
                            return data;
                        }
                        return undefined;
                    }, function (err) {
                        errors_1.onUnexpectedExternalError(err);
                        return undefined;
                    });
                }
                return undefined;
            };
        })).then(function (values) {
            return values[0];
        });
    }
    exports.getOccurrencesAtPosition = getOccurrencesAtPosition;
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeDocumentHighlights', getOccurrencesAtPosition);
    var WordHighlighter = (function () {
        function WordHighlighter(editor) {
            var _this = this;
            this.workerRequestTokenId = 0;
            this.workerRequest = null;
            this.workerRequestCompleted = false;
            this.workerRequestValue = [];
            this.lastCursorPositionChangeTime = 0;
            this.renderDecorationsTimer = -1;
            this.editor = editor;
            this.occurrencesHighlight = this.editor.getConfiguration().contribInfo.occurrencesHighlight;
            this.model = this.editor.getModel();
            this.toUnhook = [];
            this.toUnhook.push(editor.onDidChangeCursorPosition(function (e) {
                if (!_this.occurrencesHighlight) {
                    // Early exit if nothing needs to be done!
                    // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                    return;
                }
                _this._onPositionChanged(e);
            }));
            this.toUnhook.push(editor.onDidChangeModel(function (e) {
                _this._stopAll();
                _this.model = _this.editor.getModel();
            }));
            this.toUnhook.push(editor.onDidChangeModelContent(function (e) {
                _this._stopAll();
            }));
            this.toUnhook.push(editor.onDidChangeConfiguration(function (e) {
                var newValue = _this.editor.getConfiguration().contribInfo.occurrencesHighlight;
                if (_this.occurrencesHighlight !== newValue) {
                    _this.occurrencesHighlight = newValue;
                    _this._stopAll();
                }
            }));
            this._lastWordRange = null;
            this._decorationIds = [];
            this.workerRequestTokenId = 0;
            this.workerRequest = null;
            this.workerRequestCompleted = false;
            this.lastCursorPositionChangeTime = 0;
            this.renderDecorationsTimer = -1;
        }
        WordHighlighter.prototype._removeDecorations = function () {
            if (this._decorationIds.length > 0) {
                // remove decorations
                this._decorationIds = this.editor.deltaDecorations(this._decorationIds, []);
            }
        };
        WordHighlighter.prototype._stopAll = function () {
            this._lastWordRange = null;
            // Remove any existing decorations
            this._removeDecorations();
            // Cancel any renderDecorationsTimer
            if (this.renderDecorationsTimer !== -1) {
                clearTimeout(this.renderDecorationsTimer);
                this.renderDecorationsTimer = -1;
            }
            // Cancel any worker request
            if (this.workerRequest !== null) {
                this.workerRequest.cancel();
                this.workerRequest = null;
            }
            // Invalidate any worker request callback
            if (!this.workerRequestCompleted) {
                this.workerRequestTokenId++;
                this.workerRequestCompleted = true;
            }
        };
        WordHighlighter.prototype._onPositionChanged = function (e) {
            var _this = this;
            // disabled
            if (!this.occurrencesHighlight) {
                this._stopAll();
                return;
            }
            // ignore typing & other
            if (e.reason !== cursorEvents_1.CursorChangeReason.Explicit) {
                this._stopAll();
                return;
            }
            // no providers for this model
            if (!modes_1.DocumentHighlightProviderRegistry.has(this.model)) {
                this._stopAll();
                return;
            }
            var editorSelection = this.editor.getSelection();
            // ignore multiline selection
            if (editorSelection.startLineNumber !== editorSelection.endLineNumber) {
                this._stopAll();
                return;
            }
            var lineNumber = editorSelection.startLineNumber;
            var startColumn = editorSelection.startColumn;
            var endColumn = editorSelection.endColumn;
            var word = this.model.getWordAtPosition({
                lineNumber: lineNumber,
                column: startColumn
            });
            // The selection must be inside a word or surround one word at most
            if (!word || word.startColumn > startColumn || word.endColumn < endColumn) {
                this._stopAll();
                return;
            }
            // All the effort below is trying to achieve this:
            // - when cursor is moved to a word, trigger immediately a findOccurrences request
            // - 250ms later after the last cursor move event, render the occurrences
            // - no flickering!
            var currentWordRange = new range_1.Range(lineNumber, word.startColumn, lineNumber, word.endColumn);
            var workerRequestIsValid = this._lastWordRange && this._lastWordRange.equalsRange(currentWordRange);
            // Even if we are on a different word, if that word is in the decorations ranges, the request is still valid
            // (Same symbol)
            for (var i = 0, len = this._decorationIds.length; !workerRequestIsValid && i < len; i++) {
                var range = this.model.getDecorationRange(this._decorationIds[i]);
                if (range && range.startLineNumber === lineNumber) {
                    if (range.startColumn <= startColumn && range.endColumn >= endColumn) {
                        workerRequestIsValid = true;
                    }
                }
            }
            // There are 4 cases:
            // a) old workerRequest is valid & completed, renderDecorationsTimer fired
            // b) old workerRequest is valid & completed, renderDecorationsTimer not fired
            // c) old workerRequest is valid, but not completed
            // d) old workerRequest is not valid
            // For a) no action is needed
            // For c), member 'lastCursorPositionChangeTime' will be used when installing the timer so no action is needed
            this.lastCursorPositionChangeTime = (new Date()).getTime();
            if (workerRequestIsValid) {
                if (this.workerRequestCompleted && this.renderDecorationsTimer !== -1) {
                    // case b)
                    // Delay the firing of renderDecorationsTimer by an extra 250 ms
                    clearTimeout(this.renderDecorationsTimer);
                    this.renderDecorationsTimer = -1;
                    this._beginRenderDecorations();
                }
            }
            else {
                // case d)
                // Stop all previous actions and start fresh
                this._stopAll();
                var myRequestId = ++this.workerRequestTokenId;
                this.workerRequestCompleted = false;
                this.workerRequest = getOccurrencesAtPosition(this.model, this.editor.getPosition());
                this.workerRequest.then(function (data) {
                    if (myRequestId === _this.workerRequestTokenId) {
                        _this.workerRequestCompleted = true;
                        _this.workerRequestValue = data || [];
                        _this._beginRenderDecorations();
                    }
                }).done();
            }
            this._lastWordRange = currentWordRange;
        };
        WordHighlighter.prototype._beginRenderDecorations = function () {
            var _this = this;
            var currentTime = (new Date()).getTime();
            var minimumRenderTime = this.lastCursorPositionChangeTime + 250;
            if (currentTime >= minimumRenderTime) {
                // Synchronous
                this.renderDecorationsTimer = -1;
                this.renderDecorations();
            }
            else {
                // Asyncrhonous
                this.renderDecorationsTimer = setTimeout(function () {
                    _this.renderDecorations();
                }, (minimumRenderTime - currentTime));
            }
        };
        WordHighlighter.prototype.renderDecorations = function () {
            this.renderDecorationsTimer = -1;
            var decorations = [];
            for (var i = 0, len = this.workerRequestValue.length; i < len; i++) {
                var info = this.workerRequestValue[i];
                decorations.push({
                    range: info.range,
                    options: WordHighlighter._getDecorationOptions(info.kind)
                });
            }
            this._decorationIds = this.editor.deltaDecorations(this._decorationIds, decorations);
        };
        WordHighlighter._getDecorationOptions = function (kind) {
            if (kind === modes_1.DocumentHighlightKind.Write) {
                return this._WRITE_OPTIONS;
            }
            else if (kind === modes_1.DocumentHighlightKind.Text) {
                return this._TEXT_OPTIONS;
            }
            else {
                return this._REGULAR_OPTIONS;
            }
        };
        WordHighlighter.prototype.dispose = function () {
            this._stopAll();
            this.toUnhook = lifecycle_1.dispose(this.toUnhook);
        };
        WordHighlighter._WRITE_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'wordHighlightStrong',
            overviewRuler: {
                color: themeService_1.themeColorFromId(exports.editorWordHighlightStrong),
                darkColor: themeService_1.themeColorFromId(exports.editorWordHighlightStrong),
                position: editorCommon.OverviewRulerLane.Center
            }
        });
        WordHighlighter._TEXT_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'selectionHighlight',
            overviewRuler: {
                color: themeService_1.themeColorFromId(colorRegistry_1.editorSelectionHighlight),
                darkColor: themeService_1.themeColorFromId(colorRegistry_1.editorSelectionHighlight),
                position: editorCommon.OverviewRulerLane.Center
            }
        });
        WordHighlighter._REGULAR_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'wordHighlight',
            overviewRuler: {
                color: themeService_1.themeColorFromId(exports.editorWordHighlight),
                darkColor: themeService_1.themeColorFromId(exports.editorWordHighlight),
                position: editorCommon.OverviewRulerLane.Center
            }
        });
        return WordHighlighter;
    }());
    var WordHighlighterContribution = (function () {
        function WordHighlighterContribution(editor) {
            this.wordHighligher = new WordHighlighter(editor);
        }
        WordHighlighterContribution_1 = WordHighlighterContribution;
        WordHighlighterContribution.prototype.getId = function () {
            return WordHighlighterContribution_1.ID;
        };
        WordHighlighterContribution.prototype.dispose = function () {
            this.wordHighligher.dispose();
        };
        WordHighlighterContribution.ID = 'editor.contrib.wordHighlighter';
        WordHighlighterContribution = WordHighlighterContribution_1 = __decorate([
            editorCommonExtensions_1.commonEditorContribution
        ], WordHighlighterContribution);
        return WordHighlighterContribution;
        var WordHighlighterContribution_1;
    }());
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var selectionHighlight = theme.getColor(colorRegistry_1.editorSelectionHighlight);
        if (selectionHighlight) {
            collector.addRule(".monaco-editor .focused .selectionHighlight { background-color: " + selectionHighlight + "; }");
            collector.addRule(".monaco-editor .selectionHighlight { background-color: " + selectionHighlight.transparent(0.5) + "; }");
        }
        var wordHighlight = theme.getColor(exports.editorWordHighlight);
        if (wordHighlight) {
            collector.addRule(".monaco-editor .wordHighlight { background-color: " + wordHighlight + "; }");
        }
        var wordHighlightStrong = theme.getColor(exports.editorWordHighlightStrong);
        if (wordHighlightStrong) {
            collector.addRule(".monaco-editor .wordHighlightStrong { background-color: " + wordHighlightStrong + "; }");
        }
        var hcOutline = theme.getColor(colorRegistry_1.activeContrastBorder);
        if (hcOutline) {
            collector.addRule(".monaco-editor .selectionHighlight { border: 1px dotted " + hcOutline + "; box-sizing: border-box; }");
            collector.addRule(".monaco-editor .wordHighlight { border: 1px dashed " + hcOutline + "; box-sizing: border-box; }");
            collector.addRule(".monaco-editor .wordHighlightStrong { border: 1px dashed " + hcOutline + "; box-sizing: border-box; }");
        }
    });
});
//# sourceMappingURL=wordHighlighter.js.map