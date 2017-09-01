/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/workbench/parts/snippets/electron-browser/snippetsService", "vs/editor/common/core/position", "vs/editor/common/modes/modesRegistry", "vs/editor/common/services/modeServiceImpl", "vs/editor/common/model/model"], function (require, exports, assert, snippetsService_1, position_1, modesRegistry_1, modeServiceImpl_1, model_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('SnippetsService', function () {
        suiteSetup(function () {
            modesRegistry_1.ModesRegistry.registerLanguage({
                id: 'fooLang',
                extensions: ['.fooLang',]
            });
        });
        var modeService;
        var snippetService;
        setup(function () {
            modeService = new modeServiceImpl_1.ModeServiceImpl();
            snippetService = new snippetsService_1.SnippetsService(modeService);
            snippetService.registerSnippets(modeService.getLanguageIdentifier('fooLang').id, [{
                    prefix: 'bar',
                    codeSnippet: 'barCodeSnippet',
                    name: 'barTest',
                    description: ''
                }, {
                    prefix: 'bazz',
                    codeSnippet: 'bazzCodeSnippet',
                    name: 'bazzTest',
                    description: ''
                }], 'fooFile.json');
        });
        test('snippet completions - simple', function () {
            var provider = new snippetsService_1.SnippetSuggestProvider(modeService, snippetService);
            var model = model_1.Model.createFromString('', undefined, modeService.getLanguageIdentifier('fooLang'));
            var result = provider.provideCompletionItems(model, new position_1.Position(1, 1));
            assert.equal(result.incomplete, undefined);
            assert.equal(result.suggestions.length, 2);
        });
        test('snippet completions - with prefix', function () {
            var provider = new snippetsService_1.SnippetSuggestProvider(modeService, snippetService);
            var model = model_1.Model.createFromString('bar', undefined, modeService.getLanguageIdentifier('fooLang'));
            var result = provider.provideCompletionItems(model, new position_1.Position(1, 4));
            assert.equal(result.incomplete, undefined);
            assert.equal(result.suggestions.length, 1);
            assert.equal(result.suggestions[0].label, 'bar');
            assert.equal(result.suggestions[0].insertText, 'barCodeSnippet');
        });
        test('Cannot use "<?php" as user snippet prefix anymore, #26275', function () {
            snippetService.registerSnippets(modeService.getLanguageIdentifier('fooLang').id, [{
                    prefix: '<?php',
                    codeSnippet: 'insert me',
                    name: '',
                    description: ''
                }], 'barFile.json');
            var provider = new snippetsService_1.SnippetSuggestProvider(modeService, snippetService);
            var model = model_1.Model.createFromString('\t<?php', undefined, modeService.getLanguageIdentifier('fooLang'));
            var result = provider.provideCompletionItems(model, new position_1.Position(1, 7));
            assert.equal(result.suggestions.length, 1);
            model.dispose();
            model = model_1.Model.createFromString('\t<?', undefined, modeService.getLanguageIdentifier('fooLang'));
            result = provider.provideCompletionItems(model, new position_1.Position(1, 4));
            assert.equal(result.suggestions.length, 1);
            model.dispose();
            model = model_1.Model.createFromString('a<?', undefined, modeService.getLanguageIdentifier('fooLang'));
            result = provider.provideCompletionItems(model, new position_1.Position(1, 4));
            assert.equal(result.suggestions.length, 0);
            model.dispose();
        });
        test('No user snippets in suggestions, when inside the code, #30508', function () {
            snippetService.registerSnippets(modeService.getLanguageIdentifier('fooLang').id, [{
                    prefix: 'foo',
                    codeSnippet: '<foo>$0</foo>',
                    name: '',
                    description: ''
                }], 'fooFile.json');
            var provider = new snippetsService_1.SnippetSuggestProvider(modeService, snippetService);
            var model = model_1.Model.createFromString('<head>\n\t\n>/head>', undefined, modeService.getLanguageIdentifier('fooLang'));
            var result = provider.provideCompletionItems(model, new position_1.Position(1, 1));
            assert.equal(result.suggestions.length, 1);
            result = provider.provideCompletionItems(model, new position_1.Position(2, 2));
            assert.equal(result.suggestions.length, 1);
        });
    });
});
//# sourceMappingURL=snippetsService.test.js.map