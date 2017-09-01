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
define(["require", "exports", "vs/base/common/winjs.base"], function (require, exports, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function OneGetThreadService(thing) {
        return {
            get: function () {
                return thing;
            },
            set: function (identifier, value) {
                return value;
            },
            assertRegistered: undefined
        };
    }
    exports.OneGetThreadService = OneGetThreadService;
    var AbstractTestThreadService = (function () {
        function AbstractTestThreadService(isMain) {
            this._proxies = Object.create(null);
            this._isMain = isMain;
            this._locals = Object.create(null);
            this._proxies = Object.create(null);
        }
        AbstractTestThreadService.prototype.handle = function (rpcId, methodName, args) {
            if (!this._locals[rpcId]) {
                throw new Error('Unknown actor ' + rpcId);
            }
            var actor = this._locals[rpcId];
            var method = actor[methodName];
            if (typeof method !== 'function') {
                throw new Error('Unknown method ' + methodName + ' on actor ' + rpcId);
            }
            return method.apply(actor, args);
        };
        AbstractTestThreadService.prototype.get = function (identifier) {
            if (!this._proxies[identifier.id]) {
                this._proxies[identifier.id] = this._createProxy(identifier.id);
            }
            return this._proxies[identifier.id];
        };
        AbstractTestThreadService.prototype._createProxy = function (id) {
            var _this = this;
            var handler = {
                get: function (target, name) {
                    return function () {
                        var myArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            myArgs[_i] = arguments[_i];
                        }
                        return _this._callOnRemote(id, name, myArgs);
                    };
                }
            };
            return new Proxy({}, handler);
        };
        AbstractTestThreadService.prototype.set = function (identifier, value) {
            if (identifier.isMain !== this._isMain) {
                throw new Error('Mismatch in object registration!');
            }
            this._locals[identifier.id] = value;
            return value;
        };
        return AbstractTestThreadService;
    }());
    exports.AbstractTestThreadService = AbstractTestThreadService;
    var TestThreadService = (function (_super) {
        __extends(TestThreadService, _super);
        function TestThreadService() {
            var _this = _super.call(this, false) || this;
            _this._callCountValue = 0;
            _this._testInstances = Object.create(null);
            return _this;
        }
        Object.defineProperty(TestThreadService.prototype, "_callCount", {
            get: function () {
                return this._callCountValue;
            },
            set: function (value) {
                this._callCountValue = value;
                if (this._callCountValue === 0) {
                    if (this._completeIdle) {
                        this._completeIdle();
                    }
                    this._idle = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        TestThreadService.prototype.sync = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) {
                setTimeout(c, 0);
            }).then(function () {
                if (_this._callCount === 0) {
                    return undefined;
                }
                if (!_this._idle) {
                    _this._idle = new winjs_base_1.TPromise(function (c, e) {
                        _this._completeIdle = c;
                    }, function () {
                        // no cancel
                    });
                }
                return _this._idle;
            });
        };
        TestThreadService.prototype.setTestInstance = function (identifier, value) {
            this._testInstances[identifier.id] = value;
            return value;
        };
        TestThreadService.prototype.get = function (identifier) {
            var id = identifier.id;
            if (this._locals[id]) {
                return this._locals[id];
            }
            return _super.prototype.get.call(this, identifier);
        };
        TestThreadService.prototype._callOnRemote = function (proxyId, path, args) {
            var _this = this;
            this._callCount++;
            return new winjs_base_1.TPromise(function (c) {
                setTimeout(c, 0);
            }).then(function () {
                var instance = _this._testInstances[proxyId];
                var p;
                try {
                    var result = instance[path].apply(instance, args);
                    p = winjs_base_1.TPromise.is(result) ? result : winjs_base_1.TPromise.as(result);
                }
                catch (err) {
                    p = winjs_base_1.TPromise.wrapError(err);
                }
                return p.then(function (result) {
                    _this._callCount--;
                    return result;
                }, function (err) {
                    _this._callCount--;
                    return winjs_base_1.TPromise.wrapError(err);
                });
            });
        };
        TestThreadService.prototype.assertRegistered = function (identifiers) {
            throw new Error('Not implemented!');
        };
        return TestThreadService;
    }(AbstractTestThreadService));
    exports.TestThreadService = TestThreadService;
});
//# sourceMappingURL=testThreadService.js.map