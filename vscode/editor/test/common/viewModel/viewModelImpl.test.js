define(["require", "exports", "assert", "vs/editor/common/core/range", "vs/editor/test/common/viewModel/testViewModel"], function (require, exports, assert, range_1, testViewModel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ViewModel', function () {
        test('issue #21073: SplitLinesCollection: attempt to access a \'newer\' model', function () {
            var text = [''];
            var opts = {
                lineNumbersMinChars: 1
            };
            testViewModel_1.testViewModel(text, opts, function (viewModel, model) {
                assert.equal(viewModel.getLineCount(), 1);
                viewModel.setViewport(1, 1, 1);
                model.applyEdits([{
                        identifier: null,
                        range: new range_1.Range(1, 1, 1, 1),
                        text: [
                            'line01',
                            'line02',
                            'line03',
                            'line04',
                            'line05',
                            'line06',
                            'line07',
                            'line08',
                            'line09',
                            'line10',
                        ].join('\n'),
                        forceMoveMarkers: false
                    }]);
                assert.equal(viewModel.getLineCount(), 10);
            });
        });
    });
});
//# sourceMappingURL=viewModelImpl.test.js.map