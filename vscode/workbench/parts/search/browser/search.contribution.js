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
define(["require", "exports", "vs/platform/registry/common/platform", "vs/platform/instantiation/common/extensions", "vs/workbench/browser/viewlet", "vs/platform/configuration/common/configurationRegistry", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/actions", "vs/workbench/parts/files/common/files", "vs/platform/actions/common/actions", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/browser/actions", "vs/workbench/common/actionRegistry", "vs/workbench/browser/quickopen", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/instantiation/common/instantiation", "vs/platform/workspace/common/workspace", "vs/platform/quickOpen/common/quickOpen", "vs/editor/common/services/codeEditorService", "vs/editor/contrib/find/common/find", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/parts/search/browser/searchActions", "vs/workbench/parts/files/common/explorerModel", "vs/workbench/parts/search/common/constants", "vs/workbench/parts/search/browser/replaceContributions", "vs/workbench/parts/search/browser/searchWidget", "vs/platform/contextkey/common/contextkey", "vs/editor/contrib/find/common/findModel", "vs/workbench/parts/search/common/searchModel", "vs/platform/commands/common/commands", "vs/platform/list/browser/listService", "vs/workbench/parts/output/common/output", "vs/workbench/browser/parts/quickopen/quickopen", "vs/css!./media/search.contribution"], function (require, exports, platform_1, extensions_1, viewlet_1, configurationRegistry_1, nls, winjs_base_1, actions_1, files_1, actions_2, actionbar_1, actions_3, actionRegistry_1, quickopen_1, keybindingsRegistry_1, instantiation_1, workspace_1, quickOpen_1, codeEditorService_1, find_1, viewlet_2, searchActions, explorerModel_1, Constants, replaceContributions_1, searchWidget_1, contextkey_1, findModel_1, searchModel_1, commands_1, listService_1, output_1, quickopen_2) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    extensions_1.registerSingleton(searchModel_1.ISearchWorkbenchService, searchModel_1.SearchWorkbenchService);
    replaceContributions_1.registerContributions();
    searchWidget_1.registerContributions();
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'workbench.action.search.toggleQueryDetails',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: Constants.SearchViewletVisibleKey,
        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 40 /* KEY_J */,
        handler: function (accessor) {
            var viewletService = accessor.get(viewlet_2.IViewletService);
            viewletService.openViewlet(Constants.VIEWLET_ID, true)
                .then(function (viewlet) { return viewlet.toggleQueryDetails(); });
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.FocusSearchFromResults,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.FirstMatchFocusKey),
        primary: 16 /* UpArrow */,
        handler: function (accessor, args) {
            var searchViewlet = accessor.get(viewlet_2.IViewletService).getActiveViewlet();
            searchViewlet.focusPreviousInputBox();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.OpenMatchToSide,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.FileMatchOrMatchFocusKey),
        primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
        mac: {
            primary: 256 /* WinCtrl */ | 3 /* Enter */
        },
        handler: function (accessor, args) {
            var searchViewlet = accessor.get(viewlet_2.IViewletService).getActiveViewlet();
            var tree = searchViewlet.getControl();
            searchViewlet.open(tree.getFocus(), false, true, true);
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.CancelActionId,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, listService_1.ListFocusContext),
        primary: 9 /* Escape */,
        handler: function (accessor, args) {
            var searchViewlet = accessor.get(viewlet_2.IViewletService).getActiveViewlet();
            searchViewlet.cancelSearch();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.RemoveActionId,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.FileMatchOrMatchFocusKey),
        primary: 20 /* Delete */,
        mac: {
            primary: 2048 /* CtrlCmd */ | 1 /* Backspace */,
        },
        handler: function (accessor, args) {
            var searchViewlet = accessor.get(viewlet_2.IViewletService).getActiveViewlet();
            var tree = searchViewlet.getControl();
            accessor.get(instantiation_1.IInstantiationService).createInstance(searchActions.RemoveAction, tree, tree.getFocus(), searchViewlet).run();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.ReplaceActionId,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.ReplaceActiveKey, Constants.MatchFocusKey),
        primary: 1024 /* Shift */ | 2048 /* CtrlCmd */ | 22 /* KEY_1 */,
        handler: function (accessor, args) {
            var searchViewlet = accessor.get(viewlet_2.IViewletService).getActiveViewlet();
            var tree = searchViewlet.getControl();
            accessor.get(instantiation_1.IInstantiationService).createInstance(searchActions.ReplaceAction, tree, tree.getFocus(), searchViewlet).run();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.ReplaceAllInFileActionId,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.ReplaceActiveKey, Constants.FileFocusKey),
        primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 3 /* Enter */,
        handler: function (accessor, args) {
            var searchViewlet = accessor.get(viewlet_2.IViewletService).getActiveViewlet();
            var tree = searchViewlet.getControl();
            accessor.get(instantiation_1.IInstantiationService).createInstance(searchActions.ReplaceAllAction, tree, tree.getFocus(), searchViewlet).run();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: Constants.CloseReplaceWidgetActionId,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.ReplaceInputBoxFocusedKey),
        primary: 9 /* Escape */,
        handler: function (accessor, args) {
            accessor.get(instantiation_1.IInstantiationService).createInstance(searchActions.CloseReplaceAction, Constants.CloseReplaceWidgetActionId, '').run();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: searchActions.FocusNextInputAction.ID,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.InputBoxFocusedKey),
        primary: 18 /* DownArrow */,
        handler: function (accessor, args) {
            accessor.get(instantiation_1.IInstantiationService).createInstance(searchActions.FocusNextInputAction, searchActions.FocusNextInputAction.ID, '').run();
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: searchActions.FocusPreviousInputAction.ID,
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
        when: contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.InputBoxFocusedKey, Constants.SearchInputBoxFocusedKey.toNegated()),
        primary: 16 /* UpArrow */,
        handler: function (accessor, args) {
            accessor.get(instantiation_1.IInstantiationService).createInstance(searchActions.FocusPreviousInputAction, searchActions.FocusPreviousInputAction.ID, '').run();
        }
    });
    commands_1.CommandsRegistry.registerCommand(searchActions.FindInFolderAction.ID, searchActions.findInFolderCommand);
    var ExplorerViewerActionContributor = (function (_super) {
        __extends(ExplorerViewerActionContributor, _super);
        function ExplorerViewerActionContributor(instantiationService, contextService) {
            var _this = _super.call(this) || this;
            _this._instantiationService = instantiationService;
            _this._contextService = contextService;
            return _this;
        }
        ExplorerViewerActionContributor.prototype.hasSecondaryActions = function (context) {
            var element = context.element;
            // Contribute only on file resources and model (context menu for multi root)
            if (element instanceof explorerModel_1.Model) {
                return true;
            }
            var fileResource = files_1.explorerItemToFileResource(element);
            if (!fileResource) {
                return false;
            }
            return fileResource.isDirectory;
        };
        ExplorerViewerActionContributor.prototype.getSecondaryActions = function (context) {
            var actions = [];
            if (this.hasSecondaryActions(context)) {
                var action = void 0;
                if (context.element instanceof explorerModel_1.Model) {
                    action = this._instantiationService.createInstance(searchActions.FindInWorkspaceAction);
                }
                else {
                    var fileResource = files_1.explorerItemToFileResource(context.element);
                    action = this._instantiationService.createInstance(searchActions.FindInFolderAction, fileResource.resource);
                }
                action.order = 55;
                actions.push(action);
                actions.push(new actionbar_1.Separator('', 56));
            }
            return actions;
        };
        ExplorerViewerActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService), __param(1, workspace_1.IWorkspaceContextService)
        ], ExplorerViewerActionContributor);
        return ExplorerViewerActionContributor;
    }(actions_3.ActionBarContributor));
    var ACTION_ID = 'workbench.action.showAllSymbols';
    var ACTION_LABEL = nls.localize('showTriggerActions', "Go to Symbol in Workspace...");
    var ALL_SYMBOLS_PREFIX = '#';
    var ShowAllSymbolsAction = (function (_super) {
        __extends(ShowAllSymbolsAction, _super);
        function ShowAllSymbolsAction(actionId, actionLabel, quickOpenService, editorService) {
            var _this = _super.call(this, actionId, actionLabel) || this;
            _this.quickOpenService = quickOpenService;
            _this.editorService = editorService;
            _this.enabled = !!_this.quickOpenService;
            return _this;
        }
        ShowAllSymbolsAction.prototype.run = function (context) {
            var prefix = ALL_SYMBOLS_PREFIX;
            var inputSelection = void 0;
            var editor = this.editorService.getFocusedCodeEditor();
            var word = editor && find_1.getSelectionSearchString(editor);
            if (word) {
                prefix = prefix + word;
                inputSelection = { start: 1, end: word.length + 1 };
            }
            this.quickOpenService.show(prefix, { inputSelection: inputSelection });
            return winjs_base_1.TPromise.as(null);
        };
        ShowAllSymbolsAction = __decorate([
            __param(2, quickOpen_1.IQuickOpenService),
            __param(3, codeEditorService_1.ICodeEditorService)
        ], ShowAllSymbolsAction);
        return ShowAllSymbolsAction;
    }(actions_1.Action));
    // Register Viewlet
    platform_1.Registry.as(viewlet_1.Extensions.Viewlets).registerViewlet(new viewlet_1.ViewletDescriptor('vs/workbench/parts/search/browser/searchViewlet', 'SearchViewlet', Constants.VIEWLET_ID, nls.localize('name', "Search"), 'search', 10));
    // Actions
    var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.OpenSearchViewletAction, Constants.VIEWLET_ID, nls.localize('showSearchViewlet', "Show Search"), { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 36 /* KEY_F */ }, Constants.SearchViewletVisibleKey.toNegated()), 'View: Show Search', nls.localize('view', "View"));
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.FocusActiveEditorAction, Constants.FocusActiveEditorActionId, '', { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 36 /* KEY_F */ }, contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.SearchInputBoxFocusedKey)), '');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.FindInFilesAction, Constants.FindInFilesActionId, nls.localize('findInFiles', "Find in Files"), { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 36 /* KEY_F */ }, Constants.SearchInputBoxFocusedKey.toNegated()), 'Find in Files');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.FocusNextSearchResultAction, searchActions.FocusNextSearchResultAction.ID, searchActions.FocusNextSearchResultAction.LABEL, { primary: 62 /* F4 */ }), '');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.FocusPreviousSearchResultAction, searchActions.FocusPreviousSearchResultAction.ID, searchActions.FocusPreviousSearchResultAction.LABEL, { primary: 1024 /* Shift */ | 62 /* F4 */ }), '');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ReplaceInFilesAction, searchActions.ReplaceInFilesAction.ID, searchActions.ReplaceInFilesAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 38 /* KEY_H */ }), 'Replace in Files');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ToggleCaseSensitiveAction, Constants.ToggleCaseSensitiveActionId, '', findModel_1.ToggleCaseSensitiveKeybinding, contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.SearchInputBoxFocusedKey)), '');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ToggleWholeWordAction, Constants.ToggleWholeWordActionId, '', findModel_1.ToggleWholeWordKeybinding, contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.SearchInputBoxFocusedKey)), '');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ToggleRegexAction, Constants.ToggleRegexActionId, '', findModel_1.ToggleRegexKeybinding, contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.SearchInputBoxFocusedKey)), '');
    // Terms navigation actions
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ShowNextSearchTermAction, searchActions.ShowNextSearchTermAction.ID, searchActions.ShowNextSearchTermAction.LABEL, findModel_1.ShowNextFindTermKeybinding, searchActions.ShowNextSearchTermAction.CONTEXT_KEY_EXPRESSION), 'Show Next Search Term', 'Search');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ShowPreviousSearchTermAction, searchActions.ShowPreviousSearchTermAction.ID, searchActions.ShowPreviousSearchTermAction.LABEL, findModel_1.ShowPreviousFindTermKeybinding, searchActions.ShowPreviousSearchTermAction.CONTEXT_KEY_EXPRESSION), 'Show Previous Search Term', 'Search');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ShowNextSearchIncludeAction, searchActions.ShowNextSearchIncludeAction.ID, searchActions.ShowNextSearchIncludeAction.LABEL, findModel_1.ShowNextFindTermKeybinding, searchActions.ShowNextSearchIncludeAction.CONTEXT_KEY_EXPRESSION), 'Show Next Search Include Pattern', 'Search');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ShowPreviousSearchIncludeAction, searchActions.ShowPreviousSearchIncludeAction.ID, searchActions.ShowPreviousSearchIncludeAction.LABEL, findModel_1.ShowPreviousFindTermKeybinding, searchActions.ShowPreviousSearchIncludeAction.CONTEXT_KEY_EXPRESSION), 'Show Previous Search Include Pattern', 'Search');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ShowNextSearchExcludeAction, searchActions.ShowNextSearchExcludeAction.ID, searchActions.ShowNextSearchExcludeAction.LABEL, findModel_1.ShowNextFindTermKeybinding, searchActions.ShowNextSearchExcludeAction.CONTEXT_KEY_EXPRESSION), 'Show Next Search Exclude Pattern', 'Search');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(searchActions.ShowPreviousSearchExcludeAction, searchActions.ShowPreviousSearchExcludeAction.ID, searchActions.ShowPreviousSearchExcludeAction.LABEL, findModel_1.ShowPreviousFindTermKeybinding, searchActions.ShowPreviousSearchExcludeAction.CONTEXT_KEY_EXPRESSION), 'Show Previous Search Exclude Pattern', 'Search');
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ShowAllSymbolsAction, ACTION_ID, ACTION_LABEL, { primary: 2048 /* CtrlCmd */ | 50 /* KEY_T */ }), 'Go to Symbol in Workspace...');
    // Contribute to Explorer Viewer
    var actionBarRegistry = platform_1.Registry.as(actions_3.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actions_3.Scope.VIEWER, ExplorerViewerActionContributor);
    // Register Quick Open Handler
    platform_1.Registry.as(quickopen_1.Extensions.Quickopen).registerDefaultQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/search/browser/openAnythingHandler', 'OpenAnythingHandler', '', quickopen_2.defaultQuickOpenContextKey, nls.localize('openAnythingHandlerDescription', "Go to File")));
    platform_1.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/search/browser/openAnythingHandler', 'OpenSymbolHandler', ALL_SYMBOLS_PREFIX, 'inWorkspaceSymbolsPicker', [
        {
            prefix: ALL_SYMBOLS_PREFIX,
            needsEditor: false,
            description: nls.localize('openSymbolDescriptionNormal', "Go to Symbol in Workspace")
        }
    ]));
    // Search output channel
    var outputChannelRegistry = platform_1.Registry.as(output_1.Extensions.OutputChannels);
    outputChannelRegistry.registerChannel('search', nls.localize('searchOutputChannelTitle', "Search"));
    // Configuration
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': 'search',
        'order': 13,
        'title': nls.localize('searchConfigurationTitle', "Search"),
        'type': 'object',
        'properties': {
            'search.exclude': {
                'type': 'object',
                'description': nls.localize('exclude', "Configure glob patterns for excluding files and folders in searches. Inherits all glob patterns from the files.exclude setting."),
                'default': { '**/node_modules': true, '**/bower_components': true },
                'additionalProperties': {
                    'anyOf': [
                        {
                            'type': 'boolean',
                            'description': nls.localize('exclude.boolean', "The glob pattern to match file paths against. Set to true or false to enable or disable the pattern."),
                        },
                        {
                            'type': 'object',
                            'properties': {
                                'when': {
                                    'type': 'string',
                                    'pattern': '\\w*\\$\\(basename\\)\\w*',
                                    'default': '$(basename).ext',
                                    'description': nls.localize('exclude.when', 'Additional check on the siblings of a matching file. Use $(basename) as variable for the matching file name.')
                                }
                            }
                        }
                    ]
                },
                'scope': configurationRegistry_1.ConfigurationScope.RESOURCE
            },
            'search.useRipgrep': {
                'type': 'boolean',
                'description': nls.localize('useRipgrep', "Controls whether to use ripgrep in text search"),
                'default': true
            },
            'search.useIgnoreFilesByDefault': {
                'type': 'boolean',
                'description': nls.localize('useIgnoreFilesByDefault', "Controls whether to use .gitignore and .ignore files by default when searching in a new workspace."),
                'default': false
            },
            'search.quickOpen.includeSymbols': {
                'type': 'boolean',
                'description': nls.localize('search.quickOpen.includeSymbols', "Configure to include results from a global symbol search in the file results for Quick Open."),
                'default': false
            }
        }
    });
});
//# sourceMappingURL=search.contribution.js.map