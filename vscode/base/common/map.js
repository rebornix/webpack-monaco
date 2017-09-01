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
define(["require", "exports", "vs/base/common/uri"], function (require, exports, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function values(map) {
        var result = [];
        map.forEach(function (value) { return result.push(value); });
        return result;
    }
    exports.values = values;
    function keys(map) {
        var result = [];
        map.forEach(function (value, key) { return result.push(key); });
        return result;
    }
    exports.keys = keys;
    function getOrSet(map, key, value) {
        var result = map.get(key);
        if (result === void 0) {
            result = value;
            map.set(key, result);
        }
        return result;
    }
    exports.getOrSet = getOrSet;
    /**
     * A simple Map<T> that optionally allows to set a limit of entries to store. Once the limit is hit,
     * the cache will remove the entry that was last recently added. Or, if a ratio is provided below 1,
     * all elements will be removed until the ratio is full filled (e.g. 0.75 to remove 25% of old elements).
     */
    var BoundedMap = (function () {
        function BoundedMap(limit, ratio, value) {
            if (limit === void 0) { limit = Number.MAX_VALUE; }
            if (ratio === void 0) { ratio = 1; }
            var _this = this;
            this.limit = limit;
            this.map = new Map();
            this.ratio = limit * ratio;
            if (value) {
                value.entries.forEach(function (entry) {
                    _this.set(entry.key, entry.value);
                });
            }
        }
        BoundedMap.prototype.setLimit = function (limit) {
            if (limit < 0) {
                return; // invalid limit
            }
            this.limit = limit;
            while (this.map.size > this.limit) {
                this.trim();
            }
        };
        BoundedMap.prototype.serialize = function () {
            var serialized = { entries: [] };
            this.map.forEach(function (entry) {
                serialized.entries.push({ key: entry.key, value: entry.value });
            });
            return serialized;
        };
        Object.defineProperty(BoundedMap.prototype, "size", {
            get: function () {
                return this.map.size;
            },
            enumerable: true,
            configurable: true
        });
        BoundedMap.prototype.set = function (key, value) {
            if (this.map.has(key)) {
                return false; // already present!
            }
            var entry = { key: key, value: value };
            this.push(entry);
            if (this.size > this.limit) {
                this.trim();
            }
            return true;
        };
        BoundedMap.prototype.get = function (key) {
            var entry = this.map.get(key);
            return entry ? entry.value : null;
        };
        BoundedMap.prototype.getOrSet = function (k, t) {
            var res = this.get(k);
            if (res) {
                return res;
            }
            this.set(k, t);
            return t;
        };
        BoundedMap.prototype.delete = function (key) {
            var entry = this.map.get(key);
            if (entry) {
                this.map.delete(key);
                if (entry.next) {
                    entry.next.prev = entry.prev; // [A]<-[x]<-[C] = [A]<-[C]
                }
                else {
                    this.head = entry.prev; // [A]-[x] = [A]
                }
                if (entry.prev) {
                    entry.prev.next = entry.next; // [A]->[x]->[C] = [A]->[C]
                }
                else {
                    this.tail = entry.next; // [x]-[A] = [A]
                }
                return entry.value;
            }
            return null;
        };
        BoundedMap.prototype.has = function (key) {
            return this.map.has(key);
        };
        BoundedMap.prototype.clear = function () {
            this.map.clear();
            this.head = null;
            this.tail = null;
        };
        BoundedMap.prototype.push = function (entry) {
            if (this.head) {
                // [A]-[B] = [A]-[B]->[X]
                entry.prev = this.head;
                this.head.next = entry;
            }
            if (!this.tail) {
                this.tail = entry;
            }
            this.head = entry;
            this.map.set(entry.key, entry);
        };
        BoundedMap.prototype.trim = function () {
            if (this.tail) {
                // Remove all elements until ratio is reached
                if (this.ratio < this.limit) {
                    var index = 0;
                    var current = this.tail;
                    while (current.next) {
                        // Remove the entry
                        this.map.delete(current.key);
                        // if we reached the element that overflows our ratio condition
                        // make its next element the new tail of the Map and adjust the size
                        if (index === this.ratio) {
                            this.tail = current.next;
                            this.tail.prev = null;
                            break;
                        }
                        // Move on
                        current = current.next;
                        index++;
                    }
                }
                else {
                    this.map.delete(this.tail.key);
                    // [x]-[B] = [B]
                    this.tail = this.tail.next;
                    if (this.tail) {
                        this.tail.prev = null;
                    }
                }
            }
        };
        return BoundedMap;
    }());
    exports.BoundedMap = BoundedMap;
    // --- trie'ish datastructure
    var Node = (function () {
        function Node() {
            this.children = new Map();
        }
        return Node;
    }());
    /**
     * A trie map that allows for fast look up when keys are substrings
     * to the actual search keys (dir/subdir-problem).
     */
    var TrieMap = (function () {
        function TrieMap(splitter) {
            if (splitter === void 0) { splitter = TrieMap.PathSplitter; }
            this._root = new Node();
            this._splitter = function (s) { return splitter(s).filter(function (s) { return Boolean(s); }); };
        }
        TrieMap.prototype.insert = function (path, element) {
            var parts = this._splitter(path);
            var i = 0;
            // find insertion node
            var node = this._root;
            for (; i < parts.length; i++) {
                var child = node.children.get(parts[i]);
                if (child) {
                    node = child;
                    continue;
                }
                break;
            }
            // create new nodes
            var newNode;
            for (; i < parts.length; i++) {
                newNode = new Node();
                node.children.set(parts[i], newNode);
                node = newNode;
            }
            node.element = element;
        };
        TrieMap.prototype.lookUp = function (path) {
            var parts = this._splitter(path);
            var children = this._root.children;
            var node;
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var part = parts_1[_i];
                node = children.get(part);
                if (!node) {
                    return undefined;
                }
                children = node.children;
            }
            return node.element;
        };
        TrieMap.prototype.findSubstr = function (path) {
            var parts = this._splitter(path);
            var lastNode;
            var children = this._root.children;
            for (var _i = 0, parts_2 = parts; _i < parts_2.length; _i++) {
                var part = parts_2[_i];
                var node = children.get(part);
                if (!node) {
                    break;
                }
                if (node.element) {
                    lastNode = node;
                }
                children = node.children;
            }
            // return the last matching node
            // that had an element
            if (lastNode) {
                return lastNode.element;
            }
            return undefined;
        };
        TrieMap.prototype.findSuperstr = function (path) {
            var parts = this._splitter(path);
            var children = this._root.children;
            var node;
            for (var _i = 0, parts_3 = parts; _i < parts_3.length; _i++) {
                var part = parts_3[_i];
                node = children.get(part);
                if (!node) {
                    return undefined;
                }
                children = node.children;
            }
            var result = new TrieMap(this._splitter);
            result._root = node;
            return result;
        };
        TrieMap.PathSplitter = function (s) { return s.split(/[\\/]/).filter(function (s) { return !!s; }); };
        return TrieMap;
    }());
    exports.TrieMap = TrieMap;
    var ResourceMap = (function () {
        function ResourceMap(ignoreCase) {
            this.ignoreCase = ignoreCase;
            this.map = new Map();
        }
        ResourceMap.prototype.set = function (resource, value) {
            this.map.set(this.toKey(resource), value);
        };
        ResourceMap.prototype.get = function (resource) {
            return this.map.get(this.toKey(resource));
        };
        ResourceMap.prototype.has = function (resource) {
            return this.map.has(this.toKey(resource));
        };
        Object.defineProperty(ResourceMap.prototype, "size", {
            get: function () {
                return this.map.size;
            },
            enumerable: true,
            configurable: true
        });
        ResourceMap.prototype.clear = function () {
            this.map.clear();
        };
        ResourceMap.prototype.delete = function (resource) {
            return this.map.delete(this.toKey(resource));
        };
        ResourceMap.prototype.forEach = function (clb) {
            this.map.forEach(clb);
        };
        ResourceMap.prototype.values = function () {
            return values(this.map);
        };
        ResourceMap.prototype.toKey = function (resource) {
            var key = resource.toString();
            if (this.ignoreCase) {
                key = key.toLowerCase();
            }
            return key;
        };
        return ResourceMap;
    }());
    exports.ResourceMap = ResourceMap;
    var StrictResourceMap = (function (_super) {
        __extends(StrictResourceMap, _super);
        function StrictResourceMap() {
            return _super.call(this) || this;
        }
        StrictResourceMap.prototype.keys = function () {
            return keys(this.map).map(function (key) { return uri_1.default.parse(key); });
        };
        return StrictResourceMap;
    }(ResourceMap));
    exports.StrictResourceMap = StrictResourceMap;
    var Touch;
    (function (Touch) {
        Touch.None = 0;
        Touch.First = 1;
        Touch.Last = 2;
    })(Touch = exports.Touch || (exports.Touch = {}));
    var LinkedMap = (function () {
        function LinkedMap() {
            this._map = new Map();
            this._head = undefined;
            this._tail = undefined;
            this._size = 0;
        }
        LinkedMap.prototype.clear = function () {
            this._map.clear();
            this._head = undefined;
            this._tail = undefined;
            this._size = 0;
        };
        LinkedMap.prototype.isEmpty = function () {
            return !this._head && !this._tail;
        };
        Object.defineProperty(LinkedMap.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        LinkedMap.prototype.has = function (key) {
            return this._map.has(key);
        };
        LinkedMap.prototype.get = function (key) {
            var item = this._map.get(key);
            if (!item) {
                return undefined;
            }
            return item.value;
        };
        LinkedMap.prototype.set = function (key, value, touch) {
            if (touch === void 0) { touch = Touch.None; }
            var item = this._map.get(key);
            if (item) {
                item.value = value;
                if (touch !== Touch.None) {
                    this.touch(item, touch);
                }
            }
            else {
                item = { key: key, value: value, next: undefined, previous: undefined };
                switch (touch) {
                    case Touch.None:
                        this.addItemLast(item);
                        break;
                    case Touch.First:
                        this.addItemFirst(item);
                        break;
                    case Touch.Last:
                        this.addItemLast(item);
                        break;
                    default:
                        this.addItemLast(item);
                        break;
                }
                this._map.set(key, item);
                this._size++;
            }
        };
        LinkedMap.prototype.delete = function (key) {
            return !!this.remove(key);
        };
        LinkedMap.prototype.remove = function (key) {
            var item = this._map.get(key);
            if (!item) {
                return undefined;
            }
            this._map.delete(key);
            this.removeItem(item);
            this._size--;
            return item.value;
        };
        LinkedMap.prototype.shift = function () {
            if (!this._head && !this._tail) {
                return undefined;
            }
            if (!this._head || !this._tail) {
                throw new Error('Invalid list');
            }
            var item = this._head;
            this._map.delete(item.key);
            this.removeItem(item);
            this._size--;
            return item.value;
        };
        LinkedMap.prototype.forEach = function (callbackfn, thisArg) {
            var current = this._head;
            while (current) {
                if (thisArg) {
                    callbackfn.bind(thisArg)(current.value, current.key, this);
                }
                else {
                    callbackfn(current.value, current.key, this);
                }
                current = current.next;
            }
        };
        LinkedMap.prototype.forEachReverse = function (callbackfn, thisArg) {
            var current = this._tail;
            while (current) {
                if (thisArg) {
                    callbackfn.bind(thisArg)(current.value, current.key, this);
                }
                else {
                    callbackfn(current.value, current.key, this);
                }
                current = current.previous;
            }
        };
        LinkedMap.prototype.values = function () {
            var result = [];
            var current = this._head;
            while (current) {
                result.push(current.value);
                current = current.next;
            }
            return result;
        };
        LinkedMap.prototype.keys = function () {
            var result = [];
            var current = this._head;
            while (current) {
                result.push(current.key);
                current = current.next;
            }
            return result;
        };
        /* VS Code / Monaco editor runs on es5 which has no Symbol.iterator
        public keys(): IterableIterator<K> {
            let current = this._head;
            let iterator: IterableIterator<K> = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next():IteratorResult<K> {
                    if (current) {
                        let result = { value: current.key, done: false };
                        current = current.next;
                        return result;
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
    
        public values(): IterableIterator<V> {
            let current = this._head;
            let iterator: IterableIterator<V> = {
                [Symbol.iterator]() {
                    return iterator;
                },
                next():IteratorResult<V> {
                    if (current) {
                        let result = { value: current.value, done: false };
                        current = current.next;
                        return result;
                    } else {
                        return { value: undefined, done: true };
                    }
                }
            };
            return iterator;
        }
        */
        LinkedMap.prototype.addItemFirst = function (item) {
            // First time Insert
            if (!this._head && !this._tail) {
                this._tail = item;
            }
            else if (!this._head) {
                throw new Error('Invalid list');
            }
            else {
                item.next = this._head;
                this._head.previous = item;
            }
            this._head = item;
        };
        LinkedMap.prototype.addItemLast = function (item) {
            // First time Insert
            if (!this._head && !this._tail) {
                this._head = item;
            }
            else if (!this._tail) {
                throw new Error('Invalid list');
            }
            else {
                item.previous = this._tail;
                this._tail.next = item;
            }
            this._tail = item;
        };
        LinkedMap.prototype.removeItem = function (item) {
            if (item === this._head && item === this._tail) {
                this._head = undefined;
                this._tail = undefined;
            }
            else if (item === this._head) {
                this._head = item.next;
            }
            else if (item === this._tail) {
                this._tail = item.previous;
            }
            else {
                var next = item.next;
                var previous = item.previous;
                if (!next || !previous) {
                    throw new Error('Invalid list');
                }
                next.previous = previous;
                previous.next = next;
            }
        };
        LinkedMap.prototype.touch = function (item, touch) {
            if (!this._head || !this._tail) {
                throw new Error('Invalid list');
            }
            if ((touch !== Touch.First && touch !== Touch.Last)) {
                return;
            }
            if (touch === Touch.First) {
                if (item === this._head) {
                    return;
                }
                var next = item.next;
                var previous = item.previous;
                // Unlink the item
                if (item === this._tail) {
                    // previous must be defined since item was not head but is tail
                    // So there are more than on item in the map
                    previous.next = undefined;
                    this._tail = previous;
                }
                else {
                    // Both next and previous are not undefined since item was neither head nor tail.
                    next.previous = previous;
                    previous.next = next;
                }
                // Insert the node at head
                item.previous = undefined;
                item.next = this._head;
                this._head.previous = item;
                this._head = item;
            }
            else if (touch === Touch.Last) {
                if (item === this._tail) {
                    return;
                }
                var next = item.next;
                var previous = item.previous;
                // Unlink the item.
                if (item === this._head) {
                    // next must be defined since item was not tail but is head
                    // So there are more than on item in the map
                    next.previous = undefined;
                    this._head = next;
                }
                else {
                    // Both next and previous are not undefined since item was neither head nor tail.
                    next.previous = previous;
                    previous.next = next;
                }
                item.next = undefined;
                item.previous = this._tail;
                this._tail.next = item;
                this._tail = item;
            }
        };
        return LinkedMap;
    }());
    exports.LinkedMap = LinkedMap;
});
//# sourceMappingURL=map.js.map