import { Range, IRange } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { TextModelWithDecorations } from 'vs/editor/common/model/textModelWithDecorations';
import { Selection } from 'vs/editor/common/core/selection';
import { IDisposable } from 'vs/base/common/lifecycle';
import { LanguageIdentifier } from 'vs/editor/common/modes';
import { ITextSource, IRawTextSource } from 'vs/editor/common/model/textSource';
import * as textModelEvents from 'vs/editor/common/model/textModelEvents';
export interface IValidatedEditOperation {
    sortIndex: number;
    identifier: editorCommon.ISingleEditOperationIdentifier;
    range: Range;
    rangeLength: number;
    lines: string[];
    forceMoveMarkers: boolean;
    isAutoWhitespaceEdit: boolean;
}
export declare class EditableTextModel extends TextModelWithDecorations implements editorCommon.IEditableTextModel {
    static createFromString(text: string, options?: editorCommon.ITextModelCreationOptions, languageIdentifier?: LanguageIdentifier): EditableTextModel;
    onDidChangeRawContent(listener: (e: textModelEvents.ModelRawContentChangedEvent) => void): IDisposable;
    onDidChangeContent(listener: (e: textModelEvents.IModelContentChangedEvent) => void): IDisposable;
    private _commandManager;
    private _isUndoing;
    private _isRedoing;
    private _hasEditableRange;
    private _editableRangeId;
    private _trimAutoWhitespaceLines;
    constructor(rawTextSource: IRawTextSource, creationOptions: editorCommon.ITextModelCreationOptions, languageIdentifier: LanguageIdentifier);
    dispose(): void;
    protected _resetValue(newValue: ITextSource): void;
    pushStackElement(): void;
    pushEditOperations(beforeCursorState: Selection[], editOperations: editorCommon.IIdentifiedSingleEditOperation[], cursorStateComputer: editorCommon.ICursorStateComputer): Selection[];
    private _pushEditOperations(beforeCursorState, editOperations, cursorStateComputer);
    /**
     * Transform operations such that they represent the same logic edit,
     * but that they also do not cause OOM crashes.
     */
    private _reduceOperations(operations);
    _toSingleEditOperation(operations: IValidatedEditOperation[]): IValidatedEditOperation;
    private static _sortOpsAscending(a, b);
    private static _sortOpsDescending(a, b);
    applyEdits(rawOperations: editorCommon.IIdentifiedSingleEditOperation[]): editorCommon.IIdentifiedSingleEditOperation[];
    private _applyEdits(markersTracker, rawOperations);
    /**
     * Assumes `operations` are validated and sorted ascending
     */
    static _getInverseEditRanges(operations: IValidatedEditOperation[]): Range[];
    private _doApplyEdits(markersTracker, operations);
    _assertLineNumbersOK(): void;
    private _undo();
    undo(): Selection[];
    private _redo();
    redo(): Selection[];
    setEditableRange(range: IRange): void;
    private static _DECORATION_OPTION;
    hasEditableRange(): boolean;
    getEditableRange(): Range;
}
