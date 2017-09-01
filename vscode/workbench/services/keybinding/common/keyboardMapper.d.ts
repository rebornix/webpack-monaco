import { Keybinding, ResolvedKeybinding, SimpleKeybinding } from 'vs/base/common/keyCodes';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { ScanCodeBinding } from 'vs/workbench/services/keybinding/common/scanCode';
export interface IKeyboardMapper {
    dumpDebugInfo(): string;
    resolveKeybinding(keybinding: Keybinding): ResolvedKeybinding[];
    resolveKeyboardEvent(keyboardEvent: IKeyboardEvent): ResolvedKeybinding;
    resolveUserBinding(firstPart: SimpleKeybinding | ScanCodeBinding, chordPart: SimpleKeybinding | ScanCodeBinding): ResolvedKeybinding[];
}
