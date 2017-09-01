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
define(["require", "exports", "vs/base/common/event", "vs/platform/windows/common/windows", "electron"], function (require, exports, event_1, windows_1, electron_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowService = (function () {
        function WindowService(windowId, windowsService) {
            this.windowId = windowId;
            this.windowsService = windowsService;
            var onThisWindowFocus = event_1.mapEvent(event_1.filterEvent(windowsService.onWindowFocus, function (id) { return id === windowId; }), function (_) { return true; });
            var onThisWindowBlur = event_1.mapEvent(event_1.filterEvent(windowsService.onWindowBlur, function (id) { return id === windowId; }), function (_) { return false; });
            this.onDidChangeFocus = event_1.any(onThisWindowFocus, onThisWindowBlur);
        }
        WindowService.prototype.getCurrentWindowId = function () {
            return this.windowId;
        };
        WindowService.prototype.pickFileFolderAndOpen = function (options) {
            options.windowId = this.windowId;
            return this.windowsService.pickFileFolderAndOpen(options);
        };
        WindowService.prototype.pickFileAndOpen = function (options) {
            options.windowId = this.windowId;
            return this.windowsService.pickFileAndOpen(options);
        };
        WindowService.prototype.pickFolderAndOpen = function (options) {
            options.windowId = this.windowId;
            return this.windowsService.pickFolderAndOpen(options);
        };
        WindowService.prototype.reloadWindow = function () {
            return this.windowsService.reloadWindow(this.windowId);
        };
        WindowService.prototype.openDevTools = function () {
            return this.windowsService.openDevTools(this.windowId);
        };
        WindowService.prototype.toggleDevTools = function () {
            return this.windowsService.toggleDevTools(this.windowId);
        };
        WindowService.prototype.closeWorkspace = function () {
            return this.windowsService.closeWorkspace(this.windowId);
        };
        WindowService.prototype.openWorkspace = function () {
            return this.windowsService.openWorkspace(this.windowId);
        };
        WindowService.prototype.createAndOpenWorkspace = function (folders, path) {
            return this.windowsService.createAndOpenWorkspace(this.windowId, folders, path);
        };
        WindowService.prototype.saveAndOpenWorkspace = function (path) {
            return this.windowsService.saveAndOpenWorkspace(this.windowId, path);
        };
        WindowService.prototype.closeWindow = function () {
            return this.windowsService.closeWindow(this.windowId);
        };
        WindowService.prototype.toggleFullScreen = function () {
            return this.windowsService.toggleFullScreen(this.windowId);
        };
        WindowService.prototype.setRepresentedFilename = function (fileName) {
            return this.windowsService.setRepresentedFilename(this.windowId, fileName);
        };
        WindowService.prototype.getRecentlyOpened = function () {
            return this.windowsService.getRecentlyOpened(this.windowId);
        };
        WindowService.prototype.focusWindow = function () {
            return this.windowsService.focusWindow(this.windowId);
        };
        WindowService.prototype.isFocused = function () {
            return this.windowsService.isFocused(this.windowId);
        };
        WindowService.prototype.isMaximized = function () {
            return this.windowsService.isMaximized(this.windowId);
        };
        WindowService.prototype.maximizeWindow = function () {
            return this.windowsService.maximizeWindow(this.windowId);
        };
        WindowService.prototype.unmaximizeWindow = function () {
            return this.windowsService.unmaximizeWindow(this.windowId);
        };
        WindowService.prototype.onWindowTitleDoubleClick = function () {
            return this.windowsService.onWindowTitleDoubleClick(this.windowId);
        };
        WindowService.prototype.setDocumentEdited = function (flag) {
            return this.windowsService.setDocumentEdited(this.windowId, flag);
        };
        WindowService.prototype.showMessageBox = function (options) {
            return electron_1.remote.dialog.showMessageBox(electron_1.remote.getCurrentWindow(), options);
        };
        WindowService.prototype.showSaveDialog = function (options, callback) {
            if (callback) {
                return electron_1.remote.dialog.showSaveDialog(electron_1.remote.getCurrentWindow(), options, callback);
            }
            return electron_1.remote.dialog.showSaveDialog(electron_1.remote.getCurrentWindow(), options); // https://github.com/electron/electron/issues/4936
        };
        WindowService.prototype.showOpenDialog = function (options, callback) {
            if (callback) {
                return electron_1.remote.dialog.showOpenDialog(electron_1.remote.getCurrentWindow(), options, callback);
            }
            return electron_1.remote.dialog.showOpenDialog(electron_1.remote.getCurrentWindow(), options); // https://github.com/electron/electron/issues/4936
        };
        WindowService = __decorate([
            __param(1, windows_1.IWindowsService)
        ], WindowService);
        return WindowService;
    }());
    exports.WindowService = WindowService;
});
//# sourceMappingURL=windowService.js.map