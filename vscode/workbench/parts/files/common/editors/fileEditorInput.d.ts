import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { EncodingMode, ConfirmResult, EditorInput, IFileEditorInput } from 'vs/workbench/common/editor';
import { TextFileEditorModel } from 'vs/workbench/services/textfile/common/textFileEditorModel';
import { BinaryEditorModel } from 'vs/workbench/common/editor/binaryEditorModel';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { Verbosity } from 'vs/platform/editor/common/editor';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
/**
 * A file editor input is the input type for the file editor of file system resources.
 */
export declare class FileEditorInput extends EditorInput implements IFileEditorInput {
    private resource;
    private preferredEncoding;
    private instantiationService;
    private contextService;
    private textFileService;
    private environmentService;
    private textModelResolverService;
    private forceOpenAsBinary;
    private textModelReference;
    private name;
    private description;
    private verboseDescription;
    private shortTitle;
    private mediumTitle;
    private longTitle;
    private toUnbind;
    /**
     * An editor input who's contents are retrieved from file services.
     */
    constructor(resource: URI, preferredEncoding: string, instantiationService: IInstantiationService, contextService: IWorkspaceContextService, textFileService: ITextFileService, environmentService: IEnvironmentService, textModelResolverService: ITextModelService);
    private registerListeners();
    private onDirtyStateChange(e);
    private onModelOrphanedChanged(e);
    getResource(): URI;
    setPreferredEncoding(encoding: string): void;
    getEncoding(): string;
    getPreferredEncoding(): string;
    setEncoding(encoding: string, mode: EncodingMode): void;
    setForceOpenAsBinary(): void;
    getTypeId(): string;
    getName(): string;
    getDescription(verbose?: boolean): string;
    getTitle(verbosity: Verbosity): string;
    private decorateOrphanedFiles(label);
    isDirty(): boolean;
    confirmSave(): ConfirmResult;
    save(): TPromise<boolean>;
    revert(): TPromise<boolean>;
    getPreferredEditorId(candidates: string[]): string;
    resolve(refresh?: boolean): TPromise<TextFileEditorModel | BinaryEditorModel>;
    private resolveAsBinary();
    isResolved(): boolean;
    getTelemetryDescriptor(): object;
    dispose(): void;
    matches(otherInput: any): boolean;
}
