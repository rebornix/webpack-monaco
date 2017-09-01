define(["require", "exports", "vs/base/common/errors", "vs/editor/common/editorCommon", "vs/workbench/api/node/extHostTypes", "vs/base/common/winjs.base", "vs/base/common/async", "vs/editor/common/model/textSource", "./extHost.protocol"], function (require, exports, errors_1, editorCommon, extHostTypes_1, winjs_base_1, async_1, textSource_1, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostDocumentContentProvider = (function () {
        function ExtHostDocumentContentProvider(mainContext, documentsAndEditors) {
            this._documentContentProviders = new Map();
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadDocumentContentProviders);
            this._documentsAndEditors = documentsAndEditors;
        }
        ExtHostDocumentContentProvider.prototype.dispose = function () {
            // todo@joh
        };
        ExtHostDocumentContentProvider.prototype.registerTextDocumentContentProvider = function (scheme, provider) {
            var _this = this;
            if (scheme === 'file' || scheme === 'untitled') {
                throw new Error("scheme '" + scheme + "' already registered");
            }
            var handle = ExtHostDocumentContentProvider._handlePool++;
            this._documentContentProviders.set(handle, provider);
            this._proxy.$registerTextContentProvider(handle, scheme);
            var subscription;
            if (typeof provider.onDidChange === 'function') {
                subscription = provider.onDidChange(function (uri) {
                    if (_this._documentsAndEditors.getDocument(uri.toString())) {
                        _this.$provideTextDocumentContent(handle, uri).then(function (value) {
                            var document = _this._documentsAndEditors.getDocument(uri.toString());
                            if (!document) {
                                // disposed in the meantime
                                return;
                            }
                            // create lines and compare
                            var textSource = textSource_1.TextSource.fromString(value, editorCommon.DefaultEndOfLine.CRLF);
                            // broadcast event when content changed
                            if (!document.equalLines(textSource)) {
                                return _this._proxy.$onVirtualDocumentChange(uri, textSource);
                            }
                        }, errors_1.onUnexpectedError);
                    }
                });
            }
            return new extHostTypes_1.Disposable(function () {
                if (_this._documentContentProviders.delete(handle)) {
                    _this._proxy.$unregisterTextContentProvider(handle);
                }
                if (subscription) {
                    subscription.dispose();
                    subscription = undefined;
                }
            });
        };
        ExtHostDocumentContentProvider.prototype.$provideTextDocumentContent = function (handle, uri) {
            var provider = this._documentContentProviders.get(handle);
            if (!provider) {
                return winjs_base_1.TPromise.wrapError(new Error("unsupported uri-scheme: " + uri.scheme));
            }
            return async_1.asWinJsPromise(function (token) { return provider.provideTextDocumentContent(uri, token); });
        };
        ExtHostDocumentContentProvider._handlePool = 0;
        return ExtHostDocumentContentProvider;
    }());
    exports.ExtHostDocumentContentProvider = ExtHostDocumentContentProvider;
});
//# sourceMappingURL=extHostDocumentContentProviders.js.map