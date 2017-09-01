import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IDebugService } from 'vs/workbench/parts/debug/common/debug';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { Themable } from 'vs/workbench/common/theme';
export declare const STATUS_BAR_DEBUGGING_BACKGROUND: string;
export declare const STATUS_BAR_DEBUGGING_FOREGROUND: string;
export declare const STATUS_BAR_DEBUGGING_BORDER: string;
export declare class StatusBarColorProvider extends Themable implements IWorkbenchContribution {
    private debugService;
    private contextService;
    private partService;
    private static ID;
    constructor(themeService: IThemeService, debugService: IDebugService, contextService: IWorkspaceContextService, partService: IPartService);
    private registerListeners();
    protected updateStyles(): void;
    private getColorKey(noFolderColor, debuggingColor, normalColor);
    private isDebugging();
    private isRunningWithoutDebug();
    getId(): string;
}
