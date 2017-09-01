import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { ExtHostCommands } from 'vs/workbench/api/node/extHostCommands';
import { MainThreadSCMShape, IMainContext } from './extHost.protocol';
import * as vscode from 'vscode';
export declare class ExtHostSCMInputBox {
    private _proxy;
    private _sourceControlHandle;
    private _value;
    value: string;
    private _onDidChange;
    readonly onDidChange: Event<string>;
    constructor(_proxy: MainThreadSCMShape, _sourceControlHandle: number);
    $onInputBoxValueChange(value: string): void;
    private updateValue(value);
}
export declare class ExtHostSCM {
    private _commands;
    private static _handlePool;
    private _proxy;
    private _sourceControls;
    private _sourceControlsByExtension;
    private _onDidChangeActiveProvider;
    readonly onDidChangeActiveProvider: Event<vscode.SourceControl>;
    constructor(mainContext: IMainContext, _commands: ExtHostCommands);
    createSourceControl(extension: IExtensionDescription, id: string, label: string): vscode.SourceControl;
    getLastInputBox(extension: IExtensionDescription): ExtHostSCMInputBox;
    $provideOriginalResource(sourceControlHandle: number, uri: URI): TPromise<URI>;
    $onInputBoxValueChange(sourceControlHandle: number, value: string): TPromise<void>;
}
