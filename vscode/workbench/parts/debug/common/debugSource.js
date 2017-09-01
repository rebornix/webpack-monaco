/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/uri", "vs/workbench/parts/debug/common/debug"], function (require, exports, nls, uri_1, debug_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UNKNOWN_SOURCE_LABEL = nls.localize('unknownSource', "Unknown Source");
    var Source = (function () {
        function Source(raw) {
            this.raw = raw;
            if (!raw) {
                this.raw = { name: UNKNOWN_SOURCE_LABEL };
            }
            var path = this.raw.path || this.raw.name;
            this.available = this.raw.name !== UNKNOWN_SOURCE_LABEL;
            this.uri = this.raw.sourceReference > 0 ? uri_1.default.parse(debug_1.DEBUG_SCHEME + ":" + path) : uri_1.default.file(path);
        }
        Object.defineProperty(Source.prototype, "name", {
            get: function () {
                return this.raw.name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Source.prototype, "origin", {
            get: function () {
                return this.raw.origin;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Source.prototype, "presentationHint", {
            get: function () {
                return this.raw.presentationHint;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Source.prototype, "reference", {
            get: function () {
                return this.raw.sourceReference;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Source.prototype, "inMemory", {
            get: function () {
                return this.uri.toString().indexOf(debug_1.DEBUG_SCHEME + ":") === 0;
            },
            enumerable: true,
            configurable: true
        });
        return Source;
    }());
    exports.Source = Source;
});
//# sourceMappingURL=debugSource.js.map