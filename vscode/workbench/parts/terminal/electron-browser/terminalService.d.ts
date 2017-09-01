import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IPanelService } from 'vs/workbench/services/panel/common/panelService';
import { IPartService } from 'vs/workbench/services/part/common/partService';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { ITerminalInstance, ITerminalService, IShellLaunchConfig, ITerminalConfigHelper } from 'vs/workbench/parts/terminal/common/terminal';
import { TerminalService as AbstractTerminalService } from 'vs/workbench/parts/terminal/common/terminalService';
import { TPromise } from 'vs/base/common/winjs.base';
import { IChoiceService } from 'vs/platform/message/common/message';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IWindowService } from 'vs/platform/windows/common/windows';
export declare class TerminalService extends AbstractTerminalService implements ITerminalService {
    private _instantiationService;
    private _windowService;
    private _quickOpenService;
    private _configurationEditingService;
    private _choiceService;
    private _storageService;
    private _configHelper;
    readonly configHelper: ITerminalConfigHelper;
    constructor(_contextKeyService: IContextKeyService, _configurationService: IConfigurationService, _panelService: IPanelService, _partService: IPartService, _lifecycleService: ILifecycleService, _instantiationService: IInstantiationService, _windowService: IWindowService, _quickOpenService: IQuickOpenService, _configurationEditingService: IConfigurationEditingService, _choiceService: IChoiceService, _storageService: IStorageService);
    createInstance(shell?: IShellLaunchConfig, wasNewTerminalAction?: boolean): ITerminalInstance;
    focusFindWidget(): TPromise<void>;
    hideFindWidget(): void;
    showNextFindTermFindWidget(): void;
    showPreviousFindTermFindWidget(): void;
    private _suggestShellChange(wasNewTerminalAction?);
    selectDefaultWindowsShell(): TPromise<string>;
    private _detectWindowsShells();
    private _validateShellPaths(label, potentialPaths);
    getActiveOrCreateInstance(wasNewTerminalAction?: boolean): ITerminalInstance;
    protected _showTerminalCloseConfirmation(): boolean;
    setContainers(panelContainer: HTMLElement, terminalContainer: HTMLElement): void;
}
