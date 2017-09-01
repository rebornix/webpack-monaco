import { IStringDictionary } from 'vs/base/common/collections';
import { IProblemReporter, Parser } from 'vs/base/common/parsers';
/**
 * Options to be passed to the external program or shell.
 */
export interface CommandOptions {
    /**
     * The current working directory of the executed program or shell.
     * If omitted VSCode's current workspace root is used.
     */
    cwd?: string;
    /**
     * The environment of the executed program or shell. If omitted
     * the parent process' environment is used.
     */
    env?: {
        [key: string]: string;
    };
}
export interface Executable {
    /**
     * The command to be executed. Can be an external program or a shell
     * command.
     */
    command: string;
    /**
     * Specifies whether the command is a shell command and therefore must
     * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
     */
    isShellCommand: boolean;
    /**
     * The arguments passed to the command.
     */
    args: string[];
    /**
     * The command options used when the command is executed. Can be omitted.
     */
    options?: CommandOptions;
}
export interface ForkOptions extends CommandOptions {
    execArgv?: string[];
}
export declare enum Source {
    stdout = 0,
    stderr = 1,
}
/**
 * The data send via a success callback
 */
export interface SuccessData {
    error?: Error;
    cmdCode?: number;
    terminated?: boolean;
}
/**
 * The data send via a error callback
 */
export interface ErrorData {
    error?: Error;
    terminated?: boolean;
    stdout?: string;
    stderr?: string;
}
export interface TerminateResponse {
    success: boolean;
    code?: TerminateResponseCode;
    error?: any;
}
export declare enum TerminateResponseCode {
    Success = 0,
    Unknown = 1,
    AccessDenied = 2,
    ProcessNotFound = 3,
}
export declare namespace Config {
    /**
     * Options to be passed to the external program or shell
     */
    interface CommandOptions {
        /**
         * The current working directory of the executed program or shell.
         * If omitted VSCode's current workspace root is used.
         */
        cwd?: string;
        /**
         * The additional environment of the executed program or shell. If omitted
         * the parent process' environment is used.
         */
        env?: IStringDictionary<string>;
        /**
         * Index signature
         */
        [key: string]: string | string[] | IStringDictionary<string>;
    }
    interface BaseExecutable {
        /**
         * The command to be executed. Can be an external program or a shell
         * command.
         */
        command?: string;
        /**
         * Specifies whether the command is a shell command and therefore must
         * be executed in a shell interpreter (e.g. cmd.exe, bash, ...).
         *
         * Defaults to false if omitted.
         */
        isShellCommand?: boolean;
        /**
         * The arguments passed to the command. Can be omitted.
         */
        args?: string[];
        /**
         * The command options used when the command is executed. Can be omitted.
         */
        options?: CommandOptions;
    }
    interface Executable extends BaseExecutable {
        /**
         * Windows specific executable configuration
         */
        windows?: BaseExecutable;
        /**
         * Mac specific executable configuration
         */
        osx?: BaseExecutable;
        /**
         * Linux specific executable configuration
         */
        linux?: BaseExecutable;
    }
}
export interface ParserOptions {
    globals?: Executable;
    emptyCommand?: boolean;
    noDefaults?: boolean;
}
export declare class ExecutableParser extends Parser {
    constructor(logger: IProblemReporter);
    parse(json: Config.Executable, parserOptions?: ParserOptions): Executable;
    parseExecutable(json: Config.BaseExecutable, globals?: Executable): Executable;
    private parseCommandOptions(json);
    static mergeExecutable(executable: Executable, other: Executable): Executable;
}
