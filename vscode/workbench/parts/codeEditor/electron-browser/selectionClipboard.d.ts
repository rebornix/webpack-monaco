import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Disposable } from 'vs/base/common/lifecycle';
import { IEditorContribution } from 'vs/editor/common/editorCommon';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
export declare class SelectionClipboard extends Disposable implements IEditorContribution {
    private static ID;
    constructor(editor: ICodeEditor, contextKeyService: IContextKeyService);
    getId(): string;
    dispose(): void;
}
