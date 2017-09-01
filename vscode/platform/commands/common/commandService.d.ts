import { TPromise } from 'vs/base/common/winjs.base';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ICommandService, ICommand, ICommandEvent } from 'vs/platform/commands/common/commands';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import Event from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
export declare class CommandService extends Disposable implements ICommandService {
    private _instantiationService;
    private _extensionService;
    _serviceBrand: any;
    private _extensionHostIsReady;
    private _onWillExecuteCommand;
    readonly onWillExecuteCommand: Event<ICommandEvent>;
    constructor(_instantiationService: IInstantiationService, _extensionService: IExtensionService);
    executeCommand<T>(id: string, ...args: any[]): TPromise<T>;
    private _tryExecuteCommand(id, args);
    protected _getCommand(id: string): ICommand;
}
