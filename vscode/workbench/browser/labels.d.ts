import uri from 'vs/base/common/uri';
import { IconLabel, IIconLabelOptions, IIconLabelCreationOptions } from 'vs/base/browser/ui/iconLabel/iconLabel';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IEditorInput } from 'vs/platform/editor/common/editor';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { FileKind } from 'vs/platform/files/common/files';
export interface IEditorLabel {
    name: string;
    description?: string;
    resource?: uri;
}
export interface IResourceLabelOptions extends IIconLabelOptions {
    fileKind?: FileKind;
}
export declare class ResourceLabel extends IconLabel {
    private extensionService;
    protected contextService: IWorkspaceContextService;
    private configurationService;
    private modeService;
    private modelService;
    protected environmentService: IEnvironmentService;
    private toDispose;
    private label;
    private options;
    private computedIconClasses;
    private lastKnownConfiguredLangId;
    constructor(container: HTMLElement, options: IIconLabelCreationOptions, extensionService: IExtensionService, contextService: IWorkspaceContextService, configurationService: IConfigurationService, modeService: IModeService, modelService: IModelService, environmentService: IEnvironmentService);
    private registerListeners();
    setLabel(label: IEditorLabel, options?: IResourceLabelOptions): void;
    private hasResourceChanged(label, options);
    clear(): void;
    private render(clearIconCache);
    dispose(): void;
}
export declare class EditorLabel extends ResourceLabel {
    setEditor(editor: IEditorInput, options?: IResourceLabelOptions): void;
}
export interface IFileLabelOptions extends IResourceLabelOptions {
    hideLabel?: boolean;
    hidePath?: boolean;
    root?: uri;
}
export declare class FileLabel extends ResourceLabel {
    private untitledEditorService;
    constructor(container: HTMLElement, options: IIconLabelCreationOptions, extensionService: IExtensionService, contextService: IWorkspaceContextService, configurationService: IConfigurationService, modeService: IModeService, modelService: IModelService, environmentService: IEnvironmentService, untitledEditorService: IUntitledEditorService);
    setFile(resource: uri, options?: IFileLabelOptions): void;
}
export declare function getIconClasses(modelService: IModelService, modeService: IModeService, resource: uri, fileKind?: FileKind): string[];
