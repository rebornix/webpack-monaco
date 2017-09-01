/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/platform/instantiation/common/instantiation"], function (require, exports, instantiation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CONFIG_DEFAULT_NAME = 'settings';
    exports.WORKSPACE_CONFIG_FOLDER_DEFAULT_NAME = '.vscode';
    exports.WORKSPACE_CONFIG_DEFAULT_PATH = exports.WORKSPACE_CONFIG_FOLDER_DEFAULT_NAME + "/" + exports.CONFIG_DEFAULT_NAME + ".json";
    exports.IWorkspaceConfigurationService = instantiation_1.createDecorator('configurationService');
    exports.WORKSPACE_STANDALONE_CONFIGURATIONS = {
        'tasks': exports.WORKSPACE_CONFIG_FOLDER_DEFAULT_NAME + "/tasks.json",
        'launch': exports.WORKSPACE_CONFIG_FOLDER_DEFAULT_NAME + "/launch.json"
    };
});
//# sourceMappingURL=configuration.js.map