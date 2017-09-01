import { CursorState, CursorContext } from 'vs/editor/common/controller/cursorCommon';
import { IPosition } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import { ICommandHandlerDescription } from 'vs/platform/commands/common/commands';
export declare class CursorMoveCommands {
    static addCursorDown(context: CursorContext, cursors: CursorState[]): CursorState[];
    static addCursorUp(context: CursorContext, cursors: CursorState[]): CursorState[];
    static moveToBeginningOfLine(context: CursorContext, cursors: CursorState[], inSelectionMode: boolean): CursorState[];
    private static _moveToLineStart(context, cursor, inSelectionMode);
    private static _moveToLineStartByView(context, cursor, inSelectionMode);
    private static _moveToLineStartByModel(context, cursor, inSelectionMode);
    static moveToEndOfLine(context: CursorContext, cursors: CursorState[], inSelectionMode: boolean): CursorState[];
    private static _moveToLineEnd(context, cursor, inSelectionMode);
    private static _moveToLineEndByView(context, cursor, inSelectionMode);
    private static _moveToLineEndByModel(context, cursor, inSelectionMode);
    static expandLineSelection(context: CursorContext, cursors: CursorState[]): CursorState[];
    static moveToBeginningOfBuffer(context: CursorContext, cursors: CursorState[], inSelectionMode: boolean): CursorState[];
    static moveToEndOfBuffer(context: CursorContext, cursors: CursorState[], inSelectionMode: boolean): CursorState[];
    static selectAll(context: CursorContext, cursor: CursorState): CursorState;
    static line(context: CursorContext, cursor: CursorState, inSelectionMode: boolean, _position: IPosition, _viewPosition: IPosition): CursorState;
    static word(context: CursorContext, cursor: CursorState, inSelectionMode: boolean, _position: IPosition): CursorState;
    static cancelSelection(context: CursorContext, cursor: CursorState): CursorState;
    static moveTo(context: CursorContext, cursor: CursorState, inSelectionMode: boolean, _position: IPosition, _viewPosition: IPosition): CursorState;
    static move(context: CursorContext, cursors: CursorState[], args: CursorMove.ParsedArguments): CursorState[];
    static findPositionInViewportIfOutside(context: CursorContext, cursor: CursorState, visibleViewRange: Range, inSelectionMode: boolean): CursorState;
    /**
     * Find the nth line start included in the range (from the start).
     */
    private static _firstLineNumberInRange(model, range, count);
    /**
     * Find the nth line start included in the range (from the end).
     */
    private static _lastLineNumberInRange(model, range, count);
    private static _moveLeft(context, cursors, inSelectionMode, noOfColumns);
    private static _moveHalfLineLeft(context, cursors, inSelectionMode);
    private static _moveRight(context, cursors, inSelectionMode, noOfColumns);
    private static _moveHalfLineRight(context, cursors, inSelectionMode);
    private static _moveDownByViewLines(context, cursors, inSelectionMode, linesCount);
    private static _moveDownByModelLines(context, cursors, inSelectionMode, linesCount);
    private static _moveUpByViewLines(context, cursors, inSelectionMode, linesCount);
    private static _moveUpByModelLines(context, cursors, inSelectionMode, linesCount);
    private static _moveToViewPosition(context, cursor, inSelectionMode, toViewLineNumber, toViewColumn);
    private static _moveToModelPosition(context, cursor, inSelectionMode, toModelLineNumber, toModelColumn);
    private static _moveToViewMinColumn(context, cursors, inSelectionMode);
    private static _moveToViewFirstNonWhitespaceColumn(context, cursors, inSelectionMode);
    private static _moveToViewCenterColumn(context, cursors, inSelectionMode);
    private static _moveToViewMaxColumn(context, cursors, inSelectionMode);
    private static _moveToViewLastNonWhitespaceColumn(context, cursors, inSelectionMode);
}
export declare namespace CursorMove {
    const description: ICommandHandlerDescription;
    /**
     * Positions in the view for cursor move command.
     */
    const RawDirection: {
        Left: string;
        Right: string;
        Up: string;
        Down: string;
        WrappedLineStart: string;
        WrappedLineFirstNonWhitespaceCharacter: string;
        WrappedLineColumnCenter: string;
        WrappedLineEnd: string;
        WrappedLineLastNonWhitespaceCharacter: string;
        ViewPortTop: string;
        ViewPortCenter: string;
        ViewPortBottom: string;
        ViewPortIfOutside: string;
    };
    /**
     * Units for Cursor move 'by' argument
     */
    const RawUnit: {
        Line: string;
        WrappedLine: string;
        Character: string;
        HalfLine: string;
    };
    /**
     * Arguments for Cursor move command
     */
    interface RawArguments {
        to: string;
        select?: boolean;
        by?: string;
        value?: number;
    }
    function parse(args: RawArguments): ParsedArguments;
    interface ParsedArguments {
        direction: Direction;
        unit: Unit;
        select: boolean;
        value: number;
    }
    const enum Direction {
        Left = 0,
        Right = 1,
        Up = 2,
        Down = 3,
        WrappedLineStart = 4,
        WrappedLineFirstNonWhitespaceCharacter = 5,
        WrappedLineColumnCenter = 6,
        WrappedLineEnd = 7,
        WrappedLineLastNonWhitespaceCharacter = 8,
        ViewPortTop = 9,
        ViewPortCenter = 10,
        ViewPortBottom = 11,
        ViewPortIfOutside = 12,
    }
    const enum Unit {
        None = 0,
        Line = 1,
        WrappedLine = 2,
        Character = 3,
        HalfLine = 4,
    }
}
