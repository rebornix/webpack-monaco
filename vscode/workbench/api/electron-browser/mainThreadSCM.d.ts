import { ISCMService } from 'vs/workbench/services/scm/common/scm';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { MainThreadSCMShape, SCMProviderFeatures, SCMRawResource, SCMGroupFeatures, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadSCM implements MainThreadSCMShape {
    private instantiationService;
    private scmService;
    private commandService;
    private _proxy;
    private _repositories;
    private _inputDisposables;
    private _disposables;
    constructor(extHostContext: IExtHostContext, instantiationService: IInstantiationService, scmService: ISCMService, commandService: ICommandService);
    dispose(): void;
    $registerSourceControl(handle: number, id: string, label: string): void;
    $updateSourceControl(handle: number, features: SCMProviderFeatures): void;
    $unregisterSourceControl(handle: number): void;
    $registerGroup(sourceControlHandle: number, groupHandle: number, id: string, label: string): void;
    $updateGroup(sourceControlHandle: number, groupHandle: number, features: SCMGroupFeatures): void;
    $updateGroupLabel(sourceControlHandle: number, groupHandle: number, label: string): void;
    $updateGroupResourceStates(sourceControlHandle: number, groupHandle: number, resources: SCMRawResource[]): void;
    $unregisterGroup(sourceControlHandle: number, handle: number): void;
    $setInputBoxValue(sourceControlHandle: number, value: string): void;
}
