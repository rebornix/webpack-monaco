/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/common/errors", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/base/common/uri", "vs/base/common/winjs.base", "vs/workbench/api/node/extHostTypes", "vs/editor/common/model/model", "./testThreadService", "vs/platform/markers/common/markerService", "vs/platform/markers/common/markers", "vs/platform/commands/common/commands", "vs/editor/common/services/modelService", "vs/workbench/api/node/extHostLanguageFeatures", "vs/workbench/api/electron-browser/mainThreadLanguageFeatures", "vs/workbench/api/electron-browser/mainThreadHeapService", "vs/workbench/api/node/extHostApiCommands", "vs/workbench/api/node/extHostCommands", "vs/workbench/api/node/extHostHeapService", "vs/workbench/api/electron-browser/mainThreadCommands", "vs/workbench/api/node/extHostDocuments", "vs/workbench/api/node/extHostDocumentsAndEditors", "vs/workbench/api/node/extHost.protocol", "vs/workbench/api/node/extHostDiagnostics"], function (require, exports, assert, errors_1, instantiationServiceMock_1, uri_1, winjs_base_1, types, model_1, testThreadService_1, markerService_1, markers_1, commands_1, modelService_1, extHostLanguageFeatures_1, mainThreadLanguageFeatures_1, mainThreadHeapService_1, extHostApiCommands_1, extHostCommands_1, extHostHeapService_1, mainThreadCommands_1, extHostDocuments_1, extHostDocumentsAndEditors_1, extHost_protocol_1, extHostDiagnostics_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultSelector = { scheme: 'far' };
    var model = model_1.Model.createFromString([
        'This is the first line',
        'This is the second line',
        'This is the third line',
    ].join('\n'), undefined, undefined, uri_1.default.parse('far://testing/file.b'));
    var threadService;
    var extHost;
    var mainThread;
    var commands;
    var disposables = [];
    var originalErrorHandler;
    suite('ExtHostLanguageFeatureCommands', function () {
        suiteSetup(function (done) {
            originalErrorHandler = errors_1.errorHandler.getUnexpectedErrorHandler();
            errors_1.setUnexpectedErrorHandler(function () { });
            // Use IInstantiationService to get typechecking when instantiating
            var inst;
            {
                var instantiationService_1 = new instantiationServiceMock_1.TestInstantiationService();
                threadService = new testThreadService_1.TestThreadService();
                instantiationService_1.stub(mainThreadHeapService_1.IHeapService, {
                    _serviceBrand: undefined,
                    trackRecursive: function (args) {
                        // nothing
                        return args;
                    }
                });
                instantiationService_1.stub(commands_1.ICommandService, {
                    _serviceBrand: undefined,
                    executeCommand: function (id, args) {
                        if (!commands_1.CommandsRegistry.getCommands()[id]) {
                            return winjs_base_1.TPromise.wrapError(new Error(id + ' NOT known'));
                        }
                        var handler = commands_1.CommandsRegistry.getCommands()[id].handler;
                        return winjs_base_1.TPromise.as(instantiationService_1.invokeFunction(handler, args));
                    }
                });
                instantiationService_1.stub(markers_1.IMarkerService, new markerService_1.MarkerService());
                instantiationService_1.stub(modelService_1.IModelService, {
                    _serviceBrand: modelService_1.IModelService,
                    getModel: function () { return model; },
                    createModel: function () { throw new Error(); },
                    updateModel: function () { throw new Error(); },
                    setMode: function () { throw new Error(); },
                    destroyModel: function () { throw new Error(); },
                    getModels: function () { throw new Error(); },
                    onModelAdded: undefined,
                    onModelModeChanged: undefined,
                    onModelRemoved: undefined,
                    getCreationOptions: function () { throw new Error(); }
                });
                inst = instantiationService_1;
            }
            var extHostDocumentsAndEditors = new extHostDocumentsAndEditors_1.ExtHostDocumentsAndEditors(threadService);
            extHostDocumentsAndEditors.$acceptDocumentsAndEditorsDelta({
                addedDocuments: [{
                        isDirty: false,
                        versionId: model.getVersionId(),
                        modeId: model.getLanguageIdentifier().language,
                        url: model.uri,
                        lines: model.getValue().split(model.getEOL()),
                        EOL: model.getEOL(),
                    }]
            });
            var extHostDocuments = new extHostDocuments_1.ExtHostDocuments(threadService, extHostDocumentsAndEditors);
            threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDocuments, extHostDocuments);
            var heapService = new extHostHeapService_1.ExtHostHeapService();
            commands = new extHostCommands_1.ExtHostCommands(threadService, heapService);
            threadService.set(extHost_protocol_1.ExtHostContext.ExtHostCommands, commands);
            threadService.setTestInstance(extHost_protocol_1.MainContext.MainThreadCommands, inst.createInstance(mainThreadCommands_1.MainThreadCommands, threadService));
            extHostApiCommands_1.ExtHostApiCommands.register(commands);
            var diagnostics = new extHostDiagnostics_1.ExtHostDiagnostics(threadService);
            threadService.set(extHost_protocol_1.ExtHostContext.ExtHostDiagnostics, diagnostics);
            extHost = new extHostLanguageFeatures_1.ExtHostLanguageFeatures(threadService, extHostDocuments, commands, heapService, diagnostics);
            threadService.set(extHost_protocol_1.ExtHostContext.ExtHostLanguageFeatures, extHost);
            mainThread = threadService.setTestInstance(extHost_protocol_1.MainContext.MainThreadLanguageFeatures, inst.createInstance(mainThreadLanguageFeatures_1.MainThreadLanguageFeatures, threadService));
            threadService.sync().then(done, done);
        });
        suiteTeardown(function () {
            errors_1.setUnexpectedErrorHandler(originalErrorHandler);
            model.dispose();
        });
        teardown(function (done) {
            while (disposables.length) {
                disposables.pop().dispose();
            }
            threadService.sync()
                .then(function () { return done(); }, function (err) { return done(err); });
        });
        // --- workspace symbols
        test('WorkspaceSymbols, invalid arguments', function (done) {
            var promises = [
                commands.executeCommand('vscode.executeWorkspaceSymbolProvider'),
                commands.executeCommand('vscode.executeWorkspaceSymbolProvider', null),
                commands.executeCommand('vscode.executeWorkspaceSymbolProvider', undefined),
                commands.executeCommand('vscode.executeWorkspaceSymbolProvider', true)
            ];
            // threadService.sync().then(() => {
            winjs_base_1.TPromise.join(promises).then(undefined, function (err) {
                assert.equal(err.length, 4);
                done();
                return [];
            });
            // });
        });
        test('WorkspaceSymbols, back and forth', function (done) {
            disposables.push(extHost.registerWorkspaceSymbolProvider({
                provideWorkspaceSymbols: function (query) {
                    return [
                        new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), uri_1.default.parse('far://testing/first')),
                        new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), uri_1.default.parse('far://testing/second'))
                    ];
                }
            }));
            disposables.push(extHost.registerWorkspaceSymbolProvider({
                provideWorkspaceSymbols: function (query) {
                    return [
                        new types.SymbolInformation(query, types.SymbolKind.Array, new types.Range(0, 0, 1, 1), uri_1.default.parse('far://testing/first'))
                    ];
                }
            }));
            threadService.sync().then(function () {
                commands.executeCommand('vscode.executeWorkspaceSymbolProvider', 'testing').then(function (value) {
                    for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                        var info = value_1[_i];
                        assert.ok(info instanceof types.SymbolInformation);
                        assert.equal(info.name, 'testing');
                        assert.equal(info.kind, types.SymbolKind.Array);
                    }
                    assert.equal(value.length, 3);
                    done();
                }, done);
            }, done);
        });
        // --- definition
        test('Definition, invalid arguments', function (done) {
            var promises = [
                commands.executeCommand('vscode.executeDefinitionProvider'),
                commands.executeCommand('vscode.executeDefinitionProvider', null),
                commands.executeCommand('vscode.executeDefinitionProvider', undefined),
                commands.executeCommand('vscode.executeDefinitionProvider', true, false)
            ];
            // threadService.sync().then(() => {
            winjs_base_1.TPromise.join(promises).then(undefined, function (err) {
                assert.equal(err.length, 4);
                done();
                return [];
            });
            // });
        });
        test('Definition, back and forth', function () {
            disposables.push(extHost.registerDefinitionProvider(defaultSelector, {
                provideDefinition: function (doc) {
                    return new types.Location(doc.uri, new types.Range(0, 0, 0, 0));
                }
            }));
            disposables.push(extHost.registerDefinitionProvider(defaultSelector, {
                provideDefinition: function (doc) {
                    return [
                        new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
                        new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
                        new types.Location(doc.uri, new types.Range(0, 0, 0, 0)),
                    ];
                }
            }));
            return threadService.sync().then(function () {
                return commands.executeCommand('vscode.executeDefinitionProvider', model.uri, new types.Position(0, 0)).then(function (values) {
                    assert.equal(values.length, 4);
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var v = values_1[_i];
                        assert.ok(v.uri instanceof uri_1.default);
                        assert.ok(v.range instanceof types.Range);
                    }
                });
            });
        });
        // --- references
        test('reference search, back and forth', function () {
            disposables.push(extHost.registerReferenceProvider(defaultSelector, {
                provideReferences: function (doc) {
                    return [
                        new types.Location(uri_1.default.parse('some:uri/path'), new types.Range(0, 1, 0, 5))
                    ];
                }
            }));
            return commands.executeCommand('vscode.executeReferenceProvider', model.uri, new types.Position(0, 0)).then(function (values) {
                assert.equal(values.length, 1);
                var first = values[0];
                assert.equal(first.uri.toString(), 'some:uri/path');
                assert.equal(first.range.start.line, 0);
                assert.equal(first.range.start.character, 1);
                assert.equal(first.range.end.line, 0);
                assert.equal(first.range.end.character, 5);
            });
        });
        // --- outline
        test('Outline, back and forth', function (done) {
            disposables.push(extHost.registerDocumentSymbolProvider(defaultSelector, {
                provideDocumentSymbols: function () {
                    return [
                        new types.SymbolInformation('testing1', types.SymbolKind.Enum, new types.Range(1, 0, 1, 0)),
                        new types.SymbolInformation('testing2', types.SymbolKind.Enum, new types.Range(0, 1, 0, 3)),
                    ];
                }
            }));
            threadService.sync().then(function () {
                commands.executeCommand('vscode.executeDocumentSymbolProvider', model.uri).then(function (values) {
                    assert.equal(values.length, 2);
                    var first = values[0], second = values[1];
                    assert.equal(first.name, 'testing2');
                    assert.equal(second.name, 'testing1');
                    done();
                }, done);
            }, done);
        });
        // --- suggest
        test('Suggest, back and forth', function () {
            disposables.push(extHost.registerCompletionItemProvider(defaultSelector, {
                provideCompletionItems: function (doc, pos) {
                    var a = new types.CompletionItem('item1');
                    var b = new types.CompletionItem('item2');
                    b.textEdit = types.TextEdit.replace(new types.Range(0, 4, 0, 8), 'foo'); // overwite after
                    var c = new types.CompletionItem('item3');
                    c.textEdit = types.TextEdit.replace(new types.Range(0, 1, 0, 6), 'foobar'); // overwite before & after
                    // snippet string!
                    var d = new types.CompletionItem('item4');
                    d.range = new types.Range(0, 1, 0, 4); // overwite before
                    d.insertText = new types.SnippetString('foo$0bar');
                    return [a, b, c, d];
                }
            }, []));
            return threadService.sync().then(function () {
                return commands.executeCommand('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4)).then(function (list) {
                    assert.ok(list instanceof types.CompletionList);
                    var values = list.items;
                    assert.ok(Array.isArray(values));
                    assert.equal(values.length, 4);
                    var first = values[0], second = values[1], third = values[2], fourth = values[3];
                    assert.equal(first.label, 'item1');
                    assert.equal(first.textEdit.newText, 'item1');
                    assert.equal(first.textEdit.range.start.line, 0);
                    assert.equal(first.textEdit.range.start.character, 0);
                    assert.equal(first.textEdit.range.end.line, 0);
                    assert.equal(first.textEdit.range.end.character, 4);
                    assert.equal(second.label, 'item2');
                    assert.equal(second.textEdit.newText, 'foo');
                    assert.equal(second.textEdit.range.start.line, 0);
                    assert.equal(second.textEdit.range.start.character, 4);
                    assert.equal(second.textEdit.range.end.line, 0);
                    assert.equal(second.textEdit.range.end.character, 8);
                    assert.equal(third.label, 'item3');
                    assert.equal(third.textEdit.newText, 'foobar');
                    assert.equal(third.textEdit.range.start.line, 0);
                    assert.equal(third.textEdit.range.start.character, 1);
                    assert.equal(third.textEdit.range.end.line, 0);
                    assert.equal(third.textEdit.range.end.character, 6);
                    assert.equal(fourth.label, 'item4');
                    assert.equal(fourth.textEdit, undefined);
                    assert.equal(fourth.range.start.line, 0);
                    assert.equal(fourth.range.start.character, 1);
                    assert.equal(fourth.range.end.line, 0);
                    assert.equal(fourth.range.end.character, 4);
                    assert.ok(fourth.insertText instanceof types.SnippetString);
                    assert.equal(fourth.insertText.value, 'foo$0bar');
                });
            });
        });
        test('Suggest, return CompletionList !array', function (done) {
            disposables.push(extHost.registerCompletionItemProvider(defaultSelector, {
                provideCompletionItems: function () {
                    var a = new types.CompletionItem('item1');
                    var b = new types.CompletionItem('item2');
                    return new types.CompletionList([a, b], true);
                }
            }, []));
            threadService.sync().then(function () {
                return commands.executeCommand('vscode.executeCompletionItemProvider', model.uri, new types.Position(0, 4)).then(function (list) {
                    assert.ok(list instanceof types.CompletionList);
                    assert.equal(list.isIncomplete, true);
                    done();
                });
            });
        });
        // --- quickfix
        test('QuickFix, back and forth', function () {
            disposables.push(extHost.registerCodeActionProvider(defaultSelector, {
                provideCodeActions: function () {
                    return [{ command: 'testing', title: 'Title', arguments: [1, 2, true] }];
                }
            }));
            return threadService.sync().then(function () {
                return commands.executeCommand('vscode.executeCodeActionProvider', model.uri, new types.Range(0, 0, 1, 1)).then(function (value) {
                    assert.equal(value.length, 1);
                    var first = value[0];
                    assert.equal(first.title, 'Title');
                    assert.equal(first.command, 'testing');
                    assert.deepEqual(first.arguments, [1, 2, true]);
                });
            });
        });
        // --- code lens
        test('CodeLens, back and forth', function () {
            var complexArg = {
                foo: function () { },
                bar: function () { },
                big: extHost
            };
            disposables.push(extHost.registerCodeLensProvider(defaultSelector, {
                provideCodeLenses: function () {
                    return [new types.CodeLens(new types.Range(0, 0, 1, 1), { title: 'Title', command: 'cmd', arguments: [1, true, complexArg] })];
                }
            }));
            return threadService.sync().then(function () {
                return commands.executeCommand('vscode.executeCodeLensProvider', model.uri).then(function (value) {
                    assert.equal(value.length, 1);
                    var first = value[0];
                    assert.equal(first.command.title, 'Title');
                    assert.equal(first.command.command, 'cmd');
                    assert.equal(first.command.arguments[0], 1);
                    assert.equal(first.command.arguments[1], true);
                    assert.equal(first.command.arguments[2], complexArg);
                });
            });
        });
        test('Links, back and forth', function () {
            disposables.push(extHost.registerDocumentLinkProvider(defaultSelector, {
                provideDocumentLinks: function () {
                    return [new types.DocumentLink(new types.Range(0, 0, 0, 20), uri_1.default.parse('foo:bar'))];
                }
            }));
            return threadService.sync().then(function () {
                return commands.executeCommand('vscode.executeLinkProvider', model.uri).then(function (value) {
                    assert.equal(value.length, 1);
                    var first = value[0];
                    assert.equal(first.target.toString(), 'foo:bar');
                    assert.equal(first.range.start.line, 0);
                    assert.equal(first.range.start.character, 0);
                    assert.equal(first.range.end.line, 0);
                    assert.equal(first.range.end.character, 20);
                });
            });
        });
    });
});
//# sourceMappingURL=extHostApiCommands.test.js.map