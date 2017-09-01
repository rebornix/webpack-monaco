import * as cp from 'child_process';
export declare const TERMINAL_DEFAULT_SHELL_LINUX: any;
export declare const TERMINAL_DEFAULT_SHELL_OSX: any;
export declare const TERMINAL_DEFAULT_SHELL_WINDOWS: string;
export interface ITerminalProcessFactory {
    create(env: {
        [key: string]: string;
    }): cp.ChildProcess;
}
