import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { EditorInput, IEncodingSupport, EncodingMode, ConfirmResult } from 'vs/workbench/common/editor';
import { UntitledEditorModel } from 'vs/workbench/common/editor/untitledEditorModel';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import Event from 'vs/base/common/event';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
/**
 * An editor input to be used for untitled text buffers.
 */
export declare class UntitledEditorInput extends EditorInput implements IEncodingSupport {
    private resource;
    private modeId;
    private initialValue;
    private preferredEncoding;
    private instantiationService;
    private contextService;
    private textFileService;
    private environmentService;
    static ID: string;
    private _hasAssociatedFilePath;
    private cachedModel;
    private modelResolve;
    private _onDidModelChangeContent;
    private _onDidModelChangeEncoding;
    private toUnbind;
    constructor(resource: URI, hasAssociatedFilePath: boolean, modeId: string, initialValue: string, preferredEncoding: string, instantiationService: IInstantiationService, contextService: IWorkspaceContextService, textFileService: ITextFileService, environmentService: IEnvironmentService);
    readonly hasAssociatedFilePath: boolean;
    readonly onDidModelChangeContent: Event<void>;
    readonly onDidModelChangeEncoding: Event<void>;
    getTypeId(): string;
    getResource(): URI;
    getModeId(): string;
    getName(): string;
    getDescription(): string;
    isDirty(): boolean;
    confirmSave(): ConfirmResult;
    save(): TPromise<boolean>;
    revert(): TPromise<boolean>;
    suggestFileName(): string;
    getEncoding(): string;
    setEncoding(encoding: string, mode: EncodingMode): void;
    resolve(): TPromise<UntitledEditorModel>;
    private createModel();
    getTelemetryDescriptor(): object;
    matches(otherInput: any): boolean;
    dispose(): void;
}
