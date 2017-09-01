define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Viewport = (function () {
        function Viewport(top, left, width, height) {
            this.top = top | 0;
            this.left = left | 0;
            this.width = width | 0;
            this.height = height | 0;
        }
        return Viewport;
    }());
    exports.Viewport = Viewport;
    var MinimapLinesRenderingData = (function () {
        function MinimapLinesRenderingData(tabSize, data) {
            this.tabSize = tabSize;
            this.data = data;
        }
        return MinimapLinesRenderingData;
    }());
    exports.MinimapLinesRenderingData = MinimapLinesRenderingData;
    var ViewLineData = (function () {
        function ViewLineData(content, minColumn, maxColumn, tokens) {
            this.content = content;
            this.minColumn = minColumn;
            this.maxColumn = maxColumn;
            this.tokens = tokens;
        }
        return ViewLineData;
    }());
    exports.ViewLineData = ViewLineData;
    var ViewLineRenderingData = (function () {
        function ViewLineRenderingData(minColumn, maxColumn, content, mightContainRTL, mightContainNonBasicASCII, tokens, inlineDecorations, tabSize) {
            this.minColumn = minColumn;
            this.maxColumn = maxColumn;
            this.content = content;
            this.mightContainRTL = mightContainRTL;
            this.mightContainNonBasicASCII = mightContainNonBasicASCII;
            this.tokens = tokens;
            this.inlineDecorations = inlineDecorations;
            this.tabSize = tabSize;
        }
        return ViewLineRenderingData;
    }());
    exports.ViewLineRenderingData = ViewLineRenderingData;
    var InlineDecoration = (function () {
        function InlineDecoration(range, inlineClassName, insertsBeforeOrAfter) {
            this.range = range;
            this.inlineClassName = inlineClassName;
            this.insertsBeforeOrAfter = insertsBeforeOrAfter;
        }
        return InlineDecoration;
    }());
    exports.InlineDecoration = InlineDecoration;
    var ViewModelDecoration = (function () {
        function ViewModelDecoration(source) {
            this.range = null;
            this.source = source;
        }
        return ViewModelDecoration;
    }());
    exports.ViewModelDecoration = ViewModelDecoration;
    var ViewEventsCollector = (function () {
        function ViewEventsCollector() {
            this._eventsLen = 0;
            this._events = [];
            this._eventsLen = 0;
        }
        ViewEventsCollector.prototype.emit = function (event) {
            this._events[this._eventsLen++] = event;
        };
        ViewEventsCollector.prototype.finalize = function () {
            var result = this._events;
            this._events = null;
            return result;
        };
        return ViewEventsCollector;
    }());
    exports.ViewEventsCollector = ViewEventsCollector;
});
//# sourceMappingURL=viewModel.js.map