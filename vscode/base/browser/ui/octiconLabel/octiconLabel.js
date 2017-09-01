define(["require", "exports", "vs/base/common/strings", "vs/css!./octicons/octicons", "vs/css!./octicons/octicons-animations"], function (require, exports, strings_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function expand(text) {
        return text.replace(/\$\(((.+?)(~(.*?))?)\)/g, function (match, g1, name, g3, animation) {
            return "<span class=\"octicon octicon-" + name + " " + (animation ? "octicon-animation-" + animation : '') + "\"></span>";
        });
    }
    exports.expand = expand;
    var OcticonLabel = (function () {
        function OcticonLabel(container) {
            this._container = container;
        }
        Object.defineProperty(OcticonLabel.prototype, "text", {
            set: function (text) {
                var innerHTML = text || '';
                innerHTML = strings_1.escape(innerHTML);
                innerHTML = expand(innerHTML);
                this._container.innerHTML = innerHTML;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OcticonLabel.prototype, "title", {
            set: function (title) {
                this._container.title = title;
            },
            enumerable: true,
            configurable: true
        });
        return OcticonLabel;
    }());
    exports.OcticonLabel = OcticonLabel;
});
//# sourceMappingURL=octiconLabel.js.map