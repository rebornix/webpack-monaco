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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/objects", "vs/base/common/arrays", "vs/base/common/event", "vs/base/common/errors", "vs/base/common/severity", "vs/base/common/paging", "vs/base/browser/ui/splitview/splitview", "vs/platform/message/common/message", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/platform/keybinding/common/keybinding", "vs/platform/contextview/browser/contextView", "vs/platform/contextkey/common/contextkey", "vs/platform/commands/common/commands", "vs/base/browser/dom", "vs/base/browser/ui/list/listPaging", "vs/platform/instantiation/common/instantiation", "vs/workbench/parts/extensions/browser/extensionsList", "../common/extensions", "../common/extensionQuery", "vs/platform/list/browser/listService", "vs/platform/extensions/common/extensions", "vs/platform/theme/common/themeService", "vs/platform/theme/common/styler", "vs/workbench/parts/views/browser/views", "vs/workbench/parts/preferences/browser/preferencesActions", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/group/common/groupService", "vs/editor/common/services/modeService", "vs/platform/telemetry/common/telemetry", "vs/platform/progress/common/progress", "vs/base/browser/ui/countBadge/countBadge"], function (require, exports, nls_1, winjs_base_1, lifecycle_1, objects_1, arrays_1, event_1, errors_1, severity_1, paging_1, splitview_1, message_1, extensionManagement_1, extensionManagementUtil_1, keybinding_1, contextView_1, contextkey_1, commands_1, dom_1, listPaging_1, instantiation_1, extensionsList_1, extensions_1, extensionQuery_1, listService_1, extensions_2, themeService_1, styler_1, views_1, preferencesActions_1, editorService_1, groupService_1, modeService_1, telemetry_1, progress_1, countBadge_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtensionsListView = (function (_super) {
        __extends(ExtensionsListView, _super);
        function ExtensionsListView(initialSize, options, messageService, keybindingService, contextMenuService, instantiationService, listService, themeService, contextKeyService, extensionService, commandService, extensionsWorkbenchService, editorService, editorInputService, tipsService, modeService, telemetryService, progressService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { ariaHeaderLabel: options.name, sizing: splitview_1.ViewSizing.Flexible, collapsed: !!options.collapsed, initialBodySize: 1 * 62 }), keybindingService, contextMenuService) || this;
            _this.options = options;
            _this.messageService = messageService;
            _this.instantiationService = instantiationService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.contextKeyService = contextKeyService;
            _this.extensionService = extensionService;
            _this.commandService = commandService;
            _this.extensionsWorkbenchService = extensionsWorkbenchService;
            _this.editorService = editorService;
            _this.editorInputService = editorInputService;
            _this.tipsService = tipsService;
            _this.modeService = modeService;
            _this.telemetryService = telemetryService;
            _this.progressService = progressService;
            _this.disposables = [];
            return _this;
        }
        ExtensionsListView.prototype.renderHeader = function (container) {
            var titleDiv = dom_1.append(container, dom_1.$('div.title'));
            dom_1.append(titleDiv, dom_1.$('span')).textContent = this.options.name;
            this.badge = new countBadge_1.CountBadge(dom_1.append(container, dom_1.$('.count-badge-wrapper')));
            this.disposables.push(styler_1.attachBadgeStyler(this.badge, this.themeService));
        };
        ExtensionsListView.prototype.renderBody = function (container) {
            this.extensionsList = dom_1.append(container, dom_1.$('.extensions-list'));
            this.messageBox = dom_1.append(container, dom_1.$('.message'));
            var delegate = new extensionsList_1.Delegate();
            var renderer = this.instantiationService.createInstance(extensionsList_1.Renderer);
            this.list = new listPaging_1.PagedList(this.extensionsList, delegate, [renderer], {
                ariaLabel: nls_1.localize('extensions', "Extensions"),
                keyboardSupport: false
            });
            this.disposables.push(styler_1.attachListStyler(this.list.widget, this.themeService));
            this.disposables.push(this.listService.register(this.list.widget));
            event_1.chain(this.list.onSelectionChange)
                .map(function (e) { return e.elements[0]; })
                .filter(function (e) { return !!e; })
                .on(this.openExtension, this, this.disposables);
            event_1.chain(this.list.onPin)
                .map(function (e) { return e.elements[0]; })
                .filter(function (e) { return !!e; })
                .on(this.pin, this, this.disposables);
        };
        ExtensionsListView.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                if (!visible) {
                    _this.setModel(new paging_1.PagedModel([]));
                }
            });
        };
        ExtensionsListView.prototype.layoutBody = function (size) {
            this.extensionsList.style.height = size + 'px';
            this.list.layout(size);
        };
        ExtensionsListView.prototype.show = function (query) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var model;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.query(query)];
                        case 1:
                            model = _a.sent();
                            this.setModel(model);
                            return [2 /*return*/, model];
                    }
                });
            });
        };
        ExtensionsListView.prototype.select = function () {
            this.list.setSelection(this.list.getFocus());
        };
        ExtensionsListView.prototype.showPrevious = function () {
            this.list.focusPrevious();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsListView.prototype.showPreviousPage = function () {
            this.list.focusPreviousPage();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsListView.prototype.showNext = function () {
            this.list.focusNext();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsListView.prototype.showNextPage = function () {
            this.list.focusNextPage();
            this.list.reveal(this.list.getFocus()[0]);
        };
        ExtensionsListView.prototype.count = function () {
            return this.list.length;
        };
        ExtensionsListView.prototype.query = function (value) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var _this = this;
                var query, options, result, local, result, local, runningExtensions_1, result, local, result, pagerPromises, text, extensionRegex, names_1, namesOptions, pagers, pager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = extensionQuery_1.Query.parse(value);
                            options = {
                                sortOrder: extensionManagement_1.SortOrder.Default
                            };
                            switch (query.sortBy) {
                                case 'installs':
                                    options = objects_1.assign(options, { sortBy: extensionManagement_1.SortBy.InstallCount });
                                    break;
                                case 'rating':
                                    options = objects_1.assign(options, { sortBy: extensionManagement_1.SortBy.WeightedRating });
                                    break;
                                case 'name':
                                    options = objects_1.assign(options, { sortBy: extensionManagement_1.SortBy.Title });
                                    break;
                            }
                            if (!(!value || ExtensionsListView.isInstalledExtensionsQuery(value))) return [3 /*break*/, 2];
                            // Show installed extensions
                            value = value ? value.replace(/@installed/g, '').replace(/@sort:(\w+)(-\w*)?/g, '').trim().toLowerCase() : '';
                            return [4 /*yield*/, this.extensionsWorkbenchService.queryLocal()];
                        case 1:
                            result = _a.sent();
                            switch (options.sortBy) {
                                case extensionManagement_1.SortBy.InstallCount:
                                    result = result.sort(function (e1, e2) { return e2.installCount - e1.installCount; });
                                    break;
                                case extensionManagement_1.SortBy.AverageRating:
                                case extensionManagement_1.SortBy.WeightedRating:
                                    result = result.sort(function (e1, e2) { return e2.rating - e1.rating; });
                                    break;
                                default:
                                    result = result.sort(function (e1, e2) { return e1.displayName.localeCompare(e2.displayName); });
                                    break;
                            }
                            if (options.sortOrder === extensionManagement_1.SortOrder.Descending) {
                                result = result.reverse();
                            }
                            result = result
                                .filter(function (e) { return e.type === extensionManagement_1.LocalExtensionType.User && e.name.toLowerCase().indexOf(value) > -1; });
                            return [2 /*return*/, new paging_1.PagedModel(result)];
                        case 2:
                            if (!/@outdated/i.test(value)) return [3 /*break*/, 4];
                            value = value.replace(/@outdated/g, '').trim().toLowerCase();
                            return [4 /*yield*/, this.extensionsWorkbenchService.queryLocal()];
                        case 3:
                            local = _a.sent();
                            result = local
                                .sort(function (e1, e2) { return e1.displayName.localeCompare(e2.displayName); })
                                .filter(function (extension) { return extension.outdated && extension.name.toLowerCase().indexOf(value) > -1; });
                            return [2 /*return*/, new paging_1.PagedModel(result)];
                        case 4:
                            if (!/@disabled/i.test(value)) return [3 /*break*/, 7];
                            value = value.replace(/@disabled/g, '').trim().toLowerCase();
                            return [4 /*yield*/, this.extensionsWorkbenchService.queryLocal()];
                        case 5:
                            local = _a.sent();
                            return [4 /*yield*/, this.extensionService.getExtensions()];
                        case 6:
                            runningExtensions_1 = _a.sent();
                            result = local
                                .sort(function (e1, e2) { return e1.displayName.localeCompare(e2.displayName); })
                                .filter(function (e) { return runningExtensions_1.every(function (r) { return !extensionManagementUtil_1.areSameExtensions(r, e); }) && e.name.toLowerCase().indexOf(value) > -1; });
                            return [2 /*return*/, new paging_1.PagedModel(result)];
                        case 7:
                            if (!/@enabled/i.test(value)) return [3 /*break*/, 9];
                            value = value ? value.replace(/@enabled/g, '').trim().toLowerCase() : '';
                            return [4 /*yield*/, this.extensionsWorkbenchService.queryLocal()];
                        case 8:
                            local = _a.sent();
                            result = local
                                .sort(function (e1, e2) { return e1.displayName.localeCompare(e2.displayName); })
                                .filter(function (e) { return e.type === extensionManagement_1.LocalExtensionType.User &&
                                !(e.disabledForWorkspace || e.disabledGlobally) &&
                                e.name.toLowerCase().indexOf(value) > -1; });
                            return [2 /*return*/, new paging_1.PagedModel(result)];
                        case 9:
                            if (ExtensionsListView.isWorkspaceRecommendedExtensionsQuery(query.value)) {
                                return [2 /*return*/, this.getWorkspaceRecommendationsModel(query, options)];
                            }
                            else if (ExtensionsListView.isKeymapsRecommendedExtensionsQuery(query.value)) {
                                return [2 /*return*/, this.getKeymapRecommendationsModel(query, options)];
                            }
                            else if (/@recommended:all/i.test(query.value)) {
                                return [2 /*return*/, this.getAllRecommendationsModel(query, options)];
                            }
                            else if (ExtensionsListView.isRecommendedExtensionsQuery(query.value)) {
                                return [2 /*return*/, this.getRecommendationsModel(query, options)];
                            }
                            pagerPromises = [];
                            text = query.value;
                            extensionRegex = /\bext:([^\s]+)\b/g;
                            if (extensionRegex.test(query.value)) {
                                names_1 = [];
                                text = query.value.replace(extensionRegex, function (m, ext) {
                                    names_1.push.apply(names_1, _this.tipsService.getRecommendationsForExtension(ext));
                                    // Get curated keywords
                                    var keywords = _this.tipsService.getKeywordsForExtension(ext);
                                    // Get mode name
                                    var modeId = _this.modeService.getModeIdByFilenameOrFirstLine("." + ext);
                                    var languageName = modeId && _this.modeService.getLanguageName(modeId);
                                    var languageTag = languageName ? " tag:\"" + languageName + "\"" : '';
                                    // Construct a rich query
                                    return "tag:\"__ext_" + ext + "\"" + keywords.map(function (tag) { return " tag:" + tag; }) + languageTag;
                                });
                                if (names_1.length) {
                                    namesOptions = objects_1.assign({}, options, { names: names_1 });
                                    pagerPromises.push(this.extensionsWorkbenchService.queryGallery(namesOptions));
                                }
                            }
                            if (text) {
                                options = objects_1.assign(options, { text: text.substr(0, 350) });
                            }
                            pagerPromises.push(this.extensionsWorkbenchService.queryGallery(options));
                            return [4 /*yield*/, winjs_base_1.TPromise.join(pagerPromises)];
                        case 10:
                            pagers = _a.sent();
                            pager = pagers.length === 2 ? paging_1.mergePagers(pagers[0], pagers[1]) : pagers[0];
                            return [2 /*return*/, new paging_1.PagedModel(pager)];
                    }
                });
            });
        };
        ExtensionsListView.prototype.getAllRecommendationsModel = function (query, options) {
            var _this = this;
            var value = query.value.replace(/@recommended:all/g, '').trim().toLowerCase();
            return this.extensionsWorkbenchService.queryLocal()
                .then(function (result) { return result.filter(function (e) { return e.type === extensionManagement_1.LocalExtensionType.User; }); })
                .then(function (local) {
                return winjs_base_1.TPromise.join([winjs_base_1.TPromise.as(_this.tipsService.getRecommendations()), _this.tipsService.getWorkspaceRecommendations()])
                    .then(function (_a) {
                    var recommendations = _a[0], workspaceRecommendations = _a[1];
                    var names = arrays_1.distinct(recommendations.concat(workspaceRecommendations))
                        .filter(function (name) { return local.every(function (ext) { return ext.publisher + "." + ext.name !== name; }); })
                        .filter(function (name) { return name.toLowerCase().indexOf(value) > -1; });
                    if (!names.length) {
                        return winjs_base_1.TPromise.as(new paging_1.PagedModel([]));
                    }
                    options.source = 'recommendations-all';
                    return _this.extensionsWorkbenchService.queryGallery(objects_1.assign(options, { names: names, pageSize: names.length }))
                        .then(function (pager) { return new paging_1.PagedModel(pager || []); });
                });
            });
        };
        ExtensionsListView.prototype.getRecommendationsModel = function (query, options) {
            var _this = this;
            var value = query.value.replace(/@recommended/g, '').trim().toLowerCase();
            return this.extensionsWorkbenchService.queryLocal()
                .then(function (result) { return result.filter(function (e) { return e.type === extensionManagement_1.LocalExtensionType.User; }); })
                .then(function (local) {
                var names = _this.tipsService.getRecommendations()
                    .filter(function (name) { return local.every(function (ext) { return ext.publisher + "." + ext.name !== name; }); })
                    .filter(function (name) { return name.toLowerCase().indexOf(value) > -1; });
                _this.telemetryService.publicLog('extensionRecommendations:open', { count: names.length });
                if (!names.length) {
                    return winjs_base_1.TPromise.as(new paging_1.PagedModel([]));
                }
                options.source = 'recommendations';
                return _this.extensionsWorkbenchService.queryGallery(objects_1.assign(options, { names: names, pageSize: names.length }))
                    .then(function (pager) { return new paging_1.PagedModel(pager || []); });
            });
        };
        ExtensionsListView.prototype.getWorkspaceRecommendationsModel = function (query, options) {
            var _this = this;
            var value = query.value.replace(/@recommended:workspace/g, '').trim().toLowerCase();
            return this.tipsService.getWorkspaceRecommendations()
                .then(function (recommendations) {
                var names = recommendations.filter(function (name) { return name.toLowerCase().indexOf(value) > -1; });
                _this.telemetryService.publicLog('extensionWorkspaceRecommendations:open', { count: names.length });
                if (!names.length) {
                    return winjs_base_1.TPromise.as(new paging_1.PagedModel([]));
                }
                options.source = 'recommendations-workspace';
                return _this.extensionsWorkbenchService.queryGallery(objects_1.assign(options, { names: names, pageSize: names.length }))
                    .then(function (pager) { return new paging_1.PagedModel(pager || []); });
            });
        };
        ExtensionsListView.prototype.getKeymapRecommendationsModel = function (query, options) {
            var value = query.value.replace(/@recommended:keymaps/g, '').trim().toLowerCase();
            var names = this.tipsService.getKeymapRecommendations()
                .filter(function (name) { return name.toLowerCase().indexOf(value) > -1; });
            this.telemetryService.publicLog('extensionKeymapRecommendations:open', { count: names.length });
            if (!names.length) {
                return winjs_base_1.TPromise.as(new paging_1.PagedModel([]));
            }
            options.source = 'recommendations-keymaps';
            return this.extensionsWorkbenchService.queryGallery(objects_1.assign(options, { names: names, pageSize: names.length }))
                .then(function (result) { return new paging_1.PagedModel(result); });
        };
        ExtensionsListView.prototype.setModel = function (model) {
            this.list.model = model;
            this.list.scrollTop = 0;
            var count = this.count();
            dom_1.toggleClass(this.extensionsList, 'hidden', count === 0);
            dom_1.toggleClass(this.messageBox, 'hidden', count > 0);
            this.badge.setCount(count);
            if (count === 0 && this.isVisible()) {
                this.messageBox.textContent = nls_1.localize('no extensions found', "No extensions found.");
            }
            else {
                this.messageBox.textContent = '';
            }
        };
        ExtensionsListView.prototype.openExtension = function (extension) {
            var _this = this;
            this.extensionsWorkbenchService.open(extension).done(null, function (err) { return _this.onError(err); });
        };
        ExtensionsListView.prototype.pin = function () {
            var activeEditor = this.editorService.getActiveEditor();
            var activeEditorInput = this.editorService.getActiveEditorInput();
            this.editorInputService.pinEditor(activeEditor.position, activeEditorInput);
        };
        ExtensionsListView.prototype.onError = function (err) {
            if (errors_1.isPromiseCanceledError(err)) {
                return;
            }
            var message = err && err.message || '';
            if (/ECONNREFUSED/.test(message)) {
                var error = errors_1.create(nls_1.localize('suggestProxyError', "Marketplace returned 'ECONNREFUSED'. Please check the 'http.proxy' setting."), {
                    actions: [
                        this.instantiationService.createInstance(preferencesActions_1.OpenGlobalSettingsAction, preferencesActions_1.OpenGlobalSettingsAction.ID, preferencesActions_1.OpenGlobalSettingsAction.LABEL),
                        message_1.CloseAction
                    ]
                });
                this.messageService.show(severity_1.default.Error, error);
                return;
            }
            this.messageService.show(severity_1.default.Error, err);
        };
        ExtensionsListView.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            _super.prototype.dispose.call(this);
        };
        ExtensionsListView.isInstalledExtensionsQuery = function (query) {
            return /@installed/i.test(query);
        };
        ExtensionsListView.isOutdatedExtensionsQuery = function (query) {
            return /@outdated/i.test(query);
        };
        ExtensionsListView.isDisabledExtensionsQuery = function (query) {
            return /@disabled/i.test(query);
        };
        ExtensionsListView.isEnabledExtensionsQuery = function (query) {
            return /@enabled/i.test(query);
        };
        ExtensionsListView.isRecommendedExtensionsQuery = function (query) {
            return /@recommended/i.test(query);
        };
        ExtensionsListView.isWorkspaceRecommendedExtensionsQuery = function (query) {
            return /@recommended:workspace/i.test(query);
        };
        ExtensionsListView.isKeymapsRecommendedExtensionsQuery = function (query) {
            return /@recommended:keymaps/i.test(query);
        };
        ExtensionsListView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, keybinding_1.IKeybindingService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, listService_1.IListService),
            __param(7, themeService_1.IThemeService),
            __param(8, contextkey_1.IContextKeyService),
            __param(9, extensions_2.IExtensionService),
            __param(10, commands_1.ICommandService),
            __param(11, extensions_1.IExtensionsWorkbenchService),
            __param(12, editorService_1.IWorkbenchEditorService),
            __param(13, groupService_1.IEditorGroupService),
            __param(14, extensionManagement_1.IExtensionTipsService),
            __param(15, modeService_1.IModeService),
            __param(16, telemetry_1.ITelemetryService),
            __param(17, progress_1.IProgressService)
        ], ExtensionsListView);
        return ExtensionsListView;
    }(views_1.CollapsibleView));
    exports.ExtensionsListView = ExtensionsListView;
    var InstalledExtensionsView = (function (_super) {
        __extends(InstalledExtensionsView, _super);
        function InstalledExtensionsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        InstalledExtensionsView.isInsalledExtensionsQuery = function (query) {
            return ExtensionsListView.isInstalledExtensionsQuery(query)
                || ExtensionsListView.isOutdatedExtensionsQuery(query)
                || ExtensionsListView.isDisabledExtensionsQuery(query)
                || ExtensionsListView.isEnabledExtensionsQuery(query);
        };
        InstalledExtensionsView.prototype.show = function (query) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var searchInstalledQuery;
                return __generator(this, function (_a) {
                    if (InstalledExtensionsView.isInsalledExtensionsQuery(query)) {
                        return [2 /*return*/, _super.prototype.show.call(this, query)];
                    }
                    searchInstalledQuery = '@installed';
                    searchInstalledQuery = query ? searchInstalledQuery + ' ' + query : searchInstalledQuery;
                    return [2 /*return*/, _super.prototype.show.call(this, searchInstalledQuery)];
                });
            });
        };
        return InstalledExtensionsView;
    }(ExtensionsListView));
    exports.InstalledExtensionsView = InstalledExtensionsView;
    var RecommendedExtensionsView = (function (_super) {
        __extends(RecommendedExtensionsView, _super);
        function RecommendedExtensionsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RecommendedExtensionsView.isRecommendedExtensionsQuery = function (query) {
            return ExtensionsListView.isRecommendedExtensionsQuery(query)
                || ExtensionsListView.isWorkspaceRecommendedExtensionsQuery(query);
        };
        RecommendedExtensionsView.prototype.show = function (query) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var searchInstalledQuery;
                return __generator(this, function (_a) {
                    if (RecommendedExtensionsView.isRecommendedExtensionsQuery(query)) {
                        return [2 /*return*/, _super.prototype.show.call(this, query)];
                    }
                    searchInstalledQuery = '@recommended:all';
                    searchInstalledQuery = query ? searchInstalledQuery + ' ' + query : searchInstalledQuery;
                    return [2 /*return*/, _super.prototype.show.call(this, searchInstalledQuery)];
                });
            });
        };
        return RecommendedExtensionsView;
    }(ExtensionsListView));
    exports.RecommendedExtensionsView = RecommendedExtensionsView;
});
//# sourceMappingURL=extensionsViews.js.map