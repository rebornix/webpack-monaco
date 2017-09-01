export declare const EXTENSION_LOG_BROADCAST_CHANNEL = "vscode:extensionLog";
export declare const EXTENSION_ATTACH_BROADCAST_CHANNEL = "vscode:extensionAttach";
export declare const EXTENSION_TERMINATE_BROADCAST_CHANNEL = "vscode:extensionTerminate";
export declare const EXTENSION_RELOAD_BROADCAST_CHANNEL = "vscode:extensionReload";
export declare const EXTENSION_CLOSE_EXTHOST_BROADCAST_CHANNEL = "vscode:extensionCloseExtensionHost";
export interface ILogEntry {
    type: string;
    severity: string;
    arguments: any;
}
