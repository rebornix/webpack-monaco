/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/arrays", "vs/base/common/objects", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/async", "vs/base/common/types", "vs/base/common/platform", "vs/base/common/strings", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/workbench/browser/quickopen", "vs/workbench/parts/search/browser/openFileHandler", "vs/workbench/parts/search/browser/openSymbolHandler", "vs/platform/message/common/message", "vs/platform/instantiation/common/instantiation", "vs/platform/telemetry/common/telemetry", "vs/platform/configuration/common/configuration"], function (require, exports, arrays, objects, winjs_base_1, nls, async_1, types, platform_1, strings, quickOpenModel_1, quickopen_1, openFileHandler_1, openSymbolHandler, message_1, instantiation_1, telemetry_1, configuration_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var objects_assign = objects.assign;
    // OpenSymbolHandler is used from an extension and must be in the main bundle file so it can load
    exports.OpenSymbolHandler = openSymbolHandler.OpenSymbolHandler;
    var OpenAnythingHandler = (function (_super) {
        __extends(OpenAnythingHandler, _super);
        function OpenAnythingHandler(messageService, instantiationService, configurationService, telemetryService) {
            var _this = _super.call(this) || this;
            _this.messageService = messageService;
            _this.configurationService = configurationService;
            _this.telemetryService = telemetryService;
            _this.scorerCache = Object.create(null);
            _this.searchDelayer = new async_1.ThrottledDelayer(OpenAnythingHandler.FILE_SEARCH_DELAY);
            _this.openSymbolHandler = instantiationService.createInstance(exports.OpenSymbolHandler);
            _this.openFileHandler = instantiationService.createInstance(openFileHandler_1.OpenFileHandler);
            _this.updateHandlers(_this.configurationService.getConfiguration());
            _this.registerListeners();
            return _this;
        }
        OpenAnythingHandler.prototype.registerListeners = function () {
            var _this = this;
            this.configurationService.onDidUpdateConfiguration(function (e) { return _this.updateHandlers(_this.configurationService.getConfiguration()); });
        };
        OpenAnythingHandler.prototype.updateHandlers = function (configuration) {
            this.includeSymbols = configuration && configuration.search && configuration.search.quickOpen && configuration.search.quickOpen.includeSymbols;
            // Files
            this.openFileHandler.setOptions({
                forceUseIcons: this.includeSymbols // only need icons for file results if we mix with symbol results
            });
            // Symbols
            this.openSymbolHandler.setOptions({
                skipDelay: true,
                skipLocalSymbols: true,
                skipSorting: true // we sort combined with file results
            });
        };
        OpenAnythingHandler.prototype.getResults = function (searchValue) {
            var _this = this;
            var startTime = Date.now();
            this.cancelPendingSearch();
            this.isClosed = false; // Treat this call as the handler being in use
            // Massage search value
            searchValue = searchValue.replace(/ /g, ''); // get rid of all whitespace
            if (platform_1.isWindows) {
                searchValue = searchValue.replace(/\//g, '\\'); // Help Windows users to search for paths when using slash
            }
            var searchWithRange = this.extractRange(searchValue); // Find a suitable range from the pattern looking for ":" and "#"
            if (searchWithRange) {
                searchValue = searchWithRange.search; // ignore range portion in query
            }
            if (!searchValue) {
                return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel()); // Respond directly to empty search
            }
            // The throttler needs a factory for its promises
            var promiseFactory = function () {
                var resultPromises = [];
                // File Results
                var filePromise = _this.openFileHandler.getResults(searchValue, OpenAnythingHandler.MAX_DISPLAYED_RESULTS);
                resultPromises.push(filePromise);
                // Symbol Results (unless disabled or a range or absolute path is specified)
                if (_this.includeSymbols && !searchWithRange) {
                    resultPromises.push(_this.openSymbolHandler.getResults(searchValue));
                }
                // Join and sort unified
                _this.pendingSearch = winjs_base_1.TPromise.join(resultPromises).then(function (results) {
                    _this.pendingSearch = null;
                    // If the quick open widget has been closed meanwhile, ignore the result
                    if (_this.isClosed) {
                        return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel());
                    }
                    // Combine results.
                    var mergedResults = [].concat.apply([], results.map(function (r) { return r.entries; }));
                    // Sort
                    var unsortedResultTime = Date.now();
                    var normalizedSearchValue = strings.stripWildcards(searchValue).toLowerCase();
                    var compare = function (elementA, elementB) { return quickOpenModel_1.QuickOpenEntry.compareByScore(elementA, elementB, searchValue, normalizedSearchValue, _this.scorerCache); };
                    var viewResults = arrays.top(mergedResults, compare, OpenAnythingHandler.MAX_DISPLAYED_RESULTS);
                    var sortedResultTime = Date.now();
                    // Apply range and highlights to file entries
                    viewResults.forEach(function (entry) {
                        if (entry instanceof openFileHandler_1.FileEntry) {
                            entry.setRange(searchWithRange ? searchWithRange.range : null);
                            var _a = quickOpenModel_1.QuickOpenEntry.highlight(entry, searchValue, true /* fuzzy highlight */), labelHighlights = _a.labelHighlights, descriptionHighlights = _a.descriptionHighlights;
                            entry.setHighlights(labelHighlights, descriptionHighlights);
                        }
                    });
                    var duration = new Date().getTime() - startTime;
                    filePromise.then(function (fileModel) {
                        var data = _this.createTimerEventData(startTime, {
                            searchLength: searchValue.length,
                            unsortedResultTime: unsortedResultTime,
                            sortedResultTime: sortedResultTime,
                            resultCount: mergedResults.length,
                            symbols: { fromCache: false },
                            files: fileModel.stats,
                        });
                        _this.telemetryService.publicLog('openAnything', objects.assign(data, { duration: duration }));
                    });
                    return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel(viewResults));
                }, function (error) {
                    _this.pendingSearch = null;
                    _this.messageService.show(message_1.Severity.Error, error);
                    return null;
                });
                return _this.pendingSearch;
            };
            // Trigger through delayer to prevent accumulation while the user is typing (except when expecting results to come from cache)
            return this.hasShortResponseTime() ? promiseFactory() : this.searchDelayer.trigger(promiseFactory, this.includeSymbols ? OpenAnythingHandler.SYMBOL_SEARCH_DELAY : OpenAnythingHandler.FILE_SEARCH_DELAY);
        };
        OpenAnythingHandler.prototype.hasShortResponseTime = function () {
            if (!this.includeSymbols) {
                return this.openFileHandler.hasShortResponseTime();
            }
            return this.openFileHandler.hasShortResponseTime() && this.openSymbolHandler.hasShortResponseTime();
        };
        OpenAnythingHandler.prototype.extractRange = function (value) {
            if (!value) {
                return null;
            }
            var range = null;
            // Find Line/Column number from search value using RegExp
            var patternMatch = OpenAnythingHandler.LINE_COLON_PATTERN.exec(value);
            if (patternMatch && patternMatch.length > 1) {
                var startLineNumber = parseInt(patternMatch[1], 10);
                // Line Number
                if (types.isNumber(startLineNumber)) {
                    range = {
                        startLineNumber: startLineNumber,
                        startColumn: 1,
                        endLineNumber: startLineNumber,
                        endColumn: 1
                    };
                    // Column Number
                    if (patternMatch.length > 3) {
                        var startColumn = parseInt(patternMatch[3], 10);
                        if (types.isNumber(startColumn)) {
                            range = {
                                startLineNumber: range.startLineNumber,
                                startColumn: startColumn,
                                endLineNumber: range.endLineNumber,
                                endColumn: startColumn
                            };
                        }
                    }
                }
                else if (patternMatch[1] === '') {
                    range = {
                        startLineNumber: 1,
                        startColumn: 1,
                        endLineNumber: 1,
                        endColumn: 1
                    };
                }
            }
            if (range) {
                return {
                    search: value.substr(0, patternMatch.index),
                    range: range
                };
            }
            return null;
        };
        OpenAnythingHandler.prototype.getGroupLabel = function () {
            return this.includeSymbols ? nls.localize('fileAndTypeResults', "file and symbol results") : nls.localize('fileResults', "file results");
        };
        OpenAnythingHandler.prototype.getAutoFocus = function (searchValue) {
            return {
                autoFocusFirstEntry: true
            };
        };
        OpenAnythingHandler.prototype.onOpen = function () {
            this.openSymbolHandler.onOpen();
            this.openFileHandler.onOpen();
        };
        OpenAnythingHandler.prototype.onClose = function (canceled) {
            this.isClosed = true;
            // Cancel any pending search
            this.cancelPendingSearch();
            // Clear Cache
            this.scorerCache = Object.create(null);
            // Propagate
            this.openSymbolHandler.onClose(canceled);
            this.openFileHandler.onClose(canceled);
        };
        OpenAnythingHandler.prototype.cancelPendingSearch = function () {
            if (this.pendingSearch) {
                this.pendingSearch.cancel();
                this.pendingSearch = null;
            }
        };
        OpenAnythingHandler.prototype.createTimerEventData = function (startTime, telemetry) {
            return {
                searchLength: telemetry.searchLength,
                unsortedResultDuration: telemetry.unsortedResultTime - startTime,
                sortedResultDuration: telemetry.sortedResultTime - startTime,
                resultCount: telemetry.resultCount,
                symbols: telemetry.symbols,
                files: telemetry.files && this.createFileEventData(startTime, telemetry.files)
            };
        };
        OpenAnythingHandler.prototype.createFileEventData = function (startTime, stats) {
            var cached = stats;
            var uncached = stats;
            return objects_assign({
                fromCache: stats.fromCache,
                unsortedResultDuration: stats.unsortedResultTime && stats.unsortedResultTime - startTime,
                sortedResultDuration: stats.sortedResultTime && stats.sortedResultTime - startTime,
                resultCount: stats.resultCount
            }, stats.fromCache ? {
                cacheLookupStartDuration: cached.cacheLookupStartTime - startTime,
                cacheFilterStartDuration: cached.cacheFilterStartTime - startTime,
                cacheLookupResultDuration: cached.cacheLookupResultTime - startTime,
                cacheEntryCount: cached.cacheEntryCount,
                joined: cached.joined && this.createFileEventData(startTime, cached.joined)
            } : {
                traversal: uncached.traversal,
                errors: uncached.errors,
                fileWalkStartDuration: uncached.fileWalkStartTime - startTime,
                fileWalkResultDuration: uncached.fileWalkResultTime - startTime,
                directoriesWalked: uncached.directoriesWalked,
                filesWalked: uncached.filesWalked,
                cmdForkStartDuration: uncached.cmdForkStartTime && uncached.cmdForkStartTime - startTime,
                cmdForkResultDuration: uncached.cmdForkResultTime && uncached.cmdForkResultTime - startTime,
                cmdResultCount: uncached.cmdResultCount
            });
        };
        OpenAnythingHandler.LINE_COLON_PATTERN = /[#|:|\(](\d*)([#|:|,](\d*))?\)?$/;
        OpenAnythingHandler.FILE_SEARCH_DELAY = 300;
        OpenAnythingHandler.SYMBOL_SEARCH_DELAY = 500; // go easier on those symbols!
        OpenAnythingHandler.MAX_DISPLAYED_RESULTS = 512;
        OpenAnythingHandler = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, telemetry_1.ITelemetryService)
        ], OpenAnythingHandler);
        return OpenAnythingHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.OpenAnythingHandler = OpenAnythingHandler;
});
//# sourceMappingURL=openAnythingHandler.js.map