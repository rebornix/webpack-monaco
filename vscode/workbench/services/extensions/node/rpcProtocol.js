define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/marshalling", "vs/base/common/errors", "vs/workbench/services/extensions/node/lazyPromise"], function (require, exports, winjs_base_1, marshalling, errors, lazyPromise_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RPCProtocol = (function () {
        function RPCProtocol(protocol) {
            var _this = this;
            this._isDisposed = false;
            this._bigHandler = null;
            this._lastMessageId = 0;
            this._invokedHandlers = Object.create(null);
            this._pendingRPCReplies = {};
            this._multiplexor = new RPCMultiplexer(protocol, function (msg) { return _this._receiveOneMessage(msg); });
        }
        RPCProtocol.prototype.dispose = function () {
            var _this = this;
            this._isDisposed = true;
            // Release all outstanding promises with a canceled error
            Object.keys(this._pendingRPCReplies).forEach(function (msgId) {
                var pending = _this._pendingRPCReplies[msgId];
                pending.resolveErr(errors.canceled());
            });
        };
        RPCProtocol.prototype._receiveOneMessage = function (rawmsg) {
            var _this = this;
            if (this._isDisposed) {
                console.warn('Received message after being shutdown: ', rawmsg);
                return;
            }
            var msg = marshalling.parse(rawmsg);
            if (msg.seq) {
                if (!this._pendingRPCReplies.hasOwnProperty(msg.seq)) {
                    console.warn('Got reply to unknown seq');
                    return;
                }
                var reply = this._pendingRPCReplies[msg.seq];
                delete this._pendingRPCReplies[msg.seq];
                if (msg.err) {
                    var err = msg.err;
                    if (msg.err.$isError) {
                        err = new Error();
                        err.name = msg.err.name;
                        err.message = msg.err.message;
                        err.stack = msg.err.stack;
                    }
                    reply.resolveErr(err);
                    return;
                }
                reply.resolveOk(msg.res);
                return;
            }
            if (msg.cancel) {
                if (this._invokedHandlers[msg.cancel]) {
                    this._invokedHandlers[msg.cancel].cancel();
                }
                return;
            }
            if (msg.err) {
                console.error(msg.err);
                return;
            }
            var rpcId = msg.rpcId;
            if (!this._bigHandler) {
                throw new Error('got message before big handler attached!');
            }
            var req = msg.req;
            this._invokedHandlers[req] = this._invokeHandler(rpcId, msg.method, msg.args);
            this._invokedHandlers[req].then(function (r) {
                delete _this._invokedHandlers[req];
                _this._multiplexor.send(MessageFactory.replyOK(req, r));
            }, function (err) {
                delete _this._invokedHandlers[req];
                _this._multiplexor.send(MessageFactory.replyErr(req, err));
            });
        };
        RPCProtocol.prototype._invokeHandler = function (proxyId, methodName, args) {
            try {
                return winjs_base_1.TPromise.as(this._bigHandler.invoke(proxyId, methodName, args));
            }
            catch (err) {
                return winjs_base_1.TPromise.wrapError(err);
            }
        };
        RPCProtocol.prototype.callOnRemote = function (proxyId, methodName, args) {
            var _this = this;
            if (this._isDisposed) {
                return winjs_base_1.TPromise.wrapError(errors.canceled());
            }
            var req = String(++this._lastMessageId);
            var result = new lazyPromise_1.LazyPromise(function () {
                _this._multiplexor.send(MessageFactory.cancel(req));
            });
            this._pendingRPCReplies[req] = result;
            this._multiplexor.send(MessageFactory.request(req, proxyId, methodName, args));
            return result;
        };
        RPCProtocol.prototype.setDispatcher = function (handler) {
            this._bigHandler = handler;
        };
        return RPCProtocol;
    }());
    exports.RPCProtocol = RPCProtocol;
    /**
     * Sends/Receives multiple messages in one go:
     *  - multiple messages to be sent from one stack get sent in bulk at `process.nextTick`.
     *  - each incoming message is handled in a separate `process.nextTick`.
     */
    var RPCMultiplexer = (function () {
        function RPCMultiplexer(protocol, onMessage) {
            this._protocol = protocol;
            this._sendAccumulatedBound = this._sendAccumulated.bind(this);
            this._messagesToSend = [];
            this._protocol.onMessage(function (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    onMessage(data[i]);
                }
            });
        }
        RPCMultiplexer.prototype._sendAccumulated = function () {
            var tmp = this._messagesToSend;
            this._messagesToSend = [];
            this._protocol.send(tmp);
        };
        RPCMultiplexer.prototype.send = function (msg) {
            if (this._messagesToSend.length === 0) {
                process.nextTick(this._sendAccumulatedBound);
            }
            this._messagesToSend.push(msg);
        };
        return RPCMultiplexer;
    }());
    var MessageFactory = (function () {
        function MessageFactory() {
        }
        MessageFactory.cancel = function (req) {
            return "{\"cancel\":\"" + req + "\"}";
        };
        MessageFactory.request = function (req, rpcId, method, args) {
            return "{\"req\":\"" + req + "\",\"rpcId\":\"" + rpcId + "\",\"method\":\"" + method + "\",\"args\":" + marshalling.stringify(args) + "}";
        };
        MessageFactory.replyOK = function (req, res) {
            if (typeof res === 'undefined') {
                return "{\"seq\":\"" + req + "\"}";
            }
            return "{\"seq\":\"" + req + "\",\"res\":" + marshalling.stringify(res) + "}";
        };
        MessageFactory.replyErr = function (req, err) {
            if (typeof err === 'undefined') {
                return "{\"seq\":\"" + req + "\",\"err\":null}";
            }
            return "{\"seq\":\"" + req + "\",\"err\":" + marshalling.stringify(errors.transformErrorForSerialization(err)) + "}";
        };
        return MessageFactory;
    }());
});
//# sourceMappingURL=rpcProtocol.js.map