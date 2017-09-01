import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { ISnippetsService } from 'vs/workbench/parts/snippets/electron-browser/snippetsService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IModeService } from 'vs/editor/common/services/modeService';
export declare class SnippetsTracker implements IWorkbenchContribution {
    private readonly _snippetFolder;
    private readonly _toDispose;
    constructor(modeService: IModeService, snippetService: ISnippetsService, environmentService: IEnvironmentService, extensionService: IExtensionService);
    getId(): string;
    dispose(): void;
}
