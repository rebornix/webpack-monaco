var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/editor/common/core/range", "vs/editor/common/modes/supports", "vs/editor/common/modes/supports/richEditBrackets", "vs/editor/common/modes/languageConfigurationRegistry"], function (require, exports, range_1, supports_1, richEditBrackets_1, languageConfigurationRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TokenTreeBracket;
    (function (TokenTreeBracket) {
        TokenTreeBracket[TokenTreeBracket["None"] = 0] = "None";
        TokenTreeBracket[TokenTreeBracket["Open"] = 1] = "Open";
        TokenTreeBracket[TokenTreeBracket["Close"] = -1] = "Close";
    })(TokenTreeBracket = exports.TokenTreeBracket || (exports.TokenTreeBracket = {}));
    var Node = (function () {
        function Node() {
        }
        Object.defineProperty(Node.prototype, "range", {
            get: function () {
                return new range_1.Range(this.start.lineNumber, this.start.column, this.end.lineNumber, this.end.column);
            },
            enumerable: true,
            configurable: true
        });
        return Node;
    }());
    exports.Node = Node;
    var NodeList = (function (_super) {
        __extends(NodeList, _super);
        function NodeList() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(NodeList.prototype, "start", {
            get: function () {
                return this.hasChildren
                    ? this.children[0].start
                    : this.parent.start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeList.prototype, "end", {
            get: function () {
                return this.hasChildren
                    ? this.children[this.children.length - 1].end
                    : this.parent.end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeList.prototype, "hasChildren", {
            get: function () {
                return this.children && this.children.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(NodeList.prototype, "isEmpty", {
            get: function () {
                return !this.hasChildren && !this.parent;
            },
            enumerable: true,
            configurable: true
        });
        NodeList.prototype.append = function (node) {
            if (!node) {
                return false;
            }
            node.parent = this;
            if (!this.children) {
                this.children = [];
            }
            if (node instanceof NodeList) {
                if (node.children) {
                    this.children.push.apply(this.children, node.children);
                }
            }
            else {
                this.children.push(node);
            }
            return true;
        };
        return NodeList;
    }(Node));
    exports.NodeList = NodeList;
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            var _this = _super.call(this) || this;
            _this.elements = new NodeList();
            _this.elements.parent = _this;
            return _this;
        }
        Object.defineProperty(Block.prototype, "start", {
            get: function () {
                return this.open.start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block.prototype, "end", {
            get: function () {
                return this.close.end;
            },
            enumerable: true,
            configurable: true
        });
        return Block;
    }(Node));
    exports.Block = Block;
    var Token = (function () {
        function Token(range, bracket, bracketType) {
            this.range = range;
            this.bracket = bracket;
            this.bracketType = bracketType;
        }
        return Token;
    }());
    function newNode(token) {
        var node = new Node();
        node.start = token.range.getStartPosition();
        node.end = token.range.getEndPosition();
        return node;
    }
    var RawToken = (function () {
        function RawToken(source, lineNumber, lineText) {
            this.lineNumber = lineNumber;
            this.lineText = lineText;
            this.startOffset = source.startOffset;
            this.endOffset = source.endOffset;
            this.type = source.tokenType;
            this.languageId = source.languageId;
        }
        return RawToken;
    }());
    var ModelRawTokenScanner = (function () {
        function ModelRawTokenScanner(model) {
            this._model = model;
            this._lineCount = this._model.getLineCount();
            this._versionId = this._model.getVersionId();
            this._lineNumber = 0;
            this._lineText = null;
            this._advance();
        }
        ModelRawTokenScanner.prototype._advance = function () {
            this._next = (this._next ? this._next.next() : null);
            while (!this._next && this._lineNumber < this._lineCount) {
                this._lineNumber++;
                this._lineText = this._model.getLineContent(this._lineNumber);
                this._model.forceTokenization(this._lineNumber);
                var currentLineTokens = this._model.getLineTokens(this._lineNumber);
                this._next = currentLineTokens.firstToken();
            }
        };
        ModelRawTokenScanner.prototype.next = function () {
            if (!this._next) {
                return null;
            }
            if (this._model.getVersionId() !== this._versionId) {
                return null;
            }
            var result = new RawToken(this._next, this._lineNumber, this._lineText);
            this._advance();
            return result;
        };
        return ModelRawTokenScanner;
    }());
    var TokenScanner = (function () {
        function TokenScanner(model) {
            this._rawTokenScanner = new ModelRawTokenScanner(model);
            this._nextBuff = [];
            this._cachedLanguageBrackets = null;
            this._cachedLanguageId = -1;
        }
        TokenScanner.prototype.next = function () {
            if (this._nextBuff.length > 0) {
                return this._nextBuff.shift();
            }
            var token = this._rawTokenScanner.next();
            if (!token) {
                return null;
            }
            var lineNumber = token.lineNumber;
            var lineText = token.lineText;
            var tokenType = token.type;
            var startOffset = token.startOffset;
            var endOffset = token.endOffset;
            if (this._cachedLanguageId !== token.languageId) {
                this._cachedLanguageId = token.languageId;
                this._cachedLanguageBrackets = languageConfigurationRegistry_1.LanguageConfigurationRegistry.getBracketsSupport(this._cachedLanguageId);
            }
            var modeBrackets = this._cachedLanguageBrackets;
            if (!modeBrackets || supports_1.ignoreBracketsInToken(tokenType)) {
                return new Token(new range_1.Range(lineNumber, startOffset + 1, lineNumber, endOffset + 1), 0 /* None */, null);
            }
            var foundBracket;
            do {
                foundBracket = richEditBrackets_1.BracketsUtils.findNextBracketInToken(modeBrackets.forwardRegex, lineNumber, lineText, startOffset, endOffset);
                if (foundBracket) {
                    var foundBracketStartOffset = foundBracket.startColumn - 1;
                    var foundBracketEndOffset = foundBracket.endColumn - 1;
                    if (startOffset < foundBracketStartOffset) {
                        // there is some text before this bracket in this token
                        this._nextBuff.push(new Token(new range_1.Range(lineNumber, startOffset + 1, lineNumber, foundBracketStartOffset + 1), 0 /* None */, null));
                    }
                    var bracketText = lineText.substring(foundBracketStartOffset, foundBracketEndOffset);
                    bracketText = bracketText.toLowerCase();
                    var bracketData = modeBrackets.textIsBracket[bracketText];
                    var bracketIsOpen = modeBrackets.textIsOpenBracket[bracketText];
                    this._nextBuff.push(new Token(new range_1.Range(lineNumber, foundBracketStartOffset + 1, lineNumber, foundBracketEndOffset + 1), bracketIsOpen ? 1 /* Open */ : -1 /* Close */, bracketData.languageIdentifier.language + ";" + bracketData.open + ";" + bracketData.close));
                    startOffset = foundBracketEndOffset;
                }
            } while (foundBracket);
            if (startOffset < endOffset) {
                // there is some remaining none-bracket text in this token
                this._nextBuff.push(new Token(new range_1.Range(lineNumber, startOffset + 1, lineNumber, endOffset + 1), 0 /* None */, null));
            }
            return this._nextBuff.shift();
        };
        return TokenScanner;
    }());
    var TokenTreeBuilder = (function () {
        function TokenTreeBuilder(model) {
            this._stack = [];
            this._scanner = new TokenScanner(model);
        }
        TokenTreeBuilder.prototype.build = function () {
            var node = new NodeList();
            while (node.append(this._line() || this._any())) {
                // accept all
            }
            return node;
        };
        TokenTreeBuilder.prototype._accept = function (condt) {
            var token = this._stack.pop() || this._scanner.next();
            if (!token) {
                return false;
            }
            var accepted = condt(token);
            if (!accepted) {
                this._stack.push(token);
                this._currentToken = null;
            }
            else {
                this._currentToken = token;
                //			console.log('accepted: ' + token.__debugContent);
            }
            return accepted;
        };
        TokenTreeBuilder.prototype._peek = function (condt) {
            var ret = false;
            this._accept(function (info) {
                ret = condt(info);
                return false;
            });
            return ret;
        };
        TokenTreeBuilder.prototype._line = function () {
            var node = new NodeList(), lineNumber;
            // capture current linenumber
            this._peek(function (info) {
                lineNumber = info.range.startLineNumber;
                return false;
            });
            while (this._peek(function (info) { return info.range.startLineNumber === lineNumber; })
                && node.append(this._token() || this._block())) {
                // all children that started on this line
            }
            if (!node.children || node.children.length === 0) {
                return null;
            }
            else if (node.children.length === 1) {
                return node.children[0];
            }
            else {
                return node;
            }
        };
        TokenTreeBuilder.prototype._token = function () {
            if (!this._accept(function (token) { return token.bracket === 0 /* None */; })) {
                return null;
            }
            return newNode(this._currentToken);
        };
        TokenTreeBuilder.prototype._block = function () {
            var bracketType, accepted;
            accepted = this._accept(function (token) {
                bracketType = token.bracketType;
                return token.bracket === 1 /* Open */;
            });
            if (!accepted) {
                return null;
            }
            var bracket = new Block();
            bracket.open = newNode(this._currentToken);
            while (bracket.elements.append(this._line())) {
                // inside brackets
            }
            if (!this._accept(function (token) { return token.bracket === -1 /* Close */ && token.bracketType === bracketType; })) {
                // missing closing bracket -> return just a node list
                var nodelist = new NodeList();
                nodelist.append(bracket.open);
                nodelist.append(bracket.elements);
                return nodelist;
            }
            bracket.close = newNode(this._currentToken);
            return bracket;
        };
        TokenTreeBuilder.prototype._any = function () {
            if (!this._accept(function (_) { return true; })) {
                return null;
            }
            return newNode(this._currentToken);
        };
        return TokenTreeBuilder;
    }());
    /**
     * Parses this grammar:
     *	grammer = { line }
     *	line = { block | "token" }
     *	block = "open_bracket" { line } "close_bracket"
     */
    function build(model) {
        var node = new TokenTreeBuilder(model).build();
        return node;
    }
    exports.build = build;
    function find(node, position) {
        if (node instanceof NodeList && node.isEmpty) {
            return null;
        }
        if (!range_1.Range.containsPosition(node.range, position)) {
            return null;
        }
        var result;
        if (node instanceof NodeList) {
            if (node.hasChildren) {
                for (var i = 0, len = node.children.length; i < len && !result; i++) {
                    result = find(node.children[i], position);
                }
            }
        }
        else if (node instanceof Block) {
            result = find(node.open, position) || find(node.elements, position) || find(node.close, position);
        }
        return result || node;
    }
    exports.find = find;
});
//# sourceMappingURL=tokenTree.js.map