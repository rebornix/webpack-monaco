import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { CodeEditor } from 'vs/editor/browser/codeEditor';
import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class EmbeddedCodeEditorWidget extends CodeEditor {
    private _parentEditor;
    private _overwriteOptions;
    constructor(domElement: HTMLElement, options: IEditorOptions, parentEditor: ICodeEditor, instantiationService: IInstantiationService, codeEditorService: ICodeEditorService, commandService: ICommandService, contextKeyService: IContextKeyService, themeService: IThemeService);
    getParentEditor(): ICodeEditor;
    private _onParentConfigurationChanged(e);
    updateOptions(newOptions: IEditorOptions): void;
}
