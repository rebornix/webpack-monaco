/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @internal
     */
    exports.TextModelEventType = {
        ModelDispose: 'modelDispose',
        ModelTokensChanged: 'modelTokensChanged',
        ModelLanguageChanged: 'modelLanguageChanged',
        ModelOptionsChanged: 'modelOptionsChanged',
        ModelContentChanged: 'contentChanged',
        ModelRawContentChanged2: 'rawContentChanged2',
        ModelDecorationsChanged: 'decorationsChanged',
    };
    /**
     * @internal
     */
    var RawContentChangedType;
    (function (RawContentChangedType) {
        RawContentChangedType[RawContentChangedType["Flush"] = 1] = "Flush";
        RawContentChangedType[RawContentChangedType["LineChanged"] = 2] = "LineChanged";
        RawContentChangedType[RawContentChangedType["LinesDeleted"] = 3] = "LinesDeleted";
        RawContentChangedType[RawContentChangedType["LinesInserted"] = 4] = "LinesInserted";
        RawContentChangedType[RawContentChangedType["EOLChanged"] = 5] = "EOLChanged";
    })(RawContentChangedType = exports.RawContentChangedType || (exports.RawContentChangedType = {}));
    /**
     * An event describing that a model has been reset to a new value.
     * @internal
     */
    var ModelRawFlush = (function () {
        function ModelRawFlush() {
            this.changeType = 1 /* Flush */;
        }
        return ModelRawFlush;
    }());
    exports.ModelRawFlush = ModelRawFlush;
    /**
     * An event describing that a line has changed in a model.
     * @internal
     */
    var ModelRawLineChanged = (function () {
        function ModelRawLineChanged(lineNumber, detail) {
            this.changeType = 2 /* LineChanged */;
            this.lineNumber = lineNumber;
            this.detail = detail;
        }
        return ModelRawLineChanged;
    }());
    exports.ModelRawLineChanged = ModelRawLineChanged;
    /**
     * An event describing that line(s) have been deleted in a model.
     * @internal
     */
    var ModelRawLinesDeleted = (function () {
        function ModelRawLinesDeleted(fromLineNumber, toLineNumber) {
            this.changeType = 3 /* LinesDeleted */;
            this.fromLineNumber = fromLineNumber;
            this.toLineNumber = toLineNumber;
        }
        return ModelRawLinesDeleted;
    }());
    exports.ModelRawLinesDeleted = ModelRawLinesDeleted;
    /**
     * An event describing that line(s) have been inserted in a model.
     * @internal
     */
    var ModelRawLinesInserted = (function () {
        function ModelRawLinesInserted(fromLineNumber, toLineNumber, detail) {
            this.changeType = 4 /* LinesInserted */;
            this.fromLineNumber = fromLineNumber;
            this.toLineNumber = toLineNumber;
            this.detail = detail;
        }
        return ModelRawLinesInserted;
    }());
    exports.ModelRawLinesInserted = ModelRawLinesInserted;
    /**
     * An event describing that a model has had its EOL changed.
     * @internal
     */
    var ModelRawEOLChanged = (function () {
        function ModelRawEOLChanged() {
            this.changeType = 5 /* EOLChanged */;
        }
        return ModelRawEOLChanged;
    }());
    exports.ModelRawEOLChanged = ModelRawEOLChanged;
    /**
     * An event describing a change in the text of a model.
     * @internal
     */
    var ModelRawContentChangedEvent = (function () {
        function ModelRawContentChangedEvent(changes, versionId, isUndoing, isRedoing) {
            this.changes = changes;
            this.versionId = versionId;
            this.isUndoing = isUndoing;
            this.isRedoing = isRedoing;
        }
        ModelRawContentChangedEvent.prototype.containsEvent = function (type) {
            for (var i = 0, len = this.changes.length; i < len; i++) {
                var change = this.changes[i];
                if (change.changeType === type) {
                    return true;
                }
            }
            return false;
        };
        return ModelRawContentChangedEvent;
    }());
    exports.ModelRawContentChangedEvent = ModelRawContentChangedEvent;
});
//# sourceMappingURL=textModelEvents.js.map