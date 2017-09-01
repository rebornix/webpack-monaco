define(["require", "exports", "vs/base/common/severity", "vs/editor/common/modes", "./extHostTypes", "vs/platform/editor/common/editor", "vs/editor/common/editorCommon", "vs/base/common/uri", "vs/platform/progress/common/progress", "vs/workbench/services/textfile/common/textfiles", "vs/base/common/htmlContent"], function (require, exports, severity_1, modes, types, editor_1, editorCommon_1, uri_1, progress_1, textfiles_1, htmlContent) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function toSelection(selection) {
        var selectionStartLineNumber = selection.selectionStartLineNumber, selectionStartColumn = selection.selectionStartColumn, positionLineNumber = selection.positionLineNumber, positionColumn = selection.positionColumn;
        var start = new types.Position(selectionStartLineNumber - 1, selectionStartColumn - 1);
        var end = new types.Position(positionLineNumber - 1, positionColumn - 1);
        return new types.Selection(start, end);
    }
    exports.toSelection = toSelection;
    function fromSelection(selection) {
        var anchor = selection.anchor, active = selection.active;
        return {
            selectionStartLineNumber: anchor.line + 1,
            selectionStartColumn: anchor.character + 1,
            positionLineNumber: active.line + 1,
            positionColumn: active.character + 1
        };
    }
    exports.fromSelection = fromSelection;
    function fromRange(range) {
        if (!range) {
            return undefined;
        }
        var start = range.start, end = range.end;
        return {
            startLineNumber: start.line + 1,
            startColumn: start.character + 1,
            endLineNumber: end.line + 1,
            endColumn: end.character + 1
        };
    }
    exports.fromRange = fromRange;
    function toRange(range) {
        if (!range) {
            return undefined;
        }
        var startLineNumber = range.startLineNumber, startColumn = range.startColumn, endLineNumber = range.endLineNumber, endColumn = range.endColumn;
        return new types.Range(startLineNumber - 1, startColumn - 1, endLineNumber - 1, endColumn - 1);
    }
    exports.toRange = toRange;
    function toPosition(position) {
        return new types.Position(position.lineNumber - 1, position.column - 1);
    }
    exports.toPosition = toPosition;
    function fromPosition(position) {
        return { lineNumber: position.line + 1, column: position.character + 1 };
    }
    exports.fromPosition = fromPosition;
    function fromDiagnosticSeverity(value) {
        switch (value) {
            case types.DiagnosticSeverity.Error:
                return severity_1.default.Error;
            case types.DiagnosticSeverity.Warning:
                return severity_1.default.Warning;
            case types.DiagnosticSeverity.Information:
                return severity_1.default.Info;
            case types.DiagnosticSeverity.Hint:
                return severity_1.default.Ignore;
        }
        return severity_1.default.Error;
    }
    exports.fromDiagnosticSeverity = fromDiagnosticSeverity;
    function toDiagnosticSeverty(value) {
        switch (value) {
            case severity_1.default.Info:
                return types.DiagnosticSeverity.Information;
            case severity_1.default.Warning:
                return types.DiagnosticSeverity.Warning;
            case severity_1.default.Error:
                return types.DiagnosticSeverity.Error;
            case severity_1.default.Ignore:
                return types.DiagnosticSeverity.Hint;
        }
        return types.DiagnosticSeverity.Error;
    }
    exports.toDiagnosticSeverty = toDiagnosticSeverty;
    function fromViewColumn(column) {
        var editorColumn = editor_1.Position.ONE;
        if (typeof column !== 'number') {
            // stick with ONE
        }
        else if (column === types.ViewColumn.Two) {
            editorColumn = editor_1.Position.TWO;
        }
        else if (column === types.ViewColumn.Three) {
            editorColumn = editor_1.Position.THREE;
        }
        return editorColumn;
    }
    exports.fromViewColumn = fromViewColumn;
    function toViewColumn(position) {
        if (typeof position !== 'number') {
            return undefined;
        }
        if (position === editor_1.Position.ONE) {
            return types.ViewColumn.One;
        }
        else if (position === editor_1.Position.TWO) {
            return types.ViewColumn.Two;
        }
        else if (position === editor_1.Position.THREE) {
            return types.ViewColumn.Three;
        }
        return undefined;
    }
    exports.toViewColumn = toViewColumn;
    function isDecorationOptions(something) {
        return (typeof something.range !== 'undefined');
    }
    function isDecorationOptionsArr(something) {
        if (something.length === 0) {
            return true;
        }
        return isDecorationOptions(something[0]) ? true : false;
    }
    var MarkdownString;
    (function (MarkdownString) {
        function fromMany(markup) {
            return markup.map(MarkdownString.from);
        }
        MarkdownString.fromMany = fromMany;
        function from(markup) {
            if (htmlContent.isMarkdownString(markup)) {
                return markup;
            }
            else if (typeof markup === 'string' || !markup) {
                return { value: markup || '', isTrusted: true };
            }
            else {
                var language = markup.language, value = markup.value;
                return { value: '```' + language + '\n' + value + '\n```' };
            }
        }
        MarkdownString.from = from;
        function to(value) {
            var ret = new htmlContent.MarkdownString(value.value);
            ret.isTrusted = value.isTrusted;
            return ret;
        }
        MarkdownString.to = to;
    })(MarkdownString = exports.MarkdownString || (exports.MarkdownString = {}));
    function fromRangeOrRangeWithMessage(ranges) {
        if (isDecorationOptionsArr(ranges)) {
            return ranges.map(function (r) {
                return {
                    range: fromRange(r.range),
                    hoverMessage: Array.isArray(r.hoverMessage) ? MarkdownString.fromMany(r.hoverMessage) : r.hoverMessage && MarkdownString.from(r.hoverMessage),
                    renderOptions: r.renderOptions
                };
            });
        }
        else {
            return ranges.map(function (r) {
                return {
                    range: fromRange(r)
                };
            });
        }
    }
    exports.fromRangeOrRangeWithMessage = fromRangeOrRangeWithMessage;
    exports.TextEdit = {
        from: function (edit) {
            return {
                text: edit.newText,
                eol: EndOfLine.from(edit.newEol),
                range: fromRange(edit.range)
            };
        },
        to: function (edit) {
            var result = new types.TextEdit(toRange(edit.range), edit.text);
            result.newEol = EndOfLine.to(edit.eol);
            return result;
        }
    };
    var SymbolKind;
    (function (SymbolKind) {
        var _fromMapping = Object.create(null);
        _fromMapping[types.SymbolKind.File] = modes.SymbolKind.File;
        _fromMapping[types.SymbolKind.Module] = modes.SymbolKind.Module;
        _fromMapping[types.SymbolKind.Namespace] = modes.SymbolKind.Namespace;
        _fromMapping[types.SymbolKind.Package] = modes.SymbolKind.Package;
        _fromMapping[types.SymbolKind.Class] = modes.SymbolKind.Class;
        _fromMapping[types.SymbolKind.Method] = modes.SymbolKind.Method;
        _fromMapping[types.SymbolKind.Property] = modes.SymbolKind.Property;
        _fromMapping[types.SymbolKind.Field] = modes.SymbolKind.Field;
        _fromMapping[types.SymbolKind.Constructor] = modes.SymbolKind.Constructor;
        _fromMapping[types.SymbolKind.Enum] = modes.SymbolKind.Enum;
        _fromMapping[types.SymbolKind.Interface] = modes.SymbolKind.Interface;
        _fromMapping[types.SymbolKind.Function] = modes.SymbolKind.Function;
        _fromMapping[types.SymbolKind.Variable] = modes.SymbolKind.Variable;
        _fromMapping[types.SymbolKind.Constant] = modes.SymbolKind.Constant;
        _fromMapping[types.SymbolKind.String] = modes.SymbolKind.String;
        _fromMapping[types.SymbolKind.Number] = modes.SymbolKind.Number;
        _fromMapping[types.SymbolKind.Boolean] = modes.SymbolKind.Boolean;
        _fromMapping[types.SymbolKind.Array] = modes.SymbolKind.Array;
        _fromMapping[types.SymbolKind.Object] = modes.SymbolKind.Object;
        _fromMapping[types.SymbolKind.Key] = modes.SymbolKind.Key;
        _fromMapping[types.SymbolKind.Null] = modes.SymbolKind.Null;
        _fromMapping[types.SymbolKind.EnumMember] = modes.SymbolKind.EnumMember;
        _fromMapping[types.SymbolKind.Struct] = modes.SymbolKind.Struct;
        _fromMapping[types.SymbolKind.Event] = modes.SymbolKind.Event;
        _fromMapping[types.SymbolKind.Operator] = modes.SymbolKind.Operator;
        _fromMapping[types.SymbolKind.TypeParameter] = modes.SymbolKind.TypeParameter;
        function from(kind) {
            return _fromMapping[kind] || modes.SymbolKind.Property;
        }
        SymbolKind.from = from;
        function to(kind) {
            for (var k in _fromMapping) {
                if (_fromMapping[k] === kind) {
                    return Number(k);
                }
            }
            return types.SymbolKind.Property;
        }
        SymbolKind.to = to;
    })(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
    function fromSymbolInformation(info) {
        return {
            name: info.name,
            kind: SymbolKind.from(info.kind),
            containerName: info.containerName,
            location: exports.location.from(info.location)
        };
    }
    exports.fromSymbolInformation = fromSymbolInformation;
    function toSymbolInformation(bearing) {
        return new types.SymbolInformation(bearing.name, SymbolKind.to(bearing.kind), bearing.containerName, exports.location.to(bearing.location));
    }
    exports.toSymbolInformation = toSymbolInformation;
    exports.location = {
        from: function (value) {
            return {
                range: value.range && fromRange(value.range),
                uri: value.uri
            };
        },
        to: function (value) {
            return new types.Location(value.uri, toRange(value.range));
        }
    };
    function fromHover(hover) {
        return {
            range: fromRange(hover.range),
            contents: MarkdownString.fromMany(hover.contents)
        };
    }
    exports.fromHover = fromHover;
    function toHover(info) {
        return new types.Hover(info.contents.map(MarkdownString.to), toRange(info.range));
    }
    exports.toHover = toHover;
    function toDocumentHighlight(occurrence) {
        return new types.DocumentHighlight(toRange(occurrence.range), occurrence.kind);
    }
    exports.toDocumentHighlight = toDocumentHighlight;
    exports.CompletionItemKind = {
        from: function (kind) {
            switch (kind) {
                case types.CompletionItemKind.Method: return 'method';
                case types.CompletionItemKind.Function: return 'function';
                case types.CompletionItemKind.Constructor: return 'constructor';
                case types.CompletionItemKind.Field: return 'field';
                case types.CompletionItemKind.Variable: return 'variable';
                case types.CompletionItemKind.Class: return 'class';
                case types.CompletionItemKind.Interface: return 'interface';
                case types.CompletionItemKind.Struct: return 'struct';
                case types.CompletionItemKind.Module: return 'module';
                case types.CompletionItemKind.Property: return 'property';
                case types.CompletionItemKind.Unit: return 'unit';
                case types.CompletionItemKind.Value: return 'value';
                case types.CompletionItemKind.Constant: return 'constant';
                case types.CompletionItemKind.Enum: return 'enum';
                case types.CompletionItemKind.EnumMember: return 'enum-member';
                case types.CompletionItemKind.Keyword: return 'keyword';
                case types.CompletionItemKind.Snippet: return 'snippet';
                case types.CompletionItemKind.Text: return 'text';
                case types.CompletionItemKind.Color: return 'color';
                case types.CompletionItemKind.File: return 'file';
                case types.CompletionItemKind.Reference: return 'reference';
                case types.CompletionItemKind.Folder: return 'folder';
                case types.CompletionItemKind.Event: return 'event';
                case types.CompletionItemKind.Operator: return 'operator';
                case types.CompletionItemKind.TypeParameter: return 'type-parameter';
            }
            return 'property';
        },
        to: function (type) {
            if (!type) {
                return types.CompletionItemKind.Property;
            }
            else {
                return types.CompletionItemKind[type.charAt(0).toUpperCase() + type.substr(1)];
            }
        }
    };
    var Suggest;
    (function (Suggest) {
        function to(position, suggestion) {
            var result = new types.CompletionItem(suggestion.label);
            result.insertText = suggestion.insertText;
            result.kind = exports.CompletionItemKind.to(suggestion.type);
            result.detail = suggestion.detail;
            result.documentation = suggestion.documentation;
            result.sortText = suggestion.sortText;
            result.filterText = suggestion.filterText;
            // 'overwrite[Before|After]'-logic
            var overwriteBefore = (typeof suggestion.overwriteBefore === 'number') ? suggestion.overwriteBefore : 0;
            var startPosition = new types.Position(position.line, Math.max(0, position.character - overwriteBefore));
            var endPosition = position;
            if (typeof suggestion.overwriteAfter === 'number') {
                endPosition = new types.Position(position.line, position.character + suggestion.overwriteAfter);
            }
            result.range = new types.Range(startPosition, endPosition);
            // 'inserText'-logic
            if (suggestion.snippetType === 'textmate') {
                result.insertText = new types.SnippetString(suggestion.insertText);
            }
            else {
                result.insertText = suggestion.insertText;
                result.textEdit = new types.TextEdit(result.range, result.insertText);
            }
            // TODO additionalEdits, command
            return result;
        }
        Suggest.to = to;
    })(Suggest = exports.Suggest || (exports.Suggest = {}));
    ;
    var SignatureHelp;
    (function (SignatureHelp) {
        function from(signatureHelp) {
            return signatureHelp;
        }
        SignatureHelp.from = from;
        function to(hints) {
            return hints;
        }
        SignatureHelp.to = to;
    })(SignatureHelp = exports.SignatureHelp || (exports.SignatureHelp = {}));
    var DocumentLink;
    (function (DocumentLink) {
        function from(link) {
            return {
                range: fromRange(link.range),
                url: link.target && link.target.toString()
            };
        }
        DocumentLink.from = from;
        function to(link) {
            return new types.DocumentLink(toRange(link.range), link.url && uri_1.default.parse(link.url));
        }
        DocumentLink.to = to;
    })(DocumentLink = exports.DocumentLink || (exports.DocumentLink = {}));
    var TextDocumentSaveReason;
    (function (TextDocumentSaveReason) {
        function to(reason) {
            switch (reason) {
                case textfiles_1.SaveReason.AUTO:
                    return types.TextDocumentSaveReason.AfterDelay;
                case textfiles_1.SaveReason.EXPLICIT:
                    return types.TextDocumentSaveReason.Manual;
                case textfiles_1.SaveReason.FOCUS_CHANGE:
                case textfiles_1.SaveReason.WINDOW_CHANGE:
                    return types.TextDocumentSaveReason.FocusOut;
            }
        }
        TextDocumentSaveReason.to = to;
    })(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
    var EndOfLine;
    (function (EndOfLine) {
        function from(eol) {
            if (eol === types.EndOfLine.CRLF) {
                return editorCommon_1.EndOfLineSequence.CRLF;
            }
            else if (eol === types.EndOfLine.LF) {
                return editorCommon_1.EndOfLineSequence.LF;
            }
            return undefined;
        }
        EndOfLine.from = from;
        function to(eol) {
            if (eol === editorCommon_1.EndOfLineSequence.CRLF) {
                return types.EndOfLine.CRLF;
            }
            else if (eol === editorCommon_1.EndOfLineSequence.LF) {
                return types.EndOfLine.LF;
            }
            return undefined;
        }
        EndOfLine.to = to;
    })(EndOfLine = exports.EndOfLine || (exports.EndOfLine = {}));
    var ProgressLocation;
    (function (ProgressLocation) {
        function from(loc) {
            switch (loc) {
                case types.ProgressLocation.SourceControl: return progress_1.ProgressLocation.Scm;
                case types.ProgressLocation.Window: return progress_1.ProgressLocation.Window;
            }
            return undefined;
        }
        ProgressLocation.from = from;
    })(ProgressLocation = exports.ProgressLocation || (exports.ProgressLocation = {}));
});
//# sourceMappingURL=extHostTypeConverters.js.map