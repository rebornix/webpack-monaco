define(["require", "exports", "assert", "vs/editor/common/editorCommon", "vs/editor/common/model/editableTextModel", "vs/editor/common/model/mirrorModel", "vs/editor/common/model/textModel", "vs/editor/common/core/position", "vs/editor/common/model/textSource"], function (require, exports, assert, editorCommon, editableTextModel_1, mirrorModel_1, textModel_1, position_1, textSource_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function testApplyEditsWithSyncedModels(original, edits, expected, inputEditsAreInvalid) {
        if (inputEditsAreInvalid === void 0) { inputEditsAreInvalid = false; }
        var originalStr = original.join('\n');
        var expectedStr = expected.join('\n');
        assertSyncedModels(originalStr, function (model, assertMirrorModels) {
            // Apply edits & collect inverse edits
            var inverseEdits = model.applyEdits(edits);
            // Assert edits produced expected result
            assert.deepEqual(model.getValue(editorCommon.EndOfLinePreference.LF), expectedStr);
            assertMirrorModels();
            // Apply the inverse edits
            var inverseInverseEdits = model.applyEdits(inverseEdits);
            // Assert the inverse edits brought back model to original state
            assert.deepEqual(model.getValue(editorCommon.EndOfLinePreference.LF), originalStr);
            if (!inputEditsAreInvalid) {
                // Assert the inverse of the inverse edits are the original edits
                assert.deepEqual(inverseInverseEdits, edits);
            }
            assertMirrorModels();
        });
    }
    exports.testApplyEditsWithSyncedModels = testApplyEditsWithSyncedModels;
    var AssertDocumentLineMappingDirection;
    (function (AssertDocumentLineMappingDirection) {
        AssertDocumentLineMappingDirection[AssertDocumentLineMappingDirection["OffsetToPosition"] = 0] = "OffsetToPosition";
        AssertDocumentLineMappingDirection[AssertDocumentLineMappingDirection["PositionToOffset"] = 1] = "PositionToOffset";
    })(AssertDocumentLineMappingDirection || (AssertDocumentLineMappingDirection = {}));
    function assertOneDirectionLineMapping(model, direction, msg) {
        var allText = model.getValue();
        var line = 1, column = 1, previousIsCarriageReturn = false;
        for (var offset = 0; offset <= allText.length; offset++) {
            // The position coordinate system cannot express the position between \r and \n
            var position = new position_1.Position(line, column + (previousIsCarriageReturn ? -1 : 0));
            if (direction === 0 /* OffsetToPosition */) {
                var actualPosition = model.getPositionAt(offset);
                assert.equal(actualPosition.toString(), position.toString(), msg + ' - getPositionAt mismatch for offset ' + offset);
            }
            else {
                // The position coordinate system cannot express the position between \r and \n
                var expectedOffset = offset + (previousIsCarriageReturn ? -1 : 0);
                var actualOffset = model.getOffsetAt(position);
                assert.equal(actualOffset, expectedOffset, msg + ' - getOffsetAt mismatch for position ' + position.toString());
            }
            if (allText.charAt(offset) === '\n') {
                line++;
                column = 1;
            }
            else {
                column++;
            }
            previousIsCarriageReturn = (allText.charAt(offset) === '\r');
        }
    }
    function assertLineMapping(model, msg) {
        assertOneDirectionLineMapping(model, 1 /* PositionToOffset */, msg);
        assertOneDirectionLineMapping(model, 0 /* OffsetToPosition */, msg);
    }
    function assertSyncedModels(text, callback, setup) {
        if (setup === void 0) { setup = null; }
        var model = new editableTextModel_1.EditableTextModel(textSource_1.RawTextSource.fromString(text), textModel_1.TextModel.DEFAULT_CREATION_OPTIONS, null);
        model.setEOL(editorCommon.EndOfLineSequence.LF);
        assertLineMapping(model, 'model');
        if (setup) {
            setup(model);
            assertLineMapping(model, 'model');
        }
        var mirrorModel2 = new mirrorModel_1.MirrorModel(null, model.getLinesContent(), model.getEOL(), model.getVersionId());
        var mirrorModel2PrevVersionId = model.getVersionId();
        model.onDidChangeContent(function (e) {
            var versionId = e.versionId;
            if (versionId < mirrorModel2PrevVersionId) {
                console.warn('Model version id did not advance between edits (2)');
            }
            mirrorModel2PrevVersionId = versionId;
            mirrorModel2.onEvents(e);
        });
        var assertMirrorModels = function () {
            assertLineMapping(model, 'model');
            model._assertLineNumbersOK();
            assert.equal(mirrorModel2.getText(), model.getValue(), 'mirror model 2 text OK');
            assert.equal(mirrorModel2.version, model.getVersionId(), 'mirror model 2 version OK');
        };
        callback(model, assertMirrorModels);
        model.dispose();
        mirrorModel2.dispose();
    }
    exports.assertSyncedModels = assertSyncedModels;
});
//# sourceMappingURL=editableTextModelTestUtils.js.map