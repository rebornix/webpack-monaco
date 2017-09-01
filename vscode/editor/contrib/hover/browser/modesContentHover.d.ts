import { IOpenerService } from 'vs/platform/opener/common/opener';
import { IModeService } from 'vs/editor/common/services/modeService';
import { Range } from 'vs/editor/common/core/range';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { ContentHoverWidget } from './hoverWidgets';
export declare class ModesContentHoverWidget extends ContentHoverWidget {
    static ID: string;
    private _messages;
    private _lastRange;
    private _computer;
    private _hoverOperation;
    private _highlightDecorations;
    private _isChangingDecorations;
    private _openerService;
    private _modeService;
    private _shouldFocus;
    private _colorPicker;
    private renderDisposable;
    private toDispose;
    constructor(editor: ICodeEditor, openerService: IOpenerService, modeService: IModeService);
    dispose(): void;
    onModelDecorationsChanged(): void;
    startShowingAt(range: Range, focus: boolean): void;
    hide(): void;
    isColorPickerVisible(): boolean;
    private _withResult(result, complete);
    private _renderMessages(renderRange, messages);
    private static _DECORATION_OPTIONS;
}
