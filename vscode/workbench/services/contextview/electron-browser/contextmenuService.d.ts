import { IContextMenuService, IContextMenuDelegate } from 'vs/platform/contextview/browser/contextView';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IMessageService } from 'vs/platform/message/common/message';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
export declare class ContextMenuService implements IContextMenuService {
    private messageService;
    private telemetryService;
    private keybindingService;
    _serviceBrand: any;
    constructor(messageService: IMessageService, telemetryService: ITelemetryService, keybindingService: IKeybindingService);
    showContextMenu(delegate: IContextMenuDelegate): void;
    private createMenu(delegate, entries);
    private runAction(actionRunner, actionToRun, delegate, event);
}
