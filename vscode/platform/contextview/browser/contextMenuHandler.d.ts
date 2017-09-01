import 'vs/css!./contextMenuHandler';
import { IContextViewService, IContextMenuDelegate } from 'vs/platform/contextview/browser/contextView';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IMessageService } from 'vs/platform/message/common/message';
export declare class ContextMenuHandler {
    private contextViewService;
    private messageService;
    private telemetryService;
    private actionRunner;
    private $el;
    private menuContainerElement;
    private toDispose;
    constructor(element: HTMLElement, contextViewService: IContextViewService, telemetryService: ITelemetryService, messageService: IMessageService);
    setContainer(container: HTMLElement): void;
    showContextMenu(delegate: IContextMenuDelegate): void;
    private onMouseDown(e);
    dispose(): void;
}
