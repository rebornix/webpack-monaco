define(["require", "exports", "assert", "vs/editor/contrib/suggest/browser/suggest", "vs/editor/contrib/suggest/browser/completionModel"], function (require, exports, assert, suggest_1, completionModel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('CompletionModel', function () {
        function createSuggestItem(label, overwriteBefore, type, incomplete, position) {
            if (type === void 0) { type = 'property'; }
            if (incomplete === void 0) { incomplete = false; }
            if (position === void 0) { position = { lineNumber: 1, column: 1 }; }
            return new (function () {
                function class_1() {
                    this.position = position;
                    this.suggestion = {
                        label: label,
                        overwriteBefore: overwriteBefore,
                        insertText: label,
                        type: type
                    };
                    this.container = {
                        incomplete: incomplete,
                        suggestions: [this.suggestion]
                    };
                    this.support = {
                        provideCompletionItems: function () {
                            return;
                        }
                    };
                }
                class_1.prototype.resolve = function () {
                    return null;
                };
                return class_1;
            }());
        }
        var model;
        setup(function () {
            model = new completionModel_1.CompletionModel([
                createSuggestItem('foo', 3),
                createSuggestItem('Foo', 3),
                createSuggestItem('foo', 2),
            ], 1, {
                leadingLineContent: 'foo',
                characterCountDelta: 0
            });
        });
        test('filtering - cached', function () {
            var itemsNow = model.items;
            var itemsThen = model.items;
            assert.ok(itemsNow === itemsThen);
            // still the same context
            model.lineContext = { leadingLineContent: 'foo', characterCountDelta: 0 };
            itemsThen = model.items;
            assert.ok(itemsNow === itemsThen);
            // different context, refilter
            model.lineContext = { leadingLineContent: 'foo1', characterCountDelta: 1 };
            itemsThen = model.items;
            assert.ok(itemsNow !== itemsThen);
        });
        test('complete/incomplete', function () {
            assert.equal(model.incomplete, false);
            var incompleteModel = new completionModel_1.CompletionModel([
                createSuggestItem('foo', 3, undefined, true),
                createSuggestItem('foo', 2),
            ], 1, {
                leadingLineContent: 'foo',
                characterCountDelta: 0
            });
            assert.equal(incompleteModel.incomplete, true);
        });
        test('replaceIncomplete', function () {
            var completeItem = createSuggestItem('foobar', 1, undefined, false, { lineNumber: 1, column: 2 });
            var incompleteItem = createSuggestItem('foofoo', 1, undefined, true, { lineNumber: 1, column: 2 });
            var model = new completionModel_1.CompletionModel([completeItem, incompleteItem], 2, { leadingLineContent: 'f', characterCountDelta: 0 });
            assert.equal(model.incomplete, true);
            assert.equal(model.items.length, 2);
            var _a = model.resolveIncompleteInfo(), complete = _a.complete, incomplete = _a.incomplete;
            assert.equal(incomplete.length, 1);
            assert.ok(incomplete[0] === incompleteItem.support);
            assert.equal(complete.length, 1);
            assert.ok(complete[0] === completeItem);
        });
        test('proper current word when length=0, #16380', function () {
            model = new completionModel_1.CompletionModel([
                createSuggestItem('    </div', 4),
                createSuggestItem('a', 0),
                createSuggestItem('p', 0),
                createSuggestItem('    </tag', 4),
                createSuggestItem('    XYZ', 4),
            ], 1, {
                leadingLineContent: '   <',
                characterCountDelta: 0
            });
            assert.equal(model.items.length, 4);
            var _a = model.items, a = _a[0], b = _a[1], c = _a[2], d = _a[3];
            assert.equal(a.suggestion.label, '    </div');
            assert.equal(b.suggestion.label, '    </tag');
            assert.equal(c.suggestion.label, 'a');
            assert.equal(d.suggestion.label, 'p');
        });
        test('keep snippet sorting with prefix: top, #25495', function () {
            model = new completionModel_1.CompletionModel([
                createSuggestItem('Snippet1', 1, 'snippet'),
                createSuggestItem('tnippet2', 1, 'snippet'),
                createSuggestItem('semver', 1, 'property'),
            ], 1, {
                leadingLineContent: 's',
                characterCountDelta: 0
            }, 'top');
            assert.equal(model.items.length, 2);
            var _a = model.items, a = _a[0], b = _a[1];
            assert.equal(a.suggestion.label, 'Snippet1');
            assert.equal(b.suggestion.label, 'semver');
            assert.ok(a.score < b.score); // snippet really promoted
        });
        test('keep snippet sorting with prefix: bottom, #25495', function () {
            model = new completionModel_1.CompletionModel([
                createSuggestItem('snippet1', 1, 'snippet'),
                createSuggestItem('tnippet2', 1, 'snippet'),
                createSuggestItem('Semver', 1, 'property'),
            ], 1, {
                leadingLineContent: 's',
                characterCountDelta: 0
            }, 'bottom');
            assert.equal(model.items.length, 2);
            var _a = model.items, a = _a[0], b = _a[1];
            assert.equal(a.suggestion.label, 'Semver');
            assert.equal(b.suggestion.label, 'snippet1');
            assert.ok(a.score < b.score); // snippet really demoted
        });
        test('keep snippet sorting with prefix: inline, #25495', function () {
            model = new completionModel_1.CompletionModel([
                createSuggestItem('snippet1', 1, 'snippet'),
                createSuggestItem('tnippet2', 1, 'snippet'),
                createSuggestItem('Semver', 1, 'property'),
            ], 1, {
                leadingLineContent: 's',
                characterCountDelta: 0
            }, 'inline');
            assert.equal(model.items.length, 2);
            var _a = model.items, a = _a[0], b = _a[1];
            assert.equal(a.suggestion.label, 'snippet1');
            assert.equal(b.suggestion.label, 'Semver');
            assert.ok(a.score > b.score); // snippet really demoted
        });
        test('filterText seems ignored in autocompletion, #26874', function () {
            var item1 = createSuggestItem('Map - java.util', 1, 'property');
            item1.suggestion.filterText = 'Map';
            var item2 = createSuggestItem('Map - java.util', 1, 'property');
            model = new completionModel_1.CompletionModel([item1, item2], 1, {
                leadingLineContent: 'M',
                characterCountDelta: 0
            });
            assert.equal(model.items.length, 2);
            model.lineContext = {
                leadingLineContent: 'Map ',
                characterCountDelta: 3
            };
            assert.equal(model.items.length, 1);
        });
        test('Vscode 1.12 no longer obeys \'sortText\' in completion items (from language server), #26096', function () {
            var item1 = createSuggestItem('<- groups', 2, 'property', false, { lineNumber: 1, column: 3 });
            item1.suggestion.filterText = '  groups';
            item1.suggestion.sortText = '00002';
            var item2 = createSuggestItem('source', 0, 'property', false, { lineNumber: 1, column: 3 });
            item2.suggestion.filterText = 'source';
            item2.suggestion.sortText = '00001';
            var items = [item1, item2].sort(suggest_1.getSuggestionComparator('inline'));
            model = new completionModel_1.CompletionModel(items, 3, {
                leadingLineContent: '  ',
                characterCountDelta: 0
            });
            assert.equal(model.items.length, 2);
            var _a = model.items, first = _a[0], second = _a[1];
            assert.equal(first.suggestion.label, 'source');
            assert.equal(second.suggestion.label, '<- groups');
        });
    });
});
//# sourceMappingURL=completionModel.test.js.map