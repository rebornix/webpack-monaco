define(["require", "exports", "vs/base/common/event"], function (require, exports, event_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EditorZoom = new (function () {
        function class_1() {
            this._zoomLevel = 0;
            this._onDidChangeZoomLevel = new event_1.Emitter();
            this.onDidChangeZoomLevel = this._onDidChangeZoomLevel.event;
        }
        class_1.prototype.getZoomLevel = function () {
            return this._zoomLevel;
        };
        class_1.prototype.setZoomLevel = function (zoomLevel) {
            zoomLevel = Math.min(Math.max(-9, zoomLevel), 9);
            if (this._zoomLevel === zoomLevel) {
                return;
            }
            this._zoomLevel = zoomLevel;
            this._onDidChangeZoomLevel.fire(this._zoomLevel);
        };
        return class_1;
    }());
});
//# sourceMappingURL=editorZoom.js.map