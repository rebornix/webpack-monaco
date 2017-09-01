/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var State;
    (function (State) {
        State[State["Uninitialized"] = 0] = "Uninitialized";
        State[State["Idle"] = 1] = "Idle";
        State[State["CheckingForUpdate"] = 2] = "CheckingForUpdate";
        State[State["UpdateAvailable"] = 3] = "UpdateAvailable";
        State[State["UpdateDownloaded"] = 4] = "UpdateDownloaded";
    })(State = exports.State || (exports.State = {}));
    var ExplicitState;
    (function (ExplicitState) {
        ExplicitState[ExplicitState["Implicit"] = 0] = "Implicit";
        ExplicitState[ExplicitState["Explicit"] = 1] = "Explicit";
    })(ExplicitState = exports.ExplicitState || (exports.ExplicitState = {}));
    exports.IUpdateService = instantiation_1.createDecorator('updateService');
});
//# sourceMappingURL=update.js.map