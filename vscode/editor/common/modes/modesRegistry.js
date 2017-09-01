define(["require", "exports", "vs/nls", "vs/base/common/event", "vs/platform/registry/common/platform", "vs/editor/common/modes/languageConfigurationRegistry", "vs/editor/common/modes"], function (require, exports, nls, event_1, platform_1, languageConfigurationRegistry_1, modes_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Define extension point ids
    exports.Extensions = {
        ModesRegistry: 'editor.modesRegistry'
    };
    var EditorModesRegistry = (function () {
        function EditorModesRegistry() {
            this._onDidAddLanguages = new event_1.Emitter();
            this.onDidAddLanguages = this._onDidAddLanguages.event;
            this._languages = [];
        }
        // --- languages
        EditorModesRegistry.prototype.registerLanguage = function (def) {
            this._languages.push(def);
            this._onDidAddLanguages.fire([def]);
        };
        EditorModesRegistry.prototype.registerLanguages = function (def) {
            this._languages = this._languages.concat(def);
            this._onDidAddLanguages.fire(def);
        };
        EditorModesRegistry.prototype.getLanguages = function () {
            return this._languages.slice(0);
        };
        return EditorModesRegistry;
    }());
    exports.EditorModesRegistry = EditorModesRegistry;
    exports.ModesRegistry = new EditorModesRegistry();
    platform_1.Registry.add(exports.Extensions.ModesRegistry, exports.ModesRegistry);
    exports.PLAINTEXT_MODE_ID = 'plaintext';
    exports.PLAINTEXT_LANGUAGE_IDENTIFIER = new modes_1.LanguageIdentifier(exports.PLAINTEXT_MODE_ID, 1 /* PlainText */);
    exports.ModesRegistry.registerLanguage({
        id: exports.PLAINTEXT_MODE_ID,
        extensions: ['.txt', '.gitignore'],
        aliases: [nls.localize('plainText.alias', "Plain Text"), 'text'],
        mimetypes: ['text/plain']
    });
    languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(exports.PLAINTEXT_LANGUAGE_IDENTIFIER, {
        brackets: [
            ['(', ')'],
            ['[', ']'],
            ['{', '}'],
        ]
    });
});
//# sourceMappingURL=modesRegistry.js.map