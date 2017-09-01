import * as platform from 'vs/base/common/platform';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
import { IChoiceService } from 'vs/platform/message/common/message';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITerminalConfiguration, ITerminalConfigHelper, ITerminalFont, IShellLaunchConfig } from 'vs/workbench/parts/terminal/common/terminal';
/**
 * Encapsulates terminal configuration logic, the primary purpose of this file is so that platform
 * specific test cases can be written.
 */
export declare class TerminalConfigHelper implements ITerminalConfigHelper {
    private _platform;
    private _configurationService;
    private _workspaceConfigurationService;
    private _choiceService;
    private _storageService;
    panelContainer: HTMLElement;
    private _charMeasureElement;
    private _lastFontMeasurement;
    constructor(_platform: platform.Platform, _configurationService: IConfigurationService, _workspaceConfigurationService: IWorkspaceConfigurationService, _choiceService: IChoiceService, _storageService: IStorageService);
    readonly config: ITerminalConfiguration;
    private _measureFont(fontFamily, fontSize, lineHeight);
    /**
     * Gets the font information based on the terminal.integrated.fontFamily
     * terminal.integrated.fontSize, terminal.integrated.lineHeight configuration properties
     */
    getFont(): ITerminalFont;
    setWorkspaceShellAllowed(isAllowed: boolean): void;
    mergeDefaultShellPathAndArgs(shell: IShellLaunchConfig): void;
    private _toInteger(source, minimum?);
}
