define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parts;
    (function (Parts) {
        Parts[Parts["ACTIVITYBAR_PART"] = 0] = "ACTIVITYBAR_PART";
        Parts[Parts["SIDEBAR_PART"] = 1] = "SIDEBAR_PART";
        Parts[Parts["PANEL_PART"] = 2] = "PANEL_PART";
        Parts[Parts["EDITOR_PART"] = 3] = "EDITOR_PART";
        Parts[Parts["STATUSBAR_PART"] = 4] = "STATUSBAR_PART";
        Parts[Parts["TITLEBAR_PART"] = 5] = "TITLEBAR_PART";
    })(Parts = exports.Parts || (exports.Parts = {}));
    var Position;
    (function (Position) {
        Position[Position["LEFT"] = 0] = "LEFT";
        Position[Position["RIGHT"] = 1] = "RIGHT";
    })(Position = exports.Position || (exports.Position = {}));
    exports.IPartService = instantiation_1.createDecorator('partService');
});
//# sourceMappingURL=partService.js.map