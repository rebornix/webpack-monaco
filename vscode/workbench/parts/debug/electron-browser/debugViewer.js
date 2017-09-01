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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/paths", "vs/base/common/errors", "vs/base/common/strings", "vs/base/browser/dom", "vs/base/common/labels", "vs/base/browser/ui/actionbar/actionbar", "vs/base/parts/tree/browser/tree", "vs/base/browser/ui/inputbox/inputBox", "vs/base/parts/tree/browser/treeDefaults", "vs/platform/contextview/browser/contextView", "vs/platform/instantiation/common/instantiation", "vs/platform/workspace/common/workspace", "vs/platform/contextkey/common/contextkey", "vs/platform/actions/common/actions", "vs/platform/actions/browser/menuItemActionItem", "vs/workbench/services/editor/common/editorService", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/common/debugModel", "vs/workbench/parts/debug/common/debugViewModel", "vs/workbench/parts/debug/browser/debugActions", "vs/workbench/parts/debug/electron-browser/electronDebugActions", "vs/base/common/functional", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/environment/common/environment"], function (require, exports, nls, winjs_base_1, lifecycle, paths, errors, strings_1, dom, labels_1, actionbar_1, tree_1, inputBox_1, treeDefaults_1, contextView_1, instantiation_1, workspace_1, contextkey_1, actions_1, menuItemActionItem_1, editorService_1, debug, debugModel_1, debugViewModel_1, debugActions_1, electronDebugActions_1, functional_1, styler_1, themeService_1, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $ = dom.$;
    var booleanRegex = /^true|false$/i;
    var stringRegex = /^(['"]).*\1$/;
    var MAX_VALUE_RENDER_LENGTH_IN_VIEWLET = 1024;
    function replaceWhitespace(value) {
        var map = { '\n': '\\n', '\r': '\\r', '\t': '\\t' };
        return value.replace(/[\n\r\t]/g, function (char) { return map[char]; });
    }
    function renderExpressionValue(expressionOrValue, container, options) {
        var value = typeof expressionOrValue === 'string' ? expressionOrValue : expressionOrValue.value;
        // remove stale classes
        container.className = 'value';
        // when resolving expressions we represent errors from the server as a variable with name === null.
        if (value === null || ((expressionOrValue instanceof debugModel_1.Expression || expressionOrValue instanceof debugModel_1.Variable) && !expressionOrValue.available)) {
            dom.addClass(container, 'unavailable');
            if (value !== debugModel_1.Expression.DEFAULT_VALUE) {
                dom.addClass(container, 'error');
            }
        }
        else if (!isNaN(+value)) {
            dom.addClass(container, 'number');
        }
        else if (booleanRegex.test(value)) {
            dom.addClass(container, 'boolean');
        }
        else if (stringRegex.test(value)) {
            dom.addClass(container, 'string');
        }
        if (options.showChanged && expressionOrValue.valueChanged && value !== debugModel_1.Expression.DEFAULT_VALUE) {
            // value changed color has priority over other colors.
            container.className = 'value changed';
        }
        if (options.maxValueLength && value.length > options.maxValueLength) {
            value = value.substr(0, options.maxValueLength) + '...';
        }
        if (value && !options.preserveWhitespace) {
            container.textContent = replaceWhitespace(value);
        }
        else {
            container.textContent = value;
        }
        if (options.showHover) {
            container.title = value;
        }
    }
    exports.renderExpressionValue = renderExpressionValue;
    function renderVariable(tree, variable, data, showChanged) {
        if (variable.available) {
            data.name.textContent = replaceWhitespace(variable.name);
            data.name.title = variable.type ? variable.type : variable.name;
        }
        if (variable.value) {
            data.name.textContent += variable.name ? ':' : '';
            renderExpressionValue(variable, data.value, {
                showChanged: showChanged,
                maxValueLength: MAX_VALUE_RENDER_LENGTH_IN_VIEWLET,
                preserveWhitespace: false,
                showHover: true
            });
        }
        else {
            data.value.textContent = '';
            data.value.title = '';
        }
    }
    exports.renderVariable = renderVariable;
    function renderRenameBox(debugService, contextViewService, themeService, tree, element, container, options) {
        var inputBoxContainer = dom.append(container, $('.inputBoxContainer'));
        var inputBox = new inputBox_1.InputBox(inputBoxContainer, contextViewService, {
            validationOptions: options.validationOptions,
            placeholder: options.placeholder,
            ariaLabel: options.ariaLabel
        });
        var styler = styler_1.attachInputBoxStyler(inputBox, themeService);
        tree.setHighlight();
        inputBox.value = options.initialValue ? options.initialValue : '';
        inputBox.focus();
        inputBox.select();
        var disposed = false;
        var toDispose = [inputBox, styler];
        var wrapUp = functional_1.once(function (renamed) {
            if (!disposed) {
                disposed = true;
                if (element instanceof debugModel_1.Expression && renamed && inputBox.value) {
                    debugService.renameWatchExpression(element.getId(), inputBox.value).done(null, errors.onUnexpectedError);
                }
                else if (element instanceof debugModel_1.Expression && !element.name) {
                    debugService.removeWatchExpressions(element.getId());
                }
                else if (element instanceof debugModel_1.FunctionBreakpoint && inputBox.value) {
                    debugService.renameFunctionBreakpoint(element.getId(), renamed ? inputBox.value : element.name).done(null, errors.onUnexpectedError);
                }
                else if (element instanceof debugModel_1.FunctionBreakpoint && !element.name) {
                    debugService.removeFunctionBreakpoints(element.getId()).done(null, errors.onUnexpectedError);
                }
                else if (element instanceof debugModel_1.Variable) {
                    element.errorMessage = null;
                    if (renamed && element.value !== inputBox.value) {
                        element.setVariable(inputBox.value)
                            .done(function () { return tree.refresh(element, false); }, errors.onUnexpectedError);
                    }
                }
                tree.clearHighlight();
                tree.DOMFocus();
                tree.setFocus(element);
                // need to remove the input box since this template will be reused.
                container.removeChild(inputBoxContainer);
                lifecycle.dispose(toDispose);
            }
        });
        toDispose.push(dom.addStandardDisposableListener(inputBox.inputElement, 'keydown', function (e) {
            var isEscape = e.equals(9 /* Escape */);
            var isEnter = e.equals(3 /* Enter */);
            if (isEscape || isEnter) {
                e.preventDefault();
                e.stopPropagation();
                wrapUp(isEnter);
            }
        }));
        toDispose.push(dom.addDisposableListener(inputBox.inputElement, 'blur', function () {
            wrapUp(true);
        }));
    }
    function getSourceName(source, contextService, environmentService) {
        if (source.name) {
            return source.name;
        }
        return paths.basename(source.uri.fsPath);
    }
    var BaseDebugController = (function (_super) {
        __extends(BaseDebugController, _super);
        function BaseDebugController(actionProvider, menuId, debugService, editorService, contextMenuService, contextKeyService, menuService) {
            var _this = _super.call(this, { clickBehavior: treeDefaults_1.ClickBehavior.ON_MOUSE_UP, keyboardSupport: false }) || this;
            _this.actionProvider = actionProvider;
            _this.debugService = debugService;
            _this.editorService = editorService;
            _this.contextMenuService = contextMenuService;
            _this.contributedContextMenu = menuService.createMenu(menuId, contextKeyService);
            return _this;
        }
        BaseDebugController.prototype.onContextMenu = function (tree, element, event) {
            var _this = this;
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false;
            }
            event.preventDefault();
            event.stopPropagation();
            tree.setFocus(element);
            if (this.actionProvider.hasSecondaryActions(tree, element)) {
                var anchor_1 = { x: event.posx + 1, y: event.posy };
                this.contextMenuService.showContextMenu({
                    getAnchor: function () { return anchor_1; },
                    getActions: function () { return _this.actionProvider.getSecondaryActions(tree, element).then(function (actions) {
                        menuItemActionItem_1.fillInActions(_this.contributedContextMenu, { arg: _this.getContext(element) }, actions);
                        return actions;
                    }); },
                    onHide: function (wasCancelled) {
                        if (wasCancelled) {
                            tree.DOMFocus();
                        }
                    },
                    getActionsContext: function () { return element; }
                });
                return true;
            }
            return false;
        };
        BaseDebugController.prototype.getContext = function (element) {
            return undefined;
        };
        BaseDebugController = __decorate([
            __param(2, debug.IDebugService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, contextkey_1.IContextKeyService),
            __param(6, actions_1.IMenuService)
        ], BaseDebugController);
        return BaseDebugController;
    }(treeDefaults_1.DefaultController));
    exports.BaseDebugController = BaseDebugController;
    // call stack
    var CallStackController = (function (_super) {
        __extends(CallStackController, _super);
        function CallStackController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CallStackController.prototype.onLeftClick = function (tree, element, event) {
            if (element instanceof debugModel_1.ThreadAndProcessIds) {
                return this.showMoreStackFrames(tree, element);
            }
            if (element instanceof debugModel_1.StackFrame) {
                _super.prototype.onLeftClick.call(this, tree, element, event);
                this.focusStackFrame(element, event, event.detail !== 2);
                return true;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, event);
        };
        CallStackController.prototype.getContext = function (element) {
            if (element instanceof debugModel_1.StackFrame) {
                if (element.source.inMemory) {
                    return element.source.raw.path || element.source.reference;
                }
                return element.source.uri.toString();
            }
        };
        // user clicked / pressed on 'Load More Stack Frames', get those stack frames and refresh the tree.
        CallStackController.prototype.showMoreStackFrames = function (tree, threadAndProcessIds) {
            var process = this.debugService.getModel().getProcesses().filter(function (p) { return p.getId() === threadAndProcessIds.processId; }).pop();
            var thread = process && process.getThread(threadAndProcessIds.threadId);
            if (thread) {
                thread.fetchCallStack()
                    .done(function () { return tree.refresh(); }, errors.onUnexpectedError);
            }
            return true;
        };
        CallStackController.prototype.focusStackFrame = function (stackFrame, event, preserveFocus) {
            var _this = this;
            this.debugService.focusStackFrameAndEvaluate(stackFrame, undefined, true).then(function () {
                var sideBySide = (event && (event.ctrlKey || event.metaKey));
                return stackFrame.openInEditor(_this.editorService, preserveFocus, sideBySide);
            }, errors.onUnexpectedError);
        };
        return CallStackController;
    }(BaseDebugController));
    exports.CallStackController = CallStackController;
    var CallStackActionProvider = (function () {
        function CallStackActionProvider(instantiationService, debugService) {
            this.instantiationService = instantiationService;
            this.debugService = debugService;
            // noop
        }
        CallStackActionProvider.prototype.hasActions = function (tree, element) {
            return false;
        };
        CallStackActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.TPromise.as([]);
        };
        CallStackActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return element !== tree.getInput();
        };
        CallStackActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            if (element instanceof debugModel_1.Process) {
                actions.push(this.instantiationService.createInstance(debugActions_1.RestartAction, debugActions_1.RestartAction.ID, debugActions_1.RestartAction.LABEL));
                actions.push(this.instantiationService.createInstance(debugActions_1.StopAction, debugActions_1.StopAction.ID, debugActions_1.StopAction.LABEL));
            }
            else if (element instanceof debugModel_1.Thread) {
                var thread = element;
                if (thread.stopped) {
                    actions.push(this.instantiationService.createInstance(debugActions_1.ContinueAction, debugActions_1.ContinueAction.ID, debugActions_1.ContinueAction.LABEL));
                    actions.push(this.instantiationService.createInstance(debugActions_1.StepOverAction, debugActions_1.StepOverAction.ID, debugActions_1.StepOverAction.LABEL));
                    actions.push(this.instantiationService.createInstance(debugActions_1.StepIntoAction, debugActions_1.StepIntoAction.ID, debugActions_1.StepIntoAction.LABEL));
                    actions.push(this.instantiationService.createInstance(debugActions_1.StepOutAction, debugActions_1.StepOutAction.ID, debugActions_1.StepOutAction.LABEL));
                }
                else {
                    actions.push(this.instantiationService.createInstance(debugActions_1.PauseAction, debugActions_1.PauseAction.ID, debugActions_1.PauseAction.LABEL));
                }
            }
            else if (element instanceof debugModel_1.StackFrame) {
                if (element.thread.process.session.capabilities.supportsRestartFrame) {
                    actions.push(this.instantiationService.createInstance(debugActions_1.RestartFrameAction, debugActions_1.RestartFrameAction.ID, debugActions_1.RestartFrameAction.LABEL));
                }
                actions.push(new electronDebugActions_1.CopyStackTraceAction(electronDebugActions_1.CopyStackTraceAction.ID, electronDebugActions_1.CopyStackTraceAction.LABEL));
            }
            return winjs_base_1.TPromise.as(actions);
        };
        CallStackActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        CallStackActionProvider = __decorate([
            __param(0, instantiation_1.IInstantiationService), __param(1, debug.IDebugService)
        ], CallStackActionProvider);
        return CallStackActionProvider;
    }());
    exports.CallStackActionProvider = CallStackActionProvider;
    var CallStackDataSource = (function () {
        function CallStackDataSource() {
        }
        CallStackDataSource.prototype.getId = function (tree, element) {
            if (typeof element === 'string') {
                return element;
            }
            return element.getId();
        };
        CallStackDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof debugModel_1.Model || element instanceof debugModel_1.Process || (element instanceof debugModel_1.Thread && element.stopped);
        };
        CallStackDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof debugModel_1.Thread) {
                return this.getThreadChildren(element);
            }
            if (element instanceof debugModel_1.Model) {
                return winjs_base_1.TPromise.as(element.getProcesses());
            }
            var process = element;
            return winjs_base_1.TPromise.as(process.getAllThreads());
        };
        CallStackDataSource.prototype.getThreadChildren = function (thread) {
            var callStack = thread.getCallStack();
            var callStackPromise = winjs_base_1.TPromise.as(null);
            if (!callStack || !callStack.length) {
                callStackPromise = thread.fetchCallStack().then(function () { return callStack = thread.getCallStack(); });
            }
            return callStackPromise.then(function () {
                if (callStack.length === 1 && thread.process.session.capabilities.supportsDelayedStackTraceLoading) {
                    // To reduce flashing of the call stack view simply append the stale call stack
                    // once we have the correct data the tree will refresh and we will no longer display it.
                    callStack = callStack.concat(thread.getStaleCallStack().slice(1));
                }
                if (thread.stoppedDetails && thread.stoppedDetails.framesErrorMessage) {
                    callStack = callStack.concat([thread.stoppedDetails.framesErrorMessage]);
                }
                if (thread.stoppedDetails && thread.stoppedDetails.totalFrames > callStack.length && callStack.length > 1) {
                    callStack = callStack.concat([new debugModel_1.ThreadAndProcessIds(thread.process.getId(), thread.threadId)]);
                }
                return callStack;
            });
        };
        CallStackDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return CallStackDataSource;
    }());
    exports.CallStackDataSource = CallStackDataSource;
    var CallStackRenderer = (function () {
        function CallStackRenderer(contextService, environmentService) {
            this.contextService = contextService;
            this.environmentService = environmentService;
            // noop
        }
        CallStackRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        CallStackRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof debugModel_1.Process) {
                return CallStackRenderer.PROCESS_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.Thread) {
                return CallStackRenderer.THREAD_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.StackFrame) {
                return CallStackRenderer.STACK_FRAME_TEMPLATE_ID;
            }
            if (typeof element === 'string') {
                return CallStackRenderer.ERROR_TEMPLATE_ID;
            }
            return CallStackRenderer.LOAD_MORE_TEMPLATE_ID;
        };
        CallStackRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === CallStackRenderer.PROCESS_TEMPLATE_ID) {
                var data_1 = Object.create(null);
                data_1.process = dom.append(container, $('.process'));
                data_1.name = dom.append(data_1.process, $('.name'));
                data_1.state = dom.append(data_1.process, $('.state'));
                data_1.stateLabel = dom.append(data_1.state, $('span.label'));
                return data_1;
            }
            if (templateId === CallStackRenderer.LOAD_MORE_TEMPLATE_ID) {
                var data_2 = Object.create(null);
                data_2.label = dom.append(container, $('.load-more'));
                return data_2;
            }
            if (templateId === CallStackRenderer.ERROR_TEMPLATE_ID) {
                var data_3 = Object.create(null);
                data_3.label = dom.append(container, $('.error'));
                return data_3;
            }
            if (templateId === CallStackRenderer.THREAD_TEMPLATE_ID) {
                var data_4 = Object.create(null);
                data_4.thread = dom.append(container, $('.thread'));
                data_4.name = dom.append(data_4.thread, $('.name'));
                data_4.state = dom.append(data_4.thread, $('.state'));
                data_4.stateLabel = dom.append(data_4.state, $('span.label'));
                return data_4;
            }
            var data = Object.create(null);
            data.stackFrame = dom.append(container, $('.stack-frame'));
            data.label = dom.append(data.stackFrame, $('span.label.expression'));
            data.file = dom.append(data.stackFrame, $('.file'));
            data.fileName = dom.append(data.file, $('span.file-name'));
            data.lineNumber = dom.append(data.file, $('span.line-number'));
            return data;
        };
        CallStackRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === CallStackRenderer.PROCESS_TEMPLATE_ID) {
                this.renderProcess(element, templateData);
            }
            else if (templateId === CallStackRenderer.THREAD_TEMPLATE_ID) {
                this.renderThread(element, templateData);
            }
            else if (templateId === CallStackRenderer.STACK_FRAME_TEMPLATE_ID) {
                this.renderStackFrame(element, templateData);
            }
            else if (templateId === CallStackRenderer.ERROR_TEMPLATE_ID) {
                this.renderError(element, templateData);
            }
            else if (templateId === CallStackRenderer.LOAD_MORE_TEMPLATE_ID) {
                this.renderLoadMore(element, templateData);
            }
        };
        CallStackRenderer.prototype.renderProcess = function (process, data) {
            data.process.title = nls.localize({ key: 'process', comment: ['Process is a noun'] }, "Process");
            data.name.textContent = process.getName(this.contextService.hasMultiFolderWorkspace());
            var stoppedThread = process.getAllThreads().filter(function (t) { return t.stopped; }).pop();
            data.stateLabel.textContent = stoppedThread ? nls.localize('paused', "Paused")
                : nls.localize({ key: 'running', comment: ['indicates state'] }, "Running");
        };
        CallStackRenderer.prototype.renderThread = function (thread, data) {
            data.thread.title = nls.localize('thread', "Thread");
            data.name.textContent = thread.name;
            if (thread.stopped) {
                data.stateLabel.textContent = thread.stoppedDetails.description ||
                    thread.stoppedDetails.reason ? nls.localize({ key: 'pausedOn', comment: ['indicates reason for program being paused'] }, "Paused on {0}", thread.stoppedDetails.reason) : nls.localize('paused', "Paused");
            }
            else {
                data.stateLabel.textContent = nls.localize({ key: 'running', comment: ['indicates state'] }, "Running");
            }
        };
        CallStackRenderer.prototype.renderError = function (element, data) {
            data.label.textContent = element;
            data.label.title = element;
        };
        CallStackRenderer.prototype.renderLoadMore = function (element, data) {
            data.label.textContent = nls.localize('loadMoreStackFrames', "Load More Stack Frames");
        };
        CallStackRenderer.prototype.renderStackFrame = function (stackFrame, data) {
            dom.toggleClass(data.stackFrame, 'disabled', !stackFrame.source.available || stackFrame.source.presentationHint === 'deemphasize');
            dom.toggleClass(data.stackFrame, 'label', stackFrame.presentationHint === 'label');
            dom.toggleClass(data.stackFrame, 'subtle', stackFrame.presentationHint === 'subtle');
            data.file.title = stackFrame.source.raw.path || stackFrame.source.name;
            if (stackFrame.source.raw.origin) {
                data.file.title += "\n" + stackFrame.source.raw.origin;
            }
            data.label.textContent = stackFrame.name;
            data.label.title = stackFrame.name;
            data.fileName.textContent = getSourceName(stackFrame.source, this.contextService, this.environmentService);
            if (stackFrame.range.startLineNumber !== undefined) {
                data.lineNumber.textContent = "" + stackFrame.range.startLineNumber;
                if (stackFrame.range.startColumn) {
                    data.lineNumber.textContent += ":" + stackFrame.range.startColumn;
                }
                dom.removeClass(data.lineNumber, 'unavailable');
            }
            else {
                dom.addClass(data.lineNumber, 'unavailable');
            }
        };
        CallStackRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        CallStackRenderer.THREAD_TEMPLATE_ID = 'thread';
        CallStackRenderer.STACK_FRAME_TEMPLATE_ID = 'stackFrame';
        CallStackRenderer.ERROR_TEMPLATE_ID = 'error';
        CallStackRenderer.LOAD_MORE_TEMPLATE_ID = 'loadMore';
        CallStackRenderer.PROCESS_TEMPLATE_ID = 'process';
        CallStackRenderer = __decorate([
            __param(0, workspace_1.IWorkspaceContextService),
            __param(1, environment_1.IEnvironmentService)
        ], CallStackRenderer);
        return CallStackRenderer;
    }());
    exports.CallStackRenderer = CallStackRenderer;
    var CallstackAccessibilityProvider = (function () {
        function CallstackAccessibilityProvider(contextService) {
            this.contextService = contextService;
            // noop
        }
        CallstackAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof debugModel_1.Thread) {
                return nls.localize('threadAriaLabel', "Thread {0}, callstack, debug", element.name);
            }
            if (element instanceof debugModel_1.StackFrame) {
                return nls.localize('stackFrameAriaLabel', "Stack Frame {0} line {1} {2}, callstack, debug", element.name, element.range.startLineNumber, getSourceName(element.source, this.contextService));
            }
            return null;
        };
        CallstackAccessibilityProvider = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], CallstackAccessibilityProvider);
        return CallstackAccessibilityProvider;
    }());
    exports.CallstackAccessibilityProvider = CallstackAccessibilityProvider;
    // variables
    var VariablesActionProvider = (function () {
        function VariablesActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
            // noop
        }
        VariablesActionProvider.prototype.hasActions = function (tree, element) {
            return false;
        };
        VariablesActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.TPromise.as([]);
        };
        VariablesActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            // Only show context menu on "real" variables. Not on array chunk nodes.
            return element instanceof debugModel_1.Variable && !!element.value;
        };
        VariablesActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            var variable = element;
            actions.push(this.instantiationService.createInstance(debugActions_1.SetValueAction, debugActions_1.SetValueAction.ID, debugActions_1.SetValueAction.LABEL, variable));
            actions.push(this.instantiationService.createInstance(electronDebugActions_1.CopyValueAction, electronDebugActions_1.CopyValueAction.ID, electronDebugActions_1.CopyValueAction.LABEL, variable));
            actions.push(new actionbar_1.Separator());
            actions.push(this.instantiationService.createInstance(debugActions_1.AddToWatchExpressionsAction, debugActions_1.AddToWatchExpressionsAction.ID, debugActions_1.AddToWatchExpressionsAction.LABEL, variable));
            return winjs_base_1.TPromise.as(actions);
        };
        VariablesActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return VariablesActionProvider;
    }());
    exports.VariablesActionProvider = VariablesActionProvider;
    var VariablesDataSource = (function () {
        function VariablesDataSource() {
        }
        VariablesDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        VariablesDataSource.prototype.hasChildren = function (tree, element) {
            if (element instanceof debugViewModel_1.ViewModel || element instanceof debugModel_1.Scope) {
                return true;
            }
            var variable = element;
            return variable.hasChildren && !strings_1.equalsIgnoreCase(variable.value, 'null');
        };
        VariablesDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof debugViewModel_1.ViewModel) {
                var focusedStackFrame = element.focusedStackFrame;
                return focusedStackFrame ? focusedStackFrame.getScopes() : winjs_base_1.TPromise.as([]);
            }
            var scope = element;
            return scope.getChildren();
        };
        VariablesDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return VariablesDataSource;
    }());
    exports.VariablesDataSource = VariablesDataSource;
    var VariablesRenderer = (function () {
        function VariablesRenderer(debugService, contextViewService, themeService) {
            this.debugService = debugService;
            this.contextViewService = contextViewService;
            this.themeService = themeService;
            // noop
        }
        VariablesRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        VariablesRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof debugModel_1.Scope) {
                return VariablesRenderer.SCOPE_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.Variable) {
                return VariablesRenderer.VARIABLE_TEMPLATE_ID;
            }
            return null;
        };
        VariablesRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            if (templateId === VariablesRenderer.SCOPE_TEMPLATE_ID) {
                var data_5 = Object.create(null);
                data_5.name = dom.append(container, $('.scope'));
                return data_5;
            }
            var data = Object.create(null);
            data.expression = dom.append(container, $('.expression'));
            data.name = dom.append(data.expression, $('span.name'));
            data.value = dom.append(data.expression, $('span.value'));
            return data;
        };
        VariablesRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === VariablesRenderer.SCOPE_TEMPLATE_ID) {
                this.renderScope(element, templateData);
            }
            else {
                var variable_1 = element;
                if (variable_1 === this.debugService.getViewModel().getSelectedExpression() || variable_1.errorMessage) {
                    renderRenameBox(this.debugService, this.contextViewService, this.themeService, tree, variable_1, templateData.expression, {
                        initialValue: variable_1.value,
                        ariaLabel: nls.localize('variableValueAriaLabel', "Type new variable value"),
                        validationOptions: {
                            validation: function (value) { return variable_1.errorMessage ? ({ content: variable_1.errorMessage }) : null; }
                        }
                    });
                }
                else {
                    renderVariable(tree, variable_1, templateData, true);
                }
            }
        };
        VariablesRenderer.prototype.renderScope = function (scope, data) {
            data.name.textContent = scope.name;
        };
        VariablesRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        VariablesRenderer.SCOPE_TEMPLATE_ID = 'scope';
        VariablesRenderer.VARIABLE_TEMPLATE_ID = 'variable';
        VariablesRenderer = __decorate([
            __param(0, debug.IDebugService),
            __param(1, contextView_1.IContextViewService),
            __param(2, themeService_1.IThemeService)
        ], VariablesRenderer);
        return VariablesRenderer;
    }());
    exports.VariablesRenderer = VariablesRenderer;
    var VariablesAccessibilityProvider = (function () {
        function VariablesAccessibilityProvider() {
        }
        VariablesAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof debugModel_1.Scope) {
                return nls.localize('variableScopeAriaLabel', "Scope {0}, variables, debug", element.name);
            }
            if (element instanceof debugModel_1.Variable) {
                return nls.localize('variableAriaLabel', "{0} value {1}, variables, debug", element.name, element.value);
            }
            return null;
        };
        return VariablesAccessibilityProvider;
    }());
    exports.VariablesAccessibilityProvider = VariablesAccessibilityProvider;
    var VariablesController = (function (_super) {
        __extends(VariablesController, _super);
        function VariablesController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        VariablesController.prototype.onLeftClick = function (tree, element, event) {
            // double click on primitive value: open input box to be able to set the value
            if (element instanceof debugModel_1.Variable && event.detail === 2) {
                var expression = element;
                this.debugService.getViewModel().setSelectedExpression(expression);
                return true;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, event);
        };
        return VariablesController;
    }(BaseDebugController));
    exports.VariablesController = VariablesController;
    // watch expressions
    var WatchExpressionsActionProvider = (function () {
        function WatchExpressionsActionProvider(instantiationService) {
            this.instantiationService = instantiationService;
        }
        WatchExpressionsActionProvider.prototype.hasActions = function (tree, element) {
            return element instanceof debugModel_1.Expression && !!element.name;
        };
        WatchExpressionsActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return true;
        };
        WatchExpressionsActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.TPromise.as([]);
        };
        WatchExpressionsActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            if (element instanceof debugModel_1.Expression) {
                var expression = element;
                actions.push(this.instantiationService.createInstance(debugActions_1.AddWatchExpressionAction, debugActions_1.AddWatchExpressionAction.ID, debugActions_1.AddWatchExpressionAction.LABEL));
                actions.push(this.instantiationService.createInstance(debugActions_1.EditWatchExpressionAction, debugActions_1.EditWatchExpressionAction.ID, debugActions_1.EditWatchExpressionAction.LABEL));
                if (!expression.hasChildren) {
                    actions.push(this.instantiationService.createInstance(electronDebugActions_1.CopyValueAction, electronDebugActions_1.CopyValueAction.ID, electronDebugActions_1.CopyValueAction.LABEL, expression.value));
                }
                actions.push(new actionbar_1.Separator());
                actions.push(this.instantiationService.createInstance(debugActions_1.RemoveWatchExpressionAction, debugActions_1.RemoveWatchExpressionAction.ID, debugActions_1.RemoveWatchExpressionAction.LABEL));
                actions.push(this.instantiationService.createInstance(debugActions_1.RemoveAllWatchExpressionsAction, debugActions_1.RemoveAllWatchExpressionsAction.ID, debugActions_1.RemoveAllWatchExpressionsAction.LABEL));
            }
            else {
                actions.push(this.instantiationService.createInstance(debugActions_1.AddWatchExpressionAction, debugActions_1.AddWatchExpressionAction.ID, debugActions_1.AddWatchExpressionAction.LABEL));
                if (element instanceof debugModel_1.Variable) {
                    var variable = element;
                    if (!variable.hasChildren) {
                        actions.push(this.instantiationService.createInstance(electronDebugActions_1.CopyValueAction, electronDebugActions_1.CopyValueAction.ID, electronDebugActions_1.CopyValueAction.LABEL, variable.value));
                    }
                    actions.push(new actionbar_1.Separator());
                }
                actions.push(this.instantiationService.createInstance(debugActions_1.RemoveAllWatchExpressionsAction, debugActions_1.RemoveAllWatchExpressionsAction.ID, debugActions_1.RemoveAllWatchExpressionsAction.LABEL));
            }
            return winjs_base_1.TPromise.as(actions);
        };
        WatchExpressionsActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return WatchExpressionsActionProvider;
    }());
    exports.WatchExpressionsActionProvider = WatchExpressionsActionProvider;
    var WatchExpressionsDataSource = (function () {
        function WatchExpressionsDataSource() {
        }
        WatchExpressionsDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        WatchExpressionsDataSource.prototype.hasChildren = function (tree, element) {
            if (element instanceof debugModel_1.Model) {
                return true;
            }
            var watchExpression = element;
            return watchExpression.hasChildren && !strings_1.equalsIgnoreCase(watchExpression.value, 'null');
        };
        WatchExpressionsDataSource.prototype.getChildren = function (tree, element) {
            if (element instanceof debugModel_1.Model) {
                return winjs_base_1.TPromise.as(element.getWatchExpressions());
            }
            var expression = element;
            return expression.getChildren();
        };
        WatchExpressionsDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return WatchExpressionsDataSource;
    }());
    exports.WatchExpressionsDataSource = WatchExpressionsDataSource;
    var WatchExpressionsRenderer = (function () {
        function WatchExpressionsRenderer(actionProvider, actionRunner, debugService, contextViewService, themeService) {
            this.actionRunner = actionRunner;
            this.debugService = debugService;
            this.contextViewService = contextViewService;
            this.themeService = themeService;
            this.toDispose = [];
            this.actionProvider = actionProvider;
        }
        WatchExpressionsRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        WatchExpressionsRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof debugModel_1.Expression) {
                return WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID;
            }
            return WatchExpressionsRenderer.VARIABLE_TEMPLATE_ID;
        };
        WatchExpressionsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            var createVariableTemplate = (function (data, container) {
                data.expression = dom.append(container, $('.expression'));
                data.name = dom.append(data.expression, $('span.name'));
                data.value = dom.append(data.expression, $('span.value'));
            });
            if (templateId === WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID) {
                var data_6 = Object.create(null);
                data_6.watchExpression = dom.append(container, $('.watch-expression'));
                createVariableTemplate(data_6, data_6.watchExpression);
                return data_6;
            }
            var data = Object.create(null);
            createVariableTemplate(data, container);
            return data;
        };
        WatchExpressionsRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            if (templateId === WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID) {
                this.renderWatchExpression(tree, element, templateData);
            }
            else {
                renderVariable(tree, element, templateData, true);
            }
        };
        WatchExpressionsRenderer.prototype.renderWatchExpression = function (tree, watchExpression, data) {
            var selectedExpression = this.debugService.getViewModel().getSelectedExpression();
            if ((selectedExpression instanceof debugModel_1.Expression && selectedExpression.getId() === watchExpression.getId()) || (watchExpression instanceof debugModel_1.Expression && !watchExpression.name)) {
                renderRenameBox(this.debugService, this.contextViewService, this.themeService, tree, watchExpression, data.expression, {
                    initialValue: watchExpression.name,
                    placeholder: nls.localize('watchExpressionPlaceholder', "Expression to watch"),
                    ariaLabel: nls.localize('watchExpressionInputAriaLabel', "Type watch expression")
                });
            }
            data.name.textContent = watchExpression.name;
            if (watchExpression.value) {
                data.name.textContent += ':';
                renderExpressionValue(watchExpression, data.value, {
                    showChanged: true,
                    maxValueLength: MAX_VALUE_RENDER_LENGTH_IN_VIEWLET,
                    preserveWhitespace: false,
                    showHover: true
                });
                data.name.title = watchExpression.type ? watchExpression.type : watchExpression.value;
            }
        };
        WatchExpressionsRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            // noop
        };
        WatchExpressionsRenderer.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
        };
        WatchExpressionsRenderer.WATCH_EXPRESSION_TEMPLATE_ID = 'watchExpression';
        WatchExpressionsRenderer.VARIABLE_TEMPLATE_ID = 'variables';
        WatchExpressionsRenderer = __decorate([
            __param(2, debug.IDebugService),
            __param(3, contextView_1.IContextViewService),
            __param(4, themeService_1.IThemeService)
        ], WatchExpressionsRenderer);
        return WatchExpressionsRenderer;
    }());
    exports.WatchExpressionsRenderer = WatchExpressionsRenderer;
    var WatchExpressionsAccessibilityProvider = (function () {
        function WatchExpressionsAccessibilityProvider() {
        }
        WatchExpressionsAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof debugModel_1.Expression) {
                return nls.localize('watchExpressionAriaLabel', "{0} value {1}, watch, debug", element.name, element.value);
            }
            if (element instanceof debugModel_1.Variable) {
                return nls.localize('watchVariableAriaLabel', "{0} value {1}, watch, debug", element.name, element.value);
            }
            return null;
        };
        return WatchExpressionsAccessibilityProvider;
    }());
    exports.WatchExpressionsAccessibilityProvider = WatchExpressionsAccessibilityProvider;
    var WatchExpressionsController = (function (_super) {
        __extends(WatchExpressionsController, _super);
        function WatchExpressionsController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WatchExpressionsController.prototype.onLeftClick = function (tree, element, event) {
            // double click on primitive value: open input box to be able to select and copy value.
            if (element instanceof debugModel_1.Expression && event.detail === 2) {
                var expression = element;
                this.debugService.getViewModel().setSelectedExpression(expression);
                return true;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, event);
        };
        return WatchExpressionsController;
    }(BaseDebugController));
    exports.WatchExpressionsController = WatchExpressionsController;
    var WatchExpressionsDragAndDrop = (function (_super) {
        __extends(WatchExpressionsDragAndDrop, _super);
        function WatchExpressionsDragAndDrop(debugService) {
            var _this = _super.call(this) || this;
            _this.debugService = debugService;
            return _this;
        }
        WatchExpressionsDragAndDrop.prototype.getDragURI = function (tree, element) {
            if (!(element instanceof debugModel_1.Expression)) {
                return null;
            }
            return element.getId();
        };
        WatchExpressionsDragAndDrop.prototype.getDragLabel = function (tree, elements) {
            if (elements.length > 1) {
                return String(elements.length);
            }
            return elements[0].name;
        };
        WatchExpressionsDragAndDrop.prototype.onDragOver = function (tree, data, target, originalEvent) {
            if (target instanceof debugModel_1.Expression || target instanceof debugModel_1.Model) {
                return {
                    accept: true,
                    autoExpand: false
                };
            }
            return tree_1.DRAG_OVER_REJECT;
        };
        WatchExpressionsDragAndDrop.prototype.drop = function (tree, data, target, originalEvent) {
            var draggedData = data.getData();
            if (Array.isArray(draggedData)) {
                var draggedElement = draggedData[0];
                var watches = this.debugService.getModel().getWatchExpressions();
                var position = target instanceof debugModel_1.Model ? watches.length - 1 : watches.indexOf(target);
                this.debugService.moveWatchExpression(draggedElement.getId(), position);
            }
        };
        WatchExpressionsDragAndDrop = __decorate([
            __param(0, debug.IDebugService)
        ], WatchExpressionsDragAndDrop);
        return WatchExpressionsDragAndDrop;
    }(treeDefaults_1.DefaultDragAndDrop));
    exports.WatchExpressionsDragAndDrop = WatchExpressionsDragAndDrop;
    // breakpoints
    var BreakpointsActionProvider = (function () {
        function BreakpointsActionProvider(instantiationService, debugService) {
            this.instantiationService = instantiationService;
            this.debugService = debugService;
            // noop
        }
        BreakpointsActionProvider.prototype.hasActions = function (tree, element) {
            return false;
        };
        BreakpointsActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            return element instanceof debugModel_1.Breakpoint || element instanceof debugModel_1.ExceptionBreakpoint || element instanceof debugModel_1.FunctionBreakpoint;
        };
        BreakpointsActionProvider.prototype.getActions = function (tree, element) {
            return winjs_base_1.TPromise.as([]);
        };
        BreakpointsActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            if (element instanceof debugModel_1.Breakpoint || element instanceof debugModel_1.FunctionBreakpoint) {
                actions.push(this.instantiationService.createInstance(debugActions_1.RemoveBreakpointAction, debugActions_1.RemoveBreakpointAction.ID, debugActions_1.RemoveBreakpointAction.LABEL));
            }
            if (this.debugService.getModel().getBreakpoints().length + this.debugService.getModel().getFunctionBreakpoints().length > 1) {
                actions.push(this.instantiationService.createInstance(debugActions_1.RemoveAllBreakpointsAction, debugActions_1.RemoveAllBreakpointsAction.ID, debugActions_1.RemoveAllBreakpointsAction.LABEL));
                actions.push(new actionbar_1.Separator());
                actions.push(this.instantiationService.createInstance(debugActions_1.EnableAllBreakpointsAction, debugActions_1.EnableAllBreakpointsAction.ID, debugActions_1.EnableAllBreakpointsAction.LABEL));
                actions.push(this.instantiationService.createInstance(debugActions_1.DisableAllBreakpointsAction, debugActions_1.DisableAllBreakpointsAction.ID, debugActions_1.DisableAllBreakpointsAction.LABEL));
            }
            actions.push(new actionbar_1.Separator());
            actions.push(this.instantiationService.createInstance(debugActions_1.ReapplyBreakpointsAction, debugActions_1.ReapplyBreakpointsAction.ID, debugActions_1.ReapplyBreakpointsAction.LABEL));
            return winjs_base_1.TPromise.as(actions);
        };
        BreakpointsActionProvider.prototype.getActionItem = function (tree, element, action) {
            return null;
        };
        return BreakpointsActionProvider;
    }());
    exports.BreakpointsActionProvider = BreakpointsActionProvider;
    var BreakpointsDataSource = (function () {
        function BreakpointsDataSource() {
        }
        BreakpointsDataSource.prototype.getId = function (tree, element) {
            return element.getId();
        };
        BreakpointsDataSource.prototype.hasChildren = function (tree, element) {
            return element instanceof debugModel_1.Model;
        };
        BreakpointsDataSource.prototype.getChildren = function (tree, element) {
            var model = element;
            var exBreakpoints = model.getExceptionBreakpoints();
            return winjs_base_1.TPromise.as(exBreakpoints.concat(model.getFunctionBreakpoints()).concat(model.getBreakpoints()));
        };
        BreakpointsDataSource.prototype.getParent = function (tree, element) {
            return winjs_base_1.TPromise.as(null);
        };
        return BreakpointsDataSource;
    }());
    exports.BreakpointsDataSource = BreakpointsDataSource;
    var BreakpointsRenderer = (function () {
        function BreakpointsRenderer(actionProvider, actionRunner, contextService, debugService, contextViewService, themeService, environmentService) {
            this.actionProvider = actionProvider;
            this.actionRunner = actionRunner;
            this.contextService = contextService;
            this.debugService = debugService;
            this.contextViewService = contextViewService;
            this.themeService = themeService;
            this.environmentService = environmentService;
            // noop
        }
        BreakpointsRenderer.prototype.getHeight = function (tree, element) {
            return 22;
        };
        BreakpointsRenderer.prototype.getTemplateId = function (tree, element) {
            if (element instanceof debugModel_1.Breakpoint) {
                return BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.FunctionBreakpoint) {
                return BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID;
            }
            if (element instanceof debugModel_1.ExceptionBreakpoint) {
                return BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID;
            }
            return null;
        };
        BreakpointsRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            var _this = this;
            var data = Object.create(null);
            data.breakpoint = dom.append(container, $('.breakpoint'));
            data.checkbox = $('input');
            data.checkbox.type = 'checkbox';
            data.toDispose = [];
            data.toDispose.push(dom.addStandardDisposableListener(data.checkbox, 'change', function (e) {
                _this.debugService.enableOrDisableBreakpoints(!data.context.enabled, data.context);
            }));
            dom.append(data.breakpoint, data.checkbox);
            data.name = dom.append(data.breakpoint, $('span.name'));
            if (templateId === BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID) {
                data.filePath = dom.append(data.breakpoint, $('span.file-path'));
                var lineNumberContainer = dom.append(data.breakpoint, $('.line-number-container'));
                data.lineNumber = dom.append(lineNumberContainer, $('span.line-number'));
            }
            if (templateId === BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID) {
                dom.addClass(data.breakpoint, 'exception');
            }
            return data;
        };
        BreakpointsRenderer.prototype.renderElement = function (tree, element, templateId, templateData) {
            templateData.context = element;
            if (templateId === BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID) {
                this.renderExceptionBreakpoint(element, templateData);
            }
            else if (templateId === BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID) {
                this.renderFunctionBreakpoint(tree, element, templateData);
            }
            else {
                this.renderBreakpoint(tree, element, templateData);
            }
        };
        BreakpointsRenderer.prototype.renderExceptionBreakpoint = function (exceptionBreakpoint, data) {
            data.name.textContent = exceptionBreakpoint.label || exceptionBreakpoint.filter + " exceptions";
            data.breakpoint.title = data.name.textContent;
            data.checkbox.checked = exceptionBreakpoint.enabled;
        };
        BreakpointsRenderer.prototype.renderFunctionBreakpoint = function (tree, functionBreakpoint, data) {
            var selected = this.debugService.getViewModel().getSelectedFunctionBreakpoint();
            if (!functionBreakpoint.name || (selected && selected.getId() === functionBreakpoint.getId())) {
                data.name.textContent = '';
                renderRenameBox(this.debugService, this.contextViewService, this.themeService, tree, functionBreakpoint, data.breakpoint, {
                    initialValue: functionBreakpoint.name,
                    placeholder: nls.localize('functionBreakpointPlaceholder', "Function to break on"),
                    ariaLabel: nls.localize('functionBreakPointInputAriaLabel', "Type function breakpoint")
                });
            }
            else {
                data.name.textContent = functionBreakpoint.name;
                data.checkbox.checked = functionBreakpoint.enabled;
                data.breakpoint.title = functionBreakpoint.name;
                // Mark function breakpoints as disabled if deactivated or if debug type does not support them #9099
                var process_1 = this.debugService.getViewModel().focusedProcess;
                if ((process_1 && !process_1.session.capabilities.supportsFunctionBreakpoints) || !this.debugService.getModel().areBreakpointsActivated()) {
                    tree.addTraits('disabled', [functionBreakpoint]);
                    if (process_1 && !process_1.session.capabilities.supportsFunctionBreakpoints) {
                        data.breakpoint.title = nls.localize('functionBreakpointsNotSupported', "Function breakpoints are not supported by this debug type");
                    }
                }
                else {
                    tree.removeTraits('disabled', [functionBreakpoint]);
                }
            }
        };
        BreakpointsRenderer.prototype.renderBreakpoint = function (tree, breakpoint, data) {
            this.debugService.getModel().areBreakpointsActivated() ? tree.removeTraits('disabled', [breakpoint]) : tree.addTraits('disabled', [breakpoint]);
            data.name.textContent = paths.basename(labels_1.getPathLabel(breakpoint.uri, this.contextService));
            data.lineNumber.textContent = breakpoint.lineNumber.toString();
            if (breakpoint.column) {
                data.lineNumber.textContent += ":" + breakpoint.column;
            }
            data.filePath.textContent = labels_1.getPathLabel(paths.dirname(breakpoint.uri.fsPath), this.contextService, this.environmentService);
            data.checkbox.checked = breakpoint.enabled;
            var debugActive = this.debugService.state === debug.State.Running || this.debugService.state === debug.State.Stopped || this.debugService.state === debug.State.Initializing;
            if (debugActive && !breakpoint.verified) {
                tree.addTraits('disabled', [breakpoint]);
                if (breakpoint.message) {
                    data.breakpoint.title = breakpoint.message;
                }
            }
            else if (breakpoint.condition || breakpoint.hitCondition) {
                data.breakpoint.title = breakpoint.condition ? breakpoint.condition : breakpoint.hitCondition;
            }
        };
        BreakpointsRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
            lifecycle.dispose(templateData.toDispose);
        };
        BreakpointsRenderer.EXCEPTION_BREAKPOINT_TEMPLATE_ID = 'exceptionBreakpoint';
        BreakpointsRenderer.FUNCTION_BREAKPOINT_TEMPLATE_ID = 'functionBreakpoint';
        BreakpointsRenderer.BREAKPOINT_TEMPLATE_ID = 'breakpoint';
        BreakpointsRenderer = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, debug.IDebugService),
            __param(4, contextView_1.IContextViewService),
            __param(5, themeService_1.IThemeService),
            __param(6, environment_1.IEnvironmentService)
        ], BreakpointsRenderer);
        return BreakpointsRenderer;
    }());
    exports.BreakpointsRenderer = BreakpointsRenderer;
    var BreakpointsAccessibilityProvider = (function () {
        function BreakpointsAccessibilityProvider(contextService) {
            this.contextService = contextService;
            // noop
        }
        BreakpointsAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            if (element instanceof debugModel_1.Breakpoint) {
                return nls.localize('breakpointAriaLabel', "Breakpoint line {0} {1}, breakpoints, debug", element.lineNumber, labels_1.getPathLabel(paths.basename(element.uri.fsPath), this.contextService), this.contextService);
            }
            if (element instanceof debugModel_1.FunctionBreakpoint) {
                return nls.localize('functionBreakpointAriaLabel', "Function breakpoint {0}, breakpoints, debug", element.name);
            }
            if (element instanceof debugModel_1.ExceptionBreakpoint) {
                return nls.localize('exceptionBreakpointAriaLabel', "Exception breakpoint {0}, breakpoints, debug", element.filter);
            }
            return null;
        };
        BreakpointsAccessibilityProvider = __decorate([
            __param(0, workspace_1.IWorkspaceContextService)
        ], BreakpointsAccessibilityProvider);
        return BreakpointsAccessibilityProvider;
    }());
    exports.BreakpointsAccessibilityProvider = BreakpointsAccessibilityProvider;
    var BreakpointsController = (function (_super) {
        __extends(BreakpointsController, _super);
        function BreakpointsController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BreakpointsController.prototype.onLeftClick = function (tree, element, event) {
            if (element instanceof debugModel_1.FunctionBreakpoint && event.detail === 2) {
                this.debugService.getViewModel().setSelectedFunctionBreakpoint(element);
                return true;
            }
            if (element instanceof debugModel_1.Breakpoint) {
                _super.prototype.onLeftClick.call(this, tree, element, event);
                this.openBreakpointSource(element, event, event.detail !== 2);
                return true;
            }
            return _super.prototype.onLeftClick.call(this, tree, element, event);
        };
        BreakpointsController.prototype.openBreakpointSource = function (breakpoint, event, preserveFocus) {
            var sideBySide = (event && (event.ctrlKey || event.metaKey));
            var selection = breakpoint.endLineNumber ? {
                startLineNumber: breakpoint.lineNumber,
                endLineNumber: breakpoint.endLineNumber,
                startColumn: breakpoint.column,
                endColumn: breakpoint.endColumn
            } : {
                startLineNumber: breakpoint.lineNumber,
                startColumn: breakpoint.column || 1,
                endLineNumber: breakpoint.lineNumber,
                endColumn: breakpoint.column || 1073741824 /* MAX_SAFE_SMALL_INTEGER */
            };
            this.editorService.openEditor({
                resource: breakpoint.uri,
                options: {
                    preserveFocus: preserveFocus,
                    selection: selection,
                    revealIfVisible: true,
                    revealInCenterIfOutsideViewport: true,
                    pinned: !preserveFocus
                }
            }, sideBySide).done(undefined, errors.onUnexpectedError);
        };
        return BreakpointsController;
    }(BaseDebugController));
    exports.BreakpointsController = BreakpointsController;
});
//# sourceMappingURL=debugViewer.js.map