define(["require", "exports", "vs/base/common/strings", "vs/base/browser/dom", "vs/base/common/objects", "vs/base/browser/ui/octiconLabel/octiconLabel"], function (require, exports, strings_1, dom, objects, octiconLabel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var HighlightedLabel = (function () {
        function HighlightedLabel(container) {
            this.domNode = document.createElement('span');
            this.domNode.className = 'monaco-highlighted-label';
            this.didEverRender = false;
            container.appendChild(this.domNode);
        }
        Object.defineProperty(HighlightedLabel.prototype, "element", {
            get: function () {
                return this.domNode;
            },
            enumerable: true,
            configurable: true
        });
        HighlightedLabel.prototype.set = function (text, highlights) {
            if (highlights === void 0) { highlights = []; }
            if (!text) {
                text = '';
            }
            if (this.didEverRender && this.text === text && objects.equals(this.highlights, highlights)) {
                return;
            }
            if (!Array.isArray(highlights)) {
                highlights = [];
            }
            this.text = text;
            this.highlights = highlights;
            this.render();
        };
        HighlightedLabel.prototype.render = function () {
            dom.clearNode(this.domNode);
            var htmlContent = [], highlight, pos = 0;
            for (var i = 0; i < this.highlights.length; i++) {
                highlight = this.highlights[i];
                if (highlight.end === highlight.start) {
                    continue;
                }
                if (pos < highlight.start) {
                    htmlContent.push('<span>');
                    htmlContent.push(octiconLabel_1.expand(strings_1.escape(this.text.substring(pos, highlight.start))));
                    htmlContent.push('</span>');
                    pos = highlight.end;
                }
                htmlContent.push('<span class="highlight">');
                htmlContent.push(octiconLabel_1.expand(strings_1.escape(this.text.substring(highlight.start, highlight.end))));
                htmlContent.push('</span>');
                pos = highlight.end;
            }
            if (pos < this.text.length) {
                htmlContent.push('<span>');
                htmlContent.push(octiconLabel_1.expand(strings_1.escape(this.text.substring(pos))));
                htmlContent.push('</span>');
            }
            this.domNode.innerHTML = htmlContent.join('');
            this.didEverRender = true;
        };
        HighlightedLabel.prototype.dispose = function () {
            this.text = null;
            this.highlights = null;
        };
        return HighlightedLabel;
    }());
    exports.HighlightedLabel = HighlightedLabel;
});
//# sourceMappingURL=highlightedLabel.js.map