var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/objects", "vs/base/common/scorer", "vs/base/common/strings", "vs/base/parts/ipc/common/ipc", "vs/base/parts/ipc/node/ipc.cp", "vs/platform/search/common/search", "vs/workbench/services/untitled/common/untitledEditorService", "vs/editor/common/services/modelService", "vs/platform/workspace/common/workspace", "vs/platform/configuration/common/configuration", "./searchIpc", "vs/platform/environment/common/environment", "vs/base/common/map"], function (require, exports, winjs_base_1, uri_1, objects, scorer, strings, ipc_1, ipc_cp_1, search_1, untitledEditorService_1, modelService_1, workspace_1, configuration_1, searchIpc_1, environment_1, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SearchService = (function () {
        function SearchService(modelService, untitledEditorService, environmentService, contextService, configurationService) {
            this.modelService = modelService;
            this.untitledEditorService = untitledEditorService;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.searchProvider = [];
            this.diskSearch = new DiskSearch(!environmentService.isBuilt || environmentService.verbose);
            this.registerSearchResultProvider(this.diskSearch);
        }
        SearchService.prototype.registerSearchResultProvider = function (provider) {
            var _this = this;
            this.searchProvider.push(provider);
            return {
                dispose: function () {
                    var idx = _this.searchProvider.indexOf(provider);
                    if (idx >= 0) {
                        _this.searchProvider.splice(idx, 1);
                    }
                }
            };
        };
        SearchService.prototype.extendQuery = function (query) {
            var configuration = this.configurationService.getConfiguration();
            // Configuration: Encoding
            if (!query.fileEncoding) {
                var fileEncoding = configuration && configuration.files && configuration.files.encoding;
                query.fileEncoding = fileEncoding;
            }
            // Configuration: File Excludes
            if (!query.disregardExcludeSettings) {
                var fileExcludes = configuration && configuration.files && configuration.files.exclude;
                if (fileExcludes) {
                    if (!query.excludePattern) {
                        query.excludePattern = fileExcludes;
                    }
                    else {
                        objects.mixin(query.excludePattern, fileExcludes, false /* no overwrite */);
                    }
                }
            }
        };
        SearchService.prototype.search = function (query) {
            var _this = this;
            var combinedPromise;
            return new winjs_base_1.PPromise(function (onComplete, onError, onProgress) {
                // Get local results from dirty/untitled
                var localResults = _this.getLocalResults(query);
                // Allow caller to register progress callback
                process.nextTick(function () { return localResults.values().filter(function (res) { return !!res; }).forEach(onProgress); });
                var providerPromises = _this.searchProvider.map(function (provider) { return winjs_base_1.TPromise.wrap(provider.search(query)).then(function (e) { return e; }, function (err) {
                    // TODO@joh
                    // single provider fail. fail all?
                    onError(err);
                }, function (progress) {
                    if (progress.resource) {
                        // Match
                        if (!localResults.has(progress.resource)) {
                            onProgress(progress);
                        }
                    }
                    else {
                        // Progress
                        onProgress(progress);
                    }
                }); });
                combinedPromise = winjs_base_1.TPromise.join(providerPromises).then(function (values) {
                    var result = {
                        limitHit: false,
                        results: [],
                        stats: undefined
                    };
                    // TODO@joh
                    // sorting, disjunct results
                    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                        var value = values_1[_i];
                        if (!value) {
                            continue;
                        }
                        // TODO@joh individual stats/limit
                        result.stats = value.stats || result.stats;
                        result.limitHit = value.limitHit || result.limitHit;
                        for (var _a = 0, _b = value.results; _a < _b.length; _a++) {
                            var match = _b[_a];
                            if (!localResults.has(match.resource)) {
                                result.results.push(match);
                            }
                        }
                    }
                    return result;
                }).then(onComplete, onError);
            }, function () { return combinedPromise && combinedPromise.cancel(); });
        };
        SearchService.prototype.getLocalResults = function (query) {
            var _this = this;
            var localResults = new map_1.ResourceMap();
            if (query.type === search_1.QueryType.Text) {
                var models = this.modelService.getModels();
                models.forEach(function (model) {
                    var resource = model.uri;
                    if (!resource) {
                        return;
                    }
                    // Support untitled files
                    if (resource.scheme === 'untitled') {
                        if (!_this.untitledEditorService.exists(resource)) {
                            return;
                        }
                    }
                    else if (resource.scheme !== 'file') {
                        return;
                    }
                    if (!_this.matches(resource, query)) {
                        return; // respect user filters
                    }
                    // Use editor API to find matches
                    var matches = model.findMatches(query.contentPattern.pattern, false, query.contentPattern.isRegExp, query.contentPattern.isCaseSensitive, query.contentPattern.isWordMatch ? query.contentPattern.wordSeparators : null, false, query.maxResults);
                    if (matches.length) {
                        var fileMatch_1 = new search_1.FileMatch(resource);
                        localResults.set(resource, fileMatch_1);
                        matches.forEach(function (match) {
                            fileMatch_1.lineMatches.push(new search_1.LineMatch(model.getLineContent(match.range.startLineNumber), match.range.startLineNumber - 1, [[match.range.startColumn - 1, match.range.endColumn - match.range.startColumn]]));
                        });
                    }
                    else {
                        localResults.set(resource, null);
                    }
                });
            }
            return localResults;
        };
        SearchService.prototype.matches = function (resource, query) {
            // file pattern
            if (query.filePattern) {
                if (resource.scheme !== 'file') {
                    return false; // if we match on file pattern, we have to ignore non file resources
                }
                if (!scorer.matches(resource.fsPath, strings.stripWildcards(query.filePattern).toLowerCase())) {
                    return false;
                }
            }
            // includes
            if (query.includePattern) {
                if (resource.scheme !== 'file') {
                    return false; // if we match on file patterns, we have to ignore non file resources
                }
            }
            return search_1.pathIncludedInQuery(query, resource.fsPath);
        };
        SearchService.prototype.clearCache = function (cacheKey) {
            return this.diskSearch.clearCache(cacheKey);
        };
        SearchService = __decorate([
            __param(0, modelService_1.IModelService),
            __param(1, untitledEditorService_1.IUntitledEditorService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, configuration_1.IConfigurationService)
        ], SearchService);
        return SearchService;
    }());
    exports.SearchService = SearchService;
    var DiskSearch = (function () {
        function DiskSearch(verboseLogging, timeout) {
            if (timeout === void 0) { timeout = 60 * 60 * 1000; }
            var client = new ipc_cp_1.Client(uri_1.default.parse(require.toUrl('bootstrap')).fsPath, {
                serverName: 'Search',
                timeout: timeout,
                args: ['--type=searchService'],
                // See https://github.com/Microsoft/vscode/issues/27665
                // Pass in fresh execArgv to the forked process such that it doesn't inherit them from `process.execArgv`.
                // e.g. Launching the extension host process with `--inspect-brk=xxx` and then forking a process from the extension host
                // results in the forked process inheriting `--inspect-brk=xxx`.
                freshExecArgv: true,
                env: {
                    AMD_ENTRYPOINT: 'vs/workbench/services/search/node/searchApp',
                    PIPE_LOGGING: 'true',
                    VERBOSE_LOGGING: verboseLogging
                }
            });
            var channel = ipc_1.getNextTickChannel(client.getChannel('search'));
            this.raw = new searchIpc_1.SearchChannelClient(channel);
        }
        DiskSearch.prototype.search = function (query) {
            var request;
            var rawSearch = {
                folderQueries: query.folderQueries ? query.folderQueries.map(function (q) {
                    return {
                        excludePattern: q.excludePattern,
                        includePattern: q.includePattern,
                        fileEncoding: q.fileEncoding,
                        folder: q.folder.fsPath
                    };
                }) : [],
                extraFiles: query.extraFileResources ? query.extraFileResources.map(function (r) { return r.fsPath; }) : [],
                filePattern: query.filePattern,
                excludePattern: query.excludePattern,
                includePattern: query.includePattern,
                maxResults: query.maxResults,
                sortByScore: query.sortByScore,
                cacheKey: query.cacheKey,
                useRipgrep: query.useRipgrep,
                disregardIgnoreFiles: query.disregardIgnoreFiles
            };
            if (query.type === search_1.QueryType.Text) {
                rawSearch.contentPattern = query.contentPattern;
            }
            if (query.type === search_1.QueryType.File) {
                request = this.raw.fileSearch(rawSearch);
            }
            else {
                request = this.raw.textSearch(rawSearch);
            }
            return DiskSearch.collectResults(request);
        };
        DiskSearch.collectResults = function (request) {
            var _this = this;
            var result = [];
            return new winjs_base_1.PPromise(function (c, e, p) {
                request.done(function (complete) {
                    c({
                        limitHit: complete.limitHit,
                        results: result,
                        stats: complete.stats
                    });
                }, e, function (data) {
                    // Matches
                    if (Array.isArray(data)) {
                        var fileMatches = data.map(function (d) { return _this.createFileMatch(d); });
                        result = result.concat(fileMatches);
                        fileMatches.forEach(p);
                    }
                    else if (data.path) {
                        var fileMatch = _this.createFileMatch(data);
                        result.push(fileMatch);
                        p(fileMatch);
                    }
                    else {
                        p(data);
                    }
                });
            }, function () { return request.cancel(); });
        };
        DiskSearch.createFileMatch = function (data) {
            var fileMatch = new search_1.FileMatch(uri_1.default.file(data.path));
            if (data.lineMatches) {
                for (var j = 0; j < data.lineMatches.length; j++) {
                    fileMatch.lineMatches.push(new search_1.LineMatch(data.lineMatches[j].preview, data.lineMatches[j].lineNumber, data.lineMatches[j].offsetAndLengths));
                }
            }
            return fileMatch;
        };
        DiskSearch.prototype.clearCache = function (cacheKey) {
            return this.raw.clearCache(cacheKey);
        };
        return DiskSearch;
    }());
    exports.DiskSearch = DiskSearch;
});
//# sourceMappingURL=searchService.js.map