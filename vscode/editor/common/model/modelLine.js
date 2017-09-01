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
define(["require", "exports", "vs/editor/common/core/lineTokens", "vs/editor/common/core/position"], function (require, exports, lineTokens_1, position_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineMarker = (function () {
        function LineMarker(id, internalDecorationId, position, stickToPreviousCharacter) {
            this.id = id;
            this.internalDecorationId = internalDecorationId;
            this.position = position;
            this.stickToPreviousCharacter = stickToPreviousCharacter;
        }
        LineMarker.prototype.toString = function () {
            return '{\'' + this.id + '\';' + this.position.toString() + ',' + this.stickToPreviousCharacter + '}';
        };
        LineMarker.prototype.updateLineNumber = function (markersTracker, lineNumber) {
            if (this.position.lineNumber === lineNumber) {
                return;
            }
            markersTracker.addChangedMarker(this);
            this.position = new position_1.Position(lineNumber, this.position.column);
        };
        LineMarker.prototype.updateColumn = function (markersTracker, column) {
            if (this.position.column === column) {
                return;
            }
            markersTracker.addChangedMarker(this);
            this.position = new position_1.Position(this.position.lineNumber, column);
        };
        LineMarker.prototype.updatePosition = function (markersTracker, position) {
            if (this.position.lineNumber === position.lineNumber && this.position.column === position.column) {
                return;
            }
            markersTracker.addChangedMarker(this);
            this.position = position;
        };
        LineMarker.prototype.setPosition = function (position) {
            this.position = position;
        };
        LineMarker.compareMarkers = function (a, b) {
            if (a.position.column === b.position.column) {
                return (a.stickToPreviousCharacter ? 0 : 1) - (b.stickToPreviousCharacter ? 0 : 1);
            }
            return a.position.column - b.position.column;
        };
        return LineMarker;
    }());
    exports.LineMarker = LineMarker;
    var MarkersTracker = (function () {
        function MarkersTracker() {
            this._changedDecorations = [];
            this._changedDecorationsLen = 0;
        }
        MarkersTracker.prototype.addChangedMarker = function (marker) {
            var internalDecorationId = marker.internalDecorationId;
            if (internalDecorationId !== 0) {
                this._changedDecorations[this._changedDecorationsLen++] = internalDecorationId;
            }
        };
        MarkersTracker.prototype.getDecorationIds = function () {
            return this._changedDecorations;
        };
        return MarkersTracker;
    }());
    exports.MarkersTracker = MarkersTracker;
    var NO_OP_TOKENS_ADJUSTER = {
        adjust: function () { },
        finish: function () { }
    };
    var NO_OP_MARKERS_ADJUSTER = {
        adjustDelta: function () { },
        adjustSet: function () { },
        finish: function () { }
    };
    var MarkerMoveSemantics;
    (function (MarkerMoveSemantics) {
        MarkerMoveSemantics[MarkerMoveSemantics["MarkerDefined"] = 0] = "MarkerDefined";
        MarkerMoveSemantics[MarkerMoveSemantics["ForceMove"] = 1] = "ForceMove";
        MarkerMoveSemantics[MarkerMoveSemantics["ForceStay"] = 2] = "ForceStay";
    })(MarkerMoveSemantics || (MarkerMoveSemantics = {}));
    /**
     * Returns:
     *  - 0 => the line consists of whitespace
     *  - otherwise => the indent level is returned value - 1
     */
    function computePlusOneIndentLevel(line, tabSize) {
        var indent = 0;
        var i = 0;
        var len = line.length;
        while (i < len) {
            var chCode = line.charCodeAt(i);
            if (chCode === 32 /* Space */) {
                indent++;
            }
            else if (chCode === 9 /* Tab */) {
                indent = indent - indent % tabSize + tabSize;
            }
            else {
                break;
            }
            i++;
        }
        if (i === len) {
            return 0; // line only consists of whitespace
        }
        return indent + 1;
    }
    var AbstractModelLine = (function () {
        function AbstractModelLine(initializeMarkers) {
            if (initializeMarkers) {
                this._markers = null;
            }
        }
        ///
        // private _printMarkers(): string {
        // 	if (!this._markers) {
        // 		return '[]';
        // 	}
        // 	if (this._markers.length === 0) {
        // 		return '[]';
        // 	}
        // 	var markers = this._markers;
        // 	var printMarker = (m:LineMarker) => {
        // 		if (m.stickToPreviousCharacter) {
        // 			return '|' + m.position.column;
        // 		}
        // 		return m.position.column + '|';
        // 	};
        // 	return '[' + markers.map(printMarker).join(', ') + ']';
        // }
        AbstractModelLine.prototype._createMarkersAdjuster = function (markersTracker) {
            if (!this._markers) {
                return NO_OP_MARKERS_ADJUSTER;
            }
            if (this._markers.length === 0) {
                return NO_OP_MARKERS_ADJUSTER;
            }
            this._markers.sort(LineMarker.compareMarkers);
            var markers = this._markers;
            var markersLength = markers.length;
            var markersIndex = 0;
            var marker = markers[markersIndex];
            // console.log('------------- INITIAL MARKERS: ' + this._printMarkers());
            var adjustMarkerBeforeColumn = function (toColumn, moveSemantics) {
                if (marker.position.column < toColumn) {
                    return true;
                }
                if (marker.position.column > toColumn) {
                    return false;
                }
                if (moveSemantics === 1 /* ForceMove */) {
                    return false;
                }
                if (moveSemantics === 2 /* ForceStay */) {
                    return true;
                }
                return marker.stickToPreviousCharacter;
            };
            var adjustDelta = function (toColumn, delta, minimumAllowedColumn, moveSemantics) {
                // console.log('------------------------------');
                // console.log('adjustDelta called: toColumn: ' + toColumn + ', delta: ' + delta + ', minimumAllowedColumn: ' + minimumAllowedColumn + ', moveSemantics: ' + MarkerMoveSemantics[moveSemantics]);
                // console.log('BEFORE::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
                while (markersIndex < markersLength && adjustMarkerBeforeColumn(toColumn, moveSemantics)) {
                    if (delta !== 0) {
                        var newColumn = Math.max(minimumAllowedColumn, marker.position.column + delta);
                        marker.updateColumn(markersTracker, newColumn);
                    }
                    markersIndex++;
                    if (markersIndex < markersLength) {
                        marker = markers[markersIndex];
                    }
                }
                // console.log('AFTER::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
            };
            var adjustSet = function (toColumn, newColumn, moveSemantics) {
                // console.log('------------------------------');
                // console.log('adjustSet called: toColumn: ' + toColumn + ', newColumn: ' + newColumn + ', moveSemantics: ' + MarkerMoveSemantics[moveSemantics]);
                // console.log('BEFORE::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
                while (markersIndex < markersLength && adjustMarkerBeforeColumn(toColumn, moveSemantics)) {
                    marker.updateColumn(markersTracker, newColumn);
                    markersIndex++;
                    if (markersIndex < markersLength) {
                        marker = markers[markersIndex];
                    }
                }
                // console.log('AFTER::: markersIndex: ' + markersIndex + ' : ' + this._printMarkers());
            };
            var finish = function (delta, lineTextLength) {
                adjustDelta(1073741824 /* MAX_SAFE_SMALL_INTEGER */, delta, 1, 0 /* MarkerDefined */);
                // console.log('------------- FINAL MARKERS: ' + this._printMarkers());
            };
            return {
                adjustDelta: adjustDelta,
                adjustSet: adjustSet,
                finish: finish
            };
        };
        AbstractModelLine.prototype.applyEdits = function (markersTracker, edits, tabSize) {
            var deltaColumn = 0;
            var resultText = this.text;
            var tokensAdjuster = this._createTokensAdjuster();
            var markersAdjuster = this._createMarkersAdjuster(markersTracker);
            for (var i = 0, len = edits.length; i < len; i++) {
                var edit = edits[i];
                // console.log();
                // console.log('=============================');
                // console.log('EDIT #' + i + ' [ ' + edit.startColumn + ' -> ' + edit.endColumn + ' ] : <<<' + edit.text + '>>>, forceMoveMarkers: ' + edit.forceMoveMarkers);
                // console.log('deltaColumn: ' + deltaColumn);
                var startColumn = deltaColumn + edit.startColumn;
                var endColumn = deltaColumn + edit.endColumn;
                var deletingCnt = endColumn - startColumn;
                var insertingCnt = edit.text.length;
                // Adjust tokens & markers before this edit
                // console.log('Adjust tokens & markers before this edit');
                tokensAdjuster.adjust(edit.startColumn - 1, deltaColumn, 1);
                markersAdjuster.adjustDelta(edit.startColumn, deltaColumn, 1, edit.forceMoveMarkers ? 1 /* ForceMove */ : (deletingCnt > 0 ? 2 /* ForceStay */ : 0 /* MarkerDefined */));
                // Adjust tokens & markers for the common part of this edit
                var commonLength = Math.min(deletingCnt, insertingCnt);
                if (commonLength > 0) {
                    // console.log('Adjust tokens & markers for the common part of this edit');
                    tokensAdjuster.adjust(edit.startColumn - 1 + commonLength, deltaColumn, startColumn);
                    if (!edit.forceMoveMarkers) {
                        markersAdjuster.adjustDelta(edit.startColumn + commonLength, deltaColumn, startColumn, edit.forceMoveMarkers ? 1 /* ForceMove */ : (deletingCnt > insertingCnt ? 2 /* ForceStay */ : 0 /* MarkerDefined */));
                    }
                }
                // Perform the edit & update `deltaColumn`
                resultText = resultText.substring(0, startColumn - 1) + edit.text + resultText.substring(endColumn - 1);
                deltaColumn += insertingCnt - deletingCnt;
                // Adjust tokens & markers inside this edit
                // console.log('Adjust tokens & markers inside this edit');
                tokensAdjuster.adjust(edit.endColumn, deltaColumn, startColumn);
                markersAdjuster.adjustSet(edit.endColumn, startColumn + insertingCnt, edit.forceMoveMarkers ? 1 /* ForceMove */ : 0 /* MarkerDefined */);
            }
            // Wrap up tokens & markers; adjust remaining if needed
            tokensAdjuster.finish(deltaColumn, resultText.length);
            markersAdjuster.finish(deltaColumn, resultText.length);
            // Save the resulting text
            this._setText(resultText, tabSize);
            return deltaColumn;
        };
        AbstractModelLine.prototype.split = function (markersTracker, splitColumn, forceMoveMarkers, tabSize) {
            // console.log('--> split @ ' + splitColumn + '::: ' + this._printMarkers());
            var myText = this.text.substring(0, splitColumn - 1);
            var otherText = this.text.substring(splitColumn - 1);
            var otherMarkers = null;
            if (this._markers) {
                this._markers.sort(LineMarker.compareMarkers);
                for (var i = 0, len = this._markers.length; i < len; i++) {
                    var marker = this._markers[i];
                    if (marker.position.column > splitColumn
                        || (marker.position.column === splitColumn
                            && (forceMoveMarkers
                                || !marker.stickToPreviousCharacter))) {
                        var myMarkers = this._markers.slice(0, i);
                        otherMarkers = this._markers.slice(i);
                        this._markers = myMarkers;
                        break;
                    }
                }
                if (otherMarkers) {
                    for (var i = 0, len = otherMarkers.length; i < len; i++) {
                        var marker = otherMarkers[i];
                        marker.updateColumn(markersTracker, marker.position.column - (splitColumn - 1));
                    }
                }
            }
            this._setText(myText, tabSize);
            var otherLine = this._createModelLine(otherText, tabSize);
            if (otherMarkers) {
                otherLine.addMarkers(otherMarkers);
            }
            return otherLine;
        };
        AbstractModelLine.prototype.append = function (markersTracker, myLineNumber, other, tabSize) {
            // console.log('--> append: THIS :: ' + this._printMarkers());
            // console.log('--> append: OTHER :: ' + this._printMarkers());
            var thisTextLength = this.text.length;
            this._setText(this.text + other.text, tabSize);
            if (other instanceof AbstractModelLine) {
                if (other._markers) {
                    // Other has markers
                    var otherMarkers = other._markers;
                    // Adjust other markers
                    for (var i = 0, len = otherMarkers.length; i < len; i++) {
                        var marker = otherMarkers[i];
                        marker.updatePosition(markersTracker, new position_1.Position(myLineNumber, marker.position.column + thisTextLength));
                    }
                    this.addMarkers(otherMarkers);
                }
            }
        };
        AbstractModelLine.prototype.addMarker = function (marker) {
            if (!this._markers) {
                this._markers = [marker];
            }
            else {
                this._markers.push(marker);
            }
        };
        AbstractModelLine.prototype.addMarkers = function (markers) {
            if (markers.length === 0) {
                return;
            }
            if (!this._markers) {
                this._markers = markers.slice(0);
            }
            else {
                this._markers = this._markers.concat(markers);
            }
        };
        AbstractModelLine.prototype.removeMarker = function (marker) {
            if (!this._markers) {
                return;
            }
            var index = this._indexOfMarkerId(marker.id);
            if (index < 0) {
                return;
            }
            if (this._markers.length === 1) {
                // was last marker on line
                this._markers = null;
            }
            else {
                this._markers.splice(index, 1);
            }
        };
        AbstractModelLine.prototype.removeMarkers = function (deleteMarkers) {
            if (!this._markers) {
                return;
            }
            for (var i = 0, len = this._markers.length; i < len; i++) {
                var marker = this._markers[i];
                if (deleteMarkers[marker.id]) {
                    this._markers.splice(i, 1);
                    len--;
                    i--;
                }
            }
            if (this._markers.length === 0) {
                this._markers = null;
            }
        };
        AbstractModelLine.prototype.getMarkers = function () {
            if (!this._markers) {
                return null;
            }
            return this._markers;
        };
        AbstractModelLine.prototype.updateLineNumber = function (markersTracker, newLineNumber) {
            if (this._markers) {
                var markers = this._markers;
                for (var i = 0, len = markers.length; i < len; i++) {
                    var marker = markers[i];
                    marker.updateLineNumber(markersTracker, newLineNumber);
                }
            }
        };
        AbstractModelLine.prototype._indexOfMarkerId = function (markerId) {
            var markers = this._markers;
            for (var i = 0, len = markers.length; i < len; i++) {
                if (markers[i].id === markerId) {
                    return i;
                }
            }
            return undefined;
        };
        return AbstractModelLine;
    }());
    exports.AbstractModelLine = AbstractModelLine;
    var ModelLine = (function (_super) {
        __extends(ModelLine, _super);
        function ModelLine(text, tabSize) {
            var _this = _super.call(this, true) || this;
            _this._metadata = 0;
            _this._setText(text, tabSize);
            _this._state = null;
            _this._lineTokens = null;
            return _this;
        }
        Object.defineProperty(ModelLine.prototype, "text", {
            get: function () { return this._text; },
            enumerable: true,
            configurable: true
        });
        ModelLine.prototype.isInvalid = function () {
            return (this._metadata & 0x00000001) ? true : false;
        };
        ModelLine.prototype.setIsInvalid = function (isInvalid) {
            this._metadata = (this._metadata & 0xfffffffe) | (isInvalid ? 1 : 0);
        };
        /**
         * Returns:
         *  - -1 => the line consists of whitespace
         *  - otherwise => the indent level is returned value
         */
        ModelLine.prototype.getIndentLevel = function () {
            return ((this._metadata & 0xfffffffe) >> 1) - 1;
        };
        ModelLine.prototype._setPlusOneIndentLevel = function (value) {
            this._metadata = (this._metadata & 0x00000001) | ((value & 0xefffffff) << 1);
        };
        ModelLine.prototype.updateTabSize = function (tabSize) {
            if (tabSize === 0) {
                // don't care mark
                this._metadata = this._metadata & 0x00000001;
            }
            else {
                this._setPlusOneIndentLevel(computePlusOneIndentLevel(this._text, tabSize));
            }
        };
        ModelLine.prototype._createModelLine = function (text, tabSize) {
            return new ModelLine(text, tabSize);
        };
        ModelLine.prototype.split = function (markersTracker, splitColumn, forceMoveMarkers, tabSize) {
            var result = _super.prototype.split.call(this, markersTracker, splitColumn, forceMoveMarkers, tabSize);
            // Mark overflowing tokens for deletion & delete marked tokens
            this._deleteMarkedTokens(this._markOverflowingTokensForDeletion(0, this.text.length));
            return result;
        };
        ModelLine.prototype.append = function (markersTracker, myLineNumber, other, tabSize) {
            var thisTextLength = this.text.length;
            _super.prototype.append.call(this, markersTracker, myLineNumber, other, tabSize);
            if (other instanceof ModelLine) {
                var otherRawTokens = other._lineTokens;
                if (otherRawTokens) {
                    // Other has real tokens
                    var otherTokens = new Uint32Array(otherRawTokens);
                    // Adjust other tokens
                    if (thisTextLength > 0) {
                        for (var i = 0, len = (otherTokens.length >>> 1); i < len; i++) {
                            otherTokens[(i << 1)] = otherTokens[(i << 1)] + thisTextLength;
                        }
                    }
                    // Append other tokens
                    var myRawTokens = this._lineTokens;
                    if (myRawTokens) {
                        // I have real tokens
                        var myTokens = new Uint32Array(myRawTokens);
                        var result = new Uint32Array(myTokens.length + otherTokens.length);
                        result.set(myTokens, 0);
                        result.set(otherTokens, myTokens.length);
                        this._lineTokens = result.buffer;
                    }
                    else {
                        // I don't have real tokens
                        this._lineTokens = otherTokens.buffer;
                    }
                }
            }
        };
        // --- BEGIN STATE
        ModelLine.prototype.resetTokenizationState = function () {
            this._state = null;
            this._lineTokens = null;
        };
        ModelLine.prototype.setState = function (state) {
            this._state = state;
        };
        ModelLine.prototype.getState = function () {
            return this._state || null;
        };
        // --- END STATE
        // --- BEGIN TOKENS
        ModelLine.prototype.setTokens = function (topLevelLanguageId, tokens) {
            if (!tokens || tokens.length === 0) {
                this._lineTokens = null;
                return;
            }
            if (tokens.length === 2) {
                // there is one token
                if (tokens[0] === 0 && tokens[1] === getDefaultMetadata(topLevelLanguageId)) {
                    this._lineTokens = null;
                    return;
                }
            }
            this._lineTokens = tokens.buffer;
        };
        ModelLine.prototype.getTokens = function (topLevelLanguageId) {
            var rawLineTokens = this._lineTokens;
            if (rawLineTokens) {
                return new lineTokens_1.LineTokens(new Uint32Array(rawLineTokens), this._text);
            }
            var lineTokens = new Uint32Array(2);
            lineTokens[0] = 0;
            lineTokens[1] = getDefaultMetadata(topLevelLanguageId);
            return new lineTokens_1.LineTokens(lineTokens, this._text);
        };
        // --- END TOKENS
        ModelLine.prototype._createTokensAdjuster = function () {
            var _this = this;
            if (!this._lineTokens) {
                // This line does not have real tokens, so there is nothing to adjust
                return NO_OP_TOKENS_ADJUSTER;
            }
            var lineTokens = new Uint32Array(this._lineTokens);
            var tokensLength = (lineTokens.length >>> 1);
            var tokenIndex = 0;
            var tokenStartOffset = 0;
            var removeTokensCount = 0;
            var adjust = function (toColumn, delta, minimumAllowedColumn) {
                // console.log(`------------------------------------------------------------------`);
                // console.log(`before call: tokenIndex: ${tokenIndex}: ${lineTokens}`);
                // console.log(`adjustTokens: ${toColumn} with delta: ${delta} and [${minimumAllowedColumn}]`);
                // console.log(`tokenStartOffset: ${tokenStartOffset}`);
                var minimumAllowedIndex = minimumAllowedColumn - 1;
                while (tokenStartOffset < toColumn && tokenIndex < tokensLength) {
                    if (tokenStartOffset > 0 && delta !== 0) {
                        // adjust token's `startIndex` by `delta`
                        var newTokenStartOffset = Math.max(minimumAllowedIndex, tokenStartOffset + delta);
                        lineTokens[(tokenIndex << 1)] = newTokenStartOffset;
                        // console.log(` * adjusted token start offset for token at ${tokenIndex}: ${newTokenStartOffset}`);
                        if (delta < 0) {
                            var tmpTokenIndex = tokenIndex;
                            while (tmpTokenIndex > 0) {
                                var prevTokenStartOffset = lineTokens[((tmpTokenIndex - 1) << 1)];
                                if (prevTokenStartOffset >= newTokenStartOffset) {
                                    if (prevTokenStartOffset !== 4294967295 /* MAX_UINT_32 */) {
                                        // console.log(` * marking for deletion token at ${tmpTokenIndex - 1}`);
                                        lineTokens[((tmpTokenIndex - 1) << 1)] = 4294967295 /* MAX_UINT_32 */;
                                        removeTokensCount++;
                                    }
                                    tmpTokenIndex--;
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    }
                    tokenIndex++;
                    if (tokenIndex < tokensLength) {
                        tokenStartOffset = lineTokens[(tokenIndex << 1)];
                    }
                }
                // console.log(`after call: tokenIndex: ${tokenIndex}: ${lineTokens}`);
            };
            var finish = function (delta, lineTextLength) {
                adjust(1073741824 /* MAX_SAFE_SMALL_INTEGER */, delta, 1);
                // Mark overflowing tokens for deletion & delete marked tokens
                _this._deleteMarkedTokens(_this._markOverflowingTokensForDeletion(removeTokensCount, lineTextLength));
            };
            return {
                adjust: adjust,
                finish: finish
            };
        };
        ModelLine.prototype._markOverflowingTokensForDeletion = function (removeTokensCount, lineTextLength) {
            if (!this._lineTokens) {
                return removeTokensCount;
            }
            var lineTokens = new Uint32Array(this._lineTokens);
            var tokensLength = (lineTokens.length >>> 1);
            if (removeTokensCount + 1 === tokensLength) {
                // no more removing, cannot end up without any tokens for mode transition reasons
                return removeTokensCount;
            }
            for (var tokenIndex = tokensLength - 1; tokenIndex > 0; tokenIndex--) {
                var tokenStartOffset = lineTokens[(tokenIndex << 1)];
                if (tokenStartOffset < lineTextLength) {
                    // valid token => stop iterating
                    return removeTokensCount;
                }
                // this token now overflows the text => mark it for removal
                if (tokenStartOffset !== 4294967295 /* MAX_UINT_32 */) {
                    // console.log(` * marking for deletion token at ${tokenIndex}`);
                    lineTokens[(tokenIndex << 1)] = 4294967295 /* MAX_UINT_32 */;
                    removeTokensCount++;
                    if (removeTokensCount + 1 === tokensLength) {
                        // no more removing, cannot end up without any tokens for mode transition reasons
                        return removeTokensCount;
                    }
                }
            }
            return removeTokensCount;
        };
        ModelLine.prototype._deleteMarkedTokens = function (removeTokensCount) {
            if (removeTokensCount === 0) {
                return;
            }
            var lineTokens = new Uint32Array(this._lineTokens);
            var tokensLength = (lineTokens.length >>> 1);
            var newTokens = new Uint32Array(((tokensLength - removeTokensCount) << 1)), newTokenIdx = 0;
            for (var i = 0; i < tokensLength; i++) {
                var startOffset = lineTokens[(i << 1)];
                if (startOffset === 4294967295 /* MAX_UINT_32 */) {
                    // marked for deletion
                    continue;
                }
                var metadata = lineTokens[(i << 1) + 1];
                newTokens[newTokenIdx++] = startOffset;
                newTokens[newTokenIdx++] = metadata;
            }
            this._lineTokens = newTokens.buffer;
        };
        ModelLine.prototype._setText = function (text, tabSize) {
            this._text = text;
            if (tabSize === 0) {
                // don't care mark
                this._metadata = this._metadata & 0x00000001;
            }
            else {
                this._setPlusOneIndentLevel(computePlusOneIndentLevel(text, tabSize));
            }
        };
        return ModelLine;
    }(AbstractModelLine));
    exports.ModelLine = ModelLine;
    /**
     * A model line that cannot store any tokenization state, nor does it compute indentation levels.
     * It has no fields except the text.
     */
    var MinimalModelLine = (function (_super) {
        __extends(MinimalModelLine, _super);
        function MinimalModelLine(text, tabSize) {
            var _this = _super.call(this, false) || this;
            _this._setText(text, tabSize);
            return _this;
        }
        Object.defineProperty(MinimalModelLine.prototype, "text", {
            get: function () { return this._text; },
            enumerable: true,
            configurable: true
        });
        MinimalModelLine.prototype.isInvalid = function () {
            return false;
        };
        MinimalModelLine.prototype.setIsInvalid = function (isInvalid) {
        };
        /**
         * Returns:
         *  - -1 => the line consists of whitespace
         *  - otherwise => the indent level is returned value
         */
        MinimalModelLine.prototype.getIndentLevel = function () {
            return 0;
        };
        MinimalModelLine.prototype.updateTabSize = function (tabSize) {
        };
        MinimalModelLine.prototype._createModelLine = function (text, tabSize) {
            return new MinimalModelLine(text, tabSize);
        };
        MinimalModelLine.prototype.split = function (markersTracker, splitColumn, forceMoveMarkers, tabSize) {
            return _super.prototype.split.call(this, markersTracker, splitColumn, forceMoveMarkers, tabSize);
        };
        MinimalModelLine.prototype.append = function (markersTracker, myLineNumber, other, tabSize) {
            _super.prototype.append.call(this, markersTracker, myLineNumber, other, tabSize);
        };
        // --- BEGIN STATE
        MinimalModelLine.prototype.resetTokenizationState = function () {
        };
        MinimalModelLine.prototype.setState = function (state) {
        };
        MinimalModelLine.prototype.getState = function () {
            return null;
        };
        // --- END STATE
        // --- BEGIN TOKENS
        MinimalModelLine.prototype.setTokens = function (topLevelLanguageId, tokens) {
        };
        MinimalModelLine.prototype.getTokens = function (topLevelLanguageId) {
            var lineTokens = new Uint32Array(2);
            lineTokens[0] = 0;
            lineTokens[1] = getDefaultMetadata(topLevelLanguageId);
            return new lineTokens_1.LineTokens(lineTokens, this._text);
        };
        // --- END TOKENS
        MinimalModelLine.prototype._createTokensAdjuster = function () {
            // This line does not have real tokens, so there is nothing to adjust
            return NO_OP_TOKENS_ADJUSTER;
        };
        MinimalModelLine.prototype._setText = function (text, tabSize) {
            this._text = text;
        };
        return MinimalModelLine;
    }(AbstractModelLine));
    exports.MinimalModelLine = MinimalModelLine;
    function getDefaultMetadata(topLevelLanguageId) {
        return ((topLevelLanguageId << 0 /* LANGUAGEID_OFFSET */)
            | (0 /* Other */ << 8 /* TOKEN_TYPE_OFFSET */)
            | (0 /* None */ << 11 /* FONT_STYLE_OFFSET */)
            | (1 /* DefaultForeground */ << 14 /* FOREGROUND_OFFSET */)
            | (2 /* DefaultBackground */ << 23 /* BACKGROUND_OFFSET */)) >>> 0;
    }
});
//# sourceMappingURL=modelLine.js.map