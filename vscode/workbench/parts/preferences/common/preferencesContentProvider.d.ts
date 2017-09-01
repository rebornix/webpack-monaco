import { IModelService } from 'vs/editor/common/services/modelService';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { IPreferencesService } from 'vs/workbench/parts/preferences/common/preferences';
export declare class PreferencesContentProvider implements IWorkbenchContribution {
    private modelService;
    private textModelResolverService;
    private preferencesService;
    private modeService;
    constructor(modelService: IModelService, textModelResolverService: ITextModelService, preferencesService: IPreferencesService, modeService: IModeService);
    getId(): string;
    private start();
}
