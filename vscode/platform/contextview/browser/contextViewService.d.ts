import { IContextViewService, IContextViewDelegate } from './contextView';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IMessageService } from 'vs/platform/message/common/message';
export declare class ContextViewService implements IContextViewService {
    _serviceBrand: any;
    private contextView;
    constructor(container: HTMLElement, telemetryService: ITelemetryService, messageService: IMessageService);
    dispose(): void;
    setContainer(container: HTMLElement): void;
    showContextView(delegate: IContextViewDelegate): void;
    layout(): void;
    hideContextView(data?: any): void;
}
