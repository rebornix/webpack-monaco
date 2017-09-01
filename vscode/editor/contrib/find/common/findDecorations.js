define(["require", "exports", "vs/editor/common/editorCommon", "vs/editor/common/model/textModelWithDecorations", "vs/platform/theme/common/colorRegistry", "vs/platform/theme/common/themeService"], function (require, exports, editorCommon, textModelWithDecorations_1, colorRegistry_1, themeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FindDecorations = (function () {
        function FindDecorations(editor) {
            this._editor = editor;
            this._decorations = [];
            this._findScopeDecorationId = null;
            this._rangeHighlightDecorationId = null;
            this._highlightedDecorationId = null;
            this._startPosition = this._editor.getPosition();
        }
        FindDecorations.prototype.dispose = function () {
            this._editor.deltaDecorations(this._allDecorations(), []);
            this._editor = null;
            this._decorations = [];
            this._findScopeDecorationId = null;
            this._rangeHighlightDecorationId = null;
            this._highlightedDecorationId = null;
            this._startPosition = null;
        };
        FindDecorations.prototype.reset = function () {
            this._decorations = [];
            this._findScopeDecorationId = null;
            this._rangeHighlightDecorationId = null;
            this._highlightedDecorationId = null;
        };
        FindDecorations.prototype.getCount = function () {
            return this._decorations.length;
        };
        FindDecorations.prototype.getFindScope = function () {
            if (this._findScopeDecorationId) {
                return this._editor.getModel().getDecorationRange(this._findScopeDecorationId);
            }
            return null;
        };
        FindDecorations.prototype.getStartPosition = function () {
            return this._startPosition;
        };
        FindDecorations.prototype.setStartPosition = function (newStartPosition) {
            this._startPosition = newStartPosition;
            this.setCurrentFindMatch(null);
        };
        FindDecorations.prototype.getCurrentMatchesPosition = function (desiredRange) {
            for (var i = 0, len = this._decorations.length; i < len; i++) {
                var range = this._editor.getModel().getDecorationRange(this._decorations[i]);
                if (desiredRange.equalsRange(range)) {
                    return (i + 1);
                }
            }
            return 1;
        };
        FindDecorations.prototype.setCurrentFindMatch = function (nextMatch) {
            var _this = this;
            var newCurrentDecorationId = null;
            var matchPosition = 0;
            if (nextMatch) {
                for (var i = 0, len = this._decorations.length; i < len; i++) {
                    var range = this._editor.getModel().getDecorationRange(this._decorations[i]);
                    if (nextMatch.equalsRange(range)) {
                        newCurrentDecorationId = this._decorations[i];
                        matchPosition = (i + 1);
                        break;
                    }
                }
            }
            if (this._highlightedDecorationId !== null || newCurrentDecorationId !== null) {
                this._editor.changeDecorations(function (changeAccessor) {
                    if (_this._highlightedDecorationId !== null) {
                        changeAccessor.changeDecorationOptions(_this._highlightedDecorationId, FindDecorations.createFindMatchDecorationOptions(false));
                        _this._highlightedDecorationId = null;
                    }
                    if (newCurrentDecorationId !== null) {
                        _this._highlightedDecorationId = newCurrentDecorationId;
                        changeAccessor.changeDecorationOptions(_this._highlightedDecorationId, FindDecorations.createFindMatchDecorationOptions(true));
                    }
                    if (_this._rangeHighlightDecorationId !== null) {
                        changeAccessor.removeDecoration(_this._rangeHighlightDecorationId);
                        _this._rangeHighlightDecorationId = null;
                    }
                    if (newCurrentDecorationId !== null) {
                        var rng = _this._editor.getModel().getDecorationRange(newCurrentDecorationId);
                        _this._rangeHighlightDecorationId = changeAccessor.addDecoration(rng, FindDecorations._RANGE_HIGHLIGHT_DECORATION);
                    }
                });
            }
            return matchPosition;
        };
        FindDecorations.prototype.set = function (matches, findScope) {
            var newDecorations = matches.map(function (match) {
                return {
                    range: match,
                    options: FindDecorations.createFindMatchDecorationOptions(false)
                };
            });
            if (findScope) {
                newDecorations.unshift({
                    range: findScope,
                    options: FindDecorations._FIND_SCOPE_DECORATION
                });
            }
            var tmpDecorations = this._editor.deltaDecorations(this._allDecorations(), newDecorations);
            if (findScope) {
                this._findScopeDecorationId = tmpDecorations.shift();
            }
            else {
                this._findScopeDecorationId = null;
            }
            this._decorations = tmpDecorations;
            this._rangeHighlightDecorationId = null;
            this._highlightedDecorationId = null;
        };
        FindDecorations.prototype._allDecorations = function () {
            var result = [];
            result = result.concat(this._decorations);
            if (this._findScopeDecorationId) {
                result.push(this._findScopeDecorationId);
            }
            if (this._rangeHighlightDecorationId) {
                result.push(this._rangeHighlightDecorationId);
            }
            return result;
        };
        FindDecorations.createFindMatchDecorationOptions = function (isCurrent) {
            return (isCurrent ? this._CURRENT_FIND_MATCH_DECORATION : this._FIND_MATCH_DECORATION);
        };
        FindDecorations._CURRENT_FIND_MATCH_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'currentFindMatch',
            showIfCollapsed: true,
            overviewRuler: {
                color: themeService_1.themeColorFromId(colorRegistry_1.editorFindMatch),
                darkColor: themeService_1.themeColorFromId(colorRegistry_1.editorFindMatch),
                position: editorCommon.OverviewRulerLane.Center
            }
        });
        FindDecorations._FIND_MATCH_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'findMatch',
            showIfCollapsed: true,
            overviewRuler: {
                color: themeService_1.themeColorFromId(colorRegistry_1.editorFindMatchHighlight),
                darkColor: themeService_1.themeColorFromId(colorRegistry_1.editorFindMatchHighlight),
                position: editorCommon.OverviewRulerLane.Center
            }
        });
        FindDecorations._RANGE_HIGHLIGHT_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'rangeHighlight',
            isWholeLine: true
        });
        FindDecorations._FIND_SCOPE_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'findScope',
            isWholeLine: true
        });
        return FindDecorations;
    }());
    exports.FindDecorations = FindDecorations;
});
//# sourceMappingURL=findDecorations.js.map