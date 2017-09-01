define(["require", "exports", "assert", "vs/base/common/uri", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/editor/common/model/model", "vs/editor/common/editorCommon", "vs/editor/common/modes", "vs/editor/contrib/suggest/browser/suggestModel", "vs/editor/test/common/mocks/mockCodeEditor", "vs/platform/instantiation/common/serviceCollection", "vs/platform/instantiation/common/instantiationService", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/test/common/mockKeybindingService", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils"], function (require, exports, assert, uri_1, lifecycle_1, winjs_base_1, model_1, editorCommon_1, modes_1, suggestModel_1, mockCodeEditor_1, serviceCollection_1, instantiationService_1, contextkey_1, mockKeybindingService_1, telemetry_1, telemetryUtils_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createMockEditor(model) {
        var contextKeyService = new mockKeybindingService_1.MockContextKeyService();
        var telemetryService = telemetryUtils_1.NullTelemetryService;
        var instantiationService = new instantiationService_1.InstantiationService(new serviceCollection_1.ServiceCollection([contextkey_1.IContextKeyService, contextKeyService], [telemetry_1.ITelemetryService, telemetryService]));
        var editor = new mockCodeEditor_1.MockCodeEditor(new mockCodeEditor_1.MockScopeLocation(), {}, instantiationService, contextKeyService);
        editor.setModel(model);
        return editor;
    }
    suite('SuggestModel - Context', function () {
        var model;
        setup(function () {
            model = model_1.Model.createFromString('Das Pferd frisst keinen Gurkensalat - Philipp Reis 1861.\nWer hat\'s erfunden?');
        });
        teardown(function () {
            model.dispose();
        });
        test('Context - shouldAutoTrigger', function () {
            function assertAutoTrigger(offset, expected) {
                var pos = model.getPositionAt(offset);
                var editor = createMockEditor(model);
                editor.setPosition(pos);
                assert.equal(suggestModel_1.LineContext.shouldAutoTrigger(editor), expected);
                editor.dispose();
            }
            assertAutoTrigger(3, true); // end of word, Das|
            assertAutoTrigger(4, false); // no word Das |
            assertAutoTrigger(1, false); // middle of word D|as
            assertAutoTrigger(55, false); // number, 1861|
        });
    });
    suite('SuggestModel - TriggerAndCancelOracle', function () {
        var alwaysEmptySupport = {
            provideCompletionItems: function (doc, pos) {
                return {
                    incomplete: false,
                    suggestions: []
                };
            }
        };
        var alwaysSomethingSupport = {
            provideCompletionItems: function (doc, pos) {
                return {
                    incomplete: false,
                    suggestions: [{
                            label: doc.getWordUntilPosition(pos).word,
                            type: 'property',
                            insertText: 'foofoo'
                        }]
                };
            }
        };
        var disposables = [];
        var model;
        setup(function () {
            disposables = lifecycle_1.dispose(disposables);
            model = model_1.Model.createFromString('abc def', undefined, undefined, uri_1.default.parse('test:somefile.ttt'));
            disposables.push(model);
        });
        function withOracle(callback) {
            return new winjs_base_1.TPromise(function (resolve, reject) {
                var editor = createMockEditor(model);
                var oracle = new suggestModel_1.SuggestModel(editor);
                disposables.push(oracle, editor);
                try {
                    resolve(callback(oracle, editor));
                }
                catch (err) {
                    reject(err);
                }
            });
        }
        function assertEvent(event, action, assert) {
            return new winjs_base_1.TPromise(function (resolve, reject) {
                var sub = event(function (e) {
                    sub.dispose();
                    try {
                        resolve(assert(e));
                    }
                    catch (err) {
                        reject(err);
                    }
                });
                try {
                    action();
                }
                catch (err) {
                    reject(err);
                }
            });
        }
        test('events - cancel/trigger', function () {
            return withOracle(function (model) {
                return winjs_base_1.TPromise.join([
                    assertEvent(model.onDidCancel, function () {
                        model.cancel();
                    }, function (event) {
                        assert.equal(event.retrigger, false);
                    }),
                    assertEvent(model.onDidCancel, function () {
                        model.cancel(true);
                    }, function (event) {
                        assert.equal(event.retrigger, true);
                    }),
                    // cancel on trigger
                    assertEvent(model.onDidCancel, function () {
                        model.trigger(false);
                    }, function (event) {
                        assert.equal(event.retrigger, false);
                    }),
                    assertEvent(model.onDidCancel, function () {
                        model.trigger(false, true);
                    }, function (event) {
                        assert.equal(event.retrigger, true);
                    }),
                    assertEvent(model.onDidTrigger, function () {
                        model.trigger(true);
                    }, function (event) {
                        assert.equal(event.auto, true);
                    }),
                    assertEvent(model.onDidTrigger, function () {
                        model.trigger(false);
                    }, function (event) {
                        assert.equal(event.auto, false);
                    })
                ]);
            });
        });
        test('events - suggest/empty', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, alwaysEmptySupport));
            return withOracle(function (model) {
                return winjs_base_1.TPromise.join([
                    assertEvent(model.onDidCancel, function () {
                        model.trigger(true);
                    }, function (event) {
                        assert.equal(event.retrigger, false);
                    }),
                    assertEvent(model.onDidSuggest, function () {
                        model.trigger(false);
                    }, function (event) {
                        assert.equal(event.auto, false);
                        assert.equal(event.isFrozen, false);
                        assert.equal(event.completionModel.items.length, 0);
                    })
                ]);
            });
        });
        test('trigger - on type', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, alwaysSomethingSupport));
            return withOracle(function (model, editor) {
                return assertEvent(model.onDidSuggest, function () {
                    editor.setPosition({ lineNumber: 1, column: 4 });
                    editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: 'd' });
                }, function (event) {
                    assert.equal(event.auto, true);
                    assert.equal(event.completionModel.items.length, 1);
                    var first = event.completionModel.items[0];
                    assert.equal(first.support, alwaysSomethingSupport);
                });
            });
        });
        test('#17400: Keep filtering suggestModel.ts after space', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, {
                provideCompletionItems: function (doc, pos) {
                    return {
                        currentWord: '',
                        incomplete: false,
                        suggestions: [{
                                label: 'My Table',
                                type: 'property',
                                insertText: 'My Table'
                            }]
                    };
                }
            }));
            model.setValue('');
            return withOracle(function (model, editor) {
                return assertEvent(model.onDidSuggest, function () {
                    // make sure completionModel starts here!
                    model.trigger(true);
                }, function (event) {
                    return assertEvent(model.onDidSuggest, function () {
                        editor.setPosition({ lineNumber: 1, column: 1 });
                        editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: 'My' });
                    }, function (event) {
                        assert.equal(event.auto, true);
                        assert.equal(event.completionModel.items.length, 1);
                        var first = event.completionModel.items[0];
                        assert.equal(first.suggestion.label, 'My Table');
                        return assertEvent(model.onDidSuggest, function () {
                            editor.setPosition({ lineNumber: 1, column: 3 });
                            editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: ' ' });
                        }, function (event) {
                            assert.equal(event.auto, true);
                            assert.equal(event.completionModel.items.length, 1);
                            var first = event.completionModel.items[0];
                            assert.equal(first.suggestion.label, 'My Table');
                        });
                    });
                });
            });
        });
        test('#21484: Trigger character always force a new completion session', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, {
                provideCompletionItems: function (doc, pos) {
                    return {
                        currentWord: '',
                        incomplete: false,
                        suggestions: [{
                                label: 'foo.bar',
                                type: 'property',
                                insertText: 'foo.bar',
                                overwriteBefore: pos.column - 1
                            }]
                    };
                }
            }));
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, {
                triggerCharacters: ['.'],
                provideCompletionItems: function (doc, pos) {
                    return {
                        currentWord: '',
                        incomplete: false,
                        suggestions: [{
                                label: 'boom',
                                type: 'property',
                                insertText: 'boom',
                                overwriteBefore: doc.getLineContent(pos.lineNumber)[pos.column - 2] === '.' ? 0 : pos.column - 1
                            }]
                    };
                }
            }));
            model.setValue('');
            return withOracle(function (model, editor) {
                return assertEvent(model.onDidSuggest, function () {
                    editor.setPosition({ lineNumber: 1, column: 1 });
                    editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: 'foo' });
                }, function (event) {
                    assert.equal(event.auto, true);
                    assert.equal(event.completionModel.items.length, 1);
                    var first = event.completionModel.items[0];
                    assert.equal(first.suggestion.label, 'foo.bar');
                    return assertEvent(model.onDidSuggest, function () {
                        editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: '.' });
                    }, function (event) {
                        assert.equal(event.auto, true);
                        assert.equal(event.completionModel.items.length, 2);
                        var _a = event.completionModel.items, first = _a[0], second = _a[1];
                        assert.equal(first.suggestion.label, 'foo.bar');
                        assert.equal(second.suggestion.label, 'boom');
                    });
                });
            });
        });
        test('Intellisense Completion doesn\'t respect space after equal sign (.html file), #29353 [1/2]', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, alwaysSomethingSupport));
            return withOracle(function (model, editor) {
                editor.getModel().setValue('fo');
                editor.setPosition({ lineNumber: 1, column: 3 });
                return assertEvent(model.onDidSuggest, function () {
                    model.trigger(false);
                }, function (event) {
                    assert.equal(event.auto, false);
                    assert.equal(event.isFrozen, false);
                    assert.equal(event.completionModel.items.length, 1);
                    return assertEvent(model.onDidCancel, function () {
                        editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: '+' });
                    }, function (event) {
                        assert.equal(event.retrigger, false);
                    });
                });
            });
        });
        test('Intellisense Completion doesn\'t respect space after equal sign (.html file), #29353 [2/2]', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, alwaysSomethingSupport));
            return withOracle(function (model, editor) {
                editor.getModel().setValue('fo');
                editor.setPosition({ lineNumber: 1, column: 3 });
                return assertEvent(model.onDidSuggest, function () {
                    model.trigger(false);
                }, function (event) {
                    assert.equal(event.auto, false);
                    assert.equal(event.isFrozen, false);
                    assert.equal(event.completionModel.items.length, 1);
                    return assertEvent(model.onDidCancel, function () {
                        editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: ' ' });
                    }, function (event) {
                        assert.equal(event.retrigger, false);
                    });
                });
            });
        });
        test('Incomplete suggestion results cause re-triggering when typing w/o further context, #28400 (1/2)', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, {
                provideCompletionItems: function (doc, pos) {
                    return {
                        incomplete: true,
                        suggestions: [{
                                label: 'foo',
                                type: 'property',
                                insertText: 'foo',
                                overwriteBefore: pos.column - 1
                            }]
                    };
                }
            }));
            return withOracle(function (model, editor) {
                editor.getModel().setValue('foo');
                editor.setPosition({ lineNumber: 1, column: 4 });
                return assertEvent(model.onDidSuggest, function () {
                    model.trigger(false);
                }, function (event) {
                    assert.equal(event.auto, false);
                    assert.equal(event.completionModel.incomplete, true);
                    assert.equal(event.completionModel.items.length, 1);
                    return assertEvent(model.onDidCancel, function () {
                        editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: ';' });
                    }, function (event) {
                        assert.equal(event.retrigger, false);
                    });
                });
            });
        });
        test('Incomplete suggestion results cause re-triggering when typing w/o further context, #28400 (2/2)', function () {
            disposables.push(modes_1.SuggestRegistry.register({ scheme: 'test' }, {
                provideCompletionItems: function (doc, pos) {
                    return {
                        incomplete: true,
                        suggestions: [{
                                label: 'foo;',
                                type: 'property',
                                insertText: 'foo',
                                overwriteBefore: pos.column - 1
                            }]
                    };
                }
            }));
            return withOracle(function (model, editor) {
                editor.getModel().setValue('foo');
                editor.setPosition({ lineNumber: 1, column: 4 });
                return assertEvent(model.onDidSuggest, function () {
                    model.trigger(false);
                }, function (event) {
                    assert.equal(event.auto, false);
                    assert.equal(event.completionModel.incomplete, true);
                    assert.equal(event.completionModel.items.length, 1);
                    return assertEvent(model.onDidSuggest, function () {
                        // while we cancel incrementally enriching the set of
                        // completions we still filter against those that we have
                        // until now
                        editor.trigger('keyboard', editorCommon_1.Handler.Type, { text: ';' });
                    }, function (event) {
                        assert.equal(event.auto, false);
                        assert.equal(event.completionModel.incomplete, true);
                        assert.equal(event.completionModel.items.length, 1);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=suggestModel.test.js.map