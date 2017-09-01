import { ContextKeyExpr, IContext } from 'vs/platform/contextkey/common/contextkey';
import { ResolvedKeybindingItem } from 'vs/platform/keybinding/common/resolvedKeybindingItem';
export interface IResolveResult {
    enterChord: boolean;
    commandId: string;
    commandArgs: any;
    bubble: boolean;
}
export declare class KeybindingResolver {
    private readonly _defaultKeybindings;
    private readonly _keybindings;
    private readonly _defaultBoundCommands;
    private readonly _map;
    private readonly _lookupMap;
    constructor(defaultKeybindings: ResolvedKeybindingItem[], overrides: ResolvedKeybindingItem[]);
    private static _isTargetedForRemoval(defaultKb, keypressFirstPart, keypressChordPart, command, when);
    /**
     * Looks for rules containing -command in `overrides` and removes them directly from `defaults`.
     */
    static combine(defaults: ResolvedKeybindingItem[], rawOverrides: ResolvedKeybindingItem[]): ResolvedKeybindingItem[];
    private _addKeyPress(keypress, item);
    private _addToLookupMap(item);
    private _removeFromLookupMap(item);
    /**
     * Returns true if `a` is completely covered by `b`.
     * Returns true if `b` is a more relaxed `a`.
     * Return true if (`a` === true implies `b` === true).
     */
    static whenIsEntirelyIncluded(inNormalizedForm: boolean, a: ContextKeyExpr, b: ContextKeyExpr): boolean;
    getDefaultBoundCommands(): Map<string, boolean>;
    getDefaultKeybindings(): ResolvedKeybindingItem[];
    getKeybindings(): ResolvedKeybindingItem[];
    lookupKeybindings(commandId: string): ResolvedKeybindingItem[];
    lookupPrimaryKeybinding(commandId: string): ResolvedKeybindingItem;
    resolve(context: IContext, currentChord: string, keypress: string): IResolveResult;
    private _findCommand(context, matches);
    static contextMatchesRules(context: IContext, rules: ContextKeyExpr): boolean;
    static getAllUnboundCommands(boundCommands: Map<string, boolean>): string[];
}
