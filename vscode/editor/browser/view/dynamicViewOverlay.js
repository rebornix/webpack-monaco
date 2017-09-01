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
define(["require", "exports", "vs/editor/common/viewModel/viewEventHandler"], function (require, exports, viewEventHandler_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DynamicViewOverlay = (function (_super) {
        __extends(DynamicViewOverlay, _super);
        function DynamicViewOverlay() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return DynamicViewOverlay;
    }(viewEventHandler_1.ViewEventHandler));
    exports.DynamicViewOverlay = DynamicViewOverlay;
});
//# sourceMappingURL=dynamicViewOverlay.js.map