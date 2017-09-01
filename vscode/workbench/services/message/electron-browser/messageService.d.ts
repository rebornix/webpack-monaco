import { TPromise } from 'vs/base/common/winjs.base';
import { WorkbenchMessageService } from 'vs/workbench/services/message/browser/messageService';
import { IConfirmation, Severity, IChoiceService } from 'vs/platform/message/common/message';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IWindowService } from 'vs/platform/windows/common/windows';
export declare class MessageService extends WorkbenchMessageService implements IChoiceService {
    private windowService;
    constructor(container: HTMLElement, windowService: IWindowService, telemetryService: ITelemetryService);
    confirm(confirmation: IConfirmation): boolean;
    choose(severity: Severity, message: string, options: string[], cancelId: number, modal?: boolean): TPromise<number>;
    private showMessageBox(opts);
}
