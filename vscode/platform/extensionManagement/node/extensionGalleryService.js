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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "vs/nls", "os", "path", "vs/base/common/winjs.base", "vs/base/common/uuid", "vs/base/common/arrays", "vs/base/common/errors", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/base/common/objects", "vs/platform/request/node/request", "vs/platform/telemetry/common/telemetry", "vs/base/node/request", "vs/platform/configuration/common/configuration", "vs/platform/node/package", "vs/platform/node/product", "vs/platform/extensions/node/extensionValidator", "vs/platform/environment/common/environment"], function (require, exports, nls_1, os_1, path, winjs_base_1, uuid, arrays_1, errors_1, extensionManagement_1, extensionManagementUtil_1, objects_1, request_1, telemetry_1, request_2, configuration_1, package_1, product_1, extensionValidator_1, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Flags;
    (function (Flags) {
        Flags[Flags["None"] = 0] = "None";
        Flags[Flags["IncludeVersions"] = 1] = "IncludeVersions";
        Flags[Flags["IncludeFiles"] = 2] = "IncludeFiles";
        Flags[Flags["IncludeCategoryAndTags"] = 4] = "IncludeCategoryAndTags";
        Flags[Flags["IncludeSharedAccounts"] = 8] = "IncludeSharedAccounts";
        Flags[Flags["IncludeVersionProperties"] = 16] = "IncludeVersionProperties";
        Flags[Flags["ExcludeNonValidated"] = 32] = "ExcludeNonValidated";
        Flags[Flags["IncludeInstallationTargets"] = 64] = "IncludeInstallationTargets";
        Flags[Flags["IncludeAssetUri"] = 128] = "IncludeAssetUri";
        Flags[Flags["IncludeStatistics"] = 256] = "IncludeStatistics";
        Flags[Flags["IncludeLatestVersionOnly"] = 512] = "IncludeLatestVersionOnly";
        Flags[Flags["Unpublished"] = 4096] = "Unpublished";
    })(Flags || (Flags = {}));
    function flagsToString() {
        var flags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            flags[_i] = arguments[_i];
        }
        return String(flags.reduce(function (r, f) { return r | f; }, 0));
    }
    var FilterType;
    (function (FilterType) {
        FilterType[FilterType["Tag"] = 1] = "Tag";
        FilterType[FilterType["ExtensionId"] = 4] = "ExtensionId";
        FilterType[FilterType["Category"] = 5] = "Category";
        FilterType[FilterType["ExtensionName"] = 7] = "ExtensionName";
        FilterType[FilterType["Target"] = 8] = "Target";
        FilterType[FilterType["Featured"] = 9] = "Featured";
        FilterType[FilterType["SearchText"] = 10] = "SearchText";
        FilterType[FilterType["ExcludeWithFlags"] = 12] = "ExcludeWithFlags";
    })(FilterType || (FilterType = {}));
    var AssetType = {
        Icon: 'Microsoft.VisualStudio.Services.Icons.Default',
        Details: 'Microsoft.VisualStudio.Services.Content.Details',
        Changelog: 'Microsoft.VisualStudio.Services.Content.Changelog',
        Manifest: 'Microsoft.VisualStudio.Code.Manifest',
        VSIX: 'Microsoft.VisualStudio.Services.VSIXPackage',
        License: 'Microsoft.VisualStudio.Services.Content.License',
    };
    var PropertyType = {
        Dependency: 'Microsoft.VisualStudio.Code.ExtensionDependencies',
        Engine: 'Microsoft.VisualStudio.Code.Engine'
    };
    var DefaultPageSize = 10;
    var DefaultQueryState = {
        pageNumber: 1,
        pageSize: DefaultPageSize,
        sortBy: extensionManagement_1.SortBy.NoneOrRelevance,
        sortOrder: extensionManagement_1.SortOrder.Default,
        flags: Flags.None,
        criteria: [],
        assetTypes: []
    };
    var Query = (function () {
        function Query(state) {
            if (state === void 0) { state = DefaultQueryState; }
            this.state = state;
        }
        Object.defineProperty(Query.prototype, "pageNumber", {
            get: function () { return this.state.pageNumber; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "pageSize", {
            get: function () { return this.state.pageSize; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "sortBy", {
            get: function () { return this.state.sortBy; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "sortOrder", {
            get: function () { return this.state.sortOrder; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "flags", {
            get: function () { return this.state.flags; },
            enumerable: true,
            configurable: true
        });
        Query.prototype.withPage = function (pageNumber, pageSize) {
            if (pageSize === void 0) { pageSize = this.state.pageSize; }
            return new Query(objects_1.assign({}, this.state, { pageNumber: pageNumber, pageSize: pageSize }));
        };
        Query.prototype.withFilter = function (filterType) {
            var values = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                values[_i - 1] = arguments[_i];
            }
            var criteria = this.state.criteria.concat(values.map(function (value) { return ({ filterType: filterType, value: value }); }));
            return new Query(objects_1.assign({}, this.state, { criteria: criteria }));
        };
        Query.prototype.withSortBy = function (sortBy) {
            return new Query(objects_1.assign({}, this.state, { sortBy: sortBy }));
        };
        Query.prototype.withSortOrder = function (sortOrder) {
            return new Query(objects_1.assign({}, this.state, { sortOrder: sortOrder }));
        };
        Query.prototype.withFlags = function () {
            var flags = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                flags[_i] = arguments[_i];
            }
            return new Query(objects_1.assign({}, this.state, { flags: flags.reduce(function (r, f) { return r | f; }, 0) }));
        };
        Query.prototype.withAssetTypes = function () {
            var assetTypes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                assetTypes[_i] = arguments[_i];
            }
            return new Query(objects_1.assign({}, this.state, { assetTypes: assetTypes }));
        };
        Object.defineProperty(Query.prototype, "raw", {
            get: function () {
                var _a = this.state, criteria = _a.criteria, pageNumber = _a.pageNumber, pageSize = _a.pageSize, sortBy = _a.sortBy, sortOrder = _a.sortOrder, flags = _a.flags, assetTypes = _a.assetTypes;
                var filters = [{ criteria: criteria, pageNumber: pageNumber, pageSize: pageSize, sortBy: sortBy, sortOrder: sortOrder }];
                return { filters: filters, assetTypes: assetTypes, flags: flags };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Query.prototype, "searchText", {
            get: function () {
                var criterium = this.state.criteria.filter(function (criterium) { return criterium.filterType === FilterType.SearchText; })[0];
                return criterium ? criterium.value : '';
            },
            enumerable: true,
            configurable: true
        });
        return Query;
    }());
    function getStatistic(statistics, name) {
        var result = (statistics || []).filter(function (s) { return s.statisticName === name; })[0];
        return result ? result.value : 0;
    }
    function getVersionAsset(version, type) {
        var result = version.files.filter(function (f) { return f.assetType === type; })[0];
        if (!result) {
            if (type === AssetType.Icon) {
                var uri = require.toUrl('./media/defaultIcon.png');
                return { uri: uri, fallbackUri: uri };
            }
            return null;
        }
        if (type === AssetType.VSIX) {
            return {
                uri: version.fallbackAssetUri + "/" + type + "?redirect=true&install=true",
                fallbackUri: version.fallbackAssetUri + "/" + type + "?install=true"
            };
        }
        return {
            uri: version.assetUri + "/" + type,
            fallbackUri: version.fallbackAssetUri + "/" + type
        };
    }
    function getDependencies(version) {
        var values = version.properties ? version.properties.filter(function (p) { return p.key === PropertyType.Dependency; }) : [];
        var value = values.length > 0 && values[0].value;
        return value ? value.split(',').map(function (v) { return extensionManagementUtil_1.adoptToGalleryExtensionId(v); }) : [];
    }
    function getEngine(version) {
        var values = version.properties ? version.properties.filter(function (p) { return p.key === PropertyType.Engine; }) : [];
        return (values.length > 0 && values[0].value) || '';
    }
    function toExtension(galleryExtension, extensionsGalleryUrl, index, query, querySource) {
        var version = galleryExtension.versions[0];
        var assets = {
            manifest: getVersionAsset(version, AssetType.Manifest),
            readme: getVersionAsset(version, AssetType.Details),
            changelog: getVersionAsset(version, AssetType.Changelog),
            download: getVersionAsset(version, AssetType.VSIX),
            icon: getVersionAsset(version, AssetType.Icon),
            license: getVersionAsset(version, AssetType.License)
        };
        return {
            uuid: galleryExtension.extensionId,
            id: extensionManagementUtil_1.getGalleryExtensionId(galleryExtension.publisher.publisherName, galleryExtension.extensionName),
            name: galleryExtension.extensionName,
            version: version.version,
            date: version.lastUpdated,
            displayName: galleryExtension.displayName,
            publisherId: galleryExtension.publisher.publisherId,
            publisher: galleryExtension.publisher.publisherName,
            publisherDisplayName: galleryExtension.publisher.displayName,
            description: galleryExtension.shortDescription || '',
            installCount: getStatistic(galleryExtension.statistics, 'install'),
            rating: getStatistic(galleryExtension.statistics, 'averagerating'),
            ratingCount: getStatistic(galleryExtension.statistics, 'ratingcount'),
            assets: assets,
            properties: {
                dependencies: getDependencies(version),
                engine: getEngine(version)
            },
            telemetryData: {
                index: ((query.pageNumber - 1) * query.pageSize) + index,
                searchText: query.searchText,
                querySource: querySource
            }
        };
    }
    var ExtensionGalleryService = (function () {
        function ExtensionGalleryService(requestService, environmentService, telemetryService, configurationService) {
            this.requestService = requestService;
            this.environmentService = environmentService;
            this.telemetryService = telemetryService;
            this.configurationService = configurationService;
            var config = product_1.default.extensionsGallery;
            this.extensionsGalleryUrl = config && config.serviceUrl;
            this.commonHTTPHeaders = {
                'X-Market-Client-Id': "VSCode " + package_1.default.version,
                'User-Agent': "VSCode " + package_1.default.version,
                'X-Market-User-Id': this.environmentService.machineUUID
            };
        }
        ExtensionGalleryService.prototype.api = function (path) {
            if (path === void 0) { path = ''; }
            return "" + this.extensionsGalleryUrl + path;
        };
        ExtensionGalleryService.prototype.isEnabled = function () {
            return !!this.extensionsGalleryUrl;
        };
        ExtensionGalleryService.prototype.query = function (options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            if (!this.isEnabled()) {
                return winjs_base_1.TPromise.wrapError(new Error('No extension gallery service configured.'));
            }
            var type = options.names ? 'ids' : (options.text ? 'text' : 'all');
            var text = options.text || '';
            var pageSize = objects_1.getOrDefault(options, function (o) { return o.pageSize; }, 50);
            this.telemetryService.publicLog('galleryService:query', { type: type, text: text });
            var query = new Query()
                .withFlags(Flags.IncludeLatestVersionOnly, Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, pageSize)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Icon, AssetType.License, AssetType.Details, AssetType.Manifest, AssetType.VSIX, AssetType.Changelog);
            if (text) {
                // Use category filter instead of "category:themes"
                text = text.replace(/\bcategory:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, function (_, quotedCategory, category) {
                    query = query.withFilter(FilterType.Category, category || quotedCategory);
                    return '';
                });
                // Use tag filter instead of "tag:debuggers"
                text = text.replace(/\btag:("([^"]*)"|([^"]\S*))(\s+|\b|$)/g, function (_, quotedTag, tag) {
                    query = query.withFilter(FilterType.Tag, tag || quotedTag);
                    return '';
                });
                text = text.trim();
                if (text) {
                    query = query.withFilter(FilterType.SearchText, text);
                }
                query = query.withSortBy(extensionManagement_1.SortBy.NoneOrRelevance);
            }
            else if (options.ids) {
                query = query.withFilter.apply(query, [FilterType.ExtensionId].concat(options.ids));
            }
            else if (options.names) {
                query = query.withFilter.apply(query, [FilterType.ExtensionName].concat(options.names));
            }
            else {
                query = query.withSortBy(extensionManagement_1.SortBy.InstallCount);
            }
            if (typeof options.sortBy === 'number') {
                query = query.withSortBy(options.sortBy);
            }
            if (typeof options.sortOrder === 'number') {
                query = query.withSortOrder(options.sortOrder);
            }
            return this.queryGallery(query).then(function (_a) {
                var galleryExtensions = _a.galleryExtensions, total = _a.total;
                var extensions = galleryExtensions.map(function (e, index) { return toExtension(e, _this.extensionsGalleryUrl, index, query, options.source); });
                var pageSize = query.pageSize;
                var getPage = function (pageIndex) {
                    var nextPageQuery = query.withPage(pageIndex + 1);
                    return _this.queryGallery(nextPageQuery)
                        .then(function (_a) {
                        var galleryExtensions = _a.galleryExtensions;
                        return galleryExtensions.map(function (e, index) { return toExtension(e, _this.extensionsGalleryUrl, index, nextPageQuery, options.source); });
                    });
                };
                return { firstPage: extensions, total: total, pageSize: pageSize, getPage: getPage };
            });
        };
        ExtensionGalleryService.prototype.queryGallery = function (query) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var commonHeaders, data, headers, context, result, r, galleryExtensions, resultCount, total;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.commonHTTPHeaders];
                        case 1:
                            commonHeaders = _a.sent();
                            data = JSON.stringify(query.raw);
                            headers = objects_1.assign({}, commonHeaders, {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json;api-version=3.0-preview.1',
                                'Accept-Encoding': 'gzip',
                                'Content-Length': data.length
                            });
                            return [4 /*yield*/, this.requestService.request({
                                    type: 'POST',
                                    url: this.api('/extensionquery'),
                                    data: data,
                                    headers: headers
                                })];
                        case 2:
                            context = _a.sent();
                            if (context.res.statusCode >= 400 && context.res.statusCode < 500) {
                                return [2 /*return*/, { galleryExtensions: [], total: 0 }];
                            }
                            return [4 /*yield*/, request_2.asJson(context)];
                        case 3:
                            result = _a.sent();
                            r = result.results[0];
                            galleryExtensions = r.extensions;
                            resultCount = r.resultMetadata && r.resultMetadata.filter(function (m) { return m.metadataType === 'ResultCount'; })[0];
                            total = resultCount && resultCount.metadataItems.filter(function (i) { return i.name === 'TotalCount'; })[0].count || 0;
                            return [2 /*return*/, { galleryExtensions: galleryExtensions, total: total }];
                    }
                });
            });
        };
        ExtensionGalleryService.prototype.reportStatistic = function (publisher, name, version, type) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var headers, _a, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.isEnabled()) {
                                return [2 /*return*/];
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 4, , 5]);
                            _a = [{}];
                            return [4 /*yield*/, this.commonHTTPHeaders];
                        case 2:
                            headers = __assign.apply(void 0, _a.concat([_b.sent(), { Accept: '*/*;api-version=4.0-preview.1' }]));
                            return [4 /*yield*/, this.requestService.request({
                                    type: 'POST',
                                    url: this.api("/publishers/" + publisher + "/extensions/" + name + "/" + version + "/stats?statType=" + type),
                                    headers: headers
                                })];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _b.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        ExtensionGalleryService.prototype.download = function (extension) {
            var _this = this;
            return this.loadCompatibleVersion(extension).then(function (extension) {
                var zipPath = path.join(os_1.tmpdir(), uuid.generateUuid());
                var data = extensionManagementUtil_1.getGalleryExtensionTelemetryData(extension);
                var startTime = new Date().getTime();
                var log = function (duration) { return _this.telemetryService.publicLog('galleryService:downloadVSIX', objects_1.assign(data, { duration: duration })); };
                return _this.getAsset(extension.assets.download)
                    .then(function (context) { return request_2.download(zipPath, context); })
                    .then(function () { return log(new Date().getTime() - startTime); })
                    .then(function () { return zipPath; });
            });
        };
        ExtensionGalleryService.prototype.getReadme = function (extension) {
            return this.getAsset(extension.assets.readme)
                .then(request_2.asText);
        };
        ExtensionGalleryService.prototype.getManifest = function (extension) {
            return this.getAsset(extension.assets.manifest)
                .then(request_2.asText)
                .then(JSON.parse);
        };
        ExtensionGalleryService.prototype.getChangelog = function (extension) {
            return this.getAsset(extension.assets.changelog)
                .then(request_2.asText);
        };
        ExtensionGalleryService.prototype.getAllDependencies = function (extension) {
            var _this = this;
            return this.loadCompatibleVersion(extension)
                .then(function (compatible) { return _this.getDependenciesReccursively(compatible.properties.dependencies, [], extension); });
        };
        ExtensionGalleryService.prototype.loadCompatibleVersion = function (extension) {
            var _this = this;
            if (extension.properties.engine && this.isEngineValid(extension.properties.engine)) {
                return winjs_base_1.TPromise.wrap(extension);
            }
            var query = new Query()
                .withFlags(Flags.IncludeVersions, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, 1)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Manifest, AssetType.VSIX)
                .withFilter(FilterType.ExtensionId, extension.uuid);
            return this.queryGallery(query).then(function (_a) {
                var galleryExtensions = _a.galleryExtensions;
                var rawExtension = galleryExtensions[0];
                if (!rawExtension) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('notFound', "Extension not found")));
                }
                return _this.getLastValidExtensionVersion(rawExtension, rawExtension.versions)
                    .then(function (rawVersion) {
                    extension.properties.dependencies = getDependencies(rawVersion);
                    extension.properties.engine = getEngine(rawVersion);
                    extension.assets.download = getVersionAsset(rawVersion, AssetType.VSIX);
                    extension.version = rawVersion.version;
                    return extension;
                });
            });
        };
        ExtensionGalleryService.prototype.loadDependencies = function (extensionNames) {
            var _this = this;
            if (!extensionNames || extensionNames.length === 0) {
                return winjs_base_1.TPromise.as([]);
            }
            var query = (_a = new Query()
                .withFlags(Flags.IncludeLatestVersionOnly, Flags.IncludeAssetUri, Flags.IncludeStatistics, Flags.IncludeFiles, Flags.IncludeVersionProperties)
                .withPage(1, extensionNames.length)
                .withFilter(FilterType.Target, 'Microsoft.VisualStudio.Code')
                .withFilter(FilterType.ExcludeWithFlags, flagsToString(Flags.Unpublished))
                .withAssetTypes(AssetType.Icon, AssetType.License, AssetType.Details, AssetType.Manifest, AssetType.VSIX)).withFilter.apply(_a, [FilterType.ExtensionName].concat(extensionNames));
            return this.queryGallery(query).then(function (result) {
                var dependencies = [];
                var ids = [];
                for (var index = 0; index < result.galleryExtensions.length; index++) {
                    var rawExtension = result.galleryExtensions[index];
                    if (ids.indexOf(rawExtension.extensionId) === -1) {
                        dependencies.push(toExtension(rawExtension, _this.extensionsGalleryUrl, index, query));
                        ids.push(rawExtension.extensionId);
                    }
                }
                return dependencies;
            });
            var _a;
        };
        ExtensionGalleryService.prototype.getDependenciesReccursively = function (toGet, result, root) {
            var _this = this;
            if (!toGet || !toGet.length) {
                return winjs_base_1.TPromise.wrap(result);
            }
            if (toGet.indexOf(root.publisher + "." + root.name) !== -1 && result.indexOf(root) === -1) {
                result.push(root);
            }
            toGet = result.length ? toGet.filter(function (e) { return !ExtensionGalleryService.hasExtensionByName(result, e); }) : toGet;
            if (!toGet.length) {
                return winjs_base_1.TPromise.wrap(result);
            }
            return this.loadDependencies(toGet)
                .then(function (loadedDependencies) {
                var dependenciesSet = new Set();
                for (var _i = 0, loadedDependencies_1 = loadedDependencies; _i < loadedDependencies_1.length; _i++) {
                    var dep = loadedDependencies_1[_i];
                    if (dep.properties.dependencies) {
                        dep.properties.dependencies.forEach(function (d) { return dependenciesSet.add(d); });
                    }
                }
                result = arrays_1.distinct(result.concat(loadedDependencies), function (d) { return d.uuid; });
                var dependencies = [];
                dependenciesSet.forEach(function (d) { return !ExtensionGalleryService.hasExtensionByName(result, d) && dependencies.push(d); });
                return _this.getDependenciesReccursively(dependencies, result, root);
            });
        };
        ExtensionGalleryService.prototype.getAsset = function (asset, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var baseOptions = { type: 'GET' };
            var headers = objects_1.assign({}, this.commonHTTPHeaders, options.headers || {});
            options = objects_1.assign({}, options, baseOptions, { headers: headers });
            var url = asset.uri;
            var fallbackUrl = asset.fallbackUri;
            var firstOptions = objects_1.assign({}, options, { url: url });
            return this.requestService.request(firstOptions)
                .then(function (context) {
                if (context.res.statusCode === 200) {
                    return winjs_base_1.TPromise.as(context);
                }
                return request_2.asText(context)
                    .then(function (message) { return winjs_base_1.TPromise.wrapError(new Error("Expected 200, got back " + context.res.statusCode + " instead.\n\n" + message)); });
            })
                .then(null, function (err) {
                if (errors_1.isPromiseCanceledError(err)) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                var message = errors_1.getErrorMessage(err);
                _this.telemetryService.publicLog('galleryService:requestError', { url: url, cdn: true, message: message });
                _this.telemetryService.publicLog('galleryService:cdnFallback', { url: url, message: message });
                var fallbackOptions = objects_1.assign({}, options, { url: fallbackUrl });
                return _this.requestService.request(fallbackOptions).then(null, function (err) {
                    if (errors_1.isPromiseCanceledError(err)) {
                        return winjs_base_1.TPromise.wrapError(err);
                    }
                    var message = errors_1.getErrorMessage(err);
                    _this.telemetryService.publicLog('galleryService:requestError', { url: fallbackUrl, cdn: false, message: message });
                    return winjs_base_1.TPromise.wrapError(err);
                });
            });
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersion = function (extension, versions) {
            var version = this.getLastValidExtensionVersionFromProperties(extension, versions);
            if (version) {
                return version;
            }
            return this.getLastValidExtensionVersionReccursively(extension, versions);
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersionFromProperties = function (extension, versions) {
            for (var _i = 0, versions_1 = versions; _i < versions_1.length; _i++) {
                var version = versions_1[_i];
                var engine = getEngine(version);
                if (!engine) {
                    return null;
                }
                if (this.isEngineValid(engine)) {
                    return winjs_base_1.TPromise.wrap(version);
                }
            }
            return null;
        };
        ExtensionGalleryService.prototype.getLastValidExtensionVersionReccursively = function (extension, versions) {
            var _this = this;
            if (!versions.length) {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('noCompatible', "Couldn't find a compatible version of {0} with this version of Code.", extension.displayName || extension.extensionName)));
            }
            var version = versions[0];
            var asset = getVersionAsset(version, AssetType.Manifest);
            var headers = { 'Accept-Encoding': 'gzip' };
            return this.getAsset(asset, { headers: headers })
                .then(function (context) { return request_2.asJson(context); })
                .then(function (manifest) {
                var engine = manifest.engines.vscode;
                if (!_this.isEngineValid(engine)) {
                    return _this.getLastValidExtensionVersionReccursively(extension, versions.slice(1));
                }
                version.properties = version.properties || [];
                version.properties.push({ key: PropertyType.Engine, value: manifest.engines.vscode });
                return version;
            });
        };
        ExtensionGalleryService.prototype.isEngineValid = function (engine) {
            // TODO@joao: discuss with alex '*' doesn't seem to be a valid engine version
            return engine === '*' || extensionValidator_1.isVersionValid(package_1.default.version, engine);
        };
        ExtensionGalleryService.hasExtensionByName = function (extensions, name) {
            for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
                var extension = extensions_1[_i];
                if (extension.publisher + "." + extension.name === name) {
                    return true;
                }
            }
            return false;
        };
        ExtensionGalleryService = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, environment_1.IEnvironmentService),
            __param(2, telemetry_1.ITelemetryService),
            __param(3, configuration_1.IConfigurationService)
        ], ExtensionGalleryService);
        return ExtensionGalleryService;
    }());
    exports.ExtensionGalleryService = ExtensionGalleryService;
});
//# sourceMappingURL=extensionGalleryService.js.map