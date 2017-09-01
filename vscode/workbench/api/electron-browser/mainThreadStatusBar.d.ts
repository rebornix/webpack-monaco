import { IStatusbarService, StatusbarAlignment as MainThreadStatusBarAlignment } from 'vs/platform/statusbar/common/statusbar';
import { MainThreadStatusBarShape, IExtHostContext } from '../node/extHost.protocol';
import { ThemeColor } from 'vs/platform/theme/common/themeService';
export declare class MainThreadStatusBar implements MainThreadStatusBarShape {
    private readonly _statusbarService;
    private readonly _entries;
    constructor(extHostContext: IExtHostContext, _statusbarService: IStatusbarService);
    dispose(): void;
    $setEntry(id: number, extensionId: string, text: string, tooltip: string, command: string, color: string | ThemeColor, alignment: MainThreadStatusBarAlignment, priority: number): void;
    $dispose(id: number): void;
}
