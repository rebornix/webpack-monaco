define(["require", "exports", "assert", "vs/editor/contrib/folding/common/indentFoldStrategy"], function (require, exports, assert, indentFoldStrategy_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Indentation Folding', function () {
        function r(startLineNumber, endLineNumber, indent) {
            return { startLineNumber: startLineNumber, endLineNumber: endLineNumber, indent: indent };
        }
        test('Limit By indent', function () {
            var ranges = [r(1, 4, 0), r(3, 4, 2), r(5, 8, 0), r(6, 7, 1), r(9, 15, 0), r(10, 15, 10), r(11, 12, 2000), r(14, 15, 2000)];
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 8), [r(1, 4, 0), r(3, 4, 2), r(5, 8, 0), r(6, 7, 1), r(9, 15, 0), r(10, 15, 10), r(11, 12, 2000), r(14, 15, 2000)]);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 7), [r(1, 4, 0), r(3, 4, 2), r(5, 8, 0), r(6, 7, 1), r(9, 15, 0), r(10, 15, 10)]);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 6), [r(1, 4, 0), r(3, 4, 2), r(5, 8, 0), r(6, 7, 1), r(9, 15, 0), r(10, 15, 10)]);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 5), [r(1, 4, 0), r(3, 4, 2), r(5, 8, 0), r(6, 7, 1), r(9, 15, 0)]);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 4), [r(1, 4, 0), r(5, 8, 0), r(6, 7, 1), r(9, 15, 0)]);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 3), [r(1, 4, 0), r(5, 8, 0), r(9, 15, 0)]);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 2), []);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 1), []);
            assert.deepEqual(indentFoldStrategy_1.limitByIndent(ranges, 0), []);
        });
    });
});
//# sourceMappingURL=indentFold.test.js.map