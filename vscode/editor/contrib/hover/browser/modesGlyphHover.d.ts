import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { GlyphHoverWidget } from './hoverWidgets';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IMarkdownString } from 'vs/base/common/htmlContent';
export interface IHoverMessage {
    value: IMarkdownString;
}
export declare class ModesGlyphHoverWidget extends GlyphHoverWidget {
    private openerService;
    private modeService;
    static ID: string;
    private _messages;
    private _lastLineNumber;
    private _computer;
    private _hoverOperation;
    constructor(editor: ICodeEditor, openerService: IOpenerService, modeService: IModeService);
    dispose(): void;
    onModelDecorationsChanged(): void;
    startShowingAt(lineNumber: number): void;
    hide(): void;
    _withResult(result: IHoverMessage[]): void;
    private _renderMessages(lineNumber, messages);
}
