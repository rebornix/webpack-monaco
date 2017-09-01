import { Disposable } from 'vs/base/common/lifecycle';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
export declare class DefineKeybindingController extends Disposable implements editorCommon.IEditorContribution {
    private _editor;
    private _instantiationService;
    private static ID;
    static get(editor: editorCommon.ICommonCodeEditor): DefineKeybindingController;
    private _keybindingWidgetRenderer;
    private _keybindingDecorationRenderer;
    constructor(_editor: ICodeEditor, _instantiationService: IInstantiationService);
    getId(): string;
    readonly keybindingWidgetRenderer: KeybindingWidgetRenderer;
    dispose(): void;
    private _update();
    private _createKeybindingWidgetRenderer();
    private _disposeKeybindingWidgetRenderer();
    private _createKeybindingDecorationRenderer();
    private _disposeKeybindingDecorationRenderer();
}
export declare class KeybindingWidgetRenderer extends Disposable {
    private _editor;
    private _instantiationService;
    private _launchWidget;
    private _defineWidget;
    constructor(_editor: ICodeEditor, _instantiationService: IInstantiationService);
    showDefineKeybindingWidget(): void;
    private _onAccepted(keybinding);
}
export declare class KeybindingEditorDecorationsRenderer extends Disposable {
    private _editor;
    private _keybindingService;
    private _updateDecorations;
    private _dec;
    constructor(_editor: ICodeEditor, _keybindingService: IKeybindingService);
    private _updateDecorationsNow();
    private _getDecorationForEntry(model, entry);
    static _userSettingsFuzzyEquals(a: string, b: string): boolean;
    private static _userBindingEquals(a, b);
    private _createDecoration(isError, uiLabel, usLabel, model, keyNode);
}
