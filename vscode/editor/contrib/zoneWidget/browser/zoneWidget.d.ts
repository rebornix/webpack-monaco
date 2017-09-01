import 'vs/css!./zoneWidget';
import { IDisposable } from 'vs/base/common/lifecycle';
import { Widget } from 'vs/base/browser/ui/widget';
import { IHorizontalSashLayoutProvider } from 'vs/base/browser/ui/sash/sash';
import { IRange } from 'vs/editor/common/core/range';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition, IViewZone } from 'vs/editor/browser/editorBrowser';
import { Color } from 'vs/base/common/color';
import { Position, IPosition } from 'vs/editor/common/core/position';
export interface IOptions {
    showFrame?: boolean;
    showArrow?: boolean;
    frameWidth?: number;
    className?: string;
    isAccessible?: boolean;
    isResizeable?: boolean;
    frameColor?: Color;
    arrowColor?: Color;
}
export interface IStyles {
    frameColor?: Color;
    arrowColor?: Color;
}
export declare class ViewZoneDelegate implements IViewZone {
    domNode: HTMLElement;
    id: number;
    afterLineNumber: number;
    afterColumn: number;
    heightInLines: number;
    private _onDomNodeTop;
    private _onComputedHeight;
    constructor(domNode: HTMLElement, afterLineNumber: number, afterColumn: number, heightInLines: number, onDomNodeTop: (top: number) => void, onComputedHeight: (height: number) => void);
    onDomNodeTop(top: number): void;
    onComputedHeight(height: number): void;
}
export declare class OverlayWidgetDelegate implements IOverlayWidget {
    private _id;
    private _domNode;
    constructor(id: string, domNode: HTMLElement);
    getId(): string;
    getDomNode(): HTMLElement;
    getPosition(): IOverlayWidgetPosition;
}
export declare abstract class ZoneWidget extends Widget implements IHorizontalSashLayoutProvider {
    private _arrow;
    private _overlayWidget;
    private _resizeSash;
    private _positionMarkerId;
    protected _viewZone: ViewZoneDelegate;
    protected _disposables: IDisposable[];
    container: HTMLElement;
    domNode: HTMLElement;
    editor: ICodeEditor;
    options: IOptions;
    constructor(editor: ICodeEditor, options?: IOptions);
    dispose(): void;
    create(): void;
    style(styles: IStyles): void;
    protected _applyStyles(): void;
    private _getWidth(info?);
    private _onViewZoneTop(top);
    private _onViewZoneHeight(height);
    readonly position: Position;
    protected _isShowing: boolean;
    show(rangeOrPos: IRange | IPosition, heightInLines: number): void;
    hide(): void;
    private _decoratingElementsHeight();
    private _showImpl(where, heightInLines);
    protected setCssClass(className: string, classToReplace?: string): void;
    protected abstract _fillContainer(container: HTMLElement): void;
    protected _onWidth(widthInPixel: number): void;
    protected _doLayout(heightInPixel: number, widthInPixel: number): void;
    protected _relayout(newHeightInLines: number): void;
    private _initSash();
    getHorizontalSashLeft(): number;
    getHorizontalSashTop(): number;
    getHorizontalSashWidth(): number;
}
