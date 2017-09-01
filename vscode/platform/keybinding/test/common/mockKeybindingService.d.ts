import { ResolvedKeybinding, Keybinding } from 'vs/base/common/keyCodes';
import Event from 'vs/base/common/event';
import { IKeybindingService, IKeybindingEvent, IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { IContextKey, IContextKeyService, IContextKeyServiceTarget, ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { IResolveResult } from 'vs/platform/keybinding/common/keybindingResolver';
import { ResolvedKeybindingItem } from 'vs/platform/keybinding/common/resolvedKeybindingItem';
export declare class MockContextKeyService implements IContextKeyService {
    _serviceBrand: any;
    private _keys;
    dispose(): void;
    createKey<T>(key: string, defaultValue: T): IContextKey<T>;
    contextMatchesRules(rules: ContextKeyExpr): boolean;
    readonly onDidChangeContext: Event<string[]>;
    getContextKeyValue(key: string): any;
    getContext(domNode: HTMLElement): any;
    createScoped(domNode: HTMLElement): IContextKeyService;
}
export declare class MockKeybindingService implements IKeybindingService {
    _serviceBrand: any;
    readonly onDidUpdateKeybindings: Event<IKeybindingEvent>;
    getDefaultKeybindingsContent(): string;
    getDefaultKeybindings(): ResolvedKeybindingItem[];
    getKeybindings(): ResolvedKeybindingItem[];
    resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
    resolveUserBinding(userBinding: string): ResolvedKeybinding[];
    lookupKeybindings(commandId: string): ResolvedKeybinding[];
    lookupKeybinding(commandId: string): ResolvedKeybinding;
    customKeybindingsCount(): number;
    softDispatch(keybinding: IKeyboardEvent, target: IContextKeyServiceTarget): IResolveResult;
}
