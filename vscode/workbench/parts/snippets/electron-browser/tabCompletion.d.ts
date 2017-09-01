import { RawContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ISnippetsService } from 'vs/workbench/parts/snippets/electron-browser/snippetsService';
import * as editorCommon from 'vs/editor/common/editorCommon';
export declare class TabCompletionController implements editorCommon.IEditorContribution {
    private static ID;
    static ContextKey: RawContextKey<boolean>;
    static get(editor: editorCommon.ICommonCodeEditor): TabCompletionController;
    private readonly _editor;
    private readonly _snippetController;
    private readonly _dispoables;
    private readonly _snippets;
    constructor(editor: editorCommon.ICommonCodeEditor, contextKeyService: IContextKeyService, snippetService: ISnippetsService);
    getId(): string;
    dispose(): void;
    performSnippetCompletions(): void;
}
