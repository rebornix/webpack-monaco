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
define(["require", "exports", "vs/base/browser/fastDomNode", "vs/editor/browser/view/viewPart", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/css!./scrollDecoration"], function (require, exports, fastDomNode_1, viewPart_1, themeService_1, colorRegistry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScrollDecorationViewPart = (function (_super) {
        __extends(ScrollDecorationViewPart, _super);
        function ScrollDecorationViewPart(context) {
            var _this = _super.call(this, context) || this;
            _this._scrollTop = 0;
            _this._width = 0;
            _this._updateWidth();
            _this._shouldShow = false;
            _this._useShadows = _this._context.configuration.editor.viewInfo.scrollbar.useShadows;
            _this._domNode = fastDomNode_1.createFastDomNode(document.createElement('div'));
            _this._domNode.setAttribute('role', 'presentation');
            _this._domNode.setAttribute('aria-hidden', 'true');
            return _this;
        }
        ScrollDecorationViewPart.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        ScrollDecorationViewPart.prototype._updateShouldShow = function () {
            var newShouldShow = (this._useShadows && this._scrollTop > 0);
            if (this._shouldShow !== newShouldShow) {
                this._shouldShow = newShouldShow;
                return true;
            }
            return false;
        };
        ScrollDecorationViewPart.prototype.getDomNode = function () {
            return this._domNode;
        };
        ScrollDecorationViewPart.prototype._updateWidth = function () {
            var layoutInfo = this._context.configuration.editor.layoutInfo;
            var newWidth = layoutInfo.width - layoutInfo.minimapWidth;
            if (this._width !== newWidth) {
                this._width = newWidth;
                return true;
            }
            return false;
        };
        // --- begin event handlers
        ScrollDecorationViewPart.prototype.onConfigurationChanged = function (e) {
            var shouldRender = false;
            if (e.viewInfo) {
                this._useShadows = this._context.configuration.editor.viewInfo.scrollbar.useShadows;
            }
            if (e.layoutInfo) {
                shouldRender = this._updateWidth();
            }
            return this._updateShouldShow() || shouldRender;
        };
        ScrollDecorationViewPart.prototype.onScrollChanged = function (e) {
            this._scrollTop = e.scrollTop;
            return this._updateShouldShow();
        };
        // --- end event handlers
        ScrollDecorationViewPart.prototype.prepareRender = function (ctx) {
            // Nothing to read
        };
        ScrollDecorationViewPart.prototype.render = function (ctx) {
            this._domNode.setWidth(this._width);
            this._domNode.setClassName(this._shouldShow ? 'scroll-decoration' : '');
        };
        return ScrollDecorationViewPart;
    }(viewPart_1.ViewPart));
    exports.ScrollDecorationViewPart = ScrollDecorationViewPart;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var shadow = theme.getColor(colorRegistry_1.scrollbarShadow);
        if (shadow) {
            collector.addRule(".monaco-editor .scroll-decoration { box-shadow: " + shadow + " 0 6px 6px -6px inset; }");
        }
    });
});
//# sourceMappingURL=scrollDecoration.js.map