define(["require", "exports", "vs/base/common/callbackList", "vs/base/common/async", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/workbench/api/node/extHostTypes", "vs/workbench/api/node/extHostTypeConverters"], function (require, exports, callbackList_1, async_1, errors_1, winjs_base_1, extHostTypes_1, extHostTypeConverters_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostDocumentSaveParticipant = (function () {
        function ExtHostDocumentSaveParticipant(documents, workspace, thresholds) {
            if (thresholds === void 0) { thresholds = { timeout: 1500, errors: 3 }; }
            this._callbacks = new callbackList_1.default();
            this._badListeners = new WeakMap();
            this._documents = documents;
            this._workspace = workspace;
            this._thresholds = thresholds;
        }
        ExtHostDocumentSaveParticipant.prototype.dispose = function () {
            this._callbacks.dispose();
        };
        Object.defineProperty(ExtHostDocumentSaveParticipant.prototype, "onWillSaveTextDocumentEvent", {
            get: function () {
                var _this = this;
                return function (listener, thisArg, disposables) {
                    _this._callbacks.add(listener, thisArg);
                    var result = {
                        dispose: function () {
                            _this._callbacks.remove(listener, thisArg);
                        }
                    };
                    if (Array.isArray(disposables)) {
                        disposables.push(result);
                    }
                    return result;
                };
            },
            enumerable: true,
            configurable: true
        });
        ExtHostDocumentSaveParticipant.prototype.$participateInSave = function (resource, reason) {
            var _this = this;
            var entries = this._callbacks.entries();
            var didTimeout = false;
            var didTimeoutHandle = setTimeout(function () { return didTimeout = true; }, this._thresholds.timeout);
            var promise = async_1.sequence(entries.map(function (_a) {
                var fn = _a[0], thisArg = _a[1];
                return function () {
                    if (didTimeout) {
                        // timeout - no more listeners
                        return undefined;
                    }
                    var document = _this._documents.getDocumentData(resource).document;
                    return _this._deliverEventAsyncAndBlameBadListeners(fn, thisArg, { document: document, reason: extHostTypeConverters_1.TextDocumentSaveReason.to(reason) });
                };
            }));
            return async_1.always(promise, function () { return clearTimeout(didTimeoutHandle); });
        };
        ExtHostDocumentSaveParticipant.prototype._deliverEventAsyncAndBlameBadListeners = function (listener, thisArg, stubEvent) {
            var _this = this;
            var errors = this._badListeners.get(listener);
            if (errors > this._thresholds.errors) {
                // bad listener - ignore
                return winjs_base_1.TPromise.wrap(false);
            }
            return this._deliverEventAsync(listener, thisArg, stubEvent).then(function () {
                // don't send result across the wire
                return true;
            }, function (err) {
                if (!(err instanceof Error) || err.message !== 'concurrent_edits') {
                    var errors_2 = _this._badListeners.get(listener);
                    _this._badListeners.set(listener, !errors_2 ? 1 : errors_2 + 1);
                    // todo@joh signal to the listener?
                    // if (errors === this._thresholds.errors) {
                    // 	console.warn('BAD onWillSaveTextDocumentEvent-listener is from now on being ignored');
                    // }
                }
                return false;
            });
        };
        ExtHostDocumentSaveParticipant.prototype._deliverEventAsync = function (listener, thisArg, stubEvent) {
            var _this = this;
            var promises = [];
            var document = stubEvent.document, reason = stubEvent.reason;
            var version = document.version;
            var event = Object.freeze({
                document: document,
                reason: reason,
                waitUntil: function (p) {
                    if (Object.isFrozen(promises)) {
                        throw errors_1.illegalState('waitUntil can not be called async');
                    }
                    promises.push(winjs_base_1.TPromise.wrap(p));
                }
            });
            try {
                // fire event
                listener.apply(thisArg, [event]);
            }
            catch (err) {
                return winjs_base_1.TPromise.wrapError(err);
            }
            // freeze promises after event call
            Object.freeze(promises);
            return new winjs_base_1.TPromise(function (resolve, reject) {
                // join on all listener promises, reject after timeout
                var handle = setTimeout(function () { return reject(new Error('timeout')); }, _this._thresholds.timeout);
                return async_1.always(winjs_base_1.TPromise.join(promises), function () { return clearTimeout(handle); }).then(resolve, reject);
            }).then(function (values) {
                var edits = [];
                for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                    var value = values_1[_i];
                    if (Array.isArray(value) && value.every(function (e) { return e instanceof extHostTypes_1.TextEdit; })) {
                        for (var _a = 0, value_1 = value; _a < value_1.length; _a++) {
                            var _b = value_1[_a], newText = _b.newText, newEol = _b.newEol, range = _b.range;
                            edits.push({
                                resource: document.uri,
                                range: range && extHostTypeConverters_1.fromRange(range),
                                newText: newText,
                                newEol: extHostTypeConverters_1.EndOfLine.from(newEol)
                            });
                        }
                    }
                }
                // apply edits if any and if document
                // didn't change somehow in the meantime
                if (edits.length === 0) {
                    return undefined;
                }
                if (version === document.version) {
                    return _this._workspace.$applyWorkspaceEdit(edits);
                }
                // TODO@joh bubble this to listener?
                return winjs_base_1.TPromise.wrapError(new Error('concurrent_edits'));
            });
        };
        return ExtHostDocumentSaveParticipant;
    }());
    exports.ExtHostDocumentSaveParticipant = ExtHostDocumentSaveParticipant;
});
//# sourceMappingURL=extHostDocumentSaveParticipant.js.map