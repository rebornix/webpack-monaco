/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", "child_process", "os", "path", "vs/base/common/lifecycle", "vs/nls", "vs/base/common/platform", "vs/base/browser/dom", "vs/base/common/event", "vs/base/common/uri", "xterm", "vs/base/browser/builder", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/common/keybinding", "vs/platform/message/common/message", "vs/workbench/services/panel/common/panelService", "vs/workbench/parts/terminal/common/terminal", "vs/platform/workspace/common/workspace", "vs/workbench/services/editor/common/editorService", "vs/platform/instantiation/common/instantiation", "vs/base/browser/keyboardEvent", "vs/editor/common/config/commonEditorConfig", "vs/workbench/parts/terminal/electron-browser/terminalLinkHandler", "vs/workbench/parts/terminal/browser/terminalWidgetManager", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/base/common/winjs.base", "vs/platform/clipboard/common/clipboardService", "vs/workbench/services/history/common/history", "vs/platform/node/package"], function (require, exports, cp, os, path, lifecycle, nls, platform, dom, event_1, uri_1, xterm_1, builder_1, contextkey_1, keybinding_1, message_1, panelService_1, terminal_1, workspace_1, editorService_1, instantiation_1, keyboardEvent_1, commonEditorConfig_1, terminalLinkHandler_1, terminalWidgetManager_1, themeService_1, colorRegistry_1, winjs_base_1, clipboardService_1, history_1, package_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** The amount of time to consider terminal errors to be related to the launch */
    var LAUNCHING_DURATION = 500;
    // Enable search functionality in xterm.js instance
    xterm_1.Terminal.loadAddon('search');
    var StandardTerminalProcessFactory = (function () {
        function StandardTerminalProcessFactory() {
        }
        StandardTerminalProcessFactory.prototype.create = function (env) {
            return cp.fork('./terminalProcess', [], {
                env: env,
                cwd: uri_1.default.parse(path.dirname(require.toUrl('./terminalProcess'))).fsPath
            });
        };
        return StandardTerminalProcessFactory;
    }());
    var ProcessState;
    (function (ProcessState) {
        // The process has not been initialized yet.
        ProcessState[ProcessState["UNINITIALIZED"] = 0] = "UNINITIALIZED";
        // The process is currently launching, the process is marked as launching
        // for a short duration after being created and is helpful to indicate
        // whether the process died as a result of bad shell and args.
        ProcessState[ProcessState["LAUNCHING"] = 1] = "LAUNCHING";
        // The process is running normally.
        ProcessState[ProcessState["RUNNING"] = 2] = "RUNNING";
        // The process was killed during launch, likely as a result of bad shell and
        // args.
        ProcessState[ProcessState["KILLED_DURING_LAUNCH"] = 3] = "KILLED_DURING_LAUNCH";
        // The process was killed by the user (the event originated from VS Code).
        ProcessState[ProcessState["KILLED_BY_USER"] = 4] = "KILLED_BY_USER";
        // The process was killed by itself, for example the shell crashed or `exit`
        // was run.
        ProcessState[ProcessState["KILLED_BY_PROCESS"] = 5] = "KILLED_BY_PROCESS";
    })(ProcessState || (ProcessState = {}));
    var TerminalInstance = (function () {
        function TerminalInstance(_terminalFocusContextKey, _configHelper, _container, _shellLaunchConfig, _contextKeyService, _keybindingService, _messageService, _panelService, _contextService, _editorService, _instantiationService, _clipboardService, _historyService) {
            var _this = this;
            this._terminalFocusContextKey = _terminalFocusContextKey;
            this._configHelper = _configHelper;
            this._container = _container;
            this._shellLaunchConfig = _shellLaunchConfig;
            this._contextKeyService = _contextKeyService;
            this._keybindingService = _keybindingService;
            this._messageService = _messageService;
            this._panelService = _panelService;
            this._contextService = _contextService;
            this._editorService = _editorService;
            this._instantiationService = _instantiationService;
            this._clipboardService = _clipboardService;
            this._historyService = _historyService;
            this._instanceDisposables = [];
            this._processDisposables = [];
            this._skipTerminalCommands = [];
            this._isExiting = false;
            this._hadFocusOnExit = false;
            this._processState = ProcessState.UNINITIALIZED;
            this._isVisible = false;
            this._isDisposed = false;
            this._id = TerminalInstance._idCounter++;
            this._terminalHasTextContextKey = terminal_1.KEYBINDING_CONTEXT_TERMINAL_TEXT_SELECTED.bindTo(this._contextKeyService);
            this._preLaunchInputQueue = '';
            this._onDisposed = new event_1.Emitter();
            this._onDataForApi = new event_1.Emitter();
            this._onProcessIdReady = new event_1.Emitter();
            this._onTitleChanged = new event_1.Emitter();
            // Create a promise that resolves when the pty is ready
            this._processReady = new winjs_base_1.TPromise(function (c) {
                _this.onProcessIdReady(function () { return c(void 0); });
            });
            this._initDimensions();
            this._createProcess();
            this._createXterm();
            if (platform.isWindows) {
                this._processReady.then(function () {
                    if (!_this._isDisposed) {
                        new Promise(function (resolve_1, reject_1) { require(['vs/workbench/parts/terminal/electron-browser/windowsShellHelper'], resolve_1, reject_1); }).then(function (module) {
                            _this._windowsShellHelper = new module.WindowsShellHelper(_this._processId, _this._shellLaunchConfig.executable, _this, _this._xterm);
                        });
                    }
                });
            }
            // Only attach xterm.js to the DOM if the terminal panel has been opened before.
            if (_container) {
                this.attachToElement(_container);
            }
        }
        Object.defineProperty(TerminalInstance.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "processId", {
            get: function () { return this._processId; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "onDisposed", {
            get: function () { return this._onDisposed.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "onDataForApi", {
            get: function () { return this._onDataForApi.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "onProcessIdReady", {
            get: function () { return this._onProcessIdReady.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "onTitleChanged", {
            get: function () { return this._onTitleChanged.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "title", {
            get: function () { return this._title; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "hadFocusOnExit", {
            get: function () { return this._hadFocusOnExit; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalInstance.prototype, "isTitleSetByProcess", {
            get: function () { return !!this._messageTitleListener; },
            enumerable: true,
            configurable: true
        });
        TerminalInstance.prototype.addDisposable = function (disposable) {
            this._instanceDisposables.push(disposable);
        };
        TerminalInstance.prototype._initDimensions = function () {
            // The terminal panel needs to have been created
            if (!this._container) {
                return;
            }
            var computedStyle = window.getComputedStyle(this._container);
            var width = parseInt(computedStyle.getPropertyValue('width').replace('px', ''), 10);
            var height = parseInt(computedStyle.getPropertyValue('height').replace('px', ''), 10);
            this._evaluateColsAndRows(width, height);
        };
        /**
         * Evaluates and sets the cols and rows of the terminal if possible.
         * @param width The width of the container.
         * @param height The height of the container.
         * @return The terminal's width if it requires a layout.
         */
        TerminalInstance.prototype._evaluateColsAndRows = function (width, height) {
            var dimension = this._getDimension(width, height);
            if (!dimension) {
                return null;
            }
            var font = this._configHelper.getFont();
            this._cols = Math.max(Math.floor(dimension.width / font.charWidth), 1);
            this._rows = Math.max(Math.floor(dimension.height / font.charHeight), 1);
            return dimension.width;
        };
        TerminalInstance.prototype._getDimension = function (width, height) {
            // The font needs to have been initialized
            var font = this._configHelper.getFont();
            if (!font || !font.charWidth || !font.charHeight) {
                return null;
            }
            // The panel is minimized
            if (!height) {
                return TerminalInstance._lastKnownDimensions;
            }
            else {
                // Trigger scroll event manually so that the viewport's scroll area is synced. This
                // needs to happen otherwise its scrollTop value is invalid when the panel is toggled as
                // it gets removed and then added back to the DOM (resetting scrollTop to 0).
                // Upstream issue: https://github.com/sourcelair/xterm.js/issues/291
                if (this._xterm) {
                    this._xterm.emit('scroll', this._xterm.ydisp);
                }
            }
            var outerContainer = document.querySelector('.terminal-outer-container');
            var outerContainerStyle = getComputedStyle(outerContainer);
            var padding = parseInt(outerContainerStyle.paddingLeft.split('px')[0], 10);
            var paddingBottom = parseInt(outerContainerStyle.paddingBottom.split('px')[0], 10);
            // Use left padding as right padding, right padding is not defined in CSS just in case
            // xterm.js causes an unexpected overflow.
            var innerWidth = width - padding * 2;
            var innerHeight = height - paddingBottom;
            TerminalInstance._lastKnownDimensions = new builder_1.Dimension(innerWidth, innerHeight);
            return TerminalInstance._lastKnownDimensions;
        };
        /**
         * Create xterm.js instance and attach data listeners.
         */
        TerminalInstance.prototype._createXterm = function () {
            var _this = this;
            this._xterm = new xterm_1.Terminal({
                scrollback: this._configHelper.config.scrollback
            });
            if (this._shellLaunchConfig.initialText) {
                this._xterm.writeln(this._shellLaunchConfig.initialText);
            }
            this._process.on('message', function (message) { return _this._sendPtyDataToXterm(message); });
            this._xterm.on('data', function (data) {
                if (_this._processId) {
                    // Send data if the pty is ready
                    _this._process.send({
                        event: 'input',
                        data: data
                    });
                }
                else {
                    // If the pty is not ready, queue the data received from
                    // xterm.js until the pty is ready
                    _this._preLaunchInputQueue += data;
                }
                return false;
            });
            this._linkHandler = this._instantiationService.createInstance(terminalLinkHandler_1.TerminalLinkHandler, this._xterm, platform.platform, this._initialCwd);
            this._linkHandler.registerLocalLinkHandler();
        };
        TerminalInstance.prototype.attachToElement = function (container) {
            var _this = this;
            if (this._wrapperElement) {
                throw new Error('The terminal instance has already been attached to a container');
            }
            this._container = container;
            this._wrapperElement = document.createElement('div');
            dom.addClass(this._wrapperElement, 'terminal-wrapper');
            this._xtermElement = document.createElement('div');
            this._xterm.open(this._xtermElement);
            this._xterm.attachCustomKeyEventHandler(function (event) {
                // Disable all input if the terminal is exiting
                if (_this._isExiting) {
                    return false;
                }
                // Skip processing by xterm.js of keyboard events that resolve to commands described
                // within commandsToSkipShell
                var standardKeyboardEvent = new keyboardEvent_1.StandardKeyboardEvent(event);
                var resolveResult = _this._keybindingService.softDispatch(standardKeyboardEvent, standardKeyboardEvent.target);
                if (resolveResult && _this._skipTerminalCommands.some(function (k) { return k === resolveResult.commandId; })) {
                    event.preventDefault();
                    return false;
                }
                // If tab focus mode is on, tab is not passed to the terminal
                if (commonEditorConfig_1.TabFocus.getTabFocusMode() && event.keyCode === 9) {
                    return false;
                }
                return undefined;
            });
            this._instanceDisposables.push(dom.addDisposableListener(this._xterm.element, 'mouseup', function (event) {
                // Wait until mouseup has propagated through the DOM before
                // evaluating the new selection state.
                setTimeout(function () { return _this._refreshSelectionContextKey(); }, 0);
            }));
            // xterm.js currently drops selection on keyup as we need to handle this case.
            this._instanceDisposables.push(dom.addDisposableListener(this._xterm.element, 'keyup', function (event) {
                // Wait until keyup has propagated through the DOM before evaluating
                // the new selection state.
                setTimeout(function () { return _this._refreshSelectionContextKey(); }, 0);
            }));
            var xtermHelper = this._xterm.element.querySelector('.xterm-helpers');
            var focusTrap = document.createElement('div');
            focusTrap.setAttribute('tabindex', '0');
            dom.addClass(focusTrap, 'focus-trap');
            this._instanceDisposables.push(dom.addDisposableListener(focusTrap, 'focus', function (event) {
                var currentElement = focusTrap;
                while (!dom.hasClass(currentElement, 'part')) {
                    currentElement = currentElement.parentElement;
                }
                var hidePanelElement = currentElement.querySelector('.hide-panel-action');
                hidePanelElement.focus();
            }));
            xtermHelper.insertBefore(focusTrap, this._xterm.textarea);
            this._instanceDisposables.push(dom.addDisposableListener(this._xterm.textarea, 'focus', function (event) {
                _this._terminalFocusContextKey.set(true);
            }));
            this._instanceDisposables.push(dom.addDisposableListener(this._xterm.textarea, 'blur', function (event) {
                _this._terminalFocusContextKey.reset();
                _this._refreshSelectionContextKey();
            }));
            this._instanceDisposables.push(dom.addDisposableListener(this._xterm.element, 'focus', function (event) {
                _this._terminalFocusContextKey.set(true);
            }));
            this._instanceDisposables.push(dom.addDisposableListener(this._xterm.element, 'blur', function (event) {
                _this._terminalFocusContextKey.reset();
                _this._refreshSelectionContextKey();
            }));
            this._wrapperElement.appendChild(this._xtermElement);
            this._widgetManager = new terminalWidgetManager_1.TerminalWidgetManager(this._configHelper, this._wrapperElement);
            this._linkHandler.setWidgetManager(this._widgetManager);
            this._container.appendChild(this._wrapperElement);
            var computedStyle = window.getComputedStyle(this._container);
            var width = parseInt(computedStyle.getPropertyValue('width').replace('px', ''), 10);
            var height = parseInt(computedStyle.getPropertyValue('height').replace('px', ''), 10);
            this.layout(new builder_1.Dimension(width, height));
            this.setVisible(this._isVisible);
            this.updateConfig();
            // If IShellLaunchConfig.waitOnExit was true and the process finished before the terminal
            // panel was initialized.
            if (this._xterm.getOption('disableStdin')) {
                this._attachPressAnyKeyToCloseListener();
            }
        };
        TerminalInstance.prototype.registerLinkMatcher = function (regex, handler, matchIndex, validationCallback) {
            return this._linkHandler.registerCustomLinkHandler(regex, handler, matchIndex, validationCallback);
        };
        TerminalInstance.prototype.deregisterLinkMatcher = function (linkMatcherId) {
            this._xterm.deregisterLinkMatcher(linkMatcherId);
        };
        TerminalInstance.prototype.hasSelection = function () {
            return this._xterm.hasSelection();
        };
        TerminalInstance.prototype.copySelection = function () {
            if (this.hasSelection()) {
                this._clipboardService.writeText(this._xterm.getSelection());
            }
            else {
                this._messageService.show(message_1.Severity.Warning, nls.localize('terminal.integrated.copySelection.noSelection', 'The terminal has no selection to copy'));
            }
        };
        Object.defineProperty(TerminalInstance.prototype, "selection", {
            get: function () {
                return this.hasSelection() ? this._xterm.getSelection() : undefined;
            },
            enumerable: true,
            configurable: true
        });
        TerminalInstance.prototype.clearSelection = function () {
            this._xterm.clearSelection();
        };
        TerminalInstance.prototype.selectAll = function () {
            // Focus here to ensure the terminal context key is set
            this._xterm.focus();
            this._xterm.selectAll();
        };
        TerminalInstance.prototype.findNext = function (term) {
            return this._xterm.findNext(term);
        };
        TerminalInstance.prototype.findPrevious = function (term) {
            return this._xterm.findPrevious(term);
        };
        TerminalInstance.prototype.notifyFindWidgetFocusChanged = function (isFocused) {
            // In order to support escape to close the find widget when the terminal
            // is focused terminalFocus needs to be true when either the terminal or
            // the find widget are focused.
            this._terminalFocusContextKey.set(isFocused || document.activeElement === this._xterm.textarea);
        };
        TerminalInstance.prototype.dispose = function () {
            if (this._windowsShellHelper) {
                this._windowsShellHelper.dispose();
            }
            if (this._linkHandler) {
                this._linkHandler.dispose();
            }
            if (this._xterm && this._xterm.element) {
                this._hadFocusOnExit = dom.hasClass(this._xterm.element, 'focus');
            }
            if (this._wrapperElement) {
                this._container.removeChild(this._wrapperElement);
                this._wrapperElement = null;
            }
            if (this._xterm) {
                this._xterm.destroy();
                this._xterm = null;
            }
            if (this._process) {
                if (this._process.connected) {
                    // If the process was still connected this dispose came from
                    // within VS Code, not the process, so mark the process as
                    // killed by the user.
                    this._processState = ProcessState.KILLED_BY_USER;
                    this._process.send({ event: 'shutdown' });
                }
                this._process = null;
            }
            if (!this._isDisposed) {
                this._isDisposed = true;
                this._onDisposed.fire(this);
            }
            this._processDisposables = lifecycle.dispose(this._processDisposables);
            this._instanceDisposables = lifecycle.dispose(this._instanceDisposables);
        };
        TerminalInstance.prototype.focus = function (force) {
            if (!this._xterm) {
                return;
            }
            var text = window.getSelection().toString();
            if (!text || force) {
                this._xterm.focus();
            }
        };
        TerminalInstance.prototype.paste = function () {
            this.focus();
            document.execCommand('paste');
        };
        TerminalInstance.prototype.sendText = function (text, addNewLine) {
            var _this = this;
            this._processReady.then(function () {
                // Normalize line endings to 'enter' press.
                text = text.replace(TerminalInstance.EOL_REGEX, '\r');
                if (addNewLine && text.substr(text.length - 1) !== '\r') {
                    text += '\r';
                }
                _this._process.send({
                    event: 'input',
                    data: text
                });
            });
        };
        TerminalInstance.prototype.setVisible = function (visible) {
            this._isVisible = visible;
            if (this._wrapperElement) {
                dom.toggleClass(this._wrapperElement, 'active', visible);
            }
            if (visible && this._xterm) {
                // Trigger a manual scroll event which will sync the viewport and scroll bar. This is
                // necessary if the number of rows in the terminal has decreased while it was in the
                // background since scrollTop changes take no effect but the terminal's position does
                // change since the number of visible rows decreases.
                this._xterm.emit('scroll', this._xterm.ydisp);
            }
        };
        TerminalInstance.prototype.scrollDownLine = function () {
            this._xterm.scrollDisp(1);
        };
        TerminalInstance.prototype.scrollDownPage = function () {
            this._xterm.scrollPages(1);
        };
        TerminalInstance.prototype.scrollToBottom = function () {
            this._xterm.scrollToBottom();
        };
        TerminalInstance.prototype.scrollUpLine = function () {
            this._xterm.scrollDisp(-1);
        };
        TerminalInstance.prototype.scrollUpPage = function () {
            this._xterm.scrollPages(-1);
        };
        TerminalInstance.prototype.scrollToTop = function () {
            this._xterm.scrollToTop();
        };
        TerminalInstance.prototype.clear = function () {
            this._xterm.clear();
        };
        TerminalInstance.prototype._refreshSelectionContextKey = function () {
            var activePanel = this._panelService.getActivePanel();
            var isActive = activePanel && activePanel.getId() === terminal_1.TERMINAL_PANEL_ID;
            this._terminalHasTextContextKey.set(isActive && this.hasSelection());
        };
        TerminalInstance.prototype._getCwd = function (shell, root) {
            if (shell.cwd) {
                return shell.cwd;
            }
            var cwd;
            // TODO: Handle non-existent customCwd
            if (!shell.ignoreConfigurationCwd) {
                // Evaluate custom cwd first
                var customCwd = this._configHelper.config.cwd;
                if (customCwd) {
                    if (path.isAbsolute(customCwd)) {
                        cwd = customCwd;
                    }
                    else if (root) {
                        cwd = path.normalize(path.join(root.fsPath, customCwd));
                    }
                }
            }
            // If there was no custom cwd or it was relative with no workspace
            if (!cwd) {
                cwd = root ? root.fsPath : os.homedir();
            }
            return TerminalInstance._sanitizeCwd(cwd);
        };
        TerminalInstance.prototype._createProcess = function () {
            var _this = this;
            var locale = this._configHelper.config.setLocaleVariables ? platform.locale : undefined;
            if (!this._shellLaunchConfig.executable) {
                this._configHelper.mergeDefaultShellPathAndArgs(this._shellLaunchConfig);
            }
            this._initialCwd = this._getCwd(this._shellLaunchConfig, this._historyService.getLastActiveWorkspaceRoot());
            var envFromConfig;
            if (platform.isWindows) {
                envFromConfig = __assign({}, process.env);
                for (var configKey in this._configHelper.config.env['windows']) {
                    var actualKey = configKey;
                    for (var envKey in envFromConfig) {
                        if (configKey.toLowerCase() === envKey.toLowerCase()) {
                            actualKey = envKey;
                            break;
                        }
                    }
                    envFromConfig[actualKey] = this._configHelper.config.env['windows'][configKey];
                }
            }
            else {
                var platformKey = platform.isMacintosh ? 'osx' : 'linux';
                envFromConfig = __assign({}, process.env, this._configHelper.config.env[platformKey]);
            }
            var env = TerminalInstance.createTerminalEnv(envFromConfig, this._shellLaunchConfig, this._initialCwd, locale, this._cols, this._rows);
            this._process = cp.fork(uri_1.default.parse(require.toUrl('bootstrap')).fsPath, ['--type=terminal'], {
                env: env,
                cwd: uri_1.default.parse(path.dirname(require.toUrl('../node/terminalProcess'))).fsPath
            });
            this._processState = ProcessState.LAUNCHING;
            if (this._shellLaunchConfig.name) {
                this.setTitle(this._shellLaunchConfig.name, false);
            }
            else {
                // Only listen for process title changes when a name is not provided
                this.setTitle(this._shellLaunchConfig.executable, true);
                this._messageTitleListener = function (message) {
                    if (message.type === 'title') {
                        _this.setTitle(message.content ? message.content : '', true);
                    }
                };
                this._process.on('message', this._messageTitleListener);
            }
            this._process.on('message', function (message) {
                if (message.type === 'pid') {
                    _this._processId = message.content;
                    // Send any queued data that's waiting
                    if (_this._preLaunchInputQueue.length > 0) {
                        _this._process.send({
                            event: 'input',
                            data: _this._preLaunchInputQueue
                        });
                        _this._preLaunchInputQueue = null;
                    }
                    _this._onProcessIdReady.fire(_this);
                }
            });
            this._process.on('exit', function (exitCode) { return _this._onPtyProcessExit(exitCode); });
            setTimeout(function () {
                if (_this._processState === ProcessState.LAUNCHING) {
                    _this._processState = ProcessState.RUNNING;
                }
            }, LAUNCHING_DURATION);
        };
        TerminalInstance.prototype._sendPtyDataToXterm = function (message) {
            if (message.type === 'data') {
                if (this._widgetManager) {
                    this._widgetManager.closeMessage();
                }
                if (this._xterm) {
                    this._xterm.write(message.content);
                }
            }
        };
        TerminalInstance.prototype._onPtyProcessExit = function (exitCode) {
            // Prevent dispose functions being triggered multiple times
            if (this._isExiting) {
                return;
            }
            this._isExiting = true;
            this._process = null;
            var exitCodeMessage;
            if (exitCode) {
                exitCodeMessage = nls.localize('terminal.integrated.exitedWithCode', 'The terminal process terminated with exit code: {0}', exitCode);
            }
            // If the process is marked as launching then mark the process as killed
            // during launch. This typically means that there is a problem with the
            // shell and args.
            if (this._processState === ProcessState.LAUNCHING) {
                this._processState = ProcessState.KILLED_DURING_LAUNCH;
            }
            // If TerminalInstance did not know about the process exit then it was
            // triggered by the process, not on VS Code's side.
            if (this._processState === ProcessState.RUNNING) {
                this._processState = ProcessState.KILLED_BY_PROCESS;
            }
            // Only trigger wait on exit when the exit was triggered by the process,
            // not through the `workbench.action.terminal.kill` command
            if (this._processState === ProcessState.KILLED_BY_PROCESS && this._shellLaunchConfig.waitOnExit) {
                if (exitCode) {
                    this._xterm.writeln(exitCodeMessage);
                }
                var message = typeof this._shellLaunchConfig.waitOnExit === 'string'
                    ? this._shellLaunchConfig.waitOnExit
                    : nls.localize('terminal.integrated.waitOnExit', 'Press any key to close the terminal');
                // Bold the message and add an extra new line to make it stand out from the rest of the output
                message = "\n\u001B[1m" + message + "\u001B[0m";
                this._xterm.writeln(message);
                // Disable all input if the terminal is exiting and listen for next keypress
                this._xterm.setOption('disableStdin', true);
                if (this._xterm.textarea) {
                    this._attachPressAnyKeyToCloseListener();
                }
            }
            else {
                this.dispose();
                if (exitCode) {
                    if (this._processState === ProcessState.KILLED_DURING_LAUNCH) {
                        var args = '';
                        if (typeof this._shellLaunchConfig.args === 'string') {
                            args = this._shellLaunchConfig.args;
                        }
                        else if (this._shellLaunchConfig.args && this._shellLaunchConfig.args.length) {
                            args = ' ' + this._shellLaunchConfig.args.map(function (a) {
                                if (typeof a === 'string' && a.indexOf(' ') !== -1) {
                                    return "'" + a + "'";
                                }
                                return a;
                            }).join(' ');
                        }
                        this._messageService.show(message_1.Severity.Error, nls.localize('terminal.integrated.launchFailed', 'The terminal process command `{0}{1}` failed to launch (exit code: {2})', this._shellLaunchConfig.executable, args, exitCode));
                    }
                    else {
                        this._messageService.show(message_1.Severity.Error, exitCodeMessage);
                    }
                }
            }
        };
        TerminalInstance.prototype._attachPressAnyKeyToCloseListener = function () {
            var _this = this;
            this._processDisposables.push(dom.addDisposableListener(this._xterm.textarea, 'keypress', function (event) {
                _this.dispose();
                event.preventDefault();
            }));
        };
        TerminalInstance.prototype.reuseTerminal = function (shell) {
            var _this = this;
            // Kill and clean up old process
            if (this._process) {
                this._process.removeAllListeners('exit');
                if (this._process.connected) {
                    this._process.kill();
                }
                this._process = null;
            }
            lifecycle.dispose(this._processDisposables);
            this._processDisposables = [];
            // Ensure new processes' output starts at start of new line
            this._xterm.write('\n\x1b[G');
            // Print initialText if specified
            if (shell.initialText) {
                this._xterm.writeln(shell.initialText);
            }
            // Initialize new process
            var oldTitle = this._title;
            this._shellLaunchConfig = shell;
            this._createProcess();
            if (oldTitle !== this._title) {
                this.setTitle(this._title, true);
            }
            this._process.on('message', function (message) { return _this._sendPtyDataToXterm(message); });
            // Clean up waitOnExit state
            if (this._isExiting && this._shellLaunchConfig.waitOnExit) {
                this._xterm.setOption('disableStdin', false);
                this._isExiting = false;
            }
            // Set the new shell launch config
            this._shellLaunchConfig = shell;
        };
        // TODO: This should be private/protected
        // TODO: locale should not be optional
        TerminalInstance.createTerminalEnv = function (parentEnv, shell, cwd, locale, cols, rows) {
            var env = shell.env ? shell.env : TerminalInstance._cloneEnv(parentEnv);
            env['PTYPID'] = process.pid.toString();
            env['PTYSHELL'] = shell.executable;
            env['TERM_PROGRAM'] = 'vscode';
            env['TERM_PROGRAM_VERSION'] = package_1.default.version;
            if (shell.args) {
                if (typeof shell.args === 'string') {
                    env["PTYSHELLCMDLINE"] = shell.args;
                }
                else {
                    shell.args.forEach(function (arg, i) { return env["PTYSHELLARG" + i] = arg; });
                }
            }
            env['PTYCWD'] = cwd;
            env['LANG'] = TerminalInstance._getLangEnvVariable(locale);
            if (cols && rows) {
                env['PTYCOLS'] = cols.toString();
                env['PTYROWS'] = rows.toString();
            }
            env['AMD_ENTRYPOINT'] = 'vs/workbench/parts/terminal/node/terminalProcess';
            return env;
        };
        TerminalInstance.prototype.onData = function (listener) {
            var _this = this;
            var callback = function (message) {
                if (message.type === 'data') {
                    listener(message.content);
                }
            };
            this._process.on('message', callback);
            return {
                dispose: function () {
                    if (_this._process) {
                        _this._process.removeListener('message', callback);
                    }
                }
            };
        };
        TerminalInstance.prototype.onExit = function (listener) {
            var _this = this;
            if (this._process) {
                this._process.on('exit', listener);
            }
            return {
                dispose: function () {
                    if (_this._process) {
                        _this._process.removeListener('exit', listener);
                    }
                }
            };
        };
        TerminalInstance._sanitizeCwd = function (cwd) {
            // Make the drive letter uppercase on Windows (see #9448)
            if (platform.platform === platform.Platform.Windows && cwd && cwd[1] === ':') {
                return cwd[0].toUpperCase() + cwd.substr(1);
            }
            return cwd;
        };
        TerminalInstance._cloneEnv = function (env) {
            var newEnv = Object.create(null);
            Object.keys(env).forEach(function (key) {
                newEnv[key] = env[key];
            });
            return newEnv;
        };
        TerminalInstance._getLangEnvVariable = function (locale) {
            var parts = locale ? locale.split('-') : [];
            var n = parts.length;
            if (n === 0) {
                // Fallback to en_US to prevent possible encoding issues.
                return 'en_US.UTF-8';
            }
            if (n === 1) {
                // app.getLocale can return just a language without a variant, fill in the variant for
                // supported languages as many shells expect a 2-part locale.
                var languageVariants = {
                    de: 'DE',
                    en: 'US',
                    es: 'ES',
                    fr: 'FR',
                    it: 'IT',
                    ja: 'JP',
                    ko: 'KR',
                    ru: 'RU',
                    zh: 'CN'
                };
                if (parts[0] in languageVariants) {
                    parts.push(languageVariants[parts[0]]);
                }
            }
            else {
                // Ensure the variant is uppercase
                parts[1] = parts[1].toUpperCase();
            }
            return parts.join('_') + '.UTF-8';
        };
        TerminalInstance.prototype.updateConfig = function () {
            this._setCursorBlink(this._configHelper.config.cursorBlinking);
            this._setCursorStyle(this._configHelper.config.cursorStyle);
            this._setCommandsToSkipShell(this._configHelper.config.commandsToSkipShell);
            this._setScrollback(this._configHelper.config.scrollback);
        };
        TerminalInstance.prototype._setCursorBlink = function (blink) {
            if (this._xterm && this._xterm.getOption('cursorBlink') !== blink) {
                this._xterm.setOption('cursorBlink', blink);
                this._xterm.refresh(0, this._xterm.rows - 1);
            }
        };
        TerminalInstance.prototype._setCursorStyle = function (style) {
            if (this._xterm && this._xterm.getOption('cursorStyle') !== style) {
                // 'line' is used instead of bar in VS Code to be consistent with editor.cursorStyle
                var xtermOption = style === 'line' ? 'bar' : style;
                this._xterm.setOption('cursorStyle', xtermOption);
            }
        };
        TerminalInstance.prototype._setCommandsToSkipShell = function (commands) {
            this._skipTerminalCommands = commands;
        };
        TerminalInstance.prototype._setScrollback = function (lineCount) {
            if (this._xterm && this._xterm.getOption('scrollback') !== lineCount) {
                this._xterm.setOption('scrollback', lineCount);
            }
        };
        TerminalInstance.prototype.layout = function (dimension) {
            var _this = this;
            var terminalWidth = this._evaluateColsAndRows(dimension.width, dimension.height);
            if (!terminalWidth) {
                return;
            }
            if (this._xterm) {
                this._xterm.resize(this._cols, this._rows);
                this._xterm.element.style.width = terminalWidth + 'px';
            }
            this._processReady.then(function () {
                if (_this._process && _this._process.connected) {
                    // The child process could aready be terminated
                    try {
                        _this._process.send({
                            event: 'resize',
                            cols: _this._cols,
                            rows: _this._rows
                        });
                    }
                    catch (error) {
                        // We tried to write to a closed pipe / channel.
                        if (error.code !== 'EPIPE' && error.code !== 'ERR_IPC_CHANNEL_CLOSED') {
                            throw (error);
                        }
                    }
                }
            });
        };
        TerminalInstance.setTerminalProcessFactory = function (factory) {
            this._terminalProcessFactory = factory;
        };
        TerminalInstance.prototype.setTitle = function (title, eventFromProcess) {
            if (!title) {
                return;
            }
            if (eventFromProcess) {
                title = path.basename(title);
                if (platform.isWindows) {
                    // Remove the .exe extension
                    title = title.split('.exe')[0];
                }
            }
            else {
                // If the title has not been set by the API or the rename command, unregister the handler that
                // automatically updates the terminal name
                if (this._process && this._messageTitleListener) {
                    this._process.removeListener('message', this._messageTitleListener);
                    this._messageTitleListener = null;
                }
            }
            var didTitleChange = title !== this._title;
            this._title = title;
            if (didTitleChange) {
                this._onTitleChanged.fire(title);
            }
        };
        TerminalInstance.EOL_REGEX = /\r?\n/g;
        TerminalInstance._terminalProcessFactory = new StandardTerminalProcessFactory();
        TerminalInstance._lastKnownDimensions = null;
        TerminalInstance._idCounter = 1;
        TerminalInstance = __decorate([
            __param(4, contextkey_1.IContextKeyService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, message_1.IMessageService),
            __param(7, panelService_1.IPanelService),
            __param(8, workspace_1.IWorkspaceContextService),
            __param(9, editorService_1.IWorkbenchEditorService),
            __param(10, instantiation_1.IInstantiationService),
            __param(11, clipboardService_1.IClipboardService),
            __param(12, history_1.IHistoryService)
        ], TerminalInstance);
        return TerminalInstance;
    }());
    exports.TerminalInstance = TerminalInstance;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        // Scrollbar
        var scrollbarSliderBackgroundColor = theme.getColor(colorRegistry_1.scrollbarSliderBackground);
        if (scrollbarSliderBackgroundColor) {
            collector.addRule("\n\t\t\t.monaco-workbench .panel.integrated-terminal .xterm.focus .xterm-viewport,\n\t\t\t.monaco-workbench .panel.integrated-terminal .xterm:focus .xterm-viewport,\n\t\t\t.monaco-workbench .panel.integrated-terminal .xterm:hover .xterm-viewport { background-color: " + scrollbarSliderBackgroundColor + "; }");
        }
        var scrollbarSliderHoverBackgroundColor = theme.getColor(colorRegistry_1.scrollbarSliderHoverBackground);
        if (scrollbarSliderHoverBackgroundColor) {
            collector.addRule(".monaco-workbench .panel.integrated-terminal .xterm .xterm-viewport::-webkit-scrollbar-thumb:hover { background-color: " + scrollbarSliderHoverBackgroundColor + "; }");
        }
        var scrollbarSliderActiveBackgroundColor = theme.getColor(colorRegistry_1.scrollbarSliderActiveBackground);
        if (scrollbarSliderActiveBackgroundColor) {
            collector.addRule(".monaco-workbench .panel.integrated-terminal .xterm .xterm-viewport::-webkit-scrollbar-thumb:active { background-color: " + scrollbarSliderActiveBackgroundColor + "; }");
        }
    });
});
//# sourceMappingURL=terminalInstance.js.map