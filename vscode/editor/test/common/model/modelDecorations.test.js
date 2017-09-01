define(["require", "exports", "assert", "vs/editor/common/core/editOperation", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/model/model"], function (require, exports, assert, editOperation_1, position_1, range_1, editorCommon_1, model_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function modelHasDecorations(model, decorations) {
        var modelDecorations = [];
        var actualDecorations = model.getAllDecorations();
        for (var i = 0, len = actualDecorations.length; i < len; i++) {
            modelDecorations.push({
                range: actualDecorations[i].range,
                className: actualDecorations[i].options.className
            });
        }
        assert.deepEqual(modelDecorations, decorations, 'Model decorations');
    }
    function modelHasDecoration(model, startLineNumber, startColumn, endLineNumber, endColumn, className) {
        modelHasDecorations(model, [{
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                className: className
            }]);
    }
    function modelHasNoDecorations(model) {
        assert.equal(model.getAllDecorations().length, 0, 'Model has no decoration');
    }
    function addDecoration(model, startLineNumber, startColumn, endLineNumber, endColumn, className) {
        return model.changeDecorations(function (changeAccessor) {
            return changeAccessor.addDecoration(new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn), {
                className: className
            });
        });
    }
    function lineHasDecorations(model, lineNumber, decorations) {
        var lineDecorations = [];
        var decs = model.getLineDecorations(lineNumber);
        for (var i = 0, len = decs.length; i < len; i++) {
            lineDecorations.push({
                start: decs[i].range.startColumn,
                end: decs[i].range.endColumn,
                className: decs[i].options.className
            });
        }
        assert.deepEqual(lineDecorations, decorations, 'Line decorations');
    }
    function lineHasNoDecorations(model, lineNumber) {
        lineHasDecorations(model, lineNumber, []);
    }
    function lineHasDecoration(model, lineNumber, start, end, className) {
        lineHasDecorations(model, lineNumber, [{
                start: start,
                end: end,
                className: className
            }]);
    }
    suite('Editor Model - Model Decorations', function () {
        var LINE1 = 'My First Line';
        var LINE2 = '\t\tMy Second Line';
        var LINE3 = '    Third Line';
        var LINE4 = '';
        var LINE5 = '1';
        // --------- Model Decorations
        var thisModel;
        setup(function () {
            var text = LINE1 + '\r\n' +
                LINE2 + '\n' +
                LINE3 + '\n' +
                LINE4 + '\r\n' +
                LINE5;
            thisModel = model_1.Model.createFromString(text);
        });
        teardown(function () {
            thisModel.dispose();
            thisModel = null;
        });
        test('single character decoration', function () {
            addDecoration(thisModel, 1, 1, 1, 2, 'myType');
            lineHasDecoration(thisModel, 1, 1, 2, 'myType');
            lineHasNoDecorations(thisModel, 2);
            lineHasNoDecorations(thisModel, 3);
            lineHasNoDecorations(thisModel, 4);
            lineHasNoDecorations(thisModel, 5);
        });
        test('line decoration', function () {
            addDecoration(thisModel, 1, 1, 1, 14, 'myType');
            lineHasDecoration(thisModel, 1, 1, 14, 'myType');
            lineHasNoDecorations(thisModel, 2);
            lineHasNoDecorations(thisModel, 3);
            lineHasNoDecorations(thisModel, 4);
            lineHasNoDecorations(thisModel, 5);
        });
        test('full line decoration', function () {
            addDecoration(thisModel, 1, 1, 2, 1, 'myType');
            var line1Decorations = thisModel.getLineDecorations(1);
            assert.equal(line1Decorations.length, 1);
            assert.equal(line1Decorations[0].options.className, 'myType');
            var line2Decorations = thisModel.getLineDecorations(1);
            assert.equal(line2Decorations.length, 1);
            assert.equal(line2Decorations[0].options.className, 'myType');
            lineHasNoDecorations(thisModel, 3);
            lineHasNoDecorations(thisModel, 4);
            lineHasNoDecorations(thisModel, 5);
        });
        test('multiple line decoration', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            var line1Decorations = thisModel.getLineDecorations(1);
            assert.equal(line1Decorations.length, 1);
            assert.equal(line1Decorations[0].options.className, 'myType');
            var line2Decorations = thisModel.getLineDecorations(1);
            assert.equal(line2Decorations.length, 1);
            assert.equal(line2Decorations[0].options.className, 'myType');
            var line3Decorations = thisModel.getLineDecorations(1);
            assert.equal(line3Decorations.length, 1);
            assert.equal(line3Decorations[0].options.className, 'myType');
            lineHasNoDecorations(thisModel, 4);
            lineHasNoDecorations(thisModel, 5);
        });
        // --------- removing, changing decorations
        test('decoration gets removed', function () {
            var decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.changeDecorations(function (changeAccessor) {
                changeAccessor.removeDecoration(decId);
            });
            modelHasNoDecorations(thisModel);
        });
        test('decorations get removed', function () {
            var decId1 = addDecoration(thisModel, 1, 2, 3, 2, 'myType1');
            var decId2 = addDecoration(thisModel, 1, 2, 3, 1, 'myType2');
            modelHasDecorations(thisModel, [
                {
                    range: new range_1.Range(1, 2, 3, 2),
                    className: 'myType1'
                },
                {
                    range: new range_1.Range(1, 2, 3, 1),
                    className: 'myType2'
                }
            ]);
            thisModel.changeDecorations(function (changeAccessor) {
                changeAccessor.removeDecoration(decId1);
            });
            modelHasDecorations(thisModel, [
                {
                    range: new range_1.Range(1, 2, 3, 1),
                    className: 'myType2'
                }
            ]);
            thisModel.changeDecorations(function (changeAccessor) {
                changeAccessor.removeDecoration(decId2);
            });
            modelHasNoDecorations(thisModel);
        });
        test('decoration range can be changed', function () {
            var decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.changeDecorations(function (changeAccessor) {
                changeAccessor.changeDecoration(decId, new range_1.Range(1, 1, 1, 2));
            });
            modelHasDecoration(thisModel, 1, 1, 1, 2, 'myType');
        });
        // --------- eventing
        test('decorations emit event on add', function () {
            var listenerCalled = 0;
            thisModel.onDidChangeDecorations(function (e) {
                listenerCalled++;
                assert.equal(e.addedDecorations.length, 1);
                assert.equal(e.changedDecorations.length, 0);
                assert.equal(e.removedDecorations.length, 0);
            });
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            assert.equal(listenerCalled, 1, 'listener called');
        });
        test('decorations emit event on change', function () {
            var listenerCalled = 0;
            var decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.onDidChangeDecorations(function (e) {
                listenerCalled++;
                assert.equal(e.addedDecorations.length, 0);
                assert.equal(e.changedDecorations.length, 1);
                assert.equal(e.changedDecorations[0], decId);
                assert.equal(e.removedDecorations.length, 0);
            });
            thisModel.changeDecorations(function (changeAccessor) {
                changeAccessor.changeDecoration(decId, new range_1.Range(1, 1, 1, 2));
            });
            assert.equal(listenerCalled, 1, 'listener called');
        });
        test('decorations emit event on remove', function () {
            var listenerCalled = 0;
            var decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.onDidChangeDecorations(function (e) {
                listenerCalled++;
                assert.equal(e.addedDecorations.length, 0);
                assert.equal(e.changedDecorations.length, 0);
                assert.equal(e.removedDecorations.length, 1);
                assert.equal(e.removedDecorations[0], decId);
            });
            thisModel.changeDecorations(function (changeAccessor) {
                changeAccessor.removeDecoration(decId);
            });
            assert.equal(listenerCalled, 1, 'listener called');
        });
        test('decorations emit event when inserting one line text before it', function () {
            var listenerCalled = 0;
            var decId = addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.onDidChangeDecorations(function (e) {
                listenerCalled++;
                assert.equal(e.addedDecorations.length, 0);
                assert.equal(e.changedDecorations.length, 1);
                assert.equal(e.changedDecorations[0], decId);
                assert.equal(e.removedDecorations.length, 0);
            });
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(1, 1), 'Hallo ')]);
            assert.equal(listenerCalled, 1, 'listener called');
        });
        // --------- editing text & effects on decorations
        test('decorations are updated when inserting one line text before it', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(1, 1), 'Hallo ')]);
            modelHasDecoration(thisModel, 1, 8, 3, 2, 'myType');
        });
        test('decorations are updated when inserting one line text before it 2', function () {
            addDecoration(thisModel, 1, 1, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 1, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.replace(new range_1.Range(1, 1, 1, 1), 'Hallo ')]);
            modelHasDecoration(thisModel, 1, 1, 3, 2, 'myType');
        });
        test('decorations are updated when inserting multiple lines text before it', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(1, 1), 'Hallo\nI\'m inserting multiple\nlines')]);
            modelHasDecoration(thisModel, 3, 7, 5, 2, 'myType');
        });
        test('decorations change when inserting text after them', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(3, 2), 'Hallo')]);
            modelHasDecoration(thisModel, 1, 2, 3, 7, 'myType');
        });
        test('decorations are updated when inserting text inside', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(1, 3), 'Hallo ')]);
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
        });
        test('decorations are updated when inserting text inside 2', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(3, 1), 'Hallo ')]);
            modelHasDecoration(thisModel, 1, 2, 3, 8, 'myType');
        });
        test('decorations are updated when inserting text inside 3', function () {
            addDecoration(thisModel, 1, 1, 2, 16, 'myType');
            modelHasDecoration(thisModel, 1, 1, 2, 16, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(2, 2), '\n')]);
            modelHasDecoration(thisModel, 1, 1, 3, 15, 'myType');
        });
        test('decorations are updated when inserting multiple lines text inside', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.insert(new position_1.Position(1, 3), 'Hallo\nI\'m inserting multiple\nlines')]);
            modelHasDecoration(thisModel, 1, 2, 5, 2, 'myType');
        });
        test('decorations are updated when deleting one line text before it', function () {
            addDecoration(thisModel, 1, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 1, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.delete(new range_1.Range(1, 1, 1, 2))]);
            modelHasDecoration(thisModel, 1, 1, 3, 2, 'myType');
        });
        test('decorations are updated when deleting multiple lines text before it', function () {
            addDecoration(thisModel, 2, 2, 3, 2, 'myType');
            modelHasDecoration(thisModel, 2, 2, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.delete(new range_1.Range(1, 1, 2, 1))]);
            modelHasDecoration(thisModel, 1, 2, 2, 2, 'myType');
        });
        test('decorations are updated when deleting multiple lines text before it 2', function () {
            addDecoration(thisModel, 2, 3, 3, 2, 'myType');
            modelHasDecoration(thisModel, 2, 3, 3, 2, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.delete(new range_1.Range(1, 1, 2, 2))]);
            modelHasDecoration(thisModel, 1, 2, 2, 2, 'myType');
        });
        test('decorations are updated when deleting text inside', function () {
            addDecoration(thisModel, 1, 2, 4, 1, 'myType');
            modelHasDecoration(thisModel, 1, 2, 4, 1, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.delete(new range_1.Range(1, 3, 2, 1))]);
            modelHasDecoration(thisModel, 1, 2, 3, 1, 'myType');
        });
        test('decorations are updated when deleting text inside 2', function () {
            addDecoration(thisModel, 1, 2, 4, 1, 'myType');
            modelHasDecoration(thisModel, 1, 2, 4, 1, 'myType');
            thisModel.applyEdits([
                editOperation_1.EditOperation.delete(new range_1.Range(1, 1, 1, 2)),
                editOperation_1.EditOperation.delete(new range_1.Range(4, 1, 4, 1))
            ]);
            modelHasDecoration(thisModel, 1, 1, 4, 1, 'myType');
        });
        test('decorations are updated when deleting multiple lines text', function () {
            addDecoration(thisModel, 1, 2, 4, 1, 'myType');
            modelHasDecoration(thisModel, 1, 2, 4, 1, 'myType');
            thisModel.applyEdits([editOperation_1.EditOperation.delete(new range_1.Range(1, 1, 3, 1))]);
            modelHasDecoration(thisModel, 1, 1, 2, 1, 'myType');
        });
    });
    suite('deltaDecorations', function () {
        function decoration(id, startLineNumber, startColumn, endLineNumber, endColum) {
            return {
                id: id,
                range: new range_1.Range(startLineNumber, startColumn, endLineNumber, endColum)
            };
        }
        function toModelDeltaDecoration(dec) {
            return {
                range: dec.range,
                options: {
                    className: dec.id
                }
            };
        }
        function strcmp(a, b) {
            if (a === b) {
                return 0;
            }
            if (a < b) {
                return -1;
            }
            return 1;
        }
        function readModelDecorations(model, ids) {
            return ids.map(function (id) {
                return {
                    range: model.getDecorationRange(id),
                    id: model.getDecorationOptions(id).className
                };
            });
        }
        function testDeltaDecorations(text, decorations, newDecorations) {
            var model = model_1.Model.createFromString(text.join('\n'));
            // Add initial decorations & assert they are added
            var initialIds = model.deltaDecorations([], decorations.map(toModelDeltaDecoration));
            var actualDecorations = readModelDecorations(model, initialIds);
            assert.equal(initialIds.length, decorations.length, 'returns expected cnt of ids');
            assert.equal(initialIds.length, model.getAllDecorations().length, 'does not leak decorations');
            assert.equal(initialIds.length, model._getTrackedRangesCount(), 'does not leak tracked ranges');
            assert.equal(2 * initialIds.length, model._getMarkersCount(), 'does not leak markers');
            actualDecorations.sort(function (a, b) { return strcmp(a.id, b.id); });
            decorations.sort(function (a, b) { return strcmp(a.id, b.id); });
            assert.deepEqual(actualDecorations, decorations);
            var newIds = model.deltaDecorations(initialIds, newDecorations.map(toModelDeltaDecoration));
            var actualNewDecorations = readModelDecorations(model, newIds);
            assert.equal(newIds.length, newDecorations.length, 'returns expected cnt of ids');
            assert.equal(newIds.length, model.getAllDecorations().length, 'does not leak decorations');
            assert.equal(newIds.length, model._getTrackedRangesCount(), 'does not leak tracked ranges');
            assert.equal(2 * newIds.length, model._getMarkersCount(), 'does not leak markers');
            actualNewDecorations.sort(function (a, b) { return strcmp(a.id, b.id); });
            newDecorations.sort(function (a, b) { return strcmp(a.id, b.id); });
            assert.deepEqual(actualDecorations, decorations);
            model.dispose();
        }
        function range(startLineNumber, startColumn, endLineNumber, endColumn) {
            return new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn);
        }
        test('result respects input', function () {
            var model = model_1.Model.createFromString([
                'Hello world,',
                'How are you?'
            ].join('\n'));
            var ids = model.deltaDecorations([], [
                toModelDeltaDecoration(decoration('a', 1, 1, 1, 12)),
                toModelDeltaDecoration(decoration('b', 2, 1, 2, 13))
            ]);
            assert.deepEqual(model.getDecorationRange(ids[0]), range(1, 1, 1, 12));
            assert.deepEqual(model.getDecorationRange(ids[1]), range(2, 1, 2, 13));
            model.dispose();
        });
        test('deltaDecorations 1', function () {
            testDeltaDecorations([
                'This is a text',
                'That has multiple lines',
                'And is very friendly',
                'Towards testing'
            ], [
                decoration('a', 1, 1, 1, 2),
                decoration('b', 1, 1, 1, 15),
                decoration('c', 1, 1, 2, 1),
                decoration('d', 1, 1, 2, 24),
                decoration('e', 2, 1, 2, 24),
                decoration('f', 2, 1, 4, 16)
            ], [
                decoration('x', 1, 1, 1, 2),
                decoration('b', 1, 1, 1, 15),
                decoration('c', 1, 1, 2, 1),
                decoration('d', 1, 1, 2, 24),
                decoration('e', 2, 1, 2, 21),
                decoration('f', 2, 17, 4, 16)
            ]);
        });
        test('deltaDecorations 2', function () {
            testDeltaDecorations([
                'This is a text',
                'That has multiple lines',
                'And is very friendly',
                'Towards testing'
            ], [
                decoration('a', 1, 1, 1, 2),
                decoration('b', 1, 2, 1, 3),
                decoration('c', 1, 3, 1, 4),
                decoration('d', 1, 4, 1, 5),
                decoration('e', 1, 5, 1, 6)
            ], [
                decoration('a', 1, 2, 1, 3),
                decoration('b', 1, 3, 1, 4),
                decoration('c', 1, 4, 1, 5),
                decoration('d', 1, 5, 1, 6)
            ]);
        });
        test('deltaDecorations 3', function () {
            testDeltaDecorations([
                'This is a text',
                'That has multiple lines',
                'And is very friendly',
                'Towards testing'
            ], [
                decoration('a', 1, 1, 1, 2),
                decoration('b', 1, 2, 1, 3),
                decoration('c', 1, 3, 1, 4),
                decoration('d', 1, 4, 1, 5),
                decoration('e', 1, 5, 1, 6)
            ], []);
        });
        test('issue #4317: editor.setDecorations doesn\'t update the hover message', function () {
            var model = model_1.Model.createFromString('Hello world!');
            var ids = model.deltaDecorations([], [{
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 100,
                        endColumn: 1
                    },
                    options: {
                        hoverMessage: { value: 'hello1' }
                    }
                }]);
            ids = model.deltaDecorations(ids, [{
                    range: {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 100,
                        endColumn: 1
                    },
                    options: {
                        hoverMessage: { value: 'hello2' }
                    }
                }]);
            var actualDecoration = model.getDecorationOptions(ids[0]);
            assert.deepEqual(actualDecoration.hoverMessage, { value: 'hello2' });
            model.dispose();
        });
        test('model doesn\'t get confused with individual tracked ranges', function () {
            var model = model_1.Model.createFromString([
                'Hello world,',
                'How are you?'
            ].join('\n'));
            var trackedRangeId = model.changeDecorations(function (changeAcessor) {
                return changeAcessor.addDecoration({
                    startLineNumber: 1,
                    startColumn: 1,
                    endLineNumber: 1,
                    endColumn: 1
                }, {
                    stickiness: editorCommon_1.TrackedRangeStickiness.AlwaysGrowsWhenTypingAtEdges
                });
            });
            model.changeDecorations(function (changeAccessor) {
                changeAccessor.removeDecoration(trackedRangeId);
            });
            var ids = model.deltaDecorations([], [
                toModelDeltaDecoration(decoration('a', 1, 1, 1, 12)),
                toModelDeltaDecoration(decoration('b', 2, 1, 2, 13))
            ]);
            assert.deepEqual(model.getDecorationRange(ids[0]), range(1, 1, 1, 12));
            assert.deepEqual(model.getDecorationRange(ids[1]), range(2, 1, 2, 13));
            ids = model.deltaDecorations(ids, [
                toModelDeltaDecoration(decoration('a', 1, 1, 1, 12)),
                toModelDeltaDecoration(decoration('b', 2, 1, 2, 13))
            ]);
            assert.deepEqual(model.getDecorationRange(ids[0]), range(1, 1, 1, 12));
            assert.deepEqual(model.getDecorationRange(ids[1]), range(2, 1, 2, 13));
            model.dispose();
        });
        test('issue #16922: Clicking on link doesn\'t seem to do anything', function () {
            var model = model_1.Model.createFromString([
                'Hello world,',
                'How are you?',
                'Fine.',
                'Good.',
            ].join('\n'));
            model.deltaDecorations([], [
                { range: new range_1.Range(1, 1, 1, 1), options: { className: '1' } },
                { range: new range_1.Range(1, 13, 1, 13), options: { className: '2' } },
                { range: new range_1.Range(2, 1, 2, 1), options: { className: '3' } },
                { range: new range_1.Range(2, 1, 2, 4), options: { className: '4' } },
                { range: new range_1.Range(2, 8, 2, 13), options: { className: '5' } },
                { range: new range_1.Range(3, 1, 4, 6), options: { className: '6' } },
                { range: new range_1.Range(1, 1, 3, 6), options: { className: 'x1' } },
                { range: new range_1.Range(2, 5, 2, 8), options: { className: 'x2' } },
                { range: new range_1.Range(1, 1, 2, 8), options: { className: 'x3' } },
                { range: new range_1.Range(2, 5, 3, 1), options: { className: 'x4' } },
            ]);
            var inRange = model.getDecorationsInRange(new range_1.Range(2, 6, 2, 6));
            var inRangeClassNames = inRange.map(function (d) { return d.options.className; });
            inRangeClassNames.sort();
            assert.deepEqual(inRangeClassNames, ['x1', 'x2', 'x3', 'x4']);
            model.dispose();
        });
    });
});
//# sourceMappingURL=modelDecorations.test.js.map