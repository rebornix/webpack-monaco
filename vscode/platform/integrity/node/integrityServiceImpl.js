var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "fs", "crypto", "vs/base/common/winjs.base", "vs/platform/message/common/message", "vs/platform/node/product", "vs/base/common/uri", "vs/base/common/severity", "vs/base/common/actions", "vs/platform/storage/common/storage"], function (require, exports, nls, fs, crypto, winjs_base_1, message_1, product_1, uri_1, severity_1, actions_1, storage_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntegrityStorage = (function () {
        function IntegrityStorage(storageService) {
            this._storageService = storageService;
            this._value = this._read();
        }
        IntegrityStorage.prototype._read = function () {
            var jsonValue = this._storageService.get(IntegrityStorage.KEY, storage_1.StorageScope.GLOBAL);
            if (!jsonValue) {
                return null;
            }
            try {
                return JSON.parse(jsonValue);
            }
            catch (err) {
                return null;
            }
        };
        IntegrityStorage.prototype.get = function () {
            return this._value;
        };
        IntegrityStorage.prototype.set = function (data) {
            this._value = data;
            this._storageService.store(IntegrityStorage.KEY, JSON.stringify(this._value), storage_1.StorageScope.GLOBAL);
        };
        IntegrityStorage.KEY = 'integrityService';
        return IntegrityStorage;
    }());
    var IntegrityServiceImpl = (function () {
        function IntegrityServiceImpl(messageService, storageService) {
            var _this = this;
            this._messageService = messageService;
            this._storage = new IntegrityStorage(storageService);
            this._isPurePromise = this._isPure();
            this.isPure().then(function (r) {
                if (r.isPure) {
                    // all is good
                    return;
                }
                _this._prompt();
            });
        }
        IntegrityServiceImpl.prototype._prompt = function () {
            var _this = this;
            var storedData = this._storage.get();
            if (storedData && storedData.dontShowPrompt && storedData.commit === product_1.default.commit) {
                // Do not prompt
                return;
            }
            var okAction = new actions_1.Action('integrity.ok', nls.localize('integrity.ok', "OK"), null, true, function () { return winjs_base_1.TPromise.as(true); });
            var dontShowAgainAction = new actions_1.Action('integrity.dontShowAgain', nls.localize('integrity.dontShowAgain', "Don't show again"), null, true, function () {
                _this._storage.set({
                    dontShowPrompt: true,
                    commit: product_1.default.commit
                });
                return winjs_base_1.TPromise.as(true);
            });
            var moreInfoAction = new actions_1.Action('integrity.moreInfo', nls.localize('integrity.moreInfo', "More information"), null, true, function () {
                var uri = uri_1.default.parse(product_1.default.checksumFailMoreInfoUrl);
                window.open(uri.toString(true));
                return winjs_base_1.TPromise.as(true);
            });
            this._messageService.show(severity_1.default.Warning, {
                message: nls.localize('integrity.prompt', "Your {0} installation appears to be corrupt. Please reinstall.", product_1.default.nameShort),
                actions: [okAction, moreInfoAction, dontShowAgainAction]
            });
        };
        IntegrityServiceImpl.prototype.isPure = function () {
            return this._isPurePromise;
        };
        IntegrityServiceImpl.prototype._isPure = function () {
            var _this = this;
            var expectedChecksums = product_1.default.checksums || {};
            return winjs_base_1.TPromise.timeout(10000).then(function () {
                var asyncResults = Object.keys(expectedChecksums).map(function (filename) {
                    return _this._resolve(filename, expectedChecksums[filename]);
                });
                return winjs_base_1.TPromise.join(asyncResults).then(function (allResults) {
                    var isPure = true;
                    for (var i = 0, len = allResults.length; isPure && i < len; i++) {
                        if (!allResults[i].isPure) {
                            isPure = false;
                            break;
                        }
                    }
                    return {
                        isPure: isPure,
                        proof: allResults
                    };
                });
            });
        };
        IntegrityServiceImpl.prototype._resolve = function (filename, expected) {
            var _this = this;
            var fileUri = uri_1.default.parse(require.toUrl(filename));
            return new winjs_base_1.TPromise(function (c, e, p) {
                fs.readFile(fileUri.fsPath, function (err, buff) {
                    if (err) {
                        return e(err);
                    }
                    c(IntegrityServiceImpl._createChecksumPair(fileUri, _this._computeChecksum(buff), expected));
                });
            });
        };
        IntegrityServiceImpl.prototype._computeChecksum = function (buff) {
            var hash = crypto
                .createHash('md5')
                .update(buff)
                .digest('base64')
                .replace(/=+$/, '');
            return hash;
        };
        IntegrityServiceImpl._createChecksumPair = function (uri, actual, expected) {
            return {
                uri: uri,
                actual: actual,
                expected: expected,
                isPure: (actual === expected)
            };
        };
        IntegrityServiceImpl = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, storage_1.IStorageService)
        ], IntegrityServiceImpl);
        return IntegrityServiceImpl;
    }());
    exports.IntegrityServiceImpl = IntegrityServiceImpl;
});
//# sourceMappingURL=integrityServiceImpl.js.map