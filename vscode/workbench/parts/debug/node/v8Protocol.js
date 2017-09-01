/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/errors"], function (require, exports, winjs_base_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var V8Protocol = (function () {
        function V8Protocol(id) {
            this.id = id;
            this.sequence = 1;
            this.contentLength = -1;
            this.pendingRequests = new Map();
            this.rawData = new Buffer(0);
        }
        V8Protocol.prototype.getId = function () {
            return this.id;
        };
        V8Protocol.prototype.connect = function (readable, writable) {
            var _this = this;
            this.outputStream = writable;
            readable.on('data', function (data) {
                _this.rawData = Buffer.concat([_this.rawData, data]);
                _this.handleData();
            });
        };
        V8Protocol.prototype.send = function (command, args) {
            var _this = this;
            var errorCallback;
            return new winjs_base_1.TPromise(function (completeDispatch, errorDispatch) {
                errorCallback = errorDispatch;
                _this.doSend(command, args, function (result) {
                    if (result.success) {
                        completeDispatch(result);
                    }
                    else {
                        errorDispatch(result);
                    }
                });
            }, function () { return errorCallback(errors_1.canceled()); });
        };
        V8Protocol.prototype.sendResponse = function (response) {
            if (response.seq > 0) {
                console.error("attempt to send more than one response for command " + response.command);
            }
            else {
                this.sendMessage('response', response);
            }
        };
        V8Protocol.prototype.doSend = function (command, args, clb) {
            var request = {
                command: command
            };
            if (args && Object.keys(args).length > 0) {
                request.arguments = args;
            }
            this.sendMessage('request', request);
            if (clb) {
                // store callback for this request
                this.pendingRequests.set(request.seq, clb);
            }
        };
        V8Protocol.prototype.sendMessage = function (typ, message) {
            message.type = typ;
            message.seq = this.sequence++;
            var json = JSON.stringify(message);
            var length = Buffer.byteLength(json, 'utf8');
            this.outputStream.write('Content-Length: ' + length.toString() + V8Protocol.TWO_CRLF, 'utf8');
            this.outputStream.write(json, 'utf8');
        };
        V8Protocol.prototype.handleData = function () {
            while (true) {
                if (this.contentLength >= 0) {
                    if (this.rawData.length >= this.contentLength) {
                        var message = this.rawData.toString('utf8', 0, this.contentLength);
                        this.rawData = this.rawData.slice(this.contentLength);
                        this.contentLength = -1;
                        if (message.length > 0) {
                            this.dispatch(message);
                        }
                        continue; // there may be more complete messages to process
                    }
                }
                else {
                    var s = this.rawData.toString('utf8', 0, this.rawData.length);
                    var idx = s.indexOf(V8Protocol.TWO_CRLF);
                    if (idx !== -1) {
                        var match = /Content-Length: (\d+)/.exec(s);
                        if (match && match[1]) {
                            this.contentLength = Number(match[1]);
                            this.rawData = this.rawData.slice(idx + V8Protocol.TWO_CRLF.length);
                            continue; // try to handle a complete message
                        }
                    }
                }
                break;
            }
        };
        V8Protocol.prototype.dispatch = function (body) {
            try {
                var rawData = JSON.parse(body);
                switch (rawData.type) {
                    case 'event':
                        this.onEvent(rawData);
                        break;
                    case 'response':
                        var response = rawData;
                        var clb = this.pendingRequests.get(response.request_seq);
                        if (clb) {
                            this.pendingRequests.delete(response.request_seq);
                            clb(response);
                        }
                        break;
                    case 'request':
                        var request = rawData;
                        var resp = {
                            type: 'response',
                            seq: 0,
                            command: request.command,
                            request_seq: request.seq,
                            success: true
                        };
                        this.dispatchRequest(request, resp);
                        break;
                }
            }
            catch (e) {
                this.onServerError(new Error(e.message || e));
            }
        };
        V8Protocol.TWO_CRLF = '\r\n\r\n';
        return V8Protocol;
    }());
    exports.V8Protocol = V8Protocol;
});
//# sourceMappingURL=v8Protocol.js.map