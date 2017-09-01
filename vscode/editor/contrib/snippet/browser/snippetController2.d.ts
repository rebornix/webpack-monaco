import { RawContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
export declare class SnippetController2 {
    private readonly _editor;
    static get(editor: ICommonCodeEditor): SnippetController2;
    static InSnippetMode: RawContextKey<boolean>;
    static HasNextTabstop: RawContextKey<boolean>;
    static HasPrevTabstop: RawContextKey<boolean>;
    private readonly _inSnippet;
    private readonly _hasNextTabstop;
    private readonly _hasPrevTabstop;
    private _session;
    private _snippetListener;
    private _modelVersionId;
    private _currentChoice;
    constructor(_editor: ICommonCodeEditor, contextKeyService: IContextKeyService);
    dispose(): void;
    getId(): string;
    insert(template: string, overwriteBefore?: number, overwriteAfter?: number, undoStopBefore?: boolean, undoStopAfter?: boolean): void;
    private _updateState();
    private _handleChoice();
    finish(): void;
    cancel(): void;
    prev(): void;
    next(): void;
}
