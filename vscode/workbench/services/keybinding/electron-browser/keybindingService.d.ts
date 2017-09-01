import { ResolvedKeybinding, Keybinding } from 'vs/base/common/keyCodes';
import { AbstractKeybindingService } from 'vs/platform/keybinding/common/abstractKeybindingService';
import { IStatusbarService } from 'vs/platform/statusbar/common/statusbar';
import { KeybindingResolver } from 'vs/platform/keybinding/common/keybindingResolver';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IMessageService } from 'vs/platform/message/common/message';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import * as nativeKeymap from 'native-keymap';
import { IKeyboardMapper } from 'vs/workbench/services/keybinding/common/keyboardMapper';
import Event from 'vs/base/common/event';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class KeyboardMapperFactory {
    static INSTANCE: KeyboardMapperFactory;
    private _isISOKeyboard;
    private _layoutInfo;
    private _rawMapping;
    private _keyboardMapper;
    private _initialized;
    private _onDidChangeKeyboardMapper;
    onDidChangeKeyboardMapper: Event<void>;
    private constructor();
    _onKeyboardLayoutChanged(isISOKeyboard: boolean): void;
    getKeyboardMapper(dispatchConfig: DispatchConfig): IKeyboardMapper;
    getCurrentKeyboardLayout(): nativeKeymap.IKeyboardLayoutInfo;
    private static _isUSStandard(_kbInfo);
    getRawKeyboardMapping(): nativeKeymap.IKeyboardMapping;
    private _setKeyboardData(isISOKeyboard, layoutInfo, rawMapping);
    private static _createKeyboardMapper(isISOKeyboard, layoutInfo, rawMapping);
    private static _equals(a, b);
}
export declare const enum DispatchConfig {
    Code = 0,
    KeyCode = 1,
}
export declare class WorkbenchKeybindingService extends AbstractKeybindingService {
    private telemetryService;
    private _keyboardMapper;
    private _cachedResolver;
    private _firstTimeComputingResolver;
    private userKeybindings;
    constructor(windowElement: Window, contextKeyService: IContextKeyService, commandService: ICommandService, telemetryService: ITelemetryService, messageService: IMessageService, environmentService: IEnvironmentService, statusBarService: IStatusbarService, configurationService: IConfigurationService);
    dumpDebugInfo(): string;
    private _safeGetConfig();
    customKeybindingsCount(): number;
    private updateResolver(event);
    protected _getResolver(): KeybindingResolver;
    private _resolveKeybindingItems(items, isDefault);
    private _resolveUserKeybindingItems(items, isDefault);
    private _getExtraKeybindings(isFirstTime);
    resolveKeybinding(kb: Keybinding): ResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
    resolveUserBinding(userBinding: string): ResolvedKeybinding[];
    private _handleKeybindingsExtensionPointUser(isBuiltin, keybindings, collector);
    private _handleKeybinding(isBuiltin, idx, keybindings, collector);
    private _asCommandRule(isBuiltin, idx, binding);
    getDefaultKeybindingsContent(): string;
    private static _getDefaultKeybindings(defaultKeybindings);
    private static _getAllCommandsAsComment(boundCommands);
}
