/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/controller/cursorCommon", "vs/editor/common/controller/cursorEvents", "vs/editor/common/controller/cursorMoveCommands", "vs/editor/common/editorCommonExtensions", "vs/editor/common/controller/cursorColumnSelection", "vs/editor/common/editorContextKeys", "vs/platform/keybinding/common/keybindingsRegistry", "vs/editor/common/services/codeEditorService", "vs/platform/contextkey/common/contextkey", "vs/base/common/types", "vs/platform/editor/common/editor", "vs/editor/common/controller/cursorTypeOperations", "vs/editor/common/controller/cursorDeleteOperations"], function (require, exports, position_1, range_1, editorCommon, cursorCommon_1, cursorEvents_1, cursorMoveCommands_1, editorCommonExtensions_1, cursorColumnSelection_1, editorContextKeys_1, keybindingsRegistry_1, codeEditorService_1, contextkey_1, types, editor_1, cursorTypeOperations_1, cursorDeleteOperations_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var H = editorCommon.Handler;
    var CORE_WEIGHT = keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorCore();
    var CoreEditorCommand = (function (_super) {
        __extends(CoreEditorCommand, _super);
        function CoreEditorCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CoreEditorCommand.prototype.runEditorCommand = function (accessor, editor, args) {
            this.runCoreEditorCommand(editor._getCursors(), args || {});
        };
        return CoreEditorCommand;
    }(editorCommonExtensions_1.EditorCommand));
    exports.CoreEditorCommand = CoreEditorCommand;
    var EditorScroll_;
    (function (EditorScroll_) {
        var isEditorScrollArgs = function (arg) {
            if (!types.isObject(arg)) {
                return false;
            }
            var scrollArg = arg;
            if (!types.isString(scrollArg.to)) {
                return false;
            }
            if (!types.isUndefined(scrollArg.by) && !types.isString(scrollArg.by)) {
                return false;
            }
            if (!types.isUndefined(scrollArg.value) && !types.isNumber(scrollArg.value)) {
                return false;
            }
            if (!types.isUndefined(scrollArg.revealCursor) && !types.isBoolean(scrollArg.revealCursor)) {
                return false;
            }
            return true;
        };
        EditorScroll_.description = {
            description: 'Scroll editor in the given direction',
            args: [
                {
                    name: 'Editor scroll argument object',
                    description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t* 'to': A mandatory direction value.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'up', 'down'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'by': Unit to move. Default is computed based on 'to' value.\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'line', 'wrappedLine', 'page', 'halfPage'\n\t\t\t\t\t\t```\n\t\t\t\t\t* 'value': Number of units to move. Default is '1'.\n\t\t\t\t\t* 'revealCursor': If 'true' reveals the cursor if it is outside view port.\n\t\t\t\t",
                    constraint: isEditorScrollArgs
                }
            ]
        };
        /**
         * Directions in the view for editor scroll command.
         */
        EditorScroll_.RawDirection = {
            Up: 'up',
            Down: 'down',
        };
        /**
         * Units for editor scroll 'by' argument
         */
        EditorScroll_.RawUnit = {
            Line: 'line',
            WrappedLine: 'wrappedLine',
            Page: 'page',
            HalfPage: 'halfPage'
        };
        ;
        function parse(args) {
            var direction;
            switch (args.to) {
                case EditorScroll_.RawDirection.Up:
                    direction = 1 /* Up */;
                    break;
                case EditorScroll_.RawDirection.Down:
                    direction = 2 /* Down */;
                    break;
                default:
                    // Illegal arguments
                    return null;
            }
            var unit;
            switch (args.by) {
                case EditorScroll_.RawUnit.Line:
                    unit = 1 /* Line */;
                    break;
                case EditorScroll_.RawUnit.WrappedLine:
                    unit = 2 /* WrappedLine */;
                    break;
                case EditorScroll_.RawUnit.Page:
                    unit = 3 /* Page */;
                    break;
                case EditorScroll_.RawUnit.HalfPage:
                    unit = 4 /* HalfPage */;
                    break;
                default:
                    unit = 2 /* WrappedLine */;
            }
            var value = Math.floor(args.value || 1);
            var revealCursor = !!args.revealCursor;
            return {
                direction: direction,
                unit: unit,
                value: value,
                revealCursor: revealCursor,
                select: (!!args.select)
            };
        }
        EditorScroll_.parse = parse;
        var Direction;
        (function (Direction) {
            Direction[Direction["Up"] = 1] = "Up";
            Direction[Direction["Down"] = 2] = "Down";
        })(Direction = EditorScroll_.Direction || (EditorScroll_.Direction = {}));
        var Unit;
        (function (Unit) {
            Unit[Unit["Line"] = 1] = "Line";
            Unit[Unit["WrappedLine"] = 2] = "WrappedLine";
            Unit[Unit["Page"] = 3] = "Page";
            Unit[Unit["HalfPage"] = 4] = "HalfPage";
        })(Unit = EditorScroll_.Unit || (EditorScroll_.Unit = {}));
    })(EditorScroll_ = exports.EditorScroll_ || (exports.EditorScroll_ = {}));
    var RevealLine_;
    (function (RevealLine_) {
        var isRevealLineArgs = function (arg) {
            if (!types.isObject(arg)) {
                return false;
            }
            var reveaLineArg = arg;
            if (!types.isNumber(reveaLineArg.lineNumber)) {
                return false;
            }
            if (!types.isUndefined(reveaLineArg.at) && !types.isString(reveaLineArg.at)) {
                return false;
            }
            return true;
        };
        RevealLine_.description = {
            description: 'Reveal the given line at the given logical position',
            args: [
                {
                    name: 'Reveal line argument object',
                    description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t* 'lineNumber': A mandatory line number value.\n\t\t\t\t\t* 'at': Logical position at which line has to be revealed .\n\t\t\t\t\t\t```\n\t\t\t\t\t\t'top', 'center', 'bottom'\n\t\t\t\t\t\t```\n\t\t\t\t",
                    constraint: isRevealLineArgs
                }
            ]
        };
        ;
        /**
         * Values for reveal line 'at' argument
         */
        RevealLine_.RawAtArgument = {
            Top: 'top',
            Center: 'center',
            Bottom: 'bottom'
        };
    })(RevealLine_ = exports.RevealLine_ || (exports.RevealLine_ = {}));
    var CoreNavigationCommands;
    (function (CoreNavigationCommands) {
        var BaseMoveToCommand = (function (_super) {
            __extends(BaseMoveToCommand, _super);
            function BaseMoveToCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            BaseMoveToCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursorMoveCommands_1.CursorMoveCommands.moveTo(cursors.context, cursors.getPrimaryCursor(), this._inSelectionMode, args.position, args.viewPosition)
                ]);
                cursors.reveal(true, 0 /* Primary */);
            };
            return BaseMoveToCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.MoveTo = editorCommonExtensions_1.registerEditorCommand(new BaseMoveToCommand({
            id: '_moveTo',
            inSelectionMode: false,
            precondition: null
        }));
        CoreNavigationCommands.MoveToSelect = editorCommonExtensions_1.registerEditorCommand(new BaseMoveToCommand({
            id: '_moveToSelect',
            inSelectionMode: true,
            precondition: null
        }));
        var ColumnSelectCommand = (function (_super) {
            __extends(ColumnSelectCommand, _super);
            function ColumnSelectCommand() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ColumnSelectCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                var result = this._getColumnSelectResult(cursors.context, cursors.getPrimaryCursor(), cursors.getColumnSelectData(), args);
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, result.viewStates.map(function (viewState) { return cursorCommon_1.CursorState.fromViewState(viewState); }));
                cursors.setColumnSelectData({
                    toViewLineNumber: result.toLineNumber,
                    toViewVisualColumn: result.toVisualColumn
                });
                cursors.reveal(true, (result.reversed ? 1 /* TopMost */ : 2 /* BottomMost */));
            };
            return ColumnSelectCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.ColumnSelect = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                return _super.call(this, {
                    id: 'columnSelect',
                    precondition: null
                }) || this;
            }
            class_1.prototype._getColumnSelectResult = function (context, primary, prevColumnSelectData, args) {
                // validate `args`
                var validatedPosition = context.model.validatePosition(args.position);
                var validatedViewPosition;
                if (args.viewPosition) {
                    validatedViewPosition = context.validateViewPosition(new position_1.Position(args.viewPosition.lineNumber, args.viewPosition.column), validatedPosition);
                }
                else {
                    validatedViewPosition = context.convertModelPositionToViewPosition(validatedPosition);
                }
                return cursorColumnSelection_1.ColumnSelection.columnSelect(context.config, context.viewModel, primary.viewState.selection, validatedViewPosition.lineNumber, args.mouseColumn - 1);
            };
            return class_1;
        }(ColumnSelectCommand)));
        CoreNavigationCommands.CursorColumnSelectLeft = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                return _super.call(this, {
                    id: 'cursorColumnSelectLeft',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 15 /* LeftArrow */,
                        linux: { primary: 0 }
                    }
                }) || this;
            }
            class_2.prototype._getColumnSelectResult = function (context, primary, prevColumnSelectData, args) {
                return cursorColumnSelection_1.ColumnSelection.columnSelectLeft(context.config, context.viewModel, primary.viewState, prevColumnSelectData.toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
            };
            return class_2;
        }(ColumnSelectCommand)));
        CoreNavigationCommands.CursorColumnSelectRight = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_3, _super);
            function class_3() {
                return _super.call(this, {
                    id: 'cursorColumnSelectRight',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 17 /* RightArrow */,
                        linux: { primary: 0 }
                    }
                }) || this;
            }
            class_3.prototype._getColumnSelectResult = function (context, primary, prevColumnSelectData, args) {
                return cursorColumnSelection_1.ColumnSelection.columnSelectRight(context.config, context.viewModel, primary.viewState, prevColumnSelectData.toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
            };
            return class_3;
        }(ColumnSelectCommand)));
        var ColumnSelectUpCommand = (function (_super) {
            __extends(ColumnSelectUpCommand, _super);
            function ColumnSelectUpCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._isPaged = opts.isPaged;
                return _this;
            }
            ColumnSelectUpCommand.prototype._getColumnSelectResult = function (context, primary, prevColumnSelectData, args) {
                return cursorColumnSelection_1.ColumnSelection.columnSelectUp(context.config, context.viewModel, primary.viewState, this._isPaged, prevColumnSelectData.toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
            };
            return ColumnSelectUpCommand;
        }(ColumnSelectCommand));
        CoreNavigationCommands.CursorColumnSelectUp = editorCommonExtensions_1.registerEditorCommand(new ColumnSelectUpCommand({
            isPaged: false,
            id: 'cursorColumnSelectUp',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 16 /* UpArrow */,
                linux: { primary: 0 }
            }
        }));
        CoreNavigationCommands.CursorColumnSelectPageUp = editorCommonExtensions_1.registerEditorCommand(new ColumnSelectUpCommand({
            isPaged: true,
            id: 'cursorColumnSelectPageUp',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 11 /* PageUp */,
                linux: { primary: 0 }
            }
        }));
        var ColumnSelectDownCommand = (function (_super) {
            __extends(ColumnSelectDownCommand, _super);
            function ColumnSelectDownCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._isPaged = opts.isPaged;
                return _this;
            }
            ColumnSelectDownCommand.prototype._getColumnSelectResult = function (context, primary, prevColumnSelectData, args) {
                return cursorColumnSelection_1.ColumnSelection.columnSelectDown(context.config, context.viewModel, primary.viewState, this._isPaged, prevColumnSelectData.toViewLineNumber, prevColumnSelectData.toViewVisualColumn);
            };
            return ColumnSelectDownCommand;
        }(ColumnSelectCommand));
        CoreNavigationCommands.CursorColumnSelectDown = editorCommonExtensions_1.registerEditorCommand(new ColumnSelectDownCommand({
            isPaged: false,
            id: 'cursorColumnSelectDown',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 18 /* DownArrow */,
                linux: { primary: 0 }
            }
        }));
        CoreNavigationCommands.CursorColumnSelectPageDown = editorCommonExtensions_1.registerEditorCommand(new ColumnSelectDownCommand({
            isPaged: true,
            id: 'cursorColumnSelectPageDown',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 512 /* Alt */ | 12 /* PageDown */,
                linux: { primary: 0 }
            }
        }));
        var CursorMoveImpl = (function (_super) {
            __extends(CursorMoveImpl, _super);
            function CursorMoveImpl() {
                return _super.call(this, {
                    id: 'cursorMove',
                    precondition: null,
                    description: cursorMoveCommands_1.CursorMove.description
                }) || this;
            }
            CursorMoveImpl.prototype.runCoreEditorCommand = function (cursors, args) {
                var parsed = cursorMoveCommands_1.CursorMove.parse(args);
                if (!parsed) {
                    // illegal arguments
                    return;
                }
                this._runCursorMove(cursors, args.source, parsed);
            };
            CursorMoveImpl.prototype._runCursorMove = function (cursors, source, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, cursorMoveCommands_1.CursorMoveCommands.move(cursors.context, cursors.getAll(), args)));
                cursors.reveal(true, 0 /* Primary */);
            };
            return CursorMoveImpl;
        }(CoreEditorCommand));
        CoreNavigationCommands.CursorMoveImpl = CursorMoveImpl;
        CoreNavigationCommands.CursorMove = editorCommonExtensions_1.registerEditorCommand(new CursorMoveImpl());
        var Constants;
        (function (Constants) {
            Constants[Constants["PAGE_SIZE_MARKER"] = -1] = "PAGE_SIZE_MARKER";
        })(Constants || (Constants = {}));
        var CursorMoveBasedCommand = (function (_super) {
            __extends(CursorMoveBasedCommand, _super);
            function CursorMoveBasedCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._staticArgs = opts.args;
                return _this;
            }
            CursorMoveBasedCommand.prototype.runCoreEditorCommand = function (cursors, dynamicArgs) {
                var args = this._staticArgs;
                if (this._staticArgs.value === -1 /* PAGE_SIZE_MARKER */) {
                    // -1 is a marker for page size
                    args = {
                        direction: this._staticArgs.direction,
                        unit: this._staticArgs.unit,
                        select: this._staticArgs.select,
                        value: cursors.context.config.pageSize
                    };
                }
                CoreNavigationCommands.CursorMove._runCursorMove(cursors, dynamicArgs.source, args);
            };
            return CursorMoveBasedCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.CursorLeft = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 0 /* Left */,
                unit: 0 /* None */,
                select: false,
                value: 1
            },
            id: 'cursorLeft',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 15 /* LeftArrow */,
                mac: { primary: 15 /* LeftArrow */, secondary: [256 /* WinCtrl */ | 32 /* KEY_B */] }
            }
        }));
        CoreNavigationCommands.CursorLeftSelect = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 0 /* Left */,
                unit: 0 /* None */,
                select: true,
                value: 1
            },
            id: 'cursorLeftSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 15 /* LeftArrow */
            }
        }));
        CoreNavigationCommands.CursorRight = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 1 /* Right */,
                unit: 0 /* None */,
                select: false,
                value: 1
            },
            id: 'cursorRight',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 17 /* RightArrow */,
                mac: { primary: 17 /* RightArrow */, secondary: [256 /* WinCtrl */ | 36 /* KEY_F */] }
            }
        }));
        CoreNavigationCommands.CursorRightSelect = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 1 /* Right */,
                unit: 0 /* None */,
                select: true,
                value: 1
            },
            id: 'cursorRightSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 17 /* RightArrow */
            }
        }));
        CoreNavigationCommands.CursorUp = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 2 /* Up */,
                unit: 2 /* WrappedLine */,
                select: false,
                value: 1
            },
            id: 'cursorUp',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 16 /* UpArrow */,
                mac: { primary: 16 /* UpArrow */, secondary: [256 /* WinCtrl */ | 46 /* KEY_P */] }
            }
        }));
        CoreNavigationCommands.CursorUpSelect = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 2 /* Up */,
                unit: 2 /* WrappedLine */,
                select: true,
                value: 1
            },
            id: 'cursorUpSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 16 /* UpArrow */,
                secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 16 /* UpArrow */],
                mac: { primary: 1024 /* Shift */ | 16 /* UpArrow */ },
                linux: { primary: 1024 /* Shift */ | 16 /* UpArrow */ }
            }
        }));
        CoreNavigationCommands.CursorPageUp = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 2 /* Up */,
                unit: 2 /* WrappedLine */,
                select: false,
                value: -1 /* PAGE_SIZE_MARKER */
            },
            id: 'cursorPageUp',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 11 /* PageUp */
            }
        }));
        CoreNavigationCommands.CursorPageUpSelect = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 2 /* Up */,
                unit: 2 /* WrappedLine */,
                select: true,
                value: -1 /* PAGE_SIZE_MARKER */
            },
            id: 'cursorPageUpSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 11 /* PageUp */
            }
        }));
        CoreNavigationCommands.CursorDown = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 3 /* Down */,
                unit: 2 /* WrappedLine */,
                select: false,
                value: 1
            },
            id: 'cursorDown',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 18 /* DownArrow */,
                mac: { primary: 18 /* DownArrow */, secondary: [256 /* WinCtrl */ | 44 /* KEY_N */] }
            }
        }));
        CoreNavigationCommands.CursorDownSelect = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 3 /* Down */,
                unit: 2 /* WrappedLine */,
                select: true,
                value: 1
            },
            id: 'cursorDownSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 18 /* DownArrow */,
                secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 18 /* DownArrow */],
                mac: { primary: 1024 /* Shift */ | 18 /* DownArrow */ },
                linux: { primary: 1024 /* Shift */ | 18 /* DownArrow */ }
            }
        }));
        CoreNavigationCommands.CursorPageDown = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 3 /* Down */,
                unit: 2 /* WrappedLine */,
                select: false,
                value: -1 /* PAGE_SIZE_MARKER */
            },
            id: 'cursorPageDown',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 12 /* PageDown */
            }
        }));
        CoreNavigationCommands.CursorPageDownSelect = editorCommonExtensions_1.registerEditorCommand(new CursorMoveBasedCommand({
            args: {
                direction: 3 /* Down */,
                unit: 2 /* WrappedLine */,
                select: true,
                value: -1 /* PAGE_SIZE_MARKER */
            },
            id: 'cursorPageDownSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 12 /* PageDown */
            }
        }));
        CoreNavigationCommands.CreateCursor = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_4, _super);
            function class_4() {
                return _super.call(this, {
                    id: 'createCursor',
                    precondition: null
                }) || this;
            }
            class_4.prototype.runCoreEditorCommand = function (cursors, args) {
                var context = cursors.context;
                if (context.config.readOnly || context.model.hasEditableRange()) {
                    return;
                }
                var newState;
                if (args.wholeLine) {
                    newState = cursorMoveCommands_1.CursorMoveCommands.line(context, cursors.getPrimaryCursor(), false, args.position, args.viewPosition);
                }
                else {
                    newState = cursorMoveCommands_1.CursorMoveCommands.moveTo(context, cursors.getPrimaryCursor(), false, args.position, args.viewPosition);
                }
                var states = cursors.getAll();
                // Check if we should remove a cursor (sort of like a toggle)
                if (states.length > 1) {
                    var newModelPosition = (newState.modelState ? newState.modelState.position : null);
                    var newViewPosition = (newState.viewState ? newState.viewState.position : null);
                    for (var i = 0, len = states.length; i < len; i++) {
                        var state = states[i];
                        if (newModelPosition && !state.modelState.selection.containsPosition(newModelPosition)) {
                            continue;
                        }
                        if (newViewPosition && !state.viewState.selection.containsPosition(newViewPosition)) {
                            continue;
                        }
                        // => Remove the cursor
                        states.splice(i, 1);
                        cursors.context.model.pushStackElement();
                        cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, states);
                        return;
                    }
                }
                // => Add the new cursor
                states.push(newState);
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, states);
            };
            return class_4;
        }(CoreEditorCommand)));
        CoreNavigationCommands.LastCursorMoveToSelect = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_5, _super);
            function class_5() {
                return _super.call(this, {
                    id: '_lastCursorMoveToSelect',
                    precondition: null
                }) || this;
            }
            class_5.prototype.runCoreEditorCommand = function (cursors, args) {
                var context = cursors.context;
                if (context.config.readOnly || context.model.hasEditableRange()) {
                    return;
                }
                var lastAddedCursorIndex = cursors.getLastAddedCursorIndex();
                var newStates = cursors.getAll().slice(0);
                newStates[lastAddedCursorIndex] = cursorMoveCommands_1.CursorMoveCommands.moveTo(context, newStates[lastAddedCursorIndex], true, args.position, args.viewPosition);
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, newStates);
            };
            return class_5;
        }(CoreEditorCommand)));
        var HomeCommand = (function (_super) {
            __extends(HomeCommand, _super);
            function HomeCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            HomeCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, cursorMoveCommands_1.CursorMoveCommands.moveToBeginningOfLine(cursors.context, cursors.getAll(), this._inSelectionMode)));
                cursors.reveal(true, 0 /* Primary */);
            };
            return HomeCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.CursorHome = editorCommonExtensions_1.registerEditorCommand(new HomeCommand({
            inSelectionMode: false,
            id: 'cursorHome',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 14 /* Home */,
                mac: { primary: 14 /* Home */, secondary: [2048 /* CtrlCmd */ | 15 /* LeftArrow */] }
            }
        }));
        CoreNavigationCommands.CursorHomeSelect = editorCommonExtensions_1.registerEditorCommand(new HomeCommand({
            inSelectionMode: true,
            id: 'cursorHomeSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 14 /* Home */,
                mac: { primary: 1024 /* Shift */ | 14 /* Home */, secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 15 /* LeftArrow */] }
            }
        }));
        CoreNavigationCommands.CursorLineStart = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_6, _super);
            function class_6() {
                return _super.call(this, {
                    id: 'cursorLineStart',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 0,
                        mac: { primary: 256 /* WinCtrl */ | 31 /* KEY_A */ }
                    }
                }) || this;
            }
            class_6.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, this._exec(cursors.context, cursors.getAll())));
                cursors.reveal(true, 0 /* Primary */);
            };
            class_6.prototype._exec = function (context, cursors) {
                var result = [];
                for (var i = 0, len = cursors.length; i < len; i++) {
                    var cursor = cursors[i];
                    var lineNumber = cursor.modelState.position.lineNumber;
                    result[i] = cursorCommon_1.CursorState.fromModelState(cursor.modelState.move(false, lineNumber, 1, 0));
                }
                return result;
            };
            return class_6;
        }(CoreEditorCommand)));
        var EndCommand = (function (_super) {
            __extends(EndCommand, _super);
            function EndCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            EndCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, cursorMoveCommands_1.CursorMoveCommands.moveToEndOfLine(cursors.context, cursors.getAll(), this._inSelectionMode)));
                cursors.reveal(true, 0 /* Primary */);
            };
            return EndCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.CursorEnd = editorCommonExtensions_1.registerEditorCommand(new EndCommand({
            inSelectionMode: false,
            id: 'cursorEnd',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 13 /* End */,
                mac: { primary: 13 /* End */, secondary: [2048 /* CtrlCmd */ | 17 /* RightArrow */] }
            }
        }));
        CoreNavigationCommands.CursorEndSelect = editorCommonExtensions_1.registerEditorCommand(new EndCommand({
            inSelectionMode: true,
            id: 'cursorEndSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 1024 /* Shift */ | 13 /* End */,
                mac: { primary: 1024 /* Shift */ | 13 /* End */, secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 17 /* RightArrow */] }
            }
        }));
        CoreNavigationCommands.CursorLineEnd = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_7, _super);
            function class_7() {
                return _super.call(this, {
                    id: 'cursorLineEnd',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 0,
                        mac: { primary: 256 /* WinCtrl */ | 35 /* KEY_E */ }
                    }
                }) || this;
            }
            class_7.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, this._exec(cursors.context, cursors.getAll())));
                cursors.reveal(true, 0 /* Primary */);
            };
            class_7.prototype._exec = function (context, cursors) {
                var result = [];
                for (var i = 0, len = cursors.length; i < len; i++) {
                    var cursor = cursors[i];
                    var lineNumber = cursor.modelState.position.lineNumber;
                    var maxColumn = context.model.getLineMaxColumn(lineNumber);
                    result[i] = cursorCommon_1.CursorState.fromModelState(cursor.modelState.move(false, lineNumber, maxColumn, 0));
                }
                return result;
            };
            return class_7;
        }(CoreEditorCommand)));
        var TopCommand = (function (_super) {
            __extends(TopCommand, _super);
            function TopCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            TopCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, cursorMoveCommands_1.CursorMoveCommands.moveToBeginningOfBuffer(cursors.context, cursors.getAll(), this._inSelectionMode)));
                cursors.reveal(true, 0 /* Primary */);
            };
            return TopCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.CursorTop = editorCommonExtensions_1.registerEditorCommand(new TopCommand({
            inSelectionMode: false,
            id: 'cursorTop',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 14 /* Home */,
                mac: { primary: 2048 /* CtrlCmd */ | 16 /* UpArrow */ }
            }
        }));
        CoreNavigationCommands.CursorTopSelect = editorCommonExtensions_1.registerEditorCommand(new TopCommand({
            inSelectionMode: true,
            id: 'cursorTopSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 14 /* Home */,
                mac: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 16 /* UpArrow */ }
            }
        }));
        var BottomCommand = (function (_super) {
            __extends(BottomCommand, _super);
            function BottomCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            BottomCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, cursorMoveCommands_1.CursorMoveCommands.moveToEndOfBuffer(cursors.context, cursors.getAll(), this._inSelectionMode)));
                cursors.reveal(true, 0 /* Primary */);
            };
            return BottomCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.CursorBottom = editorCommonExtensions_1.registerEditorCommand(new BottomCommand({
            inSelectionMode: false,
            id: 'cursorBottom',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 13 /* End */,
                mac: { primary: 2048 /* CtrlCmd */ | 18 /* DownArrow */ }
            }
        }));
        CoreNavigationCommands.CursorBottomSelect = editorCommonExtensions_1.registerEditorCommand(new BottomCommand({
            inSelectionMode: true,
            id: 'cursorBottomSelect',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 13 /* End */,
                mac: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 18 /* DownArrow */ }
            }
        }));
        var EditorScrollImpl = (function (_super) {
            __extends(EditorScrollImpl, _super);
            function EditorScrollImpl() {
                return _super.call(this, {
                    id: 'editorScroll',
                    precondition: null,
                    description: EditorScroll_.description
                }) || this;
            }
            EditorScrollImpl.prototype.runCoreEditorCommand = function (cursors, args) {
                var parsed = EditorScroll_.parse(args);
                if (!parsed) {
                    // illegal arguments
                    return;
                }
                this._runEditorScroll(cursors, args.source, parsed);
            };
            EditorScrollImpl.prototype._runEditorScroll = function (cursors, source, args) {
                var desiredScrollTop = this._computeDesiredScrollTop(cursors.context, args);
                if (args.revealCursor) {
                    // must ensure cursor is in new visible range
                    var desiredVisibleViewRange = cursors.context.getCompletelyVisibleViewRangeAtScrollTop(desiredScrollTop);
                    cursors.setStates(source, cursorEvents_1.CursorChangeReason.Explicit, [
                        cursorMoveCommands_1.CursorMoveCommands.findPositionInViewportIfOutside(cursors.context, cursors.getPrimaryCursor(), desiredVisibleViewRange, args.select)
                    ]);
                }
                cursors.scrollTo(desiredScrollTop);
            };
            EditorScrollImpl.prototype._computeDesiredScrollTop = function (context, args) {
                if (args.unit === 1 /* Line */) {
                    // scrolling by model lines
                    var visibleModelRange = context.getCompletelyVisibleModelRange();
                    var desiredTopModelLineNumber = void 0;
                    if (args.direction === 1 /* Up */) {
                        // must go x model lines up
                        desiredTopModelLineNumber = Math.max(1, visibleModelRange.startLineNumber - args.value);
                    }
                    else {
                        // must go x model lines down
                        desiredTopModelLineNumber = Math.min(context.model.getLineCount(), visibleModelRange.startLineNumber + args.value);
                    }
                    var desiredTopViewPosition = context.convertModelPositionToViewPosition(new position_1.Position(desiredTopModelLineNumber, 1));
                    return context.getVerticalOffsetForViewLine(desiredTopViewPosition.lineNumber);
                }
                var noOfLines;
                if (args.unit === 3 /* Page */) {
                    noOfLines = context.config.pageSize * args.value;
                }
                else if (args.unit === 4 /* HalfPage */) {
                    noOfLines = Math.round(context.config.pageSize / 2) * args.value;
                }
                else {
                    noOfLines = args.value;
                }
                var deltaLines = (args.direction === 1 /* Up */ ? -1 : 1) * noOfLines;
                return context.getCurrentScrollTop() + deltaLines * context.config.lineHeight;
            };
            return EditorScrollImpl;
        }(CoreEditorCommand));
        CoreNavigationCommands.EditorScrollImpl = EditorScrollImpl;
        CoreNavigationCommands.EditorScroll = editorCommonExtensions_1.registerEditorCommand(new EditorScrollImpl());
        CoreNavigationCommands.ScrollLineUp = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_8, _super);
            function class_8() {
                return _super.call(this, {
                    id: 'scrollLineUp',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 16 /* UpArrow */,
                        mac: { primary: 256 /* WinCtrl */ | 11 /* PageUp */ }
                    }
                }) || this;
            }
            class_8.prototype.runCoreEditorCommand = function (cursors, args) {
                CoreNavigationCommands.EditorScroll._runEditorScroll(cursors, args.source, {
                    direction: 1 /* Up */,
                    unit: 2 /* WrappedLine */,
                    value: 1,
                    revealCursor: false,
                    select: false
                });
            };
            return class_8;
        }(CoreEditorCommand)));
        CoreNavigationCommands.ScrollPageUp = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_9, _super);
            function class_9() {
                return _super.call(this, {
                    id: 'scrollPageUp',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 11 /* PageUp */,
                        win: { primary: 512 /* Alt */ | 11 /* PageUp */ },
                        linux: { primary: 512 /* Alt */ | 11 /* PageUp */ }
                    }
                }) || this;
            }
            class_9.prototype.runCoreEditorCommand = function (cursors, args) {
                CoreNavigationCommands.EditorScroll._runEditorScroll(cursors, args.source, {
                    direction: 1 /* Up */,
                    unit: 3 /* Page */,
                    value: 1,
                    revealCursor: false,
                    select: false
                });
            };
            return class_9;
        }(CoreEditorCommand)));
        CoreNavigationCommands.ScrollLineDown = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_10, _super);
            function class_10() {
                return _super.call(this, {
                    id: 'scrollLineDown',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 18 /* DownArrow */,
                        mac: { primary: 256 /* WinCtrl */ | 12 /* PageDown */ }
                    }
                }) || this;
            }
            class_10.prototype.runCoreEditorCommand = function (cursors, args) {
                CoreNavigationCommands.EditorScroll._runEditorScroll(cursors, args.source, {
                    direction: 2 /* Down */,
                    unit: 2 /* WrappedLine */,
                    value: 1,
                    revealCursor: false,
                    select: false
                });
            };
            return class_10;
        }(CoreEditorCommand)));
        CoreNavigationCommands.ScrollPageDown = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_11, _super);
            function class_11() {
                return _super.call(this, {
                    id: 'scrollPageDown',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 12 /* PageDown */,
                        win: { primary: 512 /* Alt */ | 12 /* PageDown */ },
                        linux: { primary: 512 /* Alt */ | 12 /* PageDown */ }
                    }
                }) || this;
            }
            class_11.prototype.runCoreEditorCommand = function (cursors, args) {
                CoreNavigationCommands.EditorScroll._runEditorScroll(cursors, args.source, {
                    direction: 2 /* Down */,
                    unit: 3 /* Page */,
                    value: 1,
                    revealCursor: false,
                    select: false
                });
            };
            return class_11;
        }(CoreEditorCommand)));
        var WordCommand = (function (_super) {
            __extends(WordCommand, _super);
            function WordCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            WordCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursorMoveCommands_1.CursorMoveCommands.word(cursors.context, cursors.getPrimaryCursor(), this._inSelectionMode, args.position)
                ]);
                cursors.reveal(true, 0 /* Primary */);
            };
            return WordCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.WordSelect = editorCommonExtensions_1.registerEditorCommand(new WordCommand({
            inSelectionMode: false,
            id: '_wordSelect',
            precondition: null
        }));
        CoreNavigationCommands.WordSelectDrag = editorCommonExtensions_1.registerEditorCommand(new WordCommand({
            inSelectionMode: true,
            id: '_wordSelectDrag',
            precondition: null
        }));
        CoreNavigationCommands.LastCursorWordSelect = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_12, _super);
            function class_12() {
                return _super.call(this, {
                    id: 'lastCursorWordSelect',
                    precondition: null
                }) || this;
            }
            class_12.prototype.runCoreEditorCommand = function (cursors, args) {
                var context = cursors.context;
                if (context.config.readOnly || context.model.hasEditableRange()) {
                    return;
                }
                var lastAddedCursorIndex = cursors.getLastAddedCursorIndex();
                var newStates = cursors.getAll().slice(0);
                newStates[lastAddedCursorIndex] = cursorMoveCommands_1.CursorMoveCommands.word(context, newStates[lastAddedCursorIndex], true, args.position);
                context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, newStates);
            };
            return class_12;
        }(CoreEditorCommand)));
        var LineCommand = (function (_super) {
            __extends(LineCommand, _super);
            function LineCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            LineCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursorMoveCommands_1.CursorMoveCommands.line(cursors.context, cursors.getPrimaryCursor(), this._inSelectionMode, args.position, args.viewPosition)
                ]);
                cursors.reveal(false, 0 /* Primary */);
            };
            return LineCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.LineSelect = editorCommonExtensions_1.registerEditorCommand(new LineCommand({
            inSelectionMode: false,
            id: '_lineSelect',
            precondition: null
        }));
        CoreNavigationCommands.LineSelectDrag = editorCommonExtensions_1.registerEditorCommand(new LineCommand({
            inSelectionMode: true,
            id: '_lineSelectDrag',
            precondition: null
        }));
        var LastCursorLineCommand = (function (_super) {
            __extends(LastCursorLineCommand, _super);
            function LastCursorLineCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._inSelectionMode = opts.inSelectionMode;
                return _this;
            }
            LastCursorLineCommand.prototype.runCoreEditorCommand = function (cursors, args) {
                var context = cursors.context;
                if (context.config.readOnly || context.model.hasEditableRange()) {
                    return;
                }
                var lastAddedCursorIndex = cursors.getLastAddedCursorIndex();
                var newStates = cursors.getAll().slice(0);
                newStates[lastAddedCursorIndex] = cursorMoveCommands_1.CursorMoveCommands.line(cursors.context, newStates[lastAddedCursorIndex], this._inSelectionMode, args.position, args.viewPosition);
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, newStates);
            };
            return LastCursorLineCommand;
        }(CoreEditorCommand));
        CoreNavigationCommands.LastCursorLineSelect = editorCommonExtensions_1.registerEditorCommand(new LastCursorLineCommand({
            inSelectionMode: false,
            id: 'lastCursorLineSelect',
            precondition: null
        }));
        CoreNavigationCommands.LastCursorLineSelectDrag = editorCommonExtensions_1.registerEditorCommand(new LastCursorLineCommand({
            inSelectionMode: true,
            id: 'lastCursorLineSelectDrag',
            precondition: null
        }));
        CoreNavigationCommands.ExpandLineSelection = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_13, _super);
            function class_13() {
                return _super.call(this, {
                    id: 'expandLineSelection',
                    precondition: null,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 2048 /* CtrlCmd */ | 39 /* KEY_I */
                    }
                }) || this;
            }
            class_13.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(cursors.context, cursorMoveCommands_1.CursorMoveCommands.expandLineSelection(cursors.context, cursors.getAll())));
                cursors.reveal(true, 0 /* Primary */);
            };
            return class_13;
        }(CoreEditorCommand)));
        CoreNavigationCommands.CancelSelection = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_14, _super);
            function class_14() {
                return _super.call(this, {
                    id: 'cancelSelection',
                    precondition: editorContextKeys_1.EditorContextKeys.hasNonEmptySelection,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 9 /* Escape */,
                        secondary: [1024 /* Shift */ | 9 /* Escape */]
                    }
                }) || this;
            }
            class_14.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursorMoveCommands_1.CursorMoveCommands.cancelSelection(cursors.context, cursors.getPrimaryCursor())
                ]);
                cursors.reveal(true, 0 /* Primary */);
            };
            return class_14;
        }(CoreEditorCommand)));
        CoreNavigationCommands.RemoveSecondaryCursors = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_15, _super);
            function class_15() {
                return _super.call(this, {
                    id: 'removeSecondaryCursors',
                    precondition: editorContextKeys_1.EditorContextKeys.hasMultipleSelections,
                    kbOpts: {
                        weight: CORE_WEIGHT + 1,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 9 /* Escape */,
                        secondary: [1024 /* Shift */ | 9 /* Escape */]
                    }
                }) || this;
            }
            class_15.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursors.getPrimaryCursor()
                ]);
                cursors.reveal(true, 0 /* Primary */);
            };
            return class_15;
        }(CoreEditorCommand)));
        CoreNavigationCommands.RevealLine = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_16, _super);
            function class_16() {
                return _super.call(this, {
                    id: 'revealLine',
                    precondition: null,
                    description: RevealLine_.description
                }) || this;
            }
            class_16.prototype.runCoreEditorCommand = function (cursors, args) {
                var revealLineArg = args;
                var lineNumber = revealLineArg.lineNumber + 1;
                if (lineNumber < 1) {
                    lineNumber = 1;
                }
                var lineCount = cursors.context.model.getLineCount();
                if (lineNumber > lineCount) {
                    lineNumber = lineCount;
                }
                var range = new range_1.Range(lineNumber, 1, lineNumber, cursors.context.model.getLineMaxColumn(lineNumber));
                var revealAt = 0 /* Simple */;
                if (revealLineArg.at) {
                    switch (revealLineArg.at) {
                        case RevealLine_.RawAtArgument.Top:
                            revealAt = 3 /* Top */;
                            break;
                        case RevealLine_.RawAtArgument.Center:
                            revealAt = 1 /* Center */;
                            break;
                        case RevealLine_.RawAtArgument.Bottom:
                            revealAt = 4 /* Bottom */;
                            break;
                        default:
                            break;
                    }
                }
                var viewRange = cursors.context.convertModelRangeToViewRange(range);
                cursors.revealRange(false, viewRange, revealAt);
            };
            return class_16;
        }(CoreEditorCommand)));
        CoreNavigationCommands.SelectAll = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_17, _super);
            function class_17() {
                return _super.call(this, {
                    id: 'selectAll',
                    precondition: null
                }) || this;
            }
            class_17.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursorMoveCommands_1.CursorMoveCommands.selectAll(cursors.context, cursors.getPrimaryCursor())
                ]);
            };
            return class_17;
        }(CoreEditorCommand)));
        CoreNavigationCommands.SetSelection = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_18, _super);
            function class_18() {
                return _super.call(this, {
                    id: 'setSelection',
                    precondition: null
                }) || this;
            }
            class_18.prototype.runCoreEditorCommand = function (cursors, args) {
                cursors.context.model.pushStackElement();
                cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, [
                    cursorCommon_1.CursorState.fromModelSelection(args.selection)
                ]);
            };
            return class_18;
        }(CoreEditorCommand)));
    })(CoreNavigationCommands = exports.CoreNavigationCommands || (exports.CoreNavigationCommands = {}));
    var CoreEditingCommands;
    (function (CoreEditingCommands) {
        CoreEditingCommands.LineBreakInsert = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_19, _super);
            function class_19() {
                return _super.call(this, {
                    id: 'lineBreakInsert',
                    precondition: editorContextKeys_1.EditorContextKeys.writable,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: null,
                        mac: { primary: 256 /* WinCtrl */ | 45 /* KEY_O */ }
                    }
                }) || this;
            }
            class_19.prototype.runEditorCommand = function (accessor, editor, args) {
                editor.pushUndoStop();
                editor.executeCommands(this.id, cursorTypeOperations_1.TypeOperations.lineBreakInsert(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
            };
            return class_19;
        }(editorCommonExtensions_1.EditorCommand)));
        CoreEditingCommands.Outdent = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_20, _super);
            function class_20() {
                return _super.call(this, {
                    id: 'outdent',
                    precondition: editorContextKeys_1.EditorContextKeys.writable,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.textFocus, editorContextKeys_1.EditorContextKeys.tabDoesNotMoveFocus),
                        primary: 1024 /* Shift */ | 2 /* Tab */
                    }
                }) || this;
            }
            class_20.prototype.runEditorCommand = function (accessor, editor, args) {
                editor.pushUndoStop();
                editor.executeCommands(this.id, cursorTypeOperations_1.TypeOperations.outdent(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
                editor.pushUndoStop();
            };
            return class_20;
        }(editorCommonExtensions_1.EditorCommand)));
        CoreEditingCommands.Tab = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_21, _super);
            function class_21() {
                return _super.call(this, {
                    id: 'tab',
                    precondition: editorContextKeys_1.EditorContextKeys.writable,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.textFocus, editorContextKeys_1.EditorContextKeys.tabDoesNotMoveFocus),
                        primary: 2 /* Tab */
                    }
                }) || this;
            }
            class_21.prototype.runEditorCommand = function (accessor, editor, args) {
                editor.pushUndoStop();
                editor.executeCommands(this.id, cursorTypeOperations_1.TypeOperations.tab(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
                editor.pushUndoStop();
            };
            return class_21;
        }(editorCommonExtensions_1.EditorCommand)));
        CoreEditingCommands.DeleteLeft = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_22, _super);
            function class_22() {
                return _super.call(this, {
                    id: 'deleteLeft',
                    precondition: editorContextKeys_1.EditorContextKeys.writable,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 1 /* Backspace */,
                        secondary: [1024 /* Shift */ | 1 /* Backspace */],
                        mac: { primary: 1 /* Backspace */, secondary: [1024 /* Shift */ | 1 /* Backspace */, 256 /* WinCtrl */ | 38 /* KEY_H */, 256 /* WinCtrl */ | 1 /* Backspace */] }
                    }
                }) || this;
            }
            class_22.prototype.runEditorCommand = function (accessor, editor, args) {
                var _a = cursorDeleteOperations_1.DeleteOperations.deleteLeft(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()), shouldPushStackElementBefore = _a[0], commands = _a[1];
                if (shouldPushStackElementBefore) {
                    editor.pushUndoStop();
                }
                editor.executeCommands(this.id, commands);
            };
            return class_22;
        }(editorCommonExtensions_1.EditorCommand)));
        CoreEditingCommands.DeleteRight = editorCommonExtensions_1.registerEditorCommand(new (function (_super) {
            __extends(class_23, _super);
            function class_23() {
                return _super.call(this, {
                    id: 'deleteRight',
                    precondition: editorContextKeys_1.EditorContextKeys.writable,
                    kbOpts: {
                        weight: CORE_WEIGHT,
                        kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                        primary: 20 /* Delete */,
                        mac: { primary: 20 /* Delete */, secondary: [256 /* WinCtrl */ | 34 /* KEY_D */, 256 /* WinCtrl */ | 20 /* Delete */] }
                    }
                }) || this;
            }
            class_23.prototype.runEditorCommand = function (accessor, editor, args) {
                var _a = cursorDeleteOperations_1.DeleteOperations.deleteRight(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()), shouldPushStackElementBefore = _a[0], commands = _a[1];
                if (shouldPushStackElementBefore) {
                    editor.pushUndoStop();
                }
                editor.executeCommands(this.id, commands);
            };
            return class_23;
        }(editorCommonExtensions_1.EditorCommand)));
    })(CoreEditingCommands = exports.CoreEditingCommands || (exports.CoreEditingCommands = {}));
    var Config;
    (function (Config) {
        function findFocusedEditor(accessor) {
            return accessor.get(codeEditorService_1.ICodeEditorService).getFocusedCodeEditor();
        }
        function getWorkbenchActiveEditor(accessor) {
            var editorService = accessor.get(editor_1.IEditorService);
            var activeEditor = editorService.getActiveEditor && editorService.getActiveEditor();
            return codeEditorService_1.getCodeEditor(activeEditor);
        }
        function registerCommand(command) {
            keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(command.toCommandAndKeybindingRule(CORE_WEIGHT));
        }
        /**
         * A command that will:
         *  1. invoke a command on the focused editor.
         *  2. otherwise, invoke a browser built-in command on the `activeElement`.
         *  3. otherwise, invoke a command on the workbench active editor.
         */
        var EditorOrNativeTextInputCommand = (function (_super) {
            __extends(EditorOrNativeTextInputCommand, _super);
            function EditorOrNativeTextInputCommand(opts) {
                var _this = _super.call(this, opts) || this;
                _this._editorHandler = opts.editorHandler;
                _this._inputHandler = opts.inputHandler;
                return _this;
            }
            EditorOrNativeTextInputCommand.prototype.runCommand = function (accessor, args) {
                var focusedEditor = findFocusedEditor(accessor);
                // Only if editor text focus (i.e. not if editor has widget focus).
                if (focusedEditor && focusedEditor.isFocused()) {
                    return this._runEditorHandler(focusedEditor, args);
                }
                // Ignore this action when user is focused on an element that allows for entering text
                var activeElement = document.activeElement;
                if (activeElement && ['input', 'textarea'].indexOf(activeElement.tagName.toLowerCase()) >= 0) {
                    document.execCommand(this._inputHandler);
                    return;
                }
                // Redirecting to last active editor
                var activeEditor = getWorkbenchActiveEditor(accessor);
                if (activeEditor) {
                    activeEditor.focus();
                    return this._runEditorHandler(activeEditor, args);
                }
            };
            EditorOrNativeTextInputCommand.prototype._runEditorHandler = function (editor, args) {
                var HANDLER = this._editorHandler;
                if (typeof HANDLER === 'string') {
                    editor.trigger('keyboard', HANDLER, args);
                }
                else {
                    args = args || {};
                    args.source = 'keyboard';
                    HANDLER.runEditorCommand(null, editor, args);
                }
            };
            return EditorOrNativeTextInputCommand;
        }(editorCommonExtensions_1.Command));
        registerCommand(new EditorOrNativeTextInputCommand({
            editorHandler: CoreNavigationCommands.SelectAll,
            inputHandler: 'selectAll',
            id: 'editor.action.selectAll',
            precondition: null,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: null,
                primary: 2048 /* CtrlCmd */ | 31 /* KEY_A */
            }
        }));
        registerCommand(new EditorOrNativeTextInputCommand({
            editorHandler: H.Undo,
            inputHandler: 'undo',
            id: H.Undo,
            precondition: editorContextKeys_1.EditorContextKeys.writable,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 56 /* KEY_Z */
            }
        }));
        registerCommand(new EditorOrNativeTextInputCommand({
            editorHandler: H.Redo,
            inputHandler: 'redo',
            id: H.Redo,
            precondition: editorContextKeys_1.EditorContextKeys.writable,
            kbOpts: {
                weight: CORE_WEIGHT,
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: 2048 /* CtrlCmd */ | 55 /* KEY_Y */,
                secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 56 /* KEY_Z */],
                mac: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 56 /* KEY_Z */ }
            }
        }));
        /**
         * A command that will invoke a command on the focused editor.
         */
        var EditorHandlerCommand = (function (_super) {
            __extends(EditorHandlerCommand, _super);
            function EditorHandlerCommand(id, handlerId) {
                var _this = _super.call(this, {
                    id: id,
                    precondition: null
                }) || this;
                _this._handlerId = handlerId;
                return _this;
            }
            EditorHandlerCommand.prototype.runCommand = function (accessor, args) {
                var editor = findFocusedEditor(accessor);
                if (!editor) {
                    return;
                }
                editor.trigger('keyboard', this._handlerId, args);
            };
            return EditorHandlerCommand;
        }(editorCommonExtensions_1.Command));
        function registerOverwritableCommand(handlerId) {
            registerCommand(new EditorHandlerCommand('default:' + handlerId, handlerId));
            registerCommand(new EditorHandlerCommand(handlerId, handlerId));
        }
        registerOverwritableCommand(H.Type);
        registerOverwritableCommand(H.ReplacePreviousChar);
        registerOverwritableCommand(H.CompositionStart);
        registerOverwritableCommand(H.CompositionEnd);
        registerOverwritableCommand(H.Paste);
        registerOverwritableCommand(H.Cut);
    })(Config || (Config = {}));
});
//# sourceMappingURL=coreCommands.js.map