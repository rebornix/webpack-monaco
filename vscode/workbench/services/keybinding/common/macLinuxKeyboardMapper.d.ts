import { OperatingSystem } from 'vs/base/common/platform';
import { ResolvedKeybinding, SimpleKeybinding, Keybinding, ResolvedKeybindingPart } from 'vs/base/common/keyCodes';
import { ScanCodeBinding } from 'vs/workbench/services/keybinding/common/scanCode';
import { IKeyboardMapper } from 'vs/workbench/services/keybinding/common/keyboardMapper';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
export interface IMacLinuxKeyMapping {
    value: string;
    withShift: string;
    withAltGr: string;
    withShiftAltGr: string;
}
export interface IMacLinuxKeyboardMapping {
    [scanCode: string]: IMacLinuxKeyMapping;
}
export declare function macLinuxKeyboardMappingEquals(a: IMacLinuxKeyboardMapping, b: IMacLinuxKeyboardMapping): boolean;
export declare class NativeResolvedKeybinding extends ResolvedKeybinding {
    private readonly _mapper;
    private readonly _OS;
    private readonly _firstPart;
    private readonly _chordPart;
    constructor(mapper: MacLinuxKeyboardMapper, OS: OperatingSystem, firstPart: ScanCodeBinding, chordPart: ScanCodeBinding);
    getLabel(): string;
    getAriaLabel(): string;
    getElectronAccelerator(): string;
    getUserSettingsLabel(): string;
    private _isWYSIWYG(binding);
    isWYSIWYG(): boolean;
    isChord(): boolean;
    getParts(): [ResolvedKeybindingPart, ResolvedKeybindingPart];
    private _toResolvedKeybindingPart(binding);
    getDispatchParts(): [string, string];
}
export declare class MacLinuxKeyboardMapper implements IKeyboardMapper {
    /**
     * Is the keyboard type ISO (on Mac)
     */
    private readonly _isISOKeyboard;
    /**
     * Is this the standard US keyboard layout?
     */
    private readonly _isUSStandard;
    /**
     * OS (can be Linux or Macintosh)
     */
    private readonly _OS;
    /**
     * used only for debug purposes.
     */
    private readonly _codeInfo;
    /**
     * Maps ScanCode combos <-> KeyCode combos.
     */
    private readonly _scanCodeKeyCodeMapper;
    /**
     * UI label for a ScanCode.
     */
    private readonly _scanCodeToLabel;
    /**
     * Dispatching string for a ScanCode.
     */
    private readonly _scanCodeToDispatch;
    constructor(isISOKeyboard: boolean, isUSStandard: boolean, rawMappings: IMacLinuxKeyboardMapping, OS: OperatingSystem);
    dumpDebugInfo(): string;
    private _leftPad(str, cnt);
    simpleKeybindingToScanCodeBinding(keybinding: SimpleKeybinding): ScanCodeBinding[];
    getUILabelForScanCodeBinding(binding: ScanCodeBinding): string;
    getAriaLabelForScanCodeBinding(binding: ScanCodeBinding): string;
    getDispatchStrForScanCodeBinding(keypress: ScanCodeBinding): string;
    getUserSettingsLabelForScanCodeBinding(binding: ScanCodeBinding): string;
    private _getElectronLabelForKeyCode(keyCode);
    getElectronAcceleratorLabelForScanCodeBinding(binding: ScanCodeBinding): string;
    resolveKeybinding(keybinding: Keybinding): NativeResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): NativeResolvedKeybinding;
    private _resolveSimpleUserBinding(binding);
    resolveUserBinding(_firstPart: SimpleKeybinding | ScanCodeBinding, _chordPart: SimpleKeybinding | ScanCodeBinding): ResolvedKeybinding[];
    private static _charCodeToKb(charCode);
    /**
     * Attempt to map a combining character to a regular one that renders the same way.
     *
     * To the brave person following me: Good Luck!
     * https://www.compart.com/en/unicode/bidiclass/NSM
     */
    static getCharCode(char: string): number;
}
