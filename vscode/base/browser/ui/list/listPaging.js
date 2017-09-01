/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/arrays", "./listWidget", "vs/base/common/event", "vs/css!./list"], function (require, exports, arrays_1, listWidget_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PagedRenderer = (function () {
        function PagedRenderer(renderer, modelProvider) {
            this.renderer = renderer;
            this.modelProvider = modelProvider;
        }
        Object.defineProperty(PagedRenderer.prototype, "templateId", {
            get: function () { return this.renderer.templateId; },
            enumerable: true,
            configurable: true
        });
        PagedRenderer.prototype.renderTemplate = function (container) {
            var data = this.renderer.renderTemplate(container);
            return { data: data, disposable: { dispose: function () { } } };
        };
        PagedRenderer.prototype.renderElement = function (index, _, data) {
            var _this = this;
            data.disposable.dispose();
            var model = this.modelProvider();
            if (model.isResolved(index)) {
                return this.renderer.renderElement(model.get(index), index, data.data);
            }
            var promise = model.resolve(index);
            data.disposable = { dispose: function () { return promise.cancel(); } };
            this.renderer.renderPlaceholder(index, data.data);
            promise.done(function (entry) { return _this.renderer.renderElement(entry, index, data.data); });
        };
        PagedRenderer.prototype.disposeTemplate = function (data) {
            data.disposable.dispose();
            data.disposable = null;
            this.renderer.disposeTemplate(data.data);
            data.data = null;
        };
        return PagedRenderer;
    }());
    var PagedList = (function () {
        function PagedList(container, delegate, renderers, options // TODO@Joao: should be IListOptions<T>
        ) {
            if (options === void 0) { options = {}; } // TODO@Joao: should be IListOptions<T>
            var _this = this;
            var pagedRenderers = renderers.map(function (r) { return new PagedRenderer(r, function () { return _this.model; }); });
            this.list = new listWidget_1.List(container, delegate, pagedRenderers, options);
        }
        Object.defineProperty(PagedList.prototype, "widget", {
            get: function () {
                return this.list;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "onFocusChange", {
            get: function () {
                var _this = this;
                return event_1.mapEvent(this.list.onFocusChange, function (_a) {
                    var elements = _a.elements, indexes = _a.indexes;
                    return ({ elements: elements.map(function (e) { return _this._model.get(e); }), indexes: indexes });
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "onSelectionChange", {
            get: function () {
                var _this = this;
                return event_1.mapEvent(this.list.onSelectionChange, function (_a) {
                    var elements = _a.elements, indexes = _a.indexes;
                    return ({ elements: elements.map(function (e) { return _this._model.get(e); }), indexes: indexes });
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "onPin", {
            get: function () {
                var _this = this;
                return event_1.mapEvent(this.list.onPin, function (_a) {
                    var elements = _a.elements, indexes = _a.indexes;
                    return ({ elements: elements.map(function (e) { return _this._model.get(e); }), indexes: indexes });
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "model", {
            get: function () {
                return this._model;
            },
            set: function (model) {
                this._model = model;
                this.list.splice(0, this.list.length, arrays_1.range(model.length));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "length", {
            get: function () {
                return this.list.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PagedList.prototype, "scrollTop", {
            get: function () {
                return this.list.scrollTop;
            },
            set: function (scrollTop) {
                this.list.scrollTop = scrollTop;
            },
            enumerable: true,
            configurable: true
        });
        PagedList.prototype.focusNext = function (n, loop) {
            this.list.focusNext(n, loop);
        };
        PagedList.prototype.focusPrevious = function (n, loop) {
            this.list.focusPrevious(n, loop);
        };
        PagedList.prototype.selectNext = function (n, loop) {
            this.list.selectNext(n, loop);
        };
        PagedList.prototype.selectPrevious = function (n, loop) {
            this.list.selectPrevious(n, loop);
        };
        PagedList.prototype.focusNextPage = function () {
            this.list.focusNextPage();
        };
        PagedList.prototype.focusPreviousPage = function () {
            this.list.focusPreviousPage();
        };
        PagedList.prototype.getFocus = function () {
            return this.list.getFocus();
        };
        PagedList.prototype.setSelection = function (indexes) {
            this.list.setSelection(indexes);
        };
        PagedList.prototype.layout = function (height) {
            this.list.layout(height);
        };
        PagedList.prototype.reveal = function (index, relativeTop) {
            this.list.reveal(index, relativeTop);
        };
        return PagedList;
    }());
    exports.PagedList = PagedList;
});
//# sourceMappingURL=listPaging.js.map