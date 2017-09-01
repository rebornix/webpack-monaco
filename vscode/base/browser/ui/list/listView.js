/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/objects", "vs/base/common/lifecycle", "vs/base/browser/touch", "vs/base/browser/dom", "vs/base/browser/event", "vs/base/browser/ui/scrollbar/scrollableElement", "vs/base/common/scrollable", "./rangeMap", "./rowCache", "vs/base/common/platform", "vs/base/browser/browser"], function (require, exports, objects_1, lifecycle_1, touch_1, DOM, event_1, scrollableElement_1, scrollable_1, rangeMap_1, rowCache_1, platform_1, browser) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function canUseTranslate3d() {
        if (browser.isFirefox) {
            return false;
        }
        if (browser.getZoomLevel() !== 0) {
            return false;
        }
        // see https://github.com/Microsoft/vscode/issues/24483
        if (browser.isChromev56) {
            var pixelRatio = browser.getPixelRatio();
            if (Math.floor(pixelRatio) !== pixelRatio) {
                // Not an integer
                return false;
            }
        }
        return true;
    }
    var MouseEventTypes = [
        'click',
        'dblclick',
        'mouseup',
        'mousedown',
        'mouseover',
        'mousemove',
        'mouseout',
        'contextmenu',
        'touchstart'
    ];
    var DefaultOptions = {
        useShadows: true
    };
    var ListView = (function () {
        function ListView(container, delegate, renderers, options) {
            if (options === void 0) { options = DefaultOptions; }
            this.delegate = delegate;
            this.items = [];
            this.itemId = 0;
            this.rangeMap = new rangeMap_1.RangeMap();
            this.renderers = objects_1.toObject(renderers, function (r) { return r.templateId; });
            this.cache = new rowCache_1.RowCache(this.renderers);
            this.lastRenderTop = 0;
            this.lastRenderHeight = 0;
            this._domNode = document.createElement('div');
            this._domNode.className = 'monaco-list';
            this.rowsContainer = document.createElement('div');
            this.rowsContainer.className = 'monaco-list-rows';
            this.gesture = new touch_1.Gesture(this.rowsContainer);
            this.scrollableElement = new scrollableElement_1.ScrollableElement(this.rowsContainer, {
                alwaysConsumeMouseWheel: true,
                horizontal: scrollable_1.ScrollbarVisibility.Hidden,
                vertical: scrollable_1.ScrollbarVisibility.Auto,
                useShadows: objects_1.getOrDefault(options, function (o) { return o.useShadows; }, DefaultOptions.useShadows)
            });
            this._domNode.appendChild(this.scrollableElement.getDomNode());
            container.appendChild(this._domNode);
            this.disposables = [this.rangeMap, this.gesture, this.scrollableElement];
            this.scrollableElement.onScroll(this.onScroll, this, this.disposables);
            event_1.domEvent(this.rowsContainer, touch_1.EventType.Change)(this.onTouchChange, this, this.disposables);
            this.layout();
        }
        Object.defineProperty(ListView.prototype, "domNode", {
            get: function () {
                return this._domNode;
            },
            enumerable: true,
            configurable: true
        });
        ListView.prototype.splice = function (start, deleteCount, elements) {
            var _this = this;
            if (elements === void 0) { elements = []; }
            var previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
            rangeMap_1.each(previousRenderRange, function (i) { return _this.removeItemFromDOM(_this.items[i]); });
            var inserted = elements.map(function (element) { return ({
                id: String(_this.itemId++),
                element: element,
                size: _this.delegate.getHeight(element),
                templateId: _this.delegate.getTemplateId(element),
                row: null
            }); });
            (_a = this.rangeMap).splice.apply(_a, [start, deleteCount].concat(inserted));
            var deleted = (_b = this.items).splice.apply(_b, [start, deleteCount].concat(inserted));
            var renderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
            rangeMap_1.each(renderRange, function (i) { return _this.insertItemInDOM(_this.items[i], i); });
            var scrollHeight = this.getContentHeight();
            this.rowsContainer.style.height = scrollHeight + "px";
            this.scrollableElement.setScrollDimensions({ scrollHeight: scrollHeight });
            return deleted.map(function (i) { return i.element; });
            var _a, _b;
        };
        Object.defineProperty(ListView.prototype, "length", {
            get: function () {
                return this.items.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListView.prototype, "renderHeight", {
            get: function () {
                var scrollDimensions = this.scrollableElement.getScrollDimensions();
                return scrollDimensions.height;
            },
            enumerable: true,
            configurable: true
        });
        ListView.prototype.element = function (index) {
            return this.items[index].element;
        };
        ListView.prototype.domElement = function (index) {
            var row = this.items[index].row;
            return row && row.domNode;
        };
        ListView.prototype.elementHeight = function (index) {
            return this.items[index].size;
        };
        ListView.prototype.elementTop = function (index) {
            return this.rangeMap.positionAt(index);
        };
        ListView.prototype.indexAt = function (position) {
            return this.rangeMap.indexAt(position);
        };
        ListView.prototype.indexAfter = function (position) {
            return this.rangeMap.indexAfter(position);
        };
        ListView.prototype.layout = function (height) {
            this.scrollableElement.setScrollDimensions({
                height: height || DOM.getContentHeight(this._domNode)
            });
        };
        // Render
        ListView.prototype.render = function (renderTop, renderHeight) {
            var _this = this;
            var previousRenderRange = this.getRenderRange(this.lastRenderTop, this.lastRenderHeight);
            var renderRange = this.getRenderRange(renderTop, renderHeight);
            var rangesToInsert = rangeMap_1.relativeComplement(renderRange, previousRenderRange);
            var rangesToRemove = rangeMap_1.relativeComplement(previousRenderRange, renderRange);
            rangesToInsert.forEach(function (range) { return rangeMap_1.each(range, function (i) { return _this.insertItemInDOM(_this.items[i], i); }); });
            rangesToRemove.forEach(function (range) { return rangeMap_1.each(range, function (i) { return _this.removeItemFromDOM(_this.items[i]); }); });
            if (canUseTranslate3d() && !platform_1.isWindows /* Windows: translate3d breaks subpixel-antialias (ClearType) unless a background is defined */) {
                var transform = "translate3d(0px, -" + renderTop + "px, 0px)";
                this.rowsContainer.style.transform = transform;
                this.rowsContainer.style.webkitTransform = transform;
            }
            else {
                this.rowsContainer.style.top = "-" + renderTop + "px";
            }
            this.lastRenderTop = renderTop;
            this.lastRenderHeight = renderHeight;
        };
        // DOM operations
        ListView.prototype.insertItemInDOM = function (item, index) {
            if (!item.row) {
                item.row = this.cache.alloc(item.templateId);
            }
            if (!item.row.domNode.parentElement) {
                this.rowsContainer.appendChild(item.row.domNode);
            }
            var renderer = this.renderers[item.templateId];
            item.row.domNode.style.top = this.elementTop(index) + "px";
            item.row.domNode.style.height = item.size + "px";
            item.row.domNode.setAttribute('data-index', "" + index);
            renderer.renderElement(item.element, index, item.row.templateData);
        };
        ListView.prototype.removeItemFromDOM = function (item) {
            this.cache.release(item.row);
            item.row = null;
        };
        ListView.prototype.getContentHeight = function () {
            return this.rangeMap.size;
        };
        ListView.prototype.getScrollTop = function () {
            var scrollPosition = this.scrollableElement.getScrollPosition();
            return scrollPosition.scrollTop;
        };
        ListView.prototype.setScrollTop = function (scrollTop) {
            this.scrollableElement.setScrollPosition({ scrollTop: scrollTop });
        };
        Object.defineProperty(ListView.prototype, "scrollTop", {
            get: function () {
                return this.getScrollTop();
            },
            set: function (scrollTop) {
                this.setScrollTop(scrollTop);
            },
            enumerable: true,
            configurable: true
        });
        // Events
        ListView.prototype.addListener = function (type, handler, useCapture) {
            var _this = this;
            var userHandler = handler;
            var domNode = this.domNode;
            if (MouseEventTypes.indexOf(type) > -1) {
                handler = function (e) { return _this.fireScopedEvent(e, userHandler, _this.getItemIndexFromMouseEvent(e)); };
            }
            else if (type === touch_1.EventType.Tap) {
                domNode = this.rowsContainer;
                handler = function (e) { return _this.fireScopedEvent(e, userHandler, _this.getItemIndexFromGestureEvent(e)); };
            }
            return DOM.addDisposableListener(domNode, type, handler, useCapture);
        };
        ListView.prototype.fireScopedEvent = function (event, handler, index) {
            if (index < 0) {
                return;
            }
            var element = this.items[index].element;
            handler(objects_1.assign(event, { element: element, index: index }));
        };
        ListView.prototype.onScroll = function (e) {
            this.render(e.scrollTop, e.height);
        };
        ListView.prototype.onTouchChange = function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.scrollTop -= event.translationY;
        };
        // Util
        ListView.prototype.getItemIndexFromMouseEvent = function (event) {
            return this.getItemIndexFromEventTarget(event.target);
        };
        ListView.prototype.getItemIndexFromGestureEvent = function (event) {
            return this.getItemIndexFromEventTarget(event.initialTarget);
        };
        ListView.prototype.getItemIndexFromEventTarget = function (target) {
            while (target instanceof HTMLElement && target !== this.rowsContainer) {
                var element = target;
                var rawIndex = element.getAttribute('data-index');
                if (rawIndex) {
                    var index = Number(rawIndex);
                    if (!isNaN(index)) {
                        return index;
                    }
                }
                target = element.parentElement;
            }
            return -1;
        };
        ListView.prototype.getRenderRange = function (renderTop, renderHeight) {
            return {
                start: this.rangeMap.indexAt(renderTop),
                end: this.rangeMap.indexAfter(renderTop + renderHeight - 1)
            };
        };
        // Dispose
        ListView.prototype.dispose = function () {
            this.items = null;
            if (this._domNode && this._domNode.parentElement) {
                this._domNode.parentNode.removeChild(this._domNode);
                this._domNode = null;
            }
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        return ListView;
    }());
    exports.ListView = ListView;
});
//# sourceMappingURL=listView.js.map