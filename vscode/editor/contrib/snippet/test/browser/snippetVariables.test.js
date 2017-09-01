define(["require", "exports", "assert", "vs/base/common/platform", "vs/base/common/uri", "vs/editor/common/core/selection", "vs/editor/contrib/snippet/browser/snippetVariables", "vs/editor/contrib/snippet/browser/snippetParser", "vs/editor/common/model/model"], function (require, exports, assert, platform_1, uri_1, selection_1, snippetVariables_1, snippetParser_1, model_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Snippet Variables Resolver', function () {
        var model;
        var resolver;
        setup(function () {
            model = model_1.Model.createFromString([
                'this is line one',
                'this is line two',
                '    this is line three'
            ].join('\n'), undefined, undefined, uri_1.default.parse('file:///foo/files/text.txt'));
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model, new selection_1.Selection(1, 1, 1, 1));
        });
        teardown(function () {
            model.dispose();
        });
        function assertVariableResolve(resolver, varName, expected) {
            var snippet = new snippetParser_1.SnippetParser().parse("$" + varName);
            var variable = snippet.children[0];
            variable.resolve(resolver);
            if (variable.children.length === 0) {
                assert.equal(undefined, expected);
            }
            else {
                assert.equal(variable.toString(), expected);
            }
        }
        test('editor variables, basics', function () {
            assertVariableResolve(resolver, 'TM_FILENAME', 'text.txt');
            assertVariableResolve(resolver, 'something', undefined);
        });
        test('editor variables, file/dir', function () {
            assertVariableResolve(resolver, 'TM_FILENAME', 'text.txt');
            if (!platform_1.isWindows) {
                assertVariableResolve(resolver, 'TM_DIRECTORY', '/foo/files');
                assertVariableResolve(resolver, 'TM_FILEPATH', '/foo/files/text.txt');
            }
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model_1.Model.createFromString('', undefined, undefined, uri_1.default.parse('http://www.pb.o/abc/def/ghi')), new selection_1.Selection(1, 1, 1, 1));
            assertVariableResolve(resolver, 'TM_FILENAME', 'ghi');
            if (!platform_1.isWindows) {
                assertVariableResolve(resolver, 'TM_DIRECTORY', '/abc/def');
                assertVariableResolve(resolver, 'TM_FILEPATH', '/abc/def/ghi');
            }
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model_1.Model.createFromString('', undefined, undefined, uri_1.default.parse('mem:fff.ts')), new selection_1.Selection(1, 1, 1, 1));
            assertVariableResolve(resolver, 'TM_DIRECTORY', '');
            assertVariableResolve(resolver, 'TM_FILEPATH', 'fff.ts');
        });
        test('editor variables, selection', function () {
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model, new selection_1.Selection(1, 2, 2, 3));
            assertVariableResolve(resolver, 'TM_SELECTED_TEXT', 'his is line one\nth');
            assertVariableResolve(resolver, 'TM_CURRENT_LINE', 'this is line two');
            assertVariableResolve(resolver, 'TM_LINE_INDEX', '1');
            assertVariableResolve(resolver, 'TM_LINE_NUMBER', '2');
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model, new selection_1.Selection(2, 3, 1, 2));
            assertVariableResolve(resolver, 'TM_SELECTED_TEXT', 'his is line one\nth');
            assertVariableResolve(resolver, 'TM_CURRENT_LINE', 'this is line one');
            assertVariableResolve(resolver, 'TM_LINE_INDEX', '0');
            assertVariableResolve(resolver, 'TM_LINE_NUMBER', '1');
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model, new selection_1.Selection(1, 2, 1, 2));
            assertVariableResolve(resolver, 'TM_SELECTED_TEXT', undefined);
            assertVariableResolve(resolver, 'TM_CURRENT_WORD', 'this');
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model, new selection_1.Selection(3, 1, 3, 1));
            assertVariableResolve(resolver, 'TM_CURRENT_WORD', undefined);
        });
        test('TextmateSnippet, resolve variable', function () {
            var snippet = new snippetParser_1.SnippetParser().parse('"$TM_CURRENT_WORD"', true);
            assert.equal(snippet.toString(), '""');
            snippet.resolveVariables(resolver);
            assert.equal(snippet.toString(), '"this"');
        });
        test('TextmateSnippet, resolve variable with default', function () {
            var snippet = new snippetParser_1.SnippetParser().parse('"${TM_CURRENT_WORD:foo}"', true);
            assert.equal(snippet.toString(), '"foo"');
            snippet.resolveVariables(resolver);
            assert.equal(snippet.toString(), '"this"');
        });
        test('More useful environment variables for snippets, #32737', function () {
            assertVariableResolve(resolver, 'TM_FILENAME_BASE', 'text');
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model_1.Model.createFromString('', undefined, undefined, uri_1.default.parse('http://www.pb.o/abc/def/ghi')), new selection_1.Selection(1, 1, 1, 1));
            assertVariableResolve(resolver, 'TM_FILENAME_BASE', 'ghi');
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model_1.Model.createFromString('', undefined, undefined, uri_1.default.parse('mem:.git')), new selection_1.Selection(1, 1, 1, 1));
            assertVariableResolve(resolver, 'TM_FILENAME_BASE', '.git');
            resolver = new snippetVariables_1.EditorSnippetVariableResolver(model_1.Model.createFromString('', undefined, undefined, uri_1.default.parse('mem:foo.')), new selection_1.Selection(1, 1, 1, 1));
            assertVariableResolve(resolver, 'TM_FILENAME_BASE', 'foo');
        });
    });
});
//# sourceMappingURL=snippetVariables.test.js.map