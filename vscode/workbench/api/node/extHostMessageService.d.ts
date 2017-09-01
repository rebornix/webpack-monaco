import Severity from 'vs/base/common/severity';
import vscode = require('vscode');
import { IMainContext } from './extHost.protocol';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
export declare class ExtHostMessageService {
    private _proxy;
    constructor(mainContext: IMainContext);
    showMessage(extension: IExtensionDescription, severity: Severity, message: string, optionsOrFirstItem: vscode.MessageOptions | string, rest: string[]): Thenable<string | undefined>;
    showMessage(extension: IExtensionDescription, severity: Severity, message: string, optionsOrFirstItem: vscode.MessageOptions | vscode.MessageItem, rest: vscode.MessageItem[]): Thenable<vscode.MessageItem | undefined>;
}
