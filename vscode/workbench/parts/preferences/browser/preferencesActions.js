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
define(["require", "exports", "vs/nls", "vs/base/common/uri", "vs/base/common/actions", "vs/editor/common/services/modeService", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/parts/preferences/common/preferences", "vs/platform/workspace/common/workspace", "vs/workbench/services/configuration/common/configurationEditing"], function (require, exports, nls, uri_1, actions_1, modeService_1, quickOpen_1, preferences_1, workspace_1, configurationEditing_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OpenGlobalSettingsAction = (function (_super) {
        __extends(OpenGlobalSettingsAction, _super);
        function OpenGlobalSettingsAction(id, label, preferencesService) {
            var _this = _super.call(this, id, label) || this;
            _this.preferencesService = preferencesService;
            return _this;
        }
        OpenGlobalSettingsAction.prototype.run = function (event) {
            return this.preferencesService.openGlobalSettings();
        };
        OpenGlobalSettingsAction.ID = 'workbench.action.openGlobalSettings';
        OpenGlobalSettingsAction.LABEL = nls.localize('openGlobalSettings', "Open User Settings");
        OpenGlobalSettingsAction = __decorate([
            __param(2, preferences_1.IPreferencesService)
        ], OpenGlobalSettingsAction);
        return OpenGlobalSettingsAction;
    }(actions_1.Action));
    exports.OpenGlobalSettingsAction = OpenGlobalSettingsAction;
    var OpenGlobalKeybindingsAction = (function (_super) {
        __extends(OpenGlobalKeybindingsAction, _super);
        function OpenGlobalKeybindingsAction(id, label, preferencesService) {
            var _this = _super.call(this, id, label) || this;
            _this.preferencesService = preferencesService;
            return _this;
        }
        OpenGlobalKeybindingsAction.prototype.run = function (event) {
            return this.preferencesService.openGlobalKeybindingSettings(false);
        };
        OpenGlobalKeybindingsAction.ID = 'workbench.action.openGlobalKeybindings';
        OpenGlobalKeybindingsAction.LABEL = nls.localize('openGlobalKeybindings', "Open Keyboard Shortcuts");
        OpenGlobalKeybindingsAction = __decorate([
            __param(2, preferences_1.IPreferencesService)
        ], OpenGlobalKeybindingsAction);
        return OpenGlobalKeybindingsAction;
    }(actions_1.Action));
    exports.OpenGlobalKeybindingsAction = OpenGlobalKeybindingsAction;
    var OpenGlobalKeybindingsFileAction = (function (_super) {
        __extends(OpenGlobalKeybindingsFileAction, _super);
        function OpenGlobalKeybindingsFileAction(id, label, preferencesService) {
            var _this = _super.call(this, id, label) || this;
            _this.preferencesService = preferencesService;
            return _this;
        }
        OpenGlobalKeybindingsFileAction.prototype.run = function (event) {
            return this.preferencesService.openGlobalKeybindingSettings(true);
        };
        OpenGlobalKeybindingsFileAction.ID = 'workbench.action.openGlobalKeybindingsFile';
        OpenGlobalKeybindingsFileAction.LABEL = nls.localize('openGlobalKeybindingsFile', "Open Keyboard Shortcuts File");
        OpenGlobalKeybindingsFileAction = __decorate([
            __param(2, preferences_1.IPreferencesService)
        ], OpenGlobalKeybindingsFileAction);
        return OpenGlobalKeybindingsFileAction;
    }(actions_1.Action));
    exports.OpenGlobalKeybindingsFileAction = OpenGlobalKeybindingsFileAction;
    var OpenWorkspaceSettingsAction = (function (_super) {
        __extends(OpenWorkspaceSettingsAction, _super);
        function OpenWorkspaceSettingsAction(id, label, preferencesService, workspaceContextService) {
            var _this = _super.call(this, id, label) || this;
            _this.preferencesService = preferencesService;
            _this.workspaceContextService = workspaceContextService;
            _this.enabled = _this.workspaceContextService.hasWorkspace();
            return _this;
        }
        OpenWorkspaceSettingsAction.prototype.run = function (event) {
            return this.preferencesService.openWorkspaceSettings();
        };
        OpenWorkspaceSettingsAction.ID = 'workbench.action.openWorkspaceSettings';
        OpenWorkspaceSettingsAction.LABEL = nls.localize('openWorkspaceSettings', "Open Workspace Settings");
        OpenWorkspaceSettingsAction = __decorate([
            __param(2, preferences_1.IPreferencesService),
            __param(3, workspace_1.IWorkspaceContextService)
        ], OpenWorkspaceSettingsAction);
        return OpenWorkspaceSettingsAction;
    }(actions_1.Action));
    exports.OpenWorkspaceSettingsAction = OpenWorkspaceSettingsAction;
    var OpenFolderSettingsAction = (function (_super) {
        __extends(OpenFolderSettingsAction, _super);
        function OpenFolderSettingsAction(id, label, preferencesService, workspaceContextService, quickOpenService) {
            var _this = _super.call(this, id, label) || this;
            _this.preferencesService = preferencesService;
            _this.workspaceContextService = workspaceContextService;
            _this.quickOpenService = quickOpenService;
            _this.enabled = _this.workspaceContextService.hasMultiFolderWorkspace();
            return _this;
        }
        OpenFolderSettingsAction.prototype.run = function () {
            var _this = this;
            var picks = this.workspaceContextService.getWorkspace().roots.map(function (root, index) {
                return {
                    label: preferences_1.getSettingsTargetName(configurationEditing_1.ConfigurationTarget.FOLDER, root, _this.workspaceContextService),
                    id: "" + index
                };
            });
            return this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickFolder', "Select Folder") })
                .then(function (pick) {
                if (pick) {
                    return _this.preferencesService.openFolderSettings(_this.workspaceContextService.getWorkspace().roots[parseInt(pick.id)]);
                }
                return undefined;
            });
        };
        OpenFolderSettingsAction.ID = 'workbench.action.openFolderSettings';
        OpenFolderSettingsAction.LABEL = nls.localize('openFolderSettings', "Open Folder Settings");
        OpenFolderSettingsAction = __decorate([
            __param(2, preferences_1.IPreferencesService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, quickOpen_1.IQuickOpenService)
        ], OpenFolderSettingsAction);
        return OpenFolderSettingsAction;
    }(actions_1.Action));
    exports.OpenFolderSettingsAction = OpenFolderSettingsAction;
    var ConfigureLanguageBasedSettingsAction = (function (_super) {
        __extends(ConfigureLanguageBasedSettingsAction, _super);
        function ConfigureLanguageBasedSettingsAction(id, label, modeService, quickOpenService, preferencesService) {
            var _this = _super.call(this, id, label) || this;
            _this.modeService = modeService;
            _this.quickOpenService = quickOpenService;
            _this.preferencesService = preferencesService;
            return _this;
        }
        ConfigureLanguageBasedSettingsAction.prototype.run = function () {
            var _this = this;
            var languages = this.modeService.getRegisteredLanguageNames();
            var picks = languages.sort().map(function (lang, index) {
                var description = nls.localize('languageDescriptionConfigured', "({0})", _this.modeService.getModeIdForLanguageName(lang.toLowerCase()));
                // construct a fake resource to be able to show nice icons if any
                var fakeResource;
                var extensions = _this.modeService.getExtensions(lang);
                if (extensions && extensions.length) {
                    fakeResource = uri_1.default.file(extensions[0]);
                }
                else {
                    var filenames = _this.modeService.getFilenames(lang);
                    if (filenames && filenames.length) {
                        fakeResource = uri_1.default.file(filenames[0]);
                    }
                }
                return {
                    label: lang,
                    resource: fakeResource,
                    description: description
                };
            });
            return this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickLanguage', "Select Language") })
                .then(function (pick) {
                if (pick) {
                    return _this.modeService.getOrCreateModeByLanguageName(pick.label)
                        .then(function (mode) { return _this.preferencesService.configureSettingsForLanguage(mode.getLanguageIdentifier().language); });
                }
                return undefined;
            });
        };
        ConfigureLanguageBasedSettingsAction.ID = 'workbench.action.configureLanguageBasedSettings';
        ConfigureLanguageBasedSettingsAction.LABEL = nls.localize('configureLanguageBasedSettings', "Configure Language Specific Settings...");
        ConfigureLanguageBasedSettingsAction = __decorate([
            __param(2, modeService_1.IModeService),
            __param(3, quickOpen_1.IQuickOpenService),
            __param(4, preferences_1.IPreferencesService)
        ], ConfigureLanguageBasedSettingsAction);
        return ConfigureLanguageBasedSettingsAction;
    }(actions_1.Action));
    exports.ConfigureLanguageBasedSettingsAction = ConfigureLanguageBasedSettingsAction;
});
//# sourceMappingURL=preferencesActions.js.map