define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/objects", "vs/workbench/api/node/extHostTypeConverters", "vs/workbench/api/node/extHostTypes", "vs/base/common/async", "./extHost.protocol", "vs/base/common/strings", "vs/base/common/htmlContent", "vs/base/common/arrays", "vs/base/common/functional"], function (require, exports, winjs_base_1, objects_1, TypeConverters, extHostTypes_1, async_1, extHost_protocol_1, strings_1, htmlContent_1, arrays_1, functional_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // --- adapter
    var OutlineAdapter = (function () {
        function OutlineAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        OutlineAdapter.prototype.provideDocumentSymbols = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentSymbols(doc, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.fromSymbolInformation);
                }
                return undefined;
            });
        };
        return OutlineAdapter;
    }());
    var CodeLensAdapter = (function () {
        function CodeLensAdapter(documents, commands, heapService, provider) {
            this._documents = documents;
            this._commands = commands;
            this._heapService = heapService;
            this._provider = provider;
        }
        CodeLensAdapter.prototype.provideCodeLenses = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideCodeLenses(doc, token); }).then(function (lenses) {
                if (Array.isArray(lenses)) {
                    return lenses.map(function (lens) {
                        var id = _this._heapService.keep(lens);
                        return extHost_protocol_1.ObjectIdentifier.mixin({
                            range: TypeConverters.fromRange(lens.range),
                            command: _this._commands.toInternal(lens.command)
                        }, id);
                    });
                }
                return undefined;
            });
        };
        CodeLensAdapter.prototype.resolveCodeLens = function (resource, symbol) {
            var _this = this;
            var lens = this._heapService.get(extHost_protocol_1.ObjectIdentifier.of(symbol));
            if (!lens) {
                return undefined;
            }
            var resolve;
            if (typeof this._provider.resolveCodeLens !== 'function' || lens.isResolved) {
                resolve = winjs_base_1.TPromise.as(lens);
            }
            else {
                resolve = async_1.asWinJsPromise(function (token) { return _this._provider.resolveCodeLens(lens, token); });
            }
            return resolve.then(function (newLens) {
                newLens = newLens || lens;
                symbol.command = _this._commands.toInternal(newLens.command || CodeLensAdapter._badCmd);
                return symbol;
            });
        };
        CodeLensAdapter._badCmd = { command: 'missing', title: '<<MISSING COMMAND>>' };
        return CodeLensAdapter;
    }());
    var DefinitionAdapter = (function () {
        function DefinitionAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        DefinitionAdapter.prototype.provideDefinition = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDefinition(doc, pos, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.location.from);
                }
                else if (value) {
                    return TypeConverters.location.from(value);
                }
                return undefined;
            });
        };
        return DefinitionAdapter;
    }());
    var ImplementationAdapter = (function () {
        function ImplementationAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        ImplementationAdapter.prototype.provideImplementation = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideImplementation(doc, pos, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.location.from);
                }
                else if (value) {
                    return TypeConverters.location.from(value);
                }
                return undefined;
            });
        };
        return ImplementationAdapter;
    }());
    var TypeDefinitionAdapter = (function () {
        function TypeDefinitionAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        TypeDefinitionAdapter.prototype.provideTypeDefinition = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideTypeDefinition(doc, pos, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.location.from);
                }
                else if (value) {
                    return TypeConverters.location.from(value);
                }
                return undefined;
            });
        };
        return TypeDefinitionAdapter;
    }());
    var HoverAdapter = (function () {
        function HoverAdapter(_documents, _provider, _telemetryLog) {
            this._documents = _documents;
            this._provider = _provider;
            this._telemetryLog = _telemetryLog;
            //
        }
        HoverAdapter.prototype.provideHover = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideHover(doc, pos, token); }).then(function (value) {
                if (!value || arrays_1.isFalsyOrEmpty(value.contents)) {
                    return undefined;
                }
                if (!value.range) {
                    value.range = doc.getWordRangeAtPosition(pos);
                }
                if (!value.range) {
                    value.range = new extHostTypes_1.Range(pos, pos);
                }
                var result = TypeConverters.fromHover(value);
                // we wanna know which extension uses command links
                // because that is a potential trick-attack on users
                if (result.contents.some(function (h) { return htmlContent_1.containsCommandLink(h.value); })) {
                    _this._telemetryLog('usesCommandLink', { from: 'hover' });
                }
                return result;
            });
        };
        return HoverAdapter;
    }());
    var DocumentHighlightAdapter = (function () {
        function DocumentHighlightAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        DocumentHighlightAdapter.prototype.provideDocumentHighlights = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentHighlights(doc, pos, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(DocumentHighlightAdapter._convertDocumentHighlight);
                }
                return undefined;
            });
        };
        DocumentHighlightAdapter._convertDocumentHighlight = function (documentHighlight) {
            return {
                range: TypeConverters.fromRange(documentHighlight.range),
                kind: documentHighlight.kind
            };
        };
        return DocumentHighlightAdapter;
    }());
    var ReferenceAdapter = (function () {
        function ReferenceAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        ReferenceAdapter.prototype.provideReferences = function (resource, position, context) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideReferences(doc, pos, context, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.location.from);
                }
                return undefined;
            });
        };
        return ReferenceAdapter;
    }());
    var QuickFixAdapter = (function () {
        function QuickFixAdapter(documents, commands, diagnostics, heapService, provider) {
            this._documents = documents;
            this._commands = commands;
            this._diagnostics = diagnostics;
            this._provider = provider;
        }
        QuickFixAdapter.prototype.provideCodeActions = function (resource, range) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var ran = TypeConverters.toRange(range);
            var allDiagnostics = [];
            this._diagnostics.forEach(function (collection) {
                if (collection.has(resource)) {
                    for (var _i = 0, _a = collection.get(resource); _i < _a.length; _i++) {
                        var diagnostic = _a[_i];
                        if (diagnostic.range.intersection(ran)) {
                            allDiagnostics.push(diagnostic);
                        }
                    }
                }
            });
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideCodeActions(doc, ran, { diagnostics: allDiagnostics }, token); }).then(function (commands) {
                if (!Array.isArray(commands)) {
                    return undefined;
                }
                return commands.map(function (command) { return _this._commands.toInternal(command); });
            });
        };
        return QuickFixAdapter;
    }());
    var DocumentFormattingAdapter = (function () {
        function DocumentFormattingAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        DocumentFormattingAdapter.prototype.provideDocumentFormattingEdits = function (resource, options) {
            var _this = this;
            var document = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentFormattingEdits(document, options, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.TextEdit.from);
                }
                return undefined;
            });
        };
        return DocumentFormattingAdapter;
    }());
    var RangeFormattingAdapter = (function () {
        function RangeFormattingAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        RangeFormattingAdapter.prototype.provideDocumentRangeFormattingEdits = function (resource, range, options) {
            var _this = this;
            var document = this._documents.getDocumentData(resource).document;
            var ran = TypeConverters.toRange(range);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentRangeFormattingEdits(document, ran, options, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.TextEdit.from);
                }
                return undefined;
            });
        };
        return RangeFormattingAdapter;
    }());
    var OnTypeFormattingAdapter = (function () {
        function OnTypeFormattingAdapter(documents, provider) {
            this.autoFormatTriggerCharacters = []; // not here
            this._documents = documents;
            this._provider = provider;
        }
        OnTypeFormattingAdapter.prototype.provideOnTypeFormattingEdits = function (resource, position, ch, options) {
            var _this = this;
            var document = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideOnTypeFormattingEdits(document, pos, ch, options, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(TypeConverters.TextEdit.from);
                }
                return undefined;
            });
        };
        return OnTypeFormattingAdapter;
    }());
    var NavigateTypeAdapter = (function () {
        function NavigateTypeAdapter(provider, heapService) {
            this._provider = provider;
            this._heapService = heapService;
        }
        NavigateTypeAdapter.prototype.provideWorkspaceSymbols = function (search) {
            var _this = this;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideWorkspaceSymbols(search, token); }).then(function (value) {
                if (Array.isArray(value)) {
                    return value.map(function (item) {
                        var id = _this._heapService.keep(item);
                        var result = TypeConverters.fromSymbolInformation(item);
                        return extHost_protocol_1.ObjectIdentifier.mixin(result, id);
                    });
                }
                return undefined;
            });
        };
        NavigateTypeAdapter.prototype.resolveWorkspaceSymbol = function (item) {
            var _this = this;
            if (typeof this._provider.resolveWorkspaceSymbol !== 'function') {
                return winjs_base_1.TPromise.as(item);
            }
            var symbolInfo = this._heapService.get(extHost_protocol_1.ObjectIdentifier.of(item));
            if (symbolInfo) {
                return async_1.asWinJsPromise(function (token) { return _this._provider.resolveWorkspaceSymbol(symbolInfo, token); }).then(function (value) {
                    return value && TypeConverters.fromSymbolInformation(value);
                });
            }
            return undefined;
        };
        return NavigateTypeAdapter;
    }());
    var RenameAdapter = (function () {
        function RenameAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        RenameAdapter.prototype.provideRenameEdits = function (resource, position, newName) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideRenameEdits(doc, pos, newName, token); }).then(function (value) {
                if (!value) {
                    return undefined;
                }
                var result = {
                    edits: []
                };
                for (var _i = 0, _a = value.entries(); _i < _a.length; _i++) {
                    var entry = _a[_i];
                    var uri = entry[0], textEdits = entry[1];
                    for (var _b = 0, textEdits_1 = textEdits; _b < textEdits_1.length; _b++) {
                        var textEdit = textEdits_1[_b];
                        result.edits.push({
                            resource: uri,
                            newText: textEdit.newText,
                            range: TypeConverters.fromRange(textEdit.range)
                        });
                    }
                }
                return result;
            }, function (err) {
                if (typeof err === 'string') {
                    return {
                        edits: undefined,
                        rejectReason: err
                    };
                }
                return winjs_base_1.TPromise.wrapError(err);
            });
        };
        return RenameAdapter;
    }());
    var SuggestAdapter = (function () {
        function SuggestAdapter(documents, commands, heapService, provider) {
            this._documents = documents;
            this._commands = commands;
            this._heapService = heapService;
            this._provider = provider;
        }
        SuggestAdapter.prototype.provideCompletionItems = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideCompletionItems(doc, pos, token); }).then(function (value) {
                var result = {
                    suggestions: [],
                };
                var list;
                if (!value) {
                    // undefined and null are valid results
                    return undefined;
                }
                else if (Array.isArray(value)) {
                    list = new extHostTypes_1.CompletionList(value);
                }
                else {
                    list = value;
                    result.incomplete = list.isIncomplete;
                }
                // the default text edit range
                var wordRangeBeforePos = (doc.getWordRangeAtPosition(pos) || new extHostTypes_1.Range(pos, pos))
                    .with({ end: pos });
                for (var _i = 0, _a = list.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    var suggestion = _this._convertCompletionItem(item, pos, wordRangeBeforePos);
                    // bad completion item
                    if (!suggestion) {
                        // converter did warn
                        continue;
                    }
                    extHost_protocol_1.ObjectIdentifier.mixin(suggestion, _this._heapService.keep(item));
                    result.suggestions.push(suggestion);
                }
                return result;
            });
        };
        SuggestAdapter.prototype.resolveCompletionItem = function (resource, position, suggestion) {
            var _this = this;
            if (typeof this._provider.resolveCompletionItem !== 'function') {
                return winjs_base_1.TPromise.as(suggestion);
            }
            var id = extHost_protocol_1.ObjectIdentifier.of(suggestion);
            var item = this._heapService.get(id);
            if (!item) {
                return winjs_base_1.TPromise.as(suggestion);
            }
            return async_1.asWinJsPromise(function (token) { return _this._provider.resolveCompletionItem(item, token); }).then(function (resolvedItem) {
                if (!resolvedItem) {
                    return suggestion;
                }
                var doc = _this._documents.getDocumentData(resource).document;
                var pos = TypeConverters.toPosition(position);
                var wordRangeBeforePos = (doc.getWordRangeAtPosition(pos) || new extHostTypes_1.Range(pos, pos)).with({ end: pos });
                var newSuggestion = _this._convertCompletionItem(resolvedItem, pos, wordRangeBeforePos);
                if (newSuggestion) {
                    objects_1.mixin(suggestion, newSuggestion, true);
                }
                return suggestion;
            });
        };
        SuggestAdapter.prototype._convertCompletionItem = function (item, position, defaultRange) {
            if (typeof item.label !== 'string' || item.label.length === 0) {
                console.warn('INVALID text edit -> must have at least a label');
                return undefined;
            }
            var result = {
                //
                label: item.label,
                type: TypeConverters.CompletionItemKind.from(item.kind),
                detail: item.detail,
                documentation: item.documentation,
                filterText: item.filterText,
                sortText: item.sortText,
                //
                insertText: undefined,
                additionalTextEdits: item.additionalTextEdits && item.additionalTextEdits.map(TypeConverters.TextEdit.from),
                command: this._commands.toInternal(item.command),
                commitCharacters: item.commitCharacters
            };
            // 'insertText'-logic
            if (item.textEdit) {
                result.insertText = item.textEdit.newText;
                result.snippetType = 'internal';
            }
            else if (typeof item.insertText === 'string') {
                result.insertText = item.insertText;
                result.snippetType = 'internal';
            }
            else if (item.insertText instanceof extHostTypes_1.SnippetString) {
                result.insertText = item.insertText.value;
                result.snippetType = 'textmate';
            }
            else {
                result.insertText = item.label;
                result.snippetType = 'internal';
            }
            // 'overwrite[Before|After]'-logic
            var range;
            if (item.textEdit) {
                range = item.textEdit.range;
            }
            else if (item.range) {
                range = item.range;
            }
            else {
                range = defaultRange;
            }
            result.overwriteBefore = position.character - range.start.character;
            result.overwriteAfter = range.end.character - position.character;
            if (!range.isSingleLine || range.start.line !== position.line) {
                console.warn('INVALID text edit -> must be single line and on the same line');
                return undefined;
            }
            return result;
        };
        return SuggestAdapter;
    }());
    var SignatureHelpAdapter = (function () {
        function SignatureHelpAdapter(documents, provider) {
            this._documents = documents;
            this._provider = provider;
        }
        SignatureHelpAdapter.prototype.provideSignatureHelp = function (resource, position) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            var pos = TypeConverters.toPosition(position);
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideSignatureHelp(doc, pos, token); }).then(function (value) {
                if (value) {
                    return TypeConverters.SignatureHelp.from(value);
                }
                return undefined;
            });
        };
        return SignatureHelpAdapter;
    }());
    var LinkProviderAdapter = (function () {
        function LinkProviderAdapter(documents, heapService, provider) {
            this._documents = documents;
            this._heapService = heapService;
            this._provider = provider;
        }
        LinkProviderAdapter.prototype.provideLinks = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentLinks(doc, token); }).then(function (links) {
                if (!Array.isArray(links)) {
                    return undefined;
                }
                var result = [];
                for (var _i = 0, links_1 = links; _i < links_1.length; _i++) {
                    var link = links_1[_i];
                    var data = TypeConverters.DocumentLink.from(link);
                    var id = _this._heapService.keep(link);
                    extHost_protocol_1.ObjectIdentifier.mixin(data, id);
                    result.push(data);
                }
                return result;
            });
        };
        LinkProviderAdapter.prototype.resolveLink = function (link) {
            var _this = this;
            if (typeof this._provider.resolveDocumentLink !== 'function') {
                return undefined;
            }
            var id = extHost_protocol_1.ObjectIdentifier.of(link);
            var item = this._heapService.get(id);
            if (!item) {
                return undefined;
            }
            return async_1.asWinJsPromise(function (token) { return _this._provider.resolveDocumentLink(item, token); }).then(function (value) {
                if (value) {
                    return TypeConverters.DocumentLink.from(value);
                }
                return undefined;
            });
        };
        return LinkProviderAdapter;
    }());
    var ColorProviderAdapter = (function () {
        function ColorProviderAdapter(_proxy, _documents, _colorFormatCache, _provider) {
            this._proxy = _proxy;
            this._documents = _documents;
            this._colorFormatCache = _colorFormatCache;
            this._provider = _provider;
        }
        ColorProviderAdapter.prototype.provideColors = function (resource) {
            var _this = this;
            var doc = this._documents.getDocumentData(resource).document;
            return async_1.asWinJsPromise(function (token) { return _this._provider.provideDocumentColors(doc, token); }).then(function (colors) {
                if (!Array.isArray(colors)) {
                    return [];
                }
                var newRawColorFormats = [];
                var getFormatId = function (format) {
                    var id = _this._colorFormatCache.get(format);
                    if (typeof id !== 'number') {
                        id = ColorProviderAdapter._colorFormatHandlePool++;
                        _this._colorFormatCache.set(format, id);
                        newRawColorFormats.push([id, format]);
                    }
                    return id;
                };
                var colorInfos = colors.map(function (ci) {
                    var availableFormats = ci.availableFormats.map(function (format) {
                        if (typeof format === 'string') {
                            return getFormatId(format);
                        }
                        else {
                            return [getFormatId(format.opaque), getFormatId(format.transparent)];
                        }
                    });
                    return {
                        color: [ci.color.red, ci.color.green, ci.color.blue, ci.color.alpha],
                        availableFormats: availableFormats,
                        range: TypeConverters.fromRange(ci.range)
                    };
                });
                _this._proxy.$registerColorFormats(newRawColorFormats);
                return colorInfos;
            });
        };
        ColorProviderAdapter._colorFormatHandlePool = 0;
        return ColorProviderAdapter;
    }());
    var ExtHostLanguageFeatures = (function () {
        function ExtHostLanguageFeatures(mainContext, documents, commands, heapMonitor, diagnostics) {
            this._adapter = new Map();
            this._colorFormatCache = new Map();
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadLanguageFeatures);
            this._telemetry = mainContext.get(extHost_protocol_1.MainContext.MainThreadTelemetry);
            this._documents = documents;
            this._commands = commands;
            this._heapService = heapMonitor;
            this._diagnostics = diagnostics;
        }
        ExtHostLanguageFeatures.prototype._createDisposable = function (handle) {
            var _this = this;
            return new extHostTypes_1.Disposable(function () {
                _this._adapter.delete(handle);
                _this._proxy.$unregister(handle);
            });
        };
        ExtHostLanguageFeatures.prototype._nextHandle = function () {
            return ExtHostLanguageFeatures._handlePool++;
        };
        ExtHostLanguageFeatures.prototype._withAdapter = function (handle, ctor, callback) {
            var adapter = this._adapter.get(handle);
            if (!(adapter instanceof ctor)) {
                return winjs_base_1.TPromise.wrapError(new Error('no adapter found'));
            }
            return callback(adapter);
        };
        // --- outline
        ExtHostLanguageFeatures.prototype.registerDocumentSymbolProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new OutlineAdapter(this._documents, provider));
            this._proxy.$registerOutlineSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentSymbols = function (handle, resource) {
            return this._withAdapter(handle, OutlineAdapter, function (adapter) { return adapter.provideDocumentSymbols(resource); });
        };
        // --- code lens
        ExtHostLanguageFeatures.prototype.registerCodeLensProvider = function (selector, provider) {
            var _this = this;
            var handle = this._nextHandle();
            var eventHandle = typeof provider.onDidChangeCodeLenses === 'function' ? this._nextHandle() : undefined;
            this._adapter.set(handle, new CodeLensAdapter(this._documents, this._commands.converter, this._heapService, provider));
            this._proxy.$registerCodeLensSupport(handle, selector, eventHandle);
            var result = this._createDisposable(handle);
            if (eventHandle !== undefined) {
                var subscription = provider.onDidChangeCodeLenses(function (_) { return _this._proxy.$emitCodeLensEvent(eventHandle); });
                result = extHostTypes_1.Disposable.from(result, subscription);
            }
            return result;
        };
        ExtHostLanguageFeatures.prototype.$provideCodeLenses = function (handle, resource) {
            return this._withAdapter(handle, CodeLensAdapter, function (adapter) { return adapter.provideCodeLenses(resource); });
        };
        ExtHostLanguageFeatures.prototype.$resolveCodeLens = function (handle, resource, symbol) {
            return this._withAdapter(handle, CodeLensAdapter, function (adapter) { return adapter.resolveCodeLens(resource, symbol); });
        };
        // --- declaration
        ExtHostLanguageFeatures.prototype.registerDefinitionProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new DefinitionAdapter(this._documents, provider));
            this._proxy.$registerDeclaractionSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDefinition = function (handle, resource, position) {
            return this._withAdapter(handle, DefinitionAdapter, function (adapter) { return adapter.provideDefinition(resource, position); });
        };
        ExtHostLanguageFeatures.prototype.registerImplementationProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new ImplementationAdapter(this._documents, provider));
            this._proxy.$registerImplementationSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideImplementation = function (handle, resource, position) {
            return this._withAdapter(handle, ImplementationAdapter, function (adapter) { return adapter.provideImplementation(resource, position); });
        };
        ExtHostLanguageFeatures.prototype.registerTypeDefinitionProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new TypeDefinitionAdapter(this._documents, provider));
            this._proxy.$registerTypeDefinitionSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideTypeDefinition = function (handle, resource, position) {
            return this._withAdapter(handle, TypeDefinitionAdapter, function (adapter) { return adapter.provideTypeDefinition(resource, position); });
        };
        // --- extra info
        ExtHostLanguageFeatures.prototype.registerHoverProvider = function (selector, provider, extensionId) {
            var _this = this;
            var handle = this._nextHandle();
            this._adapter.set(handle, new HoverAdapter(this._documents, provider, functional_1.once(function (name, data) {
                data['extension'] = extensionId;
                _this._telemetry.$publicLog(name, data);
            })));
            this._proxy.$registerHoverProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideHover = function (handle, resource, position) {
            return this._withAdapter(handle, HoverAdapter, function (adpater) { return adpater.provideHover(resource, position); });
        };
        // --- occurrences
        ExtHostLanguageFeatures.prototype.registerDocumentHighlightProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new DocumentHighlightAdapter(this._documents, provider));
            this._proxy.$registerDocumentHighlightProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentHighlights = function (handle, resource, position) {
            return this._withAdapter(handle, DocumentHighlightAdapter, function (adapter) { return adapter.provideDocumentHighlights(resource, position); });
        };
        // --- references
        ExtHostLanguageFeatures.prototype.registerReferenceProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new ReferenceAdapter(this._documents, provider));
            this._proxy.$registerReferenceSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideReferences = function (handle, resource, position, context) {
            return this._withAdapter(handle, ReferenceAdapter, function (adapter) { return adapter.provideReferences(resource, position, context); });
        };
        // --- quick fix
        ExtHostLanguageFeatures.prototype.registerCodeActionProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new QuickFixAdapter(this._documents, this._commands.converter, this._diagnostics, this._heapService, provider));
            this._proxy.$registerQuickFixSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideCodeActions = function (handle, resource, range) {
            return this._withAdapter(handle, QuickFixAdapter, function (adapter) { return adapter.provideCodeActions(resource, range); });
        };
        // --- formatting
        ExtHostLanguageFeatures.prototype.registerDocumentFormattingEditProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new DocumentFormattingAdapter(this._documents, provider));
            this._proxy.$registerDocumentFormattingSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentFormattingEdits = function (handle, resource, options) {
            return this._withAdapter(handle, DocumentFormattingAdapter, function (adapter) { return adapter.provideDocumentFormattingEdits(resource, options); });
        };
        ExtHostLanguageFeatures.prototype.registerDocumentRangeFormattingEditProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new RangeFormattingAdapter(this._documents, provider));
            this._proxy.$registerRangeFormattingSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentRangeFormattingEdits = function (handle, resource, range, options) {
            return this._withAdapter(handle, RangeFormattingAdapter, function (adapter) { return adapter.provideDocumentRangeFormattingEdits(resource, range, options); });
        };
        ExtHostLanguageFeatures.prototype.registerOnTypeFormattingEditProvider = function (selector, provider, triggerCharacters) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new OnTypeFormattingAdapter(this._documents, provider));
            this._proxy.$registerOnTypeFormattingSupport(handle, selector, triggerCharacters);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideOnTypeFormattingEdits = function (handle, resource, position, ch, options) {
            return this._withAdapter(handle, OnTypeFormattingAdapter, function (adapter) { return adapter.provideOnTypeFormattingEdits(resource, position, ch, options); });
        };
        // --- navigate types
        ExtHostLanguageFeatures.prototype.registerWorkspaceSymbolProvider = function (provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new NavigateTypeAdapter(provider, this._heapService));
            this._proxy.$registerNavigateTypeSupport(handle);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideWorkspaceSymbols = function (handle, search) {
            return this._withAdapter(handle, NavigateTypeAdapter, function (adapter) { return adapter.provideWorkspaceSymbols(search); });
        };
        ExtHostLanguageFeatures.prototype.$resolveWorkspaceSymbol = function (handle, symbol) {
            return this._withAdapter(handle, NavigateTypeAdapter, function (adapter) { return adapter.resolveWorkspaceSymbol(symbol); });
        };
        // --- rename
        ExtHostLanguageFeatures.prototype.registerRenameProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new RenameAdapter(this._documents, provider));
            this._proxy.$registerRenameSupport(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideRenameEdits = function (handle, resource, position, newName) {
            return this._withAdapter(handle, RenameAdapter, function (adapter) { return adapter.provideRenameEdits(resource, position, newName); });
        };
        // --- suggestion
        ExtHostLanguageFeatures.prototype.registerCompletionItemProvider = function (selector, provider, triggerCharacters) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new SuggestAdapter(this._documents, this._commands.converter, this._heapService, provider));
            this._proxy.$registerSuggestSupport(handle, selector, triggerCharacters);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideCompletionItems = function (handle, resource, position) {
            return this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.provideCompletionItems(resource, position); });
        };
        ExtHostLanguageFeatures.prototype.$resolveCompletionItem = function (handle, resource, position, suggestion) {
            return this._withAdapter(handle, SuggestAdapter, function (adapter) { return adapter.resolveCompletionItem(resource, position, suggestion); });
        };
        // --- parameter hints
        ExtHostLanguageFeatures.prototype.registerSignatureHelpProvider = function (selector, provider, triggerCharacters) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new SignatureHelpAdapter(this._documents, provider));
            this._proxy.$registerSignatureHelpProvider(handle, selector, triggerCharacters);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideSignatureHelp = function (handle, resource, position) {
            return this._withAdapter(handle, SignatureHelpAdapter, function (adapter) { return adapter.provideSignatureHelp(resource, position); });
        };
        // --- links
        ExtHostLanguageFeatures.prototype.registerDocumentLinkProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new LinkProviderAdapter(this._documents, this._heapService, provider));
            this._proxy.$registerDocumentLinkProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentLinks = function (handle, resource) {
            return this._withAdapter(handle, LinkProviderAdapter, function (adapter) { return adapter.provideLinks(resource); });
        };
        ExtHostLanguageFeatures.prototype.$resolveDocumentLink = function (handle, link) {
            return this._withAdapter(handle, LinkProviderAdapter, function (adapter) { return adapter.resolveLink(link); });
        };
        ExtHostLanguageFeatures.prototype.registerColorProvider = function (selector, provider) {
            var handle = this._nextHandle();
            this._adapter.set(handle, new ColorProviderAdapter(this._proxy, this._documents, this._colorFormatCache, provider));
            this._proxy.$registerDocumentColorProvider(handle, selector);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures.prototype.$provideDocumentColors = function (handle, resource) {
            return this._withAdapter(handle, ColorProviderAdapter, function (adapter) { return adapter.provideColors(resource); });
        };
        // --- configuration
        ExtHostLanguageFeatures.prototype.setLanguageConfiguration = function (languageId, configuration) {
            var wordPattern = configuration.wordPattern;
            // check for a valid word pattern
            if (wordPattern && strings_1.regExpLeadsToEndlessLoop(wordPattern)) {
                throw new Error("Invalid language configuration: wordPattern '" + wordPattern + "' is not allowed to match the empty string.");
            }
            // word definition
            if (wordPattern) {
                this._documents.setWordDefinitionFor(languageId, wordPattern);
            }
            else {
                this._documents.setWordDefinitionFor(languageId, null);
            }
            var handle = this._nextHandle();
            this._proxy.$setLanguageConfiguration(handle, languageId, configuration);
            return this._createDisposable(handle);
        };
        ExtHostLanguageFeatures._handlePool = 0;
        return ExtHostLanguageFeatures;
    }());
    exports.ExtHostLanguageFeatures = ExtHostLanguageFeatures;
});
//# sourceMappingURL=extHostLanguageFeatures.js.map