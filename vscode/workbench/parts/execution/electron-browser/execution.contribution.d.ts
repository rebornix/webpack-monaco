import { TPromise } from 'vs/base/common/winjs.base';
import { IAction, Action } from 'vs/base/common/actions';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { ActionBarContributor } from 'vs/workbench/browser/actions';
import uri from 'vs/base/common/uri';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ITerminalService } from 'vs/workbench/parts/execution/common/execution';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { ITerminalService as IIntegratedTerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { IHistoryService } from 'vs/workbench/services/history/common/history';
export declare abstract class AbstractOpenInTerminalAction extends Action {
    protected editorService: IWorkbenchEditorService;
    protected contextService: IWorkspaceContextService;
    protected historyService: IHistoryService;
    private resource;
    constructor(id: string, label: string, editorService: IWorkbenchEditorService, contextService: IWorkspaceContextService, historyService: IHistoryService);
    setResource(resource: uri): void;
    getPathToOpen(): string;
}
export declare class OpenConsoleAction extends AbstractOpenInTerminalAction {
    private terminalService;
    static ID: string;
    static Label: string;
    static ScopedLabel: string;
    constructor(id: string, label: string, terminalService: ITerminalService, editorService: IWorkbenchEditorService, contextService: IWorkspaceContextService, historyService: IHistoryService);
    run(event?: any): TPromise<any>;
}
export declare class OpenIntegratedTerminalAction extends AbstractOpenInTerminalAction {
    private integratedTerminalService;
    static ID: string;
    static Label: string;
    constructor(id: string, label: string, integratedTerminalService: IIntegratedTerminalService, editorService: IWorkbenchEditorService, contextService: IWorkspaceContextService, historyService: IHistoryService);
    run(event?: any): TPromise<any>;
}
export declare class ExplorerViewerActionContributor extends ActionBarContributor {
    private instantiationService;
    private configurationService;
    constructor(instantiationService: IInstantiationService, configurationService: IConfigurationService);
    hasSecondaryActions(context: any): boolean;
    getSecondaryActions(context: any): IAction[];
}
