define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IProgressService = instantiation_1.createDecorator('progressService');
    exports.emptyProgress = Object.freeze({ report: function () { } });
    var Progress = (function () {
        function Progress(callback) {
            this._callback = callback;
        }
        Object.defineProperty(Progress.prototype, "value", {
            get: function () {
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        Progress.prototype.report = function (item) {
            this._value = item;
            this._callback(this._value);
        };
        return Progress;
    }());
    exports.Progress = Progress;
    var ProgressLocation;
    (function (ProgressLocation) {
        ProgressLocation[ProgressLocation["Scm"] = 1] = "Scm";
        ProgressLocation[ProgressLocation["Window"] = 10] = "Window";
    })(ProgressLocation = exports.ProgressLocation || (exports.ProgressLocation = {}));
    exports.IProgressService2 = instantiation_1.createDecorator('progressService2');
});
//# sourceMappingURL=progress.js.map