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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "events", "vs/base/common/types", "vs/base/node/request", "vs/platform/request/node/request", "vs/platform/node/product"], function (require, exports, events_1, types_1, request_1, request_2, product_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LinuxAutoUpdaterImpl = (function (_super) {
        __extends(LinuxAutoUpdaterImpl, _super);
        function LinuxAutoUpdaterImpl(requestService) {
            var _this = _super.call(this) || this;
            _this.requestService = requestService;
            _this.url = null;
            _this.currentRequest = null;
            return _this;
        }
        LinuxAutoUpdaterImpl.prototype.setFeedURL = function (url) {
            this.url = url;
        };
        LinuxAutoUpdaterImpl.prototype.checkForUpdates = function () {
            var _this = this;
            if (!this.url) {
                throw new Error('No feed url set.');
            }
            if (this.currentRequest) {
                return;
            }
            this.emit('checking-for-update');
            this.currentRequest = this.requestService.request({ url: this.url })
                .then(request_1.asJson)
                .then(function (update) {
                if (!update || !update.url || !update.version || !update.productVersion) {
                    _this.emit('update-not-available');
                }
                else {
                    _this.emit('update-available', null, product_1.default.downloadUrl, update.productVersion);
                }
            })
                .then(null, function (e) {
                if (types_1.isString(e) && /^Server returned/.test(e)) {
                    return;
                }
                _this.emit('update-not-available');
                _this.emit('error', e);
            })
                .then(function () { return _this.currentRequest = null; });
        };
        LinuxAutoUpdaterImpl.prototype.quitAndInstall = function () {
            // noop
        };
        LinuxAutoUpdaterImpl = __decorate([
            __param(0, request_2.IRequestService)
        ], LinuxAutoUpdaterImpl);
        return LinuxAutoUpdaterImpl;
    }(events_1.EventEmitter));
    exports.LinuxAutoUpdaterImpl = LinuxAutoUpdaterImpl;
});
//# sourceMappingURL=auto-updater.linux.js.map