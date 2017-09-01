import { IDisposable } from 'vs/base/common/lifecycle';
import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ICommandService, ICommandHandler } from 'vs/platform/commands/common/commands';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IActionDescriptor, IModel } from 'vs/editor/common/editorCommon';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { IEditorWorkerService } from 'vs/editor/common/services/editorWorkerService';
import { CodeEditor } from 'vs/editor/browser/codeEditor';
import { DiffEditorWidget } from 'vs/editor/browser/widget/diffEditorWidget';
import { ICodeEditor, IDiffEditor } from 'vs/editor/browser/editorBrowser';
import { IStandaloneThemeService } from 'vs/editor/standalone/common/standaloneThemeService';
import { IDiffEditorOptions, IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IMessageService } from 'vs/platform/message/common/message';
/**
 * The options to create an editor.
 */
export interface IEditorConstructionOptions extends IEditorOptions {
    /**
     * The initial model associated with this code editor.
     */
    model?: IModel;
    /**
     * The initial value of the auto created model in the editor.
     * To not create automatically a model, use `model: null`.
     */
    value?: string;
    /**
     * The initial language of the auto created model in the editor.
     * To not create automatically a model, use `model: null`.
     */
    language?: string;
    /**
     * Initial theme to be used for rendering.
     * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
     * You can create custom themes via `monaco.editor.defineTheme`.
     * To switch a theme, use `monaco.editor.setTheme`
     */
    theme?: string;
    /**
     * An URL to open when Ctrl+H (Windows and Linux) or Cmd+H (OSX) is pressed in
     * the accessibility help dialog in the editor.
     *
     * Defaults to "https://go.microsoft.com/fwlink/?linkid=852450"
     */
    accessibilityHelpUrl?: string;
}
/**
 * The options to create a diff editor.
 */
export interface IDiffEditorConstructionOptions extends IDiffEditorOptions {
    /**
     * Initial theme to be used for rendering.
     * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
     * You can create custom themes via `monaco.editor.defineTheme`.
     * To switch a theme, use `monaco.editor.setTheme`
     */
    theme?: string;
}
export interface IStandaloneCodeEditor extends ICodeEditor {
    addCommand(keybinding: number, handler: ICommandHandler, context: string): string;
    createContextKey<T>(key: string, defaultValue: T): IContextKey<T>;
    addAction(descriptor: IActionDescriptor): IDisposable;
}
export interface IStandaloneDiffEditor extends IDiffEditor {
    addCommand(keybinding: number, handler: ICommandHandler, context: string): string;
    createContextKey<T>(key: string, defaultValue: T): IContextKey<T>;
    addAction(descriptor: IActionDescriptor): IDisposable;
    getOriginalEditor(): IStandaloneCodeEditor;
    getModifiedEditor(): IStandaloneCodeEditor;
}
/**
 * A code editor to be used both by the standalone editor and the standalone diff editor.
 */
export declare class StandaloneCodeEditor extends CodeEditor implements IStandaloneCodeEditor {
    private _standaloneKeybindingService;
    constructor(domElement: HTMLElement, options: IEditorConstructionOptions, instantiationService: IInstantiationService, codeEditorService: ICodeEditorService, commandService: ICommandService, contextKeyService: IContextKeyService, keybindingService: IKeybindingService, themeService: IThemeService);
    addCommand(keybinding: number, handler: ICommandHandler, context: string): string;
    createContextKey<T>(key: string, defaultValue: T): IContextKey<T>;
    addAction(_descriptor: IActionDescriptor): IDisposable;
}
export declare class StandaloneEditor extends StandaloneCodeEditor implements IStandaloneCodeEditor {
    private _contextViewService;
    private _ownsModel;
    constructor(domElement: HTMLElement, options: IEditorConstructionOptions, toDispose: IDisposable, instantiationService: IInstantiationService, codeEditorService: ICodeEditorService, commandService: ICommandService, contextKeyService: IContextKeyService, keybindingService: IKeybindingService, contextViewService: IContextViewService, themeService: IStandaloneThemeService);
    dispose(): void;
    destroy(): void;
    _attachModel(model: IModel): void;
    _postDetachModelCleanup(detachedModel: IModel): void;
}
export declare class StandaloneDiffEditor extends DiffEditorWidget implements IStandaloneDiffEditor {
    private _contextViewService;
    private _standaloneKeybindingService;
    constructor(domElement: HTMLElement, options: IDiffEditorConstructionOptions, toDispose: IDisposable, instantiationService: IInstantiationService, contextKeyService: IContextKeyService, keybindingService: IKeybindingService, contextViewService: IContextViewService, editorWorkerService: IEditorWorkerService, codeEditorService: ICodeEditorService, themeService: IStandaloneThemeService, messageService: IMessageService);
    dispose(): void;
    destroy(): void;
    protected _createInnerEditor(instantiationService: IInstantiationService, container: HTMLElement, options: IEditorOptions): CodeEditor;
    getOriginalEditor(): IStandaloneCodeEditor;
    getModifiedEditor(): IStandaloneCodeEditor;
    addCommand(keybinding: number, handler: ICommandHandler, context: string): string;
    createContextKey<T>(key: string, defaultValue: T): IContextKey<T>;
    addAction(descriptor: IActionDescriptor): IDisposable;
}
