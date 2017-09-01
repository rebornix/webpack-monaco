import { TPromise } from 'vs/base/common/winjs.base';
export declare const DEFAULT_TERMINAL_LINUX_READY: TPromise<string, any>;
export declare const DEFAULT_TERMINAL_OSX = "Terminal.app";
export declare const DEFAULT_TERMINAL_WINDOWS: string;
export interface ITerminalConfiguration {
    terminal: {
        explorerKind: 'integrated' | 'external';
        external: {
            linuxExec: string;
            osxExec: string;
            windowsExec: string;
        };
    };
}
