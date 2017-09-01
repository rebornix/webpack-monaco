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
define(["require", "exports", "vs/nls", "vs/base/common/paths", "vs/base/common/strings", "vs/base/common/platform", "vs/workbench/common/editor", "vs/workbench/services/textfile/common/textFileService", "vs/workbench/services/untitled/common/untitledEditorService", "vs/platform/files/common/files", "vs/platform/workspace/common/workspace", "vs/platform/lifecycle/common/lifecycle", "vs/platform/telemetry/common/telemetry", "vs/platform/configuration/common/configuration", "vs/editor/common/services/modeService", "vs/workbench/services/textfile/electron-browser/modelBuilder", "vs/platform/node/product", "vs/platform/environment/common/environment", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/workbench/services/backup/common/backup", "vs/platform/windows/common/windows", "vs/workbench/services/history/common/history", "vs/base/common/labels"], function (require, exports, nls, paths, strings, platform_1, editor_1, textFileService_1, untitledEditorService_1, files_1, workspace_1, lifecycle_1, telemetry_1, configuration_1, modeService_1, modelBuilder_1, product_1, environment_1, instantiation_1, message_1, backup_1, windows_1, history_1, labels_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TextFileService = (function (_super) {
        __extends(TextFileService, _super);
        function TextFileService(contextService, fileService, untitledEditorService, lifecycleService, instantiationService, telemetryService, configurationService, modeService, windowService, environmentService, messageService, backupFileService, windowsService, historyService) {
            var _this = _super.call(this, lifecycleService, contextService, configurationService, telemetryService, fileService, untitledEditorService, instantiationService, messageService, environmentService, backupFileService, windowsService, historyService) || this;
            _this.modeService = modeService;
            _this.windowService = windowService;
            return _this;
        }
        TextFileService.prototype.resolveTextContent = function (resource, options) {
            return this.fileService.resolveStreamContent(resource, options).then(function (streamContent) {
                return modelBuilder_1.ModelBuilder.fromStringStream(streamContent.value).then(function (res) {
                    var r = {
                        resource: streamContent.resource,
                        name: streamContent.name,
                        mtime: streamContent.mtime,
                        etag: streamContent.etag,
                        encoding: streamContent.encoding,
                        value: res.value,
                        valueLogicalHash: res.hash
                    };
                    return r;
                });
            });
        };
        TextFileService.prototype.confirmSave = function (resources) {
            if (this.environmentService.isExtensionDevelopment) {
                return editor_1.ConfirmResult.DONT_SAVE; // no veto when we are in extension dev mode because we cannot assum we run interactive (e.g. tests)
            }
            var resourcesToConfirm = this.getDirty(resources);
            if (resourcesToConfirm.length === 0) {
                return editor_1.ConfirmResult.DONT_SAVE;
            }
            var message = [
                resourcesToConfirm.length === 1 ? nls.localize('saveChangesMessage', "Do you want to save the changes you made to {0}?", paths.basename(resourcesToConfirm[0].fsPath)) : nls.localize('saveChangesMessages', "Do you want to save the changes to the following {0} files?", resourcesToConfirm.length)
            ];
            if (resourcesToConfirm.length > 1) {
                message.push('');
                message.push.apply(message, resourcesToConfirm.slice(0, TextFileService.MAX_CONFIRM_FILES).map(function (r) { return paths.basename(r.fsPath); }));
                if (resourcesToConfirm.length > TextFileService.MAX_CONFIRM_FILES) {
                    if (resourcesToConfirm.length - TextFileService.MAX_CONFIRM_FILES === 1) {
                        message.push(nls.localize('moreFile', "...1 additional file not shown"));
                    }
                    else {
                        message.push(nls.localize('moreFiles', "...{0} additional files not shown", resourcesToConfirm.length - TextFileService.MAX_CONFIRM_FILES));
                    }
                }
                message.push('');
            }
            // Button order
            // Windows: Save | Don't Save | Cancel
            // Mac: Save | Cancel | Don't Save
            // Linux: Don't Save | Cancel | Save
            var save = { label: resourcesToConfirm.length > 1 ? labels_1.mnemonicLabel(nls.localize({ key: 'saveAll', comment: ['&& denotes a mnemonic'] }, "&&Save All")) : labels_1.mnemonicLabel(nls.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save")), result: editor_1.ConfirmResult.SAVE };
            var dontSave = { label: labels_1.mnemonicLabel(nls.localize({ key: 'dontSave', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save")), result: editor_1.ConfirmResult.DONT_SAVE };
            var cancel = { label: nls.localize('cancel', "Cancel"), result: editor_1.ConfirmResult.CANCEL };
            var buttons = [];
            if (platform_1.isWindows) {
                buttons.push(save, dontSave, cancel);
            }
            else if (platform_1.isLinux) {
                buttons.push(dontSave, cancel, save);
            }
            else {
                buttons.push(save, cancel, dontSave);
            }
            var opts = {
                title: product_1.default.nameLong,
                message: message.join('\n'),
                type: 'warning',
                detail: nls.localize('saveChangesDetail', "Your changes will be lost if you don't save them."),
                buttons: buttons.map(function (b) { return b.label; }),
                noLink: true,
                cancelId: buttons.indexOf(cancel)
            };
            if (platform_1.isLinux) {
                opts.defaultId = 2;
            }
            var choice = this.windowService.showMessageBox(opts);
            return buttons[choice].result;
        };
        TextFileService.prototype.promptForPath = function (defaultPath) {
            return this.windowService.showSaveDialog(this.getSaveDialogOptions(defaultPath ? paths.normalize(defaultPath, true) : void 0));
        };
        TextFileService.prototype.getSaveDialogOptions = function (defaultPath) {
            var _this = this;
            var options = {
                defaultPath: defaultPath
            };
            // Filters are only enabled on Windows where they work properly
            if (!platform_1.isWindows) {
                return options;
            }
            // Build the file filter by using our known languages
            var ext = paths.extname(defaultPath);
            var matchingFilter;
            var filters = this.modeService.getRegisteredLanguageNames().map(function (languageName) {
                var extensions = _this.modeService.getExtensions(languageName);
                if (!extensions || !extensions.length) {
                    return null;
                }
                var filter = { name: languageName, extensions: extensions.slice(0, 10).map(function (e) { return strings.trim(e, '.'); }) };
                if (ext && extensions.indexOf(ext) >= 0) {
                    matchingFilter = filter;
                    return null; // matching filter will be added last to the top
                }
                return filter;
            }).filter(function (f) { return !!f; });
            // Filters are a bit weird on Windows, based on having a match or not:
            // Match: we put the matching filter first so that it shows up selected and the all files last
            // No match: we put the all files filter first
            var allFilesFilter = { name: nls.localize('allFiles', "All Files"), extensions: ['*'] };
            if (matchingFilter) {
                filters.unshift(matchingFilter);
                filters.unshift(allFilesFilter);
            }
            else {
                filters.unshift(allFilesFilter);
            }
            // Allow to save file without extension
            filters.push({ name: nls.localize('noExt', "No Extension"), extensions: [''] });
            options.filters = filters;
            return options;
        };
        TextFileService.MAX_CONFIRM_FILES = 10;
        TextFileService = __decorate([
            __param(0, workspace_1.IWorkspaceContextService),
            __param(1, files_1.IFileService),
            __param(2, untitledEditorService_1.IUntitledEditorService),
            __param(3, lifecycle_1.ILifecycleService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, telemetry_1.ITelemetryService),
            __param(6, configuration_1.IConfigurationService),
            __param(7, modeService_1.IModeService),
            __param(8, windows_1.IWindowService),
            __param(9, environment_1.IEnvironmentService),
            __param(10, message_1.IMessageService),
            __param(11, backup_1.IBackupFileService),
            __param(12, windows_1.IWindowsService),
            __param(13, history_1.IHistoryService)
        ], TextFileService);
        return TextFileService;
    }(textFileService_1.TextFileService));
    exports.TextFileService = TextFileService;
});
//# sourceMappingURL=textFileService.js.map