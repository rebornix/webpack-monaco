/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/platform/workspace/common/workspace", "vs/base/common/uri"], function (require, exports, assert, workspace_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Workspace', function () {
        test('Workspace ensures unique roots', function () {
            // Unique
            var roots = [uri_1.default.file('/some/path'), uri_1.default.file('/some/path')];
            var ws = new workspace_1.Workspace('id', 'name', roots, uri_1.default.file('/config'));
            assert.equal(ws.roots.length, 1);
        });
    });
});
//# sourceMappingURL=workspace.test.js.map