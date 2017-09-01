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
define(["require", "exports", "vs/nls", "vs/base/common/async", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/common/lifecycle", "vs/base/browser/builder", "vs/base/common/event", "vs/base/browser/event", "vs/base/browser/ui/actionbar/actionbar", "vs/base/browser/keyboardEvent", "vs/workbench/services/viewlet/browser/viewlet", "vs/base/browser/dom", "vs/platform/telemetry/common/telemetry", "vs/platform/instantiation/common/instantiation", "vs/platform/extensions/common/extensions", "../common/extensions", "vs/workbench/parts/extensions/browser/extensionsActions", "vs/platform/extensionManagement/common/extensionManagement", "vs/workbench/parts/extensions/electron-browser/extensionsActions", "vs/workbench/parts/extensions/common/extensionsInput", "./extensionsViews", "vs/workbench/parts/preferences/browser/preferencesActions", "vs/platform/progress/common/progress", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/group/common/groupService", "vs/platform/message/common/message", "vs/base/common/severity", "vs/workbench/services/activity/common/activityBarService", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/platform/configuration/common/configuration", "vs/workbench/parts/views/browser/viewsRegistry", "vs/workbench/parts/views/browser/views", "vs/platform/storage/common/storage", "vs/platform/workspace/common/workspace", "vs/platform/contextkey/common/contextkey", "vs/platform/contextview/browser/contextView", "vs/css!./media/extensionsViewlet"], function (require, exports, nls_1, async_1, winjs_base_1, errors_1, lifecycle_1, builder_1, event_1, event_2, actionbar_1, keyboardEvent_1, viewlet_1, dom_1, telemetry_1, instantiation_1, extensions_1, extensions_2, extensionsActions_1, extensionManagement_1, extensionsActions_2, extensionsInput_1, extensionsViews_1, preferencesActions_1, progress_1, editorService_1, groupService_1, message_1, severity_1, activityBarService_1, themeService_1, colorRegistry_1, configuration_1, viewsRegistry_1, views_1, storage_1, workspace_1, contextkey_1, contextView_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtensionsViewletVisibleContext = new contextkey_1.RawContextKey('extensionsViewletVisible', false);
    var SearchExtensionsContext = new contextkey_1.RawContextKey('searchExtensions', false);
    var SearchInstalledExtensionsContext = new contextkey_1.RawContextKey('searchInstalledExtensions', false);
    var SearchRecommendedExtensionsContext = new contextkey_1.RawContextKey('searchRecommendedExtensions', false);
    var ExtensionsViewlet = (function (_super) {
        __extends(ExtensionsViewlet, _super);
        function ExtensionsViewlet(telemetryService, progressService, instantiationService, editorService, editorInputService, extensionsWorkbenchService, extensionManagementService, messageService, viewletService, themeService, configurationService, storageService, contextService, contextKeyService, contextMenuService, extensionService) {
            var _this = _super.call(this, extensions_2.VIEWLET_ID, viewsRegistry_1.ViewLocation.Extensions, extensions_2.VIEWLET_ID + ".state", true, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) || this;
            _this.progressService = progressService;
            _this.editorService = editorService;
            _this.editorInputService = editorInputService;
            _this.extensionsWorkbenchService = extensionsWorkbenchService;
            _this.extensionManagementService = extensionManagementService;
            _this.messageService = messageService;
            _this.viewletService = viewletService;
            _this.configurationService = configurationService;
            _this.disposables = [];
            _this.registerViews();
            _this.searchDelayer = new async_1.ThrottledDelayer(500);
            _this.extensionsViewletVisibleContextKey = ExtensionsViewletVisibleContext.bindTo(contextKeyService);
            _this.searchExtensionsContextKey = SearchExtensionsContext.bindTo(contextKeyService);
            _this.searchInstalledExtensionsContextKey = SearchInstalledExtensionsContext.bindTo(contextKeyService);
            _this.searchRecommendedExtensionsContextKey = SearchRecommendedExtensionsContext.bindTo(contextKeyService);
            _this.disposables.push(viewletService.onDidViewletOpen(_this.onViewletOpen, _this, _this.disposables));
            _this.isAutoUpdateEnabled = _this.extensionsWorkbenchService.isAutoUpdateEnabled;
            _this.configurationService.onDidUpdateConfiguration(function () {
                var isAutoUpdateEnabled = _this.extensionsWorkbenchService.isAutoUpdateEnabled;
                if (_this.isAutoUpdateEnabled !== isAutoUpdateEnabled) {
                    _this.isAutoUpdateEnabled = isAutoUpdateEnabled;
                    _this.secondaryActions = null;
                    _this.updateTitleArea();
                }
            }, _this, _this.disposables);
            return _this;
        }
        ExtensionsViewlet.prototype.registerViews = function () {
            var viewDescriptors = [];
            viewDescriptors.push(this.createMarketPlaceExtensionsListViewDescriptor());
            viewDescriptors.push(this.createInstalledExtensionsListViewDescriptor());
            viewDescriptors.push(this.createSearchInstalledExtensionsListViewDescriptor());
            viewDescriptors.push(this.createRecommendedExtensionsListViewDescriptor());
            viewsRegistry_1.ViewsRegistry.registerViews(viewDescriptors);
        };
        ExtensionsViewlet.prototype.createMarketPlaceExtensionsListViewDescriptor = function () {
            return {
                id: 'extensions.listView',
                name: nls_1.localize('marketPlace', "Marketplace"),
                location: viewsRegistry_1.ViewLocation.Extensions,
                ctor: extensionsViews_1.ExtensionsListView,
                when: contextkey_1.ContextKeyExpr.and(contextkey_1.ContextKeyExpr.has('extensionsViewletVisible'), contextkey_1.ContextKeyExpr.has('searchExtensions'), contextkey_1.ContextKeyExpr.not('searchInstalledExtensions')),
                size: 100
            };
        };
        ExtensionsViewlet.prototype.createInstalledExtensionsListViewDescriptor = function () {
            return {
                id: 'extensions.installedList',
                name: nls_1.localize('installedExtensions', "Installed"),
                location: viewsRegistry_1.ViewLocation.Extensions,
                ctor: extensionsViews_1.InstalledExtensionsView,
                when: contextkey_1.ContextKeyExpr.and(contextkey_1.ContextKeyExpr.has('extensionsViewletVisible'), contextkey_1.ContextKeyExpr.not('searchExtensions')),
                size: 50
            };
        };
        ExtensionsViewlet.prototype.createSearchInstalledExtensionsListViewDescriptor = function () {
            return {
                id: 'extensions.searchInstalledList',
                name: nls_1.localize('searchInstalledExtensions', "Installed"),
                location: viewsRegistry_1.ViewLocation.Extensions,
                ctor: extensionsViews_1.InstalledExtensionsView,
                when: contextkey_1.ContextKeyExpr.and(contextkey_1.ContextKeyExpr.has('extensionsViewletVisible'), contextkey_1.ContextKeyExpr.has('searchInstalledExtensions')),
                size: 50
            };
        };
        ExtensionsViewlet.prototype.createRecommendedExtensionsListViewDescriptor = function () {
            return {
                id: 'extensions.recommendedList',
                name: nls_1.localize('recommendedExtensions', "Recommended"),
                location: viewsRegistry_1.ViewLocation.Extensions,
                ctor: extensionsViews_1.RecommendedExtensionsView,
                when: contextkey_1.ContextKeyExpr.and(contextkey_1.ContextKeyExpr.has('extensionsViewletVisible'), contextkey_1.ContextKeyExpr.not('searchExtensions')),
                size: 50,
                canToggleVisibility: true
            };
        };
        ExtensionsViewlet.prototype.create = function (parent) {
            var _this = this;
            parent.addClass('extensions-viewlet');
            this.root = parent.getHTMLElement();
            var header = dom_1.append(this.root, dom_1.$('.header'));
            this.searchBox = dom_1.append(header, dom_1.$('input.search-box'));
            this.searchBox.placeholder = nls_1.localize('searchExtensions', "Search Extensions in Marketplace");
            this.disposables.push(dom_1.addStandardDisposableListener(this.searchBox, dom_1.EventType.FOCUS, function () { return dom_1.addClass(_this.searchBox, 'synthetic-focus'); }));
            this.disposables.push(dom_1.addStandardDisposableListener(this.searchBox, dom_1.EventType.BLUR, function () { return dom_1.removeClass(_this.searchBox, 'synthetic-focus'); }));
            this.extensionsBox = dom_1.append(this.root, dom_1.$('.extensions'));
            var onKeyDown = event_1.chain(event_2.domEvent(this.searchBox, 'keydown'))
                .map(function (e) { return new keyboardEvent_1.StandardKeyboardEvent(e); });
            onKeyDown.filter(function (e) { return e.keyCode === 9 /* Escape */; }).on(this.onEscape, this, this.disposables);
            var onKeyDownForList = onKeyDown.filter(function () { return _this.count() > 0; });
            onKeyDownForList.filter(function (e) { return e.keyCode === 3 /* Enter */; }).on(this.onEnter, this, this.disposables);
            onKeyDownForList.filter(function (e) { return e.keyCode === 16 /* UpArrow */; }).on(this.onUpArrow, this, this.disposables);
            onKeyDownForList.filter(function (e) { return e.keyCode === 18 /* DownArrow */; }).on(this.onDownArrow, this, this.disposables);
            onKeyDownForList.filter(function (e) { return e.keyCode === 11 /* PageUp */; }).on(this.onPageUpArrow, this, this.disposables);
            onKeyDownForList.filter(function (e) { return e.keyCode === 12 /* PageDown */; }).on(this.onPageDownArrow, this, this.disposables);
            var onSearchInput = event_2.domEvent(this.searchBox, 'input');
            onSearchInput(function (e) { return _this.triggerSearch(e.immediate); }, null, this.disposables);
            this.onSearchChange = event_1.mapEvent(onSearchInput, function (e) { return e.target.value; });
            return this.extensionManagementService.getInstalled(extensionManagement_1.LocalExtensionType.User)
                .then(function (installed) {
                if (installed.length === 0) {
                    _this.searchBox.value = '@sort:installs';
                    _this.searchExtensionsContextKey.set(true);
                }
                return _super.prototype.create.call(_this, new builder_1.Builder(_this.extensionsBox));
            });
        };
        ExtensionsViewlet.prototype.updateStyles = function () {
            _super.prototype.updateStyles.call(this);
            this.searchBox.style.backgroundColor = this.getColor(colorRegistry_1.inputBackground);
            this.searchBox.style.color = this.getColor(colorRegistry_1.inputForeground);
            var inputBorderColor = this.getColor(colorRegistry_1.inputBorder);
            this.searchBox.style.borderWidth = inputBorderColor ? '1px' : null;
            this.searchBox.style.borderStyle = inputBorderColor ? 'solid' : null;
            this.searchBox.style.borderColor = inputBorderColor;
        };
        ExtensionsViewlet.prototype.setVisible = function (visible) {
            var _this = this;
            var isVisibilityChanged = this.isVisible() !== visible;
            return _super.prototype.setVisible.call(this, visible).then(function () {
                if (isVisibilityChanged) {
                    _this.extensionsViewletVisibleContextKey.set(visible);
                    if (visible) {
                        _this.searchBox.focus();
                        _this.searchBox.setSelectionRange(0, _this.searchBox.value.length);
                    }
                }
            });
        };
        ExtensionsViewlet.prototype.focus = function () {
            this.searchBox.focus();
        };
        ExtensionsViewlet.prototype.layout = function (dimension) {
            dom_1.toggleClass(this.root, 'narrow', dimension.width <= 300);
            _super.prototype.layout.call(this, new builder_1.Dimension(dimension.width, dimension.height - 38));
        };
        ExtensionsViewlet.prototype.getOptimalWidth = function () {
            return 400;
        };
        ExtensionsViewlet.prototype.getActions = function () {
            if (!this.primaryActions) {
                this.primaryActions = [
                    this.instantiationService.createInstance(extensionsActions_1.ClearExtensionsInputAction, extensionsActions_1.ClearExtensionsInputAction.ID, extensionsActions_1.ClearExtensionsInputAction.LABEL, this.onSearchChange)
                ];
            }
            return this.primaryActions;
        };
        ExtensionsViewlet.prototype.getSecondaryActions = function () {
            if (!this.secondaryActions) {
                this.secondaryActions = [
                    this.instantiationService.createInstance(extensionsActions_1.ShowInstalledExtensionsAction, extensionsActions_1.ShowInstalledExtensionsAction.ID, extensionsActions_1.ShowInstalledExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowOutdatedExtensionsAction, extensionsActions_1.ShowOutdatedExtensionsAction.ID, extensionsActions_1.ShowOutdatedExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowEnabledExtensionsAction, extensionsActions_1.ShowEnabledExtensionsAction.ID, extensionsActions_1.ShowEnabledExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowDisabledExtensionsAction, extensionsActions_1.ShowDisabledExtensionsAction.ID, extensionsActions_1.ShowDisabledExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowRecommendedExtensionsAction, extensionsActions_1.ShowRecommendedExtensionsAction.ID, extensionsActions_1.ShowRecommendedExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction, extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction.ID, extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.ShowPopularExtensionsAction, extensionsActions_1.ShowPopularExtensionsAction.ID, extensionsActions_1.ShowPopularExtensionsAction.LABEL),
                    new actionbar_1.Separator(),
                    this.instantiationService.createInstance(extensionsActions_1.ChangeSortAction, 'extensions.sort.install', nls_1.localize('sort by installs', "Sort By: Install Count"), this.onSearchChange, 'installs'),
                    this.instantiationService.createInstance(extensionsActions_1.ChangeSortAction, 'extensions.sort.rating', nls_1.localize('sort by rating', "Sort By: Rating"), this.onSearchChange, 'rating'),
                    this.instantiationService.createInstance(extensionsActions_1.ChangeSortAction, 'extensions.sort.name', nls_1.localize('sort by name', "Sort By: Name"), this.onSearchChange, 'name'),
                    new actionbar_1.Separator(),
                    this.instantiationService.createInstance(extensionsActions_1.CheckForUpdatesAction, extensionsActions_1.CheckForUpdatesAction.ID, extensionsActions_1.CheckForUpdatesAction.LABEL)
                ].concat((this.isAutoUpdateEnabled ? [this.instantiationService.createInstance(extensionsActions_1.DisableAutoUpdateAction, extensionsActions_1.DisableAutoUpdateAction.ID, extensionsActions_1.DisableAutoUpdateAction.LABEL)] : [this.instantiationService.createInstance(extensionsActions_1.UpdateAllAction, extensionsActions_1.UpdateAllAction.ID, extensionsActions_1.UpdateAllAction.LABEL), this.instantiationService.createInstance(extensionsActions_1.EnableAutoUpdateAction, extensionsActions_1.EnableAutoUpdateAction.ID, extensionsActions_1.EnableAutoUpdateAction.LABEL)]), [
                    this.instantiationService.createInstance(extensionsActions_2.InstallVSIXAction, extensionsActions_2.InstallVSIXAction.ID, extensionsActions_2.InstallVSIXAction.LABEL),
                    new actionbar_1.Separator(),
                    this.instantiationService.createInstance(extensionsActions_1.DisableAllAction, extensionsActions_1.DisableAllAction.ID, extensionsActions_1.DisableAllAction.LABEL),
                    this.instantiationService.createInstance(extensionsActions_1.EnableAllAction, extensionsActions_1.EnableAllAction.ID, extensionsActions_1.EnableAllAction.LABEL)
                ]);
            }
            return this.secondaryActions;
        };
        ExtensionsViewlet.prototype.search = function (value) {
            var event = new Event('input', { bubbles: true });
            event.immediate = true;
            this.searchBox.value = value;
            this.searchBox.dispatchEvent(event);
        };
        ExtensionsViewlet.prototype.triggerSearch = function (immediate) {
            var _this = this;
            if (immediate === void 0) { immediate = false; }
            this.searchDelayer.trigger(function () { return _this.doSearch(); }, immediate || !this.searchBox.value ? 0 : 500)
                .done(null, function (err) { return _this.onError(err); });
        };
        ExtensionsViewlet.prototype.doSearch = function () {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var value;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            value = this.searchBox.value || '';
                            this.searchExtensionsContextKey.set(!!value);
                            this.searchInstalledExtensionsContextKey.set(extensionsViews_1.InstalledExtensionsView.isInsalledExtensionsQuery(value));
                            this.searchRecommendedExtensionsContextKey.set(extensionsViews_1.RecommendedExtensionsView.isRecommendedExtensionsQuery(value));
                            return [4 /*yield*/, this.updateViews([], !!value)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ExtensionsViewlet.prototype.updateViews = function (unregisteredViews, showAll) {
            if (unregisteredViews === void 0) { unregisteredViews = []; }
            if (showAll === void 0) { showAll = false; }
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var _this = this;
                var created, toShow;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.updateViews.call(this)];
                        case 1:
                            created = _a.sent();
                            toShow = showAll ? this.views : created;
                            if (!toShow.length) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.progress(winjs_base_1.TPromise.join(toShow.map(function (view) { return view.show(_this.searchBox.value); })))];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, created];
                    }
                });
            });
        };
        ExtensionsViewlet.prototype.count = function () {
            return this.views.reduce(function (count, view) { return view.count() + count; }, 0);
        };
        ExtensionsViewlet.prototype.onEscape = function () {
            this.search('');
        };
        ExtensionsViewlet.prototype.onEnter = function () {
            this.views[0].select();
        };
        ExtensionsViewlet.prototype.onUpArrow = function () {
            this.views[0].showPrevious();
        };
        ExtensionsViewlet.prototype.onDownArrow = function () {
            this.views[0].showNext();
        };
        ExtensionsViewlet.prototype.onPageUpArrow = function () {
            this.views[0].showPreviousPage();
        };
        ExtensionsViewlet.prototype.onPageDownArrow = function () {
            this.views[0].showNextPage();
        };
        ExtensionsViewlet.prototype.onViewletOpen = function (viewlet) {
            var _this = this;
            if (!viewlet || viewlet.getId() === extensions_2.VIEWLET_ID) {
                return;
            }
            var model = this.editorInputService.getStacksModel();
            var promises = model.groups.map(function (group) {
                var position = model.positionOfGroup(group);
                var inputs = group.getEditors().filter(function (input) { return input instanceof extensionsInput_1.ExtensionsInput; });
                var promises = inputs.map(function (input) { return _this.editorService.closeEditor(position, input); });
                return winjs_base_1.TPromise.join(promises);
            });
            winjs_base_1.TPromise.join(promises).done(null, errors_1.onUnexpectedError);
        };
        ExtensionsViewlet.prototype.progress = function (promise) {
            var progressRunner = this.progressService.show(true);
            return async_1.always(promise, function () { return progressRunner.done(); });
        };
        ExtensionsViewlet.prototype.onError = function (err) {
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
        ExtensionsViewlet.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            _super.prototype.dispose.call(this);
        };
        ExtensionsViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, progress_1.IProgressService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, groupService_1.IEditorGroupService),
            __param(5, extensions_2.IExtensionsWorkbenchService),
            __param(6, extensionManagement_1.IExtensionManagementService),
            __param(7, message_1.IMessageService),
            __param(8, viewlet_1.IViewletService),
            __param(9, themeService_1.IThemeService),
            __param(10, configuration_1.IConfigurationService),
            __param(11, storage_1.IStorageService),
            __param(12, workspace_1.IWorkspaceContextService),
            __param(13, contextkey_1.IContextKeyService),
            __param(14, contextView_1.IContextMenuService),
            __param(15, extensions_1.IExtensionService)
        ], ExtensionsViewlet);
        return ExtensionsViewlet;
    }(views_1.PersistentViewsViewlet));
    exports.ExtensionsViewlet = ExtensionsViewlet;
    var StatusUpdater = (function () {
        function StatusUpdater(activityBarService, extensionsWorkbenchService) {
            this.activityBarService = activityBarService;
            this.extensionsWorkbenchService = extensionsWorkbenchService;
            extensionsWorkbenchService.onChange(this.onServiceChange, this, this.disposables);
        }
        StatusUpdater.prototype.getId = function () {
            return 'vs.extensions.statusupdater';
        };
        StatusUpdater.prototype.onServiceChange = function () {
            lifecycle_1.dispose(this.badgeHandle);
            if (this.extensionsWorkbenchService.local.some(function (e) { return e.state === extensions_2.ExtensionState.Installing; })) {
                this.badgeHandle = this.activityBarService.showActivity(extensions_2.VIEWLET_ID, new activityBarService_1.ProgressBadge(function () { return nls_1.localize('extensions', "Extensions"); }), 'extensions-badge progress-badge');
                return;
            }
            var outdated = this.extensionsWorkbenchService.local.reduce(function (r, e) { return r + (e.outdated ? 1 : 0); }, 0);
            if (outdated > 0) {
                var badge = new activityBarService_1.NumberBadge(outdated, function (n) { return nls_1.localize('outdatedExtensions', '{0} Outdated Extensions', n); });
                this.badgeHandle = this.activityBarService.showActivity(extensions_2.VIEWLET_ID, badge, 'extensions-badge count-badge');
            }
        };
        StatusUpdater.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            lifecycle_1.dispose(this.badgeHandle);
        };
        StatusUpdater = __decorate([
            __param(0, activityBarService_1.IActivityBarService),
            __param(1, extensions_2.IExtensionsWorkbenchService)
        ], StatusUpdater);
        return StatusUpdater;
    }());
    exports.StatusUpdater = StatusUpdater;
});
//# sourceMappingURL=extensionsViewlet.js.map