/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/uri"], function (require, exports, uri_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pathsPath = uri_1.default.parse(require.toUrl('paths')).fsPath;
    var paths = require.__$__nodeRequire(pathsPath);
    exports.getAppDataPath = paths.getAppDataPath;
    exports.getDefaultUserDataPath = paths.getDefaultUserDataPath;
});
//# sourceMappingURL=paths.js.map