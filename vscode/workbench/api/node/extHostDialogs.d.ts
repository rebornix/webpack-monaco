import * as vscode from 'vscode';
import URI from 'vs/base/common/uri';
import { IMainContext } from 'vs/workbench/api/node/extHost.protocol';
export declare class ExtHostDialogs {
    private readonly _proxy;
    constructor(mainContext: IMainContext);
    showOpenDialog(options: vscode.OpenDialogOptions): Thenable<URI[]>;
}
