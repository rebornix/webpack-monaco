import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare const ILogService: {
    (...args: any[]): void;
    type: ILogService;
};
export interface ILogService {
    _serviceBrand: any;
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}
export declare class LogMainService implements ILogService {
    private environmentService;
    _serviceBrand: any;
    constructor(environmentService: IEnvironmentService);
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
}
