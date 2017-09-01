import { TPromise } from 'vs/base/common/winjs.base';
import { IAction } from 'vs/base/common/actions';
import { IActionItem } from 'vs/base/browser/ui/actionbar/actionbar';
import { CollapsibleView, IViewletViewOptions } from 'vs/workbench/parts/views/browser/views';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextMenuService } from 'vs/platform/contextview/browser/contextView';
export declare class EmptyView extends CollapsibleView {
    private themeService;
    private instantiationService;
    static ID: string;
    static NAME: string;
    private openFolderButton;
    constructor(initialSize: number, options: IViewletViewOptions, themeService: IThemeService, instantiationService: IInstantiationService, keybindingService: IKeybindingService, contextMenuService: IContextMenuService);
    renderHeader(container: HTMLElement): void;
    protected renderBody(container: HTMLElement): void;
    layoutBody(size: number): void;
    create(): TPromise<void>;
    setVisible(visible: boolean): TPromise<void>;
    focusBody(): void;
    protected reveal(element: any, relativeTop?: number): TPromise<void>;
    getActions(): IAction[];
    getSecondaryActions(): IAction[];
    getActionItem(action: IAction): IActionItem;
    shutdown(): void;
}
