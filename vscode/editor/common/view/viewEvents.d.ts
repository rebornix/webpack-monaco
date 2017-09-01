import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import { ScrollEvent } from 'vs/base/common/scrollable';
import { IConfigurationChangedEvent } from 'vs/editor/common/config/editorOptions';
import { IDisposable, Disposable } from 'vs/base/common/lifecycle';
export declare const enum ViewEventType {
    ViewConfigurationChanged = 1,
    ViewCursorStateChanged = 2,
    ViewDecorationsChanged = 3,
    ViewFlushed = 4,
    ViewFocusChanged = 5,
    ViewLineMappingChanged = 6,
    ViewLinesChanged = 7,
    ViewLinesDeleted = 8,
    ViewLinesInserted = 9,
    ViewRevealRangeRequest = 10,
    ViewScrollChanged = 11,
    ViewTokensChanged = 12,
    ViewTokensColorsChanged = 13,
    ViewZonesChanged = 14,
    ViewThemeChanged = 15,
}
export declare class ViewConfigurationChangedEvent {
    readonly type: ViewEventType;
    readonly canUseLayerHinting: boolean;
    readonly pixelRatio: boolean;
    readonly editorClassName: boolean;
    readonly lineHeight: boolean;
    readonly readOnly: boolean;
    readonly accessibilitySupport: boolean;
    readonly emptySelectionClipboard: boolean;
    readonly layoutInfo: boolean;
    readonly fontInfo: boolean;
    readonly viewInfo: boolean;
    readonly wrappingInfo: boolean;
    constructor(source: IConfigurationChangedEvent);
}
export declare class ViewCursorStateChangedEvent {
    readonly type: ViewEventType;
    /**
     * The primary selection is always at index 0.
     */
    readonly selections: Selection[];
    /**
     * Is the primary cursor in the editable range?
     */
    readonly isInEditableRange: boolean;
    constructor(selections: Selection[], isInEditableRange: boolean);
}
export declare class ViewDecorationsChangedEvent {
    readonly type: ViewEventType;
    constructor();
}
export declare class ViewFlushedEvent {
    readonly type: ViewEventType;
    constructor();
}
export declare class ViewFocusChangedEvent {
    readonly type: ViewEventType;
    readonly isFocused: boolean;
    constructor(isFocused: boolean);
}
export declare class ViewLineMappingChangedEvent {
    readonly type: ViewEventType;
    constructor();
}
export declare class ViewLinesChangedEvent {
    readonly type: ViewEventType;
    /**
     * The first line that has changed.
     */
    readonly fromLineNumber: number;
    /**
     * The last line that has changed.
     */
    readonly toLineNumber: number;
    constructor(fromLineNumber: number, toLineNumber: number);
}
export declare class ViewLinesDeletedEvent {
    readonly type: ViewEventType;
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
export declare class ViewLinesInsertedEvent {
    readonly type: ViewEventType;
    /**
     * Before what line did the insertion begin
     */
    readonly fromLineNumber: number;
    /**
     * `toLineNumber` - `fromLineNumber` + 1 denotes the number of lines that were inserted
     */
    readonly toLineNumber: number;
    constructor(fromLineNumber: number, toLineNumber: number);
}
export declare const enum VerticalRevealType {
    Simple = 0,
    Center = 1,
    CenterIfOutsideViewport = 2,
    Top = 3,
    Bottom = 4,
}
export declare class ViewRevealRangeRequestEvent {
    readonly type: ViewEventType;
    /**
     * Range to be reavealed.
     */
    readonly range: Range;
    readonly verticalType: VerticalRevealType;
    /**
     * If true: there should be a horizontal & vertical revealing
     * If false: there should be just a vertical revealing
     */
    readonly revealHorizontal: boolean;
    constructor(range: Range, verticalType: VerticalRevealType, revealHorizontal: boolean);
}
export declare class ViewScrollChangedEvent {
    readonly type: ViewEventType;
    readonly scrollWidth: number;
    readonly scrollLeft: number;
    readonly scrollHeight: number;
    readonly scrollTop: number;
    readonly scrollWidthChanged: boolean;
    readonly scrollLeftChanged: boolean;
    readonly scrollHeightChanged: boolean;
    readonly scrollTopChanged: boolean;
    constructor(source: ScrollEvent);
}
export declare class ViewTokensChangedEvent {
    readonly type: ViewEventType;
    readonly ranges: {
        /**
         * Start line number of range
         */
        readonly fromLineNumber: number;
        /**
         * End line number of range
         */
        readonly toLineNumber: number;
    }[];
    constructor(ranges: {
        fromLineNumber: number;
        toLineNumber: number;
    }[]);
}
export declare class ViewThemeChangedEvent {
    readonly type: ViewEventType;
    constructor();
}
export declare class ViewTokensColorsChangedEvent {
    readonly type: ViewEventType;
    constructor();
}
export declare class ViewZonesChangedEvent {
    readonly type: ViewEventType;
    constructor();
}
export declare type ViewEvent = (ViewConfigurationChangedEvent | ViewCursorStateChangedEvent | ViewDecorationsChangedEvent | ViewFlushedEvent | ViewFocusChangedEvent | ViewLinesChangedEvent | ViewLineMappingChangedEvent | ViewLinesDeletedEvent | ViewLinesInsertedEvent | ViewRevealRangeRequestEvent | ViewScrollChangedEvent | ViewTokensChangedEvent | ViewTokensColorsChangedEvent | ViewZonesChangedEvent | ViewThemeChangedEvent);
export interface IViewEventListener {
    (events: ViewEvent[]): void;
}
export declare class ViewEventEmitter extends Disposable {
    private _listeners;
    constructor();
    dispose(): void;
    protected _emit(events: ViewEvent[]): void;
    addEventListener(listener: (events: ViewEvent[]) => void): IDisposable;
}
