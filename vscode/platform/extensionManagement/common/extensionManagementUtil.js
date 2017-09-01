/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/storage/common/storage"], function (require, exports, extensionManagement_1, storage_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function areSameExtensions(a, b) {
        if (a.id === b.id) {
            return true;
        }
        return adoptToGalleryExtensionId(a.id) === adoptToGalleryExtensionId(b.id);
    }
    exports.areSameExtensions = areSameExtensions;
    function getGalleryExtensionId(publisher, name) {
        return publisher + "." + name.toLocaleLowerCase();
    }
    exports.getGalleryExtensionId = getGalleryExtensionId;
    function getLocalExtensionIdFromGallery(extension, version) {
        return getLocalExtensionId(extension.id, version);
    }
    exports.getLocalExtensionIdFromGallery = getLocalExtensionIdFromGallery;
    function getLocalExtensionIdFromManifest(manifest) {
        return getLocalExtensionId(getGalleryExtensionId(manifest.publisher, manifest.name), manifest.version);
    }
    exports.getLocalExtensionIdFromManifest = getLocalExtensionIdFromManifest;
    function getGalleryExtensionIdFromLocal(local) {
        return getGalleryExtensionId(local.manifest.publisher, local.manifest.name);
    }
    exports.getGalleryExtensionIdFromLocal = getGalleryExtensionIdFromLocal;
    function getIdAndVersionFromLocalExtensionId(localExtensionId) {
        var matches = /^([^.]+\..+)-(\d+\.\d+\.\d+)$/.exec(localExtensionId);
        if (matches && matches[1] && matches[2]) {
            return { id: adoptToGalleryExtensionId(matches[1]), version: matches[2] };
        }
        return {
            id: adoptToGalleryExtensionId(localExtensionId),
            version: null
        };
    }
    exports.getIdAndVersionFromLocalExtensionId = getIdAndVersionFromLocalExtensionId;
    function adoptToGalleryExtensionId(id) {
        return id.replace(extensionManagement_1.EXTENSION_IDENTIFIER_REGEX, function (match, publisher, name) { return getGalleryExtensionId(publisher, name); });
    }
    exports.adoptToGalleryExtensionId = adoptToGalleryExtensionId;
    function getLocalExtensionId(id, version) {
        return id + "-" + version;
    }
    function getLocalExtensionTelemetryData(extension) {
        return {
            id: getGalleryExtensionIdFromLocal(extension),
            name: extension.manifest.name,
            galleryId: null,
            publisherId: extension.metadata ? extension.metadata.publisherId : null,
            publisherName: extension.manifest.publisher,
            publisherDisplayName: extension.metadata ? extension.metadata.publisherDisplayName : null,
            dependencies: extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length > 0
        };
    }
    exports.getLocalExtensionTelemetryData = getLocalExtensionTelemetryData;
    function getGalleryExtensionTelemetryData(extension) {
        return __assign({ id: extension.id, name: extension.name, galleryId: extension.uuid, publisherId: extension.publisherId, publisherName: extension.publisher, publisherDisplayName: extension.publisherDisplayName, dependencies: extension.properties.dependencies.length > 0 }, extension.telemetryData);
    }
    exports.getGalleryExtensionTelemetryData = getGalleryExtensionTelemetryData;
    var BetterMergeCheckKey = 'extensions/bettermergecheck';
    exports.BetterMergeDisabledNowKey = 'extensions/bettermergedisablednow';
    exports.BetterMergeId = 'pprice.better-merge';
    /**
     * Globally disabled extensions, taking care of disabling obsolete extensions.
     */
    function getGloballyDisabledExtensions(extensionEnablementService, storageService, installedExtensions) {
        var globallyDisabled = extensionEnablementService.getGloballyDisabledExtensions();
        if (!storageService.getBoolean(BetterMergeCheckKey, storage_1.StorageScope.GLOBAL, false)) {
            storageService.store(BetterMergeCheckKey, true);
            if (globallyDisabled.indexOf(exports.BetterMergeId) === -1 && installedExtensions.some(function (d) { return d.id === exports.BetterMergeId; })) {
                globallyDisabled.push(exports.BetterMergeId);
                extensionEnablementService.setEnablement(exports.BetterMergeId, false);
                storageService.store(exports.BetterMergeDisabledNowKey, true);
            }
        }
        return globallyDisabled;
    }
    exports.getGloballyDisabledExtensions = getGloballyDisabledExtensions;
});
//# sourceMappingURL=extensionManagementUtil.js.map