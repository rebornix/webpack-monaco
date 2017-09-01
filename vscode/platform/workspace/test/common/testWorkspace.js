/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/uri", "vs/platform/workspace/common/workspace"], function (require, exports, uri_1, workspace_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var wsUri = uri_1.default.file('C:\\testWorkspace');
    exports.TestWorkspace = testWorkspace(wsUri);
    function testWorkspace(resource) {
        return new workspace_1.Workspace(resource.toString(), resource.fsPath, [resource]);
    }
    exports.testWorkspace = testWorkspace;
});
//# sourceMappingURL=testWorkspace.js.map