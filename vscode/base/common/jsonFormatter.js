define(["require", "exports", "./json"], function (require, exports, Json) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function applyEdit(text, edit) {
        return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
    }
    exports.applyEdit = applyEdit;
    function applyEdits(text, edits) {
        for (var i = edits.length - 1; i >= 0; i--) {
            text = applyEdit(text, edits[i]);
        }
        return text;
    }
    exports.applyEdits = applyEdits;
    function format(documentText, range, options) {
        var initialIndentLevel;
        var value;
        var rangeStart;
        var rangeEnd;
        if (range) {
            rangeStart = range.offset;
            rangeEnd = rangeStart + range.length;
            while (rangeStart > 0 && !isEOL(documentText, rangeStart - 1)) {
                rangeStart--;
            }
            var scanner_1 = Json.createScanner(documentText, true);
            scanner_1.setPosition(rangeEnd);
            scanner_1.scan();
            rangeEnd = scanner_1.getPosition();
            value = documentText.substring(rangeStart, rangeEnd);
            initialIndentLevel = computeIndentLevel(value, 0, options);
        }
        else {
            value = documentText;
            rangeStart = 0;
            rangeEnd = documentText.length;
            initialIndentLevel = 0;
        }
        var eol = getEOL(options, documentText);
        var lineBreak = false;
        var indentLevel = 0;
        var indentValue;
        if (options.insertSpaces) {
            indentValue = repeat(' ', options.tabSize);
        }
        else {
            indentValue = '\t';
        }
        var scanner = Json.createScanner(value, false);
        function newLineAndIndent() {
            return eol + repeat(indentValue, initialIndentLevel + indentLevel);
        }
        function scanNext() {
            var token = scanner.scan();
            lineBreak = false;
            while (token === Json.SyntaxKind.Trivia || token === Json.SyntaxKind.LineBreakTrivia) {
                lineBreak = lineBreak || (token === Json.SyntaxKind.LineBreakTrivia);
                token = scanner.scan();
            }
            return token;
        }
        var editOperations = [];
        function addEdit(text, startOffset, endOffset) {
            if (documentText.substring(startOffset, endOffset) !== text) {
                editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text });
            }
        }
        var firstToken = scanNext();
        if (firstToken !== Json.SyntaxKind.EOF) {
            var firstTokenStart = scanner.getTokenOffset() + rangeStart;
            var initialIndent = repeat(indentValue, initialIndentLevel);
            addEdit(initialIndent, rangeStart, firstTokenStart);
        }
        while (firstToken !== Json.SyntaxKind.EOF) {
            var firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + rangeStart;
            var secondToken = scanNext();
            var replaceContent = '';
            while (!lineBreak && (secondToken === Json.SyntaxKind.LineCommentTrivia || secondToken === Json.SyntaxKind.BlockCommentTrivia)) {
                // comments on the same line: keep them on the same line, but ignore them otherwise
                var commentTokenStart = scanner.getTokenOffset() + rangeStart;
                addEdit(' ', firstTokenEnd, commentTokenStart);
                firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + rangeStart;
                replaceContent = secondToken === Json.SyntaxKind.LineCommentTrivia ? newLineAndIndent() : '';
                secondToken = scanNext();
            }
            if (secondToken === Json.SyntaxKind.CloseBraceToken) {
                if (firstToken !== Json.SyntaxKind.OpenBraceToken) {
                    indentLevel--;
                    replaceContent = newLineAndIndent();
                }
            }
            else if (secondToken === Json.SyntaxKind.CloseBracketToken) {
                if (firstToken !== Json.SyntaxKind.OpenBracketToken) {
                    indentLevel--;
                    replaceContent = newLineAndIndent();
                }
            }
            else if (secondToken !== Json.SyntaxKind.EOF) {
                switch (firstToken) {
                    case Json.SyntaxKind.OpenBracketToken:
                    case Json.SyntaxKind.OpenBraceToken:
                        indentLevel++;
                        replaceContent = newLineAndIndent();
                        break;
                    case Json.SyntaxKind.CommaToken:
                    case Json.SyntaxKind.LineCommentTrivia:
                        replaceContent = newLineAndIndent();
                        break;
                    case Json.SyntaxKind.BlockCommentTrivia:
                        if (lineBreak) {
                            replaceContent = newLineAndIndent();
                        }
                        else {
                            // symbol following comment on the same line: keep on same line, separate with ' '
                            replaceContent = ' ';
                        }
                        break;
                    case Json.SyntaxKind.ColonToken:
                        replaceContent = ' ';
                        break;
                    case Json.SyntaxKind.NullKeyword:
                    case Json.SyntaxKind.TrueKeyword:
                    case Json.SyntaxKind.FalseKeyword:
                    case Json.SyntaxKind.NumericLiteral:
                        if (secondToken === Json.SyntaxKind.NullKeyword || secondToken === Json.SyntaxKind.FalseKeyword || secondToken === Json.SyntaxKind.NumericLiteral) {
                            replaceContent = ' ';
                        }
                        break;
                }
                if (lineBreak && (secondToken === Json.SyntaxKind.LineCommentTrivia || secondToken === Json.SyntaxKind.BlockCommentTrivia)) {
                    replaceContent = newLineAndIndent();
                }
            }
            var secondTokenStart = scanner.getTokenOffset() + rangeStart;
            addEdit(replaceContent, firstTokenEnd, secondTokenStart);
            firstToken = secondToken;
        }
        return editOperations;
    }
    exports.format = format;
    function repeat(s, count) {
        var result = '';
        for (var i = 0; i < count; i++) {
            result += s;
        }
        return result;
    }
    function computeIndentLevel(content, offset, options) {
        var i = 0;
        var nChars = 0;
        var tabSize = options.tabSize || 4;
        while (i < content.length) {
            var ch = content.charAt(i);
            if (ch === ' ') {
                nChars++;
            }
            else if (ch === '\t') {
                nChars += tabSize;
            }
            else {
                break;
            }
            i++;
        }
        return Math.floor(nChars / tabSize);
    }
    function getEOL(options, text) {
        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);
            if (ch === '\r') {
                if (i + 1 < text.length && text.charAt(i + 1) === '\n') {
                    return '\r\n';
                }
                return '\r';
            }
            else if (ch === '\n') {
                return '\n';
            }
        }
        return (options && options.eol) || '\n';
    }
    function isEOL(text, offset) {
        return '\r\n'.indexOf(text.charAt(offset)) !== -1;
    }
});
//# sourceMappingURL=jsonFormatter.js.map