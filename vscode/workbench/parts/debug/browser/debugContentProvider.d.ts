import uri from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IModel } from 'vs/editor/common/editorCommon';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { ITextModelService, ITextModelContentProvider } from 'vs/editor/common/services/resolverService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IDebugService } from 'vs/workbench/parts/debug/common/debug';
export declare class DebugContentProvider implements IWorkbenchContribution, ITextModelContentProvider {
    private debugService;
    private modelService;
    private modeService;
    constructor(textModelResolverService: ITextModelService, debugService: IDebugService, modelService: IModelService, modeService: IModeService);
    getId(): string;
    provideTextContent(resource: uri): TPromise<IModel>;
}
