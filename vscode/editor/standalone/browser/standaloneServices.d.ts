import { Disposable } from 'vs/base/common/lifecycle';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService, ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IMarkerService } from 'vs/platform/markers/common/markers';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { IEditorWorkerService } from 'vs/editor/common/services/editorWorkerService';
import { ITextResourceConfigurationService } from 'vs/editor/common/services/resourceConfiguration';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { SimpleMessageService, SimpleProgressService } from 'vs/editor/standalone/browser/simpleServices';
import { IStandaloneThemeService } from 'vs/editor/standalone/common/standaloneThemeService';
export interface IEditorContextViewService extends IContextViewService {
    dispose(): void;
    setContainer(domNode: HTMLElement): void;
}
export interface IEditorOverrideServices {
    [index: string]: any;
}
export declare module StaticServices {
    class LazyStaticService<T> {
        private _serviceId;
        private _factory;
        private _value;
        readonly id: ServiceIdentifier<T>;
        constructor(serviceId: ServiceIdentifier<T>, factory: (overrides: IEditorOverrideServices) => T);
        get(overrides?: IEditorOverrideServices): T;
    }
    function init(overrides: IEditorOverrideServices): [ServiceCollection, IInstantiationService];
    const instantiationService: LazyStaticService<IInstantiationService>;
    const configurationService: LazyStaticService<IConfigurationService>;
    const resourceConfigurationService: LazyStaticService<ITextResourceConfigurationService>;
    const contextService: LazyStaticService<IWorkspaceContextService>;
    const telemetryService: LazyStaticService<ITelemetryService>;
    const messageService: LazyStaticService<SimpleMessageService>;
    const markerService: LazyStaticService<IMarkerService>;
    const modeService: LazyStaticService<IModeService>;
    const modelService: LazyStaticService<IModelService>;
    const editorWorkerService: LazyStaticService<IEditorWorkerService>;
    const standaloneThemeService: LazyStaticService<IStandaloneThemeService>;
    const codeEditorService: LazyStaticService<ICodeEditorService>;
    const progressService: LazyStaticService<SimpleProgressService>;
    const storageService: LazyStaticService<IStorageService>;
}
export declare class DynamicStandaloneServices extends Disposable {
    private _serviceCollection;
    private _instantiationService;
    constructor(domElement: HTMLElement, overrides: IEditorOverrideServices);
    get<T>(serviceId: ServiceIdentifier<T>): T;
    set<T>(serviceId: ServiceIdentifier<T>, instance: T): void;
    has<T>(serviceId: ServiceIdentifier<T>): boolean;
}
