import { TPromise } from 'vs/base/common/winjs.base';
import { Disposable } from 'vs/base/common/lifecycle';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { IFileService } from 'vs/platform/files/common/files';
import { ServiceIdentifier } from 'vs/platform/instantiation/common/instantiation';
import { ResolvedKeybindingItem } from 'vs/platform/keybinding/common/resolvedKeybindingItem';
export declare const IKeybindingEditingService: {
    (...args: any[]): void;
    type: IKeybindingEditingService;
};
export interface IKeybindingEditingService {
    _serviceBrand: ServiceIdentifier<any>;
    editKeybinding(key: string, keybindingItem: ResolvedKeybindingItem): TPromise<void>;
    removeKeybinding(keybindingItem: ResolvedKeybindingItem): TPromise<void>;
    resetKeybinding(keybindingItem: ResolvedKeybindingItem): TPromise<void>;
}
export declare class KeybindingsEditingService extends Disposable implements IKeybindingEditingService {
    private textModelResolverService;
    private textFileService;
    private fileService;
    private configurationService;
    private environmentService;
    _serviceBrand: any;
    private queue;
    private resource;
    constructor(textModelResolverService: ITextModelService, textFileService: ITextFileService, fileService: IFileService, configurationService: IConfigurationService, environmentService: IEnvironmentService);
    editKeybinding(key: string, keybindingItem: ResolvedKeybindingItem): TPromise<void>;
    resetKeybinding(keybindingItem: ResolvedKeybindingItem): TPromise<void>;
    removeKeybinding(keybindingItem: ResolvedKeybindingItem): TPromise<void>;
    private doEditKeybinding(key, keybindingItem);
    private doRemoveKeybinding(keybindingItem);
    private doResetKeybinding(keybindingItem);
    private save();
    private updateUserKeybinding(newKey, keybindingItem, model);
    private updateDefaultKeybinding(newKey, keybindingItem, model);
    private removeUserKeybinding(keybindingItem, model);
    private removeDefaultKeybinding(keybindingItem, model);
    private removeUnassignedDefaultKeybinding(keybindingItem, model);
    private findUserKeybindingEntryIndex(keybindingItem, userKeybindingEntries);
    private findUnassignedDefaultKeybindingEntryIndex(keybindingItem, userKeybindingEntries);
    private asObject(key, command, when, negate);
    private applyEditsToBuffer(edit, model);
    private resolveModelReference();
    private resolveAndValidate();
    private parse(model);
    private getEmptyContent(EOL);
}
