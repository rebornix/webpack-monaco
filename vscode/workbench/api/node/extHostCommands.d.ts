import { ICommandHandlerDescription } from 'vs/platform/commands/common/commands';
import { TPromise } from 'vs/base/common/winjs.base';
import * as extHostTypes from 'vs/workbench/api/node/extHostTypes';
import { ExtHostCommandsShape, IMainContext } from './extHost.protocol';
import { ExtHostHeapService } from 'vs/workbench/api/node/extHostHeapService';
import * as modes from 'vs/editor/common/modes';
import * as vscode from 'vscode';
export interface ArgumentProcessor {
    processArgument(arg: any): any;
}
export declare class ExtHostCommands implements ExtHostCommandsShape {
    private _commands;
    private _proxy;
    private _converter;
    private _argumentProcessors;
    constructor(mainContext: IMainContext, heapService: ExtHostHeapService);
    readonly converter: CommandsConverter;
    registerArgumentProcessor(processor: ArgumentProcessor): void;
    registerCommand(id: string, callback: <T>(...args: any[]) => T | Thenable<T>, thisArg?: any, description?: ICommandHandlerDescription): extHostTypes.Disposable;
    executeCommand<T>(id: string, ...args: any[]): Thenable<T>;
    $executeContributedCommand<T>(id: string, ...args: any[]): Thenable<T>;
    getCommands(filterUnderscoreCommands?: boolean): Thenable<string[]>;
    $getContributedCommandHandlerDescriptions(): TPromise<{
        [id: string]: string | ICommandHandlerDescription;
    }>;
}
export declare class CommandsConverter {
    private _commands;
    private _heap;
    constructor(commands: ExtHostCommands, heap: ExtHostHeapService);
    toInternal(command: vscode.Command): modes.Command;
    fromInternal(command: modes.Command): vscode.Command;
    private _executeConvertedCommand<R>(...args);
}
