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
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/eventEmitter", "vs/base/common/types", "vs/base/browser/dom", "vs/base/common/numbers", "vs/base/browser/ui/sash/sash", "vs/base/browser/keyboardEvent", "vs/base/common/event", "vs/base/common/color", "vs/css!./splitview"], function (require, exports, lifecycle, ee, types, dom, numbers, sash, keyboardEvent_1, event_1, color_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Orientation;
    (function (Orientation) {
        Orientation[Orientation["VERTICAL"] = 0] = "VERTICAL";
        Orientation[Orientation["HORIZONTAL"] = 1] = "HORIZONTAL";
    })(Orientation = exports.Orientation || (exports.Orientation = {}));
    var ViewSizing;
    (function (ViewSizing) {
        ViewSizing[ViewSizing["Flexible"] = 0] = "Flexible";
        ViewSizing[ViewSizing["Fixed"] = 1] = "Fixed";
    })(ViewSizing = exports.ViewSizing || (exports.ViewSizing = {}));
    var View = (function (_super) {
        __extends(View, _super);
        function View(initialSize, opts) {
            var _this = _super.call(this) || this;
            _this.initialSize = initialSize;
            _this.size = 0;
            _this._sizing = types.isUndefined(opts.sizing) ? ViewSizing.Flexible : opts.sizing;
            _this._fixedSize = types.isUndefined(opts.fixedSize) ? 22 : opts.fixedSize;
            _this._minimumSize = types.isUndefined(opts.minimumSize) ? 22 : opts.minimumSize;
            return _this;
        }
        Object.defineProperty(View.prototype, "sizing", {
            get: function () { return this._sizing; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "fixedSize", {
            get: function () { return this._fixedSize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "minimumSize", {
            get: function () { return this.sizing === ViewSizing.Fixed ? this.fixedSize : this._minimumSize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(View.prototype, "maximumSize", {
            get: function () { return this.sizing === ViewSizing.Fixed ? this.fixedSize : Number.POSITIVE_INFINITY; },
            enumerable: true,
            configurable: true
        });
        View.prototype.setFlexible = function (size) {
            this._sizing = ViewSizing.Flexible;
            this.emit('change', types.isUndefined(size) ? this._minimumSize : size);
        };
        View.prototype.setFixed = function (size) {
            this._sizing = ViewSizing.Fixed;
            this._fixedSize = types.isUndefined(size) ? this._fixedSize : size;
            this.emit('change', this._fixedSize);
        };
        return View;
    }(ee.EventEmitter));
    exports.View = View;
    var headerDefaultOpts = {
        headerBackground: color_1.Color.fromHex('#808080').transparent(0.2)
    };
    var HeaderView = (function (_super) {
        __extends(HeaderView, _super);
        function HeaderView(initialSize, opts) {
            var _this = _super.call(this, initialSize, opts) || this;
            _this._headerSize = types.isUndefined(opts.headerSize) ? 22 : opts.headerSize;
            _this._showHeader = _this._headerSize > 0;
            _this.headerForeground = opts.headerForeground;
            _this.headerBackground = opts.headerBackground || headerDefaultOpts.headerBackground;
            _this.headerHighContrastBorder = opts.headerHighContrastBorder;
            return _this;
        }
        HeaderView.prototype.style = function (styles) {
            this.headerForeground = styles.headerForeground;
            this.headerBackground = styles.headerBackground;
            this.headerHighContrastBorder = styles.headerHighContrastBorder;
            this.applyStyles();
        };
        Object.defineProperty(HeaderView.prototype, "headerSize", {
            get: function () {
                return this._showHeader ? this._headerSize : 0;
            },
            enumerable: true,
            configurable: true
        });
        HeaderView.prototype.applyStyles = function () {
            if (this.header) {
                var headerForegroundColor = this.headerForeground ? this.headerForeground.toString() : null;
                var headerBackgroundColor = this.headerBackground ? this.headerBackground.toString() : null;
                var headerHighContrastBorderColor = this.headerHighContrastBorder ? this.headerHighContrastBorder.toString() : null;
                this.header.style.color = headerForegroundColor;
                this.header.style.backgroundColor = headerBackgroundColor;
                this.header.style.borderTop = headerHighContrastBorderColor ? "1px solid " + headerHighContrastBorderColor : null;
            }
        };
        Object.defineProperty(HeaderView.prototype, "draggableElement", {
            get: function () { return this.header; },
            enumerable: true,
            configurable: true
        });
        HeaderView.prototype.render = function (container, orientation) {
            this.header = document.createElement('div');
            this.header.className = 'header';
            var headerSize = this.headerSize + 'px';
            if (orientation === Orientation.HORIZONTAL) {
                this.header.style.width = headerSize;
            }
            else {
                this.header.style.height = headerSize;
            }
            if (this._showHeader) {
                this.renderHeader(this.header);
                container.appendChild(this.header);
            }
            this.body = document.createElement('div');
            this.body.className = 'body';
            this.layoutBodyContainer(orientation);
            this.renderBody(this.body);
            container.appendChild(this.body);
            this.applyStyles();
        };
        HeaderView.prototype.showHeader = function () {
            if (!this._showHeader) {
                if (!this.body.parentElement.contains(this.header)) {
                    this.renderHeader(this.header);
                    this.body.parentElement.insertBefore(this.header, this.body);
                }
                dom.removeClass(this.header, 'hide');
                this._showHeader = true;
                return true;
            }
            return false;
        };
        HeaderView.prototype.hideHeader = function () {
            if (this._showHeader) {
                dom.addClass(this.header, 'hide');
                this._showHeader = false;
                return true;
            }
            return false;
        };
        HeaderView.prototype.layout = function (size, orientation) {
            this.layoutBodyContainer(orientation);
            this.layoutBody(size - this.headerSize);
        };
        HeaderView.prototype.layoutBodyContainer = function (orientation) {
            var size = "calc(100% - " + this.headerSize + "px)";
            if (orientation === Orientation.HORIZONTAL) {
                this.body.style.width = size;
            }
            else {
                this.body.style.height = size;
            }
        };
        HeaderView.prototype.dispose = function () {
            this.header = null;
            this.body = null;
            _super.prototype.dispose.call(this);
        };
        return HeaderView;
    }(View));
    exports.HeaderView = HeaderView;
    var CollapsibleState;
    (function (CollapsibleState) {
        CollapsibleState[CollapsibleState["EXPANDED"] = 0] = "EXPANDED";
        CollapsibleState[CollapsibleState["COLLAPSED"] = 1] = "COLLAPSED";
    })(CollapsibleState = exports.CollapsibleState || (exports.CollapsibleState = {}));
    var AbstractCollapsibleView = (function (_super) {
        __extends(AbstractCollapsibleView, _super);
        function AbstractCollapsibleView(initialSize, opts) {
            var _this = _super.call(this, initialSize, opts) || this;
            _this._previousSize = null;
            _this.viewSizing = opts.sizing;
            _this.ariaHeaderLabel = opts.ariaHeaderLabel;
            _this.setBodySize(types.isUndefined(opts.bodySize) ? 22 : opts.bodySize);
            if (typeof _this.initialSize === 'undefined') {
                _this.initialSize = _this._bodySize + _this.headerSize;
            }
            _this.changeState(types.isUndefined(opts.initialState) ? CollapsibleState.EXPANDED : opts.initialState);
            return _this;
        }
        Object.defineProperty(AbstractCollapsibleView.prototype, "previousSize", {
            get: function () {
                return this._previousSize;
            },
            enumerable: true,
            configurable: true
        });
        AbstractCollapsibleView.prototype.setBodySize = function (bodySize) {
            this._bodySize = bodySize;
            this.updateSize();
        };
        AbstractCollapsibleView.prototype.updateSize = function () {
            if (this.viewSizing === ViewSizing.Fixed) {
                this.setFixed(this.state === CollapsibleState.EXPANDED ? this._bodySize + this.headerSize : this.headerSize);
            }
            else {
                this._minimumSize = this._bodySize + this.headerSize;
                this._previousSize = !this.previousSize || this._previousSize < this._minimumSize ? this._minimumSize : this._previousSize;
                if (this.state === CollapsibleState.EXPANDED) {
                    this.setFlexible(this._previousSize || this._minimumSize);
                }
                else {
                    this._previousSize = this.size || this._minimumSize;
                    this.setFixed(this.headerSize);
                }
            }
        };
        AbstractCollapsibleView.prototype.render = function (container, orientation) {
            var _this = this;
            _super.prototype.render.call(this, container, orientation);
            dom.addClass(this.header, 'collapsible');
            dom.addClass(this.body, 'collapsible');
            // Keyboard access
            this.header.setAttribute('tabindex', '0');
            this.header.setAttribute('role', 'toolbar');
            if (this.ariaHeaderLabel) {
                this.header.setAttribute('aria-label', this.ariaHeaderLabel);
            }
            this.header.setAttribute('aria-expanded', String(this.state === CollapsibleState.EXPANDED));
            this.headerKeyListener = dom.addDisposableListener(this.header, dom.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                var eventHandled = false;
                if (event.equals(3 /* Enter */) || event.equals(10 /* Space */) || (event.equals(15 /* LeftArrow */) && _this.state === CollapsibleState.EXPANDED) || (event.equals(17 /* RightArrow */) && _this.state === CollapsibleState.COLLAPSED)) {
                    _this.toggleExpansion();
                    eventHandled = true;
                }
                else if (event.equals(9 /* Escape */)) {
                    _this.header.blur();
                    eventHandled = true;
                }
                else if (event.equals(16 /* UpArrow */)) {
                    _this.emit('focusPrevious');
                    eventHandled = true;
                }
                else if (event.equals(18 /* DownArrow */)) {
                    _this.emit('focusNext');
                    eventHandled = true;
                }
                if (eventHandled) {
                    dom.EventHelper.stop(event, true);
                }
            });
            // Mouse access
            this.headerClickListener = dom.addDisposableListener(this.header, dom.EventType.CLICK, function () { return _this.toggleExpansion(); });
            // Track state of focus in header so that other components can adjust styles based on that
            // (for example show or hide actions based on the state of being focused or not)
            this.focusTracker = dom.trackFocus(this.header);
            this.focusTracker.addFocusListener(function () {
                dom.addClass(_this.header, 'focused');
            });
            this.focusTracker.addBlurListener(function () {
                dom.removeClass(_this.header, 'focused');
            });
        };
        AbstractCollapsibleView.prototype.focus = function () {
            if (this.header) {
                this.header.focus();
            }
        };
        AbstractCollapsibleView.prototype.layout = function (size, orientation) {
            this.layoutHeader();
            _super.prototype.layout.call(this, size, orientation);
        };
        AbstractCollapsibleView.prototype.isExpanded = function () {
            return this.state === CollapsibleState.EXPANDED;
        };
        AbstractCollapsibleView.prototype.expand = function () {
            if (this.isExpanded()) {
                return;
            }
            this.changeState(CollapsibleState.EXPANDED);
        };
        AbstractCollapsibleView.prototype.collapse = function () {
            if (!this.isExpanded()) {
                return;
            }
            this.changeState(CollapsibleState.COLLAPSED);
        };
        AbstractCollapsibleView.prototype.toggleExpansion = function () {
            if (this.isExpanded()) {
                this.collapse();
            }
            else {
                this.expand();
            }
        };
        AbstractCollapsibleView.prototype.layoutHeader = function () {
            if (!this.header) {
                return;
            }
            if (this.state === CollapsibleState.COLLAPSED) {
                dom.addClass(this.header, 'collapsed');
            }
            else {
                dom.removeClass(this.header, 'collapsed');
            }
        };
        AbstractCollapsibleView.prototype.changeState = function (state) {
            this.state = state;
            if (this.header) {
                this.header.setAttribute('aria-expanded', String(this.state === CollapsibleState.EXPANDED));
            }
            this.layoutHeader();
            this.updateSize();
        };
        AbstractCollapsibleView.prototype.showHeader = function () {
            var result = _super.prototype.showHeader.call(this);
            if (result) {
                this.updateSize();
            }
            return result;
        };
        AbstractCollapsibleView.prototype.hideHeader = function () {
            var result = _super.prototype.hideHeader.call(this);
            if (result) {
                this.updateSize();
            }
            return result;
        };
        AbstractCollapsibleView.prototype.dispose = function () {
            if (this.headerClickListener) {
                this.headerClickListener.dispose();
                this.headerClickListener = null;
            }
            if (this.headerKeyListener) {
                this.headerKeyListener.dispose();
                this.headerKeyListener = null;
            }
            if (this.focusTracker) {
                this.focusTracker.dispose();
                this.focusTracker = null;
            }
            _super.prototype.dispose.call(this);
        };
        return AbstractCollapsibleView;
    }(HeaderView));
    exports.AbstractCollapsibleView = AbstractCollapsibleView;
    var PlainView = (function (_super) {
        __extends(PlainView, _super);
        function PlainView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlainView.prototype.render = function () { };
        PlainView.prototype.focus = function () { };
        PlainView.prototype.layout = function () { };
        return PlainView;
    }(View));
    var DeadView = (function (_super) {
        __extends(DeadView, _super);
        function DeadView(view) {
            return _super.call(this, view.size, { sizing: ViewSizing.Fixed, fixedSize: 0 }) || this;
        }
        return DeadView;
    }(PlainView));
    var VoidView = (function (_super) {
        __extends(VoidView, _super);
        function VoidView() {
            return _super.call(this, 0, { sizing: ViewSizing.Fixed, minimumSize: 0, fixedSize: 0 }) || this;
        }
        VoidView.prototype.setFlexible = function (size) {
            _super.prototype.setFlexible.call(this, size);
        };
        VoidView.prototype.setFixed = function (size) {
            _super.prototype.setFixed.call(this, size);
        };
        return VoidView;
    }(PlainView));
    function sum(arr) {
        return arr.reduce(function (a, b) { return a + b; });
    }
    var SplitView = (function (_super) {
        __extends(SplitView, _super);
        function SplitView(container, options) {
            var _this = _super.call(this) || this;
            _this._onFocus = _this._register(new event_1.Emitter());
            _this.onFocus = _this._onFocus.event;
            _this._onDidOrderChange = _this._register(new event_1.Emitter());
            _this.onDidOrderChange = _this._onDidOrderChange.event;
            options = options || {};
            _this.orientation = types.isUndefined(options.orientation) ? Orientation.VERTICAL : options.orientation;
            _this.canDragAndDrop = !!options.canChangeOrderByDragAndDrop;
            _this.el = document.createElement('div');
            dom.addClass(_this.el, 'monaco-split-view');
            dom.addClass(_this.el, _this.orientation === Orientation.VERTICAL ? 'vertical' : 'horizontal');
            container.appendChild(_this.el);
            _this.size = null;
            _this.viewElements = [];
            _this.views = [];
            _this.viewChangeListeners = [];
            _this.viewFocusPreviousListeners = [];
            _this.viewFocusNextListeners = [];
            _this.viewFocusListeners = [];
            _this.viewDnDListeners = [];
            _this.sashes = [];
            _this.sashesListeners = [];
            _this.animationTimeout = null;
            _this.sashOrientation = _this.orientation === Orientation.VERTICAL
                ? sash.Orientation.HORIZONTAL
                : sash.Orientation.VERTICAL;
            if (_this.orientation === Orientation.VERTICAL) {
                _this.measureContainerSize = function () { return dom.getContentHeight(container); };
                _this.layoutViewElement = function (viewElement, size) { return viewElement.style.height = size + 'px'; };
                _this.eventWrapper = function (e) { return { start: e.startY, current: e.currentY }; };
            }
            else {
                _this.measureContainerSize = function () { return dom.getContentWidth(container); };
                _this.layoutViewElement = function (viewElement, size) { return viewElement.style.width = size + 'px'; };
                _this.eventWrapper = function (e) { return { start: e.startX, current: e.currentX }; };
            }
            // The void space exists to handle the case where all other views are fixed size
            _this.addView(new VoidView(), 1, 0);
            return _this;
        }
        SplitView.prototype.getViews = function () {
            return this.views.slice(0, this.views.length - 1);
        };
        SplitView.prototype.addView = function (view, initialWeight, index) {
            var _this = this;
            if (initialWeight === void 0) { initialWeight = 1; }
            if (index === void 0) { index = this.views.length - 1; }
            if (initialWeight <= 0) {
                throw new Error('Initial weight must be a positive number.');
            }
            /**
             * Reset size to null. This will layout newly added views to initial weights.
             */
            this.size = null;
            var viewCount = this.views.length;
            // Create view container
            var viewElement = document.createElement('div');
            dom.addClass(viewElement, 'split-view-view');
            this.viewElements.splice(index, 0, viewElement);
            // Create view
            view.render(viewElement, this.orientation);
            this.views.splice(index, 0, view);
            // Render view
            if (index === viewCount) {
                this.el.appendChild(viewElement);
            }
            else {
                this.el.insertBefore(viewElement, this.el.children.item(index));
            }
            // Listen to Drag and Drop
            this.viewDnDListeners[index] = this.createDnDListeners(view, viewElement);
            // Add sash
            if (this.views.length > 2) {
                var s_1 = new sash.Sash(this.el, this, { orientation: this.sashOrientation });
                this.sashes.splice(index - 1, 0, s_1);
                this.sashesListeners.push(s_1.addListener('start', function (e) { return _this.onSashStart(s_1, _this.eventWrapper(e)); }));
                this.sashesListeners.push(s_1.addListener('change', function (e) { return _this.onSashChange(s_1, _this.eventWrapper(e)); }));
            }
            this.viewChangeListeners.splice(index, 0, view.addListener('change', function (size) { return _this.onViewChange(view, size); }));
            this.onViewChange(view, view.minimumSize);
            var viewFocusTracker = dom.trackFocus(viewElement);
            this.viewFocusListeners.splice(index, 0, viewFocusTracker);
            viewFocusTracker.addFocusListener(function () { return _this._onFocus.fire(view); });
            this.viewFocusPreviousListeners.splice(index, 0, view.addListener('focusPrevious', function () { return index > 0 && _this.views[index - 1].focus(); }));
            this.viewFocusNextListeners.splice(index, 0, view.addListener('focusNext', function () { return index < _this.views.length && _this.views[index + 1].focus(); }));
        };
        SplitView.prototype.removeView = function (view) {
            var index = this.views.indexOf(view);
            if (index < 0) {
                return;
            }
            this.size = null;
            var deadView = new DeadView(view);
            this.views[index] = deadView;
            this.onViewChange(deadView, 0);
            var sashIndex = Math.max(index - 1, 0);
            if (sashIndex < this.sashes.length) {
                this.sashes[sashIndex].dispose();
                this.sashes.splice(sashIndex, 1);
            }
            this.viewChangeListeners[index].dispose();
            this.viewChangeListeners.splice(index, 1);
            this.viewFocusPreviousListeners[index].dispose();
            this.viewFocusPreviousListeners.splice(index, 1);
            this.viewFocusListeners[index].dispose();
            this.viewFocusListeners.splice(index, 1);
            this.viewFocusNextListeners[index].dispose();
            this.viewFocusNextListeners.splice(index, 1);
            lifecycle.dispose(this.viewDnDListeners[index]);
            this.viewDnDListeners.splice(index, 1);
            this.views.splice(index, 1);
            this.el.removeChild(this.viewElements[index]);
            this.viewElements.splice(index, 1);
            deadView.dispose();
            view.dispose();
        };
        SplitView.prototype.layout = function (size) {
            size = size || this.measureContainerSize();
            if (this.size === null) {
                this.size = size;
                this.initialLayout();
                return;
            }
            size = Math.max(size, this.views.reduce(function (t, v) { return t + v.minimumSize; }, 0));
            var diff = Math.abs(this.size - size);
            var up = numbers.countToArray(this.views.length - 1, -1);
            var collapses = this.views.map(function (v) { return v.size - v.minimumSize; });
            var expands = this.views.map(function (v) { return v.maximumSize - v.size; });
            if (size < this.size) {
                this.expandCollapse(Math.min(diff, sum(collapses)), collapses, expands, up, []);
            }
            else if (size > this.size) {
                this.expandCollapse(Math.min(diff, sum(expands)), collapses, expands, [], up);
            }
            this.size = size;
            this.layoutViews();
        };
        SplitView.prototype.style = function (styles) {
            this.dropBackground = styles.dropBackground;
        };
        SplitView.prototype.createDnDListeners = function (view, viewElement) {
            var _this = this;
            if (!this.canDragAndDrop || view instanceof VoidView) {
                return [];
            }
            var disposables = [];
            // Allow to drag
            if (view.draggableElement) {
                view.draggableElement.draggable = true;
                disposables.push(dom.addDisposableListener(view.draggableElement, dom.EventType.DRAG_START, function (e) {
                    e.dataTransfer.effectAllowed = 'move';
                    var dragImage = document.createElement('div');
                    dragImage.className = 'monaco-tree-drag-image';
                    dragImage.textContent = view.draggableLabel ? view.draggableLabel : view.draggableElement.textContent;
                    document.body.appendChild(dragImage);
                    e.dataTransfer.setDragImage(dragImage, -10, -10);
                    setTimeout(function () { return document.body.removeChild(dragImage); }, 0);
                    _this.draggedView = view;
                }));
            }
            // Drag enter
            var counter = 0; // see https://github.com/Microsoft/vscode/issues/14470
            disposables.push(dom.addDisposableListener(viewElement, dom.EventType.DRAG_ENTER, function (e) {
                if (_this.draggedView && _this.draggedView !== view) {
                    counter++;
                    _this.updateFromDragging(view, viewElement, true);
                }
            }));
            // Drag leave
            disposables.push(dom.addDisposableListener(viewElement, dom.EventType.DRAG_LEAVE, function (e) {
                if (_this.draggedView && _this.draggedView !== view) {
                    counter--;
                    if (counter === 0) {
                        _this.updateFromDragging(view, viewElement, false);
                    }
                }
            }));
            // Drag end
            disposables.push(dom.addDisposableListener(viewElement, dom.EventType.DRAG_END, function (e) {
                if (_this.draggedView) {
                    counter = 0;
                    _this.updateFromDragging(view, viewElement, false);
                    _this.draggedView = null;
                }
            }));
            // Drop
            disposables.push(dom.addDisposableListener(viewElement, dom.EventType.DROP, function (e) {
                dom.EventHelper.stop(e, true);
                counter = 0;
                _this.updateFromDragging(view, viewElement, false);
                if (_this.draggedView && _this.draggedView !== view) {
                    _this.move(_this.views.indexOf(_this.draggedView), _this.views.indexOf(view));
                }
                _this.draggedView = null;
            }));
            return disposables;
        };
        SplitView.prototype.updateFromDragging = function (view, viewElement, isDragging) {
            viewElement.style.backgroundColor = isDragging && this.dropBackground ? this.dropBackground.toString() : null;
        };
        SplitView.prototype.move = function (fromIndex, toIndex) {
            if (fromIndex < 0 || toIndex > this.views.length - 2) {
                return;
            }
            var viewChangeListener = this.viewChangeListeners.splice(fromIndex, 1)[0];
            this.viewChangeListeners.splice(toIndex, 0, viewChangeListener);
            var viewFocusPreviousListener = this.viewFocusPreviousListeners.splice(fromIndex, 1)[0];
            this.viewFocusPreviousListeners.splice(toIndex, 0, viewFocusPreviousListener);
            var viewFocusListener = this.viewFocusListeners.splice(fromIndex, 1)[0];
            this.viewFocusListeners.splice(toIndex, 0, viewFocusListener);
            var viewFocusNextListener = this.viewFocusNextListeners.splice(fromIndex, 1)[0];
            this.viewFocusNextListeners.splice(toIndex, 0, viewFocusNextListener);
            var viewDnDListeners = this.viewDnDListeners.splice(fromIndex, 1)[0];
            this.viewDnDListeners.splice(toIndex, 0, viewDnDListeners);
            var view = this.views.splice(fromIndex, 1)[0];
            this.views.splice(toIndex, 0, view);
            this.el.removeChild(this.viewElements[fromIndex]);
            this.el.insertBefore(this.viewElements[fromIndex], this.viewElements[toIndex < fromIndex ? toIndex : toIndex + 1]);
            var viewElement = this.viewElements.splice(fromIndex, 1)[0];
            this.viewElements.splice(toIndex, 0, viewElement);
            this.layout();
            this._onDidOrderChange.fire();
        };
        SplitView.prototype.onSashStart = function (sash, event) {
            var i = this.sashes.indexOf(sash);
            var collapses = this.views.map(function (v) { return v.size - v.minimumSize; });
            var expands = this.views.map(function (v) { return v.maximumSize - v.size; });
            var up = numbers.countToArray(i, -1);
            var down = numbers.countToArray(i + 1, this.views.length);
            var collapsesUp = up.map(function (i) { return collapses[i]; });
            var collapsesDown = down.map(function (i) { return collapses[i]; });
            var expandsUp = up.map(function (i) { return expands[i]; });
            var expandsDown = down.map(function (i) { return expands[i]; });
            this.state = {
                start: event.start,
                sizes: this.views.map(function (v) { return v.size; }),
                up: up,
                down: down,
                maxUp: Math.min(sum(collapsesUp), sum(expandsDown)),
                maxDown: Math.min(sum(expandsUp), sum(collapsesDown)),
                collapses: collapses,
                expands: expands
            };
        };
        SplitView.prototype.onSashChange = function (sash, event) {
            var diff = event.current - this.state.start;
            for (var i = 0; i < this.views.length; i++) {
                this.views[i].size = this.state.sizes[i];
            }
            if (diff < 0) {
                this.expandCollapse(Math.min(-diff, this.state.maxUp), this.state.collapses, this.state.expands, this.state.up, this.state.down);
            }
            else {
                this.expandCollapse(Math.min(diff, this.state.maxDown), this.state.collapses, this.state.expands, this.state.down, this.state.up);
            }
            this.layoutViews();
        };
        // Main algorithm
        SplitView.prototype.expandCollapse = function (collapse, collapses, expands, collapseIndexes, expandIndexes) {
            var _this = this;
            var totalCollapse = collapse;
            var totalExpand = totalCollapse;
            collapseIndexes.forEach(function (i) {
                var collapse = Math.min(collapses[i], totalCollapse);
                totalCollapse -= collapse;
                _this.views[i].size -= collapse;
            });
            expandIndexes.forEach(function (i) {
                var expand = Math.min(expands[i], totalExpand);
                totalExpand -= expand;
                _this.views[i].size += expand;
            });
        };
        SplitView.prototype.initialLayout = function () {
            var totalWeight = 0;
            var fixedSize = 0;
            this.views.forEach(function (v, i) {
                if (v.sizing === ViewSizing.Flexible) {
                    totalWeight += v.initialSize;
                }
                else {
                    fixedSize += v.fixedSize;
                }
            });
            var flexibleSize = this.size - fixedSize;
            this.views.forEach(function (v, i) {
                if (v.sizing === ViewSizing.Flexible) {
                    if (totalWeight === 0) {
                        v.size = flexibleSize;
                    }
                    else {
                        v.size = v.initialSize * flexibleSize / totalWeight;
                    }
                }
                else {
                    v.size = v.fixedSize;
                }
            });
            // Leftover
            var index = this.getLastFlexibleViewIndex();
            if (index >= 0) {
                this.views[index].size += this.size - this.views.reduce(function (t, v) { return t + v.size; }, 0);
            }
            // Layout
            this.layoutViews();
        };
        SplitView.prototype.getLastFlexibleViewIndex = function (exceptIndex) {
            if (exceptIndex === void 0) { exceptIndex = null; }
            for (var i = this.views.length - 1; i >= 0; i--) {
                if (exceptIndex === i) {
                    continue;
                }
                if (this.views[i].sizing === ViewSizing.Flexible) {
                    return i;
                }
            }
            return -1;
        };
        SplitView.prototype.layoutViews = function () {
            for (var i = 0; i < this.views.length; i++) {
                // Layout the view elements
                this.layoutViewElement(this.viewElements[i], this.views[i].size);
                // Layout the views themselves
                this.views[i].layout(this.views[i].size, this.orientation);
            }
            // Layout the sashes
            this.sashes.forEach(function (s) { return s.layout(); });
            // Update sashes enablement
            var previous = false;
            var collapsesDown = this.views.map(function (v) { return previous = (v.size - v.minimumSize > 0) || previous; });
            previous = false;
            var expandsDown = this.views.map(function (v) { return previous = (v.maximumSize - v.size > 0) || previous; });
            var reverseViews = this.views.slice().reverse();
            previous = false;
            var collapsesUp = reverseViews.map(function (v) { return previous = (v.size - v.minimumSize > 0) || previous; }).reverse();
            previous = false;
            var expandsUp = reverseViews.map(function (v) { return previous = (v.maximumSize - v.size > 0) || previous; }).reverse();
            this.sashes.forEach(function (s, i) {
                if ((collapsesDown[i] && expandsUp[i + 1]) || (expandsDown[i] && collapsesUp[i + 1])) {
                    s.enable();
                }
                else {
                    s.disable();
                }
            });
        };
        SplitView.prototype.onViewChange = function (view, size) {
            if (view !== this.voidView) {
                if (this.areAllViewsFixed()) {
                    this.voidView.setFlexible();
                }
                else {
                    this.voidView.setFixed();
                }
            }
            if (this.size === null) {
                return;
            }
            if (size === view.size) {
                return;
            }
            this.setupAnimation();
            var index = this.views.indexOf(view);
            var diff = Math.abs(size - view.size);
            var up = numbers.countToArray(index - 1, -1);
            var down = numbers.countToArray(index + 1, this.views.length);
            var downUp = down.concat(up);
            var collapses = this.views.map(function (v) { return Math.max(v.size - v.minimumSize, 0); });
            var expands = this.views.map(function (v) { return Math.max(v.maximumSize - v.size, 0); });
            var collapse, collapseIndexes, expandIndexes;
            if (size < view.size) {
                collapse = Math.min(downUp.reduce(function (t, i) { return t + expands[i]; }, 0), diff);
                collapseIndexes = [index];
                expandIndexes = downUp;
            }
            else {
                collapse = Math.min(downUp.reduce(function (t, i) { return t + collapses[i]; }, 0), diff);
                collapseIndexes = downUp;
                expandIndexes = [index];
            }
            this.expandCollapse(collapse, collapses, expands, collapseIndexes, expandIndexes);
            this.layoutViews();
        };
        SplitView.prototype.setupAnimation = function () {
            var _this = this;
            if (types.isNumber(this.animationTimeout)) {
                window.clearTimeout(this.animationTimeout);
            }
            dom.addClass(this.el, 'animated');
            this.animationTimeout = window.setTimeout(function () { return _this.clearAnimation(); }, 200);
        };
        SplitView.prototype.clearAnimation = function () {
            this.animationTimeout = null;
            dom.removeClass(this.el, 'animated');
        };
        Object.defineProperty(SplitView.prototype, "voidView", {
            get: function () {
                return this.views[this.views.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        SplitView.prototype.areAllViewsFixed = function () {
            var _this = this;
            return this.views.every(function (v, i) { return v.sizing === ViewSizing.Fixed || i === _this.views.length - 1; });
        };
        SplitView.prototype.getVerticalSashLeft = function (sash) {
            return this.getSashPosition(sash);
        };
        SplitView.prototype.getHorizontalSashTop = function (sash) {
            return this.getSashPosition(sash);
        };
        SplitView.prototype.getSashPosition = function (sash) {
            var index = this.sashes.indexOf(sash);
            var position = 0;
            for (var i = 0; i <= index; i++) {
                position += this.views[i].size;
            }
            return position;
        };
        SplitView.prototype.dispose = function () {
            var _this = this;
            if (types.isNumber(this.animationTimeout)) {
                window.clearTimeout(this.animationTimeout);
            }
            this.orientation = null;
            this.size = null;
            this.viewElements.forEach(function (e) { return _this.el.removeChild(e); });
            this.el = null;
            this.viewElements = [];
            this.views = lifecycle.dispose(this.views);
            this.sashes = lifecycle.dispose(this.sashes);
            this.sashesListeners = lifecycle.dispose(this.sashesListeners);
            this.measureContainerSize = null;
            this.layoutViewElement = null;
            this.eventWrapper = null;
            this.state = null;
            _super.prototype.dispose.call(this);
        };
        return SplitView;
    }(lifecycle.Disposable));
    exports.SplitView = SplitView;
});
//# sourceMappingURL=splitview.js.map