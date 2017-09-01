import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { IReplaceService } from 'vs/workbench/parts/search/common/replace';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { Match, FileMatch, FileMatchOrMatch, ISearchWorkbenchService } from 'vs/workbench/parts/search/common/searchModel';
import { IProgressRunner } from 'vs/platform/progress/common/progress';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ITextModelService, ITextModelContentProvider } from 'vs/editor/common/services/resolverService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IModel } from 'vs/editor/common/editorCommon';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IFileService } from 'vs/platform/files/common/files';
export declare class ReplacePreviewContentProvider implements ITextModelContentProvider, IWorkbenchContribution {
    private instantiationService;
    private textModelResolverService;
    constructor(instantiationService: IInstantiationService, textModelResolverService: ITextModelService);
    getId(): string;
    provideTextContent(uri: URI): TPromise<IModel>;
}
export declare class ReplaceService implements IReplaceService {
    private telemetryService;
    private fileService;
    private editorService;
    private instantiationService;
    private textModelResolverService;
    private searchWorkbenchService;
    _serviceBrand: any;
    constructor(telemetryService: ITelemetryService, fileService: IFileService, editorService: IWorkbenchEditorService, instantiationService: IInstantiationService, textModelResolverService: ITextModelService, searchWorkbenchService: ISearchWorkbenchService);
    replace(match: Match): TPromise<any>;
    replace(files: FileMatch[], progress?: IProgressRunner): TPromise<any>;
    replace(match: FileMatchOrMatch, progress?: IProgressRunner, resource?: URI): TPromise<any>;
    openReplacePreview(element: FileMatchOrMatch, preserveFocus?: boolean, sideBySide?: boolean, pinned?: boolean): TPromise<any>;
    updateReplacePreview(fileMatch: FileMatch, override?: boolean): TPromise<void>;
    private createEdit(match, text, resource?);
}
