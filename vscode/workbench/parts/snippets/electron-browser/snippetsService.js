var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/extensions", "vs/editor/contrib/suggest/browser/suggest", "vs/editor/common/services/modeService", "vs/editor/common/core/position", "vs/base/common/strings", "vs/editor/contrib/snippet/browser/snippetParser"], function (require, exports, nls_1, instantiation_1, extensions_1, suggest_1, modeService_1, position_1, strings_1, snippetParser_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ISnippetsService = instantiation_1.createDecorator('snippetService');
    var SnippetsService = (function () {
        function SnippetsService(modeService) {
            this._snippets = new Map();
            suggest_1.setSnippetSuggestSupport(new SnippetSuggestProvider(modeService, this));
        }
        SnippetsService.prototype.registerSnippets = function (languageId, snippets, fileName) {
            if (!this._snippets.has(languageId)) {
                this._snippets.set(languageId, new Map());
            }
            this._snippets.get(languageId).set(fileName, snippets);
        };
        SnippetsService.prototype.visitSnippets = function (languageId, accept) {
            var modeSnippets = this._snippets.get(languageId);
            if (modeSnippets) {
                modeSnippets.forEach(function (snippets) {
                    var result = snippets.every(accept);
                    if (!result) {
                        return;
                    }
                });
            }
        };
        SnippetsService.prototype.getSnippets = function (languageId) {
            var modeSnippets = this._snippets.get(languageId);
            var ret = [];
            if (modeSnippets) {
                modeSnippets.forEach(function (snippets) {
                    ret.push.apply(ret, snippets);
                });
            }
            return ret;
        };
        SnippetsService = __decorate([
            __param(0, modeService_1.IModeService)
        ], SnippetsService);
        return SnippetsService;
    }());
    exports.SnippetsService = SnippetsService;
    extensions_1.registerSingleton(exports.ISnippetsService, SnippetsService);
    var SnippetSuggestion = (function () {
        function SnippetSuggestion(snippet, overwriteBefore) {
            this.snippet = snippet;
            this.label = snippet.prefix;
            this.detail = nls_1.localize('detail.snippet', "{0} ({1})", snippet.description, snippet.extensionName || SnippetSuggestion._userSnippet);
            this.insertText = snippet.codeSnippet;
            this.overwriteBefore = overwriteBefore;
            this.sortText = snippet.prefix + "-" + (snippet.extensionName || '');
            this.noAutoAccept = true;
            this.type = 'snippet';
            this.snippetType = 'textmate';
        }
        SnippetSuggestion.prototype.resolve = function () {
            this.documentation = new snippetParser_1.SnippetParser().text(this.snippet.codeSnippet);
            return this;
        };
        SnippetSuggestion.compareByLabel = function (a, b) {
            return strings_1.compare(a.label, b.label);
        };
        SnippetSuggestion._userSnippet = nls_1.localize('source.snippet', "User Snippet");
        return SnippetSuggestion;
    }());
    exports.SnippetSuggestion = SnippetSuggestion;
    var SnippetSuggestProvider = (function () {
        function SnippetSuggestProvider(_modeService, _snippets) {
            this._modeService = _modeService;
            this._snippets = _snippets;
            //
        }
        SnippetSuggestProvider.prototype.provideCompletionItems = function (model, position) {
            var languageId = this._getLanguageIdAtPosition(model, position);
            var snippets = this._snippets.getSnippets(languageId);
            var suggestions = [];
            var lowWordUntil = model.getWordUntilPosition(position).word.toLowerCase();
            var lowLineUntil = model.getLineContent(position.lineNumber).substr(Math.max(0, position.column - 100), position.column - 1).toLowerCase();
            for (var _i = 0, snippets_1 = snippets; _i < snippets_1.length; _i++) {
                var snippet = snippets_1[_i];
                var lowPrefix = snippet.prefix.toLowerCase();
                var overwriteBefore = 0;
                var accetSnippet = true;
                if (lowWordUntil.length > 0 && strings_1.startsWith(lowPrefix, lowWordUntil)) {
                    // cheap match on the (none-empty) current word
                    overwriteBefore = lowWordUntil.length;
                    accetSnippet = true;
                }
                else if (lowLineUntil.length > 0 && lowLineUntil.match(/[^\s]$/)) {
                    // compute overlap between snippet and (none-empty) line on text
                    overwriteBefore = strings_1.overlap(lowLineUntil, snippet.prefix.toLowerCase());
                    accetSnippet = overwriteBefore > 0 && !model.getWordAtPosition(new position_1.Position(position.lineNumber, position.column - overwriteBefore));
                }
                if (accetSnippet) {
                    suggestions.push(new SnippetSuggestion(snippet, overwriteBefore));
                }
            }
            // dismbiguate suggestions with same labels
            var lastItem;
            for (var _a = 0, _b = suggestions.sort(SnippetSuggestion.compareByLabel); _a < _b.length; _a++) {
                var item = _b[_a];
                if (lastItem && lastItem.label === item.label) {
                    // use the disambiguateLabel instead of the actual label
                    lastItem.label = nls_1.localize('snippetSuggest.longLabel', "{0}, {1}", lastItem.label, lastItem.snippet.name);
                    item.label = nls_1.localize('snippetSuggest.longLabel', "{0}, {1}", item.label, item.snippet.name);
                }
                lastItem = item;
            }
            return { suggestions: suggestions };
        };
        SnippetSuggestProvider.prototype.resolveCompletionItem = function (model, position, item) {
            return (item instanceof SnippetSuggestion) ? item.resolve() : item;
        };
        SnippetSuggestProvider.prototype._getLanguageIdAtPosition = function (model, position) {
            // validate the `languageId` to ensure this is a user
            // facing language with a name and the chance to have
            // snippets, else fall back to the outer language
            model.tokenizeIfCheap(position.lineNumber);
            var languageId = model.getLanguageIdAtPosition(position.lineNumber, position.column);
            var language = this._modeService.getLanguageIdentifier(languageId).language;
            if (!this._modeService.getLanguageName(language)) {
                languageId = model.getLanguageIdentifier().id;
            }
            return languageId;
        };
        SnippetSuggestProvider = __decorate([
            __param(0, modeService_1.IModeService),
            __param(1, exports.ISnippetsService)
        ], SnippetSuggestProvider);
        return SnippetSuggestProvider;
    }());
    exports.SnippetSuggestProvider = SnippetSuggestProvider;
    function getNonWhitespacePrefix(model, position) {
        /**
         * Do not analyze more characters
         */
        var MAX_PREFIX_LENGTH = 100;
        var line = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
        var minChIndex = Math.max(0, line.length - MAX_PREFIX_LENGTH);
        for (var chIndex = line.length - 1; chIndex >= minChIndex; chIndex--) {
            var ch = line.charAt(chIndex);
            if (/\s/.test(ch)) {
                return line.substr(chIndex + 1);
            }
        }
        if (minChIndex === 0) {
            return line;
        }
        return '';
    }
    exports.getNonWhitespacePrefix = getNonWhitespacePrefix;
});
//# sourceMappingURL=snippetsService.js.map