import { TPromise } from 'vs/base/common/winjs.base';
import { ITerminalService } from 'vs/workbench/parts/execution/common/execution';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IProcessEnvironment } from 'vs/base/common/platform';
export declare class WinTerminalService implements ITerminalService {
    private _configurationService;
    _serviceBrand: any;
    private static CMD;
    constructor(_configurationService: IConfigurationService);
    openTerminal(cwd?: string): void;
    runInTerminal(title: string, dir: string, args: string[], envVars: IProcessEnvironment): TPromise<void>;
    private spawnTerminal(spawner, configuration, command, cwd?);
    private getSpawnType(exec);
}
export declare class MacTerminalService implements ITerminalService {
    private _configurationService;
    _serviceBrand: any;
    private static OSASCRIPT;
    constructor(_configurationService: IConfigurationService);
    openTerminal(cwd?: string): void;
    runInTerminal(title: string, dir: string, args: string[], envVars: IProcessEnvironment): TPromise<void>;
    private spawnTerminal(spawner, configuration, cwd?);
}
export declare class LinuxTerminalService implements ITerminalService {
    private _configurationService;
    _serviceBrand: any;
    private static WAIT_MESSAGE;
    constructor(_configurationService: IConfigurationService);
    openTerminal(cwd?: string): void;
    runInTerminal(title: string, dir: string, args: string[], envVars: IProcessEnvironment): TPromise<void>;
    private spawnTerminal(spawner, configuration, cwd?);
}
