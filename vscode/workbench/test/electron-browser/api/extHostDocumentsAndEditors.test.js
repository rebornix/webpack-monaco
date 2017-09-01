/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/common/uri", "vs/workbench/api/node/extHostDocumentsAndEditors", "vs/base/common/winjs.base"], function (require, exports, assert, uri_1, extHostDocumentsAndEditors_1, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostDocumentsAndEditors', function () {
        var editors;
        setup(function () {
            editors = new extHostDocumentsAndEditors_1.ExtHostDocumentsAndEditors({
                get: function () { return undefined; }
            });
        });
        test('The value of TextDocument.isClosed is incorrect when a text document is closed, #27949', function () {
            editors.$acceptDocumentsAndEditorsDelta({
                addedDocuments: [{
                        EOL: '\n',
                        isDirty: true,
                        modeId: 'fooLang',
                        url: uri_1.default.parse('foo:bar'),
                        versionId: 1,
                        lines: [
                            'first',
                            'second'
                        ]
                    }]
            });
            return new winjs_base_1.TPromise(function (resolve, reject) {
                editors.onDidRemoveDocuments(function (e) {
                    try {
                        for (var _i = 0, e_1 = e; _i < e_1.length; _i++) {
                            var data = e_1[_i];
                            assert.equal(data.document.isClosed, true);
                        }
                        resolve(undefined);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
                editors.$acceptDocumentsAndEditorsDelta({
                    removedDocuments: ['foo:bar']
                });
            });
        });
    });
});
//# sourceMappingURL=extHostDocumentsAndEditors.test.js.map