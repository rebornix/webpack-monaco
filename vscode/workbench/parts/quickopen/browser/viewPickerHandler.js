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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/errors", "vs/base/common/strings", "vs/base/common/scorer", "vs/base/parts/quickopen/common/quickOpen", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/workbench/browser/quickopen", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/parts/output/common/output", "vs/workbench/parts/terminal/common/terminal", "vs/workbench/services/panel/common/panelService", "vs/platform/quickOpen/common/quickOpen", "vs/base/common/actions", "vs/platform/keybinding/common/keybinding"], function (require, exports, winjs_base_1, nls, errors, strings, scorer, quickOpen_1, quickOpenModel_1, quickopen_1, viewlet_1, output_1, terminal_1, panelService_1, quickOpen_2, actions_1, keybinding_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.VIEW_PICKER_PREFIX = 'view ';
    var ViewEntry = (function (_super) {
        __extends(ViewEntry, _super);
        function ViewEntry(label, category, open) {
            var _this = _super.call(this) || this;
            _this.label = label;
            _this.category = category;
            _this.open = open;
            return _this;
        }
        ViewEntry.prototype.getLabel = function () {
            return this.label;
        };
        ViewEntry.prototype.getCategory = function () {
            return this.category;
        };
        ViewEntry.prototype.getAriaLabel = function () {
            return nls.localize('entryAriaLabel', "{0}, view picker", this.getLabel());
        };
        ViewEntry.prototype.run = function (mode, context) {
            if (mode === quickOpen_1.Mode.OPEN) {
                return this.runOpen(context);
            }
            return _super.prototype.run.call(this, mode, context);
        };
        ViewEntry.prototype.runOpen = function (context) {
            var _this = this;
            setTimeout(function () {
                _this.open();
            }, 0);
            return true;
        };
        return ViewEntry;
    }(quickOpenModel_1.QuickOpenEntryGroup));
    exports.ViewEntry = ViewEntry;
    var ViewPickerHandler = (function (_super) {
        __extends(ViewPickerHandler, _super);
        function ViewPickerHandler(viewletService, outputService, terminalService, panelService) {
            var _this = _super.call(this) || this;
            _this.viewletService = viewletService;
            _this.outputService = outputService;
            _this.terminalService = terminalService;
            _this.panelService = panelService;
            return _this;
        }
        ViewPickerHandler.prototype.getResults = function (searchValue) {
            searchValue = searchValue.trim();
            var normalizedSearchValueLowercase = strings.stripWildcards(searchValue).toLowerCase();
            var viewEntries = this.getViewEntries();
            var entries = viewEntries.filter(function (e) {
                if (!searchValue) {
                    return true;
                }
                if (!scorer.matches(e.getLabel(), normalizedSearchValueLowercase) && !scorer.matches(e.getCategory(), normalizedSearchValueLowercase)) {
                    return false;
                }
                var _a = quickOpenModel_1.QuickOpenEntry.highlight(e, searchValue), labelHighlights = _a.labelHighlights, descriptionHighlights = _a.descriptionHighlights;
                e.setHighlights(labelHighlights, descriptionHighlights);
                return true;
            });
            var lastCategory;
            entries.forEach(function (e, index) {
                if (lastCategory !== e.getCategory()) {
                    lastCategory = e.getCategory();
                    e.setShowBorder(index > 0);
                    e.setGroupLabel(lastCategory);
                }
                else {
                    e.setShowBorder(false);
                    e.setGroupLabel(void 0);
                }
            });
            return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel(entries));
        };
        ViewPickerHandler.prototype.getViewEntries = function () {
            var _this = this;
            var viewEntries = [];
            // Viewlets
            var viewlets = this.viewletService.getViewlets();
            viewlets.forEach(function (viewlet, index) {
                var viewsCategory = nls.localize('views', "Views");
                var entry = new ViewEntry(viewlet.name, viewsCategory, function () { return _this.viewletService.openViewlet(viewlet.id, true).done(null, errors.onUnexpectedError); });
                viewEntries.push(entry);
            });
            var terminals = this.terminalService.terminalInstances;
            // Panels
            var panels = this.panelService.getPanels().filter(function (p) {
                if (p.id === output_1.OUTPUT_PANEL_ID) {
                    return false; // since we already show output channels below
                }
                if (p.id === terminal_1.TERMINAL_PANEL_ID && terminals.length > 0) {
                    return false; // since we already show terminal instances below
                }
                return true;
            });
            panels.forEach(function (panel, index) {
                var panelsCategory = nls.localize('panels', "Panels");
                var entry = new ViewEntry(panel.name, panelsCategory, function () { return _this.panelService.openPanel(panel.id, true).done(null, errors.onUnexpectedError); });
                viewEntries.push(entry);
            });
            // Terminals
            terminals.forEach(function (terminal, index) {
                var terminalsCategory = nls.localize('terminals', "Terminal");
                var entry = new ViewEntry(nls.localize('terminalTitle', "{0}: {1}", index + 1, terminal.title), terminalsCategory, function () {
                    _this.terminalService.showPanel(true).done(function () {
                        _this.terminalService.setActiveInstance(terminal);
                    }, errors.onUnexpectedError);
                });
                viewEntries.push(entry);
            });
            // Output Channels
            var channels = this.outputService.getChannels();
            channels.forEach(function (channel, index) {
                var outputCategory = nls.localize('channels', "Output");
                var entry = new ViewEntry(channel.label, outputCategory, function () { return _this.outputService.getChannel(channel.id).show().done(null, errors.onUnexpectedError); });
                viewEntries.push(entry);
            });
            return viewEntries;
        };
        ViewPickerHandler.prototype.getAutoFocus = function (searchValue, context) {
            return {
                autoFocusFirstEntry: !!searchValue || !!context.quickNavigateConfiguration
            };
        };
        ViewPickerHandler = __decorate([
            __param(0, viewlet_1.IViewletService),
            __param(1, output_1.IOutputService),
            __param(2, terminal_1.ITerminalService),
            __param(3, panelService_1.IPanelService)
        ], ViewPickerHandler);
        return ViewPickerHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.ViewPickerHandler = ViewPickerHandler;
    var OpenViewPickerAction = (function (_super) {
        __extends(OpenViewPickerAction, _super);
        function OpenViewPickerAction(id, label, quickOpenService) {
            return _super.call(this, id, label, exports.VIEW_PICKER_PREFIX, quickOpenService) || this;
        }
        OpenViewPickerAction.ID = 'workbench.action.openView';
        OpenViewPickerAction.LABEL = nls.localize('openView', "Open View");
        OpenViewPickerAction = __decorate([
            __param(2, quickOpen_2.IQuickOpenService)
        ], OpenViewPickerAction);
        return OpenViewPickerAction;
    }(quickopen_1.QuickOpenAction));
    exports.OpenViewPickerAction = OpenViewPickerAction;
    var QuickOpenViewPickerAction = (function (_super) {
        __extends(QuickOpenViewPickerAction, _super);
        function QuickOpenViewPickerAction(id, label, quickOpenService, keybindingService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            _this.keybindingService = keybindingService;
            return _this;
        }
        QuickOpenViewPickerAction.prototype.run = function () {
            var keys = this.keybindingService.lookupKeybindings(this.id);
            this.quickOpenService.show(exports.VIEW_PICKER_PREFIX, { quickNavigateConfiguration: { keybindings: keys } });
            return winjs_base_1.TPromise.as(true);
        };
        QuickOpenViewPickerAction.ID = 'workbench.action.quickOpenView';
        QuickOpenViewPickerAction.LABEL = nls.localize('quickOpenView', "Quick Open View");
        QuickOpenViewPickerAction = __decorate([
            __param(2, quickOpen_2.IQuickOpenService),
            __param(3, keybinding_1.IKeybindingService)
        ], QuickOpenViewPickerAction);
        return QuickOpenViewPickerAction;
    }(actions_1.Action));
    exports.QuickOpenViewPickerAction = QuickOpenViewPickerAction;
});
//# sourceMappingURL=viewPickerHandler.js.map