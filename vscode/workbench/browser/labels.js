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
define(["require", "exports", "vs/base/common/paths", "vs/base/browser/ui/iconLabel/iconLabel", "vs/platform/extensions/common/extensions", "vs/editor/common/services/modeService", "vs/workbench/common/editor", "vs/base/common/labels", "vs/editor/common/modes/modesRegistry", "vs/platform/workspace/common/workspace", "vs/platform/configuration/common/configuration", "vs/base/common/lifecycle", "vs/editor/common/services/modelService", "vs/platform/environment/common/environment", "vs/workbench/services/untitled/common/untitledEditorService", "vs/base/common/network", "vs/platform/files/common/files"], function (require, exports, paths, iconLabel_1, extensions_1, modeService_1, editor_1, labels_1, modesRegistry_1, workspace_1, configuration_1, lifecycle_1, modelService_1, environment_1, untitledEditorService_1, network_1, files_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResourceLabel = (function (_super) {
        __extends(ResourceLabel, _super);
        function ResourceLabel(container, options, extensionService, contextService, configurationService, modeService, modelService, environmentService) {
            var _this = _super.call(this, container, options) || this;
            _this.extensionService = extensionService;
            _this.contextService = contextService;
            _this.configurationService = configurationService;
            _this.modeService = modeService;
            _this.modelService = modelService;
            _this.environmentService = environmentService;
            _this.toDispose = [];
            _this.registerListeners();
            return _this;
        }
        ResourceLabel.prototype.registerListeners = function () {
            var _this = this;
            this.extensionService.onReady().then(function () { return _this.render(true /* clear cache */); }); // update when extensions are loaded with potentially new languages
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function () { return _this.render(true /* clear cache */); })); // update when file.associations change
        };
        ResourceLabel.prototype.setLabel = function (label, options) {
            var hasResourceChanged = this.hasResourceChanged(label, options);
            this.label = label;
            this.options = options;
            this.render(hasResourceChanged);
        };
        ResourceLabel.prototype.hasResourceChanged = function (label, options) {
            var newResource = label ? label.resource : void 0;
            var oldResource = this.label ? this.label.resource : void 0;
            var newFileKind = options ? options.fileKind : void 0;
            var oldFileKind = this.options ? this.options.fileKind : void 0;
            if (newFileKind !== oldFileKind) {
                return true; // same resource but different kind (file, folder)
            }
            if (newResource && oldResource) {
                return newResource.toString() !== oldResource.toString();
            }
            if (!newResource && !oldResource) {
                return false;
            }
            return true;
        };
        ResourceLabel.prototype.clear = function () {
            this.label = void 0;
            this.options = void 0;
            this.lastKnownConfiguredLangId = void 0;
            this.computedIconClasses = void 0;
            this.setValue();
        };
        ResourceLabel.prototype.render = function (clearIconCache) {
            if (this.label) {
                var configuredLangId = getConfiguredLangId(this.modelService, this.label.resource);
                if (this.lastKnownConfiguredLangId !== configuredLangId) {
                    clearIconCache = true;
                    this.lastKnownConfiguredLangId = configuredLangId;
                }
            }
            if (clearIconCache) {
                this.computedIconClasses = void 0;
            }
            if (!this.label) {
                return;
            }
            var resource = this.label.resource;
            var title = '';
            if (this.options && typeof this.options.title === 'string') {
                title = this.options.title;
            }
            else if (resource) {
                title = labels_1.getPathLabel(resource.fsPath, void 0, this.environmentService);
            }
            if (!this.computedIconClasses) {
                this.computedIconClasses = getIconClasses(this.modelService, this.modeService, resource, this.options && this.options.fileKind);
            }
            var extraClasses = this.computedIconClasses.slice(0);
            if (this.options && this.options.extraClasses) {
                extraClasses.push.apply(extraClasses, this.options.extraClasses);
            }
            var italic = this.options && this.options.italic;
            var matches = this.options && this.options.matches;
            this.setValue(this.label.name, this.label.description, { title: title, extraClasses: extraClasses, italic: italic, matches: matches });
        };
        ResourceLabel.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            this.label = void 0;
            this.options = void 0;
            this.lastKnownConfiguredLangId = void 0;
            this.computedIconClasses = void 0;
        };
        ResourceLabel = __decorate([
            __param(2, extensions_1.IExtensionService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, modeService_1.IModeService),
            __param(6, modelService_1.IModelService),
            __param(7, environment_1.IEnvironmentService)
        ], ResourceLabel);
        return ResourceLabel;
    }(iconLabel_1.IconLabel));
    exports.ResourceLabel = ResourceLabel;
    var EditorLabel = (function (_super) {
        __extends(EditorLabel, _super);
        function EditorLabel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EditorLabel.prototype.setEditor = function (editor, options) {
            this.setLabel({
                resource: editor_1.toResource(editor, { supportSideBySide: true }),
                name: editor.getName(),
                description: editor.getDescription()
            }, options);
        };
        return EditorLabel;
    }(ResourceLabel));
    exports.EditorLabel = EditorLabel;
    var FileLabel = (function (_super) {
        __extends(FileLabel, _super);
        function FileLabel(container, options, extensionService, contextService, configurationService, modeService, modelService, environmentService, untitledEditorService) {
            var _this = _super.call(this, container, options, extensionService, contextService, configurationService, modeService, modelService, environmentService) || this;
            _this.untitledEditorService = untitledEditorService;
            return _this;
        }
        FileLabel.prototype.setFile = function (resource, options) {
            if (options === void 0) { options = Object.create(null); }
            var hidePath = options.hidePath || (resource.scheme === network_1.Schemas.untitled && !this.untitledEditorService.hasAssociatedFilePath(resource));
            var rootProvider = options.root ? {
                getRoot: function () { return options.root; },
                getWorkspace: function () { return { roots: [options.root] }; },
            } : this.contextService;
            this.setLabel({
                resource: resource,
                name: !options.hideLabel ? paths.basename(resource.fsPath) : void 0,
                description: !hidePath ? labels_1.getPathLabel(paths.dirname(resource.fsPath), rootProvider, this.environmentService) : void 0
            }, options);
        };
        FileLabel = __decorate([
            __param(2, extensions_1.IExtensionService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, modeService_1.IModeService),
            __param(6, modelService_1.IModelService),
            __param(7, environment_1.IEnvironmentService),
            __param(8, untitledEditorService_1.IUntitledEditorService)
        ], FileLabel);
        return FileLabel;
    }(ResourceLabel));
    exports.FileLabel = FileLabel;
    function getIconClasses(modelService, modeService, resource, fileKind) {
        // we always set these base classes even if we do not have a path
        var classes = fileKind === files_1.FileKind.ROOT_FOLDER ? ['rootfolder-icon'] : fileKind === files_1.FileKind.FOLDER ? ['folder-icon'] : ['file-icon'];
        var path;
        if (resource) {
            path = resource.fsPath;
        }
        if (path) {
            var basename = cssEscape(paths.basename(path).toLowerCase());
            // Folders
            if (fileKind === files_1.FileKind.FOLDER) {
                classes.push(basename + "-name-folder-icon");
            }
            else {
                // Name
                classes.push(basename + "-name-file-icon");
                // Extension(s)
                var dotSegments = basename.split('.');
                for (var i = 1; i < dotSegments.length; i++) {
                    classes.push(dotSegments.slice(i).join('.') + "-ext-file-icon"); // add each combination of all found extensions if more than one
                }
                // Configured Language
                var configuredLangId = getConfiguredLangId(modelService, resource);
                configuredLangId = configuredLangId || modeService.getModeIdByFilenameOrFirstLine(path);
                if (configuredLangId) {
                    classes.push(cssEscape(configuredLangId) + "-lang-file-icon");
                }
            }
        }
        return classes;
    }
    exports.getIconClasses = getIconClasses;
    function getConfiguredLangId(modelService, resource) {
        var configuredLangId;
        if (resource) {
            var model = modelService.getModel(resource);
            if (model) {
                var modeId = model.getLanguageIdentifier().language;
                if (modeId && modeId !== modesRegistry_1.PLAINTEXT_MODE_ID) {
                    configuredLangId = modeId; // only take if the mode is specific (aka no just plain text)
                }
            }
        }
        return configuredLangId;
    }
    function cssEscape(val) {
        return val.replace(/\s/g, '\\$&'); // make sure to not introduce CSS classes from files that contain whitespace
    }
});
//# sourceMappingURL=labels.js.map