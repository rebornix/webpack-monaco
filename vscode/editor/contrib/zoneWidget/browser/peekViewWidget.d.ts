import 'vs/css!./peekViewWidget';
import Event from 'vs/base/common/event';
import { ActionBar } from 'vs/base/browser/ui/actionbar/actionbar';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IOptions, ZoneWidget, IStyles } from './zoneWidget';
import { ContextKeyExpr, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { Color } from 'vs/base/common/color';
export declare var IPeekViewService: {
    (...args: any[]): void;
    type: IPeekViewService;
};
export declare namespace PeekContext {
    const inPeekEditor: RawContextKey<boolean>;
    const notInPeekEditor: ContextKeyExpr;
}
export declare const NOT_INNER_EDITOR_CONTEXT_KEY: RawContextKey<boolean>;
export interface IPeekViewService {
    _serviceBrand: any;
    isActive: boolean;
}
export declare function getOuterEditor(accessor: ServicesAccessor): ICommonCodeEditor;
export interface IPeekViewStyles extends IStyles {
    headerBackgroundColor?: Color;
    primaryHeadingColor?: Color;
    secondaryHeadingColor?: Color;
}
export interface IPeekViewOptions extends IOptions, IPeekViewStyles {
}
export declare abstract class PeekViewWidget extends ZoneWidget implements IPeekViewService {
    _serviceBrand: any;
    private _onDidClose;
    private _isActive;
    protected _headElement: HTMLDivElement;
    protected _primaryHeading: HTMLElement;
    protected _secondaryHeading: HTMLElement;
    protected _metaHeading: HTMLElement;
    protected _actionbarWidget: ActionBar;
    protected _bodyElement: HTMLDivElement;
    constructor(editor: ICodeEditor, options?: IPeekViewOptions);
    dispose(): void;
    readonly onDidClose: Event<PeekViewWidget>;
    readonly isActive: boolean;
    show(where: any, heightInLines: number): void;
    style(styles: IPeekViewStyles): void;
    protected _applyStyles(): void;
    protected _fillContainer(container: HTMLElement): void;
    protected _fillHead(container: HTMLElement): void;
    protected _onTitleClick(event: MouseEvent): void;
    setTitle(primaryHeading: string, secondaryHeading?: string): void;
    setMetaTitle(value: string): void;
    protected _fillBody(container: HTMLElement): void;
    _doLayout(heightInPixel: number, widthInPixel: number): void;
    protected _doLayoutHead(heightInPixel: number, widthInPixel: number): void;
    protected _doLayoutBody(heightInPixel: number, widthInPixel: number): void;
}
