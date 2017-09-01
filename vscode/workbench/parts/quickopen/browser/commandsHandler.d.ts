import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IAutoFocus, IModel, IQuickNavigateConfiguration } from 'vs/base/parts/quickopen/common/quickOpen';
import { QuickOpenModel, QuickOpenEntry } from 'vs/base/parts/quickopen/browser/quickOpenModel';
import { IMenuService } from 'vs/platform/actions/common/actions';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { QuickOpenHandler } from 'vs/workbench/browser/quickopen';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IKeybindingService } from 'vs/platform/keybinding/common/keybinding';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare const ALL_COMMANDS_PREFIX = ">";
export declare class ShowAllCommandsAction extends Action {
    private quickOpenService;
    private configurationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, quickOpenService: IQuickOpenService, configurationService: IConfigurationService);
    run(context?: any): TPromise<void>;
}
export declare class ClearCommandHistoryAction extends Action {
    private storageService;
    private configurationService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, storageService: IStorageService, configurationService: IConfigurationService);
    run(context?: any): TPromise<void>;
}
export declare class CommandsHandler extends QuickOpenHandler {
    private editorService;
    private instantiationService;
    private keybindingService;
    private menuService;
    private contextKeyService;
    private configurationService;
    private lastSearchValue;
    private commandHistoryEnabled;
    private commandsHistory;
    constructor(editorService: IWorkbenchEditorService, instantiationService: IInstantiationService, keybindingService: IKeybindingService, menuService: IMenuService, contextKeyService: IContextKeyService, configurationService: IConfigurationService);
    private updateConfiguration();
    getResults(searchValue: string): TPromise<QuickOpenModel>;
    private actionDescriptorsToEntries(actionDescriptors, searchValue);
    private editorActionsToEntries(actions, searchValue);
    private onBeforeRunCommand(commandId);
    private menuItemActionsToEntries(actions, searchValue);
    getAutoFocus(searchValue: string, context: {
        model: IModel<QuickOpenEntry>;
        quickNavigateConfiguration?: IQuickNavigateConfiguration;
    }): IAutoFocus;
    getEmptyLabel(searchString: string): string;
    onClose(canceled: boolean): void;
}
