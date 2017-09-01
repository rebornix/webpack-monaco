define(["require", "exports", "vs/workbench/parts/files/common/explorerModel", "vs/platform/contextkey/common/contextkey"], function (require, exports, explorerModel_1, contextkey_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Explorer viewlet id.
     */
    exports.VIEWLET_ID = 'workbench.view.explorer';
    /**
     * Context Keys to use with keybindings for the Explorer and Open Editors view
     */
    var explorerViewletVisibleId = 'explorerViewletVisible';
    var filesExplorerFocusId = 'filesExplorerFocus';
    var openEditorsVisibleId = 'openEditorsVisible';
    var openEditorsFocusId = 'openEditorsFocus';
    var explorerViewletFocusId = 'explorerViewletFocus';
    var explorerResourceIsFolderId = 'explorerResourceIsFolder';
    exports.ExplorerViewletVisibleContext = new contextkey_1.RawContextKey(explorerViewletVisibleId, true);
    exports.ExplorerFolderContext = new contextkey_1.RawContextKey(explorerResourceIsFolderId, false);
    exports.FilesExplorerFocusedContext = new contextkey_1.RawContextKey(filesExplorerFocusId, false);
    exports.OpenEditorsVisibleContext = new contextkey_1.RawContextKey(openEditorsVisibleId, false);
    exports.OpenEditorsFocusedContext = new contextkey_1.RawContextKey(openEditorsFocusId, false);
    exports.ExplorerFocusedContext = new contextkey_1.RawContextKey(explorerViewletFocusId, false);
    exports.OpenEditorsVisibleCondition = contextkey_1.ContextKeyExpr.has(openEditorsVisibleId);
    exports.FilesExplorerFocusCondition = contextkey_1.ContextKeyExpr.and(contextkey_1.ContextKeyExpr.has(explorerViewletVisibleId), contextkey_1.ContextKeyExpr.has(filesExplorerFocusId));
    exports.ExplorerFocusCondition = contextkey_1.ContextKeyExpr.and(contextkey_1.ContextKeyExpr.has(explorerViewletVisibleId), contextkey_1.ContextKeyExpr.has(explorerViewletFocusId));
    /**
     * File editor input id.
     */
    exports.FILE_EDITOR_INPUT_ID = 'workbench.editors.files.fileEditorInput';
    /**
     * Text file editor id.
     */
    exports.TEXT_FILE_EDITOR_ID = 'workbench.editors.files.textFileEditor';
    /**
     * Binary file editor id.
     */
    exports.BINARY_FILE_EDITOR_ID = 'workbench.editors.files.binaryFileEditor';
    /**
     * Helper to get an explorer item from an object.
     */
    function explorerItemToFileResource(obj) {
        if (obj instanceof explorerModel_1.FileStat) {
            var stat = obj;
            return {
                resource: stat.resource,
                isDirectory: stat.isDirectory
            };
        }
        if (obj instanceof explorerModel_1.OpenEditor) {
            var editor = obj;
            var resource = editor.getResource();
            if (resource && resource.scheme === 'file') {
                return {
                    resource: editor.getResource()
                };
            }
        }
        return null;
    }
    exports.explorerItemToFileResource = explorerItemToFileResource;
    exports.SortOrderConfiguration = {
        DEFAULT: 'default',
        MIXED: 'mixed',
        FILES_FIRST: 'filesFirst',
        TYPE: 'type',
        MODIFIED: 'modified'
    };
});
//# sourceMappingURL=files.js.map