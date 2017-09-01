import URI from 'vs/base/common/uri';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { UntitledEditorInput } from 'vs/workbench/common/editor/untitledEditorInput';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { UntitledEditorModel } from 'vs/workbench/common/editor/untitledEditorModel';
export declare const IUntitledEditorService: {
    (...args: any[]): void;
    type: IUntitledEditorService;
};
export declare const UNTITLED_SCHEMA = "untitled";
export interface IModelLoadOrCreateOptions {
    resource?: URI;
    modeId?: string;
    initialValue?: string;
    encoding?: string;
}
export interface IUntitledEditorService {
    _serviceBrand: any;
    /**
     * Events for when untitled editors content changes (e.g. any keystroke).
     */
    onDidChangeContent: Event<URI>;
    /**
     * Events for when untitled editors change (e.g. getting dirty, saved or reverted).
     */
    onDidChangeDirty: Event<URI>;
    /**
     * Events for when untitled editor encodings change.
     */
    onDidChangeEncoding: Event<URI>;
    /**
     * Events for when untitled editors are disposed.
     */
    onDidDisposeModel: Event<URI>;
    /**
     * Returns if an untitled resource with the given URI exists.
     */
    exists(resource: URI): boolean;
    /**
     * Returns dirty untitled editors as resource URIs.
     */
    getDirty(resources?: URI[]): URI[];
    /**
     * Returns true if the provided resource is dirty.
     */
    isDirty(resource: URI): boolean;
    /**
     * Reverts the untitled resources if found.
     */
    revertAll(resources?: URI[]): URI[];
    /**
     * Creates a new untitled input with the optional resource URI or returns an existing one
     * if the provided resource exists already as untitled input.
     *
     * It is valid to pass in a file resource. In that case the path will be used as identifier.
     * The use case is to be able to create a new file with a specific path with VSCode.
     */
    createOrGet(resource?: URI, modeId?: string, initialValue?: string, encoding?: string): UntitledEditorInput;
    /**
     * Creates a new untitled model with the optional resource URI or returns an existing one
     * if the provided resource exists already as untitled model.
     *
     * It is valid to pass in a file resource. In that case the path will be used as identifier.
     * The use case is to be able to create a new file with a specific path with VSCode.
     */
    loadOrCreate(options: IModelLoadOrCreateOptions): TPromise<UntitledEditorModel>;
    /**
     * A check to find out if a untitled resource has a file path associated or not.
     */
    hasAssociatedFilePath(resource: URI): boolean;
    /**
     * Suggests a filename for the given untitled resource if it is known.
     */
    suggestFileName(resource: URI): string;
    /**
     * Get the configured encoding for the given untitled resource if any.
     */
    getEncoding(resource: URI): string;
}
export declare class UntitledEditorService implements IUntitledEditorService {
    private instantiationService;
    private configurationService;
    _serviceBrand: any;
    private mapResourceToInput;
    private mapResourceToAssociatedFilePath;
    private _onDidChangeContent;
    private _onDidChangeDirty;
    private _onDidChangeEncoding;
    private _onDidDisposeModel;
    constructor(instantiationService: IInstantiationService, configurationService: IConfigurationService);
    readonly onDidDisposeModel: Event<URI>;
    readonly onDidChangeContent: Event<URI>;
    readonly onDidChangeDirty: Event<URI>;
    readonly onDidChangeEncoding: Event<URI>;
    protected get(resource: URI): UntitledEditorInput;
    protected getAll(resources?: URI[]): UntitledEditorInput[];
    exists(resource: URI): boolean;
    revertAll(resources?: URI[], force?: boolean): URI[];
    isDirty(resource: URI): boolean;
    getDirty(resources?: URI[]): URI[];
    loadOrCreate(options?: IModelLoadOrCreateOptions): TPromise<UntitledEditorModel>;
    createOrGet(resource?: URI, modeId?: string, initialValue?: string, encoding?: string): UntitledEditorInput;
    private doCreate(resource?, hasAssociatedFilePath?, modeId?, initialValue?, encoding?);
    hasAssociatedFilePath(resource: URI): boolean;
    suggestFileName(resource: URI): string;
    getEncoding(resource: URI): string;
    dispose(): void;
}
