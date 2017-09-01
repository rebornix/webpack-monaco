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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/mime", "vs/base/common/labels", "vs/editor/common/modes/modesRegistry", "vs/base/common/paths", "vs/workbench/common/editor", "vs/workbench/common/editor/untitledEditorModel", "vs/platform/instantiation/common/instantiation", "vs/platform/workspace/common/workspace", "vs/base/common/lifecycle", "vs/base/common/event", "vs/workbench/services/textfile/common/textfiles", "vs/platform/telemetry/common/telemetryUtils", "vs/platform/environment/common/environment"], function (require, exports, winjs_base_1, mime_1, labels, modesRegistry_1, paths, editor_1, untitledEditorModel_1, instantiation_1, workspace_1, lifecycle_1, event_1, textfiles_1, telemetryUtils_1, environment_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An editor input to be used for untitled text buffers.
     */
    var UntitledEditorInput = (function (_super) {
        __extends(UntitledEditorInput, _super);
        function UntitledEditorInput(resource, hasAssociatedFilePath, modeId, initialValue, preferredEncoding, instantiationService, contextService, textFileService, environmentService) {
            var _this = _super.call(this) || this;
            _this.resource = resource;
            _this.modeId = modeId;
            _this.initialValue = initialValue;
            _this.preferredEncoding = preferredEncoding;
            _this.instantiationService = instantiationService;
            _this.contextService = contextService;
            _this.textFileService = textFileService;
            _this.environmentService = environmentService;
            _this._hasAssociatedFilePath = hasAssociatedFilePath;
            _this.toUnbind = [];
            _this._onDidModelChangeContent = new event_1.Emitter();
            _this._onDidModelChangeEncoding = new event_1.Emitter();
            return _this;
        }
        Object.defineProperty(UntitledEditorInput.prototype, "hasAssociatedFilePath", {
            get: function () {
                return this._hasAssociatedFilePath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UntitledEditorInput.prototype, "onDidModelChangeContent", {
            get: function () {
                return this._onDidModelChangeContent.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UntitledEditorInput.prototype, "onDidModelChangeEncoding", {
            get: function () {
                return this._onDidModelChangeEncoding.event;
            },
            enumerable: true,
            configurable: true
        });
        UntitledEditorInput.prototype.getTypeId = function () {
            return UntitledEditorInput.ID;
        };
        UntitledEditorInput.prototype.getResource = function () {
            return this.resource;
        };
        UntitledEditorInput.prototype.getModeId = function () {
            if (this.cachedModel) {
                return this.cachedModel.getModeId();
            }
            return this.modeId;
        };
        UntitledEditorInput.prototype.getName = function () {
            return this.hasAssociatedFilePath ? paths.basename(this.resource.fsPath) : this.resource.fsPath;
        };
        UntitledEditorInput.prototype.getDescription = function () {
            return this.hasAssociatedFilePath ? labels.getPathLabel(paths.dirname(this.resource.fsPath), this.contextService, this.environmentService) : null;
        };
        UntitledEditorInput.prototype.isDirty = function () {
            if (this.cachedModel) {
                return this.cachedModel.isDirty();
            }
            // A disposed input is never dirty, even if it was restored from backup
            if (this.isDisposed()) {
                return false;
            }
            // untitled files with an associated path or associated resource
            return this.hasAssociatedFilePath;
        };
        UntitledEditorInput.prototype.confirmSave = function () {
            return this.textFileService.confirmSave([this.resource]);
        };
        UntitledEditorInput.prototype.save = function () {
            return this.textFileService.save(this.resource);
        };
        UntitledEditorInput.prototype.revert = function () {
            if (this.cachedModel) {
                this.cachedModel.revert();
            }
            this.dispose(); // a reverted untitled editor is no longer valid, so we dispose it
            return winjs_base_1.TPromise.as(true);
        };
        UntitledEditorInput.prototype.suggestFileName = function () {
            if (!this.hasAssociatedFilePath) {
                if (this.cachedModel) {
                    var modeId = this.cachedModel.getModeId();
                    if (modeId !== modesRegistry_1.PLAINTEXT_MODE_ID) {
                        return mime_1.suggestFilename(modeId, this.getName());
                    }
                }
            }
            return this.getName();
        };
        UntitledEditorInput.prototype.getEncoding = function () {
            if (this.cachedModel) {
                return this.cachedModel.getEncoding();
            }
            return this.preferredEncoding;
        };
        UntitledEditorInput.prototype.setEncoding = function (encoding, mode /* ignored, we only have Encode */) {
            this.preferredEncoding = encoding;
            if (this.cachedModel) {
                this.cachedModel.setEncoding(encoding);
            }
        };
        UntitledEditorInput.prototype.resolve = function () {
            // Join a model resolve if we have had one before
            if (this.modelResolve) {
                return this.modelResolve;
            }
            // Otherwise Create Model and load
            this.cachedModel = this.createModel();
            this.modelResolve = this.cachedModel.load();
            return this.modelResolve;
        };
        UntitledEditorInput.prototype.createModel = function () {
            var _this = this;
            var model = this.instantiationService.createInstance(untitledEditorModel_1.UntitledEditorModel, this.modeId, this.resource, this.hasAssociatedFilePath, this.initialValue, this.preferredEncoding);
            // re-emit some events from the model
            this.toUnbind.push(model.onDidChangeContent(function () { return _this._onDidModelChangeContent.fire(); }));
            this.toUnbind.push(model.onDidChangeDirty(function () { return _this._onDidChangeDirty.fire(); }));
            this.toUnbind.push(model.onDidChangeEncoding(function () { return _this._onDidModelChangeEncoding.fire(); }));
            return model;
        };
        UntitledEditorInput.prototype.getTelemetryDescriptor = function () {
            var descriptor = _super.prototype.getTelemetryDescriptor.call(this);
            descriptor['resource'] = telemetryUtils_1.telemetryURIDescriptor(this.getResource());
            return descriptor;
        };
        UntitledEditorInput.prototype.matches = function (otherInput) {
            if (_super.prototype.matches.call(this, otherInput) === true) {
                return true;
            }
            if (otherInput instanceof UntitledEditorInput) {
                var otherUntitledEditorInput = otherInput;
                // Otherwise compare by properties
                return otherUntitledEditorInput.resource.toString() === this.resource.toString();
            }
            return false;
        };
        UntitledEditorInput.prototype.dispose = function () {
            this._onDidModelChangeContent.dispose();
            this._onDidModelChangeEncoding.dispose();
            // Listeners
            lifecycle_1.dispose(this.toUnbind);
            // Model
            if (this.cachedModel) {
                this.cachedModel.dispose();
                this.cachedModel = null;
            }
            this.modelResolve = void 0;
            _super.prototype.dispose.call(this);
        };
        UntitledEditorInput.ID = 'workbench.editors.untitledEditorInput';
        UntitledEditorInput = __decorate([
            __param(5, instantiation_1.IInstantiationService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, textfiles_1.ITextFileService),
            __param(8, environment_1.IEnvironmentService)
        ], UntitledEditorInput);
        return UntitledEditorInput;
    }(editor_1.EditorInput));
    exports.UntitledEditorInput = UntitledEditorInput;
});
//# sourceMappingURL=untitledEditorInput.js.map