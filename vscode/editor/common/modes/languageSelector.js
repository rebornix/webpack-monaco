/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/glob"], function (require, exports, glob_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function matches(selection, uri, language) {
        return score(selection, uri, language) > 0;
    }
    exports.default = matches;
    function score(selector, candidateUri, candidateLanguage) {
        if (Array.isArray(selector)) {
            // array -> take max individual value
            var ret = 0;
            for (var _i = 0, selector_1 = selector; _i < selector_1.length; _i++) {
                var filter = selector_1[_i];
                var value = score(filter, candidateUri, candidateLanguage);
                if (value === 10) {
                    return value; // already at the highest
                }
                if (value > ret) {
                    ret = value;
                }
            }
            return ret;
        }
        else if (typeof selector === 'string') {
            // short-hand notion, desugars to
            // 'fooLang' -> [{ language: 'fooLang', scheme: 'file' }, { language: 'fooLang', scheme: 'untitled' }]
            // '*' -> { language: '*', scheme: '*' }
            if (selector === '*') {
                return 5;
            }
            else if (selector === candidateLanguage) {
                return 10;
            }
            else {
                return 0;
            }
        }
        else if (selector) {
            // filter -> select accordingly, use defaults for scheme
            var language = selector.language, pattern = selector.pattern, scheme = selector.scheme;
            var ret = 0;
            if (scheme) {
                if (scheme === candidateUri.scheme) {
                    ret = 10;
                }
                else if (scheme === '*') {
                    ret = 5;
                }
                else {
                    return 0;
                }
            }
            if (language) {
                if (language === candidateLanguage) {
                    ret = 10;
                }
                else if (language === '*') {
                    ret = Math.max(ret, 5);
                }
                else {
                    return 0;
                }
            }
            if (pattern) {
                if (pattern === candidateUri.fsPath || glob_1.match(pattern, candidateUri.fsPath)) {
                    ret = 10;
                }
                else {
                    return 0;
                }
            }
            return ret;
        }
        else {
            return 0;
        }
    }
    exports.score = score;
});
//# sourceMappingURL=languageSelector.js.map