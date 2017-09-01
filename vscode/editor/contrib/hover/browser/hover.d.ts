import 'vs/css!./hover';
import { IOpenerService } from 'vs/platform/opener/common/opener';
import { IModeService } from 'vs/editor/common/services/modeService';
import { Range } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
export declare class ModesHoverController implements editorCommon.IEditorContribution {
    private static ID;
    private _editor;
    private _toUnhook;
    private _contentWidget;
    private _glyphWidget;
    private _isMouseDown;
    private _hoverClicked;
    static get(editor: editorCommon.ICommonCodeEditor): ModesHoverController;
    constructor(editor: ICodeEditor, openerService: IOpenerService, modeService: IModeService);
    private _onModelDecorationsChanged();
    private _onEditorMouseDown(mouseEvent);
    private _onEditorMouseUp(mouseEvent);
    private _onEditorMouseMove(mouseEvent);
    private _onKeyDown(e);
    private _hideWidgets();
    showContentHover(range: Range, focus: boolean): void;
    getId(): string;
    dispose(): void;
}
