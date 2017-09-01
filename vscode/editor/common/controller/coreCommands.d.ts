import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICursors } from 'vs/editor/common/controller/cursorCommon';
import { CursorMove as CursorMove_ } from 'vs/editor/common/controller/cursorMoveCommands';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { EditorCommand } from 'vs/editor/common/editorCommonExtensions';
import { ICommandHandlerDescription } from 'vs/platform/commands/common/commands';
export declare abstract class CoreEditorCommand extends EditorCommand {
    runEditorCommand(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor, args: any): void;
    abstract runCoreEditorCommand(cursors: ICursors, args: any): void;
}
export declare namespace EditorScroll_ {
    const description: ICommandHandlerDescription;
    /**
     * Directions in the view for editor scroll command.
     */
    const RawDirection: {
        Up: string;
        Down: string;
    };
    /**
     * Units for editor scroll 'by' argument
     */
    const RawUnit: {
        Line: string;
        WrappedLine: string;
        Page: string;
        HalfPage: string;
    };
    /**
     * Arguments for editor scroll command
     */
    interface RawArguments {
        to: string;
        by?: string;
        value?: number;
        revealCursor?: boolean;
        select?: boolean;
    }
    function parse(args: RawArguments): ParsedArguments;
    interface ParsedArguments {
        direction: Direction;
        unit: Unit;
        value: number;
        revealCursor: boolean;
        select: boolean;
    }
    const enum Direction {
        Up = 1,
        Down = 2,
    }
    const enum Unit {
        Line = 1,
        WrappedLine = 2,
        Page = 3,
        HalfPage = 4,
    }
}
export declare namespace RevealLine_ {
    const description: ICommandHandlerDescription;
    /**
     * Arguments for reveal line command
     */
    interface RawArguments {
        lineNumber?: number;
        at?: string;
    }
    /**
     * Values for reveal line 'at' argument
     */
    const RawAtArgument: {
        Top: string;
        Center: string;
        Bottom: string;
    };
}
export declare namespace CoreNavigationCommands {
    const MoveTo: CoreEditorCommand;
    const MoveToSelect: CoreEditorCommand;
    const ColumnSelect: CoreEditorCommand;
    const CursorColumnSelectLeft: CoreEditorCommand;
    const CursorColumnSelectRight: CoreEditorCommand;
    const CursorColumnSelectUp: CoreEditorCommand;
    const CursorColumnSelectPageUp: CoreEditorCommand;
    const CursorColumnSelectDown: CoreEditorCommand;
    const CursorColumnSelectPageDown: CoreEditorCommand;
    class CursorMoveImpl extends CoreEditorCommand {
        constructor();
        runCoreEditorCommand(cursors: ICursors, args: any): void;
        _runCursorMove(cursors: ICursors, source: string, args: CursorMove_.ParsedArguments): void;
    }
    const CursorMove: CursorMoveImpl;
    const CursorLeft: CoreEditorCommand;
    const CursorLeftSelect: CoreEditorCommand;
    const CursorRight: CoreEditorCommand;
    const CursorRightSelect: CoreEditorCommand;
    const CursorUp: CoreEditorCommand;
    const CursorUpSelect: CoreEditorCommand;
    const CursorPageUp: CoreEditorCommand;
    const CursorPageUpSelect: CoreEditorCommand;
    const CursorDown: CoreEditorCommand;
    const CursorDownSelect: CoreEditorCommand;
    const CursorPageDown: CoreEditorCommand;
    const CursorPageDownSelect: CoreEditorCommand;
    const CreateCursor: CoreEditorCommand;
    const LastCursorMoveToSelect: CoreEditorCommand;
    const CursorHome: CoreEditorCommand;
    const CursorHomeSelect: CoreEditorCommand;
    const CursorLineStart: CoreEditorCommand;
    const CursorEnd: CoreEditorCommand;
    const CursorEndSelect: CoreEditorCommand;
    const CursorLineEnd: CoreEditorCommand;
    const CursorTop: CoreEditorCommand;
    const CursorTopSelect: CoreEditorCommand;
    const CursorBottom: CoreEditorCommand;
    const CursorBottomSelect: CoreEditorCommand;
    class EditorScrollImpl extends CoreEditorCommand {
        constructor();
        runCoreEditorCommand(cursors: ICursors, args: any): void;
        _runEditorScroll(cursors: ICursors, source: string, args: EditorScroll_.ParsedArguments): void;
        private _computeDesiredScrollTop(context, args);
    }
    const EditorScroll: EditorScrollImpl;
    const ScrollLineUp: CoreEditorCommand;
    const ScrollPageUp: CoreEditorCommand;
    const ScrollLineDown: CoreEditorCommand;
    const ScrollPageDown: CoreEditorCommand;
    const WordSelect: CoreEditorCommand;
    const WordSelectDrag: CoreEditorCommand;
    const LastCursorWordSelect: CoreEditorCommand;
    const LineSelect: CoreEditorCommand;
    const LineSelectDrag: CoreEditorCommand;
    const LastCursorLineSelect: CoreEditorCommand;
    const LastCursorLineSelectDrag: CoreEditorCommand;
    const ExpandLineSelection: CoreEditorCommand;
    const CancelSelection: CoreEditorCommand;
    const RemoveSecondaryCursors: CoreEditorCommand;
    const RevealLine: CoreEditorCommand;
    const SelectAll: CoreEditorCommand;
    const SetSelection: CoreEditorCommand;
}
export declare namespace CoreEditingCommands {
    const LineBreakInsert: EditorCommand;
    const Outdent: EditorCommand;
    const Tab: EditorCommand;
    const DeleteLeft: EditorCommand;
    const DeleteRight: EditorCommand;
}
