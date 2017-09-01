define(["require", "exports", "vs/base/common/strings", "vs/editor/common/modes/languageConfiguration"], function (require, exports, strings, languageConfiguration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndentConsts;
    (function (IndentConsts) {
        IndentConsts[IndentConsts["INCREASE_MASK"] = 1] = "INCREASE_MASK";
        IndentConsts[IndentConsts["DECREASE_MASK"] = 2] = "DECREASE_MASK";
        IndentConsts[IndentConsts["INDENT_NEXTLINE_MASK"] = 4] = "INDENT_NEXTLINE_MASK";
        IndentConsts[IndentConsts["UNINDENT_MASK"] = 8] = "UNINDENT_MASK";
    })(IndentConsts = exports.IndentConsts || (exports.IndentConsts = {}));
    ;
    var IndentRulesSupport = (function () {
        function IndentRulesSupport(indentationRules) {
            this._indentationRules = indentationRules;
        }
        IndentRulesSupport.prototype.onType = function (text) {
            if (this._indentationRules) {
                if (this._indentationRules.unIndentedLinePattern && this._indentationRules.unIndentedLinePattern.test(text)) {
                    return null;
                }
                if (this._indentationRules.decreaseIndentPattern && this._indentationRules.decreaseIndentPattern.test(text)) {
                    return languageConfiguration_1.IndentAction.Outdent;
                }
            }
            return null;
        };
        IndentRulesSupport.prototype.containNonWhitespace = function (text) {
            // the text doesn't contain any non-whitespace character.
            var nonWhitespaceIdx = strings.lastNonWhitespaceIndex(text);
            if (nonWhitespaceIdx >= 0) {
                return true;
            }
            return false;
        };
        IndentRulesSupport.prototype.shouldIncrease = function (text) {
            if (this._indentationRules) {
                if (this._indentationRules.increaseIndentPattern && this._indentationRules.increaseIndentPattern.test(text)) {
                    return true;
                }
                // if (this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(text)) {
                // 	return true;
                // }
            }
            return false;
        };
        IndentRulesSupport.prototype.shouldDecrease = function (text) {
            if (this._indentationRules && this._indentationRules.decreaseIndentPattern && this._indentationRules.decreaseIndentPattern.test(text)) {
                return true;
            }
            return false;
        };
        IndentRulesSupport.prototype.shouldIndentNextLine = function (text) {
            if (this._indentationRules && this._indentationRules.indentNextLinePattern && this._indentationRules.indentNextLinePattern.test(text)) {
                return true;
            }
            return false;
        };
        IndentRulesSupport.prototype.shouldIgnore = function (text) {
            // the text matches `unIndentedLinePattern`
            if (this._indentationRules && this._indentationRules.unIndentedLinePattern && this._indentationRules.unIndentedLinePattern.test(text)) {
                return true;
            }
            return false;
        };
        IndentRulesSupport.prototype.getIndentMetadata = function (text) {
            var ret = 0;
            if (this.shouldIncrease(text)) {
                ret += 1 /* INCREASE_MASK */;
            }
            if (this.shouldDecrease(text)) {
                ret += 2 /* DECREASE_MASK */;
            }
            if (this.shouldIndentNextLine(text)) {
                ret += 4 /* INDENT_NEXTLINE_MASK */;
            }
            if (this.shouldIgnore(text)) {
                ret += 8 /* UNINDENT_MASK */;
            }
            return ret;
        };
        return IndentRulesSupport;
    }());
    exports.IndentRulesSupport = IndentRulesSupport;
});
//# sourceMappingURL=indentRules.js.map