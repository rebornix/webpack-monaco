import { TPromise } from 'vs/base/common/winjs.base';
import { ITerminalService } from 'vs/workbench/parts/terminal/common/terminal';
import { ITerminalService as IExternalTerminalService } from 'vs/workbench/parts/execution/common/execution';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare class TerminalSupport {
    private static integratedTerminalInstance;
    private static terminalDisposedListener;
    static runInTerminal(terminalService: ITerminalService, nativeTerminalService: IExternalTerminalService, configurationService: IConfigurationService, args: DebugProtocol.RunInTerminalRequestArguments, response: DebugProtocol.RunInTerminalResponse): TPromise<void>;
    private static prepareCommand(args, configurationService);
}
