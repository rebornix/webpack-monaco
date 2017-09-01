import Event from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
import * as platform from 'vs/base/common/platform';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { FontInfo, BareFontInfo } from 'vs/editor/common/config/fontInfo';
import * as editorOptions from 'vs/editor/common/config/editorOptions';
/**
 * Control what pressing Tab does.
 * If it is false, pressing Tab or Shift-Tab will be handled by the editor.
 * If it is true, pressing Tab or Shift-Tab will move the browser focus.
 * Defaults to false.
 */
export interface ITabFocus {
    onDidChangeTabFocus: Event<boolean>;
    getTabFocusMode(): boolean;
    setTabFocusMode(tabFocusMode: boolean): void;
}
export declare const TabFocus: ITabFocus;
export interface IEnvConfiguration {
    extraEditorClassName: string;
    outerWidth: number;
    outerHeight: number;
    emptySelectionClipboard: boolean;
    pixelRatio: number;
    zoomLevel: number;
    accessibilitySupport: platform.AccessibilitySupport;
}
export declare abstract class CommonEditorConfiguration extends Disposable implements editorCommon.IConfiguration {
    protected _rawOptions: editorOptions.IEditorOptions;
    protected _validatedOptions: editorOptions.IValidatedEditorOptions;
    editor: editorOptions.InternalEditorOptions;
    private _isDominatedByLongLines;
    private _lineNumbersDigitCount;
    private _onDidChange;
    onDidChange: Event<editorOptions.IConfigurationChangedEvent>;
    constructor(options: editorOptions.IEditorOptions);
    dispose(): void;
    protected _recomputeOptions(): void;
    getRawOptions(): editorOptions.IEditorOptions;
    private _computeInternalOptions();
    updateOptions(newOptions: editorOptions.IEditorOptions): void;
    setIsDominatedByLongLines(isDominatedByLongLines: boolean): void;
    setMaxLineNumber(maxLineNumber: number): void;
    private static _digitCount(n);
    protected abstract _getEnvConfiguration(): IEnvConfiguration;
    protected abstract readConfiguration(styling: BareFontInfo): FontInfo;
}
