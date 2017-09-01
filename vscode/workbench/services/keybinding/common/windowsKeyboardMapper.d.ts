import { KeyCode, ResolvedKeybinding, Keybinding, SimpleKeybinding, ResolvedKeybindingPart } from 'vs/base/common/keyCodes';
import { ScanCode, ScanCodeBinding } from 'vs/workbench/services/keybinding/common/scanCode';
import { IKeyboardMapper } from 'vs/workbench/services/keybinding/common/keyboardMapper';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
export interface IWindowsKeyMapping {
    vkey: string;
    value: string;
    withShift: string;
    withAltGr: string;
    withShiftAltGr: string;
}
export interface IWindowsKeyboardMapping {
    [scanCode: string]: IWindowsKeyMapping;
}
export declare function windowsKeyboardMappingEquals(a: IWindowsKeyboardMapping, b: IWindowsKeyboardMapping): boolean;
export interface IScanCodeMapping {
    scanCode: ScanCode;
    keyCode: KeyCode;
    value: string;
    withShift: string;
    withAltGr: string;
    withShiftAltGr: string;
}
export declare class WindowsNativeResolvedKeybinding extends ResolvedKeybinding {
    private readonly _mapper;
    private readonly _firstPart;
    private readonly _chordPart;
    constructor(mapper: WindowsKeyboardMapper, firstPart: SimpleKeybinding, chordPart: SimpleKeybinding);
    private _getUILabelForKeybinding(keybinding);
    getLabel(): string;
    private _getUSLabelForKeybinding(keybinding);
    getUSLabel(): string;
    private _getAriaLabelForKeybinding(keybinding);
    getAriaLabel(): string;
    private _keyCodeToElectronAccelerator(keyCode);
    private _getElectronAcceleratorLabelForKeybinding(keybinding);
    getElectronAccelerator(): string;
    private _getUserSettingsLabelForKeybinding(keybinding);
    getUserSettingsLabel(): string;
    isWYSIWYG(): boolean;
    private _isWYSIWYG(keyCode);
    isChord(): boolean;
    getParts(): [ResolvedKeybindingPart, ResolvedKeybindingPart];
    private _toResolvedKeybindingPart(keybinding);
    getDispatchParts(): [string, string];
    private _getDispatchStr(keybinding);
    private static getProducedCharCode(kb, mapping);
    static getProducedChar(kb: ScanCodeBinding, mapping: IScanCodeMapping): string;
}
export declare class WindowsKeyboardMapper implements IKeyboardMapper {
    readonly isUSStandard: boolean;
    private readonly _codeInfo;
    private readonly _scanCodeToKeyCode;
    private readonly _keyCodeToLabel;
    private readonly _keyCodeExists;
    constructor(isUSStandard: boolean, rawMappings: IWindowsKeyboardMapping);
    dumpDebugInfo(): string;
    private _leftPad(str, cnt);
    getUILabelForKeyCode(keyCode: KeyCode): string;
    getAriaLabelForKeyCode(keyCode: KeyCode): string;
    getUserSettingsLabelForKeyCode(keyCode: KeyCode): string;
    private _getLabelForKeyCode(keyCode);
    resolveKeybinding(keybinding: Keybinding): WindowsNativeResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): WindowsNativeResolvedKeybinding;
    private _resolveSimpleUserBinding(binding);
    resolveUserBinding(firstPart: SimpleKeybinding | ScanCodeBinding, chordPart: SimpleKeybinding | ScanCodeBinding): ResolvedKeybinding[];
}
