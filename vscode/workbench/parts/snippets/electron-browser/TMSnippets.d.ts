import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { TPromise } from 'vs/base/common/winjs.base';
import { ExtensionMessageCollector } from 'vs/platform/extensions/common/extensionsRegistry';
import { ISnippetsService, ISnippet } from 'vs/workbench/parts/snippets/electron-browser/snippetsService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { LanguageIdentifier } from 'vs/editor/common/modes';
export declare class MainProcessTextMateSnippet implements IWorkbenchContribution {
    private _modeService;
    private _snippetService;
    constructor(_modeService: IModeService, _snippetService: ISnippetsService);
    getId(): string;
    private _withSnippetContribution(extensionName, extensionFolderPath, snippet, collector);
}
export declare function readAndRegisterSnippets(snippetService: ISnippetsService, languageIdentifier: LanguageIdentifier, filePath: string, extensionName?: string, collector?: ExtensionMessageCollector): TPromise<void>;
export declare function _rewriteBogousVariables(snippet: ISnippet): boolean;
