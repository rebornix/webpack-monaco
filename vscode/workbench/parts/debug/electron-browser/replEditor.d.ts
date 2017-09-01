import { IEditorOptions } from 'vs/editor/common/config/editorOptions';
import { EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { IEditorContributionCtor } from 'vs/editor/browser/editorBrowser';
import { CodeEditorWidget } from 'vs/editor/browser/widget/codeEditorWidget';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export declare class ReplInputEditor extends CodeEditorWidget {
    constructor(domElement: HTMLElement, options: IEditorOptions, instantiationService: IInstantiationService, codeEditorService: ICodeEditorService, commandService: ICommandService, contextKeyService: IContextKeyService, themeService: IThemeService);
    protected _getContributions(): IEditorContributionCtor[];
    protected _getActions(): EditorAction[];
}
