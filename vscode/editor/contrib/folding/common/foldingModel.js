/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/editor/common/editorCommon", "vs/editor/common/core/range", "vs/editor/common/model/textModelWithDecorations"], function (require, exports, editorCommon, range_1, textModelWithDecorations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function toString(range) {
        return (range ? range.startLineNumber + '/' + range.endLineNumber : 'null') + (range.isCollapsed ? ' (collapsed)' : '') + ' - ' + range.indent;
    }
    exports.toString = toString;
    var CollapsibleRegion = (function () {
        function CollapsibleRegion(range, model, changeAccessor) {
            this.decorationIds = [];
            this.update(range, model, changeAccessor);
        }
        Object.defineProperty(CollapsibleRegion.prototype, "isCollapsed", {
            get: function () {
                return this._isCollapsed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollapsibleRegion.prototype, "isExpanded", {
            get: function () {
                return !this._isCollapsed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollapsibleRegion.prototype, "indent", {
            get: function () {
                return this._indent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollapsibleRegion.prototype, "foldingRange", {
            get: function () {
                return this._lastRange;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollapsibleRegion.prototype, "startLineNumber", {
            get: function () {
                return this._lastRange ? this._lastRange.startLineNumber : void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CollapsibleRegion.prototype, "endLineNumber", {
            get: function () {
                return this._lastRange ? this._lastRange.endLineNumber : void 0;
            },
            enumerable: true,
            configurable: true
        });
        CollapsibleRegion.prototype.setCollapsed = function (isCollaped, changeAccessor) {
            this._isCollapsed = isCollaped;
            if (this.decorationIds.length > 0) {
                changeAccessor.changeDecorationOptions(this.decorationIds[0], this.getVisualDecorationOptions());
            }
        };
        CollapsibleRegion.prototype.getDecorationRange = function (model) {
            if (this.decorationIds.length > 0) {
                return model.getDecorationRange(this.decorationIds[1]);
            }
            return null;
        };
        CollapsibleRegion.prototype.getVisualDecorationOptions = function () {
            if (this._isCollapsed) {
                return CollapsibleRegion._COLLAPSED_VISUAL_DECORATION;
            }
            else {
                return CollapsibleRegion._EXPANDED_VISUAL_DECORATION;
            }
        };
        CollapsibleRegion.prototype.getRangeDecorationOptions = function () {
            return CollapsibleRegion._RANGE_DECORATION;
        };
        CollapsibleRegion.prototype.update = function (newRange, model, changeAccessor) {
            this._lastRange = newRange;
            this._isCollapsed = !!newRange.isCollapsed;
            this._indent = newRange.indent;
            var newDecorations = [];
            var maxColumn = model.getLineMaxColumn(newRange.startLineNumber);
            var visualRng = {
                startLineNumber: newRange.startLineNumber,
                startColumn: maxColumn,
                endLineNumber: newRange.startLineNumber,
                endColumn: maxColumn
            };
            newDecorations.push({ range: visualRng, options: this.getVisualDecorationOptions() });
            var colRng = {
                startLineNumber: newRange.startLineNumber,
                startColumn: 1,
                endLineNumber: newRange.endLineNumber,
                endColumn: model.getLineMaxColumn(newRange.endLineNumber)
            };
            newDecorations.push({ range: colRng, options: this.getRangeDecorationOptions() });
            this.decorationIds = changeAccessor.deltaDecorations(this.decorationIds, newDecorations);
        };
        CollapsibleRegion.prototype.dispose = function (changeAccessor) {
            this._lastRange = null;
            this.decorationIds = changeAccessor.deltaDecorations(this.decorationIds, []);
        };
        CollapsibleRegion.prototype.toString = function () {
            var str = this.isCollapsed ? 'collapsed ' : 'expanded ';
            if (this._lastRange) {
                str += (this._lastRange.startLineNumber + '/' + this._lastRange.endLineNumber);
            }
            else {
                str += 'no range';
            }
            return str;
        };
        CollapsibleRegion._COLLAPSED_VISUAL_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            afterContentClassName: 'inline-folded',
            linesDecorationsClassName: 'folding collapsed'
        });
        CollapsibleRegion._EXPANDED_VISUAL_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            linesDecorationsClassName: 'folding'
        });
        CollapsibleRegion._RANGE_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore
        });
        return CollapsibleRegion;
    }());
    exports.CollapsibleRegion = CollapsibleRegion;
    function getCollapsibleRegionsToFoldAtLine(allRegions, model, lineNumber, levels, up) {
        var surroundingRegion = getCollapsibleRegionAtLine(allRegions, model, lineNumber);
        if (!surroundingRegion) {
            return [];
        }
        if (levels === 1) {
            return [surroundingRegion];
        }
        var result = getCollapsibleRegionsFor(surroundingRegion, allRegions, model, levels, up);
        return result.filter(function (collapsibleRegion) { return !collapsibleRegion.isCollapsed; });
    }
    exports.getCollapsibleRegionsToFoldAtLine = getCollapsibleRegionsToFoldAtLine;
    function getCollapsibleRegionsToUnfoldAtLine(allRegions, model, lineNumber, levels) {
        var surroundingRegion = getCollapsibleRegionAtLine(allRegions, model, lineNumber);
        if (!surroundingRegion) {
            return [];
        }
        if (levels === 1) {
            var regionToUnfold = surroundingRegion.isCollapsed ? surroundingRegion : getFoldedCollapsibleRegionAfterLine(allRegions, model, surroundingRegion, lineNumber);
            return regionToUnfold ? [regionToUnfold] : [];
        }
        var result = getCollapsibleRegionsFor(surroundingRegion, allRegions, model, levels, false);
        return result.filter(function (collapsibleRegion) { return collapsibleRegion.isCollapsed; });
    }
    exports.getCollapsibleRegionsToUnfoldAtLine = getCollapsibleRegionsToUnfoldAtLine;
    function getCollapsibleRegionAtLine(allRegions, model, lineNumber) {
        var collapsibleRegion = null;
        for (var i = 0, len = allRegions.length; i < len; i++) {
            var dec = allRegions[i];
            var decRange = dec.getDecorationRange(model);
            if (decRange) {
                if (doesLineBelongsToCollapsibleRegion(decRange, lineNumber)) {
                    collapsibleRegion = dec;
                }
                if (doesCollapsibleRegionIsAfterLine(decRange, lineNumber)) {
                    break;
                }
            }
        }
        return collapsibleRegion;
    }
    function getFoldedCollapsibleRegionAfterLine(allRegions, model, surroundingRegion, lineNumber) {
        var index = allRegions.indexOf(surroundingRegion);
        for (var i = index + 1; i < allRegions.length; i++) {
            var dec = allRegions[i];
            var decRange = dec.getDecorationRange(model);
            if (decRange) {
                if (doesCollapsibleRegionIsAfterLine(decRange, lineNumber)) {
                    if (!doesCollapsibleRegionContains(surroundingRegion.foldingRange, decRange)) {
                        return null;
                    }
                    if (dec.isCollapsed) {
                        return dec;
                    }
                }
            }
        }
        return null;
    }
    function doesLineBelongsToCollapsibleRegion(range, lineNumber) {
        return lineNumber >= range.startLineNumber && lineNumber <= range.endLineNumber;
    }
    exports.doesLineBelongsToCollapsibleRegion = doesLineBelongsToCollapsibleRegion;
    function doesCollapsibleRegionIsAfterLine(range, lineNumber) {
        return lineNumber < range.startLineNumber;
    }
    function doesCollapsibleRegionIsBeforeLine(range, lineNumber) {
        return lineNumber > range.endLineNumber;
    }
    function doesCollapsibleRegionContains(range1, range2) {
        if (range1 instanceof range_1.Range && range2 instanceof range_1.Range) {
            return range1.containsRange(range2);
        }
        return range1.startLineNumber <= range2.startLineNumber && range1.endLineNumber >= range2.endLineNumber;
    }
    function getCollapsibleRegionsFor(surroundingRegion, allRegions, model, levels, up) {
        var collapsibleRegionsHierarchy = up ? new CollapsibleRegionsParentHierarchy(surroundingRegion, allRegions, model) : new CollapsibleRegionsChildrenHierarchy(surroundingRegion, allRegions, model);
        return collapsibleRegionsHierarchy.getRegionsTill(levels);
    }
    var CollapsibleRegionsChildrenHierarchy = (function () {
        function CollapsibleRegionsChildrenHierarchy(region, allRegions, model) {
            this.region = region;
            this.children = [];
            for (var index = allRegions.indexOf(region) + 1; index < allRegions.length; index++) {
                var dec = allRegions[index];
                var decRange = dec.getDecorationRange(model);
                if (decRange) {
                    if (doesCollapsibleRegionContains(region.foldingRange, decRange)) {
                        index = this.processChildRegion(dec, allRegions, model, index);
                    }
                    if (doesCollapsibleRegionIsAfterLine(decRange, region.foldingRange.endLineNumber)) {
                        break;
                    }
                }
            }
        }
        CollapsibleRegionsChildrenHierarchy.prototype.processChildRegion = function (dec, allRegions, model, index) {
            var childRegion = new CollapsibleRegionsChildrenHierarchy(dec, allRegions, model);
            this.children.push(childRegion);
            this.lastChildIndex = index;
            return childRegion.children.length > 0 ? childRegion.lastChildIndex : index;
        };
        CollapsibleRegionsChildrenHierarchy.prototype.getRegionsTill = function (level) {
            var result = [this.region];
            if (level > 1) {
                this.children.forEach(function (region) { return result = result.concat(region.getRegionsTill(level - 1)); });
            }
            return result;
        };
        return CollapsibleRegionsChildrenHierarchy;
    }());
    var CollapsibleRegionsParentHierarchy = (function () {
        function CollapsibleRegionsParentHierarchy(region, allRegions, model) {
            this.region = region;
            for (var index = allRegions.indexOf(region) - 1; index >= 0; index--) {
                var dec = allRegions[index];
                var decRange = dec.getDecorationRange(model);
                if (decRange) {
                    if (doesCollapsibleRegionContains(decRange, region.foldingRange)) {
                        this.parent = new CollapsibleRegionsParentHierarchy(dec, allRegions, model);
                        break;
                    }
                    if (doesCollapsibleRegionIsBeforeLine(decRange, region.foldingRange.endLineNumber)) {
                        break;
                    }
                }
            }
        }
        CollapsibleRegionsParentHierarchy.prototype.getRegionsTill = function (level) {
            var result = [this.region];
            if (this.parent && level > 1) {
                result = result.concat(this.parent.getRegionsTill(level - 1));
            }
            return result;
        };
        return CollapsibleRegionsParentHierarchy;
    }());
});
//# sourceMappingURL=foldingModel.js.map