import { TPromise } from 'vs/base/common/winjs.base';
import { EditorInput, ITextEditorModel } from 'vs/workbench/common/editor';
import URI from 'vs/base/common/uri';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
/**
 * A read-only text editor input whos contents are made of the provided resource that points to an existing
 * code editor model.
 */
export declare class ResourceEditorInput extends EditorInput {
    private textModelResolverService;
    static ID: string;
    private modelReference;
    private resource;
    private name;
    private description;
    constructor(name: string, description: string, resource: URI, textModelResolverService: ITextModelService);
    getResource(): URI;
    getTypeId(): string;
    getName(): string;
    setName(name: string): void;
    getDescription(): string;
    setDescription(description: string): void;
    getTelemetryDescriptor(): object;
    resolve(refresh?: boolean): TPromise<ITextEditorModel>;
    matches(otherInput: any): boolean;
    dispose(): void;
}
