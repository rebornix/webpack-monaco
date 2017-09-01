import { QuickOpenModel } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { IAutoFocus } from 'vs/base/parts/quickopen/common/quickOpen';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IActionOptions, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { Range } from 'vs/editor/common/core/range';
export interface IQuickOpenControllerOpts {
    inputAriaLabel: string;
    getModel(value: string): QuickOpenModel;
    getAutoFocus(searchValue: string): IAutoFocus;
}
export declare class QuickOpenController implements editorCommon.IEditorContribution {
    private themeService;
    private static ID;
    static get(editor: editorCommon.ICommonCodeEditor): QuickOpenController;
    private editor;
    private widget;
    private rangeHighlightDecorationId;
    private lastKnownEditorSelection;
    constructor(editor: ICodeEditor, themeService: IThemeService);
    getId(): string;
    dispose(): void;
    run(opts: IQuickOpenControllerOpts): void;
    private static _RANGE_HIGHLIGHT_DECORATION;
    decorateLine(range: Range, editor: ICodeEditor): void;
    clearDecorations(): void;
}
export interface IQuickOpenOpts {
    /**
     * provide the quick open model for the given search value.
     */
    getModel(value: string): QuickOpenModel;
    /**
     * provide the quick open auto focus mode for the given search value.
     */
    getAutoFocus(searchValue: string): IAutoFocus;
}
/**
 * Base class for providing quick open in the editor.
 */
export declare abstract class BaseEditorQuickOpenAction extends EditorAction {
    private _inputAriaLabel;
    constructor(inputAriaLabel: string, opts: IActionOptions);
    protected getController(editor: editorCommon.ICommonCodeEditor): QuickOpenController;
    protected _show(controller: QuickOpenController, opts: IQuickOpenOpts): void;
}
export interface IDecorator {
    decorateLine(range: Range, editor: editorCommon.IEditor): void;
    clearDecorations(): void;
}
