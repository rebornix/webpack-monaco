/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/platform/instantiation/common/instantiation"], function (require, exports, nls_1, instantiation_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EXTENSION_IDENTIFIER_PATTERN = '^([a-z0-9A-Z][a-z0-9\-A-Z]*)\\.([a-z0-9A-Z][a-z0-9\-A-Z]*)$';
    exports.EXTENSION_IDENTIFIER_REGEX = new RegExp(exports.EXTENSION_IDENTIFIER_PATTERN);
    var LocalExtensionType;
    (function (LocalExtensionType) {
        LocalExtensionType[LocalExtensionType["System"] = 0] = "System";
        LocalExtensionType[LocalExtensionType["User"] = 1] = "User";
    })(LocalExtensionType = exports.LocalExtensionType || (exports.LocalExtensionType = {}));
    exports.IExtensionManagementService = instantiation_1.createDecorator('extensionManagementService');
    exports.IExtensionGalleryService = instantiation_1.createDecorator('extensionGalleryService');
    var SortBy;
    (function (SortBy) {
        SortBy[SortBy["NoneOrRelevance"] = 0] = "NoneOrRelevance";
        SortBy[SortBy["LastUpdatedDate"] = 1] = "LastUpdatedDate";
        SortBy[SortBy["Title"] = 2] = "Title";
        SortBy[SortBy["PublisherName"] = 3] = "PublisherName";
        SortBy[SortBy["InstallCount"] = 4] = "InstallCount";
        SortBy[SortBy["PublishedDate"] = 5] = "PublishedDate";
        SortBy[SortBy["AverageRating"] = 6] = "AverageRating";
        SortBy[SortBy["WeightedRating"] = 12] = "WeightedRating";
    })(SortBy = exports.SortBy || (exports.SortBy = {}));
    var SortOrder;
    (function (SortOrder) {
        SortOrder[SortOrder["Default"] = 0] = "Default";
        SortOrder[SortOrder["Ascending"] = 1] = "Ascending";
        SortOrder[SortOrder["Descending"] = 2] = "Descending";
    })(SortOrder = exports.SortOrder || (exports.SortOrder = {}));
    var StatisticType;
    (function (StatisticType) {
        StatisticType["Uninstall"] = "uninstall";
    })(StatisticType = exports.StatisticType || (exports.StatisticType = {}));
    exports.IExtensionEnablementService = instantiation_1.createDecorator('extensionEnablementService');
    exports.IExtensionTipsService = instantiation_1.createDecorator('extensionTipsService');
    exports.ExtensionsLabel = nls_1.localize('extensions', "Extensions");
    exports.ExtensionsChannelId = 'extensions';
    exports.PreferencesLabel = nls_1.localize('preferences', "Preferences");
});
//# sourceMappingURL=extensionManagement.js.map