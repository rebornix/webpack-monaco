import 'vs/css!./messageController';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IContextKeyService, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
import { IPosition } from 'vs/editor/common/core/position';
export declare class MessageController {
    private static _id;
    static CONTEXT_SNIPPET_MODE: RawContextKey<boolean>;
    static get(editor: editorCommon.ICommonCodeEditor): MessageController;
    getId(): string;
    private _editor;
    private _visible;
    private _messageWidget;
    private _messageListeners;
    constructor(editor: ICodeEditor, contextKeyService: IContextKeyService);
    dispose(): void;
    showMessage(message: string, position: IPosition): void;
    closeMessage(): void;
}
