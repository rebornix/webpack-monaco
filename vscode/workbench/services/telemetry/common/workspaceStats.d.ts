import { IFileService } from 'vs/platform/files/common/files';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IWindowConfiguration } from 'vs/platform/windows/common/windows';
export declare function getDomainsOfRemotes(text: string, whitelist: string[]): string[];
export declare function getRemotes(text: string): string[];
export declare function getHashedRemotes(text: string): string[];
export declare class WorkspaceStats {
    private fileService;
    private contextService;
    private telemetryService;
    private environmentService;
    constructor(fileService: IFileService, contextService: IWorkspaceContextService, telemetryService: ITelemetryService, environmentService: IEnvironmentService);
    private searchArray(arr, regEx);
    private getWorkspaceTags(configuration);
    private findFolders(configuration);
    private findFolder({filesToOpen, filesToCreate, filesToDiff});
    private parentURI(uri);
    reportWorkspaceTags(configuration: IWindowConfiguration): void;
    private reportRemoteDomains(workspaceUris);
    private reportRemotes(workspaceUris);
    private reportAzureNode(workspaceUris, tags);
    private reportAzureJava(workspaceUris, tags);
    private reportAzure(uris);
    reportCloudStats(): void;
}
