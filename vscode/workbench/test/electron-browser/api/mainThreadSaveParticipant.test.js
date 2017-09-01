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
define(["require", "exports", "assert", "vs/workbench/api/electron-browser/mainThreadSaveParticipant", "vs/platform/configuration/test/common/testConfigurationService", "vs/workbench/test/workbenchTestServices", "vs/base/test/common/utils", "vs/editor/common/services/modelService", "vs/workbench/services/textfile/common/textFileEditorModel", "vs/workbench/services/textfile/common/textfiles"], function (require, exports, assert, mainThreadSaveParticipant_1, testConfigurationService_1, workbenchTestServices_1, utils_1, modelService_1, textFileEditorModel_1, textfiles_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ServiceAccessor = (function () {
        function ServiceAccessor(textFileService, modelService) {
            this.textFileService = textFileService;
            this.modelService = modelService;
        }
        ServiceAccessor = __decorate([
            __param(0, textfiles_1.ITextFileService), __param(1, modelService_1.IModelService)
        ], ServiceAccessor);
        return ServiceAccessor;
    }());
    suite('MainThreadSaveParticipant', function () {
        var instantiationService;
        var accessor;
        setup(function () {
            instantiationService = workbenchTestServices_1.workbenchInstantiationService();
            accessor = instantiationService.createInstance(ServiceAccessor);
        });
        teardown(function () {
            accessor.textFileService.models.clear();
            textFileEditorModel_1.TextFileEditorModel.setSaveParticipant(null); // reset any set participant
        });
        test('insert final new line', function (done) {
            var model = instantiationService.createInstance(textFileEditorModel_1.TextFileEditorModel, utils_1.toResource.call(this, '/path/final_new_line.txt'), 'utf8');
            model.load().then(function () {
                var configService = new testConfigurationService_1.TestConfigurationService();
                configService.setUserConfiguration('files', { 'insertFinalNewline': true });
                var participant = new mainThreadSaveParticipant_1.FinalNewLineParticipant(configService, undefined);
                // No new line for empty lines
                var lineContent = '';
                model.textEditorModel.setValue(lineContent);
                participant.participate(model, { reason: textfiles_1.SaveReason.EXPLICIT });
                assert.equal(model.getValue(), lineContent);
                // No new line if last line already empty
                lineContent = "Hello New Line" + model.textEditorModel.getEOL();
                model.textEditorModel.setValue(lineContent);
                participant.participate(model, { reason: textfiles_1.SaveReason.EXPLICIT });
                assert.equal(model.getValue(), lineContent);
                // New empty line added (single line)
                lineContent = 'Hello New Line';
                model.textEditorModel.setValue(lineContent);
                participant.participate(model, { reason: textfiles_1.SaveReason.EXPLICIT });
                assert.equal(model.getValue(), "" + lineContent + model.textEditorModel.getEOL());
                // New empty line added (multi line)
                lineContent = "Hello New Line" + model.textEditorModel.getEOL() + "Hello New Line" + model.textEditorModel.getEOL() + "Hello New Line";
                model.textEditorModel.setValue(lineContent);
                participant.participate(model, { reason: textfiles_1.SaveReason.EXPLICIT });
                assert.equal(model.getValue(), "" + lineContent + model.textEditorModel.getEOL());
                done();
            });
        });
    });
});
//# sourceMappingURL=mainThreadSaveParticipant.test.js.map