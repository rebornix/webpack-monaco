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
define(["require", "exports", "assert", "vs/workbench/common/editor", "vs/workbench/common/editor/textEditorModel", "vs/workbench/common/editor/textDiffEditorModel", "vs/workbench/common/editor/diffEditorInput", "vs/editor/common/services/modelService", "vs/editor/common/services/modeService", "vs/workbench/common/editor/resourceEditorInput", "vs/base/common/uri", "vs/editor/common/services/resolverService", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/test/workbenchTestServices", "vs/base/common/winjs.base"], function (require, exports, assert, editor_1, textEditorModel_1, textDiffEditorModel_1, diffEditorInput_1, modelService_1, modeService_1, resourceEditorInput_1, uri_1, resolverService_1, textfiles_1, workbenchTestServices_1, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MyEditorModel = (function (_super) {
        __extends(MyEditorModel, _super);
        function MyEditorModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MyEditorModel;
    }(editor_1.EditorModel));
    var MyTextEditorModel = (function (_super) {
        __extends(MyTextEditorModel, _super);
        function MyTextEditorModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return MyTextEditorModel;
    }(textEditorModel_1.BaseTextEditorModel));
    var ServiceAccessor = (function () {
        function ServiceAccessor(textModelResolverService, modelService, modeService, textFileService) {
            this.textModelResolverService = textModelResolverService;
            this.modelService = modelService;
            this.modeService = modeService;
            this.textFileService = textFileService;
        }
        ServiceAccessor = __decorate([
            __param(0, resolverService_1.ITextModelService),
            __param(1, modelService_1.IModelService),
            __param(2, modeService_1.IModeService),
            __param(3, textfiles_1.ITextFileService)
        ], ServiceAccessor);
        return ServiceAccessor;
    }());
    suite('Workbench - EditorModel', function () {
        var instantiationService;
        var accessor;
        setup(function () {
            instantiationService = workbenchTestServices_1.workbenchInstantiationService();
            accessor = instantiationService.createInstance(ServiceAccessor);
        });
        test('TextDiffEditorModel', function (done) {
            var dispose = accessor.textModelResolverService.registerTextModelContentProvider('test', {
                provideTextContent: function (resource) {
                    if (resource.scheme === 'test') {
                        var modelContent = 'Hello Test';
                        var mode = accessor.modeService.getOrCreateMode('json');
                        return winjs_base_1.TPromise.as(accessor.modelService.createModel(modelContent, mode, resource));
                    }
                    return winjs_base_1.TPromise.as(null);
                }
            });
            var input = instantiationService.createInstance(resourceEditorInput_1.ResourceEditorInput, 'name', 'description', uri_1.default.from({ scheme: 'test', authority: null, path: 'thePath' }));
            var otherInput = instantiationService.createInstance(resourceEditorInput_1.ResourceEditorInput, 'name2', 'description', uri_1.default.from({ scheme: 'test', authority: null, path: 'thePath' }));
            var diffInput = new diffEditorInput_1.DiffEditorInput('name', 'description', input, otherInput);
            diffInput.resolve(true).then(function (model) {
                assert(model);
                assert(model instanceof textDiffEditorModel_1.TextDiffEditorModel);
                var diffEditorModel = model.textDiffEditorModel;
                assert(diffEditorModel.original);
                assert(diffEditorModel.modified);
                return diffInput.resolve(true).then(function (model) {
                    assert(model.isResolved());
                    assert(diffEditorModel !== model.textDiffEditorModel);
                    diffInput.dispose();
                    assert(!model.textDiffEditorModel);
                    dispose.dispose();
                });
            }).done(function () {
                done();
            });
        });
    });
});
//# sourceMappingURL=editorDiffModel.test.js.map