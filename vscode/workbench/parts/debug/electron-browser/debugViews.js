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
define(["require", "exports", "vs/nls", "vs/base/common/paths", "vs/base/common/async", "vs/base/browser/dom", "vs/base/browser/builder", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/common/events", "vs/workbench/browser/actions", "vs/base/parts/tree/browser/treeImpl", "vs/base/browser/ui/splitview/splitview", "vs/workbench/browser/viewlet", "vs/workbench/parts/views/browser/views", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/common/debugModel", "vs/workbench/parts/debug/electron-browser/debugViewer", "vs/workbench/parts/debug/browser/debugActions", "vs/platform/contextview/browser/contextView", "vs/platform/instantiation/common/instantiation", "vs/platform/actions/common/actions", "vs/platform/telemetry/common/telemetry", "vs/platform/keybinding/common/keybinding", "vs/platform/contextkey/common/contextkey", "vs/platform/list/browser/listService", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService"], function (require, exports, nls, paths, async_1, dom, builder, winjs_base_1, errors, events_1, actions_1, treeImpl_1, splitview_1, viewlet_1, views_1, debug_1, debugModel_1, viewer, debugActions_1, contextView_1, instantiation_1, actions_2, telemetry_1, keybinding_1, contextkey_1, listService_1, styler_1, themeService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function renderViewTree(container) {
        var treeContainer = document.createElement('div');
        dom.addClass(treeContainer, 'debug-view-content');
        container.appendChild(treeContainer);
        return treeContainer;
    }
    var $ = builder.$;
    var twistiePixels = 20;
    var VariablesView = (function (_super) {
        __extends(VariablesView, _super);
        function VariablesView(initialSize, options, contextMenuService, telemetryService, debugService, keybindingService, instantiationService, contextKeyService, listService, themeService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { sizing: splitview_1.ViewSizing.Flexible, ariaHeaderLabel: nls.localize('variablesSection', "Variables Section") }), keybindingService, contextMenuService) || this;
            _this.options = options;
            _this.telemetryService = telemetryService;
            _this.debugService = debugService;
            _this.instantiationService = instantiationService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.settings = options.viewletSettings;
            _this.variablesFocusedContext = debug_1.CONTEXT_VARIABLES_FOCUSED.bindTo(contextKeyService);
            // Use scheduler to prevent unnecessary flashing
            _this.onFocusStackFrameScheduler = new async_1.RunOnceScheduler(function () {
                // Always clear tree highlight to avoid ending up in a broken state #12203
                _this.tree.clearHighlight();
                _this.tree.refresh().then(function () {
                    var stackFrame = _this.debugService.getViewModel().focusedStackFrame;
                    if (stackFrame) {
                        return stackFrame.getScopes().then(function (scopes) {
                            if (scopes.length > 0 && !scopes[0].expensive) {
                                return _this.tree.expand(scopes[0]);
                            }
                            return undefined;
                        });
                    }
                    return undefined;
                }).done(null, errors.onUnexpectedError);
            }, 400);
            return _this;
        }
        VariablesView.prototype.renderHeader = function (container) {
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(this.options.name).appendTo(titleDiv);
            _super.prototype.renderHeader.call(this, container);
        };
        VariablesView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-variables');
            this.treeContainer = renderViewTree(container);
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: new viewer.VariablesDataSource(),
                renderer: this.instantiationService.createInstance(viewer.VariablesRenderer),
                accessibilityProvider: new viewer.VariablesAccessibilityProvider(),
                controller: this.instantiationService.createInstance(viewer.VariablesController, new viewer.VariablesActionProvider(this.instantiationService), actions_2.MenuId.DebugVariablesContext)
            }, {
                ariaLabel: nls.localize('variablesAriaTreeLabel', "Debug Variables"),
                twistiePixels: twistiePixels,
                keyboardSupport: false
            });
            this.toDispose.push(styler_1.attachListStyler(this.tree, this.themeService));
            this.toDispose.push(this.listService.register(this.tree, [this.variablesFocusedContext]));
            var viewModel = this.debugService.getViewModel();
            this.tree.setInput(viewModel);
            var collapseAction = this.instantiationService.createInstance(viewlet_1.CollapseAction, this.tree, false, 'explorer-action collapse-explorer');
            this.toolBar.setActions(actions_1.prepareActions([collapseAction]))();
            this.toDispose.push(viewModel.onDidFocusStackFrame(function (sf) {
                // Refresh the tree immediately if it is not visible.
                // Otherwise postpone the refresh until user stops stepping.
                if (!_this.tree.getContentHeight() || sf.explicit) {
                    _this.onFocusStackFrameScheduler.schedule(0);
                }
                else {
                    _this.onFocusStackFrameScheduler.schedule();
                }
            }));
            this.toDispose.push(this.debugService.onDidChangeState(function (state) {
                collapseAction.enabled = state === debug_1.State.Running || state === debug_1.State.Stopped;
            }));
            this.toDispose.push(this.debugService.getViewModel().onDidSelectExpression(function (expression) {
                if (!expression || !(expression instanceof debugModel_1.Variable)) {
                    return;
                }
                _this.tree.refresh(expression, false).then(function () {
                    _this.tree.setHighlight(expression);
                    _this.tree.addOneTimeListener(events_1.EventType.HIGHLIGHT, function (e) {
                        if (!e.highlight) {
                            _this.debugService.getViewModel().setSelectedExpression(null);
                        }
                    });
                }).done(null, errors.onUnexpectedError);
            }));
        };
        VariablesView.prototype.shutdown = function () {
            this.settings[VariablesView.MEMENTO] = (this.state === splitview_1.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        VariablesView.MEMENTO = 'variablesview.memento';
        VariablesView = __decorate([
            __param(2, contextView_1.IContextMenuService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, debug_1.IDebugService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, instantiation_1.IInstantiationService),
            __param(7, contextkey_1.IContextKeyService),
            __param(8, listService_1.IListService),
            __param(9, themeService_1.IThemeService)
        ], VariablesView);
        return VariablesView;
    }(views_1.CollapsibleView));
    exports.VariablesView = VariablesView;
    var WatchExpressionsView = (function (_super) {
        __extends(WatchExpressionsView, _super);
        function WatchExpressionsView(size, options, contextMenuService, debugService, keybindingService, instantiationService, contextKeyService, listService, themeService) {
            var _this = _super.call(this, size, __assign({}, options, { ariaHeaderLabel: nls.localize('expressionsSection', "Expressions Section"), sizing: splitview_1.ViewSizing.Flexible }), keybindingService, contextMenuService) || this;
            _this.options = options;
            _this.debugService = debugService;
            _this.instantiationService = instantiationService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.settings = options.viewletSettings;
            _this.toDispose.push(_this.debugService.getModel().onDidChangeWatchExpressions(function (we) {
                // only expand when a new watch expression is added.
                if (we instanceof debugModel_1.Expression) {
                    _this.expand();
                }
            }));
            _this.watchExpressionsFocusedContext = debug_1.CONTEXT_WATCH_EXPRESSIONS_FOCUSED.bindTo(contextKeyService);
            _this.onWatchExpressionsUpdatedScheduler = new async_1.RunOnceScheduler(function () {
                _this.tree.refresh().done(function () {
                    return _this.toReveal instanceof debugModel_1.Expression ? _this.tree.reveal(_this.toReveal) : winjs_base_1.TPromise.as(true);
                }, errors.onUnexpectedError);
            }, 50);
            return _this;
        }
        WatchExpressionsView.prototype.renderHeader = function (container) {
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(this.options.name).appendTo(titleDiv);
            _super.prototype.renderHeader.call(this, container);
        };
        WatchExpressionsView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-watch');
            this.treeContainer = renderViewTree(container);
            var actionProvider = new viewer.WatchExpressionsActionProvider(this.instantiationService);
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: new viewer.WatchExpressionsDataSource(),
                renderer: this.instantiationService.createInstance(viewer.WatchExpressionsRenderer, actionProvider, this.actionRunner),
                accessibilityProvider: new viewer.WatchExpressionsAccessibilityProvider(),
                controller: this.instantiationService.createInstance(viewer.WatchExpressionsController, actionProvider, actions_2.MenuId.DebugWatchContext),
                dnd: this.instantiationService.createInstance(viewer.WatchExpressionsDragAndDrop)
            }, {
                ariaLabel: nls.localize({ comment: ['Debug is a noun in this context, not a verb.'], key: 'watchAriaTreeLabel' }, "Debug Watch Expressions"),
                twistiePixels: twistiePixels,
                keyboardSupport: false
            });
            this.toDispose.push(styler_1.attachListStyler(this.tree, this.themeService));
            this.toDispose.push(this.listService.register(this.tree, [this.watchExpressionsFocusedContext]));
            this.tree.setInput(this.debugService.getModel());
            var addWatchExpressionAction = this.instantiationService.createInstance(debugActions_1.AddWatchExpressionAction, debugActions_1.AddWatchExpressionAction.ID, debugActions_1.AddWatchExpressionAction.LABEL);
            var collapseAction = this.instantiationService.createInstance(viewlet_1.CollapseAction, this.tree, true, 'explorer-action collapse-explorer');
            var removeAllWatchExpressionsAction = this.instantiationService.createInstance(debugActions_1.RemoveAllWatchExpressionsAction, debugActions_1.RemoveAllWatchExpressionsAction.ID, debugActions_1.RemoveAllWatchExpressionsAction.LABEL);
            this.toolBar.setActions(actions_1.prepareActions([addWatchExpressionAction, collapseAction, removeAllWatchExpressionsAction]))();
            this.toDispose.push(this.debugService.getModel().onDidChangeWatchExpressions(function (we) {
                if (!_this.onWatchExpressionsUpdatedScheduler.isScheduled()) {
                    _this.onWatchExpressionsUpdatedScheduler.schedule();
                }
                _this.toReveal = we;
            }));
            this.toDispose.push(this.debugService.getViewModel().onDidSelectExpression(function (expression) {
                if (!expression || !(expression instanceof debugModel_1.Expression)) {
                    return;
                }
                _this.tree.refresh(expression, false).then(function () {
                    _this.tree.setHighlight(expression);
                    _this.tree.addOneTimeListener(events_1.EventType.HIGHLIGHT, function (e) {
                        if (!e.highlight) {
                            _this.debugService.getViewModel().setSelectedExpression(null);
                        }
                    });
                }).done(null, errors.onUnexpectedError);
            }));
        };
        WatchExpressionsView.prototype.shutdown = function () {
            this.settings[WatchExpressionsView.MEMENTO] = (this.state === splitview_1.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        WatchExpressionsView.MEMENTO = 'watchexpressionsview.memento';
        WatchExpressionsView = __decorate([
            __param(2, contextView_1.IContextMenuService),
            __param(3, debug_1.IDebugService),
            __param(4, keybinding_1.IKeybindingService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, contextkey_1.IContextKeyService),
            __param(7, listService_1.IListService),
            __param(8, themeService_1.IThemeService)
        ], WatchExpressionsView);
        return WatchExpressionsView;
    }(views_1.CollapsibleView));
    exports.WatchExpressionsView = WatchExpressionsView;
    var CallStackView = (function (_super) {
        __extends(CallStackView, _super);
        function CallStackView(size, options, contextMenuService, telemetryService, debugService, keybindingService, instantiationService, listService, themeService) {
            var _this = _super.call(this, size, __assign({}, options, { ariaHeaderLabel: nls.localize('callstackSection', "Call Stack Section"), sizing: splitview_1.ViewSizing.Flexible }), keybindingService, contextMenuService) || this;
            _this.options = options;
            _this.telemetryService = telemetryService;
            _this.debugService = debugService;
            _this.instantiationService = instantiationService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.settings = options.viewletSettings;
            // Create scheduler to prevent unnecessary flashing of tree when reacting to changes
            _this.onCallStackChangeScheduler = new async_1.RunOnceScheduler(function () {
                var newTreeInput = _this.debugService.getModel();
                var processes = _this.debugService.getModel().getProcesses();
                if (!_this.debugService.getViewModel().isMultiProcessView() && processes.length) {
                    var threads = processes[0].getAllThreads();
                    // Only show the threads in the call stack if there is more than 1 thread.
                    newTreeInput = threads.length === 1 ? threads[0] : processes[0];
                }
                // Only show the global pause message if we do not display threads.
                // Otherwise there will be a pause message per thread and there is no need for a global one.
                if (newTreeInput instanceof debugModel_1.Thread && newTreeInput.stoppedDetails) {
                    _this.pauseMessageLabel.text(newTreeInput.stoppedDetails.description || nls.localize('debugStopped', "Paused on {0}", newTreeInput.stoppedDetails.reason));
                    if (newTreeInput.stoppedDetails.text) {
                        _this.pauseMessageLabel.title(newTreeInput.stoppedDetails.text);
                    }
                    newTreeInput.stoppedDetails.reason === 'exception' ? _this.pauseMessageLabel.addClass('exception') : _this.pauseMessageLabel.removeClass('exception');
                    _this.pauseMessage.show();
                }
                else {
                    _this.pauseMessage.hide();
                }
                (_this.tree.getInput() === newTreeInput ? _this.tree.refresh() : _this.tree.setInput(newTreeInput))
                    .done(function () { return _this.updateTreeSelection(); }, errors.onUnexpectedError);
            }, 50);
            return _this;
        }
        CallStackView.prototype.renderHeader = function (container) {
            var title = $('div.debug-call-stack-title').appendTo(container);
            $('span.title').text(this.options.name).appendTo(title);
            this.pauseMessage = $('span.pause-message').appendTo(title);
            this.pauseMessage.hide();
            this.pauseMessageLabel = $('span.label').appendTo(this.pauseMessage);
            _super.prototype.renderHeader.call(this, container);
        };
        CallStackView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-call-stack');
            this.treeContainer = renderViewTree(container);
            var actionProvider = this.instantiationService.createInstance(viewer.CallStackActionProvider);
            var controller = this.instantiationService.createInstance(viewer.CallStackController, actionProvider, actions_2.MenuId.DebugCallStackContext);
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: this.instantiationService.createInstance(viewer.CallStackDataSource),
                renderer: this.instantiationService.createInstance(viewer.CallStackRenderer),
                accessibilityProvider: this.instantiationService.createInstance(viewer.CallstackAccessibilityProvider),
                controller: controller
            }, {
                ariaLabel: nls.localize({ comment: ['Debug is a noun in this context, not a verb.'], key: 'callStackAriaLabel' }, "Debug Call Stack"),
                twistiePixels: twistiePixels,
                keyboardSupport: false
            });
            this.toDispose.push(styler_1.attachListStyler(this.tree, this.themeService));
            this.toDispose.push(this.listService.register(this.tree));
            this.toDispose.push(this.tree.addListener('selection', function (event) {
                if (event && event.payload && event.payload.origin === 'keyboard') {
                    var element = _this.tree.getFocus();
                    if (element instanceof debugModel_1.ThreadAndProcessIds) {
                        controller.showMoreStackFrames(_this.tree, element);
                    }
                    else if (element instanceof debugModel_1.StackFrame) {
                        controller.focusStackFrame(element, event, false);
                    }
                }
            }));
            this.toDispose.push(this.debugService.getModel().onDidChangeCallStack(function () {
                if (!_this.onCallStackChangeScheduler.isScheduled()) {
                    _this.onCallStackChangeScheduler.schedule();
                }
            }));
            this.toDispose.push(this.debugService.getViewModel().onDidFocusStackFrame(function () {
                return _this.updateTreeSelection().done(undefined, errors.onUnexpectedError);
            }));
            // Schedule the update of the call stack tree if the viewlet is opened after a session started #14684
            if (this.debugService.state === debug_1.State.Stopped) {
                this.onCallStackChangeScheduler.schedule();
            }
        };
        CallStackView.prototype.updateTreeSelection = function () {
            var _this = this;
            if (!this.tree.getInput()) {
                // Tree not initialized yet
                return winjs_base_1.TPromise.as(null);
            }
            var stackFrame = this.debugService.getViewModel().focusedStackFrame;
            var thread = this.debugService.getViewModel().focusedThread;
            var process = this.debugService.getViewModel().focusedProcess;
            if (!thread) {
                if (!process) {
                    this.tree.clearSelection();
                    return winjs_base_1.TPromise.as(null);
                }
                this.tree.setSelection([process]);
                return this.tree.reveal(process);
            }
            return this.tree.expandAll([thread.process, thread]).then(function () {
                if (!stackFrame) {
                    return winjs_base_1.TPromise.as(null);
                }
                _this.tree.setSelection([stackFrame]);
                return _this.tree.reveal(stackFrame);
            });
        };
        CallStackView.prototype.shutdown = function () {
            this.settings[CallStackView.MEMENTO] = (this.state === splitview_1.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        CallStackView.MEMENTO = 'callstackview.memento';
        CallStackView = __decorate([
            __param(2, contextView_1.IContextMenuService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, debug_1.IDebugService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, instantiation_1.IInstantiationService),
            __param(7, listService_1.IListService),
            __param(8, themeService_1.IThemeService)
        ], CallStackView);
        return CallStackView;
    }(views_1.CollapsibleView));
    exports.CallStackView = CallStackView;
    var BreakpointsView = (function (_super) {
        __extends(BreakpointsView, _super);
        function BreakpointsView(size, options, contextMenuService, debugService, keybindingService, instantiationService, contextKeyService, listService, themeService) {
            var _this = _super.call(this, size, __assign({}, options, { ariaHeaderLabel: nls.localize('breakpointsSection', "Breakpoints Section"), sizing: splitview_1.ViewSizing.Fixed, initialBodySize: BreakpointsView.getExpandedBodySize(debugService.getModel().getBreakpoints().length + debugService.getModel().getFunctionBreakpoints().length + debugService.getModel().getExceptionBreakpoints().length) }), keybindingService, contextMenuService) || this;
            _this.options = options;
            _this.debugService = debugService;
            _this.instantiationService = instantiationService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.settings = options.viewletSettings;
            _this.breakpointsFocusedContext = debug_1.CONTEXT_BREAKPOINTS_FOCUSED.bindTo(contextKeyService);
            _this.toDispose.push(_this.debugService.getModel().onDidChangeBreakpoints(function () { return _this.onBreakpointsChange(); }));
            return _this;
        }
        BreakpointsView.prototype.renderHeader = function (container) {
            var titleDiv = $('div.title').appendTo(container);
            $('span').text(this.options.name).appendTo(titleDiv);
            _super.prototype.renderHeader.call(this, container);
        };
        BreakpointsView.prototype.renderBody = function (container) {
            var _this = this;
            dom.addClass(container, 'debug-breakpoints');
            this.treeContainer = renderViewTree(container);
            var actionProvider = new viewer.BreakpointsActionProvider(this.instantiationService, this.debugService);
            var controller = this.instantiationService.createInstance(viewer.BreakpointsController, actionProvider, actions_2.MenuId.DebugBreakpointsContext);
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: new viewer.BreakpointsDataSource(),
                renderer: this.instantiationService.createInstance(viewer.BreakpointsRenderer, actionProvider, this.actionRunner),
                accessibilityProvider: this.instantiationService.createInstance(viewer.BreakpointsAccessibilityProvider),
                controller: controller,
                sorter: {
                    compare: function (tree, element, otherElement) {
                        var first = element;
                        var second = otherElement;
                        if (first instanceof debugModel_1.ExceptionBreakpoint) {
                            return -1;
                        }
                        if (second instanceof debugModel_1.ExceptionBreakpoint) {
                            return 1;
                        }
                        if (first instanceof debugModel_1.FunctionBreakpoint) {
                            return -1;
                        }
                        if (second instanceof debugModel_1.FunctionBreakpoint) {
                            return 1;
                        }
                        if (first.uri.toString() !== second.uri.toString()) {
                            return paths.basename(first.uri.fsPath).localeCompare(paths.basename(second.uri.fsPath));
                        }
                        if (first.lineNumber === second.lineNumber) {
                            return first.column - second.column;
                        }
                        return first.lineNumber - second.lineNumber;
                    }
                }
            }, {
                ariaLabel: nls.localize({ comment: ['Debug is a noun in this context, not a verb.'], key: 'breakpointsAriaTreeLabel' }, "Debug Breakpoints"),
                twistiePixels: twistiePixels,
                keyboardSupport: false
            });
            this.toDispose.push(styler_1.attachListStyler(this.tree, this.themeService));
            this.toDispose.push(this.listService.register(this.tree, [this.breakpointsFocusedContext]));
            this.toDispose.push(this.tree.addListener('selection', function (event) {
                if (event && event.payload && event.payload.origin === 'keyboard') {
                    var element = _this.tree.getFocus();
                    if (element instanceof debugModel_1.Breakpoint) {
                        controller.openBreakpointSource(element, event, false);
                    }
                }
            }));
            var debugModel = this.debugService.getModel();
            this.tree.setInput(debugModel);
            this.toDispose.push(this.debugService.getViewModel().onDidSelectFunctionBreakpoint(function (fbp) {
                if (!fbp || !(fbp instanceof debugModel_1.FunctionBreakpoint)) {
                    return;
                }
                _this.tree.refresh(fbp, false).then(function () {
                    _this.tree.setHighlight(fbp);
                    _this.tree.addOneTimeListener(events_1.EventType.HIGHLIGHT, function (e) {
                        if (!e.highlight) {
                            _this.debugService.getViewModel().setSelectedFunctionBreakpoint(null);
                        }
                    });
                }).done(null, errors.onUnexpectedError);
            }));
        };
        BreakpointsView.prototype.getActions = function () {
            return [
                this.instantiationService.createInstance(debugActions_1.AddFunctionBreakpointAction, debugActions_1.AddFunctionBreakpointAction.ID, debugActions_1.AddFunctionBreakpointAction.LABEL),
                this.instantiationService.createInstance(debugActions_1.ToggleBreakpointsActivatedAction, debugActions_1.ToggleBreakpointsActivatedAction.ID, debugActions_1.ToggleBreakpointsActivatedAction.ACTIVATE_LABEL),
                this.instantiationService.createInstance(debugActions_1.RemoveAllBreakpointsAction, debugActions_1.RemoveAllBreakpointsAction.ID, debugActions_1.RemoveAllBreakpointsAction.LABEL)
            ];
        };
        BreakpointsView.prototype.onBreakpointsChange = function () {
            var model = this.debugService.getModel();
            this.setBodySize(BreakpointsView.getExpandedBodySize(model.getBreakpoints().length + model.getExceptionBreakpoints().length + model.getFunctionBreakpoints().length));
            if (this.tree) {
                this.tree.refresh();
            }
        };
        BreakpointsView.getExpandedBodySize = function (length) {
            return Math.min(BreakpointsView.MAX_VISIBLE_FILES, length) * 22;
        };
        BreakpointsView.prototype.shutdown = function () {
            this.settings[BreakpointsView.MEMENTO] = (this.state === splitview_1.CollapsibleState.COLLAPSED);
            _super.prototype.shutdown.call(this);
        };
        BreakpointsView.MAX_VISIBLE_FILES = 9;
        BreakpointsView.MEMENTO = 'breakopintsview.memento';
        BreakpointsView = __decorate([
            __param(2, contextView_1.IContextMenuService),
            __param(3, debug_1.IDebugService),
            __param(4, keybinding_1.IKeybindingService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, contextkey_1.IContextKeyService),
            __param(7, listService_1.IListService),
            __param(8, themeService_1.IThemeService)
        ], BreakpointsView);
        return BreakpointsView;
    }(views_1.CollapsibleView));
    exports.BreakpointsView = BreakpointsView;
});
//# sourceMappingURL=debugViews.js.map