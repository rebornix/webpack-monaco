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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/network", "vs/platform/registry/common/platform", "vs/base/common/paths", "vs/workbench/common/editor", "vs/workbench/common/editor/resourceEditorInput", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/editor/common/editorService", "vs/platform/instantiation/common/instantiation", "vs/workbench/common/editor/diffEditorInput", "vs/platform/workspace/common/workspace", "vs/nls", "vs/base/common/labels", "vs/base/common/map", "vs/base/common/event", "vs/platform/environment/common/environment"], function (require, exports, winjs_base_1, uri_1, network, platform_1, paths_1, editor_1, resourceEditorInput_1, untitledEditorService_1, editorService_1, instantiation_1, diffEditorInput_1, workspace_1, nls, labels_1, map_1, event_1, environment_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkbenchEditorService = (function () {
        function WorkbenchEditorService(editorPart, untitledEditorService, workspaceContextService, instantiationService, environmentService) {
            this.untitledEditorService = untitledEditorService;
            this.workspaceContextService = workspaceContextService;
            this.instantiationService = instantiationService;
            this.environmentService = environmentService;
            this.editorPart = editorPart;
            this.fileInputFactory = platform_1.Registry.as(editor_1.Extensions.Editors).getFileInputFactory();
        }
        WorkbenchEditorService.prototype.getActiveEditor = function () {
            return this.editorPart.getActiveEditor();
        };
        WorkbenchEditorService.prototype.getActiveEditorInput = function () {
            return this.editorPart.getActiveEditorInput();
        };
        WorkbenchEditorService.prototype.getVisibleEditors = function () {
            return this.editorPart.getVisibleEditors();
        };
        WorkbenchEditorService.prototype.isVisible = function (input, includeSideBySide) {
            if (!input) {
                return false;
            }
            return this.getVisibleEditors().some(function (editor) {
                if (!editor.input) {
                    return false;
                }
                if (input.matches(editor.input)) {
                    return true;
                }
                if (includeSideBySide && editor.input instanceof editor_1.SideBySideEditorInput) {
                    var sideBySideInput = editor.input;
                    return input.matches(sideBySideInput.master) || input.matches(sideBySideInput.details);
                }
                return false;
            });
        };
        WorkbenchEditorService.prototype.openEditor = function (input, arg2, arg3) {
            if (!input) {
                return winjs_base_1.TPromise.as(null);
            }
            // Workbench Input Support
            if (input instanceof editor_1.EditorInput) {
                return this.doOpenEditor(input, this.toOptions(arg2), arg3);
            }
            // Support opening foreign resources (such as a http link that points outside of the workbench)
            var resourceInput = input;
            if (resourceInput.resource instanceof uri_1.default) {
                var schema = resourceInput.resource.scheme;
                if (schema === network.Schemas.http || schema === network.Schemas.https) {
                    window.open(resourceInput.resource.toString(true));
                    return winjs_base_1.TPromise.as(null);
                }
            }
            // Untyped Text Editor Support (required for code that uses this service below workbench level)
            var textInput = input;
            var typedInput = this.createInput(textInput);
            if (typedInput) {
                return this.doOpenEditor(typedInput, editor_1.TextEditorOptions.from(textInput), arg2);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WorkbenchEditorService.prototype.toOptions = function (options) {
            if (!options || options instanceof editor_1.EditorOptions) {
                return options;
            }
            var textOptions = options;
            if (!!textOptions.selection) {
                return editor_1.TextEditorOptions.create(options);
            }
            return editor_1.EditorOptions.create(options);
        };
        WorkbenchEditorService.prototype.doOpenEditor = function (input, options, arg3) {
            return this.editorPart.openEditor(input, options, arg3);
        };
        WorkbenchEditorService.prototype.openEditors = function (editors) {
            var _this = this;
            var inputs = editors.map(function (editor) { return _this.createInput(editor.input); });
            var typedInputs = inputs.map(function (input, index) {
                var options = editors[index].input instanceof editor_1.EditorInput ? _this.toOptions(editors[index].options) : editor_1.TextEditorOptions.from(editors[index].input);
                return {
                    input: input,
                    options: options,
                    position: editors[index].position
                };
            });
            return this.editorPart.openEditors(typedInputs);
        };
        WorkbenchEditorService.prototype.replaceEditors = function (editors, position) {
            var _this = this;
            var toReplaceInputs = editors.map(function (editor) { return _this.createInput(editor.toReplace); });
            var replaceWithInputs = editors.map(function (editor) { return _this.createInput(editor.replaceWith); });
            var typedReplacements = editors.map(function (editor, index) {
                var options = editor.toReplace instanceof editor_1.EditorInput ? _this.toOptions(editor.options) : editor_1.TextEditorOptions.from(editor.replaceWith);
                return {
                    toReplace: toReplaceInputs[index],
                    replaceWith: replaceWithInputs[index],
                    options: options
                };
            });
            return this.editorPart.replaceEditors(typedReplacements, position);
        };
        WorkbenchEditorService.prototype.closeEditor = function (position, input) {
            return this.doCloseEditor(position, input);
        };
        WorkbenchEditorService.prototype.doCloseEditor = function (position, input) {
            return this.editorPart.closeEditor(position, input);
        };
        WorkbenchEditorService.prototype.closeEditors = function (position, filter) {
            return this.editorPart.closeEditors(position, filter);
        };
        WorkbenchEditorService.prototype.closeAllEditors = function (except) {
            return this.editorPart.closeAllEditors(except);
        };
        WorkbenchEditorService.prototype.createInput = function (input) {
            // Workbench Input Support
            if (input instanceof editor_1.EditorInput) {
                return input;
            }
            // Side by Side Support
            var resourceSideBySideInput = input;
            if (resourceSideBySideInput.masterResource && resourceSideBySideInput.detailResource) {
                var masterInput = this.createInput({ resource: resourceSideBySideInput.masterResource });
                var detailInput = this.createInput({ resource: resourceSideBySideInput.detailResource });
                return new editor_1.SideBySideEditorInput(resourceSideBySideInput.label || masterInput.getName(), typeof resourceSideBySideInput.description === 'string' ? resourceSideBySideInput.description : masterInput.getDescription(), detailInput, masterInput);
            }
            // Diff Editor Support
            var resourceDiffInput = input;
            if (resourceDiffInput.leftResource && resourceDiffInput.rightResource) {
                var leftInput = this.createInput({ resource: resourceDiffInput.leftResource });
                var rightInput = this.createInput({ resource: resourceDiffInput.rightResource });
                var label = resourceDiffInput.label || this.toDiffLabel(resourceDiffInput.leftResource, resourceDiffInput.rightResource, this.workspaceContextService, this.environmentService);
                return new diffEditorInput_1.DiffEditorInput(label, resourceDiffInput.description, leftInput, rightInput);
            }
            // Untitled file support
            var untitledInput = input;
            if (!untitledInput.resource || typeof untitledInput.filePath === 'string' || (untitledInput.resource instanceof uri_1.default && untitledInput.resource.scheme === untitledEditorService_1.UNTITLED_SCHEMA)) {
                return this.untitledEditorService.createOrGet(untitledInput.filePath ? uri_1.default.file(untitledInput.filePath) : untitledInput.resource, untitledInput.language, untitledInput.contents, untitledInput.encoding);
            }
            var resourceInput = input;
            // Files support
            if (resourceInput.resource instanceof uri_1.default && resourceInput.resource.scheme === network.Schemas.file) {
                return this.createOrGet(resourceInput.resource, this.instantiationService, resourceInput.label, resourceInput.description, resourceInput.encoding);
            }
            else if (resourceInput.resource instanceof uri_1.default) {
                var label = resourceInput.label || paths_1.basename(resourceInput.resource.fsPath);
                var description = void 0;
                if (typeof resourceInput.description === 'string') {
                    description = resourceInput.description;
                }
                else if (resourceInput.resource.scheme === network.Schemas.file) {
                    description = paths_1.dirname(resourceInput.resource.fsPath);
                }
                return this.createOrGet(resourceInput.resource, this.instantiationService, label, description);
            }
            return null;
        };
        WorkbenchEditorService.prototype.createOrGet = function (resource, instantiationService, label, description, encoding) {
            if (WorkbenchEditorService.CACHE.has(resource)) {
                var input_1 = WorkbenchEditorService.CACHE.get(resource);
                if (input_1 instanceof resourceEditorInput_1.ResourceEditorInput) {
                    input_1.setName(label);
                    input_1.setDescription(description);
                }
                else {
                    input_1.setPreferredEncoding(encoding);
                }
                return input_1;
            }
            var input;
            if (resource.scheme === network.Schemas.file) {
                input = this.fileInputFactory.createFileInput(resource, encoding, instantiationService);
            }
            else {
                input = instantiationService.createInstance(resourceEditorInput_1.ResourceEditorInput, label, description, resource);
            }
            WorkbenchEditorService.CACHE.set(resource, input);
            event_1.once(input.onDispose)(function () {
                WorkbenchEditorService.CACHE.delete(resource);
            });
            return input;
        };
        WorkbenchEditorService.prototype.toDiffLabel = function (res1, res2, context, environment) {
            var leftName = labels_1.getPathLabel(res1.fsPath, context, environment);
            var rightName = labels_1.getPathLabel(res2.fsPath, context, environment);
            return nls.localize('compareLabels', "{0} ↔ {1}", leftName, rightName);
        };
        WorkbenchEditorService.CACHE = new map_1.ResourceMap();
        WorkbenchEditorService = __decorate([
            __param(1, untitledEditorService_1.IUntitledEditorService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, environment_1.IEnvironmentService)
        ], WorkbenchEditorService);
        return WorkbenchEditorService;
    }());
    exports.WorkbenchEditorService = WorkbenchEditorService;
    /**
     * Subclass of workbench editor service that delegates all calls to the provided editor service. Subclasses can choose to override the behavior
     * of openEditor() and closeEditor() by providing a handler.
     *
     * This gives clients a chance to override the behavior of openEditor() and closeEditor().
     */
    var DelegatingWorkbenchEditorService = (function (_super) {
        __extends(DelegatingWorkbenchEditorService, _super);
        function DelegatingWorkbenchEditorService(untitledEditorService, instantiationService, workspaceContextService, editorService, environmentService) {
            return _super.call(this, editorService, untitledEditorService, workspaceContextService, instantiationService, environmentService) || this;
        }
        DelegatingWorkbenchEditorService.prototype.setEditorOpenHandler = function (handler) {
            this.editorOpenHandler = handler;
        };
        DelegatingWorkbenchEditorService.prototype.setEditorCloseHandler = function (handler) {
            this.editorCloseHandler = handler;
        };
        DelegatingWorkbenchEditorService.prototype.doOpenEditor = function (input, options, arg3) {
            var _this = this;
            var handleOpen = this.editorOpenHandler ? this.editorOpenHandler(input, options, arg3) : winjs_base_1.TPromise.as(void 0);
            return handleOpen.then(function (editor) {
                if (editor) {
                    return winjs_base_1.TPromise.as(editor);
                }
                return _super.prototype.doOpenEditor.call(_this, input, options, arg3);
            });
        };
        DelegatingWorkbenchEditorService.prototype.doCloseEditor = function (position, input) {
            var _this = this;
            var handleClose = this.editorCloseHandler ? this.editorCloseHandler(position, input) : winjs_base_1.TPromise.as(void 0);
            return handleClose.then(function () {
                return _super.prototype.doCloseEditor.call(_this, position, input);
            });
        };
        DelegatingWorkbenchEditorService = __decorate([
            __param(0, untitledEditorService_1.IUntitledEditorService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, environment_1.IEnvironmentService)
        ], DelegatingWorkbenchEditorService);
        return DelegatingWorkbenchEditorService;
    }(WorkbenchEditorService));
    exports.DelegatingWorkbenchEditorService = DelegatingWorkbenchEditorService;
});
//# sourceMappingURL=editorService.js.map