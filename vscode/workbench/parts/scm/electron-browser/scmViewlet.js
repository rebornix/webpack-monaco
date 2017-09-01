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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/event", "vs/base/common/errors", "vs/base/common/lifecycle", "vs/workbench/parts/views/browser/views", "vs/base/browser/dom", "vs/platform/telemetry/common/telemetry", "vs/base/browser/ui/list/listWidget", "vs/workbench/parts/scm/common/scm", "vs/workbench/browser/labels", "vs/base/browser/ui/countBadge/countBadge", "vs/workbench/services/scm/common/scm", "vs/workbench/services/group/common/groupService", "vs/workbench/services/editor/common/editorService", "vs/platform/instantiation/common/instantiation", "vs/platform/contextview/browser/contextView", "vs/platform/contextkey/common/contextkey", "vs/platform/commands/common/commands", "vs/platform/keybinding/common/keybinding", "vs/platform/message/common/message", "vs/platform/list/browser/listService", "vs/platform/actions/common/actions", "vs/base/common/actions", "vs/platform/actions/browser/menuItemActionItem", "./scmMenus", "vs/base/browser/ui/actionbar/actionbar", "vs/platform/theme/common/themeService", "vs/base/common/comparers", "./scmUtil", "vs/platform/theme/common/styler", "vs/base/common/severity", "vs/platform/extensions/common/extensions", "vs/platform/workspace/common/workspace", "vs/platform/storage/common/storage", "vs/workbench/parts/views/browser/viewsRegistry", "vs/workbench/services/viewlet/browser/viewlet", "vs/base/browser/ui/splitview/splitview", "vs/workbench/parts/extensions/common/extensions", "vs/base/browser/ui/inputbox/inputBox", "vs/base/common/platform", "vs/base/browser/event", "vs/base/browser/keyboardEvent", "vs/css!./media/scmViewlet"], function (require, exports, nls_1, winjs_base_1, event_1, errors_1, lifecycle_1, views_1, dom_1, telemetry_1, listWidget_1, scm_1, labels_1, countBadge_1, scm_2, groupService_1, editorService_1, instantiation_1, contextView_1, contextkey_1, commands_1, keybinding_1, message_1, listService_1, actions_1, actions_2, menuItemActionItem_1, scmMenus_1, actionbar_1, themeService_1, comparers_1, scmUtil_1, styler_1, severity_1, extensions_1, workspace_1, storage_1, viewsRegistry_1, viewlet_1, splitview_1, extensions_2, inputBox_1, platform, event_2, keyboardEvent_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // TODO@Joao
    // Need to subclass MenuItemActionItem in order to respect
    // the action context coming from any action bar, without breaking
    // existing users
    var SCMMenuItemActionItem = (function (_super) {
        __extends(SCMMenuItemActionItem, _super);
        function SCMMenuItemActionItem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SCMMenuItemActionItem.prototype.onClick = function (event) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            this.actionRunner.run(this._commandAction, this._context)
                .done(undefined, function (err) { return _this._messageService.show(severity_1.default.Error, err); });
        };
        return SCMMenuItemActionItem;
    }(menuItemActionItem_1.MenuItemActionItem));
    function identityProvider(r) {
        if (scmUtil_1.isSCMResource(r)) {
            var group = r.resourceGroup;
            var provider = group.provider;
            return provider.contextValue + "/" + group.id + "/" + r.sourceUri.toString();
        }
        else {
            var provider = r.provider;
            return provider.contextValue + "/" + r.id;
        }
    }
    var ResourceGroupRenderer = (function () {
        function ResourceGroupRenderer(scmMenus, actionItemProvider, themeService) {
            this.scmMenus = scmMenus;
            this.actionItemProvider = actionItemProvider;
            this.themeService = themeService;
        }
        Object.defineProperty(ResourceGroupRenderer.prototype, "templateId", {
            get: function () { return ResourceGroupRenderer.TEMPLATE_ID; },
            enumerable: true,
            configurable: true
        });
        ResourceGroupRenderer.prototype.renderTemplate = function (container) {
            var element = dom_1.append(container, dom_1.$('.resource-group'));
            var name = dom_1.append(element, dom_1.$('.name'));
            var actionsContainer = dom_1.append(element, dom_1.$('.actions'));
            var actionBar = new actionbar_1.ActionBar(actionsContainer, { actionItemProvider: this.actionItemProvider });
            var countContainer = dom_1.append(element, dom_1.$('.count'));
            var count = new countBadge_1.CountBadge(countContainer);
            var styler = styler_1.attachBadgeStyler(count, this.themeService);
            return {
                name: name, count: count, actionBar: actionBar, dispose: function () {
                    actionBar.dispose();
                    styler.dispose();
                }
            };
        };
        ResourceGroupRenderer.prototype.renderElement = function (group, index, template) {
            template.name.textContent = group.label;
            template.count.setCount(group.resources.length);
            template.actionBar.clear();
            template.actionBar.context = group;
            template.actionBar.push(this.scmMenus.getResourceGroupActions(group), { icon: true, label: false });
        };
        ResourceGroupRenderer.prototype.disposeTemplate = function (template) {
            template.dispose();
        };
        ResourceGroupRenderer.TEMPLATE_ID = 'resource group';
        return ResourceGroupRenderer;
    }());
    var MultipleSelectionActionRunner = (function (_super) {
        __extends(MultipleSelectionActionRunner, _super);
        function MultipleSelectionActionRunner(getSelectedResources) {
            var _this = _super.call(this) || this;
            _this.getSelectedResources = getSelectedResources;
            return _this;
        }
        MultipleSelectionActionRunner.prototype.runAction = function (action, context) {
            if (action instanceof actions_1.MenuItemAction) {
                var selection = this.getSelectedResources();
                var filteredSelection = selection.filter(function (s) { return s !== context; });
                if (selection.length === filteredSelection.length || selection.length === 1) {
                    return action.run(context);
                }
                return action.run.apply(action, [context].concat(filteredSelection));
            }
            return _super.prototype.runAction.call(this, action, context);
        };
        return MultipleSelectionActionRunner;
    }(actions_2.ActionRunner));
    var ResourceRenderer = (function () {
        function ResourceRenderer(scmMenus, actionItemProvider, getSelectedResources, themeService, instantiationService) {
            this.scmMenus = scmMenus;
            this.actionItemProvider = actionItemProvider;
            this.getSelectedResources = getSelectedResources;
            this.themeService = themeService;
            this.instantiationService = instantiationService;
        }
        Object.defineProperty(ResourceRenderer.prototype, "templateId", {
            get: function () { return ResourceRenderer.TEMPLATE_ID; },
            enumerable: true,
            configurable: true
        });
        ResourceRenderer.prototype.renderTemplate = function (container) {
            var element = dom_1.append(container, dom_1.$('.resource'));
            var name = dom_1.append(element, dom_1.$('.name'));
            var fileLabel = this.instantiationService.createInstance(labels_1.FileLabel, name, void 0);
            var actionsContainer = dom_1.append(element, dom_1.$('.actions'));
            var actionBar = new actionbar_1.ActionBar(actionsContainer, {
                actionItemProvider: this.actionItemProvider,
                actionRunner: new MultipleSelectionActionRunner(this.getSelectedResources)
            });
            var decorationIcon = dom_1.append(element, dom_1.$('.decoration-icon'));
            return {
                element: element, name: name, fileLabel: fileLabel, decorationIcon: decorationIcon, actionBar: actionBar, dispose: function () {
                    actionBar.dispose();
                    fileLabel.dispose();
                }
            };
        };
        ResourceRenderer.prototype.renderElement = function (resource, index, template) {
            template.fileLabel.setFile(resource.sourceUri);
            template.actionBar.clear();
            template.actionBar.context = resource;
            template.actionBar.push(this.scmMenus.getResourceActions(resource), { icon: true, label: false });
            dom_1.toggleClass(template.name, 'strike-through', resource.decorations.strikeThrough);
            dom_1.toggleClass(template.element, 'faded', resource.decorations.faded);
            var theme = this.themeService.getTheme();
            var icon = theme.type === themeService_1.LIGHT ? resource.decorations.icon : resource.decorations.iconDark;
            if (icon) {
                template.decorationIcon.style.backgroundImage = "url('" + icon + "')";
                template.decorationIcon.title = resource.decorations.tooltip;
            }
            else {
                template.decorationIcon.style.backgroundImage = '';
            }
        };
        ResourceRenderer.prototype.disposeTemplate = function (template) {
            template.dispose();
        };
        ResourceRenderer.TEMPLATE_ID = 'resource';
        ResourceRenderer = __decorate([
            __param(3, themeService_1.IThemeService),
            __param(4, instantiation_1.IInstantiationService)
        ], ResourceRenderer);
        return ResourceRenderer;
    }());
    var Delegate = (function () {
        function Delegate() {
        }
        Delegate.prototype.getHeight = function () { return 22; };
        Delegate.prototype.getTemplateId = function (element) {
            return scmUtil_1.isSCMResource(element) ? ResourceRenderer.TEMPLATE_ID : ResourceGroupRenderer.TEMPLATE_ID;
        };
        return Delegate;
    }());
    function resourceSorter(a, b) {
        return comparers_1.comparePaths(a.sourceUri.fsPath, b.sourceUri.fsPath);
    }
    var SourceControlViewDescriptor = (function () {
        function SourceControlViewDescriptor(_repository) {
            this._repository = _repository;
        }
        Object.defineProperty(SourceControlViewDescriptor.prototype, "repository", {
            get: function () { return this._repository; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SourceControlViewDescriptor.prototype, "id", {
            get: function () { return this._repository.provider.id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SourceControlViewDescriptor.prototype, "name", {
            get: function () { return this._repository.provider.label; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SourceControlViewDescriptor.prototype, "ctor", {
            get: function () { return null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SourceControlViewDescriptor.prototype, "location", {
            get: function () { return viewsRegistry_1.ViewLocation.SCM; },
            enumerable: true,
            configurable: true
        });
        return SourceControlViewDescriptor;
    }());
    var SourceControlView = (function (_super) {
        __extends(SourceControlView, _super);
        function SourceControlView(initialSize, repository, options, keybindingService, themeService, contextMenuService, contextViewService, listService, commandService, messageService, editorService, editorGroupService, instantiationService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { sizing: splitview_1.ViewSizing.Flexible }), keybindingService, contextMenuService) || this;
            _this.repository = repository;
            _this.keybindingService = keybindingService;
            _this.themeService = themeService;
            _this.contextMenuService = contextMenuService;
            _this.contextViewService = contextViewService;
            _this.listService = listService;
            _this.commandService = commandService;
            _this.messageService = messageService;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.instantiationService = instantiationService;
            _this.disposables = [];
            _this.menus = instantiationService.createInstance(scmMenus_1.SCMMenus, repository.provider);
            _this.menus.onDidChangeTitle(_this.updateActions, _this, _this.disposables);
            return _this;
        }
        SourceControlView.prototype.renderHeader = function (container) {
            var title = dom_1.append(container, dom_1.$('div.title'));
            title.textContent = this.name;
            _super.prototype.renderHeader.call(this, container);
        };
        SourceControlView.prototype.renderBody = function (container) {
            var _this = this;
            var focusTracker = dom_1.trackFocus(container);
            this.disposables.push(focusTracker.addFocusListener(function () { return _this.repository.focus(); }));
            this.disposables.push(focusTracker);
            // Input
            this.inputBoxContainer = dom_1.append(container, dom_1.$('.scm-editor'));
            this.inputBox = new inputBox_1.InputBox(this.inputBoxContainer, this.contextViewService, {
                placeholder: nls_1.localize('commitMessage', "Message (press {0} to commit)", platform.isMacintosh ? 'Cmd+Enter' : 'Ctrl+Enter'),
                flexibleHeight: true
            });
            this.disposables.push(styler_1.attachInputBoxStyler(this.inputBox, this.themeService));
            this.disposables.push(this.inputBox);
            this.inputBox.value = this.repository.input.value;
            this.inputBox.onDidChange(function (value) { return _this.repository.input.value = value; }, null, this.disposables);
            this.repository.input.onDidChange(function (value) { return _this.inputBox.value = value; }, null, this.disposables);
            this.disposables.push(this.inputBox.onDidHeightChange(function () { return _this.layoutBody(); }));
            event_1.chain(event_2.domEvent(this.inputBox.inputElement, 'keydown'))
                .map(function (e) { return new keyboardEvent_1.StandardKeyboardEvent(e); })
                .filter(function (e) { return e.equals(2048 /* CtrlCmd */ | 3 /* Enter */) || e.equals(2048 /* CtrlCmd */ | 49 /* KEY_S */); })
                .on(this.onDidAcceptInput, this, this.disposables);
            if (this.repository.provider.onDidChangeCommitTemplate) {
                this.repository.provider.onDidChangeCommitTemplate(this.updateInputBox, this, this.disposables);
            }
            this.updateInputBox();
            // List
            this.listContainer = dom_1.append(container, dom_1.$('.scm-status.show-file-icons'));
            var delegate = new Delegate();
            var actionItemProvider = function (action) { return _this.getActionItem(action); };
            var renderers = [
                new ResourceGroupRenderer(this.menus, actionItemProvider, this.themeService),
                this.instantiationService.createInstance(ResourceRenderer, this.menus, actionItemProvider, function () { return _this.getSelectedResources(); }),
            ];
            this.list = new listWidget_1.List(this.listContainer, delegate, renderers, {
                identityProvider: identityProvider,
                keyboardSupport: false
            });
            this.disposables.push(styler_1.attachListStyler(this.list, this.themeService));
            this.disposables.push(this.listService.register(this.list));
            event_1.chain(this.list.onOpen)
                .map(function (e) { return e.elements[0]; })
                .filter(function (e) { return !!e && scmUtil_1.isSCMResource(e); })
                .on(this.open, this, this.disposables);
            event_1.chain(this.list.onPin)
                .map(function (e) { return e.elements[0]; })
                .filter(function (e) { return !!e && scmUtil_1.isSCMResource(e); })
                .on(this.pin, this, this.disposables);
            this.list.onContextMenu(this.onListContextMenu, this, this.disposables);
            this.disposables.push(this.list);
            this.repository.provider.onDidChange(this.updateList, this, this.disposables);
            this.updateList();
        };
        SourceControlView.prototype.layoutBody = function (height) {
            if (height === void 0) { height = this.cachedHeight; }
            if (!height === undefined) {
                return;
            }
            this.list.layout(height);
            this.cachedHeight = height;
            this.inputBox.layout();
            var editorHeight = this.inputBox.height;
            var listHeight = height - (editorHeight + 12 /* margin */);
            this.listContainer.style.height = listHeight + "px";
            this.list.layout(listHeight);
            dom_1.toggleClass(this.inputBoxContainer, 'scroll', editorHeight >= 134);
        };
        SourceControlView.prototype.focus = function () {
            this.inputBox.focus();
        };
        SourceControlView.prototype.getActions = function () {
            return this.menus.getTitleActions();
        };
        SourceControlView.prototype.getSecondaryActions = function () {
            return this.menus.getTitleSecondaryActions();
        };
        SourceControlView.prototype.getActionItem = function (action) {
            if (!(action instanceof actions_1.MenuItemAction)) {
                return undefined;
            }
            return new SCMMenuItemActionItem(action, this.keybindingService, this.messageService);
        };
        SourceControlView.prototype.getActionsContext = function () {
            return this.repository.provider;
        };
        SourceControlView.prototype.updateList = function () {
            var elements = this.repository.provider.resources
                .reduce(function (r, g) { return r.concat([g], g.resources.sort(resourceSorter)); }, []);
            this.list.splice(0, this.list.length, elements);
        };
        SourceControlView.prototype.open = function (e) {
            if (!e.command) {
                return;
            }
            (_a = this.commandService).executeCommand.apply(_a, [e.command.id].concat(e.command.arguments)).done(undefined, errors_1.onUnexpectedError);
            var _a;
        };
        SourceControlView.prototype.pin = function () {
            var activeEditor = this.editorService.getActiveEditor();
            var activeEditorInput = this.editorService.getActiveEditorInput();
            this.editorGroupService.pinEditor(activeEditor.position, activeEditorInput);
        };
        SourceControlView.prototype.onListContextMenu = function (e) {
            var _this = this;
            var element = e.element;
            var actions;
            if (scmUtil_1.isSCMResource(element)) {
                actions = this.menus.getResourceContextActions(element);
            }
            else {
                actions = this.menus.getResourceGroupContextActions(element);
            }
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return e.anchor; },
                getActions: function () { return winjs_base_1.TPromise.as(actions); },
                getActionsContext: function () { return element; },
                actionRunner: new MultipleSelectionActionRunner(function () { return _this.getSelectedResources(); })
            });
        };
        SourceControlView.prototype.getSelectedResources = function () {
            return this.list.getSelectedElements()
                .filter(function (r) { return scmUtil_1.isSCMResource(r); });
        };
        SourceControlView.prototype.updateInputBox = function () {
            if (typeof this.repository.provider.commitTemplate === 'undefined') {
                return;
            }
            this.inputBox.value = this.repository.provider.commitTemplate;
        };
        SourceControlView.prototype.onDidAcceptInput = function () {
            if (!this.repository.provider.acceptInputCommand) {
                return;
            }
            var id = this.repository.provider.acceptInputCommand.id;
            var args = this.repository.provider.acceptInputCommand.arguments;
            (_a = this.commandService).executeCommand.apply(_a, [id].concat(args)).done(undefined, errors_1.onUnexpectedError);
            var _a;
        };
        SourceControlView.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            _super.prototype.dispose.call(this);
        };
        SourceControlView = __decorate([
            __param(3, keybinding_1.IKeybindingService),
            __param(4, themeService_1.IThemeService),
            __param(5, contextView_1.IContextMenuService),
            __param(6, contextView_1.IContextViewService),
            __param(7, listService_1.IListService),
            __param(8, commands_1.ICommandService),
            __param(9, message_1.IMessageService),
            __param(10, editorService_1.IWorkbenchEditorService),
            __param(11, groupService_1.IEditorGroupService),
            __param(12, instantiation_1.IInstantiationService)
        ], SourceControlView);
        return SourceControlView;
    }(views_1.CollapsibleView));
    var InstallAdditionalSCMProvidersAction = (function (_super) {
        __extends(InstallAdditionalSCMProvidersAction, _super);
        function InstallAdditionalSCMProvidersAction(viewletService) {
            var _this = _super.call(this, 'scm.installAdditionalSCMProviders', nls_1.localize('installAdditionalSCMProviders', "Install Additional SCM Providers..."), '', true) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        InstallAdditionalSCMProvidersAction.prototype.run = function () {
            return this.viewletService.openViewlet(extensions_2.VIEWLET_ID, true).then(function (viewlet) { return viewlet; })
                .then(function (viewlet) {
                viewlet.search('category:"SCM Providers" @sort:installs');
                viewlet.focus();
            });
        };
        InstallAdditionalSCMProvidersAction = __decorate([
            __param(0, viewlet_1.IViewletService)
        ], InstallAdditionalSCMProvidersAction);
        return InstallAdditionalSCMProvidersAction;
    }(actions_2.Action));
    var SCMViewlet = (function (_super) {
        __extends(SCMViewlet, _super);
        function SCMViewlet(telemetryService, scmService, instantiationService, contextViewService, contextKeyService, keybindingService, messageService, listService, contextMenuService, themeService, commandService, editorGroupService, editorService, contextService, storageService, extensionService) {
            var _this = _super.call(this, scm_1.VIEWLET_ID, viewsRegistry_1.ViewLocation.SCM, 'scm', true, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) || this;
            _this.scmService = scmService;
            _this.contextViewService = contextViewService;
            _this.keybindingService = keybindingService;
            _this.messageService = messageService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.commandService = commandService;
            _this.editorGroupService = editorGroupService;
            _this.editorService = editorService;
            _this.disposables = [];
            return _this;
        }
        SCMViewlet.prototype.onDidAddRepository = function (repository) {
            var view = new SourceControlViewDescriptor(repository);
            viewsRegistry_1.ViewsRegistry.registerViews([view]);
            this.updateTitleArea();
        };
        SCMViewlet.prototype.onDidRemoveRepository = function (repository) {
            viewsRegistry_1.ViewsRegistry.deregisterViews([repository.provider.id], viewsRegistry_1.ViewLocation.SCM);
            this.updateTitleArea();
        };
        SCMViewlet.prototype.create = function (parent) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.create.call(this, parent)];
                        case 1:
                            _a.sent();
                            parent.addClass('scm-viewlet');
                            this.scmService.onDidAddRepository(this.onDidAddRepository, this, this.disposables);
                            this.scmService.onDidRemoveRepository(this.onDidRemoveRepository, this, this.disposables);
                            this.scmService.repositories.forEach(function (p) { return _this.onDidAddRepository(p); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        SCMViewlet.prototype.createView = function (viewDescriptor, initialSize, options) {
            if (viewDescriptor instanceof SourceControlViewDescriptor) {
                return this.instantiationService.createInstance(SourceControlView, initialSize, viewDescriptor.repository, options);
            }
            return this.instantiationService.createInstance(viewDescriptor.ctor, initialSize, options);
        };
        SCMViewlet.prototype.getOptimalWidth = function () {
            return 400;
        };
        SCMViewlet.prototype.getTitle = function () {
            var title = nls_1.localize('source control', "Source Control");
            var views = viewsRegistry_1.ViewsRegistry.getViews(viewsRegistry_1.ViewLocation.SCM);
            if (views.length === 1) {
                var view = views[0];
                return nls_1.localize('viewletTitle', "{0}: {1}", title, view.name);
            }
            else {
                return title;
            }
        };
        SCMViewlet.prototype.getActions = function () {
            if (this.showHeaderInTitleArea() && this.views.length === 1) {
                return this.views[0].getActions();
            }
            return [];
        };
        SCMViewlet.prototype.getSecondaryActions = function () {
            var result = [];
            if (this.showHeaderInTitleArea() && this.views.length === 1) {
                result = this.views[0].getSecondaryActions().concat([
                    new actionbar_1.Separator()
                ]);
            }
            result.push(this.instantiationService.createInstance(InstallAdditionalSCMProvidersAction));
            return result;
        };
        SCMViewlet.prototype.getActionItem = function (action) {
            if (!(action instanceof actions_1.MenuItemAction)) {
                return undefined;
            }
            return new SCMMenuItemActionItem(action, this.keybindingService, this.messageService);
        };
        SCMViewlet.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
            _super.prototype.dispose.call(this);
        };
        SCMViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, scm_2.ISCMService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, contextView_1.IContextViewService),
            __param(4, contextkey_1.IContextKeyService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, message_1.IMessageService),
            __param(7, listService_1.IListService),
            __param(8, contextView_1.IContextMenuService),
            __param(9, themeService_1.IThemeService),
            __param(10, commands_1.ICommandService),
            __param(11, groupService_1.IEditorGroupService),
            __param(12, editorService_1.IWorkbenchEditorService),
            __param(13, workspace_1.IWorkspaceContextService),
            __param(14, storage_1.IStorageService),
            __param(15, extensions_1.IExtensionService)
        ], SCMViewlet);
        return SCMViewlet;
    }(views_1.PersistentViewsViewlet));
    exports.SCMViewlet = SCMViewlet;
});
//# sourceMappingURL=scmViewlet.js.map