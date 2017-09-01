import { ICommandService } from 'vs/platform/commands/common/commands';
import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadCommandsShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadCommands implements MainThreadCommandsShape {
    private readonly _commandService;
    private readonly _disposables;
    private readonly _generateCommandsDocumentationRegistration;
    private readonly _proxy;
    constructor(extHostContext: IExtHostContext, _commandService: ICommandService);
    dispose(): void;
    private _generateCommandsDocumentation();
    $registerCommand(id: string): TPromise<any>;
    $unregisterCommand(id: string): TPromise<any>;
    $executeCommand<T>(id: string, args: any[]): Thenable<T>;
    $getCommands(): Thenable<string[]>;
}
