define(["require", "exports", "vs/nls", "vs/base/common/collections", "vs/platform/extensions/common/extensionsRegistry", "vs/workbench/parts/views/browser/viewsRegistry", "vs/workbench/parts/views/browser/treeView", "vs/platform/contextkey/common/contextkey"], function (require, exports, nls_1, collections_1, extensionsRegistry_1, viewsRegistry_1, treeView_1, contextkey_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var schema;
    (function (schema) {
        // --views contribution point
        function isValidViewDescriptors(viewDescriptors, collector) {
            if (!Array.isArray(viewDescriptors)) {
                collector.error(nls_1.localize('requirearray', "views must be an array"));
                return false;
            }
            for (var _i = 0, viewDescriptors_1 = viewDescriptors; _i < viewDescriptors_1.length; _i++) {
                var descriptor = viewDescriptors_1[_i];
                if (typeof descriptor.id !== 'string') {
                    collector.error(nls_1.localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'id'));
                    return false;
                }
                if (typeof descriptor.name !== 'string') {
                    collector.error(nls_1.localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'name'));
                    return false;
                }
                if (descriptor.when && typeof descriptor.when !== 'string') {
                    collector.error(nls_1.localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
                    return false;
                }
            }
            return true;
        }
        schema.isValidViewDescriptors = isValidViewDescriptors;
        var viewDescriptor = {
            type: 'object',
            properties: {
                id: {
                    description: nls_1.localize('vscode.extension.contributes.view.id', 'Identifier of the view. Use this to register a data provider through `vscode.window.registerTreeDataProviderForView` API. Also to trigger activating your extension by registering `onView:${id}` event to `activationEvents`.'),
                    type: 'string'
                },
                name: {
                    description: nls_1.localize('vscode.extension.contributes.view.name', 'The human-readable name of the view. Will be shown'),
                    type: 'string'
                },
                when: {
                    description: nls_1.localize('vscode.extension.contributes.view.when', 'Condition which must be true to show this view'),
                    type: 'string'
                },
            }
        };
        schema.viewsContribution = {
            description: nls_1.localize('vscode.extension.contributes.views', "Contributes views to the editor"),
            type: 'object',
            properties: {
                'explorer': {
                    description: nls_1.localize('views.explorer', "Explorer View"),
                    type: 'array',
                    items: viewDescriptor
                },
                'debug': {
                    description: nls_1.localize('views.debug', "Debug View"),
                    type: 'array',
                    items: viewDescriptor
                }
            }
        };
    })(schema || (schema = {}));
    extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('views', [], schema.viewsContribution).setHandler(function (extensions) {
        var _loop_1 = function (extension) {
            var value = extension.value, collector = extension.collector;
            collections_1.forEach(value, function (entry) {
                if (!schema.isValidViewDescriptors(entry.value, collector)) {
                    return;
                }
                var location = viewsRegistry_1.ViewLocation.getContributedViewLocation(entry.key);
                if (!location) {
                    collector.warn(nls_1.localize('locationId.invalid', "`{0}` is not a valid view location", entry.key));
                    return;
                }
                var viewDescriptors = entry.value.map(function (item) { return ({
                    id: item.id,
                    name: item.name,
                    ctor: treeView_1.TreeView,
                    location: location,
                    when: contextkey_1.ContextKeyExpr.deserialize(item.when),
                    canToggleVisibility: true
                }); });
                viewsRegistry_1.ViewsRegistry.registerViews(viewDescriptors);
            });
        };
        for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
            var extension = extensions_1[_i];
            _loop_1(extension);
        }
    });
});
//# sourceMappingURL=viewsExtensionPoint.js.map