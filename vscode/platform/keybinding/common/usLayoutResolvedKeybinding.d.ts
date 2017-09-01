import { ResolvedKeybinding, ResolvedKeybindingPart, Keybinding, SimpleKeybinding } from 'vs/base/common/keyCodes';
import { OperatingSystem } from 'vs/base/common/platform';
/**
 * Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
 */
export declare class USLayoutResolvedKeybinding extends ResolvedKeybinding {
    private readonly _os;
    private readonly _firstPart;
    private readonly _chordPart;
    constructor(actual: Keybinding, OS: OperatingSystem);
    private _keyCodeToUILabel(keyCode);
    private _getUILabelForKeybinding(keybinding);
    getLabel(): string;
    private _getAriaLabelForKeybinding(keybinding);
    getAriaLabel(): string;
    private _keyCodeToElectronAccelerator(keyCode);
    private _getElectronAcceleratorLabelForKeybinding(keybinding);
    getElectronAccelerator(): string;
    private _getUserSettingsLabelForKeybinding(keybinding);
    getUserSettingsLabel(): string;
    isWYSIWYG(): boolean;
    isChord(): boolean;
    getParts(): [ResolvedKeybindingPart, ResolvedKeybindingPart];
    private _toResolvedKeybindingPart(keybinding);
    getDispatchParts(): [string, string];
    static getDispatchStr(keybinding: SimpleKeybinding): string;
}
