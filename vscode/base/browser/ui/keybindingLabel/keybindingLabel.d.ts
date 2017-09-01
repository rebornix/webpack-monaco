import 'vs/css!./keybindingLabel';
import { IDisposable } from 'vs/base/common/lifecycle';
import { OperatingSystem } from 'vs/base/common/platform';
import { ResolvedKeybinding } from 'vs/base/common/keyCodes';
export interface PartMatches {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    keyCode?: boolean;
}
export interface Matches {
    firstPart: PartMatches;
    chordPart: PartMatches;
}
export declare class KeybindingLabel implements IDisposable {
    private os;
    private domNode;
    private keybinding;
    private matches;
    private didEverRender;
    constructor(container: HTMLElement, os: OperatingSystem);
    readonly element: HTMLElement;
    set(keybinding: ResolvedKeybinding, matches: Matches): void;
    private render();
    private renderPart(parent, part, match);
    private renderKey(parent, label, highlight, separator);
    dispose(): void;
    private static areSame(a, b);
}
