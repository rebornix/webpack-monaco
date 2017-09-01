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
define(["require", "exports", "vs/base/browser/dom", "vs/base/browser/ui/highlightedlabel/highlightedLabel", "vs/base/common/paths", "vs/base/common/labels", "vs/css!./iconlabel"], function (require, exports, dom, highlightedLabel_1, paths, labels_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IconLabel = (function () {
        function IconLabel(container, options) {
            this.domNode = dom.append(container, dom.$('.monaco-icon-label'));
            if (options && options.supportHighlights) {
                this.labelNode = new highlightedLabel_1.HighlightedLabel(dom.append(this.domNode, dom.$('a.label-name')));
            }
            else {
                this.labelNode = dom.append(this.domNode, dom.$('a.label-name'));
            }
            this.descriptionNode = dom.append(this.domNode, dom.$('span.label-description'));
        }
        Object.defineProperty(IconLabel.prototype, "element", {
            get: function () {
                return this.domNode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IconLabel.prototype, "labelElement", {
            get: function () {
                var labelNode = this.labelNode;
                if (labelNode instanceof highlightedLabel_1.HighlightedLabel) {
                    return labelNode.element;
                }
                else {
                    return labelNode;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IconLabel.prototype, "descriptionElement", {
            get: function () {
                return this.descriptionNode;
            },
            enumerable: true,
            configurable: true
        });
        IconLabel.prototype.setValue = function (label, description, options) {
            var labelNode = this.labelNode;
            if (labelNode instanceof highlightedLabel_1.HighlightedLabel) {
                labelNode.set(label || '', options ? options.matches : void 0);
            }
            else {
                labelNode.textContent = label || '';
            }
            this.descriptionNode.textContent = description || '';
            if (!description) {
                dom.addClass(this.descriptionNode, 'empty');
            }
            else {
                dom.removeClass(this.descriptionNode, 'empty');
            }
            this.domNode.title = options && options.title ? options.title : '';
            var classes = ['monaco-icon-label'];
            if (options) {
                if (options.extraClasses) {
                    classes.push.apply(classes, options.extraClasses);
                }
                if (options.italic) {
                    classes.push('italic');
                }
            }
            this.domNode.className = classes.join(' ');
        };
        IconLabel.prototype.dispose = function () {
            var labelNode = this.labelNode;
            if (labelNode instanceof highlightedLabel_1.HighlightedLabel) {
                labelNode.dispose();
            }
        };
        return IconLabel;
    }());
    exports.IconLabel = IconLabel;
    var FileLabel = (function (_super) {
        __extends(FileLabel, _super);
        function FileLabel(container, file, provider, userHome) {
            var _this = _super.call(this, container) || this;
            _this.setFile(file, provider, userHome);
            return _this;
        }
        FileLabel.prototype.setFile = function (file, provider, userHome) {
            var parent = paths.dirname(file.fsPath);
            this.setValue(paths.basename(file.fsPath), parent && parent !== '.' ? labels_1.getPathLabel(parent, provider, userHome) : '', { title: file.fsPath });
        };
        return FileLabel;
    }(IconLabel));
    exports.FileLabel = FileLabel;
});
//# sourceMappingURL=iconLabel.js.map