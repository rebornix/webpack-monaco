import 'vs/css!./media/keybindings';
import { TPromise } from 'vs/base/common/winjs.base';
import { Disposable } from 'vs/base/common/lifecycle';
import { Widget } from 'vs/base/browser/ui/widget';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { Dimension } from 'vs/base/browser/builder';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ICodeEditor, IOverlayWidget, IOverlayWidgetPosition } from 'vs/editor/browser/editorBrowser';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class DefineKeybindingWidget extends Widget {
    private keybindingService;
    private instantiationService;
    private themeService;
    private static WIDTH;
    private static HEIGHT;
    private _domNode;
    private _keybindingInputWidget;
    private _outputNode;
    private _firstPart;
    private _chordPart;
    private _isVisible;
    private _onHide;
    constructor(parent: HTMLElement, keybindingService: IKeybindingService, instantiationService: IInstantiationService, themeService: IThemeService);
    readonly domNode: HTMLElement;
    define(): TPromise<string>;
    layout(layout: Dimension): void;
    private create();
    private printKeybinding(keybinding);
    private onCancel();
    private hide();
}
export declare class DefineKeybindingOverlayWidget extends Disposable implements IOverlayWidget {
    private _editor;
    private static ID;
    private readonly _widget;
    constructor(_editor: ICodeEditor, instantiationService: IInstantiationService);
    getId(): string;
    getDomNode(): HTMLElement;
    getPosition(): IOverlayWidgetPosition;
    dispose(): void;
    start(): TPromise<string>;
}
