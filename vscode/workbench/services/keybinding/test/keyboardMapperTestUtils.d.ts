import { IKeyboardMapper } from 'vs/workbench/services/keybinding/common/keyboardMapper';
import { Keybinding, SimpleKeybinding } from 'vs/base/common/keyCodes';
import { TPromise } from 'vs/base/common/winjs.base';
import { IKeyboardEvent } from 'vs/platform/keybinding/common/keybinding';
import { ScanCodeBinding } from 'vs/workbench/services/keybinding/common/scanCode';
export interface IResolvedKeybinding {
    label: string;
    ariaLabel: string;
    electronAccelerator: string;
    userSettingsLabel: string;
    isWYSIWYG: boolean;
    isChord: boolean;
    dispatchParts: [string, string];
}
export declare function assertResolveKeybinding(mapper: IKeyboardMapper, keybinding: Keybinding, expected: IResolvedKeybinding[]): void;
export declare function assertResolveKeyboardEvent(mapper: IKeyboardMapper, keyboardEvent: IKeyboardEvent, expected: IResolvedKeybinding): void;
export declare function assertResolveUserBinding(mapper: IKeyboardMapper, firstPart: SimpleKeybinding | ScanCodeBinding, chordPart: SimpleKeybinding | ScanCodeBinding, expected: IResolvedKeybinding[]): void;
export declare function readRawMapping<T>(file: string): TPromise<T>;
export declare function assertMapping(writeFileIfDifferent: boolean, mapper: IKeyboardMapper, file: string, done: (err?: any) => void): void;
