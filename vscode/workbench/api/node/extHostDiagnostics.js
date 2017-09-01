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
define(["require", "exports", "vs/nls", "vs/base/common/uri", "vs/base/common/severity", "./extHost.protocol", "./extHostTypes", "vs/base/common/arrays"], function (require, exports, nls_1, uri_1, severity_1, extHost_protocol_1, extHostTypes_1, arrays_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DiagnosticCollection = (function () {
        function DiagnosticCollection(name, proxy) {
            this._isDisposed = false;
            this._data = new Map();
            this._name = name;
            this._proxy = proxy;
        }
        DiagnosticCollection.prototype.dispose = function () {
            if (!this._isDisposed) {
                this._proxy.$clear(this.name);
                this._proxy = undefined;
                this._data = undefined;
                this._isDisposed = true;
            }
        };
        Object.defineProperty(DiagnosticCollection.prototype, "name", {
            get: function () {
                this._checkDisposed();
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        DiagnosticCollection.prototype.set = function (first, diagnostics) {
            if (!first) {
                // this set-call is a clear-call
                this.clear();
                return;
            }
            // the actual implementation for #set
            this._checkDisposed();
            var toSync;
            if (first instanceof uri_1.default) {
                if (!diagnostics) {
                    // remove this entry
                    this.delete(first);
                    return;
                }
                // update single row
                this._data.set(first.toString(), diagnostics);
                toSync = [first];
            }
            else if (Array.isArray(first)) {
                // update many rows
                toSync = [];
                var lastUri = void 0;
                // ensure stable-sort
                arrays_1.mergeSort(first, DiagnosticCollection._compareIndexedTuplesByUri);
                for (var _i = 0, first_1 = first; _i < first_1.length; _i++) {
                    var tuple = first_1[_i];
                    var uri = tuple[0], diagnostics_1 = tuple[1];
                    if (!lastUri || uri.toString() !== lastUri.toString()) {
                        if (lastUri && this._data.get(lastUri.toString()).length === 0) {
                            this._data.delete(lastUri.toString());
                        }
                        lastUri = uri;
                        toSync.push(uri);
                        this._data.set(uri.toString(), []);
                    }
                    if (!diagnostics_1) {
                        // [Uri, undefined] means clear this
                        this._data.get(uri.toString()).length = 0;
                    }
                    else {
                        (_a = this._data.get(uri.toString())).push.apply(_a, diagnostics_1);
                    }
                }
            }
            // compute change and send to main side
            var entries = [];
            for (var _b = 0, toSync_1 = toSync; _b < toSync_1.length; _b++) {
                var uri = toSync_1[_b];
                var marker = void 0;
                var diagnostics_2 = this._data.get(uri.toString());
                if (diagnostics_2) {
                    // no more than 250 diagnostics per file
                    if (diagnostics_2.length > DiagnosticCollection._maxDiagnosticsPerFile) {
                        marker = [];
                        var order = [extHostTypes_1.DiagnosticSeverity.Error, extHostTypes_1.DiagnosticSeverity.Warning, extHostTypes_1.DiagnosticSeverity.Information, extHostTypes_1.DiagnosticSeverity.Hint];
                        orderLoop: for (var i = 0; i < 4; i++) {
                            for (var _c = 0, diagnostics_3 = diagnostics_2; _c < diagnostics_3.length; _c++) {
                                var diagnostic = diagnostics_3[_c];
                                if (diagnostic.severity === order[i]) {
                                    var len = marker.push(DiagnosticCollection._toMarkerData(diagnostic));
                                    if (len === DiagnosticCollection._maxDiagnosticsPerFile) {
                                        break orderLoop;
                                    }
                                }
                            }
                        }
                        // add 'signal' marker for showing omitted errors/warnings
                        marker.push({
                            severity: severity_1.default.Error,
                            message: nls_1.localize({ key: 'limitHit', comment: ['amount of errors/warning skipped due to limits'] }, "Not showing {0} further errors and warnings.", diagnostics_2.length - DiagnosticCollection._maxDiagnosticsPerFile),
                            startLineNumber: marker[marker.length - 1].startLineNumber,
                            startColumn: marker[marker.length - 1].startColumn,
                            endLineNumber: marker[marker.length - 1].endLineNumber,
                            endColumn: marker[marker.length - 1].endColumn
                        });
                    }
                    else {
                        marker = diagnostics_2.map(DiagnosticCollection._toMarkerData);
                    }
                }
                entries.push([uri, marker]);
            }
            this._proxy.$changeMany(this.name, entries);
            var _a;
        };
        DiagnosticCollection.prototype.delete = function (uri) {
            this._checkDisposed();
            this._data.delete(uri.toString());
            this._proxy.$changeMany(this.name, [[uri, undefined]]);
        };
        DiagnosticCollection.prototype.clear = function () {
            this._checkDisposed();
            this._data.clear();
            this._proxy.$clear(this.name);
        };
        DiagnosticCollection.prototype.forEach = function (callback, thisArg) {
            var _this = this;
            this._checkDisposed();
            this._data.forEach(function (value, key) {
                var uri = uri_1.default.parse(key);
                callback.apply(thisArg, [uri, _this.get(uri), _this]);
            });
        };
        DiagnosticCollection.prototype.get = function (uri) {
            this._checkDisposed();
            var result = this._data.get(uri.toString());
            if (Array.isArray(result)) {
                return Object.freeze(result.slice(0));
            }
            return undefined;
        };
        DiagnosticCollection.prototype.has = function (uri) {
            this._checkDisposed();
            return Array.isArray(this._data.get(uri.toString()));
        };
        DiagnosticCollection.prototype._checkDisposed = function () {
            if (this._isDisposed) {
                throw new Error('illegal state - object is disposed');
            }
        };
        DiagnosticCollection._toMarkerData = function (diagnostic) {
            var range = diagnostic.range;
            return {
                startLineNumber: range.start.line + 1,
                startColumn: range.start.character + 1,
                endLineNumber: range.end.line + 1,
                endColumn: range.end.character + 1,
                message: diagnostic.message,
                source: diagnostic.source,
                severity: DiagnosticCollection._convertDiagnosticsSeverity(diagnostic.severity),
                code: String(diagnostic.code)
            };
        };
        DiagnosticCollection._convertDiagnosticsSeverity = function (severity) {
            switch (severity) {
                case 0: return severity_1.default.Error;
                case 1: return severity_1.default.Warning;
                case 2: return severity_1.default.Info;
                case 3: return severity_1.default.Ignore;
                default: return severity_1.default.Error;
            }
        };
        DiagnosticCollection._compareIndexedTuplesByUri = function (a, b) {
            if (a[0].toString() < b[0].toString()) {
                return -1;
            }
            else if (a[0].toString() > b[0].toString()) {
                return 1;
            }
            else {
                return 0;
            }
        };
        DiagnosticCollection._maxDiagnosticsPerFile = 250;
        return DiagnosticCollection;
    }());
    exports.DiagnosticCollection = DiagnosticCollection;
    var ExtHostDiagnostics = (function () {
        function ExtHostDiagnostics(mainContext) {
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadDiagnostics);
            this._collections = [];
        }
        ExtHostDiagnostics.prototype.createDiagnosticCollection = function (name) {
            if (!name) {
                name = '_generated_diagnostic_collection_name_#' + ExtHostDiagnostics._idPool++;
            }
            var _a = this, _collections = _a._collections, _proxy = _a._proxy;
            var result = new (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    var _this = _super.call(this, name, _proxy) || this;
                    _collections.push(_this);
                    return _this;
                }
                class_1.prototype.dispose = function () {
                    _super.prototype.dispose.call(this);
                    var idx = _collections.indexOf(this);
                    if (idx !== -1) {
                        _collections.splice(idx, 1);
                    }
                };
                return class_1;
            }(DiagnosticCollection));
            return result;
        };
        ExtHostDiagnostics.prototype.forEach = function (callback) {
            this._collections.forEach(callback);
        };
        ExtHostDiagnostics._idPool = 0;
        return ExtHostDiagnostics;
    }());
    exports.ExtHostDiagnostics = ExtHostDiagnostics;
});
//# sourceMappingURL=extHostDiagnostics.js.map