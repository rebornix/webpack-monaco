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
define(["require", "exports", "vs/base/browser/dom", "vs/nls", "vs/base/common/platform", "vs/base/browser/builder", "vs/base/browser/ui/actionbar/actionbar", "vs/platform/configuration/common/configuration", "vs/platform/contextview/browser/contextView", "vs/platform/instantiation/common/instantiation", "vs/platform/telemetry/common/telemetry", "vs/workbench/parts/terminal/common/terminal", "vs/platform/theme/common/themeService", "./terminalFindWidget", "./terminalColorRegistry", "vs/platform/theme/common/colorRegistry", "vs/workbench/common/theme", "vs/workbench/parts/terminal/electron-browser/terminalActions", "vs/workbench/browser/panel", "vs/base/browser/mouseEvent", "vs/base/common/winjs.base", "vs/base/common/uri"], function (require, exports, dom, nls, platform, builder_1, actionbar_1, configuration_1, contextView_1, instantiation_1, telemetry_1, terminal_1, themeService_1, terminalFindWidget_1, terminalColorRegistry_1, colorRegistry_1, theme_1, terminalActions_1, panel_1, mouseEvent_1, winjs_base_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerminalPanel = (function (_super) {
        __extends(TerminalPanel, _super);
        function TerminalPanel(_configurationService, _contextMenuService, _contextViewService, _instantiationService, _terminalService, themeService, telemetryService) {
            var _this = _super.call(this, terminal_1.TERMINAL_PANEL_ID, telemetryService, themeService) || this;
            _this._configurationService = _configurationService;
            _this._contextMenuService = _contextMenuService;
            _this._contextViewService = _contextViewService;
            _this._instantiationService = _instantiationService;
            _this._terminalService = _terminalService;
            _this.themeService = themeService;
            _this._cancelContextMenu = false;
            return _this;
        }
        TerminalPanel.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            this._parentDomElement = parent.getHTMLElement();
            dom.addClass(this._parentDomElement, 'integrated-terminal');
            this._themeStyleElement = document.createElement('style');
            this._fontStyleElement = document.createElement('style');
            this._terminalContainer = document.createElement('div');
            dom.addClass(this._terminalContainer, 'terminal-outer-container');
            this._findWidget = this._instantiationService.createInstance(terminalFindWidget_1.TerminalFindWidget);
            this._parentDomElement.appendChild(this._themeStyleElement);
            this._parentDomElement.appendChild(this._fontStyleElement);
            this._parentDomElement.appendChild(this._terminalContainer);
            this._parentDomElement.appendChild(this._findWidget.getDomNode());
            this._attachEventListeners();
            this._terminalService.setContainers(this.getContainer().getHTMLElement(), this._terminalContainer);
            this._register(this.themeService.onThemeChange(function (theme) { return _this._updateTheme(theme); }));
            this._register(this._configurationService.onDidUpdateConfiguration(function () { return _this._updateFont(); }));
            this._updateFont();
            this._updateTheme();
            // Force another layout (first is setContainers) since config has changed
            this.layout(new builder_1.Dimension(this._terminalContainer.offsetWidth, this._terminalContainer.offsetHeight));
            return winjs_base_1.TPromise.as(void 0);
        };
        TerminalPanel.prototype.layout = function (dimension) {
            if (!dimension) {
                return;
            }
            this._terminalService.terminalInstances.forEach(function (t) {
                t.layout(dimension);
            });
        };
        TerminalPanel.prototype.setVisible = function (visible) {
            var _this = this;
            if (visible) {
                if (this._terminalService.terminalInstances.length > 0) {
                    this._updateFont();
                    this._updateTheme();
                }
                else {
                    return _super.prototype.setVisible.call(this, visible).then(function () {
                        var instance = _this._terminalService.createInstance();
                        if (instance) {
                            _this._updateFont();
                            _this._updateTheme();
                        }
                        return winjs_base_1.TPromise.as(void 0);
                    });
                }
            }
            return _super.prototype.setVisible.call(this, visible);
        };
        TerminalPanel.prototype.getActions = function () {
            var _this = this;
            if (!this._actions) {
                this._actions = [
                    this._instantiationService.createInstance(terminalActions_1.SwitchTerminalInstanceAction, terminalActions_1.SwitchTerminalInstanceAction.ID, terminalActions_1.SwitchTerminalInstanceAction.LABEL),
                    this._instantiationService.createInstance(terminalActions_1.CreateNewTerminalAction, terminalActions_1.CreateNewTerminalAction.ID, terminalActions_1.CreateNewTerminalAction.PANEL_LABEL),
                    this._instantiationService.createInstance(terminalActions_1.KillTerminalAction, terminalActions_1.KillTerminalAction.ID, terminalActions_1.KillTerminalAction.PANEL_LABEL)
                ];
                this._actions.forEach(function (a) {
                    _this._register(a);
                });
            }
            return this._actions;
        };
        TerminalPanel.prototype._getContextMenuActions = function () {
            var _this = this;
            if (!this._contextMenuActions) {
                this._copyContextMenuAction = this._instantiationService.createInstance(terminalActions_1.CopyTerminalSelectionAction, terminalActions_1.CopyTerminalSelectionAction.ID, nls.localize('copy', "Copy"));
                this._contextMenuActions = [
                    this._instantiationService.createInstance(terminalActions_1.CreateNewTerminalAction, terminalActions_1.CreateNewTerminalAction.ID, nls.localize('createNewTerminal', "New Terminal")),
                    new actionbar_1.Separator(),
                    this._copyContextMenuAction,
                    this._instantiationService.createInstance(terminalActions_1.TerminalPasteAction, terminalActions_1.TerminalPasteAction.ID, nls.localize('paste', "Paste")),
                    this._instantiationService.createInstance(terminalActions_1.SelectAllTerminalAction, terminalActions_1.SelectAllTerminalAction.ID, nls.localize('selectAll', "Select All")),
                    new actionbar_1.Separator(),
                    this._instantiationService.createInstance(terminalActions_1.ClearTerminalAction, terminalActions_1.ClearTerminalAction.ID, nls.localize('clear', "Clear"))
                ];
                this._contextMenuActions.forEach(function (a) {
                    _this._register(a);
                });
            }
            var activeInstance = this._terminalService.getActiveInstance();
            this._copyContextMenuAction.enabled = activeInstance && activeInstance.hasSelection();
            return this._contextMenuActions;
        };
        TerminalPanel.prototype.getActionItem = function (action) {
            if (action.id === terminalActions_1.SwitchTerminalInstanceAction.ID) {
                return this._instantiationService.createInstance(terminalActions_1.SwitchTerminalInstanceActionItem, action);
            }
            return _super.prototype.getActionItem.call(this, action);
        };
        TerminalPanel.prototype.focus = function () {
            var activeInstance = this._terminalService.getActiveInstance();
            if (activeInstance) {
                activeInstance.focus(true);
            }
        };
        TerminalPanel.prototype.focusFindWidget = function () {
            var activeInstance = this._terminalService.getActiveInstance();
            if (activeInstance && activeInstance.hasSelection() && activeInstance.selection.indexOf('\n') === -1) {
                this._findWidget.reveal(activeInstance.selection);
            }
            else {
                this._findWidget.reveal();
            }
        };
        TerminalPanel.prototype.hideFindWidget = function () {
            this._findWidget.hide();
        };
        TerminalPanel.prototype.showNextFindTermFindWidget = function () {
            this._findWidget.showNextFindTerm();
        };
        TerminalPanel.prototype.showPreviousFindTermFindWidget = function () {
            this._findWidget.showPreviousFindTerm();
        };
        TerminalPanel.prototype._attachEventListeners = function () {
            var _this = this;
            this._register(dom.addDisposableListener(this._parentDomElement, 'mousedown', function (event) {
                if (_this._terminalService.terminalInstances.length === 0) {
                    return;
                }
                if (event.which === 2 && platform.isLinux) {
                    // Drop selection and focus terminal on Linux to enable middle button paste when click
                    // occurs on the selection itself.
                    _this._terminalService.getActiveInstance().focus();
                }
                else if (event.which === 3) {
                    if (_this._terminalService.configHelper.config.rightClickCopyPaste) {
                        var terminal_2 = _this._terminalService.getActiveInstance();
                        if (terminal_2.hasSelection()) {
                            terminal_2.copySelection();
                            terminal_2.clearSelection();
                        }
                        else {
                            terminal_2.paste();
                        }
                        // Clear selection after all click event bubbling is finished on Mac to prevent
                        // right-click selecting a word which is seemed cannot be disabled. There is a
                        // flicker when pasting but this appears to give the best experience if the
                        // setting is enabled.
                        if (platform.isMacintosh) {
                            setTimeout(function () {
                                terminal_2.clearSelection();
                            }, 0);
                        }
                        _this._cancelContextMenu = true;
                    }
                }
            }));
            this._register(dom.addDisposableListener(this._parentDomElement, 'contextmenu', function (event) {
                if (!_this._cancelContextMenu) {
                    var standardEvent = new mouseEvent_1.StandardMouseEvent(event);
                    var anchor_1 = { x: standardEvent.posx, y: standardEvent.posy };
                    _this._contextMenuService.showContextMenu({
                        getAnchor: function () { return anchor_1; },
                        getActions: function () { return winjs_base_1.TPromise.as(_this._getContextMenuActions()); },
                        getActionsContext: function () { return _this._parentDomElement; }
                    });
                }
                _this._cancelContextMenu = false;
            }));
            this._register(dom.addDisposableListener(this._parentDomElement, 'click', function (event) {
                if (event.which === 3) {
                    return;
                }
                var instance = _this._terminalService.getActiveInstance();
                if (instance) {
                    _this._terminalService.getActiveInstance().focus();
                }
            }));
            this._register(dom.addDisposableListener(this._parentDomElement, 'keyup', function (event) {
                if (event.keyCode === 27) {
                    // Keep terminal open on escape
                    event.stopPropagation();
                }
            }));
            this._register(dom.addDisposableListener(this._parentDomElement, dom.EventType.DROP, function (e) {
                if (e.target === _this._parentDomElement || dom.isAncestor(e.target, _this._parentDomElement)) {
                    if (!e.dataTransfer) {
                        return;
                    }
                    // Check if the file was dragged from the tree explorer
                    var uri = e.dataTransfer.getData('URL');
                    if (uri) {
                        uri = uri_1.default.parse(uri).path;
                    }
                    else if (e.dataTransfer.files.length > 0) {
                        // Check if the file was dragged from the filesystem
                        uri = uri_1.default.file(e.dataTransfer.files[0].path).fsPath;
                    }
                    if (!uri) {
                        return;
                    }
                    var terminal = _this._terminalService.getActiveInstance();
                    terminal.sendText(TerminalPanel.preparePathForTerminal(uri), false);
                }
            }));
        };
        TerminalPanel.prototype._updateTheme = function (theme) {
            if (!theme) {
                theme = this.themeService.getTheme();
            }
            var css = '';
            terminalColorRegistry_1.ansiColorIdentifiers.forEach(function (colorId, index) {
                if (colorId) {
                    var color = theme.getColor(colorId);
                    css += ".monaco-workbench .panel.integrated-terminal .xterm .xterm-color-" + index + " { color: " + color + "; }" +
                        (".monaco-workbench .panel.integrated-terminal .xterm .xterm-bg-color-" + index + " { background-color: " + color + "; }");
                }
            });
            var bgColor = theme.getColor(terminalColorRegistry_1.TERMINAL_BACKGROUND_COLOR);
            if (bgColor) {
                css += ".monaco-workbench .panel.integrated-terminal .terminal-outer-container { background-color: " + bgColor + "; }";
            }
            var fgColor = theme.getColor(terminalColorRegistry_1.TERMINAL_FOREGROUND_COLOR);
            if (fgColor) {
                css += ".monaco-workbench .panel.integrated-terminal .xterm { color: " + fgColor + "; }";
            }
            var cursorFgColor = theme.getColor(terminalColorRegistry_1.TERMINAL_CURSOR_FOREGROUND_COLOR) || fgColor;
            if (cursorFgColor) {
                css += ".monaco-workbench .panel.integrated-terminal .xterm:not(.xterm-cursor-style-underline):not(.xterm-cursor-style-bar).focus .terminal-cursor," +
                    (".monaco-workbench .panel.integrated-terminal .xterm:not(.xterm-cursor-style-underline):not(.xterm-cursor-style-bar):focus .terminal-cursor { background-color: " + cursorFgColor + " }") +
                    (".monaco-workbench .panel.integrated-terminal .xterm:not(.focus):not(:focus) .terminal-cursor { outline-color: " + cursorFgColor + "; }") +
                    ".monaco-workbench .panel.integrated-terminal .xterm.xterm-cursor-style-bar .terminal-cursor::before," +
                    (".monaco-workbench .panel.integrated-terminal .xterm.xterm-cursor-style-underline .terminal-cursor::before { background-color: " + cursorFgColor + "; }") +
                    ".monaco-workbench .panel.integrated-terminal .xterm.xterm-cursor-style-bar.focus.xterm-cursor-blink .terminal-cursor::before," +
                    (".monaco-workbench .panel.integrated-terminal .xterm.xterm-cursor-style-underline.focus.xterm-cursor-blink .terminal-cursor::before { background-color: " + cursorFgColor + "; }");
            }
            var cursorBgColor = theme.getColor(terminalColorRegistry_1.TERMINAL_CURSOR_BACKGROUND_COLOR) || bgColor || theme.getColor(theme_1.PANEL_BACKGROUND);
            if (cursorBgColor) {
                css += ".monaco-workbench .panel.integrated-terminal .xterm:not(.xterm-cursor-style-underline):not(.xterm-cursor-style-bar).focus .terminal-cursor," +
                    (".monaco-workbench .panel.integrated-terminal .xterm:not(.xterm-cursor-style-underline):not(.xterm-cursor-style-bar):focus .terminal-cursor { color: " + cursorBgColor + " }");
            }
            // TODO: Reinstate, see #28397
            // const selectionColor = theme.getColor(TERMINAL_SELECTION_BACKGROUND_COLOR);
            // if (selectionColor) {
            // 	css += `.monaco-workbench .panel.integrated-terminal .xterm .xterm-selection div { background-color: ${selectionColor}; }`;
            // }
            // Borrow the editor's hover background for now
            var hoverBackground = theme.getColor(colorRegistry_1.editorHoverBackground);
            if (hoverBackground) {
                css += ".monaco-workbench .panel.integrated-terminal .terminal-message-widget { background-color: " + hoverBackground + "; }";
            }
            var hoverBorder = theme.getColor(colorRegistry_1.editorHoverBorder);
            if (hoverBorder) {
                css += ".monaco-workbench .panel.integrated-terminal .terminal-message-widget { border: 1px solid " + hoverBorder + "; }";
            }
            var hoverForeground = theme.getColor(colorRegistry_1.editorForeground);
            if (hoverForeground) {
                css += ".monaco-workbench .panel.integrated-terminal .terminal-message-widget { color: " + hoverForeground + "; }";
            }
            this._themeStyleElement.innerHTML = css;
            this._findWidget.updateTheme(theme);
        };
        TerminalPanel.prototype._updateFont = function () {
            if (this._terminalService.terminalInstances.length === 0) {
                return;
            }
            var newFont = this._terminalService.configHelper.getFont();
            dom.toggleClass(this._parentDomElement, 'enable-ligatures', this._terminalService.configHelper.config.fontLigatures);
            dom.toggleClass(this._parentDomElement, 'disable-bold', !this._terminalService.configHelper.config.enableBold);
            if (!this._font || this._fontsDiffer(this._font, newFont)) {
                this._fontStyleElement.innerHTML = '.monaco-workbench .panel.integrated-terminal .xterm {' +
                    ("font-family: " + newFont.fontFamily + ";") +
                    ("font-size: " + newFont.fontSize + ";") +
                    ("line-height: " + newFont.lineHeight + ";") +
                    '}';
                this._font = newFont;
            }
            this.layout(new builder_1.Dimension(this._parentDomElement.offsetWidth, this._parentDomElement.offsetHeight));
        };
        TerminalPanel.prototype._fontsDiffer = function (a, b) {
            return a.charHeight !== b.charHeight ||
                a.charWidth !== b.charWidth ||
                a.fontFamily !== b.fontFamily ||
                a.fontSize !== b.fontSize ||
                a.lineHeight !== b.lineHeight;
        };
        /**
         * Adds quotes to a path if it contains whitespaces
         */
        TerminalPanel.preparePathForTerminal = function (path) {
            if (platform.isWindows) {
                if (/\s+/.test(path)) {
                    return "\"" + path + "\"";
                }
                return path;
            }
            path = path.replace(/(%5C|\\)/g, '\\\\');
            var charsToEscape = [
                ' ', '\'', '"', '?', ':', ';', '!', '*', '(', ')', '{', '}', '[', ']'
            ];
            for (var i = 0; i < path.length; i++) {
                var indexOfChar = charsToEscape.indexOf(path.charAt(i));
                if (indexOfChar >= 0) {
                    path = path.substring(0, i) + "\\" + path.charAt(i) + path.substring(i + 1);
                    i++; // Skip char due to escape char being added
                }
            }
            return path;
        };
        TerminalPanel = __decorate([
            __param(0, configuration_1.IConfigurationService),
            __param(1, contextView_1.IContextMenuService),
            __param(2, contextView_1.IContextViewService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, terminal_1.ITerminalService),
            __param(5, themeService_1.IThemeService),
            __param(6, telemetry_1.ITelemetryService)
        ], TerminalPanel);
        return TerminalPanel;
    }(panel_1.Panel));
    exports.TerminalPanel = TerminalPanel;
});
//# sourceMappingURL=terminalPanel.js.map