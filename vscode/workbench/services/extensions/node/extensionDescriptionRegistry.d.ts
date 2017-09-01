import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
export declare class ExtensionDescriptionRegistry {
    private _extensionsMap;
    private _extensionsArr;
    private _activationMap;
    constructor(extensionDescriptions: IExtensionDescription[]);
    containsActivationEvent(activationEvent: string): boolean;
    getExtensionDescriptionsForActivationEvent(activationEvent: string): IExtensionDescription[];
    getAllExtensionDescriptions(): IExtensionDescription[];
    getExtensionDescription(extensionId: string): IExtensionDescription;
}
