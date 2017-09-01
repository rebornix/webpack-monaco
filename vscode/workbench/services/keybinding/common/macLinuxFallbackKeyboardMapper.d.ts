import { OperatingSystem } from 'vs/base/common/platform';
import { ResolvedKeybinding, SimpleKeybinding, Keybinding } from 'vs/base/common/keyCodes';
import { IKeyboardMapper } from 'vs/workbench/services/keybinding/common/keyboardMapper';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { ScanCodeBinding } from 'vs/workbench/services/keybinding/common/scanCode';
export interface IMacLinuxKeyMapping {
    value: string;
    withShift: string;
    withAltGr: string;
    withShiftAltGr: string;
    valueIsDeadKey?: boolean;
    withShiftIsDeadKey?: boolean;
    withAltGrIsDeadKey?: boolean;
    withShiftAltGrIsDeadKey?: boolean;
}
export interface IMacLinuxKeyboardMapping {
    [scanCode: string]: IMacLinuxKeyMapping;
}
/**
 * A keyboard mapper to be used when reading the keymap from the OS fails.
 */
export declare class MacLinuxFallbackKeyboardMapper implements IKeyboardMapper {
    /**
     * OS (can be Linux or Macintosh)
     */
    private readonly _OS;
    constructor(OS: OperatingSystem);
    dumpDebugInfo(): string;
    resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
    private _scanCodeToKeyCode(scanCode);
    private _resolveSimpleUserBinding(binding);
    resolveUserBinding(firstPart: SimpleKeybinding | ScanCodeBinding, chordPart: SimpleKeybinding | ScanCodeBinding): ResolvedKeybinding[];
}
