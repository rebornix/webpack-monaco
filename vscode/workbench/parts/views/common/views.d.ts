import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { Command } from 'vs/editor/common/modes';
export declare type TreeViewItemHandleArg = {
    $treeViewId: string;
    $treeItemHandle: number;
};
export declare enum TreeItemCollapsibleState {
    None = 0,
    Collapsed = 1,
    Expanded = 2,
}
export interface ITreeItem {
    handle: number;
    label: string;
    icon?: string;
    iconDark?: string;
    contextValue?: string;
    command?: Command;
    children?: ITreeItem[];
    collapsibleState?: TreeItemCollapsibleState;
}
export interface ITreeViewDataProvider {
    onDidChange: Event<ITreeItem[] | undefined | null>;
    onDispose: Event<void>;
    getElements(): TPromise<ITreeItem[]>;
    getChildren(element: ITreeItem): TPromise<ITreeItem[]>;
}
