/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/json", "vs/editor/common/core/position", "vs/editor/common/core/range"], function (require, exports, json_1, position_1, range_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SmartSnippetInserter = (function () {
        function SmartSnippetInserter() {
        }
        SmartSnippetInserter.hasOpenBrace = function (scanner) {
            while (scanner.scan() !== json_1.SyntaxKind.EOF) {
                var kind = scanner.getToken();
                if (kind === json_1.SyntaxKind.OpenBraceToken) {
                    return true;
                }
            }
            return false;
        };
        SmartSnippetInserter.offsetToPosition = function (model, offset) {
            var offsetBeforeLine = 0;
            var eolLength = model.getEOL().length;
            var lineCount = model.getLineCount();
            for (var lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
                var lineTotalLength = model.getLineContent(lineNumber).length + eolLength;
                var offsetAfterLine = offsetBeforeLine + lineTotalLength;
                if (offsetAfterLine > offset) {
                    return new position_1.Position(lineNumber, offset - offsetBeforeLine + 1);
                }
                offsetBeforeLine = offsetAfterLine;
            }
            return new position_1.Position(lineCount, model.getLineMaxColumn(lineCount));
        };
        SmartSnippetInserter.insertSnippet = function (model, _position) {
            var desiredPosition = model.getValueLengthInRange(new range_1.Range(1, 1, _position.lineNumber, _position.column));
            // <INVALID> [ <BEFORE_OBJECT> { <INVALID> } <AFTER_OBJECT>, <BEFORE_OBJECT> { <INVALID> } <AFTER_OBJECT> ] <INVALID>
            var State;
            (function (State) {
                State[State["INVALID"] = 0] = "INVALID";
                State[State["AFTER_OBJECT"] = 1] = "AFTER_OBJECT";
                State[State["BEFORE_OBJECT"] = 2] = "BEFORE_OBJECT";
            })(State || (State = {}));
            var currentState = State.INVALID;
            var lastValidPos = -1;
            var lastValidState = State.INVALID;
            var scanner = json_1.createScanner(model.getValue());
            var arrayLevel = 0;
            var objLevel = 0;
            var checkRangeStatus = function (pos, state) {
                if (state !== State.INVALID && arrayLevel === 1 && objLevel === 0) {
                    currentState = state;
                    lastValidPos = pos;
                    lastValidState = state;
                }
                else {
                    if (currentState !== State.INVALID) {
                        currentState = State.INVALID;
                        lastValidPos = scanner.getTokenOffset();
                    }
                }
            };
            while (scanner.scan() !== json_1.SyntaxKind.EOF) {
                var currentPos = scanner.getPosition();
                var kind = scanner.getToken();
                var goodKind = false;
                switch (kind) {
                    case json_1.SyntaxKind.OpenBracketToken:
                        goodKind = true;
                        arrayLevel++;
                        checkRangeStatus(currentPos, State.BEFORE_OBJECT);
                        break;
                    case json_1.SyntaxKind.CloseBracketToken:
                        goodKind = true;
                        arrayLevel--;
                        checkRangeStatus(currentPos, State.INVALID);
                        break;
                    case json_1.SyntaxKind.CommaToken:
                        goodKind = true;
                        checkRangeStatus(currentPos, State.BEFORE_OBJECT);
                        break;
                    case json_1.SyntaxKind.OpenBraceToken:
                        goodKind = true;
                        objLevel++;
                        checkRangeStatus(currentPos, State.INVALID);
                        break;
                    case json_1.SyntaxKind.CloseBraceToken:
                        goodKind = true;
                        objLevel--;
                        checkRangeStatus(currentPos, State.AFTER_OBJECT);
                        break;
                    case json_1.SyntaxKind.Trivia:
                    case json_1.SyntaxKind.LineBreakTrivia:
                        goodKind = true;
                }
                if (currentPos >= desiredPosition && (currentState !== State.INVALID || lastValidPos !== -1)) {
                    var acceptPosition = void 0;
                    var acceptState = void 0;
                    if (currentState !== State.INVALID) {
                        acceptPosition = (goodKind ? currentPos : scanner.getTokenOffset());
                        acceptState = currentState;
                    }
                    else {
                        acceptPosition = lastValidPos;
                        acceptState = lastValidState;
                    }
                    if (acceptState === State.AFTER_OBJECT) {
                        return {
                            position: this.offsetToPosition(model, acceptPosition),
                            prepend: ',',
                            append: ''
                        };
                    }
                    else {
                        scanner.setPosition(acceptPosition);
                        return {
                            position: this.offsetToPosition(model, acceptPosition),
                            prepend: '',
                            append: this.hasOpenBrace(scanner) ? ',' : ''
                        };
                    }
                }
            }
            // no valid position found!
            var modelLineCount = model.getLineCount();
            return {
                position: new position_1.Position(modelLineCount, model.getLineMaxColumn(modelLineCount)),
                prepend: '\n[',
                append: ']'
            };
        };
        return SmartSnippetInserter;
    }());
    exports.SmartSnippetInserter = SmartSnippetInserter;
});
//# sourceMappingURL=smartSnippetInserter.js.map