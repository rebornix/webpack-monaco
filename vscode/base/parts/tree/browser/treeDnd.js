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
define(["require", "exports", "vs/base/parts/tree/browser/treeDefaults", "vs/base/common/paths", "vs/base/common/labels"], function (require, exports, treeDefaults_1, paths_1, labels_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ElementsDragAndDropData = (function () {
        function ElementsDragAndDropData(elements) {
            this.elements = elements;
        }
        ElementsDragAndDropData.prototype.update = function (event) {
            // no-op
        };
        ElementsDragAndDropData.prototype.getData = function () {
            return this.elements;
        };
        return ElementsDragAndDropData;
    }());
    exports.ElementsDragAndDropData = ElementsDragAndDropData;
    var ExternalElementsDragAndDropData = (function () {
        function ExternalElementsDragAndDropData(elements) {
            this.elements = elements;
        }
        ExternalElementsDragAndDropData.prototype.update = function (event) {
            // no-op
        };
        ExternalElementsDragAndDropData.prototype.getData = function () {
            return this.elements;
        };
        return ExternalElementsDragAndDropData;
    }());
    exports.ExternalElementsDragAndDropData = ExternalElementsDragAndDropData;
    var DesktopDragAndDropData = (function () {
        function DesktopDragAndDropData() {
            this.types = [];
            this.files = [];
        }
        DesktopDragAndDropData.prototype.update = function (event) {
            if (event.dataTransfer.types) {
                this.types = [];
                Array.prototype.push.apply(this.types, event.dataTransfer.types);
            }
            if (event.dataTransfer.files) {
                this.files = [];
                Array.prototype.push.apply(this.files, event.dataTransfer.files);
                this.files = this.files.filter(function (f) { return f.size || f.type; });
            }
        };
        DesktopDragAndDropData.prototype.getData = function () {
            return {
                types: this.types,
                files: this.files
            };
        };
        return DesktopDragAndDropData;
    }());
    exports.DesktopDragAndDropData = DesktopDragAndDropData;
    var SimpleFileResourceDragAndDrop = (function (_super) {
        __extends(SimpleFileResourceDragAndDrop, _super);
        function SimpleFileResourceDragAndDrop(toResource) {
            var _this = _super.call(this) || this;
            _this.toResource = toResource;
            return _this;
        }
        SimpleFileResourceDragAndDrop.prototype.getDragURI = function (tree, obj) {
            var resource = this.toResource(obj);
            if (resource) {
                return resource.toString();
            }
            return void 0;
        };
        SimpleFileResourceDragAndDrop.prototype.getDragLabel = function (tree, elements) {
            if (elements.length > 1) {
                return String(elements.length);
            }
            var resource = this.toResource(elements[0]);
            if (resource) {
                return paths_1.basename(resource.fsPath);
            }
            return void 0;
        };
        SimpleFileResourceDragAndDrop.prototype.onDragStart = function (tree, data, originalEvent) {
            var sources = data.getData();
            var source = null;
            if (sources.length > 0) {
                source = sources[0];
            }
            // Apply some datatransfer types to allow for dragging the element outside of the application
            var resource = this.toResource(source);
            if (resource) {
                originalEvent.dataTransfer.setData('text/plain', labels_1.getPathLabel(resource));
            }
        };
        return SimpleFileResourceDragAndDrop;
    }(treeDefaults_1.DefaultDragAndDrop));
    exports.SimpleFileResourceDragAndDrop = SimpleFileResourceDragAndDrop;
});
//# sourceMappingURL=treeDnd.js.map