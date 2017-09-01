import URI from 'vs/base/common/uri';
import { IFileStat } from 'vs/platform/files/common/files';
import { IEditorInput } from 'vs/platform/editor/common/editor';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEditorGroup } from 'vs/workbench/common/editor';
export declare enum StatType {
    FILE = 0,
    FOLDER = 1,
    ANY = 2,
}
export declare class Model {
    private contextService;
    private _roots;
    constructor(contextService: IWorkspaceContextService);
    readonly roots: FileStat[];
    /**
     * Returns an array of child stat from this stat that matches with the provided path.
     * Starts matching from the first root.
     * Will return empty array in case the FileStat does not exist.
     */
    findAll(resource: URI): FileStat[];
    /**
     * Returns a FileStat that matches the passed resource.
     * In case multiple FileStat are matching the resource (same folder opened multiple times) returns the FileStat that has the closest root.
     * Will return null in case the FileStat does not exist.
     */
    findClosest(resource: URI): FileStat;
}
export declare class FileStat implements IFileStat {
    root: FileStat;
    resource: URI;
    name: string;
    mtime: number;
    etag: string;
    isDirectory: boolean;
    hasChildren: boolean;
    children: FileStat[];
    parent: FileStat;
    isDirectoryResolved: boolean;
    constructor(resource: URI, root: FileStat, isDirectory?: boolean, hasChildren?: boolean, name?: string, mtime?: number, etag?: string);
    getId(): string;
    readonly isRoot: boolean;
    static create(raw: IFileStat, root: FileStat, resolveTo?: URI[]): FileStat;
    /**
     * Merges the stat which was resolved from the disk with the local stat by copying over properties
     * and children. The merge will only consider resolved stat elements to avoid overwriting data which
     * exists locally.
     */
    static mergeLocalWithDisk(disk: FileStat, local: FileStat): void;
    /**
     * Adds a child element to this folder.
     */
    addChild(child: FileStat): void;
    /**
     * Returns true if this stat is a directory that contains a child with the given name.
     *
     * @param ignoreCase if true, will check for the name ignoring case.
     * @param type the type of stat to check for.
     */
    hasChild(name: string, ignoreCase?: boolean, type?: StatType): boolean;
    /**
     * Removes a child element from this folder.
     */
    removeChild(child: FileStat): void;
    /**
     * Moves this element under a new parent element.
     */
    move(newParent: FileStat, fnBetweenStates?: (callback: () => void) => void, fnDone?: () => void): void;
    private updateResource(recursive);
    /**
     * Tells this stat that it was renamed. This requires changes to all children of this stat (if any)
     * so that the path property can be updated properly.
     */
    rename(renamedStat: IFileStat): void;
    /**
     * Returns a child stat from this stat that matches with the provided path.
     * Will return "null" in case the child does not exist.
     */
    find(resource: URI): FileStat;
}
export declare class NewStatPlaceholder extends FileStat {
    private static ID;
    private id;
    private directoryPlaceholder;
    constructor(isDirectory: boolean, root: FileStat);
    destroy(): void;
    getId(): string;
    isDirectoryPlaceholder(): boolean;
    addChild(child: NewStatPlaceholder): void;
    hasChild(name: string, ignoreCase?: boolean): boolean;
    removeChild(child: NewStatPlaceholder): void;
    move(newParent: NewStatPlaceholder): void;
    rename(renamedStat: NewStatPlaceholder): void;
    find(resource: URI): NewStatPlaceholder;
    static addNewStatPlaceholder(parent: FileStat, isDirectory: boolean): NewStatPlaceholder;
}
export declare class OpenEditor {
    private editor;
    private group;
    constructor(editor: IEditorInput, group: IEditorGroup);
    readonly editorInput: IEditorInput;
    readonly editorGroup: IEditorGroup;
    getId(): string;
    isPreview(): boolean;
    isUntitled(): boolean;
    isDirty(): boolean;
    getResource(): URI;
}
