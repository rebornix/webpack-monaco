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
define(["require", "exports", "vs/nls", "vs/base/common/uri", "vs/base/common/async", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/browser/dom", "vs/base/common/platform", "vs/base/parts/tree/browser/treeImpl", "vs/editor/contrib/suggest/browser/suggest", "vs/editor/contrib/suggest/browser/suggestController", "vs/editor/common/editorContextKeys", "vs/editor/common/modes", "vs/editor/common/editorCommonExtensions", "vs/editor/common/services/modelService", "vs/platform/actions/common/actions", "vs/platform/instantiation/common/serviceCollection", "vs/platform/contextkey/common/contextkey", "vs/platform/telemetry/common/telemetry", "vs/platform/instantiation/common/instantiation", "vs/platform/storage/common/storage", "vs/workbench/parts/debug/electron-browser/replViewer", "vs/workbench/parts/debug/electron-browser/replEditor", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/browser/debugActions", "vs/workbench/parts/debug/common/replHistory", "vs/workbench/browser/panel", "vs/workbench/services/panel/common/panelService", "vs/platform/list/browser/listService", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "electron", "vs/css!vs/workbench/parts/debug/browser/media/repl"], function (require, exports, nls, uri_1, async_1, winjs_base_1, errors, dom, platform_1, treeImpl_1, suggest_1, suggestController_1, editorContextKeys_1, modes, editorCommonExtensions_1, modelService_1, actions_1, serviceCollection_1, contextkey_1, telemetry_1, instantiation_1, storage_1, replViewer_1, replEditor_1, debug, debugActions_1, replHistory_1, panel_1, panelService_1, listService_1, styler_1, themeService_1, electron_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $ = dom.$;
    var replTreeOptions = {
        twistiePixels: 20,
        ariaLabel: nls.localize('replAriaLabel', "Read Eval Print Loop Panel"),
        keyboardSupport: false
    };
    var HISTORY_STORAGE_KEY = 'debug.repl.history';
    var IPrivateReplService = instantiation_1.createDecorator('privateReplService');
    var Repl = (function (_super) {
        __extends(Repl, _super);
        function Repl(debugService, telemetryService, instantiationService, storageService, panelService, themeService, modelService, contextKeyService, listService) {
            var _this = _super.call(this, debug.REPL_ID, telemetryService, themeService) || this;
            _this.debugService = debugService;
            _this.instantiationService = instantiationService;
            _this.storageService = storageService;
            _this.panelService = panelService;
            _this.themeService = themeService;
            _this.modelService = modelService;
            _this.contextKeyService = contextKeyService;
            _this.listService = listService;
            _this.replInputHeight = Repl.REPL_INPUT_INITIAL_HEIGHT;
            _this.registerListeners();
            return _this;
        }
        Repl.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.debugService.getModel().onDidChangeReplElements(function () {
                _this.refreshReplElements(_this.debugService.getModel().getReplElements().length === 0);
            }));
            this.toUnbind.push(this.panelService.onDidPanelOpen(function (panel) { return _this.refreshReplElements(true); }));
        };
        Repl.prototype.refreshReplElements = function (noDelay) {
            var _this = this;
            if (this.tree && this.isVisible()) {
                if (this.refreshTimeoutHandle) {
                    return; // refresh already triggered
                }
                var delay = noDelay ? 0 : Repl.REFRESH_DELAY;
                this.refreshTimeoutHandle = setTimeout(function () {
                    _this.refreshTimeoutHandle = null;
                    var previousScrollPosition = _this.tree.getScrollPosition();
                    _this.tree.refresh().then(function () {
                        if (previousScrollPosition === 1 || previousScrollPosition === 0) {
                            // Only scroll if we were scrolled all the way down before tree refreshed #10486
                            _this.tree.setScrollPosition(1);
                        }
                    }, errors.onUnexpectedError);
                }, delay);
            }
        };
        Repl.prototype.create = function (parent) {
            _super.prototype.create.call(this, parent);
            var container = dom.append(parent.getHTMLElement(), $('.repl'));
            this.treeContainer = dom.append(container, $('.repl-tree'));
            this.createReplInput(container);
            this.characterWidthSurveyor = dom.append(container, $('.surveyor'));
            this.characterWidthSurveyor.textContent = Repl.HALF_WIDTH_TYPICAL;
            for (var i = 0; i < 10; i++) {
                this.characterWidthSurveyor.textContent += this.characterWidthSurveyor.textContent;
            }
            this.characterWidthSurveyor.style.fontSize = platform_1.isMacintosh ? '12px' : '14px';
            this.renderer = this.instantiationService.createInstance(replViewer_1.ReplExpressionsRenderer);
            var controller = this.instantiationService.createInstance(replViewer_1.ReplExpressionsController, new replViewer_1.ReplExpressionsActionProvider(this.instantiationService), actions_1.MenuId.DebugConsoleContext);
            controller.toFocusOnClick = this.replInput;
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: new replViewer_1.ReplExpressionsDataSource(),
                renderer: this.renderer,
                accessibilityProvider: new replViewer_1.ReplExpressionsAccessibilityProvider(),
                controller: controller
            }, replTreeOptions);
            this.toUnbind.push(styler_1.attachListStyler(this.tree, this.themeService));
            this.toUnbind.push(this.listService.register(this.tree));
            if (!Repl.HISTORY) {
                Repl.HISTORY = new replHistory_1.ReplHistory(JSON.parse(this.storageService.get(HISTORY_STORAGE_KEY, storage_1.StorageScope.WORKSPACE, '[]')));
            }
            return this.tree.setInput(this.debugService.getModel());
        };
        Repl.prototype.createReplInput = function (container) {
            var _this = this;
            this.replInputContainer = dom.append(container, $('.repl-input-wrapper'));
            var scopedContextKeyService = this.contextKeyService.createScoped(this.replInputContainer);
            this.toUnbind.push(scopedContextKeyService);
            debug.CONTEXT_IN_DEBUG_REPL.bindTo(scopedContextKeyService).set(true);
            var onFirstReplLine = debug.CONTEXT_ON_FIRST_DEBUG_REPL_LINE.bindTo(scopedContextKeyService);
            onFirstReplLine.set(true);
            var onLastReplLine = debug.CONTEXT_ON_LAST_DEBUG_REPL_LINE.bindTo(scopedContextKeyService);
            onLastReplLine.set(true);
            var scopedInstantiationService = this.instantiationService.createChild(new serviceCollection_1.ServiceCollection([contextkey_1.IContextKeyService, scopedContextKeyService], [IPrivateReplService, this]));
            this.replInput = scopedInstantiationService.createInstance(replEditor_1.ReplInputEditor, this.replInputContainer, this.getReplInputOptions());
            var model = this.modelService.createModel('', null, uri_1.default.parse(debug.DEBUG_SCHEME + ":input"));
            this.replInput.setModel(model);
            modes.SuggestRegistry.register({ scheme: debug.DEBUG_SCHEME }, {
                triggerCharacters: ['.'],
                provideCompletionItems: function (model, position, token) {
                    var word = _this.replInput.getModel().getWordAtPosition(position);
                    var overwriteBefore = word ? word.word.length : 0;
                    var text = _this.replInput.getModel().getLineContent(position.lineNumber);
                    var focusedStackFrame = _this.debugService.getViewModel().focusedStackFrame;
                    var frameId = focusedStackFrame ? focusedStackFrame.frameId : undefined;
                    var focusedProcess = _this.debugService.getViewModel().focusedProcess;
                    var completions = focusedProcess ? focusedProcess.completions(frameId, text, position, overwriteBefore) : winjs_base_1.TPromise.as([]);
                    return async_1.wireCancellationToken(token, completions.then(function (suggestions) { return ({
                        suggestions: suggestions
                    }); }));
                }
            });
            this.toUnbind.push(this.replInput.onDidScrollChange(function (e) {
                if (!e.scrollHeightChanged) {
                    return;
                }
                _this.replInputHeight = Math.max(Repl.REPL_INPUT_INITIAL_HEIGHT, Math.min(Repl.REPL_INPUT_MAX_HEIGHT, e.scrollHeight, _this.dimension.height));
                _this.layout(_this.dimension);
            }));
            this.toUnbind.push(this.replInput.onDidChangeCursorPosition(function (e) {
                onFirstReplLine.set(e.position.lineNumber === 1);
                onLastReplLine.set(e.position.lineNumber === _this.replInput.getModel().getLineCount());
            }));
            this.toUnbind.push(dom.addStandardDisposableListener(this.replInputContainer, dom.EventType.FOCUS, function () { return dom.addClass(_this.replInputContainer, 'synthetic-focus'); }));
            this.toUnbind.push(dom.addStandardDisposableListener(this.replInputContainer, dom.EventType.BLUR, function () { return dom.removeClass(_this.replInputContainer, 'synthetic-focus'); }));
        };
        Repl.prototype.navigateHistory = function (previous) {
            var historyInput = previous ? Repl.HISTORY.previous() : Repl.HISTORY.next();
            if (historyInput) {
                Repl.HISTORY.remember(this.replInput.getValue(), previous);
                this.replInput.setValue(historyInput);
                // always leave cursor at the end.
                this.replInput.setPosition({ lineNumber: 1, column: historyInput.length + 1 });
            }
        };
        Repl.prototype.acceptReplInput = function () {
            this.debugService.addReplExpression(this.replInput.getValue());
            Repl.HISTORY.evaluated(this.replInput.getValue());
            this.replInput.setValue('');
            // Trigger a layout to shrink a potential multi line input
            this.replInputHeight = Repl.REPL_INPUT_INITIAL_HEIGHT;
            this.layout(this.dimension);
        };
        Repl.prototype.getVisibleContent = function () {
            var text = '';
            var navigator = this.tree.getNavigator();
            // skip first navigator element - the root node
            while (navigator.next()) {
                if (text) {
                    text += "\n";
                }
                text += navigator.current().toString();
            }
            return text;
        };
        Repl.prototype.layout = function (dimension) {
            this.dimension = dimension;
            if (this.tree) {
                this.renderer.setWidth(dimension.width - 25, this.characterWidthSurveyor.clientWidth / this.characterWidthSurveyor.textContent.length);
                var treeHeight = dimension.height - this.replInputHeight;
                this.treeContainer.style.height = treeHeight + "px";
                this.tree.layout(treeHeight);
            }
            this.replInputContainer.style.height = this.replInputHeight + "px";
            this.replInput.layout({ width: dimension.width - 20, height: this.replInputHeight });
        };
        Repl.prototype.focus = function () {
            this.replInput.focus();
        };
        Repl.prototype.getActions = function () {
            var _this = this;
            if (!this.actions) {
                this.actions = [
                    this.instantiationService.createInstance(debugActions_1.ClearReplAction, debugActions_1.ClearReplAction.ID, debugActions_1.ClearReplAction.LABEL)
                ];
                this.actions.forEach(function (a) {
                    _this.toUnbind.push(a);
                });
            }
            return this.actions;
        };
        Repl.prototype.shutdown = function () {
            var replHistory = Repl.HISTORY.save();
            if (replHistory.length) {
                this.storageService.store(HISTORY_STORAGE_KEY, JSON.stringify(replHistory), storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(HISTORY_STORAGE_KEY, storage_1.StorageScope.WORKSPACE);
            }
        };
        Repl.prototype.getReplInputOptions = function () {
            return {
                wordWrap: 'on',
                overviewRulerLanes: 0,
                glyphMargin: false,
                lineNumbers: 'off',
                folding: false,
                selectOnLineNumbers: false,
                selectionHighlight: false,
                scrollbar: {
                    horizontal: 'hidden'
                },
                lineDecorationsWidth: 0,
                scrollBeyondLastLine: false,
                renderLineHighlight: 'none',
                fixedOverflowWidgets: true,
                acceptSuggestionOnEnter: 'smart',
                minimap: {
                    enabled: false
                }
            };
        };
        Repl.prototype.dispose = function () {
            this.replInput.dispose();
            _super.prototype.dispose.call(this);
        };
        Repl.HALF_WIDTH_TYPICAL = 'n';
        Repl.REFRESH_DELAY = 500; // delay in ms to refresh the repl for new elements to show
        Repl.REPL_INPUT_INITIAL_HEIGHT = 19;
        Repl.REPL_INPUT_MAX_HEIGHT = 170;
        Repl = __decorate([
            __param(0, debug.IDebugService),
            __param(1, telemetry_1.ITelemetryService),
            __param(2, instantiation_1.IInstantiationService),
            __param(3, storage_1.IStorageService),
            __param(4, panelService_1.IPanelService),
            __param(5, themeService_1.IThemeService),
            __param(6, modelService_1.IModelService),
            __param(7, contextkey_1.IContextKeyService),
            __param(8, listService_1.IListService)
        ], Repl);
        return Repl;
    }(panel_1.Panel));
    exports.Repl = Repl;
    var ReplHistoryPreviousAction = (function (_super) {
        __extends(ReplHistoryPreviousAction, _super);
        function ReplHistoryPreviousAction() {
            return _super.call(this, {
                id: 'repl.action.historyPrevious',
                label: nls.localize('actions.repl.historyPrevious', "History Previous"),
                alias: 'History Previous',
                precondition: debug.CONTEXT_IN_DEBUG_REPL,
                kbOpts: {
                    kbExpr: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.textFocus, debug.CONTEXT_ON_FIRST_DEBUG_REPL_LINE),
                    primary: 16 /* UpArrow */,
                    weight: 50
                },
                menuOpts: {
                    group: 'debug'
                }
            }) || this;
        }
        ReplHistoryPreviousAction.prototype.run = function (accessor, editor) {
            accessor.get(IPrivateReplService).navigateHistory(true);
        };
        ReplHistoryPreviousAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ReplHistoryPreviousAction);
        return ReplHistoryPreviousAction;
    }(editorCommonExtensions_1.EditorAction));
    var ReplHistoryNextAction = (function (_super) {
        __extends(ReplHistoryNextAction, _super);
        function ReplHistoryNextAction() {
            return _super.call(this, {
                id: 'repl.action.historyNext',
                label: nls.localize('actions.repl.historyNext', "History Next"),
                alias: 'History Next',
                precondition: debug.CONTEXT_IN_DEBUG_REPL,
                kbOpts: {
                    kbExpr: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.textFocus, debug.CONTEXT_ON_LAST_DEBUG_REPL_LINE),
                    primary: 18 /* DownArrow */,
                    weight: 50
                },
                menuOpts: {
                    group: 'debug'
                }
            }) || this;
        }
        ReplHistoryNextAction.prototype.run = function (accessor, editor) {
            accessor.get(IPrivateReplService).navigateHistory(false);
        };
        ReplHistoryNextAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ReplHistoryNextAction);
        return ReplHistoryNextAction;
    }(editorCommonExtensions_1.EditorAction));
    var AcceptReplInputAction = (function (_super) {
        __extends(AcceptReplInputAction, _super);
        function AcceptReplInputAction() {
            return _super.call(this, {
                id: 'repl.action.acceptInput',
                label: nls.localize({ key: 'actions.repl.acceptInput', comment: ['Apply input from the debug console input box'] }, "REPL Accept Input"),
                alias: 'REPL Accept Input',
                precondition: debug.CONTEXT_IN_DEBUG_REPL,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 3 /* Enter */
                }
            }) || this;
        }
        AcceptReplInputAction.prototype.run = function (accessor, editor) {
            suggestController_1.SuggestController.get(editor).acceptSelectedSuggestion();
            accessor.get(IPrivateReplService).acceptReplInput();
        };
        AcceptReplInputAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], AcceptReplInputAction);
        return AcceptReplInputAction;
    }(editorCommonExtensions_1.EditorAction));
    var SuggestCommand = editorCommonExtensions_1.EditorCommand.bindToContribution(suggestController_1.SuggestController.get);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new SuggestCommand({
        id: 'repl.action.acceptSuggestion',
        precondition: contextkey_1.ContextKeyExpr.and(debug.CONTEXT_IN_DEBUG_REPL, suggest_1.Context.Visible),
        handler: function (x) { return x.acceptSelectedSuggestion(); },
        kbOpts: {
            weight: 50,
            kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
            primary: 17 /* RightArrow */
        }
    }));
    var ReplCopyAllAction = (function (_super) {
        __extends(ReplCopyAllAction, _super);
        function ReplCopyAllAction() {
            return _super.call(this, {
                id: 'repl.action.copyAll',
                label: nls.localize('actions.repl.copyAll', "Debug: Console Copy All"),
                alias: 'Debug Console Copy All',
                precondition: debug.CONTEXT_IN_DEBUG_REPL,
            }) || this;
        }
        ReplCopyAllAction.prototype.run = function (accessor, editor) {
            electron_1.clipboard.writeText(accessor.get(IPrivateReplService).getVisibleContent());
        };
        ReplCopyAllAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ReplCopyAllAction);
        return ReplCopyAllAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.ReplCopyAllAction = ReplCopyAllAction;
});
//# sourceMappingURL=repl.js.map