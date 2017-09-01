import cp = require('child_process');
export interface IForkOpts {
    cwd?: string;
    env?: any;
    encoding?: string;
    execArgv?: string[];
}
export declare function fork(modulePath: string, args: string[], options: IForkOpts, callback: (error: any, cp: cp.ChildProcess) => void): void;
