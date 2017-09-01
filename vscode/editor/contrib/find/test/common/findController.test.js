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
define(["require", "exports", "assert", "vs/base/common/winjs.base", "vs/base/common/event", "vs/editor/common/core/editOperation", "vs/editor/common/core/position", "vs/editor/common/core/selection", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/contrib/find/common/findController", "vs/editor/test/common/mocks/mockCodeEditor", "vs/platform/contextkey/common/contextkey", "vs/platform/storage/common/storage", "vs/platform/instantiation/common/serviceCollection", "vs/base/common/async"], function (require, exports, assert, winjs_base_1, event_1, editOperation_1, position_1, selection_1, range_1, editorCommon_1, findController_1, mockCodeEditor_1, contextkey_1, storage_1, serviceCollection_1, async_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestFindController = (function (_super) {
        __extends(TestFindController, _super);
        function TestFindController(editor, contextKeyService, storageService) {
            var _this = _super.call(this, editor, contextKeyService, storageService) || this;
            _this.delayUpdateHistory = false;
            _this._delayedUpdateHistoryEvent = new event_1.Emitter();
            _this._updateHistoryDelayer = new async_1.Delayer(50);
            return _this;
        }
        TestFindController.prototype._start = function (opts) {
            _super.prototype._start.call(this, opts);
            if (opts.shouldFocus !== 0 /* NoFocusChange */) {
                this.hasFocus = true;
            }
        };
        TestFindController.prototype._delayedUpdateHistory = function () {
            var _this = this;
            if (!this.delayedUpdateHistoryPromise) {
                this.delayedUpdateHistoryPromise = new winjs_base_1.TPromise(function (c, e) {
                    var disposable = _this._delayedUpdateHistoryEvent.event(function () {
                        disposable.dispose();
                        _this.delayedUpdateHistoryPromise = null;
                        c(null);
                    });
                });
            }
            if (this.delayUpdateHistory) {
                _super.prototype._delayedUpdateHistory.call(this);
            }
            else {
                this._updateHistory();
            }
        };
        TestFindController.prototype._updateHistory = function () {
            _super.prototype._updateHistory.call(this);
            this._delayedUpdateHistoryEvent.fire();
        };
        TestFindController = __decorate([
            __param(1, contextkey_1.IContextKeyService), __param(2, storage_1.IStorageService)
        ], TestFindController);
        return TestFindController;
    }(findController_1.CommonFindController));
    function fromRange(rng) {
        return [rng.startLineNumber, rng.startColumn, rng.endLineNumber, rng.endColumn];
    }
    suite('FindController', function () {
        var queryState = {};
        var serviceCollection = new serviceCollection_1.ServiceCollection();
        serviceCollection.set(storage_1.IStorageService, {
            get: function (key) { return queryState[key]; },
            getBoolean: function (key) { return !!queryState[key]; },
            store: function (key, value) { queryState[key] = value; }
        });
        test('issue #1857: F3, Find Next, acts like "Find Under Cursor"', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'ABC',
                'ABC',
                'XYZ',
                'ABC'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                // The cursor is at the very top, of the file, at the first ABC
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var findState = findController.getState();
                var startFindAction = new findController_1.StartFindAction();
                var nextMatchFindAction = new findController_1.NextMatchFindAction();
                // I hit Ctrl+F to show the Find dialog
                startFindAction.run(null, editor);
                // I type ABC.
                findState.change({ searchString: 'A' }, true);
                findState.change({ searchString: 'AB' }, true);
                findState.change({ searchString: 'ABC' }, true);
                // The first ABC is highlighted.
                assert.deepEqual(fromRange(editor.getSelection()), [1, 1, 1, 4]);
                // I hit Esc to exit the Find dialog.
                findController.closeFindWidget();
                findController.hasFocus = false;
                // The cursor is now at end of the first line, with ABC on that line highlighted.
                assert.deepEqual(fromRange(editor.getSelection()), [1, 1, 1, 4]);
                // I hit delete to remove it and change the text to XYZ.
                editor.pushUndoStop();
                editor.executeEdits('test', [editOperation_1.EditOperation.delete(new range_1.Range(1, 1, 1, 4))]);
                editor.executeEdits('test', [editOperation_1.EditOperation.insert(new position_1.Position(1, 1), 'XYZ')]);
                editor.pushUndoStop();
                // At this point the text editor looks like this:
                //   XYZ
                //   ABC
                //   XYZ
                //   ABC
                assert.equal(editor.getModel().getLineContent(1), 'XYZ');
                // The cursor is at end of the first line.
                assert.deepEqual(fromRange(editor.getSelection()), [1, 4, 1, 4]);
                // I hit F3 to "Find Next" to find the next occurrence of ABC, but instead it searches for XYZ.
                nextMatchFindAction.run(null, editor);
                assert.equal(findState.searchString, 'ABC');
                assert.equal(findController.hasFocus, false);
                findController.dispose();
            });
        });
        test('issue #3090: F3 does not loop with two matches on a single line', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'import nls = require(\'vs/nls\');'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var nextMatchFindAction = new findController_1.NextMatchFindAction();
                editor.setPosition({
                    lineNumber: 1,
                    column: 9
                });
                nextMatchFindAction.run(null, editor);
                assert.deepEqual(fromRange(editor.getSelection()), [1, 26, 1, 29]);
                nextMatchFindAction.run(null, editor);
                assert.deepEqual(fromRange(editor.getSelection()), [1, 8, 1, 11]);
                findController.dispose();
            });
        });
        test('issue #6149: Auto-escape highlighted text for search and replace regex mode', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3  * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var startFindAction = new findController_1.StartFindAction();
                var nextMatchFindAction = new findController_1.NextMatchFindAction();
                editor.setSelection(new selection_1.Selection(1, 9, 1, 13));
                findController.toggleRegex();
                startFindAction.run(null, editor);
                nextMatchFindAction.run(null, editor);
                assert.deepEqual(fromRange(editor.getSelection()), [2, 9, 2, 13]);
                nextMatchFindAction.run(null, editor);
                assert.deepEqual(fromRange(editor.getSelection()), [1, 9, 1, 13]);
                findController.dispose();
            });
        });
        test('issue #8817: Cursor position changes when you cancel multicursor', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var selectHighlightsAction = new findController_1.SelectHighlightsAction();
                editor.setSelection(new selection_1.Selection(2, 9, 2, 16));
                selectHighlightsAction.run(null, editor);
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [2, 9, 2, 16],
                    [1, 9, 1, 16],
                    [3, 9, 3, 16],
                ]);
                editor.trigger('test', 'removeSecondaryCursors', null);
                assert.deepEqual(fromRange(editor.getSelection()), [2, 9, 2, 16]);
                findController.dispose();
            });
        });
        test('issue #5400: "Select All Occurrences of Find Match" does not select all if find uses regex', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'something',
                'someething',
                'someeething',
                'nothing'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var selectHighlightsAction = new findController_1.SelectHighlightsAction();
                editor.setSelection(new selection_1.Selection(1, 1, 1, 1));
                findController.getState().change({ searchString: 'some+thing', isRegex: true, isRevealed: true }, false);
                selectHighlightsAction.run(null, editor);
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [1, 1, 1, 10],
                    [2, 1, 2, 11],
                    [3, 1, 3, 12],
                ]);
                assert.equal(findController.getState().searchString, 'some+thing');
                findController.dispose();
            });
        });
        test('issue #9043: Clear search scope when find widget is hidden', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: false,
                    shouldFocus: 0 /* NoFocusChange */,
                    shouldAnimate: false
                });
                assert.equal(findController.getState().searchScope, null);
                findController.getState().change({
                    searchScope: new range_1.Range(1, 1, 1, 5)
                }, false);
                assert.deepEqual(findController.getState().searchScope, new range_1.Range(1, 1, 1, 5));
                findController.closeFindWidget();
                assert.equal(findController.getState().searchScope, null);
            });
        });
        test('find term is added to history on state change', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.getState().change({ searchString: '1' }, false);
                findController.getState().change({ searchString: '2' }, false);
                findController.getState().change({ searchString: '3' }, false);
                assert.deepEqual(['1', '2', '3'], toArray(findController.getHistory()));
            });
        });
        test('find term is added with delay', function (done) {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.delayUpdateHistory = true;
                findController.getState().change({ searchString: '1' }, false);
                findController.getState().change({ searchString: '2' }, false);
                findController.getState().change({ searchString: '3' }, false);
                findController.delayedUpdateHistoryPromise.then(function () {
                    assert.deepEqual(['3'], toArray(findController.getHistory()));
                    done();
                });
            });
        });
        test('show previous find term', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.getState().change({ searchString: '1' }, false);
                findController.getState().change({ searchString: '2' }, false);
                findController.getState().change({ searchString: '3' }, false);
                findController.showPreviousFindTerm();
                assert.deepEqual('2', findController.getState().searchString);
            });
        });
        test('show previous find term do not update history', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.getState().change({ searchString: '1' }, false);
                findController.getState().change({ searchString: '2' }, false);
                findController.getState().change({ searchString: '3' }, false);
                findController.showPreviousFindTerm();
                assert.deepEqual(['1', '2', '3'], toArray(findController.getHistory()));
            });
        });
        test('show next find term', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.getState().change({ searchString: '1' }, false);
                findController.getState().change({ searchString: '2' }, false);
                findController.getState().change({ searchString: '3' }, false);
                findController.getState().change({ searchString: '4' }, false);
                findController.showPreviousFindTerm();
                findController.showPreviousFindTerm();
                findController.showNextFindTerm();
                assert.deepEqual('3', findController.getState().searchString);
            });
        });
        test('show next find term do not update history', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'var x = (3 * 5)',
                'var y = (3 * 5)',
                'var z = (3 * 5)',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.getState().change({ searchString: '1' }, false);
                findController.getState().change({ searchString: '2' }, false);
                findController.getState().change({ searchString: '3' }, false);
                findController.getState().change({ searchString: '4' }, false);
                findController.showPreviousFindTerm();
                findController.showPreviousFindTerm();
                findController.showNextFindTerm();
                assert.deepEqual(['1', '2', '3', '4'], toArray(findController.getHistory()));
            });
        });
        test('AddSelectionToNextFindMatchAction can work with multiline', function () {
            mockCodeEditor_1.withMockCodeEditor([
                '',
                'qwe',
                'rty',
                '',
                'qwe',
                '',
                'rty',
                'qwe',
                'rty'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var addSelectionToNextFindMatch = new findController_1.AddSelectionToNextFindMatchAction();
                editor.setSelection(new selection_1.Selection(2, 1, 3, 4));
                addSelectionToNextFindMatch.run(null, editor);
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [2, 1, 3, 4],
                    [8, 1, 9, 4]
                ]);
                editor.trigger('test', 'removeSecondaryCursors', null);
                assert.deepEqual(fromRange(editor.getSelection()), [2, 1, 3, 4]);
                findController.dispose();
            });
        });
        test('issue #6661: AddSelectionToNextFindMatchAction can work with touching ranges', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'abcabc',
                'abc',
                'abcabc',
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var addSelectionToNextFindMatch = new findController_1.AddSelectionToNextFindMatchAction();
                editor.setSelection(new selection_1.Selection(1, 1, 1, 4));
                addSelectionToNextFindMatch.run(null, editor);
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [1, 1, 1, 4],
                    [1, 4, 1, 7]
                ]);
                addSelectionToNextFindMatch.run(null, editor);
                addSelectionToNextFindMatch.run(null, editor);
                addSelectionToNextFindMatch.run(null, editor);
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [1, 1, 1, 4],
                    [1, 4, 1, 7],
                    [2, 1, 2, 4],
                    [3, 1, 3, 4],
                    [3, 4, 3, 7]
                ]);
                editor.trigger('test', editorCommon_1.Handler.Type, { text: 'z' });
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [1, 2, 1, 2],
                    [1, 3, 1, 3],
                    [2, 2, 2, 2],
                    [3, 2, 3, 2],
                    [3, 3, 3, 3]
                ]);
                assert.equal(editor.getValue(), [
                    'zz',
                    'z',
                    'zz',
                ].join('\n'));
                findController.dispose();
            });
        });
        test('issue #23541: Multiline Ctrl+D does not work in CRLF files', function () {
            mockCodeEditor_1.withMockCodeEditor([
                '',
                'qwe',
                'rty',
                '',
                'qwe',
                '',
                'rty',
                'qwe',
                'rty'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                editor.getModel().setEOL(editorCommon_1.EndOfLineSequence.CRLF);
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var addSelectionToNextFindMatch = new findController_1.AddSelectionToNextFindMatchAction();
                editor.setSelection(new selection_1.Selection(2, 1, 3, 4));
                addSelectionToNextFindMatch.run(null, editor);
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [2, 1, 3, 4],
                    [8, 1, 9, 4]
                ]);
                editor.trigger('test', 'removeSecondaryCursors', null);
                assert.deepEqual(fromRange(editor.getSelection()), [2, 1, 3, 4]);
                findController.dispose();
            });
        });
        test('issue #18111: Regex replace with single space replaces with no space', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'HRESULT OnAmbientPropertyChange(DISPID   dispid);'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var startFindAction = new findController_1.StartFindAction();
                startFindAction.run(null, editor);
                findController.getState().change({ searchString: '\\b\\s{3}\\b', replaceString: ' ', isRegex: true }, false);
                findController.moveToNextMatch();
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [1, 39, 1, 42]
                ]);
                findController.replace();
                assert.deepEqual(editor.getValue(), 'HRESULT OnAmbientPropertyChange(DISPID dispid);');
                findController.dispose();
            });
        });
        test('issue #24714: Regular expression with ^ in search & replace', function () {
            mockCodeEditor_1.withMockCodeEditor([
                '',
                'line2',
                'line3'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var startFindAction = new findController_1.StartFindAction();
                startFindAction.run(null, editor);
                findController.getState().change({ searchString: '^', replaceString: 'x', isRegex: true }, false);
                findController.moveToNextMatch();
                assert.deepEqual(editor.getSelections().map(fromRange), [
                    [2, 1, 2, 1]
                ]);
                findController.replace();
                assert.deepEqual(editor.getValue(), '\nxline2\nline3');
                findController.dispose();
            });
        });
        function toArray(historyNavigator) {
            var result = [];
            historyNavigator.first();
            if (historyNavigator.current()) {
                do {
                    result.push(historyNavigator.current());
                } while (historyNavigator.next());
            }
            return result;
        }
        function testAddSelectionToNextFindMatchAction(text, callback) {
            mockCodeEditor_1.withMockCodeEditor(text, { serviceCollection: serviceCollection }, function (editor, cursor) {
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var action = new findController_1.AddSelectionToNextFindMatchAction();
                callback(editor, action, findController);
                findController.dispose();
            });
        }
        test('AddSelectionToNextFindMatchAction starting with single collapsed selection', function () {
            var text = [
                'abc pizza',
                'abc house',
                'abc bar'
            ];
            testAddSelectionToNextFindMatchAction(text, function (editor, action, findController) {
                editor.setSelections([
                    new selection_1.Selection(1, 2, 1, 2),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
            });
        });
        test('AddSelectionToNextFindMatchAction starting with two selections, one being collapsed 1)', function () {
            var text = [
                'abc pizza',
                'abc house',
                'abc bar'
            ];
            testAddSelectionToNextFindMatchAction(text, function (editor, action, findController) {
                editor.setSelections([
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 2, 2, 2),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
            });
        });
        test('AddSelectionToNextFindMatchAction starting with two selections, one being collapsed 2)', function () {
            var text = [
                'abc pizza',
                'abc house',
                'abc bar'
            ];
            testAddSelectionToNextFindMatchAction(text, function (editor, action, findController) {
                editor.setSelections([
                    new selection_1.Selection(1, 2, 1, 2),
                    new selection_1.Selection(2, 1, 2, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
            });
        });
        test('AddSelectionToNextFindMatchAction starting with all collapsed selections', function () {
            var text = [
                'abc pizza',
                'abc house',
                'abc bar'
            ];
            testAddSelectionToNextFindMatchAction(text, function (editor, action, findController) {
                editor.setSelections([
                    new selection_1.Selection(1, 2, 1, 2),
                    new selection_1.Selection(2, 2, 2, 2),
                    new selection_1.Selection(3, 1, 3, 1),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 4),
                    new selection_1.Selection(2, 1, 2, 4),
                    new selection_1.Selection(3, 1, 3, 4),
                ]);
            });
        });
        test('AddSelectionToNextFindMatchAction starting with all collapsed selections on different words', function () {
            var text = [
                'abc pizza',
                'abc house',
                'abc bar'
            ];
            testAddSelectionToNextFindMatchAction(text, function (editor, action, findController) {
                editor.setSelections([
                    new selection_1.Selection(1, 6, 1, 6),
                    new selection_1.Selection(2, 6, 2, 6),
                    new selection_1.Selection(3, 6, 3, 6),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 5, 1, 10),
                    new selection_1.Selection(2, 5, 2, 10),
                    new selection_1.Selection(3, 5, 3, 8),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 5, 1, 10),
                    new selection_1.Selection(2, 5, 2, 10),
                    new selection_1.Selection(3, 5, 3, 8),
                ]);
            });
        });
        test('issue #20651: AddSelectionToNextFindMatchAction case insensitive', function () {
            var text = [
                'test',
                'testte',
                'Test',
                'testte',
                'test'
            ];
            testAddSelectionToNextFindMatchAction(text, function (editor, action, findController) {
                editor.setSelections([
                    new selection_1.Selection(1, 1, 1, 5),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 5),
                    new selection_1.Selection(2, 1, 2, 5),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 5),
                    new selection_1.Selection(2, 1, 2, 5),
                    new selection_1.Selection(3, 1, 3, 5),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 5),
                    new selection_1.Selection(2, 1, 2, 5),
                    new selection_1.Selection(3, 1, 3, 5),
                    new selection_1.Selection(4, 1, 4, 5),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 5),
                    new selection_1.Selection(2, 1, 2, 5),
                    new selection_1.Selection(3, 1, 3, 5),
                    new selection_1.Selection(4, 1, 4, 5),
                    new selection_1.Selection(5, 1, 5, 5),
                ]);
                action.run(null, editor);
                assert.deepEqual(editor.getSelections(), [
                    new selection_1.Selection(1, 1, 1, 5),
                    new selection_1.Selection(2, 1, 2, 5),
                    new selection_1.Selection(3, 1, 3, 5),
                    new selection_1.Selection(4, 1, 4, 5),
                    new selection_1.Selection(5, 1, 5, 5),
                ]);
            });
        });
    });
    suite('FindController query options persistence', function () {
        var queryState = {};
        queryState['editor.isRegex'] = false;
        queryState['editor.matchCase'] = false;
        queryState['editor.wholeWord'] = false;
        var serviceCollection = new serviceCollection_1.ServiceCollection();
        serviceCollection.set(storage_1.IStorageService, {
            get: function (key) { return queryState[key]; },
            getBoolean: function (key) { return !!queryState[key]; },
            store: function (key, value) { queryState[key] = value; }
        });
        test('matchCase', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'abc',
                'ABC',
                'XYZ',
                'ABC'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                queryState = { 'editor.isRegex': false, 'editor.matchCase': true, 'editor.wholeWord': false };
                // The cursor is at the very top, of the file, at the first ABC
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var findState = findController.getState();
                var startFindAction = new findController_1.StartFindAction();
                // I hit Ctrl+F to show the Find dialog
                startFindAction.run(null, editor);
                // I type ABC.
                findState.change({ searchString: 'ABC' }, true);
                // The second ABC is highlighted as matchCase is true.
                assert.deepEqual(fromRange(editor.getSelection()), [2, 1, 2, 4]);
                findController.dispose();
            });
        });
        queryState = { 'editor.isRegex': false, 'editor.matchCase': false, 'editor.wholeWord': true };
        test('wholeWord', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'ABC',
                'AB',
                'XYZ',
                'ABC'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                queryState = { 'editor.isRegex': false, 'editor.matchCase': false, 'editor.wholeWord': true };
                // The cursor is at the very top, of the file, at the first ABC
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                var findState = findController.getState();
                var startFindAction = new findController_1.StartFindAction();
                // I hit Ctrl+F to show the Find dialog
                startFindAction.run(null, editor);
                // I type AB.
                findState.change({ searchString: 'AB' }, true);
                // The second AB is highlighted as wholeWord is true.
                assert.deepEqual(fromRange(editor.getSelection()), [2, 1, 2, 3]);
                findController.dispose();
            });
        });
        test('toggling options is saved', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'ABC',
                'AB',
                'XYZ',
                'ABC'
            ], { serviceCollection: serviceCollection }, function (editor, cursor) {
                queryState = { 'editor.isRegex': false, 'editor.matchCase': false, 'editor.wholeWord': true };
                // The cursor is at the very top, of the file, at the first ABC
                var findController = editor.registerAndInstantiateContribution(TestFindController);
                findController.toggleRegex();
                assert.equal(queryState['editor.isRegex'], true);
                findController.dispose();
            });
        });
    });
});
//# sourceMappingURL=findController.test.js.map