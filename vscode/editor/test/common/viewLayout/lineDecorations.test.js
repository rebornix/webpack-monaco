define(["require", "exports", "assert", "vs/editor/common/viewLayout/lineDecorations", "vs/editor/common/core/range", "vs/editor/common/viewModel/viewModel"], function (require, exports, assert, lineDecorations_1, range_1, viewModel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Editor ViewLayout - ViewLineParts', function () {
        function newDecoration(startLineNumber, startColumn, endLineNumber, endColumn, inlineClassName) {
            return new viewModel_1.InlineDecoration(new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn), inlineClassName, false);
        }
        test('Bug 9827:Overlapping inline decorations can cause wrong inline class to be applied', function () {
            var result = lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 11, 'c1', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false)
            ]);
            assert.deepEqual(result, [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c2 c1'),
                new lineDecorations_1.DecorationSegment(3, 9, 'c1'),
            ]);
        });
        test('issue #3462: no whitespace shown at the end of a decorated line', function () {
            var result = lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(15, 21, 'vs-whitespace', false),
                new lineDecorations_1.LineDecoration(20, 21, 'inline-folded', false),
            ]);
            assert.deepEqual(result, [
                new lineDecorations_1.DecorationSegment(14, 18, 'vs-whitespace'),
                new lineDecorations_1.DecorationSegment(19, 19, 'vs-whitespace inline-folded')
            ]);
        });
        test('issue #3661: Link decoration bleeds to next line when wrapping', function () {
            var result = lineDecorations_1.LineDecoration.filter([
                newDecoration(2, 12, 3, 30, 'detected-link')
            ], 3, 12, 500);
            assert.deepEqual(result, [
                new lineDecorations_1.LineDecoration(12, 30, 'detected-link', false),
            ]);
        });
        test('ViewLineParts', function () {
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 2, 'c1', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 0, 'c1'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c2')
            ]);
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 3, 'c1', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c2')
            ]);
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 4, 'c1', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c1 c2')
            ]);
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 4, 'c1', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1*', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1 c1*'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c1 c1* c2')
            ]);
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 4, 'c1', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1*', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1**', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1 c1* c1**'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c1 c1* c1** c2')
            ]);
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 4, 'c1', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1*', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1**', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2*', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1 c1* c1**'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c1 c1* c1** c2 c2*')
            ]);
            assert.deepEqual(lineDecorations_1.LineDecorationsNormalizer.normalize([
                new lineDecorations_1.LineDecoration(1, 4, 'c1', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1*', false),
                new lineDecorations_1.LineDecoration(1, 4, 'c1**', false),
                new lineDecorations_1.LineDecoration(3, 4, 'c2', false),
                new lineDecorations_1.LineDecoration(3, 5, 'c2*', false)
            ]), [
                new lineDecorations_1.DecorationSegment(0, 1, 'c1 c1* c1**'),
                new lineDecorations_1.DecorationSegment(2, 2, 'c1 c1* c1** c2 c2*'),
                new lineDecorations_1.DecorationSegment(3, 3, 'c2*')
            ]);
        });
    });
});
//# sourceMappingURL=lineDecorations.test.js.map