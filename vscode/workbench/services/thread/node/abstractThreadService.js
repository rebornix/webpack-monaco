define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbstractThreadService = (function () {
        function AbstractThreadService(rpcProtocol, isMain) {
            this._proxies = Object.create(null);
            this._rpcProtocol = rpcProtocol;
            this._isMain = isMain;
            this._locals = Object.create(null);
            this._proxies = Object.create(null);
            this._rpcProtocol.setDispatcher(this);
        }
        AbstractThreadService.prototype.dispose = function () {
            this._rpcProtocol.dispose();
        };
        AbstractThreadService.prototype.invoke = function (proxyId, methodName, args) {
            if (!this._locals[proxyId]) {
                throw new Error('Unknown actor ' + proxyId);
            }
            var actor = this._locals[proxyId];
            var method = actor[methodName];
            if (typeof method !== 'function') {
                throw new Error('Unknown method ' + methodName + ' on actor ' + proxyId);
            }
            return method.apply(actor, args);
        };
        AbstractThreadService.prototype.get = function (identifier) {
            if (!this._proxies[identifier.id]) {
                this._proxies[identifier.id] = this._createProxy(identifier.id);
            }
            return this._proxies[identifier.id];
        };
        AbstractThreadService.prototype._createProxy = function (proxyId) {
            var _this = this;
            var handler = {
                get: function (target, name) {
                    if (!target[name]) {
                        target[name] = function () {
                            var myArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                myArgs[_i] = arguments[_i];
                            }
                            return _this._callOnRemote(proxyId, name, myArgs);
                        };
                    }
                    return target[name];
                }
            };
            return new Proxy(Object.create(null), handler);
        };
        AbstractThreadService.prototype.set = function (identifier, value) {
            if (identifier.isMain !== this._isMain) {
                throw new Error('Mismatch in object registration!');
            }
            this._locals[identifier.id] = value;
            return value;
        };
        AbstractThreadService.prototype.assertRegistered = function (identifiers) {
            for (var i = 0, len = identifiers.length; i < len; i++) {
                var identifier = identifiers[i];
                if (!this._locals[identifier.id]) {
                    throw new Error("Missing actor " + identifier.id + " (isMain: " + identifier.isMain + ")");
                }
            }
        };
        AbstractThreadService.prototype._callOnRemote = function (proxyId, methodName, args) {
            return this._rpcProtocol.callOnRemote(proxyId, methodName, args);
        };
        return AbstractThreadService;
    }());
    exports.AbstractThreadService = AbstractThreadService;
});
//# sourceMappingURL=abstractThreadService.js.map