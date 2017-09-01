import { ILocalExtension, IGalleryExtension, IExtensionManifest, IExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IStorageService } from 'vs/platform/storage/common/storage';
export declare function areSameExtensions(a: {
    id: string;
}, b: {
    id: string;
}): boolean;
export declare function getGalleryExtensionId(publisher: string, name: string): string;
export declare function getLocalExtensionIdFromGallery(extension: IGalleryExtension, version: string): string;
export declare function getLocalExtensionIdFromManifest(manifest: IExtensionManifest): string;
export declare function getGalleryExtensionIdFromLocal(local: ILocalExtension): string;
export declare function getIdAndVersionFromLocalExtensionId(localExtensionId: string): {
    id: string;
    version: string;
};
export declare function adoptToGalleryExtensionId(id: string): string;
export declare function getLocalExtensionTelemetryData(extension: ILocalExtension): any;
export declare function getGalleryExtensionTelemetryData(extension: IGalleryExtension): any;
export declare const BetterMergeDisabledNowKey = "extensions/bettermergedisablednow";
export declare const BetterMergeId = "pprice.better-merge";
/**
 * Globally disabled extensions, taking care of disabling obsolete extensions.
 */
export declare function getGloballyDisabledExtensions(extensionEnablementService: IExtensionEnablementService, storageService: IStorageService, installedExtensions: {
    id: string;
}[]): string[];
