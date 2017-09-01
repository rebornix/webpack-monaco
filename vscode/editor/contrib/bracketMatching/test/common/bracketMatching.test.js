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
define(["require", "exports", "assert", "vs/editor/test/common/mocks/mockCodeEditor", "vs/editor/common/core/position", "vs/editor/common/model/model", "vs/editor/common/modes/languageConfigurationRegistry", "vs/editor/test/common/mocks/mockMode", "vs/editor/common/modes", "vs/editor/contrib/bracketMatching/common/bracketMatching"], function (require, exports, assert, mockCodeEditor_1, position_1, model_1, languageConfigurationRegistry_1, mockMode_1, modes_1, bracketMatching_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('bracket matching', function () {
        var BracketMode = (function (_super) {
            __extends(BracketMode, _super);
            function BracketMode() {
                var _this = _super.call(this, BracketMode._id) || this;
                _this._register(languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(_this.getLanguageIdentifier(), {
                    brackets: [
                        ['{', '}'],
                        ['[', ']'],
                        ['(', ')'],
                    ]
                }));
                return _this;
            }
            BracketMode._id = new modes_1.LanguageIdentifier('bracketMode', 3);
            return BracketMode;
        }(mockMode_1.MockMode));
        test('issue #183: jump to matching bracket position', function () {
            var mode = new BracketMode();
            var model = model_1.Model.createFromString('var x = (3 + (5-7)) + ((5+3)+5);', undefined, mode.getLanguageIdentifier());
            mockCodeEditor_1.withMockCodeEditor(null, { model: model }, function (editor, cursor) {
                var bracketMatchingController = editor.registerAndInstantiateContribution(bracketMatching_1.BracketMatchingController);
                // start on closing bracket
                editor.setPosition(new position_1.Position(1, 20));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 9));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 19));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 9));
                // start on opening bracket
                editor.setPosition(new position_1.Position(1, 23));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 31));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 23));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 31));
                bracketMatchingController.dispose();
            });
            model.dispose();
            mode.dispose();
        });
        test('Jump to next bracket', function () {
            var mode = new BracketMode();
            var model = model_1.Model.createFromString('var x = (3 + (5-7)); y();', undefined, mode.getLanguageIdentifier());
            mockCodeEditor_1.withMockCodeEditor(null, { model: model }, function (editor, cursor) {
                var bracketMatchingController = editor.registerAndInstantiateContribution(bracketMatching_1.BracketMatchingController);
                // start position between brackets
                editor.setPosition(new position_1.Position(1, 16));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 18));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 14));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 18));
                // skip brackets in comments
                editor.setPosition(new position_1.Position(1, 21));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 23));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 24));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 23));
                // do not break if no brackets are available
                editor.setPosition(new position_1.Position(1, 26));
                bracketMatchingController.jumpToBracket();
                assert.deepEqual(editor.getPosition(), new position_1.Position(1, 26));
                bracketMatchingController.dispose();
            });
            model.dispose();
            mode.dispose();
        });
    });
});
//# sourceMappingURL=bracketMatching.test.js.map