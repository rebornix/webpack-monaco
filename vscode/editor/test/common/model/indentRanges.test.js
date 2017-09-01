/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/editor/common/model/model", "vs/editor/common/model/indentRanges"], function (require, exports, assert, model_1, indentRanges_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Indentation Folding', function () {
        function assertRanges(lines, expected) {
            var model = model_1.Model.createFromString(lines.join('\n'));
            var actual = indentRanges_1.computeRanges(model);
            actual.sort(function (r1, r2) { return r1.startLineNumber - r2.startLineNumber; });
            assert.deepEqual(actual, expected);
            model.dispose();
        }
        function r(startLineNumber, endLineNumber, indent) {
            return { startLineNumber: startLineNumber, endLineNumber: endLineNumber, indent: indent };
        }
        test('Fold one level', function () {
            assertRanges([
                'A',
                '  A',
                '  A',
                '  A'
            ], [r(1, 4, 0)]);
        });
        test('Fold two levels', function () {
            assertRanges([
                'A',
                '  A',
                '  A',
                '    A',
                '    A'
            ], [r(1, 5, 0), r(3, 5, 2)]);
        });
        test('Fold three levels', function () {
            assertRanges([
                'A',
                '  A',
                '    A',
                '      A',
                'A'
            ], [r(1, 4, 0), r(2, 4, 2), r(3, 4, 4)]);
        });
        test('Fold decreasing indent', function () {
            assertRanges([
                '    A',
                '  A',
                'A'
            ], []);
        });
        test('Fold Java', function () {
            assertRanges([
                /* 1*/ 'class A {',
                /* 2*/ '  void foo() {',
                /* 3*/ '    console.log();',
                /* 4*/ '    console.log();',
                /* 5*/ '  }',
                /* 6*/ '',
                /* 7*/ '  void bar() {',
                /* 8*/ '    console.log();',
                /* 9*/ '  }',
                /*10*/ '}',
                /*11*/ 'interface B {',
                /*12*/ '  void bar();',
                /*13*/ '}',
            ], [r(1, 9, 0), r(2, 4, 2), r(7, 8, 2), r(11, 12, 0)]);
        });
        test('Fold Javadoc', function () {
            assertRanges([
                /* 1*/ '/**',
                /* 2*/ ' * Comment',
                /* 3*/ ' */',
                /* 4*/ 'class A {',
                /* 5*/ '  void foo() {',
                /* 6*/ '  }',
                /* 7*/ '}',
            ], [r(1, 3, 0), r(4, 6, 0)]);
        });
        test('Fold Whitespace', function () {
            assertRanges([
                /* 1*/ 'class A {',
                /* 2*/ '',
                /* 3*/ '  void foo() {',
                /* 4*/ '     ',
                /* 5*/ '     return 0;',
                /* 6*/ '  }',
                /* 7*/ '      ',
                /* 8*/ '}',
            ], [r(1, 7, 0), r(3, 5, 2)]);
        });
        test('Fold Tabs', function () {
            assertRanges([
                /* 1*/ 'class A {',
                /* 2*/ '\t\t',
                /* 3*/ '\tvoid foo() {',
                /* 4*/ '\t \t//hello',
                /* 5*/ '\t    return 0;',
                /* 6*/ '  \t}',
                /* 7*/ '      ',
                /* 8*/ '}',
            ], [r(1, 7, 0), r(3, 5, 4)]);
        });
    });
});
//# sourceMappingURL=indentRanges.test.js.map