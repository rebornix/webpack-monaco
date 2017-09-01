import { TPromise } from 'vs/base/common/winjs.base';
import { CancellationToken } from 'vs/base/common/cancellation';
import { QuickPickOptions, QuickPickItem, InputBoxOptions } from 'vscode';
import { ExtHostQuickOpenShape, IMainContext } from './extHost.protocol';
export declare type Item = string | QuickPickItem;
export declare class ExtHostQuickOpen implements ExtHostQuickOpenShape {
    private _proxy;
    private _onDidSelectItem;
    private _validateInput;
    constructor(mainContext: IMainContext);
    showQuickPick(itemsOrItemsPromise: string[] | Thenable<string[]>, options?: QuickPickOptions, token?: CancellationToken): Thenable<string | undefined>;
    showQuickPick(itemsOrItemsPromise: QuickPickItem[] | Thenable<QuickPickItem[]>, options?: QuickPickOptions, token?: CancellationToken): Thenable<QuickPickItem | undefined>;
    $onItemSelected(handle: number): void;
    showInput(options?: InputBoxOptions, token?: CancellationToken): Thenable<string>;
    $validateInput(input: string): TPromise<string>;
}
