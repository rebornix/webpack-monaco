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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/actions", "vs/base/common/severity", "vs/base/common/paths", "vs/workbench/electron-browser/actions", "vs/workbench/parts/extensions/common/extensions", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/platform/environment/common/environment", "electron", "vs/platform/windows/common/windows", "vs/platform/files/common/files", "vs/base/common/uri"], function (require, exports, nls_1, winjs_base_1, actions_1, severity_1, paths, actions_2, extensions_1, instantiation_1, message_1, environment_1, electron_1, windows_1, files_1, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dialog = electron_1.remote.dialog;
    var OpenExtensionsFolderAction = (function (_super) {
        __extends(OpenExtensionsFolderAction, _super);
        function OpenExtensionsFolderAction(id, label, windowsService, fileService, environmentService) {
            var _this = _super.call(this, id, label, null, true) || this;
            _this.windowsService = windowsService;
            _this.fileService = fileService;
            _this.environmentService = environmentService;
            return _this;
        }
        OpenExtensionsFolderAction.prototype.run = function () {
            var _this = this;
            var extensionsHome = this.environmentService.extensionsPath;
            return this.fileService.resolveFile(uri_1.default.file(extensionsHome)).then(function (file) {
                var itemToShow;
                if (file.hasChildren) {
                    itemToShow = file.children[0].resource.fsPath;
                }
                else {
                    itemToShow = paths.normalize(extensionsHome, true);
                }
                return _this.windowsService.showItemInFolder(itemToShow);
            });
        };
        OpenExtensionsFolderAction.prototype.isEnabled = function () {
            return true;
        };
        OpenExtensionsFolderAction.ID = 'workbench.extensions.action.openExtensionsFolder';
        OpenExtensionsFolderAction.LABEL = nls_1.localize('openExtensionsFolder', "Open Extensions Folder");
        OpenExtensionsFolderAction = __decorate([
            __param(2, windows_1.IWindowsService),
            __param(3, files_1.IFileService),
            __param(4, environment_1.IEnvironmentService)
        ], OpenExtensionsFolderAction);
        return OpenExtensionsFolderAction;
    }(actions_1.Action));
    exports.OpenExtensionsFolderAction = OpenExtensionsFolderAction;
    var InstallVSIXAction = (function (_super) {
        __extends(InstallVSIXAction, _super);
        function InstallVSIXAction(id, label, extensionsWorkbenchService, messageService, instantiationService) {
            if (id === void 0) { id = InstallVSIXAction.ID; }
            if (label === void 0) { label = InstallVSIXAction.LABEL; }
            var _this = _super.call(this, id, label, 'extension-action install-vsix', true) || this;
            _this.extensionsWorkbenchService = extensionsWorkbenchService;
            _this.messageService = messageService;
            _this.instantiationService = instantiationService;
            return _this;
        }
        InstallVSIXAction.prototype.run = function () {
            var _this = this;
            var result = dialog.showOpenDialog(electron_1.remote.getCurrentWindow(), {
                filters: [{ name: 'VSIX Extensions', extensions: ['vsix'] }],
                properties: ['openFile']
            });
            if (!result) {
                return winjs_base_1.TPromise.as(null);
            }
            return winjs_base_1.TPromise.join(result.map(function (vsix) { return _this.extensionsWorkbenchService.install(vsix); })).then(function () {
                _this.messageService.show(severity_1.default.Info, {
                    message: nls_1.localize('InstallVSIXAction.success', "Successfully installed the extension. Restart to enable it."),
                    actions: [_this.instantiationService.createInstance(actions_2.ReloadWindowAction, actions_2.ReloadWindowAction.ID, nls_1.localize('InstallVSIXAction.reloadNow', "Reload Now"))]
                });
            });
        };
        InstallVSIXAction.ID = 'workbench.extensions.action.installVSIX';
        InstallVSIXAction.LABEL = nls_1.localize('installVSIX', "Install from VSIX...");
        InstallVSIXAction = __decorate([
            __param(2, extensions_1.IExtensionsWorkbenchService),
            __param(3, message_1.IMessageService),
            __param(4, instantiation_1.IInstantiationService)
        ], InstallVSIXAction);
        return InstallVSIXAction;
    }(actions_1.Action));
    exports.InstallVSIXAction = InstallVSIXAction;
});
//# sourceMappingURL=extensionsActions.js.map