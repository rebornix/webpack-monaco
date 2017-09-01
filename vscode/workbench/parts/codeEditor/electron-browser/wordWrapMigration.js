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
define(["require", "exports", "vs/nls", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/editor/browser/editorBrowserExtensions", "vs/platform/configuration/common/configuration", "vs/platform/storage/common/storage", "vs/platform/message/common/message", "vs/workbench/parts/preferences/common/preferences", "vs/base/common/actions", "vs/base/common/severity"], function (require, exports, nls, lifecycle_1, winjs_base_1, editorBrowserExtensions_1, configuration_1, storage_1, message_1, preferences_1, actions_1, severity_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WordWrapMigrationStorage = (function () {
        function WordWrapMigrationStorage(storageService) {
            this._storageService = storageService;
            this._value = this._read();
        }
        WordWrapMigrationStorage.prototype._read = function () {
            var jsonValue = this._storageService.get(WordWrapMigrationStorage.KEY, storage_1.StorageScope.GLOBAL);
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
        WordWrapMigrationStorage.prototype.get = function () {
            return this._value;
        };
        WordWrapMigrationStorage.prototype.set = function (data) {
            this._value = data;
            this._storageService.store(WordWrapMigrationStorage.KEY, JSON.stringify(this._value), storage_1.StorageScope.GLOBAL);
        };
        WordWrapMigrationStorage.KEY = 'wordWrapMigration';
        return WordWrapMigrationStorage;
    }());
    var WordWrapMigrationController = (function (_super) {
        __extends(WordWrapMigrationController, _super);
        function WordWrapMigrationController(editor, configurationService, messageService, storageService, preferencesService) {
            var _this = _super.call(this) || this;
            _this.configurationService = configurationService;
            _this.messageService = messageService;
            _this.storageService = storageService;
            _this.preferencesService = preferencesService;
            _this._promptIfNecessary();
            return _this;
        }
        WordWrapMigrationController_1 = WordWrapMigrationController;
        WordWrapMigrationController.prototype.getId = function () {
            return WordWrapMigrationController_1.ID;
        };
        WordWrapMigrationController.prototype._promptIfNecessary = function () {
            if (WordWrapMigrationController_1._checked) {
                // Already checked
                return;
            }
            WordWrapMigrationController_1._checked = true;
            var result = this.configurationService.lookup('editor.wrappingColumn');
            if (typeof result.value === 'undefined') {
                // Setting is not used
                return;
            }
            var storage = new WordWrapMigrationStorage(this.storageService);
            var storedData = storage.get();
            if (storedData && storedData.dontShowPrompt) {
                // Do not prompt stored
                return;
            }
            var isUserSetting = (typeof result.user !== 'undefined');
            this._prompt(storage, isUserSetting);
        };
        WordWrapMigrationController.prototype._prompt = function (storage, userSettings) {
            var _this = this;
            var okAction = new actions_1.Action('wordWrapMigration.ok', nls.localize('wordWrapMigration.ok', "OK"), null, true, function () { return winjs_base_1.TPromise.as(true); });
            var dontShowAgainAction = new actions_1.Action('wordWrapMigration.dontShowAgain', nls.localize('wordWrapMigration.dontShowAgain', "Don't show again"), null, true, function () {
                storage.set({
                    dontShowPrompt: true
                });
                return winjs_base_1.TPromise.as(true);
            });
            var openSettings = new actions_1.Action('wordWrapMigration.openSettings', nls.localize('wordWrapMigration.openSettings', "Open Settings"), null, true, function () {
                if (userSettings) {
                    _this.preferencesService.openGlobalSettings();
                }
                else {
                    _this.preferencesService.openWorkspaceSettings();
                }
                return winjs_base_1.TPromise.as(true);
            });
            this.messageService.show(severity_1.default.Info, {
                message: nls.localize('wordWrapMigration.prompt', "The setting `editor.wrappingColumn` has been deprecated in favor of `editor.wordWrap`."),
                actions: [okAction, openSettings, dontShowAgainAction]
            });
        };
        WordWrapMigrationController.ID = 'editor.contrib.wordWrapMigrationController';
        WordWrapMigrationController._checked = false;
        WordWrapMigrationController = WordWrapMigrationController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, configuration_1.IConfigurationService),
            __param(2, message_1.IMessageService),
            __param(3, storage_1.IStorageService),
            __param(4, preferences_1.IPreferencesService)
        ], WordWrapMigrationController);
        return WordWrapMigrationController;
        var WordWrapMigrationController_1;
    }(lifecycle_1.Disposable));
});
//# sourceMappingURL=wordWrapMigration.js.map