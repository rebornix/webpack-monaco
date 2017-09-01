var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/event", "vs/editor/common/modes", "vs/workbench/parts/search/common/search", "vs/base/common/async", "../node/extHost.protocol", "vs/editor/common/modes/languageConfigurationRegistry", "./mainThreadHeapService", "vs/editor/common/services/modeService", "vs/editor/contrib/colorPicker/common/colorFormatter", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, winjs_base_1, event_1, modes, search_1, async_1, extHost_protocol_1, languageConfigurationRegistry_1, mainThreadHeapService_1, modeService_1, colorFormatter_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadLanguageFeatures = (function () {
        function MainThreadLanguageFeatures(extHostContext, heapService, modeService) {
            this._registrations = Object.create(null);
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostLanguageFeatures);
            this._heapService = heapService;
            this._modeService = modeService;
            this._formatters = new Map();
        }
        MainThreadLanguageFeatures.prototype.dispose = function () {
            for (var key in this._registrations) {
                this._registrations[key].dispose();
            }
        };
        MainThreadLanguageFeatures.prototype.$unregister = function (handle) {
            var registration = this._registrations[handle];
            if (registration) {
                registration.dispose();
                delete this._registrations[handle];
            }
            return undefined;
        };
        // --- outline
        MainThreadLanguageFeatures.prototype.$registerOutlineSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.DocumentSymbolProviderRegistry.register(selector, {
                provideDocumentSymbols: function (model, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideDocumentSymbols(handle, model.uri));
                }
            });
            return undefined;
        };
        // --- code lens
        MainThreadLanguageFeatures.prototype.$registerCodeLensSupport = function (handle, selector, eventHandle) {
            var _this = this;
            var provider = {
                provideCodeLenses: function (model, token) {
                    return _this._heapService.trackRecursive(async_1.wireCancellationToken(token, _this._proxy.$provideCodeLenses(handle, model.uri)));
                },
                resolveCodeLens: function (model, codeLens, token) {
                    return _this._heapService.trackRecursive(async_1.wireCancellationToken(token, _this._proxy.$resolveCodeLens(handle, model.uri, codeLens)));
                }
            };
            if (typeof eventHandle === 'number') {
                var emitter = new event_1.Emitter();
                this._registrations[eventHandle] = emitter;
                provider.onDidChange = emitter.event;
            }
            this._registrations[handle] = modes.CodeLensProviderRegistry.register(selector, provider);
            return undefined;
        };
        MainThreadLanguageFeatures.prototype.$emitCodeLensEvent = function (eventHandle, event) {
            var obj = this._registrations[eventHandle];
            if (obj instanceof event_1.Emitter) {
                obj.fire(event);
            }
            return undefined;
        };
        // --- declaration
        MainThreadLanguageFeatures.prototype.$registerDeclaractionSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.DefinitionProviderRegistry.register(selector, {
                provideDefinition: function (model, position, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideDefinition(handle, model.uri, position));
                }
            });
            return undefined;
        };
        MainThreadLanguageFeatures.prototype.$registerImplementationSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.ImplementationProviderRegistry.register(selector, {
                provideImplementation: function (model, position, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideImplementation(handle, model.uri, position));
                }
            });
            return undefined;
        };
        MainThreadLanguageFeatures.prototype.$registerTypeDefinitionSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.TypeDefinitionProviderRegistry.register(selector, {
                provideTypeDefinition: function (model, position, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideTypeDefinition(handle, model.uri, position));
                }
            });
            return undefined;
        };
        // --- extra info
        MainThreadLanguageFeatures.prototype.$registerHoverProvider = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.HoverProviderRegistry.register(selector, {
                provideHover: function (model, position, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideHover(handle, model.uri, position));
                }
            });
            return undefined;
        };
        // --- occurrences
        MainThreadLanguageFeatures.prototype.$registerDocumentHighlightProvider = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.DocumentHighlightProviderRegistry.register(selector, {
                provideDocumentHighlights: function (model, position, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideDocumentHighlights(handle, model.uri, position));
                }
            });
            return undefined;
        };
        // --- references
        MainThreadLanguageFeatures.prototype.$registerReferenceSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.ReferenceProviderRegistry.register(selector, {
                provideReferences: function (model, position, context, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideReferences(handle, model.uri, position, context));
                }
            });
            return undefined;
        };
        // --- quick fix
        MainThreadLanguageFeatures.prototype.$registerQuickFixSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.CodeActionProviderRegistry.register(selector, {
                provideCodeActions: function (model, range, token) {
                    return _this._heapService.trackRecursive(async_1.wireCancellationToken(token, _this._proxy.$provideCodeActions(handle, model.uri, range)));
                }
            });
            return undefined;
        };
        // --- formatting
        MainThreadLanguageFeatures.prototype.$registerDocumentFormattingSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.DocumentFormattingEditProviderRegistry.register(selector, {
                provideDocumentFormattingEdits: function (model, options, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideDocumentFormattingEdits(handle, model.uri, options));
                }
            });
            return undefined;
        };
        MainThreadLanguageFeatures.prototype.$registerRangeFormattingSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.DocumentRangeFormattingEditProviderRegistry.register(selector, {
                provideDocumentRangeFormattingEdits: function (model, range, options, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideDocumentRangeFormattingEdits(handle, model.uri, range, options));
                }
            });
            return undefined;
        };
        MainThreadLanguageFeatures.prototype.$registerOnTypeFormattingSupport = function (handle, selector, autoFormatTriggerCharacters) {
            var _this = this;
            this._registrations[handle] = modes.OnTypeFormattingEditProviderRegistry.register(selector, {
                autoFormatTriggerCharacters: autoFormatTriggerCharacters,
                provideOnTypeFormattingEdits: function (model, position, ch, options, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideOnTypeFormattingEdits(handle, model.uri, position, ch, options));
                }
            });
            return undefined;
        };
        // --- navigate type
        MainThreadLanguageFeatures.prototype.$registerNavigateTypeSupport = function (handle) {
            var _this = this;
            this._registrations[handle] = search_1.WorkspaceSymbolProviderRegistry.register({
                provideWorkspaceSymbols: function (search) {
                    return _this._heapService.trackRecursive(_this._proxy.$provideWorkspaceSymbols(handle, search));
                },
                resolveWorkspaceSymbol: function (item) {
                    return _this._proxy.$resolveWorkspaceSymbol(handle, item);
                }
            });
            return undefined;
        };
        // --- rename
        MainThreadLanguageFeatures.prototype.$registerRenameSupport = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.RenameProviderRegistry.register(selector, {
                provideRenameEdits: function (model, position, newName, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideRenameEdits(handle, model.uri, position, newName));
                }
            });
            return undefined;
        };
        // --- suggest
        MainThreadLanguageFeatures.prototype.$registerSuggestSupport = function (handle, selector, triggerCharacters) {
            var _this = this;
            this._registrations[handle] = modes.SuggestRegistry.register(selector, {
                triggerCharacters: triggerCharacters,
                provideCompletionItems: function (model, position, token) {
                    return _this._heapService.trackRecursive(async_1.wireCancellationToken(token, _this._proxy.$provideCompletionItems(handle, model.uri, position)));
                },
                resolveCompletionItem: function (model, position, suggestion, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$resolveCompletionItem(handle, model.uri, position, suggestion));
                }
            });
            return undefined;
        };
        // --- parameter hints
        MainThreadLanguageFeatures.prototype.$registerSignatureHelpProvider = function (handle, selector, triggerCharacter) {
            var _this = this;
            this._registrations[handle] = modes.SignatureHelpProviderRegistry.register(selector, {
                signatureHelpTriggerCharacters: triggerCharacter,
                provideSignatureHelp: function (model, position, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$provideSignatureHelp(handle, model.uri, position));
                }
            });
            return undefined;
        };
        // --- links
        MainThreadLanguageFeatures.prototype.$registerDocumentLinkProvider = function (handle, selector) {
            var _this = this;
            this._registrations[handle] = modes.LinkProviderRegistry.register(selector, {
                provideLinks: function (model, token) {
                    return _this._heapService.trackRecursive(async_1.wireCancellationToken(token, _this._proxy.$provideDocumentLinks(handle, model.uri)));
                },
                resolveLink: function (link, token) {
                    return async_1.wireCancellationToken(token, _this._proxy.$resolveDocumentLink(handle, link));
                }
            });
            return undefined;
        };
        // --- colors
        MainThreadLanguageFeatures.prototype.$registerDocumentColorProvider = function (handle, selector) {
            var _this = this;
            var proxy = this._proxy;
            this._registrations[handle] = modes.ColorProviderRegistry.register(selector, {
                provideColorRanges: function (model, token) {
                    return async_1.wireCancellationToken(token, proxy.$provideDocumentColors(handle, model.uri))
                        .then(function (documentColors) {
                        return documentColors.map(function (documentColor) {
                            var formatters = documentColor.availableFormats.map(function (f) {
                                if (typeof f === 'number') {
                                    return _this._formatters.get(f);
                                }
                                else {
                                    return new colorFormatter_1.CombinedColorFormatter(_this._formatters.get(f[0]), _this._formatters.get(f[1]));
                                }
                            });
                            var _a = documentColor.color, red = _a[0], green = _a[1], blue = _a[2], alpha = _a[3];
                            var color = {
                                red: red / 255.0,
                                green: green / 255.0,
                                blue: blue / 255.0,
                                alpha: alpha
                            };
                            return {
                                color: color,
                                formatters: formatters,
                                range: documentColor.range
                            };
                        });
                    });
                }
            });
            return winjs_base_1.TPromise.as(null);
        };
        MainThreadLanguageFeatures.prototype.$registerColorFormats = function (formats) {
            var _this = this;
            formats.forEach(function (f) { return _this._formatters.set(f[0], new colorFormatter_1.ColorFormatter(f[1])); });
            return winjs_base_1.TPromise.as(null);
        };
        // --- configuration
        MainThreadLanguageFeatures.prototype.$setLanguageConfiguration = function (handle, languageId, _configuration) {
            var configuration = {
                comments: _configuration.comments,
                brackets: _configuration.brackets,
                wordPattern: _configuration.wordPattern,
                indentationRules: _configuration.indentationRules,
                onEnterRules: _configuration.onEnterRules,
                autoClosingPairs: null,
                surroundingPairs: null,
                __electricCharacterSupport: null
            };
            if (_configuration.__characterPairSupport) {
                // backwards compatibility
                configuration.autoClosingPairs = _configuration.__characterPairSupport.autoClosingPairs;
            }
            if (_configuration.__electricCharacterSupport && _configuration.__electricCharacterSupport.docComment) {
                configuration.__electricCharacterSupport = {
                    docComment: {
                        open: _configuration.__electricCharacterSupport.docComment.open,
                        close: _configuration.__electricCharacterSupport.docComment.close
                    }
                };
            }
            var languageIdentifier = this._modeService.getLanguageIdentifier(languageId);
            if (languageIdentifier) {
                this._registrations[handle] = languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(languageIdentifier, configuration);
            }
            return undefined;
        };
        MainThreadLanguageFeatures = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadLanguageFeatures),
            __param(1, mainThreadHeapService_1.IHeapService),
            __param(2, modeService_1.IModeService)
        ], MainThreadLanguageFeatures);
        return MainThreadLanguageFeatures;
    }());
    exports.MainThreadLanguageFeatures = MainThreadLanguageFeatures;
});
//# sourceMappingURL=mainThreadLanguageFeatures.js.map