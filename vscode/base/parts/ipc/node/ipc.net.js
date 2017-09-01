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
define(["require", "exports", "net", "vs/base/common/winjs.base", "vs/base/common/event", "vs/base/node/event", "vs/base/parts/ipc/common/ipc", "path", "os", "vs/base/common/uuid"], function (require, exports, net_1, winjs_base_1, event_1, event_2, ipc_1, path_1, os_1, uuid_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function generateRandomPipeName() {
        var randomSuffix = uuid_1.generateUuid();
        if (process.platform === 'win32') {
            return "\\\\.\\pipe\\vscode-" + randomSuffix + "-sock";
        }
        else {
            // Mac/Unix: use socket file
            return path_1.join(os_1.tmpdir(), "vscode-" + randomSuffix + ".sock");
        }
    }
    exports.generateRandomPipeName = generateRandomPipeName;
    var Protocol = (function () {
        function Protocol(_socket) {
            var _this = this;
            this._socket = _socket;
            this._onMessage = new event_1.Emitter();
            this.onMessage = this._onMessage.event;
            this._writeBuffer = new (function () {
                function class_1() {
                    this._data = [];
                    this._totalLength = 0;
                }
                class_1.prototype.add = function (head, body) {
                    var wasEmpty = this._totalLength === 0;
                    this._data.push(head, body);
                    this._totalLength += head.length + body.length;
                    return wasEmpty;
                };
                class_1.prototype.take = function () {
                    var ret = Buffer.concat(this._data, this._totalLength);
                    this._data.length = 0;
                    this._totalLength = 0;
                    return ret;
                };
                return class_1;
            }());
            var chunks = [];
            var totalLength = 0;
            var state = {
                readHead: true,
                bodyIsJson: false,
                bodyLen: -1,
            };
            _socket.on('data', function (data) {
                chunks.push(data);
                totalLength += data.length;
                while (totalLength > 0) {
                    if (state.readHead) {
                        // expecting header -> read 17bytes for header
                        // information: `bodyIsJson` and `bodyLen`
                        if (totalLength >= Protocol._headerLen) {
                            var all = Buffer.concat(chunks);
                            state.bodyIsJson = all.readInt8(0) === 1;
                            state.bodyLen = all.readInt32BE(1);
                            state.readHead = false;
                            var rest = all.slice(Protocol._headerLen);
                            totalLength = rest.length;
                            chunks = [rest];
                        }
                        else {
                            break;
                        }
                    }
                    if (!state.readHead) {
                        // expecting body -> read bodyLen-bytes for
                        // the actual message or wait for more data
                        if (totalLength >= state.bodyLen) {
                            var all = Buffer.concat(chunks);
                            var message = all.toString('utf8', 0, state.bodyLen);
                            if (state.bodyIsJson) {
                                message = JSON.parse(message);
                            }
                            _this._onMessage.fire(message);
                            var rest = all.slice(state.bodyLen);
                            totalLength = rest.length;
                            chunks = [rest];
                            state.bodyIsJson = false;
                            state.bodyLen = -1;
                            state.readHead = true;
                        }
                        else {
                            break;
                        }
                    }
                }
            });
        }
        Protocol.prototype.send = function (message) {
            // [bodyIsJson|bodyLen|message]
            // |^header^^^^^^^^^^^|^data^^]
            var header = Buffer.alloc(Protocol._headerLen);
            // ensure string
            if (typeof message !== 'string') {
                message = JSON.stringify(message);
                header.writeInt8(1, 0);
            }
            var data = Buffer.from(message);
            header.writeInt32BE(data.length, 1);
            this._writeSoon(header, data);
        };
        Protocol.prototype._writeSoon = function (header, data) {
            var _this = this;
            if (this._writeBuffer.add(header, data)) {
                setImmediate(function () {
                    // return early if socket has been destroyed in the meantime
                    if (_this._socket.destroyed) {
                        return;
                    }
                    // we ignore the returned value from `write` because we would have to cached the data
                    // anyways and nodejs is already doing that for us:
                    // > https://nodejs.org/api/stream.html#stream_writable_write_chunk_encoding_callback
                    // > However, the false return value is only advisory and the writable stream will unconditionally
                    // > accept and buffer chunk even if it has not not been allowed to drain.
                    _this._socket.write(_this._writeBuffer.take());
                });
            }
        };
        Protocol._headerLen = 17;
        return Protocol;
    }());
    exports.Protocol = Protocol;
    var Server = (function (_super) {
        __extends(Server, _super);
        function Server(server) {
            var _this = _super.call(this, Server.toClientConnectionEvent(server)) || this;
            _this.server = server;
            return _this;
        }
        Server.toClientConnectionEvent = function (server) {
            var onConnection = event_2.fromEventEmitter(server, 'connection');
            return event_1.mapEvent(onConnection, function (socket) { return ({
                protocol: new Protocol(socket),
                onDidClientDisconnect: event_1.once(event_2.fromEventEmitter(socket, 'close'))
            }); });
        };
        Server.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.server.close();
            this.server = null;
        };
        return Server;
    }(ipc_1.IPCServer));
    exports.Server = Server;
    var Client = (function (_super) {
        __extends(Client, _super);
        function Client(socket, id) {
            var _this = _super.call(this, new Protocol(socket), id) || this;
            _this.socket = socket;
            _this._onClose = new event_1.Emitter();
            socket.once('close', function () { return _this._onClose.fire(); });
            return _this;
        }
        Object.defineProperty(Client.prototype, "onClose", {
            get: function () { return this._onClose.event; },
            enumerable: true,
            configurable: true
        });
        Client.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.socket.end();
            this.socket = null;
        };
        return Client;
    }(ipc_1.IPCClient));
    exports.Client = Client;
    function serve(hook) {
        return new winjs_base_1.TPromise(function (c, e) {
            var server = net_1.createServer();
            server.on('error', e);
            server.listen(hook, function () {
                server.removeListener('error', e);
                c(new Server(server));
            });
        });
    }
    exports.serve = serve;
    function connect(hook, clientId) {
        return new winjs_base_1.TPromise(function (c, e) {
            var socket = net_1.createConnection(hook, function () {
                socket.removeListener('error', e);
                c(new Client(socket, clientId));
            });
            socket.once('error', e);
        });
    }
    exports.connect = connect;
});
//# sourceMappingURL=ipc.net.js.map