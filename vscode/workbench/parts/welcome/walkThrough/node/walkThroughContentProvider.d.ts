import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { ITextModelService, ITextModelContentProvider } from 'vs/editor/common/services/resolverService';
import { IModelService } from 'vs/editor/common/services/modelService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IModel } from 'vs/editor/common/editorCommon';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
export declare class WalkThroughContentProvider implements ITextModelContentProvider, IWorkbenchContribution {
    private textModelResolverService;
    private textFileService;
    private modeService;
    private modelService;
    constructor(textModelResolverService: ITextModelService, textFileService: ITextFileService, modeService: IModeService, modelService: IModelService);
    provideTextContent(resource: URI): TPromise<IModel>;
    getId(): string;
}
export declare class WalkThroughSnippetContentProvider implements ITextModelContentProvider, IWorkbenchContribution {
    private textModelResolverService;
    private textFileService;
    private modeService;
    private modelService;
    constructor(textModelResolverService: ITextModelService, textFileService: ITextFileService, modeService: IModeService, modelService: IModelService);
    provideTextContent(resource: URI): TPromise<IModel>;
    getId(): string;
}
