import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IChoiceService, Severity } from 'vs/platform/message/common/message';
export interface IChoiceChannel extends IChannel {
    call(command: 'choose'): TPromise<number>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class ChoiceChannel implements IChoiceChannel {
    private choiceService;
    constructor(choiceService: IChoiceService);
    call(command: string, args?: [Severity, string, string[], number, boolean]): TPromise<any>;
}
export declare class ChoiceChannelClient implements IChoiceService {
    private channel;
    _serviceBrand: any;
    constructor(channel: IChoiceChannel);
    choose(severity: Severity, message: string, options: string[], cancelId: number, modal?: boolean): TPromise<number>;
}
