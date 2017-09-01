import { TPromise } from 'vs/base/common/winjs.base';
import { EditorModel } from 'vs/workbench/common/editor';
import URI from 'vs/base/common/uri';
import { IFileService } from 'vs/platform/files/common/files';
/**
 * An editor model that just represents a resource that can be loaded.
 */
export declare class BinaryEditorModel extends EditorModel {
    private fileService;
    private name;
    private resource;
    private size;
    private etag;
    constructor(resource: URI, name: string, fileService: IFileService);
    /**
     * The name of the binary resource.
     */
    getName(): string;
    /**
     * The resource of the binary resource.
     */
    getResource(): URI;
    /**
     * The size of the binary file if known.
     */
    getSize(): number;
    /**
     * The etag of the binary file if known.
     */
    getETag(): string;
    load(): TPromise<EditorModel>;
}
