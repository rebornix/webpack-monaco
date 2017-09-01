/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/editor/common/editorCommonExtensions", "vs/workbench/common/editor"], function (require, exports, winjs_base_1, errors_1, editorCommonExtensions_1, editor_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkspaceSymbolProviderRegistry;
    (function (WorkspaceSymbolProviderRegistry) {
        var _supports = [];
        function register(support) {
            if (support) {
                _supports.push(support);
            }
            return {
                dispose: function () {
                    if (support) {
                        var idx = _supports.indexOf(support);
                        if (idx >= 0) {
                            _supports.splice(idx, 1);
                            support = undefined;
                        }
                    }
                }
            };
        }
        WorkspaceSymbolProviderRegistry.register = register;
        function all() {
            return _supports.slice(0);
        }
        WorkspaceSymbolProviderRegistry.all = all;
    })(WorkspaceSymbolProviderRegistry = exports.WorkspaceSymbolProviderRegistry || (exports.WorkspaceSymbolProviderRegistry = {}));
    function getWorkspaceSymbols(query) {
        var result = [];
        var promises = WorkspaceSymbolProviderRegistry.all().map(function (support) {
            return support.provideWorkspaceSymbols(query).then(function (value) {
                if (Array.isArray(value)) {
                    result.push([support, value]);
                }
            }, errors_1.onUnexpectedError);
        });
        return winjs_base_1.TPromise.join(promises).then(function (_) { return result; });
    }
    exports.getWorkspaceSymbols = getWorkspaceSymbols;
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeWorkspaceSymbolProvider', function (accessor, args) {
        var query = args.query;
        if (typeof query !== 'string') {
            throw errors_1.illegalArgument();
        }
        return getWorkspaceSymbols(query);
    });
    /**
     * Helper to return all opened editors with resources not belonging to the currently opened workspace.
     */
    function getOutOfWorkspaceEditorResources(editorGroupService, contextService) {
        var resources = [];
        editorGroupService.getStacksModel().groups.forEach(function (group) {
            var editors = group.getEditors();
            editors.forEach(function (editor) {
                var fileResource = editor_1.toResource(editor, { supportSideBySide: true, filter: 'file' });
                if (fileResource && !contextService.isInsideWorkspace(fileResource)) {
                    resources.push(fileResource);
                }
            });
        });
        return resources;
    }
    exports.getOutOfWorkspaceEditorResources = getOutOfWorkspaceEditorResources;
});
//# sourceMappingURL=search.js.map