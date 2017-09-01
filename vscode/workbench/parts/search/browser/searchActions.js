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
define(["require", "exports", "vs/nls", "vs/base/browser/dom", "vs/base/common/errors", "vs/base/common/paths", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/actions", "vs/workbench/browser/viewlet", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/parts/search/common/searchModel", "vs/workbench/parts/search/common/replace", "vs/workbench/parts/search/common/constants", "vs/base/parts/tree/browser/treeDefaults", "vs/workbench/services/editor/common/editorService", "vs/platform/telemetry/common/telemetry", "vs/base/common/keyCodes", "vs/platform/keybinding/common/keybinding", "vs/workbench/common/editor", "vs/platform/instantiation/common/instantiation", "vs/platform/list/browser/listService", "vs/workbench/parts/files/common/files", "vs/base/common/platform", "vs/platform/contextkey/common/contextkey"], function (require, exports, nls, DOM, errors, paths, winjs_base_1, uri_1, actions_1, viewlet_1, viewlet_2, searchModel_1, replace_1, Constants, treeDefaults_1, editorService_1, telemetry_1, keyCodes_1, keybinding_1, editor_1, instantiation_1, listService_1, files_1, platform_1, contextkey_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isSearchViewletFocused(viewletService) {
        var activeViewlet = viewletService.getActiveViewlet();
        var activeElement = document.activeElement;
        return activeViewlet && activeViewlet.getId() === Constants.VIEWLET_ID && activeElement && DOM.isAncestor(activeElement, activeViewlet.getContainer().getHTMLElement());
    }
    exports.isSearchViewletFocused = isSearchViewletFocused;
    function appendKeyBindingLabel(label, keyBinding, keyBindingService2) {
        if (typeof keyBinding === 'number') {
            var resolvedKeybindings = keyBindingService2.resolveKeybinding(keyCodes_1.createKeybinding(keyBinding, platform_1.OS));
            return doAppendKeyBindingLabel(label, resolvedKeybindings.length > 0 ? resolvedKeybindings[0] : null);
        }
        else {
            return doAppendKeyBindingLabel(label, keyBinding);
        }
    }
    exports.appendKeyBindingLabel = appendKeyBindingLabel;
    function doAppendKeyBindingLabel(label, keyBinding) {
        return keyBinding ? label + ' (' + keyBinding.getLabel() + ')' : label;
    }
    var ToggleCaseSensitiveAction = (function (_super) {
        __extends(ToggleCaseSensitiveAction, _super);
        function ToggleCaseSensitiveAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        ToggleCaseSensitiveAction.prototype.run = function () {
            var searchViewlet = this.viewletService.getActiveViewlet();
            searchViewlet.toggleCaseSensitive();
            return winjs_base_1.TPromise.as(null);
        };
        ToggleCaseSensitiveAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], ToggleCaseSensitiveAction);
        return ToggleCaseSensitiveAction;
    }(actions_1.Action));
    exports.ToggleCaseSensitiveAction = ToggleCaseSensitiveAction;
    var ToggleWholeWordAction = (function (_super) {
        __extends(ToggleWholeWordAction, _super);
        function ToggleWholeWordAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        ToggleWholeWordAction.prototype.run = function () {
            var searchViewlet = this.viewletService.getActiveViewlet();
            searchViewlet.toggleWholeWords();
            return winjs_base_1.TPromise.as(null);
        };
        ToggleWholeWordAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], ToggleWholeWordAction);
        return ToggleWholeWordAction;
    }(actions_1.Action));
    exports.ToggleWholeWordAction = ToggleWholeWordAction;
    var ToggleRegexAction = (function (_super) {
        __extends(ToggleRegexAction, _super);
        function ToggleRegexAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        ToggleRegexAction.prototype.run = function () {
            var searchViewlet = this.viewletService.getActiveViewlet();
            searchViewlet.toggleRegex();
            return winjs_base_1.TPromise.as(null);
        };
        ToggleRegexAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], ToggleRegexAction);
        return ToggleRegexAction;
    }(actions_1.Action));
    exports.ToggleRegexAction = ToggleRegexAction;
    var ShowNextSearchIncludeAction = (function (_super) {
        __extends(ShowNextSearchIncludeAction, _super);
        function ShowNextSearchIncludeAction(id, label, viewletService, contextKeyService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.contextKeyService = contextKeyService;
            _this.enabled = _this.contextKeyService.contextMatchesRules(ShowNextSearchIncludeAction.CONTEXT_KEY_EXPRESSION);
            return _this;
        }
        ShowNextSearchIncludeAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchIncludePattern;
            searchAndReplaceWidget.showNextTerm();
            return winjs_base_1.TPromise.as(null);
        };
        ShowNextSearchIncludeAction.ID = 'search.history.showNextIncludePattern';
        ShowNextSearchIncludeAction.LABEL = nls.localize('nextSearchIncludePattern', "Show Next Search Include Pattern");
        ShowNextSearchIncludeAction.CONTEXT_KEY_EXPRESSION = contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.PatternIncludesFocusedKey);
        ShowNextSearchIncludeAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, contextkey_1.IContextKeyService)
        ], ShowNextSearchIncludeAction);
        return ShowNextSearchIncludeAction;
    }(actions_1.Action));
    exports.ShowNextSearchIncludeAction = ShowNextSearchIncludeAction;
    var ShowPreviousSearchIncludeAction = (function (_super) {
        __extends(ShowPreviousSearchIncludeAction, _super);
        function ShowPreviousSearchIncludeAction(id, label, viewletService, contextKeyService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.contextKeyService = contextKeyService;
            _this.enabled = _this.contextKeyService.contextMatchesRules(ShowPreviousSearchIncludeAction.CONTEXT_KEY_EXPRESSION);
            return _this;
        }
        ShowPreviousSearchIncludeAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchIncludePattern;
            searchAndReplaceWidget.showPreviousTerm();
            return winjs_base_1.TPromise.as(null);
        };
        ShowPreviousSearchIncludeAction.ID = 'search.history.showPreviousIncludePattern';
        ShowPreviousSearchIncludeAction.LABEL = nls.localize('previousSearchIncludePattern', "Show Previous Search Include Pattern");
        ShowPreviousSearchIncludeAction.CONTEXT_KEY_EXPRESSION = contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.PatternIncludesFocusedKey);
        ShowPreviousSearchIncludeAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, contextkey_1.IContextKeyService)
        ], ShowPreviousSearchIncludeAction);
        return ShowPreviousSearchIncludeAction;
    }(actions_1.Action));
    exports.ShowPreviousSearchIncludeAction = ShowPreviousSearchIncludeAction;
    var ShowNextSearchExcludeAction = (function (_super) {
        __extends(ShowNextSearchExcludeAction, _super);
        function ShowNextSearchExcludeAction(id, label, viewletService, contextKeyService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.contextKeyService = contextKeyService;
            _this.enabled = _this.contextKeyService.contextMatchesRules(ShowNextSearchExcludeAction.CONTEXT_KEY_EXPRESSION);
            return _this;
        }
        ShowNextSearchExcludeAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchExcludePattern;
            searchAndReplaceWidget.showNextTerm();
            return winjs_base_1.TPromise.as(null);
        };
        ShowNextSearchExcludeAction.ID = 'search.history.showNextExcludePattern';
        ShowNextSearchExcludeAction.LABEL = nls.localize('nextSearchExcludePattern', "Show Next Search Exclude Pattern");
        ShowNextSearchExcludeAction.CONTEXT_KEY_EXPRESSION = contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.PatternExcludesFocusedKey);
        ShowNextSearchExcludeAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, contextkey_1.IContextKeyService)
        ], ShowNextSearchExcludeAction);
        return ShowNextSearchExcludeAction;
    }(actions_1.Action));
    exports.ShowNextSearchExcludeAction = ShowNextSearchExcludeAction;
    var ShowPreviousSearchExcludeAction = (function (_super) {
        __extends(ShowPreviousSearchExcludeAction, _super);
        function ShowPreviousSearchExcludeAction(id, label, viewletService, contextKeyService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.contextKeyService = contextKeyService;
            _this.enabled = _this.contextKeyService.contextMatchesRules(ShowPreviousSearchExcludeAction.CONTEXT_KEY_EXPRESSION);
            return _this;
        }
        ShowPreviousSearchExcludeAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchExcludePattern;
            searchAndReplaceWidget.showPreviousTerm();
            return winjs_base_1.TPromise.as(null);
        };
        ShowPreviousSearchExcludeAction.ID = 'search.history.showPreviousExcludePattern';
        ShowPreviousSearchExcludeAction.LABEL = nls.localize('previousSearchExcludePattern', "Show Previous Search Exclude Pattern");
        ShowPreviousSearchExcludeAction.CONTEXT_KEY_EXPRESSION = contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.PatternExcludesFocusedKey);
        ShowPreviousSearchExcludeAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, contextkey_1.IContextKeyService)
        ], ShowPreviousSearchExcludeAction);
        return ShowPreviousSearchExcludeAction;
    }(actions_1.Action));
    exports.ShowPreviousSearchExcludeAction = ShowPreviousSearchExcludeAction;
    var ShowNextSearchTermAction = (function (_super) {
        __extends(ShowNextSearchTermAction, _super);
        function ShowNextSearchTermAction(id, label, viewletService, contextKeyService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.contextKeyService = contextKeyService;
            _this.enabled = _this.contextKeyService.contextMatchesRules(ShowNextSearchTermAction.CONTEXT_KEY_EXPRESSION);
            return _this;
        }
        ShowNextSearchTermAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchAndReplaceWidget;
            searchAndReplaceWidget.showNextSearchTerm();
            return winjs_base_1.TPromise.as(null);
        };
        ShowNextSearchTermAction.ID = 'search.history.showNext';
        ShowNextSearchTermAction.LABEL = nls.localize('nextSearchTerm', "Show Next Search Term");
        ShowNextSearchTermAction.CONTEXT_KEY_EXPRESSION = contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.SearchInputBoxFocusedKey);
        ShowNextSearchTermAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, contextkey_1.IContextKeyService)
        ], ShowNextSearchTermAction);
        return ShowNextSearchTermAction;
    }(actions_1.Action));
    exports.ShowNextSearchTermAction = ShowNextSearchTermAction;
    var ShowPreviousSearchTermAction = (function (_super) {
        __extends(ShowPreviousSearchTermAction, _super);
        function ShowPreviousSearchTermAction(id, label, viewletService, contextKeyService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.contextKeyService = contextKeyService;
            _this.enabled = _this.contextKeyService.contextMatchesRules(ShowPreviousSearchTermAction.CONTEXT_KEY_EXPRESSION);
            return _this;
        }
        ShowPreviousSearchTermAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchAndReplaceWidget;
            searchAndReplaceWidget.showPreviousSearchTerm();
            return winjs_base_1.TPromise.as(null);
        };
        ShowPreviousSearchTermAction.ID = 'search.history.showPrevious';
        ShowPreviousSearchTermAction.LABEL = nls.localize('previousSearchTerm', "Show Previous Search Term");
        ShowPreviousSearchTermAction.CONTEXT_KEY_EXPRESSION = contextkey_1.ContextKeyExpr.and(Constants.SearchViewletVisibleKey, Constants.SearchInputBoxFocusedKey);
        ShowPreviousSearchTermAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, contextkey_1.IContextKeyService)
        ], ShowPreviousSearchTermAction);
        return ShowPreviousSearchTermAction;
    }(actions_1.Action));
    exports.ShowPreviousSearchTermAction = ShowPreviousSearchTermAction;
    var FocusNextInputAction = (function (_super) {
        __extends(FocusNextInputAction, _super);
        function FocusNextInputAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FocusNextInputAction.prototype.run = function () {
            this.viewletService.getActiveViewlet().focusNextInputBox();
            return winjs_base_1.TPromise.as(null);
        };
        FocusNextInputAction.ID = 'search.focus.nextInputBox';
        FocusNextInputAction.LABEL = nls.localize('focusNextInputBox', "Focus Next Input Box");
        FocusNextInputAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FocusNextInputAction);
        return FocusNextInputAction;
    }(actions_1.Action));
    exports.FocusNextInputAction = FocusNextInputAction;
    var FocusPreviousInputAction = (function (_super) {
        __extends(FocusPreviousInputAction, _super);
        function FocusPreviousInputAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FocusPreviousInputAction.prototype.run = function () {
            this.viewletService.getActiveViewlet().focusPreviousInputBox();
            return winjs_base_1.TPromise.as(null);
        };
        FocusPreviousInputAction.ID = 'search.focus.previousInputBox';
        FocusPreviousInputAction.LABEL = nls.localize('focusPreviousInputBox', "Focus Previous Input Box");
        FocusPreviousInputAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FocusPreviousInputAction);
        return FocusPreviousInputAction;
    }(actions_1.Action));
    exports.FocusPreviousInputAction = FocusPreviousInputAction;
    var OpenSearchViewletAction = (function (_super) {
        __extends(OpenSearchViewletAction, _super);
        function OpenSearchViewletAction(id, label, viewletService, editorService) {
            return _super.call(this, id, label, Constants.VIEWLET_ID, viewletService, editorService) || this;
        }
        OpenSearchViewletAction.prototype.run = function () {
            var _this = this;
            var activeViewlet = this.viewletService.getActiveViewlet();
            var searchViewletWasOpen = activeViewlet && activeViewlet.getId() === Constants.VIEWLET_ID;
            return _super.prototype.run.call(this).then(function () {
                if (!searchViewletWasOpen) {
                    // Get the search viewlet and ensure that 'replace' is collapsed
                    var searchViewlet = _this.viewletService.getActiveViewlet();
                    if (searchViewlet && searchViewlet.getId() === Constants.VIEWLET_ID) {
                        var searchAndReplaceWidget = searchViewlet.searchAndReplaceWidget;
                        searchAndReplaceWidget.toggleReplace(false);
                    }
                }
            });
        };
        OpenSearchViewletAction = __decorate([
            __param(2, viewlet_2.IViewletService), __param(3, editorService_1.IWorkbenchEditorService)
        ], OpenSearchViewletAction);
        return OpenSearchViewletAction;
    }(viewlet_1.ToggleViewletAction));
    exports.OpenSearchViewletAction = OpenSearchViewletAction;
    var FocusActiveEditorAction = (function (_super) {
        __extends(FocusActiveEditorAction, _super);
        function FocusActiveEditorAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        FocusActiveEditorAction.prototype.run = function () {
            var editor = this.editorService.getActiveEditor();
            if (editor) {
                editor.focus();
            }
            return winjs_base_1.TPromise.as(true);
        };
        FocusActiveEditorAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], FocusActiveEditorAction);
        return FocusActiveEditorAction;
    }(actions_1.Action));
    exports.FocusActiveEditorAction = FocusActiveEditorAction;
    var FindOrReplaceInFilesAction = (function (_super) {
        __extends(FindOrReplaceInFilesAction, _super);
        function FindOrReplaceInFilesAction(id, label, viewletService, expandSearchReplaceWidget, selectWidgetText, focusReplace) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.expandSearchReplaceWidget = expandSearchReplaceWidget;
            _this.selectWidgetText = selectWidgetText;
            _this.focusReplace = focusReplace;
            return _this;
        }
        FindOrReplaceInFilesAction.prototype.run = function () {
            var _this = this;
            var viewlet = this.viewletService.getActiveViewlet();
            var searchViewletWasOpen = viewlet && viewlet.getId() === Constants.VIEWLET_ID;
            return this.viewletService.openViewlet(Constants.VIEWLET_ID, true).then(function (viewlet) {
                if (!searchViewletWasOpen || _this.expandSearchReplaceWidget) {
                    var searchAndReplaceWidget = viewlet.searchAndReplaceWidget;
                    searchAndReplaceWidget.toggleReplace(_this.expandSearchReplaceWidget);
                    searchAndReplaceWidget.focus(_this.selectWidgetText, _this.focusReplace);
                }
            });
        };
        return FindOrReplaceInFilesAction;
    }(actions_1.Action));
    exports.FindOrReplaceInFilesAction = FindOrReplaceInFilesAction;
    var FindInFilesAction = (function (_super) {
        __extends(FindInFilesAction, _super);
        function FindInFilesAction(id, label, viewletService) {
            return _super.call(this, id, label, viewletService, /*expandSearchReplaceWidget=*/ false, /*selectWidgetText=*/ true, /*focusReplace=*/ false) || this;
        }
        FindInFilesAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FindInFilesAction);
        return FindInFilesAction;
    }(FindOrReplaceInFilesAction));
    exports.FindInFilesAction = FindInFilesAction;
    var ReplaceInFilesAction = (function (_super) {
        __extends(ReplaceInFilesAction, _super);
        function ReplaceInFilesAction(id, label, viewletService) {
            return _super.call(this, id, label, viewletService, /*expandSearchReplaceWidget=*/ true, /*selectWidgetText=*/ false, /*focusReplace=*/ true) || this;
        }
        ReplaceInFilesAction.ID = 'workbench.action.replaceInFiles';
        ReplaceInFilesAction.LABEL = nls.localize('replaceInFiles', "Replace in Files");
        ReplaceInFilesAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], ReplaceInFilesAction);
        return ReplaceInFilesAction;
    }(FindOrReplaceInFilesAction));
    exports.ReplaceInFilesAction = ReplaceInFilesAction;
    var CloseReplaceAction = (function (_super) {
        __extends(CloseReplaceAction, _super);
        function CloseReplaceAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        CloseReplaceAction.prototype.run = function () {
            var searchAndReplaceWidget = this.viewletService.getActiveViewlet().searchAndReplaceWidget;
            searchAndReplaceWidget.toggleReplace(false);
            searchAndReplaceWidget.focus();
            return winjs_base_1.TPromise.as(null);
        };
        CloseReplaceAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], CloseReplaceAction);
        return CloseReplaceAction;
    }(actions_1.Action));
    exports.CloseReplaceAction = CloseReplaceAction;
    var FindInWorkspaceAction = (function (_super) {
        __extends(FindInWorkspaceAction, _super);
        function FindInWorkspaceAction(viewletService) {
            var _this = _super.call(this, FindInWorkspaceAction.ID, nls.localize('findInWorkspace', "Find in Workspace...")) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FindInWorkspaceAction.prototype.run = function (event) {
            return this.viewletService.openViewlet(Constants.VIEWLET_ID, true).then(function (viewlet) {
                viewlet.searchInFolder(null);
            });
        };
        FindInWorkspaceAction.ID = 'filesExplorer.findInWorkspace';
        FindInWorkspaceAction = __decorate([
            __param(0, viewlet_2.IViewletService)
        ], FindInWorkspaceAction);
        return FindInWorkspaceAction;
    }(actions_1.Action));
    exports.FindInWorkspaceAction = FindInWorkspaceAction;
    var FindInFolderAction = (function (_super) {
        __extends(FindInFolderAction, _super);
        function FindInFolderAction(resource, instantiationService) {
            var _this = _super.call(this, FindInFolderAction.ID, nls.localize('findInFolder', "Find in Folder...")) || this;
            _this.instantiationService = instantiationService;
            _this.resource = resource;
            return _this;
        }
        FindInFolderAction.prototype.run = function (event) {
            return this.instantiationService.invokeFunction.apply(this.instantiationService, [exports.findInFolderCommand, this.resource]);
        };
        FindInFolderAction.ID = 'filesExplorer.findInFolder';
        FindInFolderAction = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], FindInFolderAction);
        return FindInFolderAction;
    }(actions_1.Action));
    exports.FindInFolderAction = FindInFolderAction;
    exports.findInFolderCommand = function (accessor, resource) {
        var listService = accessor.get(listService_1.IListService);
        var viewletService = accessor.get(viewlet_2.IViewletService);
        if (!uri_1.default.isUri(resource)) {
            var focused = listService.getFocused() ? listService.getFocused().getFocus() : void 0;
            if (focused) {
                var file = files_1.explorerItemToFileResource(focused);
                if (file) {
                    resource = file.isDirectory ? file.resource : uri_1.default.file(paths.dirname(file.resource.fsPath));
                }
            }
        }
        viewletService.openViewlet(Constants.VIEWLET_ID, true).then(function (viewlet) {
            if (resource) {
                viewlet.searchInFolder(resource);
            }
        }).done(null, errors.onUnexpectedError);
    };
    var RefreshAction = (function (_super) {
        __extends(RefreshAction, _super);
        function RefreshAction(viewlet) {
            var _this = _super.call(this, 'refresh') || this;
            _this.viewlet = viewlet;
            _this.label = nls.localize('RefreshAction.label', "Refresh");
            _this.enabled = false;
            _this.class = 'search-action refresh';
            return _this;
        }
        RefreshAction.prototype.run = function () {
            this.viewlet.onQueryChanged(true);
            return winjs_base_1.TPromise.as(null);
        };
        return RefreshAction;
    }(actions_1.Action));
    exports.RefreshAction = RefreshAction;
    var CollapseAllAction = (function (_super) {
        __extends(CollapseAllAction, _super);
        function CollapseAllAction(viewlet) {
            var _this = _super.call(this, viewlet.getControl(), false) || this;
            _this.class = 'search-action collapse';
            return _this;
        }
        return CollapseAllAction;
    }(treeDefaults_1.CollapseAllAction));
    exports.CollapseAllAction = CollapseAllAction;
    var ClearSearchResultsAction = (function (_super) {
        __extends(ClearSearchResultsAction, _super);
        function ClearSearchResultsAction(viewlet) {
            var _this = _super.call(this, 'clearSearchResults') || this;
            _this.viewlet = viewlet;
            _this.label = nls.localize('ClearSearchResultsAction.label', "Clear Search Results");
            _this.enabled = false;
            _this.class = 'search-action clear-search-results';
            return _this;
        }
        ClearSearchResultsAction.prototype.run = function () {
            this.viewlet.clearSearchResults();
            return winjs_base_1.TPromise.as(null);
        };
        return ClearSearchResultsAction;
    }(actions_1.Action));
    exports.ClearSearchResultsAction = ClearSearchResultsAction;
    var FocusNextSearchResultAction = (function (_super) {
        __extends(FocusNextSearchResultAction, _super);
        function FocusNextSearchResultAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FocusNextSearchResultAction.prototype.run = function () {
            return this.viewletService.openViewlet(Constants.VIEWLET_ID).then(function (searchViewlet) {
                searchViewlet.selectNextMatch();
            });
        };
        FocusNextSearchResultAction.ID = 'search.action.focusNextSearchResult';
        FocusNextSearchResultAction.LABEL = nls.localize('FocusNextSearchResult.label', "Focus Next Search Result");
        FocusNextSearchResultAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FocusNextSearchResultAction);
        return FocusNextSearchResultAction;
    }(actions_1.Action));
    exports.FocusNextSearchResultAction = FocusNextSearchResultAction;
    var FocusPreviousSearchResultAction = (function (_super) {
        __extends(FocusPreviousSearchResultAction, _super);
        function FocusPreviousSearchResultAction(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FocusPreviousSearchResultAction.prototype.run = function () {
            return this.viewletService.openViewlet(Constants.VIEWLET_ID).then(function (searchViewlet) {
                searchViewlet.selectPreviousMatch();
            });
        };
        FocusPreviousSearchResultAction.ID = 'search.action.focusPreviousSearchResult';
        FocusPreviousSearchResultAction.LABEL = nls.localize('FocusPreviousSearchResult.label', "Focus Previous Search Result");
        FocusPreviousSearchResultAction = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FocusPreviousSearchResultAction);
        return FocusPreviousSearchResultAction;
    }(actions_1.Action));
    exports.FocusPreviousSearchResultAction = FocusPreviousSearchResultAction;
    var AbstractSearchAndReplaceAction = (function (_super) {
        __extends(AbstractSearchAndReplaceAction, _super);
        function AbstractSearchAndReplaceAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Returns element to focus after removing the given element
         */
        AbstractSearchAndReplaceAction.prototype.getElementToFocusAfterRemoved = function (viewer, elementToBeRemoved) {
            var elementToFocus = this.getNextElementAfterRemoved(viewer, elementToBeRemoved);
            if (!elementToFocus) {
                elementToFocus = this.getPreviousElementAfterRemoved(viewer, elementToBeRemoved);
            }
            return elementToFocus;
        };
        AbstractSearchAndReplaceAction.prototype.getNextElementAfterRemoved = function (viewer, element) {
            var navigator = this.getNavigatorAt(element, viewer);
            if (element instanceof searchModel_1.FolderMatch) {
                // If file match is removed then next element is the next file match
                while (!!navigator.next() && !(navigator.current() instanceof searchModel_1.FolderMatch)) { }
                ;
            }
            else if (element instanceof searchModel_1.FileMatch) {
                // If file match is removed then next element is the next file match
                while (!!navigator.next() && !(navigator.current() instanceof searchModel_1.FileMatch)) { }
                ;
            }
            else {
                navigator.next();
            }
            return navigator.current();
        };
        AbstractSearchAndReplaceAction.prototype.getPreviousElementAfterRemoved = function (viewer, element) {
            var navigator = this.getNavigatorAt(element, viewer);
            var previousElement = navigator.previous();
            if (element instanceof searchModel_1.Match && element.parent().matches().length === 1) {
                // If this is the only match, then the file match is also removed
                // Hence take the previous element to file match
                previousElement = navigator.previous();
            }
            return previousElement;
        };
        AbstractSearchAndReplaceAction.prototype.getNavigatorAt = function (element, viewer) {
            var navigator = viewer.getNavigator();
            while (navigator.current() !== element && !!navigator.next()) { }
            return navigator;
        };
        return AbstractSearchAndReplaceAction;
    }(actions_1.Action));
    exports.AbstractSearchAndReplaceAction = AbstractSearchAndReplaceAction;
    var RemoveAction = (function (_super) {
        __extends(RemoveAction, _super);
        function RemoveAction(viewer, element) {
            var _this = _super.call(this, 'remove', nls.localize('RemoveAction.label', "Remove"), 'action-remove') || this;
            _this.viewer = viewer;
            _this.element = element;
            return _this;
        }
        RemoveAction.prototype.run = function () {
            var nextFocusElement = this.getElementToFocusAfterRemoved(this.viewer, this.element);
            if (nextFocusElement) {
                this.viewer.setFocus(nextFocusElement);
            }
            var elementToRefresh;
            var element = this.element;
            if (element instanceof searchModel_1.FolderMatch) {
                var parent_1 = element.parent();
                parent_1.remove(element);
                elementToRefresh = parent_1;
            }
            else if (element instanceof searchModel_1.FileMatch) {
                var parent_2 = element.parent();
                parent_2.remove(element);
                elementToRefresh = parent_2;
            }
            else if (element instanceof searchModel_1.Match) {
                var parent_3 = element.parent();
                parent_3.remove(element);
                elementToRefresh = parent_3.count() === 0 ? parent_3.parent() : parent_3;
            }
            this.viewer.DOMFocus();
            return this.viewer.refresh(elementToRefresh);
        };
        return RemoveAction;
    }(AbstractSearchAndReplaceAction));
    exports.RemoveAction = RemoveAction;
    var ReplaceAllAction = (function (_super) {
        __extends(ReplaceAllAction, _super);
        function ReplaceAllAction(viewer, fileMatch, viewlet, replaceService, keyBindingService, telemetryService) {
            var _this = _super.call(this, Constants.ReplaceAllInFileActionId, appendKeyBindingLabel(nls.localize('file.replaceAll.label', "Replace All"), keyBindingService.lookupKeybinding(Constants.ReplaceAllInFileActionId), keyBindingService), 'action-replace-all') || this;
            _this.viewer = viewer;
            _this.fileMatch = fileMatch;
            _this.viewlet = viewlet;
            _this.replaceService = replaceService;
            _this.telemetryService = telemetryService;
            return _this;
        }
        ReplaceAllAction.prototype.run = function () {
            var _this = this;
            this.telemetryService.publicLog('replaceAll.action.selected');
            var nextFocusElement = this.getElementToFocusAfterRemoved(this.viewer, this.fileMatch);
            return this.fileMatch.parent().replace(this.fileMatch).then(function () {
                if (nextFocusElement) {
                    _this.viewer.setFocus(nextFocusElement);
                }
                _this.viewer.DOMFocus();
                _this.viewlet.open(_this.fileMatch, true);
            });
        };
        ReplaceAllAction = __decorate([
            __param(3, replace_1.IReplaceService),
            __param(4, keybinding_1.IKeybindingService),
            __param(5, telemetry_1.ITelemetryService)
        ], ReplaceAllAction);
        return ReplaceAllAction;
    }(AbstractSearchAndReplaceAction));
    exports.ReplaceAllAction = ReplaceAllAction;
    var ReplaceAction = (function (_super) {
        __extends(ReplaceAction, _super);
        function ReplaceAction(viewer, element, viewlet, replaceService, keyBindingService, editorService, telemetryService) {
            var _this = _super.call(this, Constants.ReplaceActionId, appendKeyBindingLabel(nls.localize('match.replace.label', "Replace"), keyBindingService.lookupKeybinding(Constants.ReplaceActionId), keyBindingService), 'action-replace') || this;
            _this.viewer = viewer;
            _this.element = element;
            _this.viewlet = viewlet;
            _this.replaceService = replaceService;
            _this.editorService = editorService;
            _this.telemetryService = telemetryService;
            return _this;
        }
        ReplaceAction.prototype.run = function () {
            var _this = this;
            this.enabled = false;
            this.telemetryService.publicLog('replace.action.selected');
            return this.element.parent().replace(this.element).then(function () {
                var elementToFocus = _this.getElementToFocusAfterReplace();
                if (elementToFocus) {
                    _this.viewer.setFocus(elementToFocus);
                }
                var elementToShowReplacePreview = _this.getElementToShowReplacePreview(elementToFocus);
                _this.viewer.DOMFocus();
                if (!elementToShowReplacePreview || _this.hasToOpenFile()) {
                    _this.viewlet.open(_this.element, true);
                }
                else {
                    _this.replaceService.openReplacePreview(elementToShowReplacePreview, true);
                }
            });
        };
        ReplaceAction.prototype.getElementToFocusAfterReplace = function () {
            var navigator = this.viewer.getNavigator();
            var fileMatched = false;
            var elementToFocus = null;
            do {
                elementToFocus = navigator.current();
                if (elementToFocus instanceof searchModel_1.Match) {
                    if (elementToFocus.parent().id() === this.element.parent().id()) {
                        fileMatched = true;
                        if (this.element.range().getStartPosition().isBeforeOrEqual(elementToFocus.range().getStartPosition())) {
                            // Closest next match in the same file
                            break;
                        }
                    }
                    else if (fileMatched) {
                        // First match in the next file (if expanded)
                        break;
                    }
                }
                else if (fileMatched) {
                    if (!this.viewer.isExpanded(elementToFocus)) {
                        // Next file match (if collapsed)
                        break;
                    }
                }
            } while (!!navigator.next());
            return elementToFocus;
        };
        ReplaceAction.prototype.getElementToShowReplacePreview = function (elementToFocus) {
            if (this.hasSameParent(elementToFocus)) {
                return elementToFocus;
            }
            var previousElement = this.getPreviousElementAfterRemoved(this.viewer, this.element);
            if (this.hasSameParent(previousElement)) {
                return previousElement;
            }
            return null;
        };
        ReplaceAction.prototype.hasSameParent = function (element) {
            return element && element instanceof searchModel_1.Match && element.parent().resource() === this.element.parent().resource();
        };
        ReplaceAction.prototype.hasToOpenFile = function () {
            var file = editor_1.toResource(this.editorService.getActiveEditorInput(), { filter: 'file' });
            if (file) {
                return paths.isEqual(file.fsPath, this.element.parent().resource().fsPath);
            }
            return false;
        };
        ReplaceAction = __decorate([
            __param(3, replace_1.IReplaceService),
            __param(4, keybinding_1.IKeybindingService),
            __param(5, editorService_1.IWorkbenchEditorService),
            __param(6, telemetry_1.ITelemetryService)
        ], ReplaceAction);
        return ReplaceAction;
    }(AbstractSearchAndReplaceAction));
    exports.ReplaceAction = ReplaceAction;
});
//# sourceMappingURL=searchActions.js.map