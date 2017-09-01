import { IContextViewService, IContextMenuService, IContextMenuDelegate } from './contextView';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IMessageService } from 'vs/platform/message/common/message';
export declare class ContextMenuService implements IContextMenuService {
    _serviceBrand: any;
    private contextMenuHandler;
    constructor(container: HTMLElement, telemetryService: ITelemetryService, messageService: IMessageService, contextViewService: IContextViewService);
    dispose(): void;
    setContainer(container: HTMLElement): void;
    showContextMenu(delegate: IContextMenuDelegate): void;
}
