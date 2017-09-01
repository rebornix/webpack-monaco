import 'vs/css!./textAreaHandler';
import { ViewContext } from 'vs/editor/common/view/viewContext';
import { HorizontalRange, RenderingContext, RestrictedRenderingContext } from 'vs/editor/common/view/renderingContext';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { FastDomNode } from 'vs/base/browser/fastDomNode';
import { ViewController } from 'vs/editor/browser/view/viewController';
import { ViewPart } from 'vs/editor/browser/view/viewPart';
export interface ITextAreaHandlerHelper {
    visibleRangeForPositionRelativeToEditor(lineNumber: number, column: number): HorizontalRange;
}
export declare class TextAreaHandler extends ViewPart {
    private readonly _viewController;
    private readonly _viewHelper;
    private _pixelRatio;
    private _accessibilitySupport;
    private _contentLeft;
    private _contentWidth;
    private _contentHeight;
    private _scrollLeft;
    private _scrollTop;
    private _fontInfo;
    private _lineHeight;
    private _emptySelectionClipboard;
    /**
     * Defined only when the text area is visible (composition case).
     */
    private _visibleTextArea;
    private _selections;
    private _lastCopiedValue;
    private _lastCopiedValueIsFromEmptySelection;
    readonly textArea: FastDomNode<HTMLTextAreaElement>;
    readonly textAreaCover: FastDomNode<HTMLElement>;
    private readonly _textAreaInput;
    constructor(context: ViewContext, viewController: ViewController, viewHelper: ITextAreaHandlerHelper);
    dispose(): void;
    onConfigurationChanged(e: viewEvents.ViewConfigurationChangedEvent): boolean;
    onCursorStateChanged(e: viewEvents.ViewCursorStateChangedEvent): boolean;
    onDecorationsChanged(e: viewEvents.ViewDecorationsChangedEvent): boolean;
    onFlushed(e: viewEvents.ViewFlushedEvent): boolean;
    onLinesChanged(e: viewEvents.ViewLinesChangedEvent): boolean;
    onLinesDeleted(e: viewEvents.ViewLinesDeletedEvent): boolean;
    onLinesInserted(e: viewEvents.ViewLinesInsertedEvent): boolean;
    onScrollChanged(e: viewEvents.ViewScrollChangedEvent): boolean;
    onZonesChanged(e: viewEvents.ViewZonesChangedEvent): boolean;
    isFocused(): boolean;
    focusTextArea(): void;
    setAriaActiveDescendant(id: string): void;
    private _primaryCursorVisibleRange;
    prepareRender(ctx: RenderingContext): void;
    render(ctx: RestrictedRenderingContext): void;
    private _render();
    private _renderInsideEditor(top, left, width, height, useEditorFont);
    private _renderAtTopLeft();
}
