/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/arrays", "vs/base/common/platform", "vs/base/common/lifecycle", "vs/base/common/errors", "vs/base/common/objects"], function (require, exports, arrays_1, platform_1, lifecycle_1, Errors, objects_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ErrorEvent;
    (function (ErrorEvent) {
        function compare(a, b) {
            if (a.stack < b.stack) {
                return -1;
            }
            else if (a.stack > b.stack) {
                return 1;
            }
            return 0;
        }
        ErrorEvent.compare = compare;
    })(ErrorEvent || (ErrorEvent = {}));
    var ErrorTelemetry = (function () {
        function ErrorTelemetry(telemetryService, flushDelay) {
            if (flushDelay === void 0) { flushDelay = ErrorTelemetry.ERROR_FLUSH_TIMEOUT; }
            var _this = this;
            this._flushHandle = -1;
            this._buffer = [];
            this._disposables = [];
            this._telemetryService = telemetryService;
            this._flushDelay = flushDelay;
            // (1) check for unexpected but handled errors
            var unbind = Errors.errorHandler.addListener(function (err) { return _this._onErrorEvent(err); });
            this._disposables.push(lifecycle_1.toDisposable(unbind));
            // (2) check for uncaught global errors
            var oldOnError;
            var that = this;
            if (typeof platform_1.globals.onerror === 'function') {
                oldOnError = platform_1.globals.onerror;
            }
            platform_1.globals.onerror = function (message, filename, line, column, e) {
                that._onUncaughtError(message, filename, line, column, e);
                if (oldOnError) {
                    oldOnError.apply(this, arguments);
                }
            };
            this._disposables.push(lifecycle_1.toDisposable(function () {
                if (oldOnError) {
                    platform_1.globals.onerror = oldOnError;
                }
            }));
        }
        ErrorTelemetry.prototype.dispose = function () {
            clearTimeout(this._flushHandle);
            this._flushBuffer();
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        ErrorTelemetry.prototype._onErrorEvent = function (err) {
            if (!err) {
                return;
            }
            // unwrap nested errors from loader
            if (err.detail && err.detail.stack) {
                err = err.detail;
            }
            // work around behavior in workerServer.ts that breaks up Error.stack
            var stack = Array.isArray(err.stack) ? err.stack.join('\n') : err.stack;
            var message = err.message ? err.message : objects_1.safeStringify(err);
            // errors without a stack are not useful telemetry
            if (!stack) {
                return;
            }
            this._enqueue({ message: message, stack: stack });
        };
        ErrorTelemetry.prototype._onUncaughtError = function (message, filename, line, column, err) {
            var data = {
                stack: message,
                message: message,
                filename: filename,
                line: line,
                column: column
            };
            if (err) {
                var name_1 = err.name, message_1 = err.message, stack = err.stack;
                data.error = { name: name_1, message: message_1 };
                if (stack) {
                    data.stack = Array.isArray(err.stack)
                        ? err.stack = err.stack.join('\n')
                        : err.stack;
                }
            }
            this._enqueue(data);
        };
        ErrorTelemetry.prototype._enqueue = function (e) {
            var _this = this;
            var idx = arrays_1.binarySearch(this._buffer, e, ErrorEvent.compare);
            if (idx < 0) {
                e.count = 1;
                this._buffer.splice(~idx, 0, e);
            }
            else {
                this._buffer[idx].count += 1;
            }
            if (this._flushHandle === -1) {
                this._flushHandle = setTimeout(function () {
                    _this._flushBuffer();
                    _this._flushHandle = -1;
                }, this._flushDelay);
            }
        };
        ErrorTelemetry.prototype._flushBuffer = function () {
            for (var _i = 0, _a = this._buffer; _i < _a.length; _i++) {
                var error = _a[_i];
                this._telemetryService.publicLog('UnhandledError', error);
            }
            this._buffer.length = 0;
        };
        ErrorTelemetry.ERROR_FLUSH_TIMEOUT = 5 * 1000;
        return ErrorTelemetry;
    }());
    exports.default = ErrorTelemetry;
});
//# sourceMappingURL=errorTelemetry.js.map