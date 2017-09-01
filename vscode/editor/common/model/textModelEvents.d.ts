import { IRange } from 'vs/editor/common/core/range';
/**
 * @internal
 */
export declare const TextModelEventType: {
    ModelDispose: string;
    ModelTokensChanged: string;
    ModelLanguageChanged: string;
    ModelOptionsChanged: string;
    ModelContentChanged: string;
    ModelRawContentChanged2: string;
    ModelDecorationsChanged: string;
};
/**
 * An event describing that the current mode associated with a model has changed.
 */
export interface IModelLanguageChangedEvent {
    /**
     * Previous language
     */
    readonly oldLanguage: string;
    /**
     * New language
     */
    readonly newLanguage: string;
}
export interface IModelContentChange {
    /**
     * The range that got replaced.
     */
    readonly range: IRange;
    /**
     * The length of the range that got replaced.
     */
    readonly rangeLength: number;
    /**
     * The new text for the range.
     */
    readonly text: string;
}
/**
 * An event describing a change in the text of a model.
 */
export interface IModelContentChangedEvent {
    readonly changes: IModelContentChange[];
    /**
     * The (new) end-of-line character.
     */
    readonly eol: string;
    /**
     * The new version id the model has transitioned to.
     */
    readonly versionId: number;
    /**
     * Flag that indicates that this event was generated while undoing.
     */
    readonly isUndoing: boolean;
    /**
     * Flag that indicates that this event was generated while redoing.
     */
    readonly isRedoing: boolean;
    /**
     * Flag that indicates that all decorations were lost with this edit.
     * The model has been reset to a new value.
     */
    readonly isFlush: boolean;
}
/**
 * An event describing that model decorations have changed.
 */
export interface IModelDecorationsChangedEvent {
    /**
     * Lists of ids for added decorations.
     */
    readonly addedDecorations: string[];
    /**
     * Lists of ids for changed decorations.
     */
    readonly changedDecorations: string[];
    /**
     * List of ids for removed decorations.
     */
    readonly removedDecorations: string[];
}
/**
 * An event describing that some ranges of lines have been tokenized (their tokens have changed).
 */
export interface IModelTokensChangedEvent {
    readonly ranges: {
        /**
         * The start of the range (inclusive)
         */
        readonly fromLineNumber: number;
        /**
         * The end of the range (inclusive)
         */
        readonly toLineNumber: number;
    }[];
}
export interface IModelOptionsChangedEvent {
    readonly tabSize: boolean;
    readonly insertSpaces: boolean;
    readonly trimAutoWhitespace: boolean;
}
/**
 * @internal
 */
export declare const enum RawContentChangedType {
    Flush = 1,
    LineChanged = 2,
    LinesDeleted = 3,
    LinesInserted = 4,
    EOLChanged = 5,
}
/**
 * An event describing that a model has been reset to a new value.
 * @internal
 */
export declare class ModelRawFlush {
    readonly changeType: RawContentChangedType;
}
/**
 * An event describing that a line has changed in a model.
 * @internal
 */
export declare class ModelRawLineChanged {
    readonly changeType: RawContentChangedType;
    /**
     * The line that has changed.
     */
    readonly lineNumber: number;
    /**
     * The new value of the line.
     */
    readonly detail: string;
    constructor(lineNumber: number, detail: string);
}
/**
 * An event describing that line(s) have been deleted in a model.
 * @internal
 */
export declare class ModelRawLinesDeleted {
    readonly changeType: RawContentChangedType;
    /**
     * At what line the deletion began (inclusive).
     */
    readonly fromLineNumber: number;
    /**
     * At what line the deletion stopped (inclusive).
     */
    readonly toLineNumber: number;
    constructor(fromLineNumber: number, toLineNumber: number);
}
/**
 * An event describing that line(s) have been inserted in a model.
 * @internal
 */
export declare class ModelRawLinesInserted {
    readonly changeType: RawContentChangedType;
    /**
     * Before what line did the insertion begin
     */
    readonly fromLineNumber: number;
    /**
     * `toLineNumber` - `fromLineNumber` + 1 denotes the number of lines that were inserted
     */
    readonly toLineNumber: number;
    /**
     * The text that was inserted
     */
    readonly detail: string;
    constructor(fromLineNumber: number, toLineNumber: number, detail: string);
}
/**
 * An event describing that a model has had its EOL changed.
 * @internal
 */
export declare class ModelRawEOLChanged {
    readonly changeType: RawContentChangedType;
}
/**
 * @internal
 */
export declare type ModelRawChange = ModelRawFlush | ModelRawLineChanged | ModelRawLinesDeleted | ModelRawLinesInserted | ModelRawEOLChanged;
/**
 * An event describing a change in the text of a model.
 * @internal
 */
export declare class ModelRawContentChangedEvent {
    readonly changes: ModelRawChange[];
    /**
     * The new version id the model has transitioned to.
     */
    readonly versionId: number;
    /**
     * Flag that indicates that this event was generated while undoing.
     */
    readonly isUndoing: boolean;
    /**
     * Flag that indicates that this event was generated while redoing.
     */
    readonly isRedoing: boolean;
    constructor(changes: ModelRawChange[], versionId: number, isUndoing: boolean, isRedoing: boolean);
    containsEvent(type: RawContentChangedType): boolean;
}
