import { Disposable } from 'vs/base/common/lifecycle';
import Event from 'vs/base/common/event';
import { IEditorOptions } from 'vs/platform/editor/common/editor';
import { ITree } from 'vs/base/parts/tree/browser/tree';
export interface IOpenFileOptions {
    editorOptions: IEditorOptions;
    sideBySide: boolean;
    element: any;
    payload: any;
}
export default class FileResultsNavigation extends Disposable {
    private tree;
    private _openFile;
    readonly openFile: Event<IOpenFileOptions>;
    private throttler;
    constructor(tree: ITree);
    private onFocus(event);
    private onSelection({payload});
}
