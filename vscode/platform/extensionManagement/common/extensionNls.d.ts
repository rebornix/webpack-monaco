import { IExtensionManifest } from 'vs/platform/extensionManagement/common/extensionManagement';
export interface ITranslations {
    [key: string]: string;
}
export declare function localizeManifest(manifest: IExtensionManifest, translations: ITranslations): IExtensionManifest;
