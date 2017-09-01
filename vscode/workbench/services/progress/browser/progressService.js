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
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/base/common/types", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/services/panel/common/panelService"], function (require, exports, lifecycle, winjs_base_1, types, viewlet_1, panelService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScopedService = (function () {
        function ScopedService(viewletService, panelService, scopeId) {
            this.viewletService = viewletService;
            this.panelService = panelService;
            this.scopeId = scopeId;
            this.toDispose = [];
            this.registerListeners();
        }
        ScopedService.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.viewletService.onDidViewletOpen(function (viewlet) { return _this.onScopeOpened(viewlet.getId()); }));
            this.toDispose.push(this.panelService.onDidPanelOpen(function (panel) { return _this.onScopeOpened(panel.getId()); }));
            this.toDispose.push(this.viewletService.onDidViewletClose(function (viewlet) { return _this.onScopeClosed(viewlet.getId()); }));
            this.toDispose.push(this.panelService.onDidPanelClose(function (panel) { return _this.onScopeClosed(panel.getId()); }));
        };
        ScopedService.prototype.onScopeClosed = function (scopeId) {
            if (scopeId === this.scopeId) {
                this.onScopeDeactivated();
            }
        };
        ScopedService.prototype.onScopeOpened = function (scopeId) {
            if (scopeId === this.scopeId) {
                this.onScopeActivated();
            }
        };
        return ScopedService;
    }());
    exports.ScopedService = ScopedService;
    var WorkbenchProgressService = (function (_super) {
        __extends(WorkbenchProgressService, _super);
        function WorkbenchProgressService(progressbar, scopeId, isActive, viewletService, panelService) {
            var _this = _super.call(this, viewletService, panelService, scopeId) || this;
            _this.progressbar = progressbar;
            _this.isActive = isActive || types.isUndefinedOrNull(scopeId); // If service is unscoped, enable by default
            _this.progressState = Object.create(null);
            return _this;
        }
        WorkbenchProgressService.prototype.onScopeDeactivated = function () {
            this.isActive = false;
        };
        WorkbenchProgressService.prototype.onScopeActivated = function () {
            this.isActive = true;
            // Return early if progress state indicates that progress is done
            if (this.progressState.done) {
                return;
            }
            // Replay Infinite Progress from Promise
            if (this.progressState.whilePromise) {
                this.doShowWhile();
            }
            else if (this.progressState.infinite) {
                this.progressbar.infinite().getContainer().show();
            }
            else {
                if (this.progressState.total) {
                    this.progressbar.total(this.progressState.total).getContainer().show();
                }
                if (this.progressState.worked) {
                    this.progressbar.worked(this.progressState.worked).getContainer().show();
                }
            }
        };
        WorkbenchProgressService.prototype.clearProgressState = function () {
            this.progressState.infinite = void 0;
            this.progressState.done = void 0;
            this.progressState.worked = void 0;
            this.progressState.total = void 0;
            this.progressState.whilePromise = void 0;
        };
        WorkbenchProgressService.prototype.show = function (infiniteOrTotal, delay) {
            var _this = this;
            var infinite;
            var total;
            // Sort out Arguments
            if (infiniteOrTotal === false || infiniteOrTotal === true) {
                infinite = infiniteOrTotal;
            }
            else {
                total = infiniteOrTotal;
            }
            // Reset State
            this.clearProgressState();
            // Keep in State
            this.progressState.infinite = infinite;
            this.progressState.total = total;
            // Active: Show Progress
            if (this.isActive) {
                // Infinite: Start Progressbar and Show after Delay
                if (!types.isUndefinedOrNull(infinite)) {
                    if (types.isUndefinedOrNull(delay)) {
                        this.progressbar.infinite().getContainer().show();
                    }
                    else {
                        this.progressbar.infinite().getContainer().showDelayed(delay);
                    }
                }
                else if (!types.isUndefinedOrNull(total)) {
                    if (types.isUndefinedOrNull(delay)) {
                        this.progressbar.total(total).getContainer().show();
                    }
                    else {
                        this.progressbar.total(total).getContainer().showDelayed(delay);
                    }
                }
            }
            return {
                total: function (total) {
                    _this.progressState.infinite = false;
                    _this.progressState.total = total;
                    if (_this.isActive) {
                        _this.progressbar.total(total);
                    }
                },
                worked: function (worked) {
                    // Verify first that we are either not active or the progressbar has a total set
                    if (!_this.isActive || _this.progressbar.hasTotal()) {
                        _this.progressState.infinite = false;
                        if (_this.progressState.worked) {
                            _this.progressState.worked += worked;
                        }
                        else {
                            _this.progressState.worked = worked;
                        }
                        if (_this.isActive) {
                            _this.progressbar.worked(worked);
                        }
                    }
                    else {
                        _this.progressState.infinite = true;
                        _this.progressState.worked = void 0;
                        _this.progressState.total = void 0;
                        _this.progressbar.infinite().getContainer().show();
                    }
                },
                done: function () {
                    _this.progressState.infinite = false;
                    _this.progressState.done = true;
                    if (_this.isActive) {
                        _this.progressbar.stop().getContainer().hide();
                    }
                }
            };
        };
        WorkbenchProgressService.prototype.showWhile = function (promise, delay) {
            var _this = this;
            var stack = !!this.progressState.whilePromise;
            // Reset State
            if (!stack) {
                this.clearProgressState();
            }
            else {
                promise = winjs_base_1.TPromise.join([promise, this.progressState.whilePromise]);
            }
            // Keep Promise in State
            this.progressState.whilePromise = promise;
            var stop = function () {
                // If this is not the last promise in the list of joined promises, return early
                if (!!_this.progressState.whilePromise && _this.progressState.whilePromise !== promise) {
                    return;
                }
                // The while promise is either null or equal the promise we last hooked on
                _this.clearProgressState();
                if (_this.isActive) {
                    _this.progressbar.stop().getContainer().hide();
                }
            };
            this.doShowWhile(delay);
            return promise.then(stop, stop);
        };
        WorkbenchProgressService.prototype.doShowWhile = function (delay) {
            // Show Progress when active
            if (this.isActive) {
                if (types.isUndefinedOrNull(delay)) {
                    this.progressbar.infinite().getContainer().show();
                }
                else {
                    this.progressbar.infinite().getContainer().showDelayed(delay);
                }
            }
        };
        WorkbenchProgressService.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
        };
        WorkbenchProgressService = __decorate([
            __param(3, viewlet_1.IViewletService),
            __param(4, panelService_1.IPanelService)
        ], WorkbenchProgressService);
        return WorkbenchProgressService;
    }(ScopedService));
    exports.WorkbenchProgressService = WorkbenchProgressService;
});
//# sourceMappingURL=progressService.js.map