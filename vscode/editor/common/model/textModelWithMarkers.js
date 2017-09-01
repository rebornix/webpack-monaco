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
define(["require", "exports", "vs/base/common/idGenerator", "vs/editor/common/core/position", "vs/editor/common/model/modelLine", "vs/editor/common/model/textModelWithTokens"], function (require, exports, idGenerator_1, position_1, modelLine_1, textModelWithTokens_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var _INSTANCE_COUNT = 0;
    var TextModelWithMarkers = (function (_super) {
        __extends(TextModelWithMarkers, _super);
        function TextModelWithMarkers(rawTextSource, creationOptions, languageIdentifier) {
            var _this = _super.call(this, rawTextSource, creationOptions, languageIdentifier) || this;
            _this._markerIdGenerator = new idGenerator_1.IdGenerator((++_INSTANCE_COUNT) + ';');
            _this._markerIdToMarker = Object.create(null);
            return _this;
        }
        TextModelWithMarkers.prototype.dispose = function () {
            this._markerIdToMarker = null;
            _super.prototype.dispose.call(this);
        };
        TextModelWithMarkers.prototype._resetValue = function (newValue) {
            _super.prototype._resetValue.call(this, newValue);
            // Destroy all my markers
            this._markerIdToMarker = Object.create(null);
        };
        TextModelWithMarkers.prototype._addMarker = function (internalDecorationId, lineNumber, column, stickToPreviousCharacter) {
            var pos = this.validatePosition(new position_1.Position(lineNumber, column));
            var marker = new modelLine_1.LineMarker(this._markerIdGenerator.nextId(), internalDecorationId, pos, stickToPreviousCharacter);
            this._markerIdToMarker[marker.id] = marker;
            this._lines[pos.lineNumber - 1].addMarker(marker);
            return marker.id;
        };
        TextModelWithMarkers.prototype._addMarkers = function (newMarkers) {
            if (newMarkers.length === 0) {
                return [];
            }
            var markers = [];
            for (var i = 0, len = newMarkers.length; i < len; i++) {
                var newMarker = newMarkers[i];
                var marker = new modelLine_1.LineMarker(this._markerIdGenerator.nextId(), newMarker.internalDecorationId, newMarker.position, newMarker.stickToPreviousCharacter);
                this._markerIdToMarker[marker.id] = marker;
                markers[i] = marker;
            }
            var sortedMarkers = markers.slice(0);
            sortedMarkers.sort(function (a, b) {
                return a.position.lineNumber - b.position.lineNumber;
            });
            var currentLineNumber = 0;
            var currentMarkers = [], currentMarkersLen = 0;
            for (var i = 0, len = sortedMarkers.length; i < len; i++) {
                var marker = sortedMarkers[i];
                if (marker.position.lineNumber !== currentLineNumber) {
                    if (currentLineNumber !== 0) {
                        this._lines[currentLineNumber - 1].addMarkers(currentMarkers);
                    }
                    currentLineNumber = marker.position.lineNumber;
                    currentMarkers.length = 0;
                    currentMarkersLen = 0;
                }
                currentMarkers[currentMarkersLen++] = marker;
            }
            this._lines[currentLineNumber - 1].addMarkers(currentMarkers);
            return markers;
        };
        TextModelWithMarkers.prototype._changeMarker = function (id, lineNumber, column) {
            var marker = this._markerIdToMarker[id];
            if (!marker) {
                return;
            }
            var newPos = this.validatePosition(new position_1.Position(lineNumber, column));
            if (newPos.lineNumber !== marker.position.lineNumber) {
                // Move marker between lines
                this._lines[marker.position.lineNumber - 1].removeMarker(marker);
                this._lines[newPos.lineNumber - 1].addMarker(marker);
            }
            marker.setPosition(newPos);
        };
        TextModelWithMarkers.prototype._changeMarkerStickiness = function (id, newStickToPreviousCharacter) {
            var marker = this._markerIdToMarker[id];
            if (!marker) {
                return;
            }
            marker.stickToPreviousCharacter = newStickToPreviousCharacter;
        };
        TextModelWithMarkers.prototype._getMarker = function (id) {
            var marker = this._markerIdToMarker[id];
            if (!marker) {
                return null;
            }
            return marker.position;
        };
        TextModelWithMarkers.prototype._getMarkersCount = function () {
            return Object.keys(this._markerIdToMarker).length;
        };
        TextModelWithMarkers.prototype._removeMarker = function (id) {
            var marker = this._markerIdToMarker[id];
            if (!marker) {
                return;
            }
            this._lines[marker.position.lineNumber - 1].removeMarker(marker);
            delete this._markerIdToMarker[id];
        };
        TextModelWithMarkers.prototype._removeMarkers = function (markers) {
            markers.sort(function (a, b) {
                return a.position.lineNumber - b.position.lineNumber;
            });
            var currentLineNumber = 0;
            var currentMarkers = null;
            for (var i = 0, len = markers.length; i < len; i++) {
                var marker = markers[i];
                delete this._markerIdToMarker[marker.id];
                if (marker.position.lineNumber !== currentLineNumber) {
                    if (currentLineNumber !== 0) {
                        this._lines[currentLineNumber - 1].removeMarkers(currentMarkers);
                    }
                    currentLineNumber = marker.position.lineNumber;
                    currentMarkers = Object.create(null);
                }
                currentMarkers[marker.id] = true;
            }
            this._lines[currentLineNumber - 1].removeMarkers(currentMarkers);
        };
        return TextModelWithMarkers;
    }(textModelWithTokens_1.TextModelWithTokens));
    exports.TextModelWithMarkers = TextModelWithMarkers;
});
//# sourceMappingURL=textModelWithMarkers.js.map