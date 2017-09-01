import { TPromise } from 'vs/base/common/winjs.base';
import { IProcessEnvironment } from 'vs/base/common/platform';
export declare const ITerminalService: {
    (...args: any[]): void;
    type: ITerminalService;
};
export interface ITerminalService {
    _serviceBrand: any;
    openTerminal(path: string): void;
    runInTerminal(title: string, cwd: string, args: string[], env: IProcessEnvironment): TPromise<void>;
}
