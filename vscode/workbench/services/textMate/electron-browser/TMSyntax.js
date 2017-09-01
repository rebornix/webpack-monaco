var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/browser/dom", "vs/base/common/types", "vs/base/common/event", "path", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/editor/common/modes", "vs/editor/common/services/modeService", "vscode-textmate", "vs/workbench/services/themes/common/workbenchThemeService", "vs/workbench/services/textMate/electron-browser/TMGrammars", "vs/editor/common/core/token", "vs/editor/common/model/tokensBinaryEncoding", "vs/editor/common/modes/nullMode", "vs/editor/common/modes/supports/tokenization", "vs/base/common/color"], function (require, exports, nls, dom, types, event_1, path_1, winjs_base_1, errors_1, modes_1, modeService_1, vscode_textmate_1, workbenchThemeService_1, TMGrammars_1, token_1, tokensBinaryEncoding_1, nullMode_1, tokenization_1, color_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TMScopeRegistry = (function () {
        function TMScopeRegistry() {
            this._onDidEncounterLanguage = new event_1.Emitter();
            this.onDidEncounterLanguage = this._onDidEncounterLanguage.event;
            this._scopeNameToLanguageRegistration = Object.create(null);
            this._encounteredLanguages = [];
        }
        TMScopeRegistry.prototype.register = function (scopeName, filePath, embeddedLanguages) {
            this._scopeNameToLanguageRegistration[scopeName] = new TMLanguageRegistration(scopeName, filePath, embeddedLanguages);
        };
        TMScopeRegistry.prototype.getLanguageRegistration = function (scopeName) {
            return this._scopeNameToLanguageRegistration[scopeName] || null;
        };
        TMScopeRegistry.prototype.getFilePath = function (scopeName) {
            var data = this.getLanguageRegistration(scopeName);
            return data ? data.grammarFilePath : null;
        };
        /**
         * To be called when tokenization found/hit an embedded language.
         */
        TMScopeRegistry.prototype.onEncounteredLanguage = function (languageId) {
            if (!this._encounteredLanguages[languageId]) {
                this._encounteredLanguages[languageId] = true;
                this._onDidEncounterLanguage.fire(languageId);
            }
        };
        return TMScopeRegistry;
    }());
    exports.TMScopeRegistry = TMScopeRegistry;
    var TMLanguageRegistration = (function () {
        function TMLanguageRegistration(scopeName, grammarFilePath, embeddedLanguages) {
            this.scopeName = scopeName;
            this.grammarFilePath = grammarFilePath;
            // embeddedLanguages handling
            this.embeddedLanguages = Object.create(null);
            if (embeddedLanguages) {
                // If embeddedLanguages are configured, fill in `this._embeddedLanguages`
                var scopes = Object.keys(embeddedLanguages);
                for (var i = 0, len = scopes.length; i < len; i++) {
                    var scope = scopes[i];
                    var language = embeddedLanguages[scope];
                    if (typeof language !== 'string') {
                        // never hurts to be too careful
                        continue;
                    }
                    this.embeddedLanguages[scope] = language;
                }
            }
        }
        return TMLanguageRegistration;
    }());
    exports.TMLanguageRegistration = TMLanguageRegistration;
    var TextMateService = (function () {
        function TextMateService(modeService, themeService) {
            var _this = this;
            this._styleElement = dom.createStyleSheet();
            this._styleElement.className = 'vscode-tokens-styles';
            this._modeService = modeService;
            this._themeService = themeService;
            this._scopeRegistry = new TMScopeRegistry();
            this.onDidEncounterLanguage = this._scopeRegistry.onDidEncounterLanguage;
            this._injections = {};
            this._languageToScope = new Map();
            this._grammarRegistry = new vscode_textmate_1.Registry({
                getFilePath: function (scopeName) {
                    return _this._scopeRegistry.getFilePath(scopeName);
                },
                getInjections: function (scopeName) {
                    return _this._injections[scopeName];
                }
            });
            this._updateTheme();
            this._themeService.onDidColorThemeChange(function (e) { return _this._updateTheme(); });
            TMGrammars_1.grammarsExtPoint.setHandler(function (extensions) {
                for (var i = 0; i < extensions.length; i++) {
                    var grammars = extensions[i].value;
                    for (var j = 0; j < grammars.length; j++) {
                        _this._handleGrammarExtensionPointUser(extensions[i].description.extensionFolderPath, grammars[j], extensions[i].collector);
                    }
                }
            });
            this._modeService.onDidCreateMode(function (mode) {
                var modeId = mode.getId();
                if (_this._languageToScope.has(modeId)) {
                    _this.registerDefinition(modeId);
                }
            });
        }
        TextMateService._toColorMap = function (colorMap) {
            var result = [null];
            for (var i = 1, len = colorMap.length; i < len; i++) {
                result[i] = color_1.Color.fromHex(colorMap[i]);
            }
            return result;
        };
        TextMateService.prototype._updateTheme = function () {
            var colorTheme = this._themeService.getColorTheme();
            this._grammarRegistry.setTheme({ name: colorTheme.label, settings: colorTheme.tokenColors });
            var colorMap = TextMateService._toColorMap(this._grammarRegistry.getColorMap());
            var cssRules = tokenization_1.generateTokensCSSForColorMap(colorMap);
            this._styleElement.innerHTML = cssRules;
            modes_1.TokenizationRegistry.setColorMap(colorMap);
        };
        TextMateService.prototype._handleGrammarExtensionPointUser = function (extensionFolderPath, syntax, collector) {
            if (syntax.language && ((typeof syntax.language !== 'string') || !this._modeService.isRegisteredMode(syntax.language))) {
                collector.error(nls.localize('invalid.language', "Unknown language in `contributes.{0}.language`. Provided value: {1}", TMGrammars_1.grammarsExtPoint.name, String(syntax.language)));
                return;
            }
            if (!syntax.scopeName || (typeof syntax.scopeName !== 'string')) {
                collector.error(nls.localize('invalid.scopeName', "Expected string in `contributes.{0}.scopeName`. Provided value: {1}", TMGrammars_1.grammarsExtPoint.name, String(syntax.scopeName)));
                return;
            }
            if (!syntax.path || (typeof syntax.path !== 'string')) {
                collector.error(nls.localize('invalid.path.0', "Expected string in `contributes.{0}.path`. Provided value: {1}", TMGrammars_1.grammarsExtPoint.name, String(syntax.path)));
                return;
            }
            if (syntax.injectTo && (!Array.isArray(syntax.injectTo) || syntax.injectTo.some(function (scope) { return typeof scope !== 'string'; }))) {
                collector.error(nls.localize('invalid.injectTo', "Invalid value in `contributes.{0}.injectTo`. Must be an array of language scope names. Provided value: {1}", TMGrammars_1.grammarsExtPoint.name, JSON.stringify(syntax.injectTo)));
                return;
            }
            if (syntax.embeddedLanguages && !types.isObject(syntax.embeddedLanguages)) {
                collector.error(nls.localize('invalid.embeddedLanguages', "Invalid value in `contributes.{0}.embeddedLanguages`. Must be an object map from scope name to language. Provided value: {1}", TMGrammars_1.grammarsExtPoint.name, JSON.stringify(syntax.embeddedLanguages)));
                return;
            }
            var normalizedAbsolutePath = path_1.normalize(path_1.join(extensionFolderPath, syntax.path));
            if (normalizedAbsolutePath.indexOf(extensionFolderPath) !== 0) {
                collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", TMGrammars_1.grammarsExtPoint.name, normalizedAbsolutePath, extensionFolderPath));
            }
            this._scopeRegistry.register(syntax.scopeName, normalizedAbsolutePath, syntax.embeddedLanguages);
            if (syntax.injectTo) {
                for (var _i = 0, _a = syntax.injectTo; _i < _a.length; _i++) {
                    var injectScope = _a[_i];
                    var injections = this._injections[injectScope];
                    if (!injections) {
                        this._injections[injectScope] = injections = [];
                    }
                    injections.push(syntax.scopeName);
                }
            }
            var modeId = syntax.language;
            if (modeId) {
                this._languageToScope.set(modeId, syntax.scopeName);
            }
        };
        TextMateService.prototype._resolveEmbeddedLanguages = function (embeddedLanguages) {
            var scopes = Object.keys(embeddedLanguages);
            var result = Object.create(null);
            for (var i = 0, len = scopes.length; i < len; i++) {
                var scope = scopes[i];
                var language = embeddedLanguages[scope];
                var languageIdentifier = this._modeService.getLanguageIdentifier(language);
                if (languageIdentifier) {
                    result[scope] = languageIdentifier.id;
                }
            }
            return result;
        };
        TextMateService.prototype.createGrammar = function (modeId) {
            return this._createGrammar(modeId).then(function (r) { return r.grammar; });
        };
        TextMateService.prototype._createGrammar = function (modeId) {
            var _this = this;
            var scopeName = this._languageToScope.get(modeId);
            var languageRegistration = this._scopeRegistry.getLanguageRegistration(scopeName);
            if (!languageRegistration) {
                // No TM grammar defined
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('no-tm-grammar', "No TM Grammar registered for this language.")));
            }
            var embeddedLanguages = this._resolveEmbeddedLanguages(languageRegistration.embeddedLanguages);
            var languageId = this._modeService.getLanguageIdentifier(modeId).id;
            var containsEmbeddedLanguages = (Object.keys(embeddedLanguages).length > 0);
            return new winjs_base_1.TPromise(function (c, e, p) {
                _this._grammarRegistry.loadGrammarWithEmbeddedLanguages(scopeName, languageId, embeddedLanguages, function (err, grammar) {
                    if (err) {
                        return e(err);
                    }
                    c({
                        languageId: languageId,
                        grammar: grammar,
                        containsEmbeddedLanguages: containsEmbeddedLanguages
                    });
                });
            });
        };
        TextMateService.prototype.registerDefinition = function (modeId) {
            var _this = this;
            this._createGrammar(modeId).then(function (r) {
                modes_1.TokenizationRegistry.register(modeId, new TMTokenization(_this._scopeRegistry, r.languageId, r.grammar, r.containsEmbeddedLanguages));
            }, errors_1.onUnexpectedError);
        };
        TextMateService = __decorate([
            __param(0, modeService_1.IModeService),
            __param(1, workbenchThemeService_1.IWorkbenchThemeService)
        ], TextMateService);
        return TextMateService;
    }());
    exports.TextMateService = TextMateService;
    var TMTokenization = (function () {
        function TMTokenization(scopeRegistry, languageId, grammar, containsEmbeddedLanguages) {
            this._scopeRegistry = scopeRegistry;
            this._languageId = languageId;
            this._grammar = grammar;
            this._containsEmbeddedLanguages = containsEmbeddedLanguages;
            this._seenLanguages = [];
        }
        TMTokenization.prototype.getInitialState = function () {
            return vscode_textmate_1.INITIAL;
        };
        TMTokenization.prototype.tokenize = function (line, state, offsetDelta) {
            throw new Error('Not supported!');
        };
        TMTokenization.prototype.tokenize2 = function (line, state, offsetDelta) {
            if (offsetDelta !== 0) {
                throw new Error('Unexpected: offsetDelta should be 0.');
            }
            // Do not attempt to tokenize if a line has over 20k
            if (line.length >= 20000) {
                console.log("Line (" + line.substr(0, 15) + "...): longer than 20k characters, tokenization skipped.");
                return nullMode_1.nullTokenize2(this._languageId, line, state, offsetDelta);
            }
            var textMateResult = this._grammar.tokenizeLine2(line, state);
            if (this._containsEmbeddedLanguages) {
                var seenLanguages = this._seenLanguages;
                var tokens = textMateResult.tokens;
                // Must check if any of the embedded languages was hit
                for (var i = 0, len = (tokens.length >>> 1); i < len; i++) {
                    var metadata = tokens[(i << 1) + 1];
                    var languageId = tokensBinaryEncoding_1.TokenMetadata.getLanguageId(metadata);
                    if (!seenLanguages[languageId]) {
                        seenLanguages[languageId] = true;
                        this._scopeRegistry.onEncounteredLanguage(languageId);
                    }
                }
            }
            var endState;
            // try to save an object if possible
            if (state.equals(textMateResult.ruleStack)) {
                endState = state;
            }
            else {
                endState = textMateResult.ruleStack;
            }
            return new token_1.TokenizationResult2(textMateResult.tokens, endState);
        };
        return TMTokenization;
    }());
});
//# sourceMappingURL=TMSyntax.js.map