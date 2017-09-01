/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/browser/builder", "vs/base/common/uri"], function (require, exports, builder_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A helper that will execute a provided function when the provided HTMLElement receives
     *  dragover event for 800ms. If the drag is aborted before, the callback will not be triggered.
     */
    var DelayedDragHandler = (function () {
        function DelayedDragHandler(container, callback) {
            var _this = this;
            builder_1.$(container).on('dragover', function () {
                if (!_this.timeout) {
                    _this.timeout = setTimeout(function () {
                        callback();
                        _this.timeout = null;
                    }, 800);
                }
            });
            builder_1.$(container).on(['dragleave', 'drop', 'dragend'], function () { return _this.clearDragTimeout(); });
        }
        DelayedDragHandler.prototype.clearDragTimeout = function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        };
        DelayedDragHandler.prototype.dispose = function () {
            this.clearDragTimeout();
        };
        return DelayedDragHandler;
    }());
    exports.DelayedDragHandler = DelayedDragHandler;
    function extractResources(e, externalOnly) {
        var resources = [];
        if (e.dataTransfer.types.length > 0) {
            // Check for in-app DND
            if (!externalOnly) {
                var rawData = e.dataTransfer.getData('URL');
                if (rawData) {
                    try {
                        resources.push({ resource: uri_1.default.parse(rawData), isExternal: false });
                    }
                    catch (error) {
                        // Invalid URI
                    }
                }
            }
            // Check for native file transfer
            if (e.dataTransfer && e.dataTransfer.files) {
                for (var i = 0; i < e.dataTransfer.files.length; i++) {
                    if (e.dataTransfer.files[i] && e.dataTransfer.files[i].path) {
                        try {
                            resources.push({ resource: uri_1.default.file(e.dataTransfer.files[i].path), isExternal: true });
                        }
                        catch (error) {
                            // Invalid URI
                        }
                    }
                }
            }
        }
        return resources;
    }
    exports.extractResources = extractResources;
});
//# sourceMappingURL=dnd.js.map