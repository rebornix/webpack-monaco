import { IMessageService, IChoiceService } from 'vs/platform/message/common/message';
import Severity from 'vs/base/common/severity';
import { MainThreadMessageServiceShape, IExtHostContext, MainThreadMessageOptions } from '../node/extHost.protocol';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
export declare class MainThreadMessageService implements MainThreadMessageServiceShape {
    private readonly _extensionService;
    private readonly _messageService;
    private readonly _choiceService;
    constructor(extHostContext: IExtHostContext, _extensionService: IExtensionService, _messageService: IMessageService, _choiceService: IChoiceService);
    dispose(): void;
    $showMessage(severity: Severity, message: string, options: MainThreadMessageOptions, commands: {
        title: string;
        isCloseAffordance: boolean;
        handle: number;
    }[]): Thenable<number>;
    private _showMessage(severity, message, commands, extension);
    private _showModalMessage(severity, message, commands);
}
