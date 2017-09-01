define(["require", "exports", "./extHost.protocol"], function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostOutputChannel = (function () {
        function ExtHostOutputChannel(name, proxy) {
            this._name = name;
            this._id = 'extension-output-#' + (ExtHostOutputChannel._idPool++);
            this._proxy = proxy;
        }
        Object.defineProperty(ExtHostOutputChannel.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostOutputChannel.prototype.dispose = function () {
            var _this = this;
            if (!this._disposed) {
                this._proxy.$dispose(this._id, this._name).then(function () {
                    _this._disposed = true;
                });
            }
        };
        ExtHostOutputChannel.prototype.append = function (value) {
            this._proxy.$append(this._id, this._name, value);
        };
        ExtHostOutputChannel.prototype.appendLine = function (value) {
            this.append(value + '\n');
        };
        ExtHostOutputChannel.prototype.clear = function () {
            this._proxy.$clear(this._id, this._name);
        };
        ExtHostOutputChannel.prototype.show = function (columnOrPreserveFocus, preserveFocus) {
            if (typeof columnOrPreserveFocus === 'boolean') {
                preserveFocus = columnOrPreserveFocus;
            }
            this._proxy.$reveal(this._id, this._name, preserveFocus);
        };
        ExtHostOutputChannel.prototype.hide = function () {
            this._proxy.$close(this._id);
        };
        ExtHostOutputChannel._idPool = 1;
        return ExtHostOutputChannel;
    }());
    exports.ExtHostOutputChannel = ExtHostOutputChannel;
    var ExtHostOutputService = (function () {
        function ExtHostOutputService(mainContext) {
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadOutputService);
        }
        ExtHostOutputService.prototype.createOutputChannel = function (name) {
            name = name.trim();
            if (!name) {
                throw new Error('illegal argument `name`. must not be falsy');
            }
            else {
                return new ExtHostOutputChannel(name, this._proxy);
            }
        };
        return ExtHostOutputService;
    }());
    exports.ExtHostOutputService = ExtHostOutputService;
});
//# sourceMappingURL=extHostOutputService.js.map