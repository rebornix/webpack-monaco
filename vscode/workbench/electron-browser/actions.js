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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/collections", "vs/base/common/winjs.base", "vs/base/common/actions", "vs/platform/windows/common/windows", "vs/workbench/services/editor/common/editorService", "vs/nls", "vs/platform/node/product", "vs/platform/node/package", "vs/base/common/errors", "vs/platform/message/common/message", "vs/platform/workspace/common/workspace", "vs/platform/environment/common/environment", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/configuration/common/configuration", "vs/platform/extensionManagement/common/extensionManagement", "vs/workbench/services/configuration/common/configuration", "vs/base/common/paths", "vs/base/common/platform", "vs/platform/quickOpen/common/quickOpen", "vs/base/browser/browser", "vs/platform/integrity/common/integrity", "vs/workbench/services/timer/common/timerService", "vs/workbench/services/group/common/groupService", "vs/workbench/services/panel/common/panelService", "vs/workbench/services/part/common/partService", "vs/workbench/services/viewlet/browser/viewlet", "vs/platform/keybinding/common/keybinding", "os", "electron", "vs/base/common/labels", "vs/platform/workspaces/common/workspaces", "vs/platform/files/common/files", "vs/platform/instantiation/common/instantiation", "vs/platform/extensions/common/extensions", "vs/css!./media/actions"], function (require, exports, uri_1, collections, winjs_base_1, actions_1, windows_1, editorService_1, nls, product_1, package_1, errors, message_1, workspace_1, environment_1, configurationEditing_1, configuration_1, extensionManagement_1, configuration_2, paths, platform_1, quickOpen_1, browser, integrity_1, timerService_1, groupService_1, panelService_1, partService_1, viewlet_1, keybinding_1, os, electron_1, labels_1, workspaces_1, files_1, instantiation_1, extensions_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // --- actions
    var CloseEditorAction = (function (_super) {
        __extends(CloseEditorAction, _super);
        function CloseEditorAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        CloseEditorAction.prototype.run = function () {
            var activeEditor = this.editorService.getActiveEditor();
            if (activeEditor) {
                return this.editorService.closeEditor(activeEditor.position, activeEditor.input);
            }
            return winjs_base_1.TPromise.as(null);
        };
        CloseEditorAction.ID = 'workbench.action.closeActiveEditor';
        CloseEditorAction.LABEL = nls.localize('closeActiveEditor', "Close Editor");
        CloseEditorAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], CloseEditorAction);
        return CloseEditorAction;
    }(actions_1.Action));
    exports.CloseEditorAction = CloseEditorAction;
    var CloseCurrentWindowAction = (function (_super) {
        __extends(CloseCurrentWindowAction, _super);
        function CloseCurrentWindowAction(id, label, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            return _this;
        }
        CloseCurrentWindowAction.prototype.run = function () {
            this.windowService.closeWindow();
            return winjs_base_1.TPromise.as(true);
        };
        CloseCurrentWindowAction.ID = 'workbench.action.closeWindow';
        CloseCurrentWindowAction.LABEL = nls.localize('closeWindow', "Close Window");
        CloseCurrentWindowAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], CloseCurrentWindowAction);
        return CloseCurrentWindowAction;
    }(actions_1.Action));
    exports.CloseCurrentWindowAction = CloseCurrentWindowAction;
    var CloseWorkspaceAction = (function (_super) {
        __extends(CloseWorkspaceAction, _super);
        function CloseWorkspaceAction(id, label, contextService, messageService, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.contextService = contextService;
            _this.messageService = messageService;
            _this.windowService = windowService;
            return _this;
        }
        CloseWorkspaceAction.prototype.run = function () {
            if (!this.contextService.hasWorkspace()) {
                this.messageService.show(message_1.Severity.Info, nls.localize('noWorkspaceOpened', "There is currently no workspace opened in this instance to close."));
                return winjs_base_1.TPromise.as(null);
            }
            return this.windowService.closeWorkspace();
        };
        CloseWorkspaceAction.ID = 'workbench.action.closeFolder';
        CloseWorkspaceAction.LABEL = nls.localize('closeWorkspace', "Close Workspace");
        CloseWorkspaceAction = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, message_1.IMessageService),
            __param(4, windows_1.IWindowService)
        ], CloseWorkspaceAction);
        return CloseWorkspaceAction;
    }(actions_1.Action));
    exports.CloseWorkspaceAction = CloseWorkspaceAction;
    var NewWindowAction = (function (_super) {
        __extends(NewWindowAction, _super);
        function NewWindowAction(id, label, windowsService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowsService = windowsService;
            return _this;
        }
        NewWindowAction.prototype.run = function () {
            return this.windowsService.openNewWindow();
        };
        NewWindowAction.ID = 'workbench.action.newWindow';
        NewWindowAction.LABEL = nls.localize('newWindow', "New Window");
        NewWindowAction = __decorate([
            __param(2, windows_1.IWindowsService)
        ], NewWindowAction);
        return NewWindowAction;
    }(actions_1.Action));
    exports.NewWindowAction = NewWindowAction;
    var ToggleFullScreenAction = (function (_super) {
        __extends(ToggleFullScreenAction, _super);
        function ToggleFullScreenAction(id, label, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            return _this;
        }
        ToggleFullScreenAction.prototype.run = function () {
            return this.windowService.toggleFullScreen();
        };
        ToggleFullScreenAction.ID = 'workbench.action.toggleFullScreen';
        ToggleFullScreenAction.LABEL = nls.localize('toggleFullScreen', "Toggle Full Screen");
        ToggleFullScreenAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], ToggleFullScreenAction);
        return ToggleFullScreenAction;
    }(actions_1.Action));
    exports.ToggleFullScreenAction = ToggleFullScreenAction;
    var ToggleMenuBarAction = (function (_super) {
        __extends(ToggleMenuBarAction, _super);
        function ToggleMenuBarAction(id, label, messageService, configurationService, configurationEditingService) {
            var _this = _super.call(this, id, label) || this;
            _this.messageService = messageService;
            _this.configurationService = configurationService;
            _this.configurationEditingService = configurationEditingService;
            return _this;
        }
        ToggleMenuBarAction.prototype.run = function () {
            var currentVisibilityValue = this.configurationService.lookup(ToggleMenuBarAction.menuBarVisibilityKey).value;
            if (typeof currentVisibilityValue !== 'string') {
                currentVisibilityValue = 'default';
            }
            var newVisibilityValue;
            if (currentVisibilityValue === 'visible' || currentVisibilityValue === 'default') {
                newVisibilityValue = 'toggle';
            }
            else {
                newVisibilityValue = 'default';
            }
            this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: ToggleMenuBarAction.menuBarVisibilityKey, value: newVisibilityValue });
            return winjs_base_1.TPromise.as(null);
        };
        ToggleMenuBarAction.ID = 'workbench.action.toggleMenuBar';
        ToggleMenuBarAction.LABEL = nls.localize('toggleMenuBar', "Toggle Menu Bar");
        ToggleMenuBarAction.menuBarVisibilityKey = 'window.menuBarVisibility';
        ToggleMenuBarAction = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, configuration_1.IConfigurationService),
            __param(4, configurationEditing_1.IConfigurationEditingService)
        ], ToggleMenuBarAction);
        return ToggleMenuBarAction;
    }(actions_1.Action));
    exports.ToggleMenuBarAction = ToggleMenuBarAction;
    var ToggleDevToolsAction = (function (_super) {
        __extends(ToggleDevToolsAction, _super);
        function ToggleDevToolsAction(id, label, windowsService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowsService = windowsService;
            return _this;
        }
        ToggleDevToolsAction.prototype.run = function () {
            return this.windowsService.toggleDevTools();
        };
        ToggleDevToolsAction.ID = 'workbench.action.toggleDevTools';
        ToggleDevToolsAction.LABEL = nls.localize('toggleDevTools', "Toggle Developer Tools");
        ToggleDevToolsAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], ToggleDevToolsAction);
        return ToggleDevToolsAction;
    }(actions_1.Action));
    exports.ToggleDevToolsAction = ToggleDevToolsAction;
    var BaseZoomAction = (function (_super) {
        __extends(BaseZoomAction, _super);
        function BaseZoomAction(id, label, configurationService, configurationEditingService) {
            var _this = _super.call(this, id, label) || this;
            _this.configurationService = configurationService;
            _this.configurationEditingService = configurationEditingService;
            return _this;
        }
        BaseZoomAction.prototype.setConfiguredZoomLevel = function (level) {
            var target = configurationEditing_1.ConfigurationTarget.USER;
            if (typeof this.configurationService.lookup(BaseZoomAction.SETTING_KEY).workspace === 'number') {
                target = configurationEditing_1.ConfigurationTarget.WORKSPACE;
            }
            level = Math.round(level); // when reaching smallest zoom, prevent fractional zoom levels
            var applyZoom = function () {
                electron_1.webFrame.setZoomLevel(level);
                browser.setZoomFactor(electron_1.webFrame.getZoomFactor());
                // See https://github.com/Microsoft/vscode/issues/26151
                // Cannot be trusted because the webFrame might take some time
                // until it really applies the new zoom level
                browser.setZoomLevel(electron_1.webFrame.getZoomLevel(), /*isTrusted*/ false);
            };
            this.configurationEditingService.writeConfiguration(target, { key: BaseZoomAction.SETTING_KEY, value: level }, { donotNotifyError: true }).done(function () { return applyZoom(); }, function (error) { return applyZoom(); });
        };
        BaseZoomAction.SETTING_KEY = 'window.zoomLevel';
        BaseZoomAction = __decorate([
            __param(2, configuration_2.IWorkspaceConfigurationService),
            __param(3, configurationEditing_1.IConfigurationEditingService)
        ], BaseZoomAction);
        return BaseZoomAction;
    }(actions_1.Action));
    exports.BaseZoomAction = BaseZoomAction;
    var ZoomInAction = (function (_super) {
        __extends(ZoomInAction, _super);
        function ZoomInAction(id, label, configurationService, configurationEditingService) {
            return _super.call(this, id, label, configurationService, configurationEditingService) || this;
        }
        ZoomInAction.prototype.run = function () {
            this.setConfiguredZoomLevel(electron_1.webFrame.getZoomLevel() + 1);
            return winjs_base_1.TPromise.as(true);
        };
        ZoomInAction.ID = 'workbench.action.zoomIn';
        ZoomInAction.LABEL = nls.localize('zoomIn', "Zoom In");
        ZoomInAction = __decorate([
            __param(2, configuration_2.IWorkspaceConfigurationService),
            __param(3, configurationEditing_1.IConfigurationEditingService)
        ], ZoomInAction);
        return ZoomInAction;
    }(BaseZoomAction));
    exports.ZoomInAction = ZoomInAction;
    var ZoomOutAction = (function (_super) {
        __extends(ZoomOutAction, _super);
        function ZoomOutAction(id, label, configurationService, configurationEditingService) {
            return _super.call(this, id, label, configurationService, configurationEditingService) || this;
        }
        ZoomOutAction.prototype.run = function () {
            this.setConfiguredZoomLevel(electron_1.webFrame.getZoomLevel() - 1);
            return winjs_base_1.TPromise.as(true);
        };
        ZoomOutAction.ID = 'workbench.action.zoomOut';
        ZoomOutAction.LABEL = nls.localize('zoomOut', "Zoom Out");
        ZoomOutAction = __decorate([
            __param(2, configuration_2.IWorkspaceConfigurationService),
            __param(3, configurationEditing_1.IConfigurationEditingService)
        ], ZoomOutAction);
        return ZoomOutAction;
    }(BaseZoomAction));
    exports.ZoomOutAction = ZoomOutAction;
    var ZoomResetAction = (function (_super) {
        __extends(ZoomResetAction, _super);
        function ZoomResetAction(id, label, configurationService, configurationEditingService) {
            return _super.call(this, id, label, configurationService, configurationEditingService) || this;
        }
        ZoomResetAction.prototype.run = function () {
            this.setConfiguredZoomLevel(0);
            return winjs_base_1.TPromise.as(true);
        };
        ZoomResetAction.ID = 'workbench.action.zoomReset';
        ZoomResetAction.LABEL = nls.localize('zoomReset', "Reset Zoom");
        ZoomResetAction = __decorate([
            __param(2, configuration_2.IWorkspaceConfigurationService),
            __param(3, configurationEditing_1.IConfigurationEditingService)
        ], ZoomResetAction);
        return ZoomResetAction;
    }(BaseZoomAction));
    exports.ZoomResetAction = ZoomResetAction;
    /* Copied from loader.ts */
    var LoaderEventType;
    (function (LoaderEventType) {
        LoaderEventType[LoaderEventType["LoaderAvailable"] = 1] = "LoaderAvailable";
        LoaderEventType[LoaderEventType["BeginLoadingScript"] = 10] = "BeginLoadingScript";
        LoaderEventType[LoaderEventType["EndLoadingScriptOK"] = 11] = "EndLoadingScriptOK";
        LoaderEventType[LoaderEventType["EndLoadingScriptError"] = 12] = "EndLoadingScriptError";
        LoaderEventType[LoaderEventType["BeginInvokeFactory"] = 21] = "BeginInvokeFactory";
        LoaderEventType[LoaderEventType["EndInvokeFactory"] = 22] = "EndInvokeFactory";
        LoaderEventType[LoaderEventType["NodeBeginEvaluatingScript"] = 31] = "NodeBeginEvaluatingScript";
        LoaderEventType[LoaderEventType["NodeEndEvaluatingScript"] = 32] = "NodeEndEvaluatingScript";
        LoaderEventType[LoaderEventType["NodeBeginNativeRequire"] = 33] = "NodeBeginNativeRequire";
        LoaderEventType[LoaderEventType["NodeEndNativeRequire"] = 34] = "NodeEndNativeRequire";
    })(LoaderEventType || (LoaderEventType = {}));
    var ShowStartupPerformance = (function (_super) {
        __extends(ShowStartupPerformance, _super);
        function ShowStartupPerformance(id, label, windowService, timerService, environmentService, extensionService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            _this.timerService = timerService;
            _this.environmentService = environmentService;
            _this.extensionService = extensionService;
            return _this;
        }
        ShowStartupPerformance.prototype.run = function () {
            var _this = this;
            // Show dev tools
            this.windowService.openDevTools();
            // Print to console
            setTimeout(function () {
                console.group('Startup Performance Measurement');
                var metrics = _this.timerService.startupMetrics;
                console.log("OS: " + metrics.platform + " (" + metrics.release + ")");
                console.log("CPUs: " + metrics.cpus.model + " (" + metrics.cpus.count + " x " + metrics.cpus.speed + ")");
                console.log("Memory (System): " + (metrics.totalmem / (1024 * 1024 * 1024)).toFixed(2) + "GB (" + (metrics.freemem / (1024 * 1024 * 1024)).toFixed(2) + "GB free)");
                console.log("Memory (Process): " + (metrics.meminfo.workingSetSize / 1024).toFixed(2) + "MB working set (" + (metrics.meminfo.peakWorkingSetSize / 1024).toFixed(2) + "MB peak, " + (metrics.meminfo.privateBytes / 1024).toFixed(2) + "MB private, " + (metrics.meminfo.sharedBytes / 1024).toFixed(2) + "MB shared)");
                console.log("VM (likelyhood): " + metrics.isVMLikelyhood + "%");
                console.log("Initial Startup: " + metrics.initialStartup);
                console.log("Screen Reader Active: " + metrics.hasAccessibilitySupport);
                console.log("Empty Workspace: " + metrics.emptyWorkbench);
                var nodeModuleLoadTime;
                var nodeModuleLoadDetails;
                if (_this.environmentService.performance) {
                    var nodeModuleTimes = _this.analyzeNodeModulesLoadTimes();
                    nodeModuleLoadTime = nodeModuleTimes.duration;
                    nodeModuleLoadDetails = nodeModuleTimes.table;
                }
                console.table(_this.getStartupMetricsTable(nodeModuleLoadTime));
                if (_this.environmentService.performance) {
                    var data = _this.analyzeLoaderStats();
                    for (var type in data) {
                        console.groupCollapsed("Loader: " + type);
                        console.table(data[type]);
                        console.groupEnd();
                    }
                }
                console.groupEnd();
                console.group('Extension Activation Stats');
                console.table(_this.extensionService.getExtensionsActivationTimes());
                console.groupEnd();
            }, 1000);
            return winjs_base_1.TPromise.as(true);
        };
        ShowStartupPerformance.prototype.getStartupMetricsTable = function (nodeModuleLoadTime) {
            var table = [];
            var metrics = this.timerService.startupMetrics;
            if (metrics.initialStartup) {
                table.push({ Topic: '[main] start => app.isReady', 'Took (ms)': metrics.timers.ellapsedAppReady });
                table.push({ Topic: '[main] app.isReady => window.loadUrl()', 'Took (ms)': metrics.timers.ellapsedWindowLoad });
            }
            table.push({ Topic: '[renderer] window.loadUrl() => begin to require(workbench.main.js)', 'Took (ms)': metrics.timers.ellapsedWindowLoadToRequire });
            table.push({ Topic: '[renderer] require(workbench.main.js)', 'Took (ms)': metrics.timers.ellapsedRequire });
            if (nodeModuleLoadTime) {
                table.push({ Topic: '[renderer] -> of which require() node_modules', 'Took (ms)': nodeModuleLoadTime });
            }
            table.push({ Topic: '[renderer] create extension host => extensions onReady()', 'Took (ms)': metrics.timers.ellapsedExtensions });
            table.push({ Topic: '[renderer] restore viewlet', 'Took (ms)': metrics.timers.ellapsedViewletRestore });
            table.push({ Topic: '[renderer] restore editor view state', 'Took (ms)': metrics.timers.ellapsedEditorRestore });
            table.push({ Topic: '[renderer] overall workbench load', 'Took (ms)': metrics.timers.ellapsedWorkbench });
            table.push({ Topic: '------------------------------------------------------' });
            table.push({ Topic: '[main, renderer] start => extensions ready', 'Took (ms)': metrics.timers.ellapsedExtensionsReady });
            table.push({ Topic: '[main, renderer] start => workbench ready', 'Took (ms)': metrics.ellapsed });
            return table;
        };
        ShowStartupPerformance.prototype.analyzeNodeModulesLoadTimes = function () {
            var stats = require.getStats();
            var result = [];
            var total = 0;
            for (var i = 0, len = stats.length; i < len; i++) {
                if (stats[i].type === LoaderEventType.NodeEndNativeRequire) {
                    if (stats[i - 1].type === LoaderEventType.NodeBeginNativeRequire && stats[i - 1].detail === stats[i].detail) {
                        var entry = {};
                        var dur = (stats[i].timestamp - stats[i - 1].timestamp);
                        entry['Event'] = 'nodeRequire ' + stats[i].detail;
                        entry['Took (ms)'] = dur.toFixed(2);
                        total += dur;
                        entry['Start (ms)'] = '**' + stats[i - 1].timestamp.toFixed(2);
                        entry['End (ms)'] = '**' + stats[i - 1].timestamp.toFixed(2);
                        result.push(entry);
                    }
                }
            }
            if (total > 0) {
                result.push({ Event: '------------------------------------------------------' });
                var entry = {};
                entry['Event'] = '[renderer] total require() node_modules';
                entry['Took (ms)'] = total.toFixed(2);
                entry['Start (ms)'] = '**';
                entry['End (ms)'] = '**';
                result.push(entry);
            }
            return { table: result, duration: Math.round(total) };
        };
        ShowStartupPerformance.prototype.analyzeLoaderStats = function () {
            var stats = require.getStats().slice(0).sort(function (a, b) {
                if (a.detail < b.detail) {
                    return -1;
                }
                else if (a.detail > b.detail) {
                    return 1;
                }
                else if (a.type < b.type) {
                    return -1;
                }
                else if (a.type > b.type) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            var Tick = (function () {
                function Tick(start, end) {
                    this.start = start;
                    this.end = end;
                    console.assert(start.detail === end.detail);
                    this.duration = this.end.timestamp - this.start.timestamp;
                    this.detail = start.detail;
                }
                Tick.prototype.toTableObject = function () {
                    return _a = {},
                        _a['Path'] = this.start.detail,
                        _a['Took (ms)'] = this.duration.toFixed(2),
                        _a;
                    var _a;
                };
                Tick.compareUsingStartTimestamp = function (a, b) {
                    if (a.start.timestamp < b.start.timestamp) {
                        return -1;
                    }
                    else if (a.start.timestamp > b.start.timestamp) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                };
                return Tick;
            }());
            var ticks = (_a = {},
                _a[LoaderEventType.BeginLoadingScript] = [],
                _a[LoaderEventType.BeginInvokeFactory] = [],
                _a[LoaderEventType.NodeBeginEvaluatingScript] = [],
                _a[LoaderEventType.NodeBeginNativeRequire] = [],
                _a);
            for (var i = 1; i < stats.length - 1; i++) {
                var stat = stats[i];
                var nextStat = stats[i + 1];
                if (nextStat.type - stat.type > 2) {
                    //bad?!
                    break;
                }
                i += 1;
                ticks[stat.type].push(new Tick(stat, nextStat));
            }
            ticks[LoaderEventType.BeginInvokeFactory].sort(Tick.compareUsingStartTimestamp);
            ticks[LoaderEventType.BeginInvokeFactory].sort(Tick.compareUsingStartTimestamp);
            ticks[LoaderEventType.NodeBeginEvaluatingScript].sort(Tick.compareUsingStartTimestamp);
            ticks[LoaderEventType.NodeBeginNativeRequire].sort(Tick.compareUsingStartTimestamp);
            var ret = {
                'Load Script': ticks[LoaderEventType.BeginLoadingScript].map(function (t) { return t.toTableObject(); }),
                '(Node) Load Script': ticks[LoaderEventType.NodeBeginNativeRequire].map(function (t) { return t.toTableObject(); }),
                'Eval Script': ticks[LoaderEventType.BeginInvokeFactory].map(function (t) { return t.toTableObject(); }),
                '(Node) Eval Script': ticks[LoaderEventType.NodeBeginEvaluatingScript].map(function (t) { return t.toTableObject(); }),
            };
            function total(ticks) {
                var sum = 0;
                for (var _i = 0, ticks_1 = ticks; _i < ticks_1.length; _i++) {
                    var tick = ticks_1[_i];
                    sum += tick.duration;
                }
                return sum;
            }
            // totals
            ret['Load Script'].push((_b = {},
                _b['Path'] = 'TOTAL TIME',
                _b['Took (ms)'] = total(ticks[LoaderEventType.BeginLoadingScript]).toFixed(2),
                _b));
            ret['Eval Script'].push((_c = {},
                _c['Path'] = 'TOTAL TIME',
                _c['Took (ms)'] = total(ticks[LoaderEventType.BeginInvokeFactory]).toFixed(2),
                _c));
            ret['(Node) Load Script'].push((_d = {},
                _d['Path'] = 'TOTAL TIME',
                _d['Took (ms)'] = total(ticks[LoaderEventType.NodeBeginNativeRequire]).toFixed(2),
                _d));
            ret['(Node) Eval Script'].push((_e = {},
                _e['Path'] = 'TOTAL TIME',
                _e['Took (ms)'] = total(ticks[LoaderEventType.NodeBeginEvaluatingScript]).toFixed(2),
                _e));
            return ret;
            var _a, _b, _c, _d, _e;
        };
        ShowStartupPerformance.ID = 'workbench.action.appPerf';
        ShowStartupPerformance.LABEL = nls.localize('appPerf', "Startup Performance");
        ShowStartupPerformance = __decorate([
            __param(2, windows_1.IWindowService),
            __param(3, timerService_1.ITimerService),
            __param(4, environment_1.IEnvironmentService),
            __param(5, extensions_1.IExtensionService)
        ], ShowStartupPerformance);
        return ShowStartupPerformance;
    }(actions_1.Action));
    exports.ShowStartupPerformance = ShowStartupPerformance;
    var ReloadWindowAction = (function (_super) {
        __extends(ReloadWindowAction, _super);
        function ReloadWindowAction(id, label, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            return _this;
        }
        ReloadWindowAction.prototype.run = function () {
            return this.windowService.reloadWindow().then(function () { return true; });
        };
        ReloadWindowAction.ID = 'workbench.action.reloadWindow';
        ReloadWindowAction.LABEL = nls.localize('reloadWindow', "Reload Window");
        ReloadWindowAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], ReloadWindowAction);
        return ReloadWindowAction;
    }(actions_1.Action));
    exports.ReloadWindowAction = ReloadWindowAction;
    var BaseSwitchWindow = (function (_super) {
        __extends(BaseSwitchWindow, _super);
        function BaseSwitchWindow(id, label, windowsService, windowService, quickOpenService, keybindingService, instantiationService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowsService = windowsService;
            _this.windowService = windowService;
            _this.quickOpenService = quickOpenService;
            _this.keybindingService = keybindingService;
            _this.instantiationService = instantiationService;
            _this.closeWindowAction = _this.instantiationService.createInstance(CloseWindowAction);
            return _this;
        }
        BaseSwitchWindow.prototype.run = function () {
            var _this = this;
            var currentWindowId = this.windowService.getCurrentWindowId();
            return this.windowsService.getWindows().then(function (windows) {
                var placeHolder = nls.localize('switchWindowPlaceHolder', "Select a window to switch to");
                var picks = windows.map(function (win) { return ({
                    payload: win.id,
                    resource: win.filename ? uri_1.default.file(win.filename) : win.folderPath ? uri_1.default.file(win.folderPath) : win.workspace ? uri_1.default.file(win.workspace.configPath) : void 0,
                    fileKind: win.filename ? files_1.FileKind.FILE : win.workspace ? files_1.FileKind.ROOT_FOLDER : win.folderPath ? files_1.FileKind.FOLDER : files_1.FileKind.FILE,
                    label: win.title,
                    description: (currentWindowId === win.id) ? nls.localize('current', "Current Window") : void 0,
                    run: function () {
                        setTimeout(function () {
                            // Bug: somehow when not running this code in a timeout, it is not possible to use this picker
                            // with quick navigate keys (not able to trigger quick navigate once running it once).
                            _this.windowsService.showWindow(win.id).done(null, errors.onUnexpectedError);
                        });
                    },
                    action: (!_this.isQuickNavigate() && currentWindowId !== win.id) ? _this.closeWindowAction : void 0
                }); });
                _this.quickOpenService.pick(picks, {
                    contextKey: 'inWindowsPicker',
                    autoFocus: { autoFocusFirstEntry: true },
                    placeHolder: placeHolder,
                    quickNavigateConfiguration: _this.isQuickNavigate() ? { keybindings: _this.keybindingService.lookupKeybindings(_this.id) } : void 0
                });
            });
        };
        BaseSwitchWindow.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.closeWindowAction.dispose();
        };
        return BaseSwitchWindow;
    }(actions_1.Action));
    exports.BaseSwitchWindow = BaseSwitchWindow;
    var CloseWindowAction = (function (_super) {
        __extends(CloseWindowAction, _super);
        function CloseWindowAction(windowsService) {
            var _this = _super.call(this, CloseWindowAction.ID, CloseWindowAction.LABEL) || this;
            _this.windowsService = windowsService;
            _this.class = 'action-remove-from-recently-opened';
            return _this;
        }
        CloseWindowAction.prototype.run = function (item) {
            return this.windowsService.closeWindow(item.getPayload()).then(function () {
                item.remove();
                return true;
            });
        };
        CloseWindowAction.ID = 'workbench.action.closeWindow';
        CloseWindowAction.LABEL = nls.localize('close', "Close Window");
        CloseWindowAction = __decorate([
            __param(0, windows_1.IWindowsService)
        ], CloseWindowAction);
        return CloseWindowAction;
    }(actions_1.Action));
    var SwitchWindow = (function (_super) {
        __extends(SwitchWindow, _super);
        function SwitchWindow(id, label, windowsService, windowService, quickOpenService, keybindingService, instantiationService) {
            return _super.call(this, id, label, windowsService, windowService, quickOpenService, keybindingService, instantiationService) || this;
        }
        SwitchWindow.prototype.isQuickNavigate = function () {
            return false;
        };
        SwitchWindow.ID = 'workbench.action.switchWindow';
        SwitchWindow.LABEL = nls.localize('switchWindow', "Switch Window...");
        SwitchWindow = __decorate([
            __param(2, windows_1.IWindowsService),
            __param(3, windows_1.IWindowService),
            __param(4, quickOpen_1.IQuickOpenService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, instantiation_1.IInstantiationService)
        ], SwitchWindow);
        return SwitchWindow;
    }(BaseSwitchWindow));
    exports.SwitchWindow = SwitchWindow;
    var QuickSwitchWindow = (function (_super) {
        __extends(QuickSwitchWindow, _super);
        function QuickSwitchWindow(id, label, windowsService, windowService, quickOpenService, keybindingService, instantiationService) {
            return _super.call(this, id, label, windowsService, windowService, quickOpenService, keybindingService, instantiationService) || this;
        }
        QuickSwitchWindow.prototype.isQuickNavigate = function () {
            return true;
        };
        QuickSwitchWindow.ID = 'workbench.action.quickSwitchWindow';
        QuickSwitchWindow.LABEL = nls.localize('quickSwitchWindow', "Quick Switch Window...");
        QuickSwitchWindow = __decorate([
            __param(2, windows_1.IWindowsService),
            __param(3, windows_1.IWindowService),
            __param(4, quickOpen_1.IQuickOpenService),
            __param(5, keybinding_1.IKeybindingService),
            __param(6, instantiation_1.IInstantiationService)
        ], QuickSwitchWindow);
        return QuickSwitchWindow;
    }(BaseSwitchWindow));
    exports.QuickSwitchWindow = QuickSwitchWindow;
    exports.inRecentFilesPickerContextKey = 'inRecentFilesPicker';
    var BaseOpenRecentAction = (function (_super) {
        __extends(BaseOpenRecentAction, _super);
        function BaseOpenRecentAction(id, label, windowsService, windowService, quickOpenService, contextService, environmentService, keybindingService, instantiationService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowsService = windowsService;
            _this.windowService = windowService;
            _this.quickOpenService = quickOpenService;
            _this.contextService = contextService;
            _this.environmentService = environmentService;
            _this.keybindingService = keybindingService;
            _this.removeAction = instantiationService.createInstance(RemoveFromRecentlyOpened);
            return _this;
        }
        BaseOpenRecentAction.prototype.run = function () {
            var _this = this;
            return this.windowService.getRecentlyOpened()
                .then(function (_a) {
                var workspaces = _a.workspaces, files = _a.files;
                return _this.openRecent(workspaces, files);
            });
        };
        BaseOpenRecentAction.prototype.openRecent = function (recentWorkspaces, recentFiles) {
            var _this = this;
            function toPick(workspace, separator, fileKind, environmentService, removeAction) {
                var path;
                var label;
                var description;
                if (workspaces_1.isSingleFolderWorkspaceIdentifier(workspace)) {
                    path = workspace;
                    label = paths.basename(path);
                    description = labels_1.getPathLabel(paths.dirname(path), null, environmentService);
                }
                else {
                    path = workspace.configPath;
                    label = workspaces_1.getWorkspaceLabel(workspace, environmentService);
                    description = labels_1.getPathLabel(paths.dirname(workspace.configPath), null, environmentService);
                }
                return {
                    resource: uri_1.default.file(path),
                    fileKind: fileKind,
                    label: label,
                    description: description,
                    separator: separator,
                    run: function (context) {
                        setTimeout(function () {
                            // Bug: somehow when not running this code in a timeout, it is not possible to use this picker
                            // with quick navigate keys (not able to trigger quick navigate once running it once).
                            runPick(path, fileKind === files_1.FileKind.FILE, context);
                        });
                    },
                    action: removeAction
                };
            }
            var runPick = function (path, isFile, context) {
                var forceNewWindow = context.keymods.indexOf(2048 /* CtrlCmd */) >= 0;
                _this.windowsService.openWindow([path], { forceNewWindow: forceNewWindow, forceOpenWorkspaceAsFile: isFile });
            };
            var workspacePicks = recentWorkspaces.map(function (workspace, index) { return toPick(workspace, index === 0 ? { label: nls.localize('workspaces', "workspaces") } : void 0, workspaces_1.isSingleFolderWorkspaceIdentifier(workspace) ? files_1.FileKind.FOLDER : files_1.FileKind.ROOT_FOLDER, _this.environmentService, !_this.isQuickNavigate() ? _this.removeAction : void 0); });
            var filePicks = recentFiles.map(function (p, index) { return toPick(p, index === 0 ? { label: nls.localize('files', "files"), border: true } : void 0, files_1.FileKind.FILE, _this.environmentService, !_this.isQuickNavigate() ? _this.removeAction : void 0); });
            var isCurrentWorkspaceInList;
            if (!this.contextService.hasWorkspace()) {
                isCurrentWorkspaceInList = false; // we never show empty workspaces
            }
            else if (this.contextService.hasFolderWorkspace()) {
                isCurrentWorkspaceInList = true; // we always show folder workspaces
            }
            else {
                var firstWorkspace = recentWorkspaces[0];
                if (firstWorkspace && !workspaces_1.isSingleFolderWorkspaceIdentifier(firstWorkspace)) {
                    isCurrentWorkspaceInList = firstWorkspace.id === this.contextService.getWorkspace().id;
                }
                else {
                    isCurrentWorkspaceInList = false; // this is an untitled workspace thereby
                }
            }
            this.quickOpenService.pick(workspacePicks.concat(filePicks), {
                contextKey: exports.inRecentFilesPickerContextKey,
                autoFocus: { autoFocusFirstEntry: !isCurrentWorkspaceInList, autoFocusSecondEntry: isCurrentWorkspaceInList },
                placeHolder: platform_1.isMacintosh ? nls.localize('openRecentPlaceHolderMac', "Select to open (hold Cmd-key to open in new window)") : nls.localize('openRecentPlaceHolder', "Select to open (hold Ctrl-key to open in new window)"),
                matchOnDescription: true,
                quickNavigateConfiguration: this.isQuickNavigate() ? { keybindings: this.keybindingService.lookupKeybindings(this.id) } : void 0
            }).done(null, errors.onUnexpectedError);
        };
        BaseOpenRecentAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.removeAction.dispose();
        };
        return BaseOpenRecentAction;
    }(actions_1.Action));
    exports.BaseOpenRecentAction = BaseOpenRecentAction;
    var RemoveFromRecentlyOpened = (function (_super) {
        __extends(RemoveFromRecentlyOpened, _super);
        function RemoveFromRecentlyOpened(windowsService) {
            var _this = _super.call(this, RemoveFromRecentlyOpened.ID, RemoveFromRecentlyOpened.LABEL) || this;
            _this.windowsService = windowsService;
            _this.class = 'action-remove-from-recently-opened';
            return _this;
        }
        RemoveFromRecentlyOpened.prototype.run = function (item) {
            return this.windowsService.removeFromRecentlyOpened([item.getResource().fsPath]).then(function () {
                item.remove();
                return true;
            });
        };
        RemoveFromRecentlyOpened.ID = 'workbench.action.removeFromRecentlyOpened';
        RemoveFromRecentlyOpened.LABEL = nls.localize('remove', "Remove from Recently Opened");
        RemoveFromRecentlyOpened = __decorate([
            __param(0, windows_1.IWindowsService)
        ], RemoveFromRecentlyOpened);
        return RemoveFromRecentlyOpened;
    }(actions_1.Action));
    var OpenRecentAction = (function (_super) {
        __extends(OpenRecentAction, _super);
        function OpenRecentAction(id, label, windowsService, windowService, quickOpenService, contextService, environmentService, keybindingService, instantiationService) {
            return _super.call(this, id, label, windowsService, windowService, quickOpenService, contextService, environmentService, keybindingService, instantiationService) || this;
        }
        OpenRecentAction.prototype.isQuickNavigate = function () {
            return false;
        };
        OpenRecentAction.ID = 'workbench.action.openRecent';
        OpenRecentAction.LABEL = nls.localize('openRecent', "Open Recent...");
        OpenRecentAction = __decorate([
            __param(2, windows_1.IWindowsService),
            __param(3, windows_1.IWindowService),
            __param(4, quickOpen_1.IQuickOpenService),
            __param(5, workspace_1.IWorkspaceContextService),
            __param(6, environment_1.IEnvironmentService),
            __param(7, keybinding_1.IKeybindingService),
            __param(8, instantiation_1.IInstantiationService)
        ], OpenRecentAction);
        return OpenRecentAction;
    }(BaseOpenRecentAction));
    exports.OpenRecentAction = OpenRecentAction;
    var QuickOpenRecentAction = (function (_super) {
        __extends(QuickOpenRecentAction, _super);
        function QuickOpenRecentAction(id, label, windowsService, windowService, quickOpenService, contextService, environmentService, keybindingService, instantiationService) {
            return _super.call(this, id, label, windowsService, windowService, quickOpenService, contextService, environmentService, keybindingService, instantiationService) || this;
        }
        QuickOpenRecentAction.prototype.isQuickNavigate = function () {
            return true;
        };
        QuickOpenRecentAction.ID = 'workbench.action.quickOpenRecent';
        QuickOpenRecentAction.LABEL = nls.localize('quickOpenRecent', "Quick Open Recent...");
        QuickOpenRecentAction = __decorate([
            __param(2, windows_1.IWindowsService),
            __param(3, windows_1.IWindowService),
            __param(4, quickOpen_1.IQuickOpenService),
            __param(5, workspace_1.IWorkspaceContextService),
            __param(6, environment_1.IEnvironmentService),
            __param(7, keybinding_1.IKeybindingService),
            __param(8, instantiation_1.IInstantiationService)
        ], QuickOpenRecentAction);
        return QuickOpenRecentAction;
    }(BaseOpenRecentAction));
    exports.QuickOpenRecentAction = QuickOpenRecentAction;
    var CloseMessagesAction = (function (_super) {
        __extends(CloseMessagesAction, _super);
        function CloseMessagesAction(id, label, messageService, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.messageService = messageService;
            _this.editorService = editorService;
            return _this;
        }
        CloseMessagesAction.prototype.run = function () {
            // Close any Message if visible
            this.messageService.hideAll();
            // Restore focus if we got an editor
            var editor = this.editorService.getActiveEditor();
            if (editor) {
                editor.focus();
            }
            return winjs_base_1.TPromise.as(true);
        };
        CloseMessagesAction.ID = 'workbench.action.closeMessages';
        CloseMessagesAction.LABEL = nls.localize('closeMessages', "Close Notification Messages");
        CloseMessagesAction = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, editorService_1.IWorkbenchEditorService)
        ], CloseMessagesAction);
        return CloseMessagesAction;
    }(actions_1.Action));
    exports.CloseMessagesAction = CloseMessagesAction;
    var ReportIssueAction = (function (_super) {
        __extends(ReportIssueAction, _super);
        function ReportIssueAction(id, label, integrityService, extensionManagementService) {
            var _this = _super.call(this, id, label) || this;
            _this.integrityService = integrityService;
            _this.extensionManagementService = extensionManagementService;
            return _this;
        }
        ReportIssueAction.prototype._optimisticIsPure = function () {
            var isPure = true;
            var integrityPromise = this.integrityService.isPure().then(function (res) {
                isPure = res.isPure;
            });
            return winjs_base_1.TPromise.any([winjs_base_1.TPromise.timeout(100), integrityPromise]).then(function () {
                return isPure;
            });
        };
        ReportIssueAction.prototype.run = function () {
            var _this = this;
            return this._optimisticIsPure().then(function (isPure) {
                return _this.extensionManagementService.getInstalled(extensionManagement_1.LocalExtensionType.User).then(function (extensions) {
                    var issueUrl = _this.generateNewIssueUrl(product_1.default.reportIssueUrl, package_1.default.name, package_1.default.version, product_1.default.commit, product_1.default.date, isPure, extensions);
                    window.open(issueUrl);
                    return winjs_base_1.TPromise.as(true);
                });
            });
        };
        ReportIssueAction.prototype.generateNewIssueUrl = function (baseUrl, name, version, commit, date, isPure, extensions) {
            // Avoid backticks, these can trigger XSS detectors. (https://github.com/Microsoft/vscode/issues/13098)
            var osVersion = os.type() + " " + os.arch() + " " + os.release();
            var queryStringPrefix = baseUrl.indexOf('?') === -1 ? '?' : '&';
            var body = encodeURIComponent("- VSCode Version: " + name + " " + version + (isPure ? '' : ' **[Unsupported]**') + " (" + (product_1.default.commit || 'Commit unknown') + ", " + (product_1.default.date || 'Date unknown') + ")\n- OS Version: " + osVersion + "\n- Extensions: " + this.generateExtensionTable(extensions) + "\n---\n\nSteps to Reproduce:\n\n1.\n2." + (extensions.length ? "\n\n<!-- Launch with `code --disable-extensions` to check. -->\nReproduces without extensions: Yes/No" : ''));
            return "" + baseUrl + queryStringPrefix + "body=" + body;
        };
        ReportIssueAction.prototype.generateExtensionTable = function (extensions) {
            var _a = collections.groupBy(extensions, function (ext) {
                var manifestKeys = ext.manifest.contributes ? Object.keys(ext.manifest.contributes) : [];
                var onlyTheme = !ext.manifest.activationEvents && manifestKeys.length === 1 && manifestKeys[0] === 'themes';
                return onlyTheme ? 'themes' : 'nonThemes';
            }), nonThemes = _a.nonThemes, themes = _a.themes;
            var themeExclusionStr = (themes && themes.length) ? "\n(" + themes.length + " theme extensions excluded)" : '';
            extensions = nonThemes || [];
            if (!extensions.length) {
                return 'none' + themeExclusionStr;
            }
            var tableHeader = "Extension|Author (truncated)|Version\n---|---|---";
            var table = extensions.map(function (e) {
                return e.manifest.name + "|" + e.manifest.publisher.substr(0, 3) + "|" + e.manifest.version;
            }).join('\n');
            var extensionTable = "\n\n" + tableHeader + "\n" + table + "\n" + themeExclusionStr + "\n\n";
            // 2000 chars is browsers de-facto limit for URLs, 400 chars are allowed for other string parts of the issue URL
            // http://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
            if (encodeURIComponent(extensionTable).length > 1600) {
                return 'the listing length exceeds browsers\' URL characters limit';
            }
            return extensionTable;
        };
        ReportIssueAction.ID = 'workbench.action.reportIssues';
        ReportIssueAction.LABEL = nls.localize('reportIssues', "Report Issues");
        ReportIssueAction = __decorate([
            __param(2, integrity_1.IIntegrityService),
            __param(3, extensionManagement_1.IExtensionManagementService)
        ], ReportIssueAction);
        return ReportIssueAction;
    }(actions_1.Action));
    exports.ReportIssueAction = ReportIssueAction;
    var ReportPerformanceIssueAction = (function (_super) {
        __extends(ReportPerformanceIssueAction, _super);
        function ReportPerformanceIssueAction(id, label, integrityService, environmentService, timerService) {
            var _this = _super.call(this, id, label) || this;
            _this.integrityService = integrityService;
            _this.environmentService = environmentService;
            _this.timerService = timerService;
            return _this;
        }
        ReportPerformanceIssueAction.prototype.run = function (appendix) {
            var _this = this;
            return this.integrityService.isPure().then(function (res) {
                var issueUrl = _this.generatePerformanceIssueUrl(product_1.default.reportIssueUrl, package_1.default.name, package_1.default.version, product_1.default.commit, product_1.default.date, res.isPure, appendix);
                window.open(issueUrl);
                return winjs_base_1.TPromise.as(true);
            });
        };
        ReportPerformanceIssueAction.prototype.generatePerformanceIssueUrl = function (baseUrl, name, version, commit, date, isPure, appendix) {
            if (!appendix) {
                appendix = "Additional Steps to Reproduce (if any):\n\n1.\n2.";
            }
            var nodeModuleLoadTime;
            if (this.environmentService.performance) {
                nodeModuleLoadTime = this.computeNodeModulesLoadTime();
            }
            var metrics = this.timerService.startupMetrics;
            var osVersion = os.type() + " " + os.arch() + " " + os.release();
            var queryStringPrefix = baseUrl.indexOf('?') === -1 ? '?' : '&';
            var body = encodeURIComponent("- VSCode Version: <code>" + name + " " + version + (isPure ? '' : ' **[Unsupported]**') + " (" + (product_1.default.commit || 'Commit unknown') + ", " + (product_1.default.date || 'Date unknown') + ")</code>\n- OS Version: <code>" + osVersion + "</code>\n- CPUs: <code>" + metrics.cpus.model + " (" + metrics.cpus.count + " x " + metrics.cpus.speed + ")</code>\n- Memory (System): <code>" + (metrics.totalmem / (1024 * 1024 * 1024)).toFixed(2) + "GB (" + (metrics.freemem / (1024 * 1024 * 1024)).toFixed(2) + "GB free)</code>\n- Memory (Process): <code>" + (metrics.meminfo.workingSetSize / 1024).toFixed(2) + "MB working set (" + (metrics.meminfo.peakWorkingSetSize / 1024).toFixed(2) + "MB peak, " + (metrics.meminfo.privateBytes / 1024).toFixed(2) + "MB private, " + (metrics.meminfo.sharedBytes / 1024).toFixed(2) + "MB shared)</code>\n- Load (avg): <code>" + metrics.loadavg.map(function (l) { return Math.round(l); }).join(', ') + "</code>\n- VM: <code>" + metrics.isVMLikelyhood + "%</code>\n- Initial Startup: <code>" + (metrics.initialStartup ? 'yes' : 'no') + "</code>\n- Screen Reader: <code>" + (metrics.hasAccessibilitySupport ? 'yes' : 'no') + "</code>\n- Empty Workspace: <code>" + (metrics.emptyWorkbench ? 'yes' : 'no') + "</code>\n- Timings:\n\n" + this.generatePerformanceTable(nodeModuleLoadTime) + "\n\n---\n\n" + appendix);
            return "" + baseUrl + queryStringPrefix + "body=" + body;
        };
        ReportPerformanceIssueAction.prototype.computeNodeModulesLoadTime = function () {
            var stats = require.getStats();
            var total = 0;
            for (var i = 0, len = stats.length; i < len; i++) {
                if (stats[i].type === LoaderEventType.NodeEndNativeRequire) {
                    if (stats[i - 1].type === LoaderEventType.NodeBeginNativeRequire && stats[i - 1].detail === stats[i].detail) {
                        var dur = (stats[i].timestamp - stats[i - 1].timestamp);
                        total += dur;
                    }
                }
            }
            return Math.round(total);
        };
        ReportPerformanceIssueAction.prototype.generatePerformanceTable = function (nodeModuleLoadTime) {
            var tableHeader = "|Component|Task|Time (ms)|\n|---|---|---|";
            var table = this.getStartupMetricsTable(nodeModuleLoadTime).map(function (e) {
                return "|" + e.component + "|" + e.task + "|" + e.time + "|";
            }).join('\n');
            return tableHeader + "\n" + table;
        };
        ReportPerformanceIssueAction.prototype.getStartupMetricsTable = function (nodeModuleLoadTime) {
            var table = [];
            var metrics = this.timerService.startupMetrics;
            if (metrics.initialStartup) {
                table.push({ component: 'main', task: 'start => app.isReady', time: metrics.timers.ellapsedAppReady });
                table.push({ component: 'main', task: 'app.isReady => window.loadUrl()', time: metrics.timers.ellapsedWindowLoad });
            }
            table.push({ component: 'renderer', task: 'window.loadUrl() => begin to require(workbench.main.js)', time: metrics.timers.ellapsedWindowLoadToRequire });
            table.push({ component: 'renderer', task: 'require(workbench.main.js)', time: metrics.timers.ellapsedRequire });
            if (nodeModuleLoadTime) {
                table.push({ component: 'renderer', task: '-> of which require() node_modules', time: nodeModuleLoadTime });
            }
            table.push({ component: 'renderer', task: 'create extension host => extensions onReady()', time: metrics.timers.ellapsedExtensions });
            table.push({ component: 'renderer', task: 'restore viewlet', time: metrics.timers.ellapsedViewletRestore });
            table.push({ component: 'renderer', task: 'restore editor view state', time: metrics.timers.ellapsedEditorRestore });
            table.push({ component: 'renderer', task: 'overall workbench load', time: metrics.timers.ellapsedWorkbench });
            table.push({ component: 'main + renderer', task: 'start => extensions ready', time: metrics.timers.ellapsedExtensionsReady });
            table.push({ component: 'main + renderer', task: 'start => workbench ready', time: metrics.ellapsed });
            return table;
        };
        ReportPerformanceIssueAction.ID = 'workbench.action.reportPerformanceIssue';
        ReportPerformanceIssueAction.LABEL = nls.localize('reportPerformanceIssue', "Report Performance Issue");
        ReportPerformanceIssueAction = __decorate([
            __param(2, integrity_1.IIntegrityService),
            __param(3, environment_1.IEnvironmentService),
            __param(4, timerService_1.ITimerService)
        ], ReportPerformanceIssueAction);
        return ReportPerformanceIssueAction;
    }(actions_1.Action));
    exports.ReportPerformanceIssueAction = ReportPerformanceIssueAction;
    var KeybindingsReferenceAction = (function (_super) {
        __extends(KeybindingsReferenceAction, _super);
        function KeybindingsReferenceAction(id, label) {
            return _super.call(this, id, label) || this;
        }
        KeybindingsReferenceAction.prototype.run = function () {
            window.open(KeybindingsReferenceAction.URL);
            return null;
        };
        KeybindingsReferenceAction.ID = 'workbench.action.keybindingsReference';
        KeybindingsReferenceAction.LABEL = nls.localize('keybindingsReference', "Keyboard Shortcuts Reference");
        KeybindingsReferenceAction.URL = platform_1.isLinux ? product_1.default.keyboardShortcutsUrlLinux : platform_1.isMacintosh ? product_1.default.keyboardShortcutsUrlMac : product_1.default.keyboardShortcutsUrlWin;
        KeybindingsReferenceAction.AVAILABLE = !!KeybindingsReferenceAction.URL;
        return KeybindingsReferenceAction;
    }(actions_1.Action));
    exports.KeybindingsReferenceAction = KeybindingsReferenceAction;
    var OpenDocumentationUrlAction = (function (_super) {
        __extends(OpenDocumentationUrlAction, _super);
        function OpenDocumentationUrlAction(id, label) {
            return _super.call(this, id, label) || this;
        }
        OpenDocumentationUrlAction.prototype.run = function () {
            window.open(OpenDocumentationUrlAction.URL);
            return null;
        };
        OpenDocumentationUrlAction.ID = 'workbench.action.openDocumentationUrl';
        OpenDocumentationUrlAction.LABEL = nls.localize('openDocumentationUrl', "Documentation");
        OpenDocumentationUrlAction.URL = product_1.default.documentationUrl;
        OpenDocumentationUrlAction.AVAILABLE = !!OpenDocumentationUrlAction.URL;
        return OpenDocumentationUrlAction;
    }(actions_1.Action));
    exports.OpenDocumentationUrlAction = OpenDocumentationUrlAction;
    var OpenIntroductoryVideosUrlAction = (function (_super) {
        __extends(OpenIntroductoryVideosUrlAction, _super);
        function OpenIntroductoryVideosUrlAction(id, label) {
            return _super.call(this, id, label) || this;
        }
        OpenIntroductoryVideosUrlAction.prototype.run = function () {
            window.open(OpenIntroductoryVideosUrlAction.URL);
            return null;
        };
        OpenIntroductoryVideosUrlAction.ID = 'workbench.action.openIntroductoryVideosUrl';
        OpenIntroductoryVideosUrlAction.LABEL = nls.localize('openIntroductoryVideosUrl', "Introductory Videos");
        OpenIntroductoryVideosUrlAction.URL = product_1.default.introductoryVideosUrl;
        OpenIntroductoryVideosUrlAction.AVAILABLE = !!OpenIntroductoryVideosUrlAction.URL;
        return OpenIntroductoryVideosUrlAction;
    }(actions_1.Action));
    exports.OpenIntroductoryVideosUrlAction = OpenIntroductoryVideosUrlAction;
    var OpenTipsAndTricksUrlAction = (function (_super) {
        __extends(OpenTipsAndTricksUrlAction, _super);
        function OpenTipsAndTricksUrlAction(id, label) {
            return _super.call(this, id, label) || this;
        }
        OpenTipsAndTricksUrlAction.prototype.run = function () {
            window.open(OpenTipsAndTricksUrlAction.URL);
            return null;
        };
        OpenTipsAndTricksUrlAction.ID = 'workbench.action.openTipsAndTricksUrl';
        OpenTipsAndTricksUrlAction.LABEL = nls.localize('openTipsAndTricksUrl', "Tips and Tricks");
        OpenTipsAndTricksUrlAction.URL = product_1.default.tipsAndTricksUrl;
        OpenTipsAndTricksUrlAction.AVAILABLE = !!OpenTipsAndTricksUrlAction.URL;
        return OpenTipsAndTricksUrlAction;
    }(actions_1.Action));
    exports.OpenTipsAndTricksUrlAction = OpenTipsAndTricksUrlAction;
    var ToggleSharedProcessAction = (function (_super) {
        __extends(ToggleSharedProcessAction, _super);
        function ToggleSharedProcessAction(id, label, windowsService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowsService = windowsService;
            return _this;
        }
        ToggleSharedProcessAction.prototype.run = function () {
            return this.windowsService.toggleSharedProcess();
        };
        ToggleSharedProcessAction.ID = 'workbench.action.toggleSharedProcess';
        ToggleSharedProcessAction.LABEL = nls.localize('toggleSharedProcess', "Toggle Shared Process");
        ToggleSharedProcessAction = __decorate([
            __param(2, windows_1.IWindowsService)
        ], ToggleSharedProcessAction);
        return ToggleSharedProcessAction;
    }(actions_1.Action));
    exports.ToggleSharedProcessAction = ToggleSharedProcessAction;
    var Direction;
    (function (Direction) {
        Direction[Direction["Next"] = 0] = "Next";
        Direction[Direction["Previous"] = 1] = "Previous";
    })(Direction || (Direction = {}));
    var BaseNavigationAction = (function (_super) {
        __extends(BaseNavigationAction, _super);
        function BaseNavigationAction(id, label, groupService, panelService, partService, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.groupService = groupService;
            _this.panelService = panelService;
            _this.partService = partService;
            _this.viewletService = viewletService;
            return _this;
        }
        BaseNavigationAction.prototype.run = function () {
            var isEditorFocus = this.partService.hasFocus(partService_1.Parts.EDITOR_PART);
            var isPanelFocus = this.partService.hasFocus(partService_1.Parts.PANEL_PART);
            var isSidebarFocus = this.partService.hasFocus(partService_1.Parts.SIDEBAR_PART);
            var isEditorGroupVertical = this.groupService.getGroupOrientation() === 'vertical';
            var isSidebarPositionLeft = this.partService.getSideBarPosition() === partService_1.Position.LEFT;
            if (isEditorFocus) {
                return this.navigateOnEditorFocus(isEditorGroupVertical, isSidebarPositionLeft);
            }
            if (isPanelFocus) {
                return this.navigateOnPanelFocus(isEditorGroupVertical, isSidebarPositionLeft);
            }
            if (isSidebarFocus) {
                return this.navigateOnSidebarFocus(isEditorGroupVertical, isSidebarPositionLeft);
            }
            return winjs_base_1.TPromise.as(false);
        };
        BaseNavigationAction.prototype.navigateOnEditorFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction.prototype.navigateOnPanelFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction.prototype.navigateOnSidebarFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction.prototype.navigateToPanel = function () {
            if (!this.partService.isVisible(partService_1.Parts.PANEL_PART)) {
                return winjs_base_1.TPromise.as(false);
            }
            var activePanelId = this.panelService.getActivePanel().getId();
            return this.panelService.openPanel(activePanelId, true);
        };
        BaseNavigationAction.prototype.navigateToSidebar = function () {
            if (!this.partService.isVisible(partService_1.Parts.SIDEBAR_PART)) {
                return winjs_base_1.TPromise.as(false);
            }
            var activeViewletId = this.viewletService.getActiveViewlet().getId();
            return this.viewletService.openViewlet(activeViewletId, true);
        };
        BaseNavigationAction.prototype.navigateAcrossEditorGroup = function (direction) {
            var model = this.groupService.getStacksModel();
            var currentPosition = model.positionOfGroup(model.activeGroup);
            var nextPosition = direction === Direction.Next ? currentPosition + 1 : currentPosition - 1;
            if (nextPosition < 0 || nextPosition > model.groups.length - 1) {
                return winjs_base_1.TPromise.as(false);
            }
            this.groupService.focusGroup(nextPosition);
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction.prototype.navigateToLastActiveGroup = function () {
            var model = this.groupService.getStacksModel();
            var lastActiveGroup = model.activeGroup;
            this.groupService.focusGroup(lastActiveGroup);
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction.prototype.navigateToFirstEditorGroup = function () {
            this.groupService.focusGroup(0);
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction.prototype.navigateToLastEditorGroup = function () {
            var model = this.groupService.getStacksModel();
            var lastEditorGroupPosition = model.groups.length - 1;
            this.groupService.focusGroup(lastEditorGroupPosition);
            return winjs_base_1.TPromise.as(true);
        };
        BaseNavigationAction = __decorate([
            __param(2, groupService_1.IEditorGroupService),
            __param(3, panelService_1.IPanelService),
            __param(4, partService_1.IPartService),
            __param(5, viewlet_1.IViewletService)
        ], BaseNavigationAction);
        return BaseNavigationAction;
    }(actions_1.Action));
    exports.BaseNavigationAction = BaseNavigationAction;
    var NavigateLeftAction = (function (_super) {
        __extends(NavigateLeftAction, _super);
        function NavigateLeftAction(id, label, groupService, panelService, partService, viewletService) {
            return _super.call(this, id, label, groupService, panelService, partService, viewletService) || this;
        }
        NavigateLeftAction.prototype.navigateOnEditorFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            var _this = this;
            if (!isEditorGroupVertical) {
                if (isSidebarPositionLeft) {
                    return this.navigateToSidebar();
                }
                return winjs_base_1.TPromise.as(false);
            }
            return this.navigateAcrossEditorGroup(Direction.Previous)
                .then(function (didNavigate) {
                if (!didNavigate && isSidebarPositionLeft) {
                    return _this.navigateToSidebar();
                }
                return winjs_base_1.TPromise.as(true);
            });
        };
        NavigateLeftAction.prototype.navigateOnPanelFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            if (isSidebarPositionLeft) {
                return this.navigateToSidebar();
            }
            return winjs_base_1.TPromise.as(false);
        };
        NavigateLeftAction.prototype.navigateOnSidebarFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            if (isSidebarPositionLeft) {
                return winjs_base_1.TPromise.as(false);
            }
            if (isEditorGroupVertical) {
                return this.navigateToLastEditorGroup();
            }
            return this.navigateToLastActiveGroup();
        };
        NavigateLeftAction.ID = 'workbench.action.navigateLeft';
        NavigateLeftAction.LABEL = nls.localize('navigateLeft', "Navigate to the View on the Left");
        NavigateLeftAction = __decorate([
            __param(2, groupService_1.IEditorGroupService),
            __param(3, panelService_1.IPanelService),
            __param(4, partService_1.IPartService),
            __param(5, viewlet_1.IViewletService)
        ], NavigateLeftAction);
        return NavigateLeftAction;
    }(BaseNavigationAction));
    exports.NavigateLeftAction = NavigateLeftAction;
    var NavigateRightAction = (function (_super) {
        __extends(NavigateRightAction, _super);
        function NavigateRightAction(id, label, groupService, panelService, partService, viewletService) {
            return _super.call(this, id, label, groupService, panelService, partService, viewletService) || this;
        }
        NavigateRightAction.prototype.navigateOnEditorFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            var _this = this;
            if (!isEditorGroupVertical) {
                if (!isSidebarPositionLeft) {
                    return this.navigateToSidebar();
                }
                return winjs_base_1.TPromise.as(false);
            }
            return this.navigateAcrossEditorGroup(Direction.Next)
                .then(function (didNavigate) {
                if (!didNavigate && !isSidebarPositionLeft) {
                    return _this.navigateToSidebar();
                }
                return winjs_base_1.TPromise.as(true);
            });
        };
        NavigateRightAction.prototype.navigateOnPanelFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            if (!isSidebarPositionLeft) {
                return this.navigateToSidebar();
            }
            return winjs_base_1.TPromise.as(false);
        };
        NavigateRightAction.prototype.navigateOnSidebarFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            if (!isSidebarPositionLeft) {
                return winjs_base_1.TPromise.as(false);
            }
            if (isEditorGroupVertical) {
                return this.navigateToFirstEditorGroup();
            }
            return this.navigateToLastActiveGroup();
        };
        NavigateRightAction.ID = 'workbench.action.navigateRight';
        NavigateRightAction.LABEL = nls.localize('navigateRight', "Navigate to the View on the Right");
        NavigateRightAction = __decorate([
            __param(2, groupService_1.IEditorGroupService),
            __param(3, panelService_1.IPanelService),
            __param(4, partService_1.IPartService),
            __param(5, viewlet_1.IViewletService)
        ], NavigateRightAction);
        return NavigateRightAction;
    }(BaseNavigationAction));
    exports.NavigateRightAction = NavigateRightAction;
    var NavigateUpAction = (function (_super) {
        __extends(NavigateUpAction, _super);
        function NavigateUpAction(id, label, groupService, panelService, partService, viewletService) {
            return _super.call(this, id, label, groupService, panelService, partService, viewletService) || this;
        }
        NavigateUpAction.prototype.navigateOnEditorFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            if (isEditorGroupVertical) {
                return winjs_base_1.TPromise.as(false);
            }
            return this.navigateAcrossEditorGroup(Direction.Previous);
        };
        NavigateUpAction.prototype.navigateOnPanelFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            if (isEditorGroupVertical) {
                return this.navigateToLastActiveGroup();
            }
            return this.navigateToLastEditorGroup();
        };
        NavigateUpAction.ID = 'workbench.action.navigateUp';
        NavigateUpAction.LABEL = nls.localize('navigateUp', "Navigate to the View Above");
        NavigateUpAction = __decorate([
            __param(2, groupService_1.IEditorGroupService),
            __param(3, panelService_1.IPanelService),
            __param(4, partService_1.IPartService),
            __param(5, viewlet_1.IViewletService)
        ], NavigateUpAction);
        return NavigateUpAction;
    }(BaseNavigationAction));
    exports.NavigateUpAction = NavigateUpAction;
    var NavigateDownAction = (function (_super) {
        __extends(NavigateDownAction, _super);
        function NavigateDownAction(id, label, groupService, panelService, partService, viewletService) {
            return _super.call(this, id, label, groupService, panelService, partService, viewletService) || this;
        }
        NavigateDownAction.prototype.navigateOnEditorFocus = function (isEditorGroupVertical, isSidebarPositionLeft) {
            var _this = this;
            if (isEditorGroupVertical) {
                return this.navigateToPanel();
            }
            return this.navigateAcrossEditorGroup(Direction.Next)
                .then(function (didNavigate) {
                if (didNavigate) {
                    return winjs_base_1.TPromise.as(true);
                }
                return _this.navigateToPanel();
            });
        };
        NavigateDownAction.ID = 'workbench.action.navigateDown';
        NavigateDownAction.LABEL = nls.localize('navigateDown', "Navigate to the View Below");
        NavigateDownAction = __decorate([
            __param(2, groupService_1.IEditorGroupService),
            __param(3, panelService_1.IPanelService),
            __param(4, partService_1.IPartService),
            __param(5, viewlet_1.IViewletService)
        ], NavigateDownAction);
        return NavigateDownAction;
    }(BaseNavigationAction));
    exports.NavigateDownAction = NavigateDownAction;
    // Resize focused view actions
    var BaseResizeViewAction = (function (_super) {
        __extends(BaseResizeViewAction, _super);
        function BaseResizeViewAction(id, label, partService) {
            var _this = _super.call(this, id, label) || this;
            _this.partService = partService;
            return _this;
        }
        BaseResizeViewAction.prototype.resizePart = function (sizeChange) {
            var isEditorFocus = this.partService.hasFocus(partService_1.Parts.EDITOR_PART);
            var isSidebarFocus = this.partService.hasFocus(partService_1.Parts.SIDEBAR_PART);
            var isPanelFocus = this.partService.hasFocus(partService_1.Parts.PANEL_PART);
            var part;
            if (isSidebarFocus) {
                part = partService_1.Parts.SIDEBAR_PART;
            }
            else if (isPanelFocus) {
                part = partService_1.Parts.PANEL_PART;
            }
            else if (isEditorFocus) {
                part = partService_1.Parts.EDITOR_PART;
            }
            if (part) {
                this.partService.resizePart(part, sizeChange);
            }
        };
        // This is a media-size percentage
        BaseResizeViewAction.RESIZE_INCREMENT = 6.5;
        BaseResizeViewAction = __decorate([
            __param(2, partService_1.IPartService)
        ], BaseResizeViewAction);
        return BaseResizeViewAction;
    }(actions_1.Action));
    exports.BaseResizeViewAction = BaseResizeViewAction;
    var IncreaseViewSizeAction = (function (_super) {
        __extends(IncreaseViewSizeAction, _super);
        function IncreaseViewSizeAction(id, label, partService) {
            return _super.call(this, id, label, partService) || this;
        }
        IncreaseViewSizeAction.prototype.run = function () {
            this.resizePart(BaseResizeViewAction.RESIZE_INCREMENT);
            return winjs_base_1.TPromise.as(true);
        };
        IncreaseViewSizeAction.ID = 'workbench.action.increaseViewSize';
        IncreaseViewSizeAction.LABEL = nls.localize('increaseViewSize', "Increase Current View Size");
        IncreaseViewSizeAction = __decorate([
            __param(2, partService_1.IPartService)
        ], IncreaseViewSizeAction);
        return IncreaseViewSizeAction;
    }(BaseResizeViewAction));
    exports.IncreaseViewSizeAction = IncreaseViewSizeAction;
    var DecreaseViewSizeAction = (function (_super) {
        __extends(DecreaseViewSizeAction, _super);
        function DecreaseViewSizeAction(id, label, partService) {
            return _super.call(this, id, label, partService) || this;
        }
        DecreaseViewSizeAction.prototype.run = function () {
            this.resizePart(-BaseResizeViewAction.RESIZE_INCREMENT);
            return winjs_base_1.TPromise.as(true);
        };
        DecreaseViewSizeAction.ID = 'workbench.action.decreaseViewSize';
        DecreaseViewSizeAction.LABEL = nls.localize('decreaseViewSize', "Decrease Current View Size");
        DecreaseViewSizeAction = __decorate([
            __param(2, partService_1.IPartService)
        ], DecreaseViewSizeAction);
        return DecreaseViewSizeAction;
    }(BaseResizeViewAction));
    exports.DecreaseViewSizeAction = DecreaseViewSizeAction;
});
//# sourceMappingURL=actions.js.map