import { IContextViewService } from 'vs/platform/contextview/browser/contextView';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { IFindController } from 'vs/editor/contrib/find/browser/findWidget';
import { CommonFindController, IFindStartOptions } from 'vs/editor/contrib/find/common/findController';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IStorageService } from 'vs/platform/storage/common/storage';
export declare class FindController extends CommonFindController implements IFindController {
    private _widget;
    private _findOptionsWidget;
    constructor(editor: ICodeEditor, contextViewService: IContextViewService, contextKeyService: IContextKeyService, keybindingService: IKeybindingService, themeService: IThemeService, storageService: IStorageService);
    protected _start(opts: IFindStartOptions): void;
    highlightFindOptions(): void;
}
