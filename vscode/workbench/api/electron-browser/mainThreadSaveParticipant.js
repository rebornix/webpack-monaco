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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/async", "vs/base/common/strings", "vs/editor/common/services/codeEditorService", "vs/workbench/services/textfile/common/textfiles", "vs/platform/instantiation/common/instantiation", "vs/platform/telemetry/common/telemetry", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/editor/common/core/position", "vs/editor/common/commands/trimTrailingWhitespaceCommand", "vs/editor/contrib/format/common/format", "vs/editor/contrib/format/common/formatCommand", "vs/platform/configuration/common/configuration", "vs/workbench/services/textfile/common/textFileEditorModel", "../node/extHost.protocol", "vs/editor/common/core/editOperation", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, winjs_base_1, async_1, strings, codeEditorService_1, textfiles_1, instantiation_1, telemetry_1, range_1, selection_1, position_1, trimTrailingWhitespaceCommand_1, format_1, formatCommand_1, configuration_1, textFileEditorModel_1, extHost_protocol_1, editOperation_1, extHostCustomers_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrimWhitespaceParticipant = (function () {
        function TrimWhitespaceParticipant(configurationService, codeEditorService) {
            this.configurationService = configurationService;
            this.codeEditorService = codeEditorService;
            this.name = 'TrimWhitespaceParticipant';
            // Nothing
        }
        TrimWhitespaceParticipant.prototype.participate = function (model, env) {
            if (this.configurationService.lookup('files.trimTrailingWhitespace', { overrideIdentifier: model.textEditorModel.getLanguageIdentifier().language, resource: model.getResource() }).value) {
                this.doTrimTrailingWhitespace(model.textEditorModel, env.reason === textfiles_1.SaveReason.AUTO);
            }
        };
        TrimWhitespaceParticipant.prototype.doTrimTrailingWhitespace = function (model, isAutoSaved) {
            var prevSelection = [new selection_1.Selection(1, 1, 1, 1)];
            var cursors = [];
            var editor = findEditor(model, this.codeEditorService);
            if (editor) {
                // Find `prevSelection` in any case do ensure a good undo stack when pushing the edit
                // Collect active cursors in `cursors` only if `isAutoSaved` to avoid having the cursors jump
                prevSelection = editor.getSelections();
                if (isAutoSaved) {
                    cursors.push.apply(cursors, prevSelection.map(function (s) { return new position_1.Position(s.positionLineNumber, s.positionColumn); }));
                }
            }
            var ops = trimTrailingWhitespaceCommand_1.trimTrailingWhitespace(model, cursors);
            if (!ops.length) {
                return; // Nothing to do
            }
            model.pushEditOperations(prevSelection, ops, function (edits) { return prevSelection; });
        };
        TrimWhitespaceParticipant = __decorate([
            __param(0, configuration_1.IConfigurationService),
            __param(1, codeEditorService_1.ICodeEditorService)
        ], TrimWhitespaceParticipant);
        return TrimWhitespaceParticipant;
    }());
    function findEditor(model, codeEditorService) {
        var candidate = null;
        if (model.isAttachedToEditor()) {
            for (var _i = 0, _a = codeEditorService.listCodeEditors(); _i < _a.length; _i++) {
                var editor = _a[_i];
                if (editor.getModel() === model) {
                    if (editor.isFocused()) {
                        return editor; // favour focused editor if there are multiple
                    }
                    candidate = editor;
                }
            }
        }
        return candidate;
    }
    var FinalNewLineParticipant = (function () {
        function FinalNewLineParticipant(configurationService, codeEditorService) {
            this.configurationService = configurationService;
            this.codeEditorService = codeEditorService;
            this.name = 'FinalNewLineParticipant';
            // Nothing
        }
        FinalNewLineParticipant.prototype.participate = function (model, env) {
            if (this.configurationService.lookup('files.insertFinalNewline', { overrideIdentifier: model.textEditorModel.getLanguageIdentifier().language, resource: model.getResource() }).value) {
                this.doInsertFinalNewLine(model.textEditorModel);
            }
        };
        FinalNewLineParticipant.prototype.doInsertFinalNewLine = function (model) {
            var lineCount = model.getLineCount();
            var lastLine = model.getLineContent(lineCount);
            var lastLineIsEmptyOrWhitespace = strings.lastNonWhitespaceIndex(lastLine) === -1;
            if (!lineCount || lastLineIsEmptyOrWhitespace) {
                return;
            }
            var prevSelection = [new selection_1.Selection(1, 1, 1, 1)];
            var editor = findEditor(model, this.codeEditorService);
            if (editor) {
                prevSelection = editor.getSelections();
            }
            model.pushEditOperations(prevSelection, [editOperation_1.EditOperation.insert(new position_1.Position(lineCount, model.getLineMaxColumn(lineCount)), model.getEOL())], function (edits) { return prevSelection; });
            if (editor) {
                editor.setSelections(prevSelection);
            }
        };
        FinalNewLineParticipant = __decorate([
            __param(0, configuration_1.IConfigurationService),
            __param(1, codeEditorService_1.ICodeEditorService)
        ], FinalNewLineParticipant);
        return FinalNewLineParticipant;
    }());
    exports.FinalNewLineParticipant = FinalNewLineParticipant;
    var FormatOnSaveParticipant = (function () {
        function FormatOnSaveParticipant(_editorService, _configurationService) {
            this._editorService = _editorService;
            this._configurationService = _configurationService;
            this.name = 'FormatOnSaveParticipant';
            // Nothing
        }
        FormatOnSaveParticipant.prototype.participate = function (editorModel, env) {
            var _this = this;
            var model = editorModel.textEditorModel;
            if (env.reason === textfiles_1.SaveReason.AUTO
                || !this._configurationService.lookup('editor.formatOnSave', { overrideIdentifier: model.getLanguageIdentifier().language, resource: editorModel.getResource() }).value) {
                return undefined;
            }
            var versionNow = model.getVersionId();
            var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
            return new winjs_base_1.TPromise(function (resolve, reject) {
                setTimeout(reject, 750);
                format_1.getDocumentFormattingEdits(model, { tabSize: tabSize, insertSpaces: insertSpaces }).then(resolve, reject);
            }).then(function (edits) {
                if (edits && versionNow === model.getVersionId()) {
                    var editor = findEditor(model, _this._editorService);
                    if (editor) {
                        _this._editsWithEditor(editor, edits);
                    }
                    else {
                        _this._editWithModel(model, edits);
                    }
                }
            });
        };
        FormatOnSaveParticipant.prototype._editsWithEditor = function (editor, edits) {
            formatCommand_1.EditOperationsCommand.execute(editor, edits);
        };
        FormatOnSaveParticipant.prototype._editWithModel = function (model, edits) {
            var range = edits[0].range;
            var initialSelection = new selection_1.Selection(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn);
            model.pushEditOperations([initialSelection], edits.map(FormatOnSaveParticipant._asIdentEdit), function (undoEdits) {
                for (var _i = 0, undoEdits_1 = undoEdits; _i < undoEdits_1.length; _i++) {
                    var range_2 = undoEdits_1[_i].range;
                    if (range_1.Range.areIntersectingOrTouching(range_2, initialSelection)) {
                        return [new selection_1.Selection(range_2.startLineNumber, range_2.startColumn, range_2.endLineNumber, range_2.endColumn)];
                    }
                }
                return undefined;
            });
        };
        FormatOnSaveParticipant._asIdentEdit = function (_a) {
            var text = _a.text, range = _a.range;
            return {
                text: text,
                range: range_1.Range.lift(range),
                identifier: undefined,
                forceMoveMarkers: true
            };
        };
        FormatOnSaveParticipant = __decorate([
            __param(0, codeEditorService_1.ICodeEditorService),
            __param(1, configuration_1.IConfigurationService)
        ], FormatOnSaveParticipant);
        return FormatOnSaveParticipant;
    }());
    var ExtHostSaveParticipant = (function () {
        function ExtHostSaveParticipant(extHostContext) {
            this.name = 'ExtHostSaveParticipant';
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostDocumentSaveParticipant);
        }
        ExtHostSaveParticipant.prototype.participate = function (editorModel, env) {
            var _this = this;
            return new winjs_base_1.TPromise(function (resolve, reject) {
                setTimeout(reject, 1750);
                _this._proxy.$participateInSave(editorModel.getResource(), env.reason).then(function (values) {
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var success = values_1[_i];
                        if (!success) {
                            return winjs_base_1.TPromise.wrapError(new Error('listener failed'));
                        }
                    }
                    return undefined;
                }).then(resolve, reject);
            });
        };
        return ExtHostSaveParticipant;
    }());
    // The save participant can change a model before its saved to support various scenarios like trimming trailing whitespace
    var SaveParticipant = (function () {
        function SaveParticipant(extHostContext, _telemetryService, instantiationService, configurationService, codeEditorService) {
            this._telemetryService = _telemetryService;
            this._saveParticipants = [
                new TrimWhitespaceParticipant(configurationService, codeEditorService),
                new FormatOnSaveParticipant(codeEditorService, configurationService),
                new FinalNewLineParticipant(configurationService, codeEditorService),
                new ExtHostSaveParticipant(extHostContext)
            ];
            // Hook into model
            textFileEditorModel_1.TextFileEditorModel.setSaveParticipant(this);
        }
        SaveParticipant.prototype.dispose = function () {
            textFileEditorModel_1.TextFileEditorModel.setSaveParticipant(undefined);
        };
        SaveParticipant.prototype.participate = function (model, env) {
            var _this = this;
            var stats = Object.create(null);
            var promiseFactory = this._saveParticipants.map(function (p) { return function () {
                var name = p.name;
                var t1 = Date.now();
                return winjs_base_1.TPromise.as(p.participate(model, env)).then(function () {
                    stats["Success-" + name] = Date.now() - t1;
                }, function (err) {
                    stats["Failure-" + name] = Date.now() - t1;
                    // console.error(err);
                });
            }; });
            return async_1.sequence(promiseFactory).then(function () {
                _this._telemetryService.publicLog('saveParticipantStats', stats);
            });
        };
        SaveParticipant = __decorate([
            extHostCustomers_1.extHostCustomer,
            __param(1, telemetry_1.ITelemetryService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, configuration_1.IConfigurationService),
            __param(4, codeEditorService_1.ICodeEditorService)
        ], SaveParticipant);
        return SaveParticipant;
    }());
    exports.SaveParticipant = SaveParticipant;
});
//# sourceMappingURL=mainThreadSaveParticipant.js.map