import URI from 'vs/base/common/uri';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { IWorkbenchEditorConfiguration } from 'vs/workbench/common/editor';
import { IFilesConfiguration } from 'vs/platform/files/common/files';
import { FileStat, OpenEditor } from 'vs/workbench/parts/files/common/explorerModel';
import { ContextKeyExpr, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
/**
 * Explorer viewlet id.
 */
export declare const VIEWLET_ID = "workbench.view.explorer";
export declare const ExplorerViewletVisibleContext: RawContextKey<boolean>;
export declare const ExplorerFolderContext: RawContextKey<boolean>;
export declare const FilesExplorerFocusedContext: RawContextKey<boolean>;
export declare const OpenEditorsVisibleContext: RawContextKey<boolean>;
export declare const OpenEditorsFocusedContext: RawContextKey<boolean>;
export declare const ExplorerFocusedContext: RawContextKey<boolean>;
export declare const OpenEditorsVisibleCondition: ContextKeyExpr;
export declare const FilesExplorerFocusCondition: ContextKeyExpr;
export declare const ExplorerFocusCondition: ContextKeyExpr;
/**
 * File editor input id.
 */
export declare const FILE_EDITOR_INPUT_ID = "workbench.editors.files.fileEditorInput";
/**
 * Text file editor id.
 */
export declare const TEXT_FILE_EDITOR_ID = "workbench.editors.files.textFileEditor";
/**
 * Binary file editor id.
 */
export declare const BINARY_FILE_EDITOR_ID = "workbench.editors.files.binaryFileEditor";
export interface IFilesConfiguration extends IFilesConfiguration, IWorkbenchEditorConfiguration {
    explorer: {
        openEditors: {
            visible: number;
            dynamicHeight: boolean;
        };
        autoReveal: boolean;
        enableDragAndDrop: boolean;
        sortOrder: SortOrder;
    };
    editor: IEditorOptions;
}
export interface IFileResource {
    resource: URI;
    isDirectory?: boolean;
}
/**
 * Helper to get an explorer item from an object.
 */
export declare function explorerItemToFileResource(obj: FileStat | OpenEditor): IFileResource;
export declare const SortOrderConfiguration: {
    DEFAULT: string;
    MIXED: string;
    FILES_FIRST: string;
    TYPE: string;
    MODIFIED: string;
};
export declare type SortOrder = 'default' | 'mixed' | 'filesFirst' | 'type' | 'modified';
