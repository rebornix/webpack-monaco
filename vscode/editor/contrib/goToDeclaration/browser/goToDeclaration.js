/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/editor/common/editorCommonExtensions", "vs/editor/common/modes", "vs/base/common/async"], function (require, exports, errors_1, winjs_base_1, editorCommonExtensions_1, modes_1, async_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function outputResults(promises) {
        return winjs_base_1.TPromise.join(promises).then(function (allReferences) {
            var result = [];
            for (var _i = 0, allReferences_1 = allReferences; _i < allReferences_1.length; _i++) {
                var references = allReferences_1[_i];
                if (Array.isArray(references)) {
                    result.push.apply(result, references);
                }
                else if (references) {
                    result.push(references);
                }
            }
            return result;
        });
    }
    function getDefinitions(model, position, registry, provide) {
        var provider = registry.ordered(model);
        // get results
        var promises = provider.map(function (provider, idx) {
            return async_1.asWinJsPromise(function (token) {
                return provide(provider, model, position, token);
            }).then(undefined, function (err) {
                errors_1.onUnexpectedExternalError(err);
                return null;
            });
        });
        return outputResults(promises);
    }
    function getDefinitionsAtPosition(model, position) {
        return getDefinitions(model, position, modes_1.DefinitionProviderRegistry, function (provider, model, position, token) {
            return provider.provideDefinition(model, position, token);
        });
    }
    exports.getDefinitionsAtPosition = getDefinitionsAtPosition;
    function getImplementationsAtPosition(model, position) {
        return getDefinitions(model, position, modes_1.ImplementationProviderRegistry, function (provider, model, position, token) {
            return provider.provideImplementation(model, position, token);
        });
    }
    exports.getImplementationsAtPosition = getImplementationsAtPosition;
    function getTypeDefinitionsAtPosition(model, position) {
        return getDefinitions(model, position, modes_1.TypeDefinitionProviderRegistry, function (provider, model, position, token) {
            return provider.provideTypeDefinition(model, position, token);
        });
    }
    exports.getTypeDefinitionsAtPosition = getTypeDefinitionsAtPosition;
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeDefinitionProvider', getDefinitionsAtPosition);
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeImplementationProvider', getImplementationsAtPosition);
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeTypeDefinitionProvider', getTypeDefinitionsAtPosition);
});
//# sourceMappingURL=goToDeclaration.js.map