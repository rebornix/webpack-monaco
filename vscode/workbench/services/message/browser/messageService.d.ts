import { IMessageService, IMessageWithAction, IConfirmation, Severity } from 'vs/platform/message/common/message';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import Event from 'vs/base/common/event';
export declare class WorkbenchMessageService implements IMessageService {
    _serviceBrand: any;
    private handler;
    private toDispose;
    private canShowMessages;
    private messageBuffer;
    constructor(container: HTMLElement, telemetryService: ITelemetryService);
    readonly onMessagesShowing: Event<void>;
    readonly onMessagesCleared: Event<void>;
    suspend(): void;
    resume(): void;
    private toBaseSeverity(severity);
    show(sev: Severity, message: string, onHide?: () => void): () => void;
    show(sev: Severity, message: Error, onHide?: () => void): () => void;
    show(sev: Severity, message: string[], onHide?: () => void): () => void;
    show(sev: Severity, message: Error[], onHide?: () => void): () => void;
    show(sev: Severity, message: IMessageWithAction, onHide?: () => void): () => void;
    private doShow(sev, message, onHide?);
    hideAll(): void;
    confirm(confirmation: IConfirmation): boolean;
    dispose(): void;
}
