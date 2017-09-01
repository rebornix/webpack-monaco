import { IDisposable } from 'vs/base/common/lifecycle';
import { IStatusbarItem } from 'vs/workbench/browser/parts/statusbar/statusbar';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { Themable } from 'vs/workbench/common/theme';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class FeedbackStatusbarItem extends Themable implements IStatusbarItem {
    private instantiationService;
    private contextViewService;
    private contextService;
    private dropdown;
    constructor(instantiationService: IInstantiationService, contextViewService: IContextViewService, contextService: IWorkspaceContextService, themeService: IThemeService);
    private registerListeners();
    protected updateStyles(): void;
    render(element: HTMLElement): IDisposable;
}
