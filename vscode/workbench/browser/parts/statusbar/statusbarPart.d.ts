import 'vs/css!./media/statusbarpart';
import { IDisposable } from 'vs/base/common/lifecycle';
import { Builder } from 'vs/base/browser/builder';
import { Part } from 'vs/workbench/browser/part';
import { StatusbarAlignment } from 'vs/workbench/browser/parts/statusbar/statusbar';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IStatusbarService, IStatusbarEntry } from 'vs/platform/statusbar/common/statusbar';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class StatusbarPart extends Part implements IStatusbarService {
    private instantiationService;
    private contextService;
    _serviceBrand: any;
    private static PRIORITY_PROP;
    private static ALIGNMENT_PROP;
    private statusItemsContainer;
    private statusMsgDispose;
    constructor(id: string, instantiationService: IInstantiationService, themeService: IThemeService, contextService: IWorkspaceContextService);
    private registerListeners();
    addEntry(entry: IStatusbarEntry, alignment: StatusbarAlignment, priority?: number): IDisposable;
    private getEntries(alignment);
    createContentArea(parent: Builder): Builder;
    protected updateStyles(): void;
    private doCreateStatusItem(alignment, priority?);
    setStatusMessage(message: string, autoDisposeAfter?: number, delayBy?: number): IDisposable;
}
