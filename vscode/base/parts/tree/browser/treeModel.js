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
define(["require", "exports", "vs/base/common/assert", "vs/base/common/errors", "vs/base/common/lifecycle", "vs/base/common/arrays", "vs/base/common/eventEmitter", "vs/base/common/winjs.base"], function (require, exports, Assert, errors_1, lifecycle_1, arrays, Events, WinJS) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LockData = (function (_super) {
        __extends(LockData, _super);
        function LockData(item) {
            var _this = _super.call(this) || this;
            _this._item = item;
            return _this;
        }
        Object.defineProperty(LockData.prototype, "item", {
            get: function () {
                return this._item;
            },
            enumerable: true,
            configurable: true
        });
        LockData.prototype.dispose = function () {
            this.emit('unlock');
            _super.prototype.dispose.call(this);
        };
        return LockData;
    }(Events.EventEmitter));
    exports.LockData = LockData;
    var Lock = (function () {
        function Lock() {
            this.locks = Object.create({});
        }
        Lock.prototype.isLocked = function (item) {
            return !!this.locks[item.id];
        };
        Lock.prototype.run = function (item, fn) {
            var _this = this;
            var lock = this.getLock(item);
            if (lock) {
                var unbindListener;
                return new WinJS.TPromise(function (c, e) {
                    unbindListener = lock.addOneTimeListener('unlock', function () {
                        return _this.run(item, fn).then(c, e);
                    });
                }, function () { unbindListener.dispose(); });
            }
            var result;
            return new WinJS.TPromise(function (c, e) {
                if (item.isDisposed()) {
                    return e(new Error('Item is disposed.'));
                }
                var lock = _this.locks[item.id] = new LockData(item);
                result = fn().then(function (r) {
                    delete _this.locks[item.id];
                    lock.dispose();
                    return r;
                }).then(c, e);
                return result;
            }, function () { return result.cancel(); });
        };
        Lock.prototype.getLock = function (item) {
            var key;
            for (key in this.locks) {
                var lock = this.locks[key];
                if (item.intersects(lock.item)) {
                    return lock;
                }
            }
            return null;
        };
        return Lock;
    }());
    exports.Lock = Lock;
    var ItemRegistry = (function (_super) {
        __extends(ItemRegistry, _super);
        function ItemRegistry() {
            var _this = _super.call(this) || this;
            _this._isDisposed = false;
            _this.items = {};
            return _this;
        }
        ItemRegistry.prototype.register = function (item) {
            Assert.ok(!this.isRegistered(item.id), 'item already registered: ' + item.id);
            this.items[item.id] = { item: item, disposable: this.addEmitter(item) };
        };
        ItemRegistry.prototype.deregister = function (item) {
            Assert.ok(this.isRegistered(item.id), 'item not registered: ' + item.id);
            this.items[item.id].disposable.dispose();
            delete this.items[item.id];
        };
        ItemRegistry.prototype.isRegistered = function (id) {
            return this.items.hasOwnProperty(id);
        };
        ItemRegistry.prototype.getItem = function (id) {
            var result = this.items[id];
            return result ? result.item : null;
        };
        ItemRegistry.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.items = null;
            this._isDisposed = true;
        };
        ItemRegistry.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        return ItemRegistry;
    }(Events.EventEmitter));
    exports.ItemRegistry = ItemRegistry;
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(id, registry, context, lock, element) {
            var _this = _super.call(this) || this;
            _this.registry = registry;
            _this.context = context;
            _this.lock = lock;
            _this.element = element;
            _this.id = id;
            _this.registry.register(_this);
            _this.doesHaveChildren = _this.context.dataSource.hasChildren(_this.context.tree, _this.element);
            _this.needsChildrenRefresh = true;
            _this.parent = null;
            _this.previous = null;
            _this.next = null;
            _this.firstChild = null;
            _this.lastChild = null;
            _this.userContent = null;
            _this.traits = {};
            _this.depth = 0;
            _this.expanded = _this.context.dataSource.shouldAutoexpand && _this.context.dataSource.shouldAutoexpand(_this.context.tree, element);
            _this.emit('item:create', { item: _this });
            _this.visible = _this._isVisible();
            _this.height = _this._getHeight();
            _this._isDisposed = false;
            return _this;
        }
        Item.prototype.getElement = function () {
            return this.element;
        };
        Item.prototype.hasChildren = function () {
            return this.doesHaveChildren;
        };
        Item.prototype.getDepth = function () {
            return this.depth;
        };
        Item.prototype.isVisible = function () {
            return this.visible;
        };
        Item.prototype.setVisible = function (value) {
            this.visible = value;
        };
        Item.prototype.isExpanded = function () {
            return this.expanded;
        };
        /* protected */ Item.prototype._setExpanded = function (value) {
            this.expanded = value;
        };
        Item.prototype.reveal = function (relativeTop) {
            if (relativeTop === void 0) { relativeTop = null; }
            var eventData = { item: this, relativeTop: relativeTop };
            this.emit('item:reveal', eventData);
        };
        Item.prototype.expand = function () {
            var _this = this;
            if (this.isExpanded() || !this.doesHaveChildren || this.lock.isLocked(this)) {
                return WinJS.TPromise.as(false);
            }
            var result = this.lock.run(this, function () {
                var eventData = { item: _this };
                var result;
                _this.emit('item:expanding', eventData);
                if (_this.needsChildrenRefresh) {
                    result = _this.refreshChildren(false, true, true);
                }
                else {
                    result = WinJS.TPromise.as(null);
                }
                return result.then(function () {
                    _this._setExpanded(true);
                    _this.emit('item:expanded', eventData);
                    return true;
                });
            });
            return result.then(function (r) {
                if (_this.isDisposed()) {
                    return false;
                }
                // Auto expand single child folders
                if (_this.context.options.autoExpandSingleChildren && r && _this.firstChild !== null && _this.firstChild === _this.lastChild && _this.firstChild.isVisible()) {
                    return _this.firstChild.expand().then(function () { return true; });
                }
                return r;
            });
        };
        Item.prototype.collapse = function (recursive) {
            var _this = this;
            if (recursive === void 0) { recursive = false; }
            if (recursive) {
                var collapseChildrenPromise = WinJS.TPromise.as(null);
                this.forEachChild(function (child) {
                    collapseChildrenPromise = collapseChildrenPromise.then(function () { return child.collapse(true); });
                });
                return collapseChildrenPromise.then(function () {
                    return _this.collapse(false);
                });
            }
            else {
                if (!this.isExpanded() || this.lock.isLocked(this)) {
                    return WinJS.TPromise.as(false);
                }
                return this.lock.run(this, function () {
                    var eventData = { item: _this };
                    _this.emit('item:collapsing', eventData);
                    _this._setExpanded(false);
                    _this.emit('item:collapsed', eventData);
                    return WinJS.TPromise.as(true);
                });
            }
        };
        Item.prototype.addTrait = function (trait) {
            var eventData = { item: this, trait: trait };
            this.traits[trait] = true;
            this.emit('item:addTrait', eventData);
        };
        Item.prototype.removeTrait = function (trait) {
            var eventData = { item: this, trait: trait };
            delete this.traits[trait];
            this.emit('item:removeTrait', eventData);
        };
        Item.prototype.hasTrait = function (trait) {
            return this.traits[trait] || false;
        };
        Item.prototype.getAllTraits = function () {
            var result = [];
            var trait;
            for (trait in this.traits) {
                if (this.traits.hasOwnProperty(trait) && this.traits[trait]) {
                    result.push(trait);
                }
            }
            return result;
        };
        Item.prototype.getHeight = function () {
            return this.height;
        };
        Item.prototype.refreshChildren = function (recursive, safe, force) {
            var _this = this;
            if (safe === void 0) { safe = false; }
            if (force === void 0) { force = false; }
            if (!force && !this.isExpanded()) {
                this.needsChildrenRefresh = true;
                return WinJS.TPromise.as(this);
            }
            this.needsChildrenRefresh = false;
            var doRefresh = function () {
                var eventData = { item: _this, isNested: safe };
                _this.emit('item:childrenRefreshing', eventData);
                var childrenPromise;
                if (_this.doesHaveChildren) {
                    childrenPromise = _this.context.dataSource.getChildren(_this.context.tree, _this.element);
                }
                else {
                    childrenPromise = WinJS.TPromise.as([]);
                }
                var result = childrenPromise.then(function (elements) {
                    if (_this.isDisposed() || _this.registry.isDisposed()) {
                        return WinJS.TPromise.as(null);
                    }
                    if (!Array.isArray(elements)) {
                        return WinJS.TPromise.wrapError(new Error('Please return an array of children.'));
                    }
                    elements = !elements ? [] : elements.slice(0);
                    elements = _this.sort(elements);
                    var staleItems = {};
                    while (_this.firstChild !== null) {
                        staleItems[_this.firstChild.id] = _this.firstChild;
                        _this.removeChild(_this.firstChild);
                    }
                    for (var i = 0, len = elements.length; i < len; i++) {
                        var element = elements[i];
                        var id = _this.context.dataSource.getId(_this.context.tree, element);
                        var item = staleItems[id] || new Item(id, _this.registry, _this.context, _this.lock, element);
                        item.element = element;
                        if (recursive) {
                            item.needsChildrenRefresh = recursive;
                        }
                        delete staleItems[id];
                        _this.addChild(item);
                    }
                    for (var staleItemId in staleItems) {
                        if (staleItems.hasOwnProperty(staleItemId)) {
                            staleItems[staleItemId].dispose();
                        }
                    }
                    if (recursive) {
                        return WinJS.Promise.join(_this.mapEachChild(function (child) {
                            return child.doRefresh(recursive, true);
                        }));
                    }
                    else {
                        return WinJS.TPromise.as(null);
                    }
                });
                return result
                    .then(null, errors_1.onUnexpectedError)
                    .then(function () { return _this.emit('item:childrenRefreshed', eventData); });
            };
            return safe ? doRefresh() : this.lock.run(this, doRefresh);
        };
        Item.prototype.doRefresh = function (recursive, safe) {
            if (safe === void 0) { safe = false; }
            var eventData = { item: this };
            this.doesHaveChildren = this.context.dataSource.hasChildren(this.context.tree, this.element);
            this.height = this._getHeight();
            this.setVisible(this._isVisible());
            this.emit('item:refresh', eventData);
            return this.refreshChildren(recursive, safe);
        };
        Item.prototype.refresh = function (recursive) {
            return this.doRefresh(recursive);
        };
        Item.prototype.getNavigator = function () {
            return new TreeNavigator(this);
        };
        Item.prototype.intersects = function (other) {
            return this.isAncestorOf(other) || other.isAncestorOf(this);
        };
        Item.prototype.getHierarchy = function () {
            var result = [];
            var node = this;
            do {
                result.push(node);
                node = node.parent;
            } while (node);
            result.reverse();
            return result;
        };
        Item.prototype.isAncestorOf = function (item) {
            while (item) {
                if (item.id === this.id) {
                    return true;
                }
                item = item.parent;
            }
            return false;
        };
        Item.prototype.addChild = function (item, afterItem) {
            if (afterItem === void 0) { afterItem = this.lastChild; }
            var isEmpty = this.firstChild === null;
            var atHead = afterItem === null;
            var atTail = afterItem === this.lastChild;
            if (isEmpty) {
                this.firstChild = this.lastChild = item;
                item.next = item.previous = null;
            }
            else if (atHead) {
                this.firstChild.previous = item;
                item.next = this.firstChild;
                item.previous = null;
                this.firstChild = item;
            }
            else if (atTail) {
                this.lastChild.next = item;
                item.next = null;
                item.previous = this.lastChild;
                this.lastChild = item;
            }
            else {
                item.previous = afterItem;
                item.next = afterItem.next;
                afterItem.next.previous = item;
                afterItem.next = item;
            }
            item.parent = this;
            item.depth = this.depth + 1;
        };
        Item.prototype.removeChild = function (item) {
            var isFirstChild = this.firstChild === item;
            var isLastChild = this.lastChild === item;
            if (isFirstChild && isLastChild) {
                this.firstChild = this.lastChild = null;
            }
            else if (isFirstChild) {
                item.next.previous = null;
                this.firstChild = item.next;
            }
            else if (isLastChild) {
                item.previous.next = null;
                this.lastChild = item.previous;
            }
            else {
                item.next.previous = item.previous;
                item.previous.next = item.next;
            }
            item.parent = null;
            item.depth = null;
        };
        Item.prototype.forEachChild = function (fn) {
            var child = this.firstChild, next;
            while (child) {
                next = child.next;
                fn(child);
                child = next;
            }
        };
        Item.prototype.mapEachChild = function (fn) {
            var result = [];
            this.forEachChild(function (child) {
                result.push(fn(child));
            });
            return result;
        };
        Item.prototype.sort = function (elements) {
            var _this = this;
            if (this.context.sorter) {
                return elements.sort(function (element, otherElement) {
                    return _this.context.sorter.compare(_this.context.tree, element, otherElement);
                });
            }
            return elements;
        };
        /* protected */ Item.prototype._getHeight = function () {
            return this.context.renderer.getHeight(this.context.tree, this.element);
        };
        /* protected */ Item.prototype._isVisible = function () {
            return this.context.filter.isVisible(this.context.tree, this.element);
        };
        Item.prototype.isDisposed = function () {
            return this._isDisposed;
        };
        Item.prototype.dispose = function () {
            this.forEachChild(function (child) { return child.dispose(); });
            this.parent = null;
            this.previous = null;
            this.next = null;
            this.firstChild = null;
            this.lastChild = null;
            var eventData = { item: this };
            this.emit('item:dispose', eventData);
            this.registry.deregister(this);
            _super.prototype.dispose.call(this);
            this._isDisposed = true;
        };
        return Item;
    }(Events.EventEmitter));
    exports.Item = Item;
    var RootItem = (function (_super) {
        __extends(RootItem, _super);
        function RootItem(id, registry, context, lock, element) {
            return _super.call(this, id, registry, context, lock, element) || this;
        }
        RootItem.prototype.isVisible = function () {
            return false;
        };
        RootItem.prototype.setVisible = function (value) {
            // no-op
        };
        RootItem.prototype.isExpanded = function () {
            return true;
        };
        /* protected */ RootItem.prototype._setExpanded = function (value) {
            // no-op
        };
        RootItem.prototype.render = function () {
            // no-op
        };
        /* protected */ RootItem.prototype._getHeight = function () {
            return 0;
        };
        /* protected */ RootItem.prototype._isVisible = function () {
            return false;
        };
        return RootItem;
    }(Item));
    var TreeNavigator = (function () {
        function TreeNavigator(item, subTreeOnly) {
            if (subTreeOnly === void 0) { subTreeOnly = true; }
            this.item = item;
            this.start = subTreeOnly ? item : null;
        }
        TreeNavigator.lastDescendantOf = function (item) {
            if (!item) {
                return null;
            }
            else {
                if (!(item instanceof RootItem) && (!item.isVisible() || !item.isExpanded() || item.lastChild === null)) {
                    return item;
                }
                else {
                    return TreeNavigator.lastDescendantOf(item.lastChild);
                }
            }
        };
        TreeNavigator.prototype.current = function () {
            return this.item || null;
        };
        TreeNavigator.prototype.next = function () {
            if (this.item) {
                do {
                    if ((this.item instanceof RootItem || (this.item.isVisible() && this.item.isExpanded())) && this.item.firstChild) {
                        this.item = this.item.firstChild;
                    }
                    else if (this.item === this.start) {
                        this.item = null;
                    }
                    else {
                        // select next brother, next uncle, next great-uncle, etc...
                        while (this.item && this.item !== this.start && !this.item.next) {
                            this.item = this.item.parent;
                        }
                        if (this.item === this.start) {
                            this.item = null;
                        }
                        this.item = !this.item ? null : this.item.next;
                    }
                } while (this.item && !this.item.isVisible());
            }
            return this.item || null;
        };
        TreeNavigator.prototype.previous = function () {
            if (this.item) {
                do {
                    var previous = TreeNavigator.lastDescendantOf(this.item.previous);
                    if (previous) {
                        this.item = previous;
                    }
                    else if (this.item.parent && this.item.parent !== this.start && this.item.parent.isVisible()) {
                        this.item = this.item.parent;
                    }
                    else {
                        this.item = null;
                    }
                } while (this.item && !this.item.isVisible());
            }
            return this.item || null;
        };
        TreeNavigator.prototype.parent = function () {
            if (this.item) {
                var parent = this.item.parent;
                if (parent && parent !== this.start && parent.isVisible()) {
                    this.item = parent;
                }
                else {
                    this.item = null;
                }
            }
            return this.item || null;
        };
        TreeNavigator.prototype.first = function () {
            this.item = this.start;
            this.next();
            return this.item || null;
        };
        TreeNavigator.prototype.last = function () {
            return TreeNavigator.lastDescendantOf(this.start);
        };
        return TreeNavigator;
    }());
    exports.TreeNavigator = TreeNavigator;
    function getRange(one, other) {
        var oneHierarchy = one.getHierarchy();
        var otherHierarchy = other.getHierarchy();
        var length = arrays.commonPrefixLength(oneHierarchy, otherHierarchy);
        var item = oneHierarchy[length - 1];
        var nav = item.getNavigator();
        var oneIndex = null;
        var otherIndex = null;
        var index = 0;
        var result = [];
        while (item && (oneIndex === null || otherIndex === null)) {
            result.push(item);
            if (item === one) {
                oneIndex = index;
            }
            if (item === other) {
                otherIndex = index;
            }
            index++;
            item = nav.next();
        }
        if (oneIndex === null || otherIndex === null) {
            return [];
        }
        var min = Math.min(oneIndex, otherIndex);
        var max = Math.max(oneIndex, otherIndex);
        return result.slice(min, max + 1);
    }
    var TreeModel = (function (_super) {
        __extends(TreeModel, _super);
        function TreeModel(context) {
            var _this = _super.call(this) || this;
            _this.context = context;
            _this.input = null;
            _this.traitsToItems = {};
            return _this;
        }
        TreeModel.prototype.setInput = function (element) {
            var _this = this;
            var eventData = { item: this.input };
            this.emit('clearingInput', eventData);
            this.setSelection([]);
            this.setFocus();
            this.setHighlight();
            this.lock = new Lock();
            if (this.input) {
                this.input.dispose();
            }
            if (this.registry) {
                this.registry.dispose();
                this.registryDisposable.dispose();
            }
            this.registry = new ItemRegistry();
            this.registryDisposable = lifecycle_1.combinedDisposable([
                this.addEmitter(this.registry),
                this.registry.addListener('item:dispose', function (event) {
                    event.item.getAllTraits()
                        .forEach(function (trait) { return delete _this.traitsToItems[trait][event.item.id]; });
                })
            ]);
            var id = this.context.dataSource.getId(this.context.tree, element);
            this.input = new RootItem(id, this.registry, this.context, this.lock, element);
            eventData = { item: this.input };
            this.emit('setInput', eventData);
            return this.refresh(this.input);
        };
        TreeModel.prototype.getInput = function () {
            return this.input ? this.input.getElement() : null;
        };
        TreeModel.prototype.refresh = function (element, recursive) {
            var _this = this;
            if (element === void 0) { element = null; }
            if (recursive === void 0) { recursive = true; }
            var item = this.getItem(element);
            if (!item) {
                return WinJS.TPromise.as(null);
            }
            var eventData = { item: item, recursive: recursive };
            this.emit('refreshing', eventData);
            return item.refresh(recursive).then(function () {
                _this.emit('refreshed', eventData);
            });
        };
        TreeModel.prototype.expand = function (element) {
            var item = this.getItem(element);
            if (!item) {
                return WinJS.TPromise.as(false);
            }
            return item.expand();
        };
        TreeModel.prototype.expandAll = function (elements) {
            if (!elements) {
                elements = [];
                var item;
                var nav = this.getNavigator();
                while (item = nav.next()) {
                    elements.push(item);
                }
            }
            var promises = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                promises.push(this.expand(elements[i]));
            }
            return WinJS.Promise.join(promises);
        };
        TreeModel.prototype.collapse = function (element, recursive) {
            if (recursive === void 0) { recursive = false; }
            var item = this.getItem(element);
            if (!item) {
                return WinJS.TPromise.as(false);
            }
            return item.collapse(recursive);
        };
        TreeModel.prototype.collapseAll = function (elements, recursive) {
            if (elements === void 0) { elements = null; }
            if (recursive === void 0) { recursive = false; }
            if (!elements) {
                elements = [this.input];
                recursive = true;
            }
            var promises = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                promises.push(this.collapse(elements[i], recursive));
            }
            return WinJS.Promise.join(promises);
        };
        TreeModel.prototype.toggleExpansion = function (element, recursive) {
            if (recursive === void 0) { recursive = false; }
            return this.isExpanded(element) ? this.collapse(element, recursive) : this.expand(element);
        };
        TreeModel.prototype.toggleExpansionAll = function (elements) {
            var promises = [];
            for (var i = 0, len = elements.length; i < len; i++) {
                promises.push(this.toggleExpansion(elements[i]));
            }
            return WinJS.Promise.join(promises);
        };
        TreeModel.prototype.isExpanded = function (element) {
            var item = this.getItem(element);
            if (!item) {
                return false;
            }
            return item.isExpanded();
        };
        TreeModel.prototype.getExpandedElements = function () {
            var result = [];
            var item;
            var nav = this.getNavigator();
            while (item = nav.next()) {
                if (item.isExpanded()) {
                    result.push(item.getElement());
                }
            }
            return result;
        };
        TreeModel.prototype.reveal = function (element, relativeTop) {
            var _this = this;
            if (relativeTop === void 0) { relativeTop = null; }
            return this.resolveUnknownParentChain(element).then(function (chain) {
                var result = WinJS.TPromise.as(null);
                chain.forEach(function (e) {
                    result = result.then(function () { return _this.expand(e); });
                });
                return result;
            }).then(function () {
                var item = _this.getItem(element);
                if (item) {
                    return item.reveal(relativeTop);
                }
            });
        };
        TreeModel.prototype.resolveUnknownParentChain = function (element) {
            var _this = this;
            return this.context.dataSource.getParent(this.context.tree, element).then(function (parent) {
                if (!parent) {
                    return WinJS.TPromise.as([]);
                }
                return _this.resolveUnknownParentChain(parent).then(function (result) {
                    result.push(parent);
                    return result;
                });
            });
        };
        TreeModel.prototype.setHighlight = function (element, eventPayload) {
            this.setTraits('highlighted', element ? [element] : []);
            var eventData = { highlight: this.getHighlight(), payload: eventPayload };
            this.emit('highlight', eventData);
        };
        TreeModel.prototype.getHighlight = function (includeHidden) {
            var result = this.getElementsWithTrait('highlighted', includeHidden);
            return result.length === 0 ? null : result[0];
        };
        TreeModel.prototype.isHighlighted = function (element) {
            var item = this.getItem(element);
            if (!item) {
                return false;
            }
            return item.hasTrait('highlighted');
        };
        TreeModel.prototype.select = function (element, eventPayload) {
            this.selectAll([element], eventPayload);
        };
        TreeModel.prototype.selectRange = function (fromElement, toElement, eventPayload) {
            var fromItem = this.getItem(fromElement);
            var toItem = this.getItem(toElement);
            if (!fromItem || !toItem) {
                return;
            }
            this.selectAll(getRange(fromItem, toItem), eventPayload);
        };
        TreeModel.prototype.deselectRange = function (fromElement, toElement, eventPayload) {
            var fromItem = this.getItem(fromElement);
            var toItem = this.getItem(toElement);
            if (!fromItem || !toItem) {
                return;
            }
            this.deselectAll(getRange(fromItem, toItem), eventPayload);
        };
        TreeModel.prototype.selectAll = function (elements, eventPayload) {
            this.addTraits('selected', elements);
            var eventData = { selection: this.getSelection(), payload: eventPayload };
            this.emit('selection', eventData);
        };
        TreeModel.prototype.deselect = function (element, eventPayload) {
            this.deselectAll([element], eventPayload);
        };
        TreeModel.prototype.deselectAll = function (elements, eventPayload) {
            this.removeTraits('selected', elements);
            var eventData = { selection: this.getSelection(), payload: eventPayload };
            this.emit('selection', eventData);
        };
        TreeModel.prototype.setSelection = function (elements, eventPayload) {
            this.setTraits('selected', elements);
            var eventData = { selection: this.getSelection(), payload: eventPayload };
            this.emit('selection', eventData);
        };
        TreeModel.prototype.toggleSelection = function (element, eventPayload) {
            this.toggleTrait('selected', element);
            var eventData = { selection: this.getSelection(), payload: eventPayload };
            this.emit('selection', eventData);
        };
        TreeModel.prototype.isSelected = function (element) {
            var item = this.getItem(element);
            if (!item) {
                return false;
            }
            return item.hasTrait('selected');
        };
        TreeModel.prototype.getSelection = function (includeHidden) {
            return this.getElementsWithTrait('selected', includeHidden);
        };
        TreeModel.prototype.selectNext = function (count, clearSelection, eventPayload) {
            if (count === void 0) { count = 1; }
            if (clearSelection === void 0) { clearSelection = true; }
            var selection = this.getSelection();
            var item = selection.length > 0 ? selection[0] : this.input;
            var nextItem;
            var nav = this.getNavigator(item, false);
            for (var i = 0; i < count; i++) {
                nextItem = nav.next();
                if (!nextItem) {
                    break;
                }
                item = nextItem;
            }
            if (clearSelection) {
                this.setSelection([item], eventPayload);
            }
            else {
                this.select(item, eventPayload);
            }
        };
        TreeModel.prototype.selectPrevious = function (count, clearSelection, eventPayload) {
            if (count === void 0) { count = 1; }
            if (clearSelection === void 0) { clearSelection = true; }
            var selection = this.getSelection(), item = null, previousItem = null;
            if (selection.length === 0) {
                var nav = this.getNavigator(this.input);
                while (item = nav.next()) {
                    previousItem = item;
                }
                item = previousItem;
            }
            else {
                item = selection[0];
                var nav = this.getNavigator(item, false);
                for (var i = 0; i < count; i++) {
                    previousItem = nav.previous();
                    if (!previousItem) {
                        break;
                    }
                    item = previousItem;
                }
            }
            if (clearSelection) {
                this.setSelection([item], eventPayload);
            }
            else {
                this.select(item, eventPayload);
            }
        };
        TreeModel.prototype.selectParent = function (eventPayload, clearSelection) {
            if (clearSelection === void 0) { clearSelection = true; }
            var selection = this.getSelection();
            var item = selection.length > 0 ? selection[0] : this.input;
            var nav = this.getNavigator(item, false);
            var parent = nav.parent();
            if (parent) {
                if (clearSelection) {
                    this.setSelection([parent], eventPayload);
                }
                else {
                    this.select(parent, eventPayload);
                }
            }
        };
        TreeModel.prototype.setFocus = function (element, eventPayload) {
            this.setTraits('focused', element ? [element] : []);
            var eventData = { focus: this.getFocus(), payload: eventPayload };
            this.emit('focus', eventData);
        };
        TreeModel.prototype.isFocused = function (element) {
            var item = this.getItem(element);
            if (!item) {
                return false;
            }
            return item.hasTrait('focused');
        };
        TreeModel.prototype.getFocus = function (includeHidden) {
            var result = this.getElementsWithTrait('focused', includeHidden);
            return result.length === 0 ? null : result[0];
        };
        TreeModel.prototype.focusNext = function (count, eventPayload) {
            if (count === void 0) { count = 1; }
            var item = this.getFocus() || this.input;
            var nextItem;
            var nav = this.getNavigator(item, false);
            for (var i = 0; i < count; i++) {
                nextItem = nav.next();
                if (!nextItem) {
                    break;
                }
                item = nextItem;
            }
            this.setFocus(item, eventPayload);
        };
        TreeModel.prototype.focusPrevious = function (count, eventPayload) {
            if (count === void 0) { count = 1; }
            var item = this.getFocus() || this.input;
            var previousItem;
            var nav = this.getNavigator(item, false);
            for (var i = 0; i < count; i++) {
                previousItem = nav.previous();
                if (!previousItem) {
                    break;
                }
                item = previousItem;
            }
            this.setFocus(item, eventPayload);
        };
        TreeModel.prototype.focusParent = function (eventPayload) {
            var item = this.getFocus() || this.input;
            var nav = this.getNavigator(item, false);
            var parent = nav.parent();
            if (parent) {
                this.setFocus(parent, eventPayload);
            }
        };
        TreeModel.prototype.focusFirstChild = function (eventPayload) {
            var item = this.getItem(this.getFocus() || this.input);
            var nav = this.getNavigator(item, false);
            var next = nav.next();
            var parent = nav.parent();
            if (parent === item) {
                this.setFocus(next, eventPayload);
            }
        };
        TreeModel.prototype.focusFirst = function (eventPayload, from) {
            this.focusNth(0, eventPayload, from);
        };
        TreeModel.prototype.focusNth = function (index, eventPayload, from) {
            var navItem = this.getParent(from);
            var nav = this.getNavigator(navItem);
            var item = nav.first();
            for (var i = 0; i < index; i++) {
                item = nav.next();
            }
            if (item) {
                this.setFocus(item, eventPayload);
            }
        };
        TreeModel.prototype.focusLast = function (eventPayload, from) {
            var navItem = this.getParent(from);
            var item;
            if (from) {
                item = navItem.lastChild;
            }
            else {
                var nav = this.getNavigator(navItem);
                item = nav.last();
            }
            if (item) {
                this.setFocus(item, eventPayload);
            }
        };
        TreeModel.prototype.getParent = function (from) {
            if (from) {
                var fromItem = this.getItem(from);
                if (fromItem && fromItem.parent) {
                    return fromItem.parent;
                }
            }
            return this.getItem(this.input);
        };
        TreeModel.prototype.getNavigator = function (element, subTreeOnly) {
            if (element === void 0) { element = null; }
            if (subTreeOnly === void 0) { subTreeOnly = true; }
            return new TreeNavigator(this.getItem(element), subTreeOnly);
        };
        TreeModel.prototype.getItem = function (element) {
            if (element === void 0) { element = null; }
            if (element === null) {
                return this.input;
            }
            else if (element instanceof Item) {
                return element;
            }
            else if (typeof element === 'string') {
                return this.registry.getItem(element);
            }
            else {
                return this.registry.getItem(this.context.dataSource.getId(this.context.tree, element));
            }
        };
        TreeModel.prototype.addTraits = function (trait, elements) {
            var items = this.traitsToItems[trait] || {};
            var item;
            for (var i = 0, len = elements.length; i < len; i++) {
                item = this.getItem(elements[i]);
                if (item) {
                    item.addTrait(trait);
                    items[item.id] = item;
                }
            }
            this.traitsToItems[trait] = items;
        };
        TreeModel.prototype.removeTraits = function (trait, elements) {
            var items = this.traitsToItems[trait] || {};
            var item;
            var id;
            if (elements.length === 0) {
                for (id in items) {
                    if (items.hasOwnProperty(id)) {
                        item = items[id];
                        item.removeTrait(trait);
                    }
                }
                delete this.traitsToItems[trait];
            }
            else {
                for (var i = 0, len = elements.length; i < len; i++) {
                    item = this.getItem(elements[i]);
                    if (item) {
                        item.removeTrait(trait);
                        delete items[item.id];
                    }
                }
            }
        };
        TreeModel.prototype.hasTrait = function (trait, element) {
            var item = this.getItem(element);
            return item && item.hasTrait(trait);
        };
        TreeModel.prototype.toggleTrait = function (trait, element) {
            var item = this.getItem(element);
            if (!item) {
                return;
            }
            if (item.hasTrait(trait)) {
                this.removeTraits(trait, [element]);
            }
            else {
                this.addTraits(trait, [element]);
            }
        };
        TreeModel.prototype.setTraits = function (trait, elements) {
            if (elements.length === 0) {
                this.removeTraits(trait, elements);
            }
            else {
                var items = {};
                var item;
                for (var i = 0, len = elements.length; i < len; i++) {
                    item = this.getItem(elements[i]);
                    if (item) {
                        items[item.id] = item;
                    }
                }
                var traitItems = this.traitsToItems[trait] || {};
                var itemsToRemoveTrait = [];
                var id;
                for (id in traitItems) {
                    if (traitItems.hasOwnProperty(id)) {
                        if (items.hasOwnProperty(id)) {
                            delete items[id];
                        }
                        else {
                            itemsToRemoveTrait.push(traitItems[id]);
                        }
                    }
                }
                for (var i = 0, len = itemsToRemoveTrait.length; i < len; i++) {
                    item = itemsToRemoveTrait[i];
                    item.removeTrait(trait);
                    delete traitItems[item.id];
                }
                for (id in items) {
                    if (items.hasOwnProperty(id)) {
                        item = items[id];
                        item.addTrait(trait);
                        traitItems[id] = item;
                    }
                }
                this.traitsToItems[trait] = traitItems;
            }
        };
        TreeModel.prototype.getElementsWithTrait = function (trait, includeHidden) {
            var elements = [];
            var items = this.traitsToItems[trait] || {};
            var id;
            for (id in items) {
                if (items.hasOwnProperty(id) && (items[id].isVisible() || includeHidden)) {
                    elements.push(items[id].getElement());
                }
            }
            return elements;
        };
        TreeModel.prototype.dispose = function () {
            if (this.registry) {
                this.registry.dispose();
                this.registry = null;
            }
            _super.prototype.dispose.call(this);
        };
        return TreeModel;
    }(Events.EventEmitter));
    exports.TreeModel = TreeModel;
});
//# sourceMappingURL=treeModel.js.map