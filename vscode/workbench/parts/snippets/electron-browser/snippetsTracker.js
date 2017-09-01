/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "path", "vs/base/node/pfs", "vs/base/common/errors", "vs/base/common/lifecycle", "./TMSnippets", "vs/workbench/parts/snippets/electron-browser/snippetsService", "vs/platform/environment/common/environment", "vs/platform/extensions/common/extensions", "fs", "vs/editor/common/services/modeService"], function (require, exports, path_1, pfs_1, errors_1, lifecycle_1, TMSnippets_1, snippetsService_1, environment_1, extensions_1, fs_1, modeService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SnippetsTracker = (function () {
        function SnippetsTracker(modeService, snippetService, environmentService, extensionService) {
            var _this = this;
            this._snippetFolder = path_1.join(environmentService.appSettingsHome, 'snippets');
            this._toDispose = [];
            // Whenever a mode is being created check if a snippet file exists
            // and iff so read all snippets from it.
            this._toDispose.push(modeService.onDidCreateMode(function (mode) {
                var snippetPath = path_1.join(_this._snippetFolder, mode.getId() + ".json");
                pfs_1.fileExists(snippetPath)
                    .then(function (exists) { return exists && TMSnippets_1.readAndRegisterSnippets(snippetService, mode.getLanguageIdentifier(), snippetPath); })
                    .done(undefined, errors_1.onUnexpectedError);
            }));
            // Install a FS watcher on the snippet directory and when an
            // event occurs update the snippets for that one snippet.
            pfs_1.mkdirp(this._snippetFolder).then(function () {
                var watcher = fs_1.watch(_this._snippetFolder);
                _this._toDispose.push({ dispose: function () { return watcher.close(); } });
                watcher.on('change', function (type, filename) {
                    if (typeof filename !== 'string') {
                        return;
                    }
                    extensionService.onReady().then(function () {
                        var langName = filename.replace(/\.json$/, '').toLowerCase();
                        var langId = modeService.getLanguageIdentifier(langName);
                        return langId && TMSnippets_1.readAndRegisterSnippets(snippetService, langId, path_1.join(_this._snippetFolder, filename));
                    }, errors_1.onUnexpectedError);
                });
            });
        }
        SnippetsTracker.prototype.getId = function () {
            return 'vs.snippets.snippetsTracker';
        };
        SnippetsTracker.prototype.dispose = function () {
            lifecycle_1.dispose(this._toDispose);
        };
        SnippetsTracker = __decorate([
            __param(0, modeService_1.IModeService),
            __param(1, snippetsService_1.ISnippetsService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, extensions_1.IExtensionService)
        ], SnippetsTracker);
        return SnippetsTracker;
    }());
    exports.SnippetsTracker = SnippetsTracker;
});
//# sourceMappingURL=snippetsTracker.js.map