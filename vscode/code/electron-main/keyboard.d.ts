import { IDisposable } from 'vs/base/common/lifecycle';
import { IStorageService } from 'vs/platform/storage/node/storage';
import Event from 'vs/base/common/event';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IWindowsMainService } from 'vs/platform/windows/electron-main/windows';
import { ILogService } from 'vs/platform/log/common/log';
export declare class KeyboardLayoutMonitor {
    static readonly INSTANCE: KeyboardLayoutMonitor;
    private _emitter;
    private _registered;
    private _isISOKeyboard;
    private constructor();
    onDidChangeKeyboardLayout(callback: (isISOKeyboard: boolean) => void): IDisposable;
    private _readIsISOKeyboard();
    isISOKeyboard(): boolean;
}
export interface IKeybinding {
    id: string;
    label: string;
    isNative: boolean;
}
export declare class KeybindingsResolver {
    private storageService;
    private windowsService;
    private logService;
    private static lastKnownKeybindingsMapStorageKey;
    private commandIds;
    private keybindings;
    private keybindingsWatcher;
    private _onKeybindingsChanged;
    onKeybindingsChanged: Event<void>;
    constructor(storageService: IStorageService, environmentService: IEnvironmentService, windowsService: IWindowsMainService, logService: ILogService);
    private registerListeners();
    private resolveKeybindings(win?);
    getKeybinding(commandId: string): IKeybinding;
}
