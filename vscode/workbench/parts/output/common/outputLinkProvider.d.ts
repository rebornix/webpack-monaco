import { IModelService } from 'vs/editor/common/services/modelService';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class OutputLinkProvider {
    private contextService;
    private modelService;
    private static DISPOSE_WORKER_TIME;
    private worker;
    private disposeWorkerScheduler;
    private linkProviderRegistration;
    private workspacesCount;
    constructor(contextService: IWorkspaceContextService, modelService: IModelService);
    private registerListeners();
    private updateLinkProviderWorker();
    private getOrCreateWorker();
    private provideLinks(modelUri);
    private disposeWorker();
}
