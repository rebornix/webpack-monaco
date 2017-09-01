import 'vs/css!vs/workbench/parts/debug/browser/media/repl';
import { TPromise } from 'vs/base/common/winjs.base';
import { IAction } from 'vs/base/common/actions';
import { Dimension, Builder } from 'vs/base/browser/builder';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IStorageService } from 'vs/platform/storage/common/storage';
import * as debug from 'vs/workbench/parts/debug/common/debug';
import { Panel } from 'vs/workbench/browser/panel';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IListService } from 'vs/platform/list/browser/listService';
import { IThemeService } from 'vs/platform/theme/common/themeService';
export interface IPrivateReplService {
    _serviceBrand: any;
    navigateHistory(previous: boolean): void;
    acceptReplInput(): void;
    getVisibleContent(): string;
}
export declare class Repl extends Panel implements IPrivateReplService {
    private debugService;
    private instantiationService;
    private storageService;
    private panelService;
    protected themeService: IThemeService;
    private modelService;
    private contextKeyService;
    private listService;
    _serviceBrand: any;
    private static HALF_WIDTH_TYPICAL;
    private static HISTORY;
    private static REFRESH_DELAY;
    private static REPL_INPUT_INITIAL_HEIGHT;
    private static REPL_INPUT_MAX_HEIGHT;
    private tree;
    private renderer;
    private characterWidthSurveyor;
    private treeContainer;
    private replInput;
    private replInputContainer;
    private refreshTimeoutHandle;
    private actions;
    private dimension;
    private replInputHeight;
    constructor(debugService: debug.IDebugService, telemetryService: ITelemetryService, instantiationService: IInstantiationService, storageService: IStorageService, panelService: IPanelService, themeService: IThemeService, modelService: IModelService, contextKeyService: IContextKeyService, listService: IListService);
    private registerListeners();
    private refreshReplElements(noDelay);
    create(parent: Builder): TPromise<void>;
    private createReplInput(container);
    navigateHistory(previous: boolean): void;
    acceptReplInput(): void;
    getVisibleContent(): string;
    layout(dimension: Dimension): void;
    focus(): void;
    getActions(): IAction[];
    shutdown(): void;
    private getReplInputOptions();
    dispose(): void;
}
export declare class ReplCopyAllAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void | TPromise<void>;
}
