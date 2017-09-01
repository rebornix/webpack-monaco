import 'vs/css!./media/messageList';
import Event from 'vs/base/common/event';
import { Action } from 'vs/base/common/actions';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export declare enum Severity {
    Info = 0,
    Warning = 1,
    Error = 2,
}
export interface IMessageWithAction {
    message: string;
    actions: Action[];
    source: string;
}
export declare class IMessageListOptions {
    purgeInterval: number;
    maxMessages: number;
    maxMessageLength: number;
}
export declare class MessageList {
    private telemetryService;
    private messages;
    private messageListPurger;
    private messageListContainer;
    private container;
    private options;
    private _onMessagesShowing;
    private _onMessagesCleared;
    private toDispose;
    private background;
    private foreground;
    private widgetShadow;
    private outlineBorder;
    private buttonBackground;
    private buttonForeground;
    private infoBackground;
    private infoForeground;
    private warningBackground;
    private warningForeground;
    private errorBackground;
    private errorForeground;
    constructor(container: HTMLElement, telemetryService: ITelemetryService, options?: IMessageListOptions);
    private registerListeners();
    readonly onMessagesShowing: Event<void>;
    readonly onMessagesCleared: Event<void>;
    updateStyles(): void;
    showMessage(severity: Severity, message: string, onHide?: () => void): () => void;
    showMessage(severity: Severity, message: Error, onHide?: () => void): () => void;
    showMessage(severity: Severity, message: string[], onHide?: () => void): () => void;
    showMessage(severity: Severity, message: Error[], onHide?: () => void): () => void;
    showMessage(severity: Severity, message: IMessageWithAction, onHide?: () => void): () => void;
    private getMessageText(message);
    private doShowMessage(id, message, severity, onHide);
    private doShowMessage(id, message, severity, onHide);
    private doShowMessage(id, message, severity, onHide);
    private renderMessages(animate, delta);
    private positionMessageList(animate?);
    private renderMessage(message, container, total, delta);
    private getMessageActions(message);
    private prepareMessages();
    private disposeMessages(messages);
    hideMessages(): void;
    show(): void;
    hide(): void;
    private hideMessage(messageText?);
    private purgeMessages();
    dispose(): void;
}
