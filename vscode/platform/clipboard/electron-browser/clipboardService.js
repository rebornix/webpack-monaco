/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "electron"], function (require, exports, electron_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClipboardService = (function () {
        function ClipboardService() {
        }
        ClipboardService.prototype.writeText = function (text) {
            electron_1.clipboard.writeText(text);
        };
        return ClipboardService;
    }());
    exports.ClipboardService = ClipboardService;
});
//# sourceMappingURL=clipboardService.js.map