import { ColorIdentifier } from 'vs/platform/theme/common/colorRegistry';
/**
 * The color identifiers for the terminal's ansi colors. The index in the array corresponds to the index
 * of the color in the terminal color table.
 */
export declare const ansiColorIdentifiers: ColorIdentifier[];
export declare const TERMINAL_BACKGROUND_COLOR: string;
export declare const TERMINAL_FOREGROUND_COLOR: string;
export declare const TERMINAL_CURSOR_FOREGROUND_COLOR: string;
export declare const TERMINAL_CURSOR_BACKGROUND_COLOR: string;
export declare function registerColors(): void;
