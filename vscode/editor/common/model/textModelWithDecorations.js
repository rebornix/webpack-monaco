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
define(["require", "exports", "vs/base/common/errors", "vs/base/common/htmlContent", "vs/base/common/strings", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/model/modelLine", "vs/editor/common/core/position", "vs/editor/common/model/textModelWithMarkers", "vs/editor/common/model/textModelEvents"], function (require, exports, errors_1, htmlContent_1, strings, range_1, editorCommon, modelLine_1, position_1, textModelWithMarkers_1, textModelEvents) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClassName = {
        EditorWarningDecoration: 'greensquiggly',
        EditorErrorDecoration: 'redsquiggly'
    };
    var DecorationsTracker = (function () {
        function DecorationsTracker() {
            this.addedDecorations = [];
            this.addedDecorationsLen = 0;
            this.changedDecorations = [];
            this.changedDecorationsLen = 0;
            this.removedDecorations = [];
            this.removedDecorationsLen = 0;
        }
        // --- Build decoration events
        DecorationsTracker.prototype.addNewDecoration = function (id) {
            this.addedDecorations[this.addedDecorationsLen++] = id;
        };
        DecorationsTracker.prototype.addRemovedDecoration = function (id) {
            this.removedDecorations[this.removedDecorationsLen++] = id;
        };
        DecorationsTracker.prototype.addMovedDecoration = function (id) {
            this.changedDecorations[this.changedDecorationsLen++] = id;
        };
        DecorationsTracker.prototype.addUpdatedDecoration = function (id) {
            this.changedDecorations[this.changedDecorationsLen++] = id;
        };
        return DecorationsTracker;
    }());
    var InternalDecoration = (function () {
        function InternalDecoration(id, internalId, ownerId, range, startMarker, endMarker, options) {
            this.id = id;
            this.internalId = internalId;
            this.ownerId = ownerId;
            this.range = range;
            this.startMarker = startMarker;
            this.endMarker = endMarker;
            this.setOptions(options);
        }
        InternalDecoration.prototype.setOptions = function (options) {
            this.options = options;
            this.isForValidation = (this.options.className === exports.ClassName.EditorErrorDecoration
                || this.options.className === exports.ClassName.EditorWarningDecoration);
        };
        InternalDecoration.prototype.setRange = function (multiLineDecorationsMap, range) {
            if (this.range.equalsRange(range)) {
                return;
            }
            var rangeWasMultiLine = (this.range.startLineNumber !== this.range.endLineNumber);
            this.range = range;
            var rangeIsMultiline = (this.range.startLineNumber !== this.range.endLineNumber);
            if (rangeWasMultiLine === rangeIsMultiline) {
                return;
            }
            if (rangeIsMultiline) {
                multiLineDecorationsMap[this.id] = this;
            }
            else {
                delete multiLineDecorationsMap[this.id];
            }
        };
        return InternalDecoration;
    }());
    exports.InternalDecoration = InternalDecoration;
    var _INSTANCE_COUNT = 0;
    /**
     * Produces 'a'-'z', followed by 'A'-'Z'... followed by 'a'-'z', etc.
     */
    function nextInstanceId() {
        var LETTERS_CNT = (90 /* Z */ - 65 /* A */ + 1);
        var result = _INSTANCE_COUNT++;
        result = result % (2 * LETTERS_CNT);
        if (result < LETTERS_CNT) {
            return String.fromCharCode(97 /* a */ + result);
        }
        return String.fromCharCode(65 /* A */ + result - LETTERS_CNT);
    }
    var TextModelWithDecorations = (function (_super) {
        __extends(TextModelWithDecorations, _super);
        function TextModelWithDecorations(rawTextSource, creationOptions, languageIdentifier) {
            var _this = _super.call(this, rawTextSource, creationOptions, languageIdentifier) || this;
            _this._instanceId = nextInstanceId();
            _this._lastDecorationId = 0;
            // Initialize decorations
            _this._currentDecorationsTracker = null;
            _this._currentDecorationsTrackerCnt = 0;
            _this._currentMarkersTracker = null;
            _this._currentMarkersTrackerCnt = 0;
            _this._decorations = Object.create(null);
            _this._internalDecorations = Object.create(null);
            _this._multiLineDecorationsMap = Object.create(null);
            return _this;
        }
        TextModelWithDecorations.prototype.dispose = function () {
            this._decorations = null;
            this._internalDecorations = null;
            this._multiLineDecorationsMap = null;
            _super.prototype.dispose.call(this);
        };
        TextModelWithDecorations.prototype._resetValue = function (newValue) {
            _super.prototype._resetValue.call(this, newValue);
            // Destroy all my decorations
            this._decorations = Object.create(null);
            this._internalDecorations = Object.create(null);
            this._multiLineDecorationsMap = Object.create(null);
        };
        TextModelWithDecorations._shouldStartMarkerSticksToPreviousCharacter = function (stickiness) {
            if (stickiness === editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges || stickiness === editorCommon.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore) {
                return true;
            }
            return false;
        };
        TextModelWithDecorations._shouldEndMarkerSticksToPreviousCharacter = function (stickiness) {
            if (stickiness === editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges || stickiness === editorCommon.TrackedRangeStickiness.GrowsOnlyWhenTypingBefore) {
                return true;
            }
            return false;
        };
        TextModelWithDecorations.prototype._getTrackedRangesCount = function () {
            return Object.keys(this._decorations).length;
        };
        // --- END TrackedRanges
        TextModelWithDecorations.prototype.changeDecorations = function (callback, ownerId) {
            if (ownerId === void 0) { ownerId = 0; }
            this._assertNotDisposed();
            try {
                this._eventEmitter.beginDeferredEmit();
                var decorationsTracker = this._acquireDecorationsTracker();
                return this._changeDecorations(decorationsTracker, ownerId, callback);
            }
            finally {
                this._releaseDecorationsTracker();
                this._eventEmitter.endDeferredEmit();
            }
        };
        TextModelWithDecorations.prototype._changeDecorations = function (decorationsTracker, ownerId, callback) {
            var _this = this;
            var changeAccessor = {
                addDecoration: function (range, options) {
                    return _this._addDecorationImpl(decorationsTracker, ownerId, _this.validateRange(range), _normalizeOptions(options));
                },
                changeDecoration: function (id, newRange) {
                    _this._changeDecorationImpl(decorationsTracker, id, _this.validateRange(newRange));
                },
                changeDecorationOptions: function (id, options) {
                    _this._changeDecorationOptionsImpl(decorationsTracker, id, _normalizeOptions(options));
                },
                removeDecoration: function (id) {
                    _this._removeDecorationImpl(decorationsTracker, id);
                },
                deltaDecorations: function (oldDecorations, newDecorations) {
                    return _this._deltaDecorationsImpl(decorationsTracker, ownerId, oldDecorations, _this._normalizeDeltaDecorations(newDecorations));
                }
            };
            var result = null;
            try {
                result = callback(changeAccessor);
            }
            catch (e) {
                errors_1.onUnexpectedError(e);
            }
            // Invalidate change accessor
            changeAccessor.addDecoration = null;
            changeAccessor.changeDecoration = null;
            changeAccessor.removeDecoration = null;
            changeAccessor.deltaDecorations = null;
            return result;
        };
        TextModelWithDecorations.prototype.deltaDecorations = function (oldDecorations, newDecorations, ownerId) {
            if (ownerId === void 0) { ownerId = 0; }
            this._assertNotDisposed();
            if (!oldDecorations) {
                oldDecorations = [];
            }
            return this.changeDecorations(function (changeAccessor) {
                return changeAccessor.deltaDecorations(oldDecorations, newDecorations);
            }, ownerId);
        };
        TextModelWithDecorations.prototype.removeAllDecorationsWithOwnerId = function (ownerId) {
            var toRemove = [];
            for (var decorationId in this._decorations) {
                // No `hasOwnProperty` call due to using Object.create(null)
                var decoration = this._decorations[decorationId];
                if (decoration.ownerId === ownerId) {
                    toRemove.push(decoration.id);
                }
            }
            this._removeDecorationsImpl(null, toRemove);
        };
        TextModelWithDecorations.prototype.getDecorationOptions = function (decorationId) {
            var decoration = this._decorations[decorationId];
            if (!decoration) {
                return null;
            }
            return decoration.options;
        };
        TextModelWithDecorations.prototype.getDecorationRange = function (decorationId) {
            var decoration = this._decorations[decorationId];
            if (!decoration) {
                return null;
            }
            return decoration.range;
        };
        TextModelWithDecorations.prototype.getLineDecorations = function (lineNumber, ownerId, filterOutValidation) {
            if (ownerId === void 0) { ownerId = 0; }
            if (filterOutValidation === void 0) { filterOutValidation = false; }
            if (lineNumber < 1 || lineNumber > this.getLineCount()) {
                return [];
            }
            return this.getLinesDecorations(lineNumber, lineNumber, ownerId, filterOutValidation);
        };
        /**
         * Fetch only multi-line decorations that intersect with the given line number range
         */
        TextModelWithDecorations.prototype._getMultiLineDecorations = function (filterRange, filterOwnerId, filterOutValidation) {
            var filterStartLineNumber = filterRange.startLineNumber;
            var filterStartColumn = filterRange.startColumn;
            var filterEndLineNumber = filterRange.endLineNumber;
            var filterEndColumn = filterRange.endColumn;
            var result = [], resultLen = 0;
            for (var decorationId in this._multiLineDecorationsMap) {
                // No `hasOwnProperty` call due to using Object.create(null)
                var decoration = this._multiLineDecorationsMap[decorationId];
                if (filterOwnerId && decoration.ownerId && decoration.ownerId !== filterOwnerId) {
                    continue;
                }
                if (filterOutValidation && decoration.isForValidation) {
                    continue;
                }
                var range = decoration.range;
                if (range.startLineNumber > filterEndLineNumber) {
                    continue;
                }
                if (range.startLineNumber === filterEndLineNumber && range.startColumn > filterEndColumn) {
                    continue;
                }
                if (range.endLineNumber < filterStartLineNumber) {
                    continue;
                }
                if (range.endLineNumber === filterStartLineNumber && range.endColumn < filterStartColumn) {
                    continue;
                }
                result[resultLen++] = decoration;
            }
            return result;
        };
        TextModelWithDecorations.prototype._getDecorationsInRange = function (filterRange, filterOwnerId, filterOutValidation) {
            var filterStartLineNumber = filterRange.startLineNumber;
            var filterStartColumn = filterRange.startColumn;
            var filterEndLineNumber = filterRange.endLineNumber;
            var filterEndColumn = filterRange.endColumn;
            var result = this._getMultiLineDecorations(filterRange, filterOwnerId, filterOutValidation);
            var resultLen = result.length;
            var resultMap = {};
            for (var i = 0, len = resultLen; i < len; i++) {
                resultMap[result[i].id] = true;
            }
            for (var lineNumber = filterStartLineNumber; lineNumber <= filterEndLineNumber; lineNumber++) {
                var lineMarkers = this._lines[lineNumber - 1].getMarkers();
                if (lineMarkers === null) {
                    continue;
                }
                for (var i = 0, len = lineMarkers.length; i < len; i++) {
                    var lineMarker = lineMarkers[i];
                    var internalDecorationId = lineMarker.internalDecorationId;
                    if (internalDecorationId === 0) {
                        // marker does not belong to any decoration
                        continue;
                    }
                    var decoration = this._internalDecorations[internalDecorationId];
                    if (resultMap.hasOwnProperty(decoration.id)) {
                        // decoration already in result
                        continue;
                    }
                    if (filterOwnerId && decoration.ownerId && decoration.ownerId !== filterOwnerId) {
                        continue;
                    }
                    if (filterOutValidation && decoration.isForValidation) {
                        continue;
                    }
                    var range = decoration.range;
                    if (range.startLineNumber > filterEndLineNumber) {
                        continue;
                    }
                    if (range.startLineNumber === filterEndLineNumber && range.startColumn > filterEndColumn) {
                        continue;
                    }
                    if (range.endLineNumber < filterStartLineNumber) {
                        continue;
                    }
                    if (range.endLineNumber === filterStartLineNumber && range.endColumn < filterStartColumn) {
                        continue;
                    }
                    result[resultLen++] = decoration;
                    resultMap[decoration.id] = true;
                }
            }
            return result;
        };
        TextModelWithDecorations.prototype.getLinesDecorations = function (_startLineNumber, _endLineNumber, ownerId, filterOutValidation) {
            if (ownerId === void 0) { ownerId = 0; }
            if (filterOutValidation === void 0) { filterOutValidation = false; }
            var lineCount = this.getLineCount();
            var startLineNumber = Math.min(lineCount, Math.max(1, _startLineNumber));
            var endLineNumber = Math.min(lineCount, Math.max(1, _endLineNumber));
            var endColumn = this.getLineMaxColumn(endLineNumber);
            return this._getDecorationsInRange(new range_1.Range(startLineNumber, 1, endLineNumber, endColumn), ownerId, filterOutValidation);
        };
        TextModelWithDecorations.prototype.getDecorationsInRange = function (range, ownerId, filterOutValidation) {
            var validatedRange = this.validateRange(range);
            return this._getDecorationsInRange(validatedRange, ownerId, filterOutValidation);
        };
        TextModelWithDecorations.prototype.getAllDecorations = function (ownerId, filterOutValidation) {
            if (ownerId === void 0) { ownerId = 0; }
            if (filterOutValidation === void 0) { filterOutValidation = false; }
            var result = [], resultLen = 0;
            for (var decorationId in this._decorations) {
                // No `hasOwnProperty` call due to using Object.create(null)
                var decoration = this._decorations[decorationId];
                if (ownerId && decoration.ownerId && decoration.ownerId !== ownerId) {
                    continue;
                }
                if (filterOutValidation && decoration.isForValidation) {
                    continue;
                }
                result[resultLen++] = decoration;
            }
            return result;
        };
        TextModelWithDecorations.prototype._acquireMarkersTracker = function () {
            if (this._currentMarkersTrackerCnt === 0) {
                this._currentMarkersTracker = new modelLine_1.MarkersTracker();
            }
            this._currentMarkersTrackerCnt++;
            return this._currentMarkersTracker;
        };
        TextModelWithDecorations.prototype._releaseMarkersTracker = function () {
            this._currentMarkersTrackerCnt--;
            if (this._currentMarkersTrackerCnt === 0) {
                var markersTracker = this._currentMarkersTracker;
                this._currentMarkersTracker = null;
                this._handleTrackedMarkers(markersTracker);
            }
        };
        /**
         * Handle changed markers (i.e. update decorations ranges and return the changed decorations, unique and sorted by id)
         */
        TextModelWithDecorations.prototype._handleTrackedMarkers = function (markersTracker) {
            var changedInternalDecorationIds = markersTracker.getDecorationIds();
            if (changedInternalDecorationIds.length === 0) {
                return;
            }
            changedInternalDecorationIds.sort();
            var uniqueChangedDecorations = [], uniqueChangedDecorationsLen = 0;
            var previousInternalDecorationId = 0;
            for (var i = 0, len = changedInternalDecorationIds.length; i < len; i++) {
                var internalDecorationId = changedInternalDecorationIds[i];
                if (internalDecorationId === previousInternalDecorationId) {
                    continue;
                }
                previousInternalDecorationId = internalDecorationId;
                var decoration = this._internalDecorations[internalDecorationId];
                if (!decoration) {
                    // perhaps the decoration was removed in the meantime
                    continue;
                }
                var startMarker = decoration.startMarker.position;
                var endMarker = decoration.endMarker.position;
                var range = TextModelWithDecorations._createRangeFromMarkers(startMarker, endMarker);
                decoration.setRange(this._multiLineDecorationsMap, range);
                uniqueChangedDecorations[uniqueChangedDecorationsLen++] = decoration.id;
            }
            if (uniqueChangedDecorations.length > 0) {
                var e = {
                    addedDecorations: [],
                    changedDecorations: uniqueChangedDecorations,
                    removedDecorations: []
                };
                this.emitModelDecorationsChangedEvent(e);
            }
        };
        TextModelWithDecorations._createRangeFromMarkers = function (startPosition, endPosition) {
            if (endPosition.isBefore(startPosition)) {
                // This tracked range has turned in on itself (end marker before start marker)
                // This can happen in extreme editing conditions where lots of text is removed and lots is added
                // Treat it as a collapsed range
                return new range_1.Range(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column);
            }
            return new range_1.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
        };
        TextModelWithDecorations.prototype._acquireDecorationsTracker = function () {
            if (this._currentDecorationsTrackerCnt === 0) {
                this._currentDecorationsTracker = new DecorationsTracker();
            }
            this._currentDecorationsTrackerCnt++;
            return this._currentDecorationsTracker;
        };
        TextModelWithDecorations.prototype._releaseDecorationsTracker = function () {
            this._currentDecorationsTrackerCnt--;
            if (this._currentDecorationsTrackerCnt === 0) {
                var decorationsTracker = this._currentDecorationsTracker;
                this._currentDecorationsTracker = null;
                this._handleTrackedDecorations(decorationsTracker);
            }
        };
        TextModelWithDecorations.prototype._handleTrackedDecorations = function (decorationsTracker) {
            if (decorationsTracker.addedDecorationsLen === 0
                && decorationsTracker.changedDecorationsLen === 0
                && decorationsTracker.removedDecorationsLen === 0) {
                return;
            }
            var e = {
                addedDecorations: decorationsTracker.addedDecorations,
                changedDecorations: decorationsTracker.changedDecorations,
                removedDecorations: decorationsTracker.removedDecorations
            };
            this.emitModelDecorationsChangedEvent(e);
        };
        TextModelWithDecorations.prototype.emitModelDecorationsChangedEvent = function (e) {
            if (!this._isDisposing) {
                this._eventEmitter.emit(textModelEvents.TextModelEventType.ModelDecorationsChanged, e);
            }
        };
        TextModelWithDecorations.prototype._normalizeDeltaDecorations = function (deltaDecorations) {
            var result = [];
            for (var i = 0, len = deltaDecorations.length; i < len; i++) {
                var deltaDecoration = deltaDecorations[i];
                result.push(new ModelDeltaDecoration(i, this.validateRange(deltaDecoration.range), _normalizeOptions(deltaDecoration.options)));
            }
            return result;
        };
        TextModelWithDecorations.prototype._externalDecorationId = function (internalId) {
            return this._instanceId + ";" + internalId;
        };
        TextModelWithDecorations.prototype._addDecorationImpl = function (decorationsTracker, ownerId, _range, options) {
            var range = this.validateRange(_range);
            var internalDecorationId = (++this._lastDecorationId);
            var decorationId = this._externalDecorationId(internalDecorationId);
            var markers = this._addMarkers([
                {
                    internalDecorationId: internalDecorationId,
                    position: new position_1.Position(range.startLineNumber, range.startColumn),
                    stickToPreviousCharacter: TextModelWithDecorations._shouldStartMarkerSticksToPreviousCharacter(options.stickiness)
                },
                {
                    internalDecorationId: internalDecorationId,
                    position: new position_1.Position(range.endLineNumber, range.endColumn),
                    stickToPreviousCharacter: TextModelWithDecorations._shouldEndMarkerSticksToPreviousCharacter(options.stickiness)
                }
            ]);
            var decoration = new InternalDecoration(decorationId, internalDecorationId, ownerId, range, markers[0], markers[1], options);
            this._decorations[decorationId] = decoration;
            this._internalDecorations[internalDecorationId] = decoration;
            if (range.startLineNumber !== range.endLineNumber) {
                this._multiLineDecorationsMap[decorationId] = decoration;
            }
            decorationsTracker.addNewDecoration(decorationId);
            return decorationId;
        };
        TextModelWithDecorations.prototype._addDecorationsImpl = function (decorationsTracker, ownerId, newDecorations) {
            var internalDecorationIds = [];
            var decorationIds = [];
            var newMarkers = [];
            for (var i = 0, len = newDecorations.length; i < len; i++) {
                var newDecoration = newDecorations[i];
                var range = newDecoration.range;
                var stickiness = newDecoration.options.stickiness;
                var internalDecorationId = (++this._lastDecorationId);
                var decorationId = this._externalDecorationId(internalDecorationId);
                internalDecorationIds[i] = internalDecorationId;
                decorationIds[i] = decorationId;
                newMarkers[2 * i] = {
                    internalDecorationId: internalDecorationId,
                    position: new position_1.Position(range.startLineNumber, range.startColumn),
                    stickToPreviousCharacter: TextModelWithDecorations._shouldStartMarkerSticksToPreviousCharacter(stickiness)
                };
                newMarkers[2 * i + 1] = {
                    internalDecorationId: internalDecorationId,
                    position: new position_1.Position(range.endLineNumber, range.endColumn),
                    stickToPreviousCharacter: TextModelWithDecorations._shouldEndMarkerSticksToPreviousCharacter(stickiness)
                };
            }
            var markerIds = this._addMarkers(newMarkers);
            for (var i = 0, len = newDecorations.length; i < len; i++) {
                var newDecoration = newDecorations[i];
                var range = newDecoration.range;
                var internalDecorationId = internalDecorationIds[i];
                var decorationId = decorationIds[i];
                var startMarker = markerIds[2 * i];
                var endMarker = markerIds[2 * i + 1];
                var decoration = new InternalDecoration(decorationId, internalDecorationId, ownerId, range, startMarker, endMarker, newDecoration.options);
                this._decorations[decorationId] = decoration;
                this._internalDecorations[internalDecorationId] = decoration;
                if (range.startLineNumber !== range.endLineNumber) {
                    this._multiLineDecorationsMap[decorationId] = decoration;
                }
                decorationsTracker.addNewDecoration(decorationId);
            }
            return decorationIds;
        };
        TextModelWithDecorations.prototype._changeDecorationImpl = function (decorationsTracker, decorationId, newRange) {
            var decoration = this._decorations[decorationId];
            if (!decoration) {
                return;
            }
            var startMarker = decoration.startMarker;
            if (newRange.startLineNumber !== startMarker.position.lineNumber) {
                // move marker between lines
                this._lines[startMarker.position.lineNumber - 1].removeMarker(startMarker);
                this._lines[newRange.startLineNumber - 1].addMarker(startMarker);
            }
            startMarker.setPosition(new position_1.Position(newRange.startLineNumber, newRange.startColumn));
            var endMarker = decoration.endMarker;
            if (newRange.endLineNumber !== endMarker.position.lineNumber) {
                // move marker between lines
                this._lines[endMarker.position.lineNumber - 1].removeMarker(endMarker);
                this._lines[newRange.endLineNumber - 1].addMarker(endMarker);
            }
            endMarker.setPosition(new position_1.Position(newRange.endLineNumber, newRange.endColumn));
            decoration.setRange(this._multiLineDecorationsMap, newRange);
            decorationsTracker.addMovedDecoration(decorationId);
        };
        TextModelWithDecorations.prototype._changeDecorationOptionsImpl = function (decorationsTracker, decorationId, options) {
            var decoration = this._decorations[decorationId];
            if (!decoration) {
                return;
            }
            if (decoration.options.stickiness !== options.stickiness) {
                decoration.startMarker.stickToPreviousCharacter = TextModelWithDecorations._shouldStartMarkerSticksToPreviousCharacter(options.stickiness);
                decoration.endMarker.stickToPreviousCharacter = TextModelWithDecorations._shouldEndMarkerSticksToPreviousCharacter(options.stickiness);
            }
            decoration.setOptions(options);
            decorationsTracker.addUpdatedDecoration(decorationId);
        };
        TextModelWithDecorations.prototype._removeDecorationImpl = function (decorationsTracker, decorationId) {
            var decoration = this._decorations[decorationId];
            if (!decoration) {
                return;
            }
            this._removeMarkers([decoration.startMarker, decoration.endMarker]);
            delete this._multiLineDecorationsMap[decorationId];
            delete this._decorations[decorationId];
            delete this._internalDecorations[decoration.internalId];
            if (decorationsTracker) {
                decorationsTracker.addRemovedDecoration(decorationId);
            }
        };
        TextModelWithDecorations.prototype._removeDecorationsImpl = function (decorationsTracker, decorationIds) {
            var removeMarkers = [], removeMarkersLen = 0;
            for (var i = 0, len = decorationIds.length; i < len; i++) {
                var decorationId = decorationIds[i];
                var decoration = this._decorations[decorationId];
                if (!decoration) {
                    continue;
                }
                if (decorationsTracker) {
                    decorationsTracker.addRemovedDecoration(decorationId);
                }
                removeMarkers[removeMarkersLen++] = decoration.startMarker;
                removeMarkers[removeMarkersLen++] = decoration.endMarker;
                delete this._multiLineDecorationsMap[decorationId];
                delete this._decorations[decorationId];
                delete this._internalDecorations[decoration.internalId];
            }
            if (removeMarkers.length > 0) {
                this._removeMarkers(removeMarkers);
            }
        };
        TextModelWithDecorations.prototype._resolveOldDecorations = function (oldDecorations) {
            var result = [];
            for (var i = 0, len = oldDecorations.length; i < len; i++) {
                var id = oldDecorations[i];
                var decoration = this._decorations[id];
                if (!decoration) {
                    continue;
                }
                result.push(decoration);
            }
            return result;
        };
        TextModelWithDecorations.prototype._deltaDecorationsImpl = function (decorationsTracker, ownerId, oldDecorationsIds, newDecorations) {
            if (oldDecorationsIds.length === 0) {
                // Nothing to remove
                return this._addDecorationsImpl(decorationsTracker, ownerId, newDecorations);
            }
            if (newDecorations.length === 0) {
                // Nothing to add
                this._removeDecorationsImpl(decorationsTracker, oldDecorationsIds);
                return [];
            }
            var oldDecorations = this._resolveOldDecorations(oldDecorationsIds);
            oldDecorations.sort(function (a, b) { return range_1.Range.compareRangesUsingStarts(a.range, b.range); });
            newDecorations.sort(function (a, b) { return range_1.Range.compareRangesUsingStarts(a.range, b.range); });
            var result = [], oldDecorationsIndex = 0, oldDecorationsLength = oldDecorations.length, newDecorationsIndex = 0, newDecorationsLength = newDecorations.length, decorationsToAdd = [], decorationsToRemove = [];
            while (oldDecorationsIndex < oldDecorationsLength && newDecorationsIndex < newDecorationsLength) {
                var oldDecoration = oldDecorations[oldDecorationsIndex];
                var newDecoration = newDecorations[newDecorationsIndex];
                var comparison = range_1.Range.compareRangesUsingStarts(oldDecoration.range, newDecoration.range);
                if (comparison < 0) {
                    // `oldDecoration` is before `newDecoration` => remove `oldDecoration`
                    decorationsToRemove.push(oldDecoration.id);
                    oldDecorationsIndex++;
                    continue;
                }
                if (comparison > 0) {
                    // `newDecoration` is before `oldDecoration` => add `newDecoration`
                    decorationsToAdd.push(newDecoration);
                    newDecorationsIndex++;
                    continue;
                }
                // The ranges of `oldDecoration` and `newDecoration` are equal
                if (!oldDecoration.options.equals(newDecoration.options)) {
                    // The options do not match => remove `oldDecoration`
                    decorationsToRemove.push(oldDecoration.id);
                    oldDecorationsIndex++;
                    continue;
                }
                // Bingo! We can reuse `oldDecoration` for `newDecoration`
                result[newDecoration.index] = oldDecoration.id;
                oldDecorationsIndex++;
                newDecorationsIndex++;
            }
            while (oldDecorationsIndex < oldDecorationsLength) {
                // No more new decorations => remove decoration at `oldDecorationsIndex`
                decorationsToRemove.push(oldDecorations[oldDecorationsIndex].id);
                oldDecorationsIndex++;
            }
            while (newDecorationsIndex < newDecorationsLength) {
                // No more old decorations => add decoration at `newDecorationsIndex`
                decorationsToAdd.push(newDecorations[newDecorationsIndex]);
                newDecorationsIndex++;
            }
            // Remove `decorationsToRemove`
            if (decorationsToRemove.length > 0) {
                this._removeDecorationsImpl(decorationsTracker, decorationsToRemove);
            }
            // Add `decorationsToAdd`
            if (decorationsToAdd.length > 0) {
                var newIds = this._addDecorationsImpl(decorationsTracker, ownerId, decorationsToAdd);
                for (var i = 0, len = decorationsToAdd.length; i < len; i++) {
                    result[decorationsToAdd[i].index] = newIds[i];
                }
            }
            return result;
        };
        return TextModelWithDecorations;
    }(textModelWithMarkers_1.TextModelWithMarkers));
    exports.TextModelWithDecorations = TextModelWithDecorations;
    function cleanClassName(className) {
        return className.replace(/[^a-z0-9\-]/gi, ' ');
    }
    var ModelDecorationOverviewRulerOptions = (function () {
        function ModelDecorationOverviewRulerOptions(options) {
            this.color = strings.empty;
            this.darkColor = strings.empty;
            this.hcColor = strings.empty;
            this.position = editorCommon.OverviewRulerLane.Center;
            if (options && options.color) {
                this.color = options.color;
            }
            if (options && options.darkColor) {
                this.darkColor = options.darkColor;
                this.hcColor = options.darkColor;
            }
            if (options && options.hcColor) {
                this.hcColor = options.hcColor;
            }
            if (options && options.hasOwnProperty('position')) {
                this.position = options.position;
            }
        }
        ModelDecorationOverviewRulerOptions.prototype.equals = function (other) {
            return (this.color === other.color
                && this.darkColor === other.darkColor
                && this.hcColor === other.hcColor
                && this.position === other.position);
        };
        return ModelDecorationOverviewRulerOptions;
    }());
    exports.ModelDecorationOverviewRulerOptions = ModelDecorationOverviewRulerOptions;
    var lastStaticId = 0;
    var ModelDecorationOptions = (function () {
        function ModelDecorationOptions(staticId, options) {
            this.staticId = staticId;
            this.stickiness = options.stickiness || editorCommon.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges;
            this.className = options.className ? cleanClassName(options.className) : strings.empty;
            this.hoverMessage = options.hoverMessage || [];
            this.glyphMarginHoverMessage = options.glyphMarginHoverMessage || [];
            this.isWholeLine = options.isWholeLine || false;
            this.showIfCollapsed = options.showIfCollapsed || false;
            this.overviewRuler = new ModelDecorationOverviewRulerOptions(options.overviewRuler);
            this.glyphMarginClassName = options.glyphMarginClassName ? cleanClassName(options.glyphMarginClassName) : strings.empty;
            this.linesDecorationsClassName = options.linesDecorationsClassName ? cleanClassName(options.linesDecorationsClassName) : strings.empty;
            this.marginClassName = options.marginClassName ? cleanClassName(options.marginClassName) : strings.empty;
            this.inlineClassName = options.inlineClassName ? cleanClassName(options.inlineClassName) : strings.empty;
            this.beforeContentClassName = options.beforeContentClassName ? cleanClassName(options.beforeContentClassName) : strings.empty;
            this.afterContentClassName = options.afterContentClassName ? cleanClassName(options.afterContentClassName) : strings.empty;
        }
        ModelDecorationOptions.register = function (options) {
            return new ModelDecorationOptions(++lastStaticId, options);
        };
        ModelDecorationOptions.createDynamic = function (options) {
            return new ModelDecorationOptions(0, options);
        };
        ModelDecorationOptions.prototype.equals = function (other) {
            if (this.staticId > 0 || other.staticId > 0) {
                return this.staticId === other.staticId;
            }
            return (this.stickiness === other.stickiness
                && this.className === other.className
                && this.isWholeLine === other.isWholeLine
                && this.showIfCollapsed === other.showIfCollapsed
                && this.glyphMarginClassName === other.glyphMarginClassName
                && this.linesDecorationsClassName === other.linesDecorationsClassName
                && this.marginClassName === other.marginClassName
                && this.inlineClassName === other.inlineClassName
                && this.beforeContentClassName === other.beforeContentClassName
                && this.afterContentClassName === other.afterContentClassName
                && htmlContent_1.markedStringsEquals(this.hoverMessage, other.hoverMessage)
                && htmlContent_1.markedStringsEquals(this.glyphMarginHoverMessage, other.glyphMarginHoverMessage)
                && this.overviewRuler.equals(other.overviewRuler));
        };
        return ModelDecorationOptions;
    }());
    exports.ModelDecorationOptions = ModelDecorationOptions;
    ModelDecorationOptions.EMPTY = ModelDecorationOptions.register({});
    var ModelDeltaDecoration = (function () {
        function ModelDeltaDecoration(index, range, options) {
            this.index = index;
            this.range = range;
            this.options = options;
        }
        return ModelDeltaDecoration;
    }());
    function _normalizeOptions(options) {
        if (options instanceof ModelDecorationOptions) {
            return options;
        }
        return ModelDecorationOptions.createDynamic(options);
    }
});
//# sourceMappingURL=textModelWithDecorations.js.map