import { Keybinding, SimpleKeybinding } from 'vs/base/common/keyCodes';
import { OperatingSystem } from 'vs/base/common/platform';
import { IUserFriendlyKeybinding } from 'vs/platform/keybinding/common/keybinding';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { ResolvedKeybindingItem } from 'vs/platform/keybinding/common/resolvedKeybindingItem';
import { ScanCodeBinding } from 'vs/workbench/services/keybinding/common/scanCode';
export interface IUserKeybindingItem {
    firstPart: SimpleKeybinding | ScanCodeBinding;
    chordPart: SimpleKeybinding | ScanCodeBinding;
    command: string;
    commandArgs?: any;
    when: ContextKeyExpr;
}
export declare class KeybindingIO {
    static writeKeybindingItem(out: OutputBuilder, item: ResolvedKeybindingItem, OS: OperatingSystem): void;
    static readUserKeybindingItem(input: IUserFriendlyKeybinding, OS: OperatingSystem): IUserKeybindingItem;
    private static _readModifiers(input);
    private static _readSimpleKeybinding(input);
    static readKeybinding(input: string, OS: OperatingSystem): Keybinding;
    private static _readSimpleUserBinding(input);
    static _readUserBinding(input: string): [SimpleKeybinding | ScanCodeBinding, SimpleKeybinding | ScanCodeBinding];
}
export declare class OutputBuilder {
    private _lines;
    private _currentLine;
    write(str: string): void;
    writeLine(str?: string): void;
    toString(): string;
}
