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
define(["require", "exports", "vs/base/browser/builder", "vs/base/browser/dom", "vs/base/common/lifecycle", "vs/base/common/eventEmitter", "vs/css!./contextview"], function (require, exports, builder_1, DOM, lifecycle_1, eventEmitter_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var AnchorAlignment;
    (function (AnchorAlignment) {
        AnchorAlignment[AnchorAlignment["LEFT"] = 0] = "LEFT";
        AnchorAlignment[AnchorAlignment["RIGHT"] = 1] = "RIGHT";
    })(AnchorAlignment = exports.AnchorAlignment || (exports.AnchorAlignment = {}));
    var AnchorPosition;
    (function (AnchorPosition) {
        AnchorPosition[AnchorPosition["BELOW"] = 0] = "BELOW";
        AnchorPosition[AnchorPosition["ABOVE"] = 1] = "ABOVE";
    })(AnchorPosition = exports.AnchorPosition || (exports.AnchorPosition = {}));
    function layout(view, around, viewport, anchorPosition, anchorAlignment) {
        var chooseBiased = function (a, aIsGood, b, bIsGood) {
            if (aIsGood) {
                return a;
            }
            if (bIsGood) {
                return b;
            }
            return a;
        };
        var chooseOne = function (a, aIsGood, b, bIsGood, aIsPreferred) {
            if (aIsPreferred) {
                return chooseBiased(a, aIsGood, b, bIsGood);
            }
            else {
                return chooseBiased(b, bIsGood, a, aIsGood);
            }
        };
        var top = (function () {
            // Compute both options (putting the segment above and below)
            var posAbove = around.top - view.height;
            var posBelow = around.top + around.height;
            // Check for both options if they are good
            var aboveIsGood = (posAbove >= viewport.top && posAbove + view.height <= viewport.top + viewport.height);
            var belowIsGood = (posBelow >= viewport.top && posBelow + view.height <= viewport.top + viewport.height);
            return chooseOne(posAbove, aboveIsGood, posBelow, belowIsGood, anchorPosition === AnchorPosition.ABOVE);
        })();
        var left = (function () {
            // Compute both options (aligning left and right)
            var posLeft = around.left;
            var posRight = around.left + around.width - view.width;
            // Check for both options if they are good
            var leftIsGood = (posLeft >= viewport.left && posLeft + view.width <= viewport.left + viewport.width);
            var rightIsGood = (posRight >= viewport.left && posRight + view.width <= viewport.left + viewport.width);
            return chooseOne(posLeft, leftIsGood, posRight, rightIsGood, anchorAlignment === AnchorAlignment.LEFT);
        })();
        return { top: top, left: left };
    }
    var ContextView = (function (_super) {
        __extends(ContextView, _super);
        function ContextView(container) {
            var _this = _super.call(this) || this;
            _this.$view = builder_1.$('.context-view').hide();
            _this.setContainer(container);
            _this.toDispose = [{
                    dispose: function () {
                        _this.setContainer(null);
                    }
                }];
            _this.toDisposeOnClean = null;
            return _this;
        }
        ContextView.prototype.setContainer = function (container) {
            var _this = this;
            if (this.$container) {
                this.$container.off(ContextView.BUBBLE_UP_EVENTS);
                this.$container.off(ContextView.BUBBLE_DOWN_EVENTS, true);
                this.$container = null;
            }
            if (container) {
                this.$container = builder_1.$(container);
                this.$view.appendTo(this.$container);
                this.$container.on(ContextView.BUBBLE_UP_EVENTS, function (e) {
                    _this.onDOMEvent(e, document.activeElement, false);
                });
                this.$container.on(ContextView.BUBBLE_DOWN_EVENTS, function (e) {
                    _this.onDOMEvent(e, document.activeElement, true);
                }, null, true);
            }
        };
        ContextView.prototype.show = function (delegate) {
            if (this.isVisible()) {
                this.hide();
            }
            // Show static box
            this.$view.setClass('context-view').empty().style({ top: '0px', left: '0px' }).show();
            // Render content
            this.toDisposeOnClean = delegate.render(this.$view.getHTMLElement());
            // Set active delegate
            this.delegate = delegate;
            // Layout
            this.doLayout();
        };
        ContextView.prototype.layout = function () {
            if (!this.isVisible()) {
                return;
            }
            if (this.delegate.canRelayout === false) {
                this.hide();
                return;
            }
            if (this.delegate.layout) {
                this.delegate.layout();
            }
            this.doLayout();
        };
        ContextView.prototype.doLayout = function () {
            // Get anchor
            var anchor = this.delegate.getAnchor();
            // Compute around
            var around;
            // Get the element's position and size (to anchor the view)
            if (DOM.isHTMLElement(anchor)) {
                var elementPosition = DOM.getDomNodePagePosition(anchor);
                around = {
                    top: elementPosition.top,
                    left: elementPosition.left,
                    width: elementPosition.width,
                    height: elementPosition.height
                };
            }
            else {
                var realAnchor = anchor;
                around = {
                    top: realAnchor.y,
                    left: realAnchor.x,
                    width: realAnchor.width || 0,
                    height: realAnchor.height || 0
                };
            }
            var viewport = {
                top: DOM.StandardWindow.scrollY,
                left: DOM.StandardWindow.scrollX,
                height: window.innerHeight,
                width: window.innerWidth
            };
            // Get the view's size
            var viewSize = this.$view.getTotalSize();
            var view = { width: viewSize.width, height: viewSize.height };
            var anchorPosition = this.delegate.anchorPosition || AnchorPosition.BELOW;
            var anchorAlignment = this.delegate.anchorAlignment || AnchorAlignment.LEFT;
            var result = layout(view, around, viewport, anchorPosition, anchorAlignment);
            var containerPosition = DOM.getDomNodePagePosition(this.$container.getHTMLElement());
            result.top -= containerPosition.top;
            result.left -= containerPosition.left;
            this.$view.removeClass('top', 'bottom', 'left', 'right');
            this.$view.addClass(anchorPosition === AnchorPosition.BELOW ? 'bottom' : 'top');
            this.$view.addClass(anchorAlignment === AnchorAlignment.LEFT ? 'left' : 'right');
            this.$view.style({ top: result.top + 'px', left: result.left + 'px', width: 'initial' });
        };
        ContextView.prototype.hide = function (data) {
            if (this.delegate && this.delegate.onHide) {
                this.delegate.onHide(data);
            }
            this.delegate = null;
            if (this.toDisposeOnClean) {
                this.toDisposeOnClean.dispose();
                this.toDisposeOnClean = null;
            }
            this.$view.hide();
        };
        ContextView.prototype.isVisible = function () {
            return !!this.delegate;
        };
        ContextView.prototype.onDOMEvent = function (e, element, onCapture) {
            if (this.delegate) {
                if (this.delegate.onDOMEvent) {
                    this.delegate.onDOMEvent(e, document.activeElement);
                }
                else if (onCapture && !DOM.isAncestor(e.target, this.$container.getHTMLElement())) {
                    this.hide();
                }
            }
        };
        ContextView.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.hide();
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        ContextView.BUBBLE_UP_EVENTS = ['click', 'keydown', 'focus', 'blur'];
        ContextView.BUBBLE_DOWN_EVENTS = ['click'];
        return ContextView;
    }(eventEmitter_1.EventEmitter));
    exports.ContextView = ContextView;
});
//# sourceMappingURL=contextview.js.map