import { TPromise } from 'vs/base/common/winjs.base';
import { IFileService } from 'vs/platform/files/common/files';
import { IConfigurationResolverService } from 'vs/workbench/services/configurationResolver/common/configurationResolver';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import * as TaskConfig from './taskConfiguration';
export interface DetectorResult {
    config: TaskConfig.ExternalTaskRunnerConfiguration;
    stdout: string[];
    stderr: string[];
}
export declare class ProcessRunnerDetector {
    private static Version;
    private static SupportedRunners;
    private static TaskMatchers;
    static supports(runner: string): boolean;
    private static detectorConfig(runner);
    private static DefaultProblemMatchers;
    private fileService;
    private contextService;
    private configurationResolverService;
    private taskConfiguration;
    private _stderr;
    private _stdout;
    private _cwd;
    constructor(fileService: IFileService, contextService: IWorkspaceContextService, configurationResolverService: IConfigurationResolverService, config?: TaskConfig.ExternalTaskRunnerConfiguration);
    readonly stderr: string[];
    readonly stdout: string[];
    detect(list?: boolean, detectSpecific?: string): TPromise<DetectorResult>;
    private resolveCommandOptions(options);
    private tryDetectGulp(list);
    private tryDetectGrunt(list);
    private tryDetectJake(list);
    private runDetection(process, command, isShellCommand, matcher, problemMatchers, list);
    private createTaskDescriptions(tasks, problemMatchers, list);
    private testBuild(taskInfo, taskName, index);
    private testTest(taskInfo, taskName, index);
}
