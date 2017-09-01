import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { ExplorerViewlet } from 'vs/workbench/parts/files/browser/explorerViewlet';
import { FileStat } from 'vs/workbench/parts/files/common/explorerModel';
import { ITree } from 'vs/base/parts/tree/browser/tree';
export declare const copyPathCommand: (accessor: ServicesAccessor, resource?: URI) => void;
export declare const openFolderPickerCommand: (accessor: ServicesAccessor, forceNewWindow: boolean) => void;
export declare const openWindowCommand: (accessor: ServicesAccessor, paths: string[], forceNewWindow: boolean) => void;
export declare const openFileInNewWindowCommand: (accessor: ServicesAccessor) => void;
export declare const revealInOSCommand: (accessor: ServicesAccessor, resource?: URI) => void;
export declare const revealInExplorerCommand: (accessor: ServicesAccessor, resource: URI) => void;
export declare function withFocusedFilesExplorerViewItem(accessor: ServicesAccessor): TPromise<{
    explorer: ExplorerViewlet;
    tree: ITree;
    item: FileStat;
}>;
export declare function withFocusedFilesExplorer(accessor: ServicesAccessor): TPromise<{
    explorer: ExplorerViewlet;
    tree: ITree;
}>;
export declare const renameFocusedFilesExplorerViewItemCommand: (accessor: ServicesAccessor) => void;
export declare const deleteFocusedFilesExplorerViewItemCommand: (accessor: ServicesAccessor) => void;
export declare const moveFocusedFilesExplorerViewItemToTrashCommand: (accessor: ServicesAccessor) => void;
export declare const copyFocusedFilesExplorerViewItem: (accessor: ServicesAccessor) => void;
export declare const copyPathOfFocusedExplorerItem: (accessor: ServicesAccessor) => void;
export declare const openFocusedExplorerItemSideBySideCommand: (accessor: ServicesAccessor) => void;
export declare const revealInOSFocusedFilesExplorerItem: (accessor: ServicesAccessor) => void;
