/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/errors", "vs/base/common/uri", "vs/base/common/arrays", "vs/base/common/winjs.base", "vs/editor/common/core/range", "vs/editor/common/editorCommonExtensions", "vs/editor/common/modes", "vs/editor/common/services/modelService", "vs/base/common/async"], function (require, exports, errors_1, uri_1, arrays_1, winjs_base_1, range_1, editorCommonExtensions_1, modes_1, modelService_1, async_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getDocumentRangeFormattingEdits(model, range, options) {
        var providers = modes_1.DocumentRangeFormattingEditProviderRegistry.ordered(model);
        if (providers.length === 0) {
            return winjs_base_1.TPromise.as(undefined);
        }
        var result;
        return async_1.sequence(providers.map(function (provider) {
            if (arrays_1.isFalsyOrEmpty(result)) {
                return function () {
                    return async_1.asWinJsPromise(function (token) { return provider.provideDocumentRangeFormattingEdits(model, range, options, token); }).then(function (value) {
                        result = value;
                    }, errors_1.onUnexpectedExternalError);
                };
            }
            return undefined;
        })).then(function () { return result; });
    }
    exports.getDocumentRangeFormattingEdits = getDocumentRangeFormattingEdits;
    function getDocumentFormattingEdits(model, options) {
        var providers = modes_1.DocumentFormattingEditProviderRegistry.ordered(model);
        // try range formatters when no document formatter is registered
        if (providers.length === 0) {
            return getDocumentRangeFormattingEdits(model, model.getFullModelRange(), options);
        }
        var result;
        return async_1.sequence(providers.map(function (provider) {
            if (arrays_1.isFalsyOrEmpty(result)) {
                return function () {
                    return async_1.asWinJsPromise(function (token) { return provider.provideDocumentFormattingEdits(model, options, token); }).then(function (value) {
                        result = value;
                    }, errors_1.onUnexpectedExternalError);
                };
            }
            return undefined;
        })).then(function () { return result; });
    }
    exports.getDocumentFormattingEdits = getDocumentFormattingEdits;
    function getOnTypeFormattingEdits(model, position, ch, options) {
        var support = modes_1.OnTypeFormattingEditProviderRegistry.ordered(model)[0];
        if (!support) {
            return winjs_base_1.TPromise.as(undefined);
        }
        if (support.autoFormatTriggerCharacters.indexOf(ch) < 0) {
            return winjs_base_1.TPromise.as(undefined);
        }
        return async_1.asWinJsPromise(function (token) {
            return support.provideOnTypeFormattingEdits(model, position, ch, options, token);
        }).then(function (r) { return r; }, errors_1.onUnexpectedExternalError);
    }
    exports.getOnTypeFormattingEdits = getOnTypeFormattingEdits;
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeFormatRangeProvider', function (accessor, args) {
        var resource = args.resource, range = args.range, options = args.options;
        if (!(resource instanceof uri_1.default) || !range_1.Range.isIRange(range)) {
            throw errors_1.illegalArgument();
        }
        var model = accessor.get(modelService_1.IModelService).getModel(resource);
        if (!model) {
            throw errors_1.illegalArgument('resource');
        }
        return getDocumentRangeFormattingEdits(model, range_1.Range.lift(range), options);
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerLanguageCommand('_executeFormatDocumentProvider', function (accessor, args) {
        var resource = args.resource, options = args.options;
        if (!(resource instanceof uri_1.default)) {
            throw errors_1.illegalArgument('resource');
        }
        var model = accessor.get(modelService_1.IModelService).getModel(resource);
        if (!model) {
            throw errors_1.illegalArgument('resource');
        }
        return getDocumentFormattingEdits(model, options);
    });
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeFormatOnTypeProvider', function (model, position, args) {
        var ch = args.ch, options = args.options;
        if (typeof ch !== 'string') {
            throw errors_1.illegalArgument('ch');
        }
        return getOnTypeFormattingEdits(model, position, ch, options);
    });
});
//# sourceMappingURL=format.js.map