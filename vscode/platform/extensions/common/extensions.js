define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IExtensionService = instantiation_1.createDecorator('extensionService');
    var ActivationTimes = (function () {
        function ActivationTimes(startup, codeLoadingTime, activateCallTime, activateResolvedTime) {
            this.startup = startup;
            this.codeLoadingTime = codeLoadingTime;
            this.activateCallTime = activateCallTime;
            this.activateResolvedTime = activateResolvedTime;
        }
        return ActivationTimes;
    }());
    exports.ActivationTimes = ActivationTimes;
    var ExtensionPointContribution = (function () {
        function ExtensionPointContribution(description, value) {
            this.description = description;
            this.value = value;
        }
        return ExtensionPointContribution;
    }());
    exports.ExtensionPointContribution = ExtensionPointContribution;
});
//# sourceMappingURL=extensions.js.map