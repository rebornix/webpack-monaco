import { OperatingSystem } from 'vs/base/common/platform';
export interface ModifierLabels {
    readonly ctrlKey: string;
    readonly shiftKey: string;
    readonly altKey: string;
    readonly metaKey: string;
    readonly separator: string;
}
export interface Modifiers {
    readonly ctrlKey: boolean;
    readonly shiftKey: boolean;
    readonly altKey: boolean;
    readonly metaKey: boolean;
}
export declare class ModifierLabelProvider {
    readonly modifierLabels: ModifierLabels[];
    constructor(mac: ModifierLabels, windows: ModifierLabels, linux?: ModifierLabels);
    toLabel(firstPartMod: Modifiers, firstPartKey: string, chordPartMod: Modifiers, chordPartKey: string, OS: OperatingSystem): string;
}
/**
 * A label provider that prints modifiers in a suitable format for displaying in the UI.
 */
export declare const UILabelProvider: ModifierLabelProvider;
/**
 * A label provider that prints modifiers in a suitable format for ARIA.
 */
export declare const AriaLabelProvider: ModifierLabelProvider;
/**
 * A label provider that prints modifiers in a suitable format for Electron Accelerators.
 * See https://github.com/electron/electron/blob/master/docs/api/accelerator.md
 */
export declare const ElectronAcceleratorLabelProvider: ModifierLabelProvider;
/**
 * A label provider that prints modifiers in a suitable format for user settings.
 */
export declare const UserSettingsLabelProvider: ModifierLabelProvider;
