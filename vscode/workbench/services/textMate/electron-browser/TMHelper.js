/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function findMatchingThemeRule(theme, scopes) {
        for (var i = scopes.length - 1; i >= 0; i--) {
            var parentScopes = scopes.slice(0, i);
            var scope = scopes[i];
            var r = findMatchingThemeRule2(theme, scope, parentScopes);
            if (r) {
                return r;
            }
        }
        return null;
    }
    exports.findMatchingThemeRule = findMatchingThemeRule;
    function findMatchingThemeRule2(theme, scope, parentScopes) {
        var result = null;
        // Loop backwards, to ensure the last most specific rule wins
        for (var i = theme.tokenColors.length - 1; i >= 0; i--) {
            var rule = theme.tokenColors[i];
            if (!rule.settings.foreground) {
                continue;
            }
            var selectors = void 0;
            if (typeof rule.scope === 'string') {
                selectors = rule.scope.split(/,/).map(function (scope) { return scope.trim(); });
            }
            else if (Array.isArray(rule.scope)) {
                selectors = rule.scope;
            }
            else {
                continue;
            }
            for (var j = 0, lenJ = selectors.length; j < lenJ; j++) {
                var rawSelector = selectors[j];
                var themeRule = new ThemeRule(rawSelector, rule.settings);
                if (themeRule.matches(scope, parentScopes)) {
                    if (themeRule.isMoreSpecific(result)) {
                        result = themeRule;
                    }
                }
            }
        }
        return result;
    }
    var ThemeRule = (function () {
        function ThemeRule(rawSelector, settings) {
            this.rawSelector = rawSelector;
            this.settings = settings;
            var rawSelectorPieces = this.rawSelector.split(/ /);
            this.scope = rawSelectorPieces[rawSelectorPieces.length - 1];
            this.parentScopes = rawSelectorPieces.slice(0, rawSelectorPieces.length - 1);
        }
        ThemeRule.prototype.matches = function (scope, parentScopes) {
            return ThemeRule._matches(this.scope, this.parentScopes, scope, parentScopes);
        };
        ThemeRule._cmp = function (a, b) {
            if (a === null && b === null) {
                return 0;
            }
            if (a === null) {
                // b > a
                return -1;
            }
            if (b === null) {
                // a > b
                return 1;
            }
            if (a.scope.length !== b.scope.length) {
                // longer scope length > shorter scope length
                return a.scope.length - b.scope.length;
            }
            var aParentScopesLen = a.parentScopes.length;
            var bParentScopesLen = b.parentScopes.length;
            if (aParentScopesLen !== bParentScopesLen) {
                // more parents > less parents
                return aParentScopesLen - bParentScopesLen;
            }
            for (var i = 0; i < aParentScopesLen; i++) {
                var aLen = a.parentScopes[i].length;
                var bLen = b.parentScopes[i].length;
                if (aLen !== bLen) {
                    return aLen - bLen;
                }
            }
            return 0;
        };
        ThemeRule.prototype.isMoreSpecific = function (other) {
            return (ThemeRule._cmp(this, other) > 0);
        };
        ThemeRule._matchesOne = function (selectorScope, scope) {
            var selectorPrefix = selectorScope + '.';
            if (selectorScope === scope || scope.substring(0, selectorPrefix.length) === selectorPrefix) {
                return true;
            }
            return false;
        };
        ThemeRule._matches = function (selectorScope, selectorParentScopes, scope, parentScopes) {
            if (!this._matchesOne(selectorScope, scope)) {
                return false;
            }
            var selectorParentIndex = selectorParentScopes.length - 1;
            var parentIndex = parentScopes.length - 1;
            while (selectorParentIndex >= 0 && parentIndex >= 0) {
                if (this._matchesOne(selectorParentScopes[selectorParentIndex], parentScopes[parentIndex])) {
                    selectorParentIndex--;
                }
                parentIndex--;
            }
            if (selectorParentIndex === -1) {
                return true;
            }
            return false;
        };
        return ThemeRule;
    }());
    exports.ThemeRule = ThemeRule;
});
//# sourceMappingURL=TMHelper.js.map