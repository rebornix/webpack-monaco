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
define(["require", "exports", "vs/editor/common/viewModel/viewEventHandler", "vs/editor/browser/viewParts/overviewRuler/overviewRulerImpl"], function (require, exports, viewEventHandler_1, overviewRulerImpl_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OverviewRuler = (function (_super) {
        __extends(OverviewRuler, _super);
        function OverviewRuler(context, cssClassName, minimumHeight, maximumHeight) {
            var _this = _super.call(this) || this;
            _this._context = context;
            _this._overviewRuler = new overviewRulerImpl_1.OverviewRulerImpl(0, cssClassName, _this._context.viewLayout.getScrollHeight(), _this._context.configuration.editor.lineHeight, _this._context.configuration.editor.pixelRatio, minimumHeight, maximumHeight, function (lineNumber) { return _this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber); });
            _this._context.addEventHandler(_this);
            return _this;
        }
        OverviewRuler.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._overviewRuler.dispose();
            _super.prototype.dispose.call(this);
        };
        // ---- begin view event handlers
        OverviewRuler.prototype.onConfigurationChanged = function (e) {
            if (e.lineHeight) {
                this._overviewRuler.setLineHeight(this._context.configuration.editor.lineHeight, true);
            }
            if (e.pixelRatio) {
                this._overviewRuler.setPixelRatio(this._context.configuration.editor.pixelRatio, true);
            }
            return true;
        };
        OverviewRuler.prototype.onFlushed = function (e) {
            return true;
        };
        OverviewRuler.prototype.onScrollChanged = function (e) {
            this._overviewRuler.setScrollHeight(e.scrollHeight, true);
            return _super.prototype.onScrollChanged.call(this, e) || e.scrollHeightChanged;
        };
        OverviewRuler.prototype.onZonesChanged = function (e) {
            return true;
        };
        // ---- end view event handlers
        OverviewRuler.prototype.getDomNode = function () {
            return this._overviewRuler.getDomNode();
        };
        OverviewRuler.prototype.setLayout = function (position) {
            this._overviewRuler.setLayout(position, true);
        };
        OverviewRuler.prototype.setZones = function (zones) {
            this._overviewRuler.setZones(zones, true);
        };
        return OverviewRuler;
    }(viewEventHandler_1.ViewEventHandler));
    exports.OverviewRuler = OverviewRuler;
});
//# sourceMappingURL=overviewRuler.js.map