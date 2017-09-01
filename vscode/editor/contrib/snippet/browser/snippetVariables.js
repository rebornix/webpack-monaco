/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/paths", "vs/editor/contrib/snippet/browser/snippetParser", "vs/base/common/strings"], function (require, exports, paths_1, snippetParser_1, strings_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditorSnippetVariableResolver = (function () {
        function EditorSnippetVariableResolver(_model, _selection) {
            this._model = _model;
            this._selection = _selection;
            //
        }
        EditorSnippetVariableResolver.prototype.resolve = function (variable) {
            var name = variable.name;
            if (name === 'SELECTION' || name === 'TM_SELECTED_TEXT') {
                var value = this._model.getValueInRange(this._selection) || undefined;
                if (value && this._selection.startLineNumber !== this._selection.endLineNumber) {
                    // Selection is a multiline string which we indentation we now
                    // need to adjust. We compare the indentation of this variable
                    // with the indentation at the editor position and add potential
                    // extra indentation to the value
                    var line = this._model.getLineContent(this._selection.startLineNumber);
                    var lineLeadingWhitespace = strings_1.getLeadingWhitespace(line, 0, this._selection.startColumn - 1);
                    var varLeadingWhitespace_1 = lineLeadingWhitespace;
                    variable.snippet.walk(function (marker) {
                        if (marker === variable) {
                            return false;
                        }
                        if (marker instanceof snippetParser_1.Text) {
                            varLeadingWhitespace_1 = strings_1.getLeadingWhitespace(marker.value.split(/\r\n|\r|\n/).pop());
                        }
                        return true;
                    });
                    var whitespaceCommonLength_1 = strings_1.commonPrefixLength(varLeadingWhitespace_1, lineLeadingWhitespace);
                    value = value.replace(/(\r\n|\r|\n)(.*)/g, function (m, newline, rest) { return "" + newline + varLeadingWhitespace_1.substr(whitespaceCommonLength_1) + rest; });
                }
                return value;
            }
            else if (name === 'TM_CURRENT_LINE') {
                return this._model.getLineContent(this._selection.positionLineNumber);
            }
            else if (name === 'TM_CURRENT_WORD') {
                var info = this._model.getWordAtPosition({
                    lineNumber: this._selection.positionLineNumber,
                    column: this._selection.positionColumn
                });
                return info && info.word || undefined;
            }
            else if (name === 'TM_LINE_INDEX') {
                return String(this._selection.positionLineNumber - 1);
            }
            else if (name === 'TM_LINE_NUMBER') {
                return String(this._selection.positionLineNumber);
            }
            else if (name === 'TM_FILENAME') {
                return paths_1.basename(this._model.uri.fsPath);
            }
            else if (name === 'TM_FILENAME_BASE') {
                var name_1 = paths_1.basename(this._model.uri.fsPath);
                var idx = name_1.lastIndexOf('.');
                if (idx <= 0) {
                    return name_1;
                }
                else {
                    return name_1.slice(0, idx);
                }
            }
            else if (name === 'TM_DIRECTORY') {
                var dir = paths_1.dirname(this._model.uri.fsPath);
                return dir !== '.' ? dir : '';
            }
            else if (name === 'TM_FILEPATH') {
                return this._model.uri.fsPath;
            }
            else {
                return undefined;
            }
        };
        EditorSnippetVariableResolver.VariableNames = Object.freeze({
            'SELECTION': true,
            'TM_SELECTED_TEXT': true,
            'TM_CURRENT_LINE': true,
            'TM_CURRENT_WORD': true,
            'TM_LINE_INDEX': true,
            'TM_LINE_NUMBER': true,
            'TM_FILENAME': true,
            'TM_FILENAME_BASE': true,
            'TM_DIRECTORY': true,
            'TM_FILEPATH': true,
        });
        return EditorSnippetVariableResolver;
    }());
    exports.EditorSnippetVariableResolver = EditorSnippetVariableResolver;
});
//# sourceMappingURL=snippetVariables.js.map