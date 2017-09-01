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
define(["require", "exports", "vs/nls", "os", "vs/base/common/actions", "vs/editor/common/editorCommon", "vs/editor/common/services/codeEditorService", "vs/workbench/parts/terminal/common/terminal", "vs/base/browser/ui/actionbar/actionbar", "vs/base/common/winjs.base", "vs/workbench/browser/panel", "vs/workbench/services/part/common/partService", "vs/workbench/services/panel/common/panelService", "vs/platform/message/common/message", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/browser/actions", "vs/workbench/parts/terminal/browser/terminalQuickOpen", "vs/platform/instantiation/common/instantiation"], function (require, exports, nls, os, actions_1, editorCommon_1, codeEditorService_1, terminal_1, actionbar_1, winjs_base_1, panel_1, partService_1, panelService_1, message_1, styler_1, themeService_1, quickOpen_1, actions_2, terminalQuickOpen_1, instantiation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TERMINAL_PICKER_PREFIX = 'term ';
    var ToggleTerminalAction = (function (_super) {
        __extends(ToggleTerminalAction, _super);
        function ToggleTerminalAction(id, label, panelService, partService, terminalService) {
            var _this = _super.call(this, id, label, terminal_1.TERMINAL_PANEL_ID, panelService, partService) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ToggleTerminalAction.prototype.run = function (event) {
            if (this.terminalService.terminalInstances.length === 0) {
                // If there is not yet an instance attempt to create it here so that we can suggest a
                // new shell on Windows (and not do so when the panel is restored on reload).
                this.terminalService.createInstance(undefined, true);
            }
            return _super.prototype.run.call(this);
        };
        ToggleTerminalAction.ID = 'workbench.action.terminal.toggleTerminal';
        ToggleTerminalAction.LABEL = nls.localize('workbench.action.terminal.toggleTerminal', "Toggle Integrated Terminal");
        ToggleTerminalAction = __decorate([
            __param(2, panelService_1.IPanelService),
            __param(3, partService_1.IPartService),
            __param(4, terminal_1.ITerminalService)
        ], ToggleTerminalAction);
        return ToggleTerminalAction;
    }(panel_1.TogglePanelAction));
    exports.ToggleTerminalAction = ToggleTerminalAction;
    var KillTerminalAction = (function (_super) {
        __extends(KillTerminalAction, _super);
        function KillTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            _this.class = 'terminal-action kill';
            return _this;
        }
        KillTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                this.terminalService.getActiveInstance().dispose();
                if (this.terminalService.terminalInstances.length > 0) {
                    this.terminalService.showPanel(true);
                }
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        KillTerminalAction.ID = 'workbench.action.terminal.kill';
        KillTerminalAction.LABEL = nls.localize('workbench.action.terminal.kill', "Kill the Active Terminal Instance");
        KillTerminalAction.PANEL_LABEL = nls.localize('workbench.action.terminal.kill.short', "Kill Terminal");
        KillTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], KillTerminalAction);
        return KillTerminalAction;
    }(actions_1.Action));
    exports.KillTerminalAction = KillTerminalAction;
    var QuickKillTerminalAction = (function (_super) {
        __extends(QuickKillTerminalAction, _super);
        function QuickKillTerminalAction(id, label, terminalEntry, terminalService, quickOpenService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalEntry = terminalEntry;
            _this.terminalService = terminalService;
            _this.quickOpenService = quickOpenService;
            _this.class = 'terminal-action kill';
            return _this;
        }
        QuickKillTerminalAction.prototype.run = function (event) {
            var _this = this;
            var terminalIndex = parseInt(this.terminalEntry.getLabel().split(':')[0]) - 1;
            var terminal = this.terminalService.getInstanceFromIndex(terminalIndex);
            if (terminal) {
                terminal.dispose();
            }
            if (this.terminalService.terminalInstances.length > 0 && this.terminalService.activeTerminalInstanceIndex !== terminalIndex) {
                this.terminalService.setActiveInstanceByIndex(Math.min(terminalIndex, this.terminalService.terminalInstances.length - 1));
            }
            return winjs_base_1.TPromise.timeout(50).then(function (result) { return _this.quickOpenService.show(exports.TERMINAL_PICKER_PREFIX, null); });
        };
        QuickKillTerminalAction.ID = 'workbench.action.terminal.quickKill';
        QuickKillTerminalAction.LABEL = nls.localize('workbench.action.terminal.quickKill', "Kill Terminal Instance");
        QuickKillTerminalAction = __decorate([
            __param(3, terminal_1.ITerminalService),
            __param(4, quickOpen_1.IQuickOpenService)
        ], QuickKillTerminalAction);
        return QuickKillTerminalAction;
    }(actions_1.Action));
    exports.QuickKillTerminalAction = QuickKillTerminalAction;
    /**
     * Copies the terminal selection. Note that since the command palette takes focus from the terminal,
     * this cannot be triggered through the command palette.
     */
    var CopyTerminalSelectionAction = (function (_super) {
        __extends(CopyTerminalSelectionAction, _super);
        function CopyTerminalSelectionAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        CopyTerminalSelectionAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.copySelection();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        CopyTerminalSelectionAction.ID = 'workbench.action.terminal.copySelection';
        CopyTerminalSelectionAction.LABEL = nls.localize('workbench.action.terminal.copySelection', "Copy Selection");
        CopyTerminalSelectionAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], CopyTerminalSelectionAction);
        return CopyTerminalSelectionAction;
    }(actions_1.Action));
    exports.CopyTerminalSelectionAction = CopyTerminalSelectionAction;
    var SelectAllTerminalAction = (function (_super) {
        __extends(SelectAllTerminalAction, _super);
        function SelectAllTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        SelectAllTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.selectAll();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        SelectAllTerminalAction.ID = 'workbench.action.terminal.selectAll';
        SelectAllTerminalAction.LABEL = nls.localize('workbench.action.terminal.selectAll', "Select All");
        SelectAllTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], SelectAllTerminalAction);
        return SelectAllTerminalAction;
    }(actions_1.Action));
    exports.SelectAllTerminalAction = SelectAllTerminalAction;
    var DeleteWordLeftTerminalAction = (function (_super) {
        __extends(DeleteWordLeftTerminalAction, _super);
        function DeleteWordLeftTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        DeleteWordLeftTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                // Send ctrl+W
                terminalInstance.sendText(String.fromCharCode('W'.charCodeAt(0) - 64), false);
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        DeleteWordLeftTerminalAction.ID = 'workbench.action.terminal.deleteWordLeft';
        DeleteWordLeftTerminalAction.LABEL = nls.localize('workbench.action.terminal.deleteWordLeft', "Delete Word Left");
        DeleteWordLeftTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], DeleteWordLeftTerminalAction);
        return DeleteWordLeftTerminalAction;
    }(actions_1.Action));
    exports.DeleteWordLeftTerminalAction = DeleteWordLeftTerminalAction;
    var DeleteWordRightTerminalAction = (function (_super) {
        __extends(DeleteWordRightTerminalAction, _super);
        function DeleteWordRightTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        DeleteWordRightTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                // Send alt+D
                terminalInstance.sendText('\x1bD', false);
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        DeleteWordRightTerminalAction.ID = 'workbench.action.terminal.deleteWordRight';
        DeleteWordRightTerminalAction.LABEL = nls.localize('workbench.action.terminal.deleteWordRight', "Delete Word Right");
        DeleteWordRightTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], DeleteWordRightTerminalAction);
        return DeleteWordRightTerminalAction;
    }(actions_1.Action));
    exports.DeleteWordRightTerminalAction = DeleteWordRightTerminalAction;
    var CreateNewTerminalAction = (function (_super) {
        __extends(CreateNewTerminalAction, _super);
        function CreateNewTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            _this.class = 'terminal-action new';
            return _this;
        }
        CreateNewTerminalAction.prototype.run = function (event) {
            var instance = this.terminalService.createInstance(undefined, true);
            if (!instance) {
                return winjs_base_1.TPromise.as(void 0);
            }
            this.terminalService.setActiveInstance(instance);
            return this.terminalService.showPanel(true);
        };
        CreateNewTerminalAction.ID = 'workbench.action.terminal.new';
        CreateNewTerminalAction.LABEL = nls.localize('workbench.action.terminal.new', "Create New Integrated Terminal");
        CreateNewTerminalAction.PANEL_LABEL = nls.localize('workbench.action.terminal.new.short', "New Terminal");
        CreateNewTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], CreateNewTerminalAction);
        return CreateNewTerminalAction;
    }(actions_1.Action));
    exports.CreateNewTerminalAction = CreateNewTerminalAction;
    var FocusActiveTerminalAction = (function (_super) {
        __extends(FocusActiveTerminalAction, _super);
        function FocusActiveTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        FocusActiveTerminalAction.prototype.run = function (event) {
            var instance = this.terminalService.getActiveOrCreateInstance(true);
            if (!instance) {
                return winjs_base_1.TPromise.as(void 0);
            }
            this.terminalService.setActiveInstance(instance);
            return this.terminalService.showPanel(true);
        };
        FocusActiveTerminalAction.ID = 'workbench.action.terminal.focus';
        FocusActiveTerminalAction.LABEL = nls.localize('workbench.action.terminal.focus', "Focus Terminal");
        FocusActiveTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], FocusActiveTerminalAction);
        return FocusActiveTerminalAction;
    }(actions_1.Action));
    exports.FocusActiveTerminalAction = FocusActiveTerminalAction;
    var FocusNextTerminalAction = (function (_super) {
        __extends(FocusNextTerminalAction, _super);
        function FocusNextTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        FocusNextTerminalAction.prototype.run = function (event) {
            this.terminalService.setActiveInstanceToNext();
            return this.terminalService.showPanel(true);
        };
        FocusNextTerminalAction.ID = 'workbench.action.terminal.focusNext';
        FocusNextTerminalAction.LABEL = nls.localize('workbench.action.terminal.focusNext', "Focus Next Terminal");
        FocusNextTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], FocusNextTerminalAction);
        return FocusNextTerminalAction;
    }(actions_1.Action));
    exports.FocusNextTerminalAction = FocusNextTerminalAction;
    var FocusTerminalAtIndexAction = (function (_super) {
        __extends(FocusTerminalAtIndexAction, _super);
        function FocusTerminalAtIndexAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        FocusTerminalAtIndexAction.prototype.run = function (event) {
            this.terminalService.setActiveInstanceByIndex(this.getTerminalNumber() - 1);
            return this.terminalService.showPanel(true);
        };
        FocusTerminalAtIndexAction.getId = function (n) {
            return FocusTerminalAtIndexAction.ID_PREFIX + n;
        };
        FocusTerminalAtIndexAction.getLabel = function (n) {
            return nls.localize('workbench.action.terminal.focusAtIndex', 'Focus Terminal {0}', n);
        };
        FocusTerminalAtIndexAction.prototype.getTerminalNumber = function () {
            return parseInt(this.id.substr(FocusTerminalAtIndexAction.ID_PREFIX.length));
        };
        FocusTerminalAtIndexAction.ID_PREFIX = 'workbench.action.terminal.focusAtIndex';
        FocusTerminalAtIndexAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], FocusTerminalAtIndexAction);
        return FocusTerminalAtIndexAction;
    }(actions_1.Action));
    exports.FocusTerminalAtIndexAction = FocusTerminalAtIndexAction;
    var FocusPreviousTerminalAction = (function (_super) {
        __extends(FocusPreviousTerminalAction, _super);
        function FocusPreviousTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        FocusPreviousTerminalAction.prototype.run = function (event) {
            this.terminalService.setActiveInstanceToPrevious();
            return this.terminalService.showPanel(true);
        };
        FocusPreviousTerminalAction.ID = 'workbench.action.terminal.focusPrevious';
        FocusPreviousTerminalAction.LABEL = nls.localize('workbench.action.terminal.focusPrevious', "Focus Previous Terminal");
        FocusPreviousTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], FocusPreviousTerminalAction);
        return FocusPreviousTerminalAction;
    }(actions_1.Action));
    exports.FocusPreviousTerminalAction = FocusPreviousTerminalAction;
    var TerminalPasteAction = (function (_super) {
        __extends(TerminalPasteAction, _super);
        function TerminalPasteAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        TerminalPasteAction.prototype.run = function (event) {
            var instance = this.terminalService.getActiveOrCreateInstance();
            if (instance) {
                instance.paste();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        TerminalPasteAction.ID = 'workbench.action.terminal.paste';
        TerminalPasteAction.LABEL = nls.localize('workbench.action.terminal.paste', "Paste into Active Terminal");
        TerminalPasteAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], TerminalPasteAction);
        return TerminalPasteAction;
    }(actions_1.Action));
    exports.TerminalPasteAction = TerminalPasteAction;
    var SelectDefaultShellWindowsTerminalAction = (function (_super) {
        __extends(SelectDefaultShellWindowsTerminalAction, _super);
        function SelectDefaultShellWindowsTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        SelectDefaultShellWindowsTerminalAction.prototype.run = function (event) {
            return this.terminalService.selectDefaultWindowsShell();
        };
        SelectDefaultShellWindowsTerminalAction.ID = 'workbench.action.terminal.selectDefaultShell';
        SelectDefaultShellWindowsTerminalAction.LABEL = nls.localize('workbench.action.terminal.DefaultShell', "Select Default Shell");
        SelectDefaultShellWindowsTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], SelectDefaultShellWindowsTerminalAction);
        return SelectDefaultShellWindowsTerminalAction;
    }(actions_1.Action));
    exports.SelectDefaultShellWindowsTerminalAction = SelectDefaultShellWindowsTerminalAction;
    var RunSelectedTextInTerminalAction = (function (_super) {
        __extends(RunSelectedTextInTerminalAction, _super);
        function RunSelectedTextInTerminalAction(id, label, codeEditorService, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.codeEditorService = codeEditorService;
            _this.terminalService = terminalService;
            return _this;
        }
        RunSelectedTextInTerminalAction.prototype.run = function (event) {
            var instance = this.terminalService.getActiveOrCreateInstance();
            if (!instance) {
                return winjs_base_1.TPromise.as(void 0);
            }
            var editor = this.codeEditorService.getFocusedCodeEditor();
            if (!editor) {
                return winjs_base_1.TPromise.as(void 0);
            }
            var selection = editor.getSelection();
            var text;
            if (selection.isEmpty()) {
                text = editor.getModel().getLineContent(selection.selectionStartLineNumber).trim();
            }
            else {
                var endOfLinePreference = os.EOL === '\n' ? editorCommon_1.EndOfLinePreference.LF : editorCommon_1.EndOfLinePreference.CRLF;
                text = editor.getModel().getValueInRange(selection, endOfLinePreference);
            }
            instance.sendText(text, true);
            return this.terminalService.showPanel();
        };
        RunSelectedTextInTerminalAction.ID = 'workbench.action.terminal.runSelectedText';
        RunSelectedTextInTerminalAction.LABEL = nls.localize('workbench.action.terminal.runSelectedText', "Run Selected Text In Active Terminal");
        RunSelectedTextInTerminalAction = __decorate([
            __param(2, codeEditorService_1.ICodeEditorService),
            __param(3, terminal_1.ITerminalService)
        ], RunSelectedTextInTerminalAction);
        return RunSelectedTextInTerminalAction;
    }(actions_1.Action));
    exports.RunSelectedTextInTerminalAction = RunSelectedTextInTerminalAction;
    var RunActiveFileInTerminalAction = (function (_super) {
        __extends(RunActiveFileInTerminalAction, _super);
        function RunActiveFileInTerminalAction(id, label, codeEditorService, terminalService, messageService) {
            var _this = _super.call(this, id, label) || this;
            _this.codeEditorService = codeEditorService;
            _this.terminalService = terminalService;
            _this.messageService = messageService;
            return _this;
        }
        RunActiveFileInTerminalAction.prototype.run = function (event) {
            var instance = this.terminalService.getActiveOrCreateInstance();
            if (!instance) {
                return winjs_base_1.TPromise.as(void 0);
            }
            var editor = this.codeEditorService.getFocusedCodeEditor();
            if (!editor) {
                return winjs_base_1.TPromise.as(void 0);
            }
            var uri = editor.getModel().uri;
            if (uri.scheme !== 'file') {
                this.messageService.show(message_1.Severity.Warning, nls.localize('workbench.action.terminal.runActiveFile.noFile', 'Only files on disk can be run in the terminal'));
                return winjs_base_1.TPromise.as(void 0);
            }
            instance.sendText(uri.fsPath, true);
            return this.terminalService.showPanel();
        };
        RunActiveFileInTerminalAction.ID = 'workbench.action.terminal.runActiveFile';
        RunActiveFileInTerminalAction.LABEL = nls.localize('workbench.action.terminal.runActiveFile', "Run Active File In Active Terminal");
        RunActiveFileInTerminalAction = __decorate([
            __param(2, codeEditorService_1.ICodeEditorService),
            __param(3, terminal_1.ITerminalService),
            __param(4, message_1.IMessageService)
        ], RunActiveFileInTerminalAction);
        return RunActiveFileInTerminalAction;
    }(actions_1.Action));
    exports.RunActiveFileInTerminalAction = RunActiveFileInTerminalAction;
    var SwitchTerminalInstanceAction = (function (_super) {
        __extends(SwitchTerminalInstanceAction, _super);
        function SwitchTerminalInstanceAction(id, label, terminalService) {
            var _this = _super.call(this, SwitchTerminalInstanceAction.ID, SwitchTerminalInstanceAction.LABEL) || this;
            _this.terminalService = terminalService;
            _this.class = 'terminal-action switch-terminal-instance';
            return _this;
        }
        SwitchTerminalInstanceAction.prototype.run = function (item) {
            if (!item || !item.split) {
                return winjs_base_1.TPromise.as(null);
            }
            var selectedTerminalIndex = parseInt(item.split(':')[0], 10) - 1;
            this.terminalService.setActiveInstanceByIndex(selectedTerminalIndex);
            return this.terminalService.showPanel(true);
        };
        SwitchTerminalInstanceAction.ID = 'workbench.action.terminal.switchTerminalInstance';
        SwitchTerminalInstanceAction.LABEL = nls.localize('workbench.action.terminal.switchTerminalInstance', "Switch Terminal Instance");
        SwitchTerminalInstanceAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], SwitchTerminalInstanceAction);
        return SwitchTerminalInstanceAction;
    }(actions_1.Action));
    exports.SwitchTerminalInstanceAction = SwitchTerminalInstanceAction;
    var SwitchTerminalInstanceActionItem = (function (_super) {
        __extends(SwitchTerminalInstanceActionItem, _super);
        function SwitchTerminalInstanceActionItem(action, terminalService, themeService) {
            var _this = _super.call(this, null, action, terminalService.getInstanceLabels(), terminalService.activeTerminalInstanceIndex) || this;
            _this.terminalService = terminalService;
            _this.toDispose.push(terminalService.onInstancesChanged(_this._updateItems, _this));
            _this.toDispose.push(terminalService.onActiveInstanceChanged(_this._updateItems, _this));
            _this.toDispose.push(terminalService.onInstanceTitleChanged(_this._updateItems, _this));
            _this.toDispose.push(styler_1.attachSelectBoxStyler(_this.selectBox, themeService));
            return _this;
        }
        SwitchTerminalInstanceActionItem.prototype._updateItems = function () {
            this.setOptions(this.terminalService.getInstanceLabels(), this.terminalService.activeTerminalInstanceIndex);
        };
        SwitchTerminalInstanceActionItem = __decorate([
            __param(1, terminal_1.ITerminalService),
            __param(2, themeService_1.IThemeService)
        ], SwitchTerminalInstanceActionItem);
        return SwitchTerminalInstanceActionItem;
    }(actionbar_1.SelectActionItem));
    exports.SwitchTerminalInstanceActionItem = SwitchTerminalInstanceActionItem;
    var ScrollDownTerminalAction = (function (_super) {
        __extends(ScrollDownTerminalAction, _super);
        function ScrollDownTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ScrollDownTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.scrollDownLine();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ScrollDownTerminalAction.ID = 'workbench.action.terminal.scrollDown';
        ScrollDownTerminalAction.LABEL = nls.localize('workbench.action.terminal.scrollDown', "Scroll Down (Line)");
        ScrollDownTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ScrollDownTerminalAction);
        return ScrollDownTerminalAction;
    }(actions_1.Action));
    exports.ScrollDownTerminalAction = ScrollDownTerminalAction;
    var ScrollDownPageTerminalAction = (function (_super) {
        __extends(ScrollDownPageTerminalAction, _super);
        function ScrollDownPageTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ScrollDownPageTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.scrollDownPage();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ScrollDownPageTerminalAction.ID = 'workbench.action.terminal.scrollDownPage';
        ScrollDownPageTerminalAction.LABEL = nls.localize('workbench.action.terminal.scrollDownPage', "Scroll Down (Page)");
        ScrollDownPageTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ScrollDownPageTerminalAction);
        return ScrollDownPageTerminalAction;
    }(actions_1.Action));
    exports.ScrollDownPageTerminalAction = ScrollDownPageTerminalAction;
    var ScrollToBottomTerminalAction = (function (_super) {
        __extends(ScrollToBottomTerminalAction, _super);
        function ScrollToBottomTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ScrollToBottomTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.scrollToBottom();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ScrollToBottomTerminalAction.ID = 'workbench.action.terminal.scrollToBottom';
        ScrollToBottomTerminalAction.LABEL = nls.localize('workbench.action.terminal.scrollToBottom', "Scroll to Bottom");
        ScrollToBottomTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ScrollToBottomTerminalAction);
        return ScrollToBottomTerminalAction;
    }(actions_1.Action));
    exports.ScrollToBottomTerminalAction = ScrollToBottomTerminalAction;
    var ScrollUpTerminalAction = (function (_super) {
        __extends(ScrollUpTerminalAction, _super);
        function ScrollUpTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ScrollUpTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.scrollUpLine();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ScrollUpTerminalAction.ID = 'workbench.action.terminal.scrollUp';
        ScrollUpTerminalAction.LABEL = nls.localize('workbench.action.terminal.scrollUp', "Scroll Up (Line)");
        ScrollUpTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ScrollUpTerminalAction);
        return ScrollUpTerminalAction;
    }(actions_1.Action));
    exports.ScrollUpTerminalAction = ScrollUpTerminalAction;
    var ScrollUpPageTerminalAction = (function (_super) {
        __extends(ScrollUpPageTerminalAction, _super);
        function ScrollUpPageTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ScrollUpPageTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.scrollUpPage();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ScrollUpPageTerminalAction.ID = 'workbench.action.terminal.scrollUpPage';
        ScrollUpPageTerminalAction.LABEL = nls.localize('workbench.action.terminal.scrollUpPage', "Scroll Up (Page)");
        ScrollUpPageTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ScrollUpPageTerminalAction);
        return ScrollUpPageTerminalAction;
    }(actions_1.Action));
    exports.ScrollUpPageTerminalAction = ScrollUpPageTerminalAction;
    var ScrollToTopTerminalAction = (function (_super) {
        __extends(ScrollToTopTerminalAction, _super);
        function ScrollToTopTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ScrollToTopTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.scrollToTop();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ScrollToTopTerminalAction.ID = 'workbench.action.terminal.scrollToTop';
        ScrollToTopTerminalAction.LABEL = nls.localize('workbench.action.terminal.scrollToTop', "Scroll to Top");
        ScrollToTopTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ScrollToTopTerminalAction);
        return ScrollToTopTerminalAction;
    }(actions_1.Action));
    exports.ScrollToTopTerminalAction = ScrollToTopTerminalAction;
    var ClearTerminalAction = (function (_super) {
        __extends(ClearTerminalAction, _super);
        function ClearTerminalAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ClearTerminalAction.prototype.run = function (event) {
            var terminalInstance = this.terminalService.getActiveInstance();
            if (terminalInstance) {
                terminalInstance.clear();
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        ClearTerminalAction.ID = 'workbench.action.terminal.clear';
        ClearTerminalAction.LABEL = nls.localize('workbench.action.terminal.clear', "Clear");
        ClearTerminalAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ClearTerminalAction);
        return ClearTerminalAction;
    }(actions_1.Action));
    exports.ClearTerminalAction = ClearTerminalAction;
    var AllowWorkspaceShellTerminalCommand = (function (_super) {
        __extends(AllowWorkspaceShellTerminalCommand, _super);
        function AllowWorkspaceShellTerminalCommand(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        AllowWorkspaceShellTerminalCommand.prototype.run = function (event) {
            this.terminalService.setWorkspaceShellAllowed(true);
            return winjs_base_1.TPromise.as(void 0);
        };
        AllowWorkspaceShellTerminalCommand.ID = 'workbench.action.terminal.allowWorkspaceShell';
        AllowWorkspaceShellTerminalCommand.LABEL = nls.localize('workbench.action.terminal.allowWorkspaceShell', "Allow Workspace Shell Configuration");
        AllowWorkspaceShellTerminalCommand = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], AllowWorkspaceShellTerminalCommand);
        return AllowWorkspaceShellTerminalCommand;
    }(actions_1.Action));
    exports.AllowWorkspaceShellTerminalCommand = AllowWorkspaceShellTerminalCommand;
    var DisallowWorkspaceShellTerminalCommand = (function (_super) {
        __extends(DisallowWorkspaceShellTerminalCommand, _super);
        function DisallowWorkspaceShellTerminalCommand(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        DisallowWorkspaceShellTerminalCommand.prototype.run = function (event) {
            this.terminalService.setWorkspaceShellAllowed(false);
            return winjs_base_1.TPromise.as(void 0);
        };
        DisallowWorkspaceShellTerminalCommand.ID = 'workbench.action.terminal.disallowWorkspaceShell';
        DisallowWorkspaceShellTerminalCommand.LABEL = nls.localize('workbench.action.terminal.disallowWorkspaceShell', "Disallow Workspace Shell Configuration");
        DisallowWorkspaceShellTerminalCommand = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], DisallowWorkspaceShellTerminalCommand);
        return DisallowWorkspaceShellTerminalCommand;
    }(actions_1.Action));
    exports.DisallowWorkspaceShellTerminalCommand = DisallowWorkspaceShellTerminalCommand;
    var RenameTerminalAction = (function (_super) {
        __extends(RenameTerminalAction, _super);
        function RenameTerminalAction(id, label, quickOpenService, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            _this.terminalService = terminalService;
            return _this;
        }
        RenameTerminalAction.prototype.run = function (terminal) {
            var terminalInstance = terminal ? this.terminalService.getInstanceFromIndex(parseInt(terminal.getLabel().split(':')[0], 10) - 1) : this.terminalService.getActiveInstance();
            if (!terminalInstance) {
                return winjs_base_1.TPromise.as(void 0);
            }
            return this.quickOpenService.input({
                value: terminalInstance.title,
                prompt: nls.localize('workbench.action.terminal.rename.prompt', "Enter terminal name"),
            }).then(function (name) {
                if (name) {
                    terminalInstance.setTitle(name, false);
                }
            });
        };
        RenameTerminalAction.ID = 'workbench.action.terminal.rename';
        RenameTerminalAction.LABEL = nls.localize('workbench.action.terminal.rename', "Rename");
        RenameTerminalAction = __decorate([
            __param(2, quickOpen_1.IQuickOpenService),
            __param(3, terminal_1.ITerminalService)
        ], RenameTerminalAction);
        return RenameTerminalAction;
    }(actions_1.Action));
    exports.RenameTerminalAction = RenameTerminalAction;
    var FocusTerminalFindWidgetAction = (function (_super) {
        __extends(FocusTerminalFindWidgetAction, _super);
        function FocusTerminalFindWidgetAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        FocusTerminalFindWidgetAction.prototype.run = function () {
            return this.terminalService.focusFindWidget();
        };
        FocusTerminalFindWidgetAction.ID = 'workbench.action.terminal.focusFindWidget';
        FocusTerminalFindWidgetAction.LABEL = nls.localize('workbench.action.terminal.focusFindWidget', "Focus Find Widget");
        FocusTerminalFindWidgetAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], FocusTerminalFindWidgetAction);
        return FocusTerminalFindWidgetAction;
    }(actions_1.Action));
    exports.FocusTerminalFindWidgetAction = FocusTerminalFindWidgetAction;
    var HideTerminalFindWidgetAction = (function (_super) {
        __extends(HideTerminalFindWidgetAction, _super);
        function HideTerminalFindWidgetAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        HideTerminalFindWidgetAction.prototype.run = function () {
            return winjs_base_1.TPromise.as(this.terminalService.hideFindWidget());
        };
        HideTerminalFindWidgetAction.ID = 'workbench.action.terminal.hideFindWidget';
        HideTerminalFindWidgetAction.LABEL = nls.localize('workbench.action.terminal.hideFindWidget', "Hide Find Widget");
        HideTerminalFindWidgetAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], HideTerminalFindWidgetAction);
        return HideTerminalFindWidgetAction;
    }(actions_1.Action));
    exports.HideTerminalFindWidgetAction = HideTerminalFindWidgetAction;
    var ShowNextFindTermTerminalFindWidgetAction = (function (_super) {
        __extends(ShowNextFindTermTerminalFindWidgetAction, _super);
        function ShowNextFindTermTerminalFindWidgetAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ShowNextFindTermTerminalFindWidgetAction.prototype.run = function () {
            return winjs_base_1.TPromise.as(this.terminalService.showNextFindTermFindWidget());
        };
        ShowNextFindTermTerminalFindWidgetAction.ID = 'workbench.action.terminal.findWidget.history.showNext';
        ShowNextFindTermTerminalFindWidgetAction.LABEL = nls.localize('nextTerminalFindTerm', "Show Next Find Term");
        ShowNextFindTermTerminalFindWidgetAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ShowNextFindTermTerminalFindWidgetAction);
        return ShowNextFindTermTerminalFindWidgetAction;
    }(actions_1.Action));
    exports.ShowNextFindTermTerminalFindWidgetAction = ShowNextFindTermTerminalFindWidgetAction;
    var ShowPreviousFindTermTerminalFindWidgetAction = (function (_super) {
        __extends(ShowPreviousFindTermTerminalFindWidgetAction, _super);
        function ShowPreviousFindTermTerminalFindWidgetAction(id, label, terminalService) {
            var _this = _super.call(this, id, label) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ShowPreviousFindTermTerminalFindWidgetAction.prototype.run = function () {
            return winjs_base_1.TPromise.as(this.terminalService.showPreviousFindTermFindWidget());
        };
        ShowPreviousFindTermTerminalFindWidgetAction.ID = 'workbench.action.terminal.findWidget.history.showPrevious';
        ShowPreviousFindTermTerminalFindWidgetAction.LABEL = nls.localize('previousTerminalFindTerm', "Show Previous Find Term");
        ShowPreviousFindTermTerminalFindWidgetAction = __decorate([
            __param(2, terminal_1.ITerminalService)
        ], ShowPreviousFindTermTerminalFindWidgetAction);
        return ShowPreviousFindTermTerminalFindWidgetAction;
    }(actions_1.Action));
    exports.ShowPreviousFindTermTerminalFindWidgetAction = ShowPreviousFindTermTerminalFindWidgetAction;
    var QuickOpenActionTermContributor = (function (_super) {
        __extends(QuickOpenActionTermContributor, _super);
        function QuickOpenActionTermContributor(terminalService, quickOpenService, instantiationService) {
            var _this = _super.call(this) || this;
            _this.terminalService = terminalService;
            _this.quickOpenService = quickOpenService;
            _this.instantiationService = instantiationService;
            return _this;
        }
        QuickOpenActionTermContributor.prototype.getActions = function (context) {
            var actions = [];
            if (context.element instanceof terminalQuickOpen_1.TerminalEntry) {
                actions.push(this.instantiationService.createInstance(RenameTerminalQuickOpenAction, RenameTerminalQuickOpenAction.ID, RenameTerminalQuickOpenAction.LABEL, context.element));
                actions.push(this.instantiationService.createInstance(QuickKillTerminalAction, QuickKillTerminalAction.ID, QuickKillTerminalAction.LABEL, context.element));
            }
            return actions;
        };
        QuickOpenActionTermContributor.prototype.hasActions = function (context) {
            return true;
        };
        QuickOpenActionTermContributor = __decorate([
            __param(0, terminal_1.ITerminalService),
            __param(1, quickOpen_1.IQuickOpenService),
            __param(2, instantiation_1.IInstantiationService)
        ], QuickOpenActionTermContributor);
        return QuickOpenActionTermContributor;
    }(actions_2.ActionBarContributor));
    exports.QuickOpenActionTermContributor = QuickOpenActionTermContributor;
    var QuickOpenTermAction = (function (_super) {
        __extends(QuickOpenTermAction, _super);
        function QuickOpenTermAction(id, label, quickOpenService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            return _this;
        }
        QuickOpenTermAction.prototype.run = function () {
            return this.quickOpenService.show(exports.TERMINAL_PICKER_PREFIX, null);
        };
        QuickOpenTermAction.ID = 'workbench.action.quickOpenTerm';
        QuickOpenTermAction.LABEL = nls.localize('quickOpenTerm', "Terminal: Switch Active Terminal");
        QuickOpenTermAction = __decorate([
            __param(2, quickOpen_1.IQuickOpenService)
        ], QuickOpenTermAction);
        return QuickOpenTermAction;
    }(actions_1.Action));
    exports.QuickOpenTermAction = QuickOpenTermAction;
    var RenameTerminalQuickOpenAction = (function (_super) {
        __extends(RenameTerminalQuickOpenAction, _super);
        function RenameTerminalQuickOpenAction(id, label, terminal, quickOpenService, terminalService, instantiationService) {
            var _this = _super.call(this, id, label, quickOpenService, terminalService) || this;
            _this.terminal = terminal;
            _this.instantiationService = instantiationService;
            _this.class = 'quick-open-terminal-configure';
            return _this;
        }
        RenameTerminalQuickOpenAction.prototype.run = function () {
            var _this = this;
            _super.prototype.run.call(this, this.terminal)
                .then(function () { return winjs_base_1.TPromise.timeout(50); })
                .then(function (result) { return _this.quickOpenService.show(exports.TERMINAL_PICKER_PREFIX, null); });
            return winjs_base_1.TPromise.as(null);
        };
        RenameTerminalQuickOpenAction = __decorate([
            __param(3, quickOpen_1.IQuickOpenService),
            __param(4, terminal_1.ITerminalService),
            __param(5, instantiation_1.IInstantiationService)
        ], RenameTerminalQuickOpenAction);
        return RenameTerminalQuickOpenAction;
    }(RenameTerminalAction));
    exports.RenameTerminalQuickOpenAction = RenameTerminalQuickOpenAction;
});
//# sourceMappingURL=terminalActions.js.map