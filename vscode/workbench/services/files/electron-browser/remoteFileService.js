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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "vs/workbench/services/files/electron-browser/fileService", "vs/platform/files/common/files", "vs/base/common/winjs.base", "events", "path"], function (require, exports, fileService_1, files_1, winjs_base_1, events_1, path_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RemoteFileService = (function (_super) {
        __extends(RemoteFileService, _super);
        function RemoteFileService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._provider = new Map();
            return _this;
        }
        RemoteFileService.prototype.registerProvider = function (authority, provider) {
            var _this = this;
            if (this._provider.has(authority)) {
                throw new Error();
            }
            this._provider.set(authority, provider);
            var reg = provider.onDidChange(function (e) {
                // forward change events
                _this._onFileChanges.fire(new files_1.FileChangesEvent([{ resource: e, type: files_1.FileChangeType.UPDATED }]));
            });
            return {
                dispose: function () {
                    _this._provider.delete(authority);
                    reg.dispose();
                }
            };
        };
        // --- resolve
        RemoteFileService.prototype.resolveContent = function (resource, options) {
            if (this._provider.has(resource.authority)) {
                return this._doResolveContent(resource);
            }
            return _super.prototype.resolveContent.call(this, resource, options);
        };
        RemoteFileService.prototype.resolveStreamContent = function (resource, options) {
            if (this._provider.has(resource.authority)) {
                return this._doResolveContent(resource).then(RemoteFileService._asStreamContent);
            }
            return _super.prototype.resolveStreamContent.call(this, resource, options);
        };
        RemoteFileService.prototype._doResolveContent = function (resource) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var stat, value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            stat = RemoteFileService._createFakeStat(resource);
                            return [4 /*yield*/, this._provider.get(resource.authority).resolve(resource)];
                        case 1:
                            value = _a.sent();
                            return [2 /*return*/, __assign({}, stat, { value: value })];
                    }
                });
            });
        };
        // --- saving
        RemoteFileService.prototype.updateContent = function (resource, value, options) {
            if (this._provider.has(resource.authority)) {
                return this._doUpdateContent(resource, value).then(RemoteFileService._createFakeStat);
            }
            return _super.prototype.updateContent.call(this, resource, value, options);
        };
        RemoteFileService.prototype._doUpdateContent = function (resource, content) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this._provider.get(resource.authority).update(resource, content)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, resource];
                    }
                });
            });
        };
        // --- util
        RemoteFileService._createFakeStat = function (resource) {
            return {
                resource: resource,
                name: path_1.basename(resource.path),
                encoding: 'utf8',
                mtime: Date.now(),
                etag: Date.now().toString(16),
                isDirectory: false,
                hasChildren: false
            };
        };
        RemoteFileService._asStreamContent = function (content) {
            var emitter = new events_1.EventEmitter();
            var value = content.value;
            var result = content;
            result.value = emitter;
            setTimeout(function () {
                emitter.emit('data', value);
                emitter.emit('end');
            }, 0);
            return result;
        };
        return RemoteFileService;
    }(fileService_1.FileService));
    exports.RemoteFileService = RemoteFileService;
});
//# sourceMappingURL=remoteFileService.js.map