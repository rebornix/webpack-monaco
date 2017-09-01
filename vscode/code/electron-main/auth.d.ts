import { IWindowsMainService } from 'vs/platform/windows/electron-main/windows';
export declare class ProxyAuthHandler {
    private windowsService;
    _serviceBrand: any;
    private retryCount;
    private disposables;
    constructor(windowsService: IWindowsMainService);
    private onLogin({event, authInfo, cb});
    dispose(): void;
}
