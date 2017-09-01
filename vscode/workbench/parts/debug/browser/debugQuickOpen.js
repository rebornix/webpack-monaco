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
define(["require", "exports", "vs/nls", "vs/base/common/filters", "vs/base/common/winjs.base", "vs/workbench/browser/quickopen", "vs/base/parts/quickopen/common/quickOpen", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/parts/debug/common/debug", "vs/base/common/errors"], function (require, exports, nls, Filters, winjs_base_1, Quickopen, QuickOpen, Model, quickOpen_1, debug_1, errors) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugEntry = (function (_super) {
        __extends(DebugEntry, _super);
        function DebugEntry(debugService, launch, configurationName, highlights) {
            if (highlights === void 0) { highlights = []; }
            var _this = _super.call(this, highlights) || this;
            _this.debugService = debugService;
            _this.launch = launch;
            _this.configurationName = configurationName;
            return _this;
        }
        DebugEntry.prototype.getLabel = function () {
            return this.debugService.getConfigurationManager().getLaunches().length <= 1 ? this.configurationName : this.configurationName + " (" + this.launch.name + ")";
        };
        DebugEntry.prototype.getAriaLabel = function () {
            return nls.localize('entryAriaLabel', "{0}, debug", this.getLabel());
        };
        DebugEntry.prototype.run = function (mode, context) {
            if (mode === QuickOpen.Mode.PREVIEW) {
                return false;
            }
            // Run selected debug configuration
            this.debugService.getConfigurationManager().selectConfiguration(this.launch, this.configurationName);
            this.debugService.startDebugging(this.launch.workspaceUri).done(undefined, errors.onUnexpectedError);
            return true;
        };
        return DebugEntry;
    }(Model.QuickOpenEntry));
    var DebugQuickOpenHandler = (function (_super) {
        __extends(DebugQuickOpenHandler, _super);
        function DebugQuickOpenHandler(quickOpenService, debugService) {
            var _this = _super.call(this) || this;
            _this.quickOpenService = quickOpenService;
            _this.debugService = debugService;
            return _this;
        }
        DebugQuickOpenHandler.prototype.getAriaLabel = function () {
            return nls.localize('debugAriaLabel', "Type a name of a launch configuration to run.");
        };
        DebugQuickOpenHandler.prototype.getResults = function (input) {
            var _this = this;
            var configurations = [];
            var _loop_1 = function (launch) {
                launch.getConfigurationNames().map(function (config) { return ({ config: config, highlights: Filters.matchesContiguousSubString(input, config) }); })
                    .filter(function (_a) {
                    var highlights = _a.highlights;
                    return !!highlights;
                })
                    .forEach(function (_a) {
                    var config = _a.config, highlights = _a.highlights;
                    return configurations.push(new DebugEntry(_this.debugService, launch, config, highlights));
                });
            };
            for (var _i = 0, _a = this.debugService.getConfigurationManager().getLaunches(); _i < _a.length; _i++) {
                var launch = _a[_i];
                _loop_1(launch);
            }
            return winjs_base_1.TPromise.as(new Model.QuickOpenModel(configurations));
        };
        DebugQuickOpenHandler.prototype.getAutoFocus = function (input) {
            return {
                autoFocusFirstEntry: !!input
            };
        };
        DebugQuickOpenHandler.prototype.getEmptyLabel = function (searchString) {
            if (searchString.length > 0) {
                return nls.localize('noConfigurationsMatching', "No debug configurations matching");
            }
            return nls.localize('noConfigurationsFound', "No debug configurations found. Please create a 'launch.json' file.");
        };
        DebugQuickOpenHandler = __decorate([
            __param(0, quickOpen_1.IQuickOpenService),
            __param(1, debug_1.IDebugService)
        ], DebugQuickOpenHandler);
        return DebugQuickOpenHandler;
    }(Quickopen.QuickOpenHandler));
    exports.DebugQuickOpenHandler = DebugQuickOpenHandler;
});
//# sourceMappingURL=debugQuickOpen.js.map