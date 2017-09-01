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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/severity", "vs/base/common/objects", "vs/base/common/uri", "vs/base/common/actions", "vs/base/browser/dom", "vs/base/common/lifecycle", "vs/base/common/eventEmitter", "vs/base/browser/builder", "vs/base/common/types", "vs/base/common/processes", "vs/base/common/strings", "vs/base/common/parsers", "vs/base/common/uuid", "vs/base/common/map", "vs/base/browser/ui/octiconLabel/octiconLabel", "vs/platform/registry/common/platform", "vs/platform/lifecycle/common/lifecycle", "vs/platform/actions/common/actions", "vs/platform/instantiation/common/extensions", "vs/platform/message/common/message", "vs/platform/markers/common/markers", "vs/platform/telemetry/common/telemetry", "vs/platform/configuration/common/configuration", "vs/platform/files/common/files", "vs/platform/extensions/common/extensions", "vs/platform/commands/common/commands", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/markers/common/problemMatcher", "vs/platform/storage/common/storage", "vs/platform/progress/common/progress", "vs/platform/opener/common/opener", "vs/platform/windows/common/windows", "vs/editor/common/services/modeService", "vs/editor/common/services/modelService", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/workbench/common/actionRegistry", "vs/workbench/browser/parts/statusbar/statusbar", "vs/workbench/browser/quickopen", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/services/panel/common/panelService", "vs/workbench/parts/markers/common/constants", "vs/workbench/services/part/common/partService", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/configurationResolver/common/configurationResolver", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/workspace/common/workspace", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/parts/output/common/output", "vs/workbench/browser/actions", "vs/workbench/parts/terminal/common/terminal", "vs/workbench/parts/tasks/common/taskSystem", "vs/workbench/parts/tasks/common/tasks", "vs/workbench/parts/tasks/common/taskService", "vs/workbench/parts/tasks/common/taskTemplates", "../node/taskConfiguration", "vs/workbench/parts/tasks/node/processTaskSystem", "./terminalTaskSystem", "vs/workbench/parts/tasks/node/processRunnerDetector", "../browser/quickOpen", "vs/platform/environment/common/environment", "vs/workbench/common/theme", "vs/platform/theme/common/themeService", "vs/workbench/electron-browser/actions", "./jsonSchema_v1", "./jsonSchema_v2", "vs/css!./media/task.contribution", "vs/workbench/parts/tasks/browser/taskQuickOpen"], function (require, exports, nls, winjs_base_1, severity_1, Objects, uri_1, actions_1, Dom, lifecycle_1, eventEmitter_1, Builder, Types, processes_1, strings, parsers_1, UUID, map_1, octiconLabel_1, platform_1, lifecycle_2, actions_2, extensions_1, message_1, markers_1, telemetry_1, configuration_1, files_1, extensions_2, commands_1, keybindingsRegistry_1, problemMatcher_1, storage_1, progress_1, opener_1, windows_1, modeService_1, modelService_1, jsonContributionRegistry, actionRegistry_1, statusbar_1, quickopen_1, quickOpen_1, panelService_1, constants_1, partService_1, editorService_1, configurationResolver_1, configurationEditing_1, workspace_1, textfiles_1, output_1, actions_3, terminal_1, taskSystem_1, tasks_1, taskService_1, taskTemplates_1, TaskConfig, processTaskSystem_1, terminalTaskSystem_1, processRunnerDetector_1, quickOpen_2, environment_1, theme_1, themeService_1, actions_4, jsonSchema_v1_1, jsonSchema_v2_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var $ = Builder.$;
    var tasksCategory = nls.localize('tasksCategory', "Tasks");
    var OpenTaskConfigurationAction = (function (_super) {
        __extends(OpenTaskConfigurationAction, _super);
        function OpenTaskConfigurationAction(id, label, taskService, configurationService, editorService, fileService, contextService, outputService, messageService, quickOpenService, environmentService, configurationResolverService, extensionService, telemetryService) {
            var _this = _super.call(this, id, label) || this;
            _this.taskService = taskService;
            _this.configurationService = configurationService;
            _this.editorService = editorService;
            _this.fileService = fileService;
            _this.contextService = contextService;
            _this.outputService = outputService;
            _this.messageService = messageService;
            _this.quickOpenService = quickOpenService;
            _this.environmentService = environmentService;
            _this.configurationResolverService = configurationResolverService;
            _this.extensionService = extensionService;
            _this.telemetryService = telemetryService;
            return _this;
        }
        OpenTaskConfigurationAction.prototype.run = function (event) {
            var _this = this;
            if (!this.contextService.hasWorkspace()) {
                this.messageService.show(severity_1.default.Info, nls.localize('ConfigureTaskRunnerAction.noWorkspace', 'Tasks are only available on a workspace folder.'));
                return winjs_base_1.TPromise.as(undefined);
            }
            var sideBySide = !!(event && (event.ctrlKey || event.metaKey));
            var configFileCreated = false;
            return this.fileService.resolveFile(this.contextService.toResource('.vscode/tasks.json')).then(function (success) {
                return success;
            }, function (err) {
                return _this.quickOpenService.pick(taskTemplates_1.templates, { placeHolder: nls.localize('ConfigureTaskRunnerAction.quickPick.template', 'Select a Task Runner') }).then(function (selection) {
                    if (!selection) {
                        return undefined;
                    }
                    var contentPromise;
                    if (selection.autoDetect) {
                        var outputChannel_1 = _this.outputService.getChannel(TaskService.OutputChannelId);
                        outputChannel_1.show(true);
                        outputChannel_1.append(nls.localize('ConfigureTaskRunnerAction.autoDetecting', 'Auto detecting tasks for {0}', selection.id) + '\n');
                        var detector = new processRunnerDetector_1.ProcessRunnerDetector(_this.fileService, _this.contextService, _this.configurationResolverService);
                        contentPromise = detector.detect(false, selection.id).then(function (value) {
                            var config = value.config;
                            if (value.stderr && value.stderr.length > 0) {
                                value.stderr.forEach(function (line) {
                                    outputChannel_1.append(line + '\n');
                                });
                                if (config && (!config.tasks || config.tasks.length === 0)) {
                                    _this.messageService.show(severity_1.default.Warning, nls.localize('ConfigureTaskRunnerAction.autoDetect', 'Auto detecting the task system failed. Using default template. Consult the task output for details.'));
                                    return selection.content;
                                }
                                else {
                                    _this.messageService.show(severity_1.default.Warning, nls.localize('ConfigureTaskRunnerAction.autoDetectError', 'Auto detecting the task system produced errors. Consult the task output for details.'));
                                }
                            }
                            if (config) {
                                if (value.stdout && value.stdout.length > 0) {
                                    value.stdout.forEach(function (line) { return outputChannel_1.append(line + '\n'); });
                                }
                                var content = JSON.stringify(config, null, '\t');
                                content = [
                                    '{',
                                    '\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
                                    '\t// for the documentation about the tasks.json format',
                                ].join('\n') + content.substr(1);
                                return content;
                            }
                            else {
                                return selection.content;
                            }
                        });
                    }
                    else {
                        contentPromise = winjs_base_1.TPromise.as(selection.content);
                    }
                    return contentPromise.then(function (content) {
                        var editorConfig = _this.configurationService.getConfiguration();
                        if (editorConfig.editor.insertSpaces) {
                            content = content.replace(/(\n)(\t+)/g, function (_, s1, s2) { return s1 + strings.repeat(' ', s2.length * editorConfig.editor.tabSize); });
                        }
                        configFileCreated = true;
                        return _this.fileService.createFile(_this.contextService.toResource('.vscode/tasks.json'), content).then(function (result) {
                            _this.telemetryService.publicLog(TaskService.TemplateTelemetryEventName, {
                                templateId: selection.id,
                                autoDetect: selection.autoDetect
                            });
                            return result;
                        }); // TODO@Dirk (https://github.com/Microsoft/vscode/issues/29454)
                    });
                    /* 2.0 version
                    let content = selection.content;
                    let editorConfig = this.configurationService.getConfiguration<any>();
                    if (editorConfig.editor.insertSpaces) {
                        content = content.replace(/(\n)(\t+)/g, (_, s1, s2) => s1 + strings.repeat(' ', s2.length * editorConfig.editor.tabSize));
                    }
                    configFileCreated = true;
                    return this.fileService.createFile(this.contextService.toResource('.vscode/tasks.json'), content);
                    */
                });
            }).then(function (stat) {
                if (!stat) {
                    return undefined;
                }
                // // (2) Open editor with configuration file
                return _this.editorService.openEditor({
                    resource: stat.resource,
                    options: {
                        forceOpen: true,
                        pinned: configFileCreated // pin only if config file is created #8727
                    }
                }, sideBySide);
            }, function (error) {
                throw new Error(nls.localize('ConfigureTaskRunnerAction.failed', "Unable to create the 'tasks.json' file inside the '.vscode' folder. Consult the task output for details."));
            });
        };
        return OpenTaskConfigurationAction;
    }(actions_1.Action));
    var ConfigureTaskRunnerAction = (function (_super) {
        __extends(ConfigureTaskRunnerAction, _super);
        function ConfigureTaskRunnerAction(id, label, taskService, configurationService, editorService, fileService, contextService, outputService, messageService, quickOpenService, environmentService, configurationResolverService, extensionService, telemetryService) {
            return _super.call(this, id, label, taskService, configurationService, editorService, fileService, contextService, outputService, messageService, quickOpenService, environmentService, configurationResolverService, extensionService, telemetryService) || this;
        }
        ConfigureTaskRunnerAction.ID = 'workbench.action.tasks.configureTaskRunner';
        ConfigureTaskRunnerAction.TEXT = nls.localize('ConfigureTaskRunnerAction.label', "Configure Task Runner");
        ConfigureTaskRunnerAction = __decorate([
            __param(2, taskService_1.ITaskService), __param(3, configuration_1.IConfigurationService),
            __param(4, editorService_1.IWorkbenchEditorService), __param(5, files_1.IFileService),
            __param(6, workspace_1.IWorkspaceContextService), __param(7, output_1.IOutputService),
            __param(8, message_1.IMessageService), __param(9, quickOpen_1.IQuickOpenService),
            __param(10, environment_1.IEnvironmentService),
            __param(11, configurationResolver_1.IConfigurationResolverService),
            __param(12, extensions_2.IExtensionService),
            __param(13, telemetry_1.ITelemetryService)
        ], ConfigureTaskRunnerAction);
        return ConfigureTaskRunnerAction;
    }(OpenTaskConfigurationAction));
    var ConfigureBuildTaskAction = (function (_super) {
        __extends(ConfigureBuildTaskAction, _super);
        function ConfigureBuildTaskAction(id, label, taskService, configurationService, editorService, fileService, contextService, outputService, messageService, quickOpenService, environmentService, configurationResolverService, extensionService, telemetryService) {
            return _super.call(this, id, label, taskService, configurationService, editorService, fileService, contextService, outputService, messageService, quickOpenService, environmentService, configurationResolverService, extensionService, telemetryService) || this;
        }
        ConfigureBuildTaskAction.ID = 'workbench.action.tasks.configureBuildTask';
        ConfigureBuildTaskAction.TEXT = nls.localize('ConfigureBuildTaskAction.label', "Configure Build Task");
        ConfigureBuildTaskAction = __decorate([
            __param(2, taskService_1.ITaskService), __param(3, configuration_1.IConfigurationService),
            __param(4, editorService_1.IWorkbenchEditorService), __param(5, files_1.IFileService),
            __param(6, workspace_1.IWorkspaceContextService), __param(7, output_1.IOutputService),
            __param(8, message_1.IMessageService), __param(9, quickOpen_1.IQuickOpenService),
            __param(10, environment_1.IEnvironmentService),
            __param(11, configurationResolver_1.IConfigurationResolverService),
            __param(12, extensions_2.IExtensionService),
            __param(13, telemetry_1.ITelemetryService)
        ], ConfigureBuildTaskAction);
        return ConfigureBuildTaskAction;
    }(OpenTaskConfigurationAction));
    var CloseMessageAction = (function (_super) {
        __extends(CloseMessageAction, _super);
        function CloseMessageAction() {
            return _super.call(this, CloseMessageAction.ID, CloseMessageAction.TEXT) || this;
        }
        CloseMessageAction.prototype.run = function () {
            if (this.closeFunction) {
                this.closeFunction();
            }
            return winjs_base_1.TPromise.as(undefined);
        };
        CloseMessageAction.ID = 'workbench.action.build.closeMessage';
        CloseMessageAction.TEXT = nls.localize('CloseMessageAction.label', 'Close');
        return CloseMessageAction;
    }(actions_1.Action));
    var ViewTerminalAction = (function (_super) {
        __extends(ViewTerminalAction, _super);
        function ViewTerminalAction(terminalService) {
            var _this = _super.call(this, ViewTerminalAction.ID, ViewTerminalAction.TEXT) || this;
            _this.terminalService = terminalService;
            return _this;
        }
        ViewTerminalAction.prototype.run = function () {
            this.terminalService.showPanel();
            return winjs_base_1.TPromise.as(undefined);
        };
        ViewTerminalAction.ID = 'workbench.action.build.viewTerminal';
        ViewTerminalAction.TEXT = nls.localize('ShowTerminalAction.label', 'View Terminal');
        ViewTerminalAction = __decorate([
            __param(0, terminal_1.ITerminalService)
        ], ViewTerminalAction);
        return ViewTerminalAction;
    }(actions_1.Action));
    var BuildStatusBarItem = (function (_super) {
        __extends(BuildStatusBarItem, _super);
        function BuildStatusBarItem(panelService, markerService, outputService, taskService, partService, themeService, contextService) {
            var _this = _super.call(this, themeService) || this;
            _this.panelService = panelService;
            _this.markerService = markerService;
            _this.outputService = outputService;
            _this.taskService = taskService;
            _this.partService = partService;
            _this.contextService = contextService;
            _this.activeCount = 0;
            _this.icons = [];
            _this.registerListeners();
            return _this;
        }
        BuildStatusBarItem.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.contextService.onDidChangeWorkspaceRoots(function () { return _this.updateStyles(); }));
        };
        BuildStatusBarItem.prototype.updateStyles = function () {
            var _this = this;
            _super.prototype.updateStyles.call(this);
            this.icons.forEach(function (icon) {
                icon.style.backgroundColor = _this.getColor(_this.contextService.hasWorkspace() ? theme_1.STATUS_BAR_FOREGROUND : theme_1.STATUS_BAR_NO_FOLDER_FOREGROUND);
            });
        };
        BuildStatusBarItem.prototype.render = function (container) {
            var _this = this;
            var callOnDispose = [];
            var element = document.createElement('div');
            var progress = document.createElement('div');
            var label = document.createElement('a');
            var errorIcon = document.createElement('div');
            var warningIcon = document.createElement('div');
            var infoIcon = document.createElement('div');
            var error = document.createElement('div');
            var warning = document.createElement('div');
            var info = document.createElement('div');
            Dom.addClass(element, 'task-statusbar-item');
            Dom.addClass(progress, 'task-statusbar-item-progress');
            element.appendChild(progress);
            progress.innerHTML = BuildStatusBarItem.progressChars[0];
            $(progress).hide();
            Dom.addClass(label, 'task-statusbar-item-label');
            element.appendChild(label);
            element.title = nls.localize('problems', "Problems");
            Dom.addClass(errorIcon, 'task-statusbar-item-label-error');
            Dom.addClass(errorIcon, 'mask-icon');
            label.appendChild(errorIcon);
            this.icons.push(errorIcon);
            Dom.addClass(error, 'task-statusbar-item-label-counter');
            error.innerHTML = '0';
            label.appendChild(error);
            Dom.addClass(warningIcon, 'task-statusbar-item-label-warning');
            Dom.addClass(warningIcon, 'mask-icon');
            label.appendChild(warningIcon);
            this.icons.push(warningIcon);
            Dom.addClass(warning, 'task-statusbar-item-label-counter');
            warning.innerHTML = '0';
            label.appendChild(warning);
            Dom.addClass(infoIcon, 'task-statusbar-item-label-info');
            Dom.addClass(infoIcon, 'mask-icon');
            label.appendChild(infoIcon);
            this.icons.push(infoIcon);
            $(infoIcon).hide();
            Dom.addClass(info, 'task-statusbar-item-label-counter');
            label.appendChild(info);
            $(info).hide();
            callOnDispose.push(Dom.addDisposableListener(label, 'click', function (e) {
                var panel = _this.panelService.getActivePanel();
                if (panel && panel.getId() === constants_1.default.MARKERS_PANEL_ID) {
                    _this.partService.setPanelHidden(true);
                }
                else {
                    _this.panelService.openPanel(constants_1.default.MARKERS_PANEL_ID, true);
                }
            }));
            var updateStatus = function (element, icon, stats) {
                if (stats > 0) {
                    element.innerHTML = stats.toString();
                    $(element).show();
                    $(icon).show();
                    return true;
                }
                else {
                    $(element).hide();
                    $(icon).hide();
                    return false;
                }
            };
            var manyMarkers = nls.localize('manyMarkers', "99+");
            var updateLabel = function (stats) {
                error.innerHTML = stats.errors < 100 ? stats.errors.toString() : manyMarkers;
                warning.innerHTML = stats.warnings < 100 ? stats.warnings.toString() : manyMarkers;
                updateStatus(info, infoIcon, stats.infos);
            };
            this.markerService.onMarkerChanged(function (changedResources) {
                updateLabel(_this.markerService.getStatistics());
            });
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Active, function (event) {
                if (_this.ignoreEvent(event)) {
                    return;
                }
                _this.activeCount++;
                if (_this.activeCount === 1) {
                    var index_1 = 1;
                    var chars_1 = BuildStatusBarItem.progressChars;
                    progress.innerHTML = chars_1[0];
                    _this.intervalToken = setInterval(function () {
                        progress.innerHTML = chars_1[index_1];
                        index_1++;
                        if (index_1 >= chars_1.length) {
                            index_1 = 0;
                        }
                    }, 50);
                    $(progress).show();
                }
            }));
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Inactive, function (event) {
                if (_this.ignoreEvent(event)) {
                    return;
                }
                // Since the exiting of the sub process is communicated async we can't order inactive and terminate events.
                // So try to treat them accordingly.
                if (_this.activeCount > 0) {
                    _this.activeCount--;
                    if (_this.activeCount === 0) {
                        $(progress).hide();
                        if (_this.intervalToken) {
                            clearInterval(_this.intervalToken);
                            _this.intervalToken = null;
                        }
                    }
                }
            }));
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Terminated, function (event) {
                if (_this.ignoreEvent(event)) {
                    return;
                }
                if (_this.activeCount !== 0) {
                    $(progress).hide();
                    if (_this.intervalToken) {
                        clearInterval(_this.intervalToken);
                        _this.intervalToken = null;
                    }
                    _this.activeCount = 0;
                }
            }));
            container.appendChild(element);
            this.updateStyles();
            return {
                dispose: function () {
                    callOnDispose = lifecycle_1.dispose(callOnDispose);
                }
            };
        };
        BuildStatusBarItem.prototype.ignoreEvent = function (event) {
            if (!this.taskService.inTerminal()) {
                return false;
            }
            if (event.group !== tasks_1.TaskGroup.Build) {
                return true;
            }
            if (!event.__task) {
                return false;
            }
            return event.__task.problemMatchers === void 0 || event.__task.problemMatchers.length === 0;
        };
        BuildStatusBarItem.progressChars = '|/-\\';
        BuildStatusBarItem = __decorate([
            __param(0, panelService_1.IPanelService),
            __param(1, markers_1.IMarkerService),
            __param(2, output_1.IOutputService),
            __param(3, taskService_1.ITaskService),
            __param(4, partService_1.IPartService),
            __param(5, themeService_1.IThemeService),
            __param(6, workspace_1.IWorkspaceContextService)
        ], BuildStatusBarItem);
        return BuildStatusBarItem;
    }(theme_1.Themable));
    var TaskStatusBarItem = (function (_super) {
        __extends(TaskStatusBarItem, _super);
        function TaskStatusBarItem(panelService, markerService, outputService, taskService, partService, themeService, contextService) {
            var _this = _super.call(this, themeService) || this;
            _this.panelService = panelService;
            _this.markerService = markerService;
            _this.outputService = outputService;
            _this.taskService = taskService;
            _this.partService = partService;
            _this.contextService = contextService;
            return _this;
        }
        TaskStatusBarItem.prototype.updateStyles = function () {
            _super.prototype.updateStyles.call(this);
        };
        TaskStatusBarItem.prototype.render = function (container) {
            var _this = this;
            var callOnDispose = [];
            var element = document.createElement('a');
            Dom.addClass(element, 'task-statusbar-runningItem');
            var labelElement = document.createElement('div');
            Dom.addClass(labelElement, 'task-statusbar-runningItem-label');
            element.appendChild(labelElement);
            var label = new octiconLabel_1.OcticonLabel(labelElement);
            label.title = nls.localize('runningTasks', "Show Running Tasks");
            $(element).hide();
            callOnDispose.push(Dom.addDisposableListener(labelElement, 'click', function (e) {
                _this.taskService.runShowTasks();
            }));
            var updateStatus = function () {
                _this.taskService.getActiveTasks().then(function (tasks) {
                    if (tasks.length === 0) {
                        $(element).hide();
                    }
                    else {
                        label.text = "$(tools) " + tasks.length;
                        $(element).show();
                    }
                });
            };
            callOnDispose.push(this.taskService.addListener(taskService_1.TaskServiceEvents.Changed, function (event) {
                updateStatus();
            }));
            container.appendChild(element);
            this.updateStyles();
            updateStatus();
            return {
                dispose: function () {
                    callOnDispose = lifecycle_1.dispose(callOnDispose);
                }
            };
        };
        TaskStatusBarItem = __decorate([
            __param(0, panelService_1.IPanelService),
            __param(1, markers_1.IMarkerService),
            __param(2, output_1.IOutputService),
            __param(3, taskService_1.ITaskService),
            __param(4, partService_1.IPartService),
            __param(5, themeService_1.IThemeService),
            __param(6, workspace_1.IWorkspaceContextService)
        ], TaskStatusBarItem);
        return TaskStatusBarItem;
    }(theme_1.Themable));
    var NullTaskSystem = (function (_super) {
        __extends(NullTaskSystem, _super);
        function NullTaskSystem() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NullTaskSystem.prototype.run = function (task) {
            return {
                kind: taskSystem_1.TaskExecuteKind.Started,
                promise: winjs_base_1.TPromise.as({})
            };
        };
        NullTaskSystem.prototype.revealTask = function (task) {
            return false;
        };
        NullTaskSystem.prototype.isActive = function () {
            return winjs_base_1.TPromise.as(false);
        };
        NullTaskSystem.prototype.isActiveSync = function () {
            return false;
        };
        NullTaskSystem.prototype.getActiveTasks = function () {
            return [];
        };
        NullTaskSystem.prototype.canAutoTerminate = function () {
            return true;
        };
        NullTaskSystem.prototype.terminate = function (task) {
            return winjs_base_1.TPromise.as({ success: true, task: undefined });
        };
        NullTaskSystem.prototype.terminateAll = function () {
            return winjs_base_1.TPromise.as([]);
        };
        return NullTaskSystem;
    }(eventEmitter_1.EventEmitter));
    var ProblemReporter = (function () {
        function ProblemReporter(_outputChannel) {
            this._outputChannel = _outputChannel;
            this._validationStatus = new parsers_1.ValidationStatus();
        }
        ProblemReporter.prototype.info = function (message) {
            this._validationStatus.state = parsers_1.ValidationState.Info;
            this._outputChannel.append(message + '\n');
        };
        ProblemReporter.prototype.warn = function (message) {
            this._validationStatus.state = parsers_1.ValidationState.Warning;
            this._outputChannel.append(message + '\n');
        };
        ProblemReporter.prototype.error = function (message) {
            this._validationStatus.state = parsers_1.ValidationState.Error;
            this._outputChannel.append(message + '\n');
        };
        ProblemReporter.prototype.fatal = function (message) {
            this._validationStatus.state = parsers_1.ValidationState.Fatal;
            this._outputChannel.append(message + '\n');
        };
        Object.defineProperty(ProblemReporter.prototype, "status", {
            get: function () {
                return this._validationStatus;
            },
            enumerable: true,
            configurable: true
        });
        ProblemReporter.prototype.clearOutput = function () {
            this._outputChannel.clear();
        };
        return ProblemReporter;
    }());
    var TaskService = (function (_super) {
        __extends(TaskService, _super);
        function TaskService(modeService, configurationService, configurationEditingService, markerService, outputService, messageService, editorService, fileService, contextService, telemetryService, textFileService, lifecycleService, modelService, extensionService, quickOpenService, environmentService, configurationResolverService, terminalService, workbenchEditorService, storageService, progressService, openerService, _windowServive) {
            var _this = _super.call(this) || this;
            _this.environmentService = environmentService;
            _this.configurationResolverService = configurationResolverService;
            _this.terminalService = terminalService;
            _this.workbenchEditorService = workbenchEditorService;
            _this.storageService = storageService;
            _this.progressService = progressService;
            _this.openerService = openerService;
            _this._windowServive = _windowServive;
            _this.modeService = modeService;
            _this.configurationService = configurationService;
            _this.configurationEditingService = configurationEditingService;
            _this.markerService = markerService;
            _this.outputService = outputService;
            _this.messageService = messageService;
            _this.editorService = editorService;
            _this.fileService = fileService;
            _this.contextService = contextService;
            _this.telemetryService = telemetryService;
            _this.textFileService = textFileService;
            _this.modelService = modelService;
            _this.extensionService = extensionService;
            _this.quickOpenService = quickOpenService;
            _this._configHasErrors = false;
            _this._workspaceTasksPromise = undefined;
            _this._taskSystemListeners = [];
            _this._outputChannel = _this.outputService.getChannel(TaskService.OutputChannelId);
            _this._providers = new Map();
            _this.configurationService.onDidUpdateConfiguration(function () {
                if (!_this._taskSystem && !_this._workspaceTasksPromise) {
                    return;
                }
                _this.updateWorkspaceTasks();
                if (!_this._taskSystem) {
                    return;
                }
                var currentExecutionEngine = _this._taskSystem instanceof terminalTaskSystem_1.TerminalTaskSystem
                    ? tasks_1.ExecutionEngine.Terminal
                    : _this._taskSystem instanceof processTaskSystem_1.ProcessTaskSystem
                        ? tasks_1.ExecutionEngine.Process
                        : tasks_1.ExecutionEngine._default;
                if (currentExecutionEngine !== _this.getExecutionEngine()) {
                    _this.messageService.show(severity_1.default.Info, {
                        message: nls.localize('TaskSystem.noHotSwap', 'Changing the task execution engine requires to reload the Window'),
                        actions: [
                            new actions_4.ReloadWindowAction(actions_4.ReloadWindowAction.ID, actions_4.ReloadWindowAction.LABEL, _this._windowServive),
                            new CloseMessageAction()
                        ]
                    });
                }
            });
            lifecycleService.onWillShutdown(function (event) { return event.veto(_this.beforeShutdown()); });
            _this.registerCommands();
            return _this;
        }
        TaskService.prototype.registerCommands = function () {
            var _this = this;
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.runTask', function (accessor, arg) {
                _this.runTaskCommand(accessor, arg);
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.restartTask', function (accessor, arg) {
                _this.runRestartTaskCommand(accessor, arg);
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.terminate', function (accessor, arg) {
                _this.runTerminateCommand();
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.showLog', function () {
                if (!_this.canRunCommand()) {
                    return;
                }
                _this.showOutput();
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.build', function () {
                if (!_this.canRunCommand()) {
                    return;
                }
                _this.runBuildCommand();
            });
            keybindingsRegistry_1.KeybindingsRegistry.registerKeybindingRule({
                id: 'workbench.action.tasks.build',
                weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(),
                when: undefined,
                primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 32 /* KEY_B */
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.test', function () {
                if (!_this.canRunCommand()) {
                    return;
                }
                _this.runTestCommand();
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.configureDefaultBuildTask', function () {
                _this.runConfigureDefaultBuildTask();
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.configureDefaultTestTask', function () {
                _this.runConfigureDefaultTestTask();
            });
            commands_1.CommandsRegistry.registerCommand('workbench.action.tasks.showTasks', function () {
                _this.runShowTasks();
            });
        };
        TaskService.prototype.showOutput = function () {
            this._outputChannel.show(true);
        };
        TaskService.prototype.disposeTaskSystemListeners = function () {
            this._taskSystemListeners = lifecycle_1.dispose(this._taskSystemListeners);
        };
        TaskService.prototype.registerTaskProvider = function (handle, provider) {
            if (!provider) {
                return;
            }
            this._providers.set(handle, provider);
        };
        TaskService.prototype.unregisterTaskProvider = function (handle) {
            return this._providers.delete(handle);
        };
        TaskService.prototype.getTask = function (identifier) {
            var _this = this;
            return this.getTaskSets().then(function (sets) {
                var resolver = _this.createResolver(sets);
                return resolver.resolve(identifier);
            });
        };
        TaskService.prototype.tasks = function () {
            return this.getTaskSets().then(function (sets) {
                var result = [];
                for (var _i = 0, sets_1 = sets; _i < sets_1.length; _i++) {
                    var set = sets_1[_i];
                    result.push.apply(result, set.tasks);
                }
                return result;
            });
        };
        ;
        TaskService.prototype.isActive = function () {
            if (!this._taskSystem) {
                return winjs_base_1.TPromise.as(false);
            }
            return this._taskSystem.isActive();
        };
        TaskService.prototype.getActiveTasks = function () {
            if (!this._taskSystem) {
                return winjs_base_1.TPromise.as([]);
            }
            return winjs_base_1.TPromise.as(this._taskSystem.getActiveTasks());
        };
        TaskService.prototype.getRecentlyUsedTasks = function () {
            if (this._recentlyUsedTasks) {
                return this._recentlyUsedTasks;
            }
            this._recentlyUsedTasks = new map_1.LinkedMap();
            var storageValue = this.storageService.get(TaskService.RecentlyUsedTasks_Key, storage_1.StorageScope.WORKSPACE);
            if (storageValue) {
                try {
                    var values = JSON.parse(storageValue);
                    if (Array.isArray(values)) {
                        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                            var value = values_1[_i];
                            this._recentlyUsedTasks.set(value, value);
                        }
                    }
                }
                catch (error) {
                    // Ignore. We use the empty result
                }
            }
            return this._recentlyUsedTasks;
        };
        TaskService.prototype.saveRecentlyUsedTasks = function () {
            if (!this._recentlyUsedTasks) {
                return;
            }
            var values = this._recentlyUsedTasks.values();
            if (values.length > 30) {
                values = values.slice(0, 30);
            }
            this.storageService.store(TaskService.RecentlyUsedTasks_Key, JSON.stringify(values), storage_1.StorageScope.WORKSPACE);
        };
        TaskService.prototype.openDocumentation = function () {
            this.openerService.open(uri_1.default.parse('https://go.microsoft.com/fwlink/?LinkId=733558'));
        };
        TaskService.prototype.build = function () {
            var _this = this;
            return this.getTaskSets().then(function (values) {
                var runnable = _this.createRunnableTask(values, tasks_1.TaskGroup.Build);
                if (!runnable || !runnable.task) {
                    if (_this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V0_1_0) {
                        throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskService.noBuildTask1', 'No build task defined. Mark a task with \'isBuildCommand\' in the tasks.json file.'), taskSystem_1.TaskErrors.NoBuildTask);
                    }
                    else {
                        throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskService.noBuildTask2', 'No build task defined. Mark a task with as a \'build\' group in the tasks.json file.'), taskSystem_1.TaskErrors.NoBuildTask);
                    }
                }
                return _this.executeTask(runnable.task, runnable.resolver);
            }).then(function (value) { return value; }, function (error) {
                _this.handleError(error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        TaskService.prototype.rebuild = function () {
            return winjs_base_1.TPromise.wrapError(new Error('Not implemented'));
        };
        TaskService.prototype.clean = function () {
            return winjs_base_1.TPromise.wrapError(new Error('Not implemented'));
        };
        TaskService.prototype.runTest = function () {
            var _this = this;
            return this.getTaskSets().then(function (values) {
                var runnable = _this.createRunnableTask(values, tasks_1.TaskGroup.Test);
                if (!runnable || !runnable.task) {
                    if (_this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V0_1_0) {
                        throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskService.noTestTask1', 'No test task defined. Mark a task with \'isTestCommand\' in the tasks.json file.'), taskSystem_1.TaskErrors.NoTestTask);
                    }
                    else {
                        throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskService.noTestTask2', 'No test task defined. Mark a task with as a \'test\' group in the tasks.json file.'), taskSystem_1.TaskErrors.NoTestTask);
                    }
                }
                return _this.executeTask(runnable.task, runnable.resolver);
            }).then(function (value) { return value; }, function (error) {
                _this.handleError(error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        TaskService.prototype.run = function (task, options) {
            var _this = this;
            return this.getTaskSets().then(function (values) {
                var resolver = _this.createResolver(values);
                var requested;
                var toExecute;
                if (Types.isString(task)) {
                    requested = task;
                    toExecute = resolver.resolve(task);
                }
                else {
                    requested = task.name;
                    toExecute = task;
                }
                if (!toExecute) {
                    throw new taskSystem_1.TaskError(severity_1.default.Info, nls.localize('TaskServer.noTask', 'Requested task {0} to execute not found.', requested), taskSystem_1.TaskErrors.TaskNotFound);
                }
                else {
                    if (options && options.attachProblemMatcher && _this.shouldAttachProblemMatcher(toExecute) && !tasks_1.CompositeTask.is(toExecute)) {
                        return _this.attachProblemMatcher(toExecute).then(function (toExecute) {
                            if (toExecute) {
                                return _this.executeTask(toExecute, resolver);
                            }
                            else {
                                return winjs_base_1.TPromise.as(undefined);
                            }
                        });
                    }
                    return _this.executeTask(toExecute, resolver);
                }
            }).then(function (value) { return value; }, function (error) {
                _this.handleError(error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        TaskService.prototype.shouldAttachProblemMatcher = function (task) {
            if (!this.canCustomize()) {
                return false;
            }
            if (task.group !== void 0 && task.group !== tasks_1.TaskGroup.Build) {
                return false;
            }
            if (task.problemMatchers !== void 0 && task.problemMatchers.length > 0) {
                return false;
            }
            if (tasks_1.ContributedTask.is(task)) {
                return !task.hasDefinedMatchers && task.problemMatchers.length === 0;
            }
            if (tasks_1.CustomTask.is(task)) {
                var configProperties = task._source.config.element;
                return configProperties.problemMatcher === void 0;
            }
            return false;
        };
        TaskService.prototype.attachProblemMatcher = function (task) {
            var _this = this;
            var entries = [];
            for (var _i = 0, _a = problemMatcher_1.ProblemMatcherRegistry.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                var matcher = problemMatcher_1.ProblemMatcherRegistry.get(key);
                if (matcher.deprecated) {
                    continue;
                }
                if (matcher.name === matcher.label) {
                    entries.push({ label: matcher.name, matcher: matcher });
                }
                else {
                    entries.push({
                        label: matcher.label,
                        description: "$" + matcher.name,
                        matcher: matcher
                    });
                }
            }
            if (entries.length > 0) {
                entries = entries.sort(function (a, b) { return a.label.localeCompare(b.label); });
                entries[0].separator = { border: true };
                entries.unshift({ label: nls.localize('TaskService.attachProblemMatcher.continueWithout', 'Continue without scanning the task output'), matcher: undefined }, { label: nls.localize('TaskService.attachProblemMatcher.never', 'Never scan the task output'), matcher: undefined, never: true }, { label: nls.localize('TaskService.attachProblemMatcher.learnMoreAbout', 'Learn more about scanning the task output'), matcher: undefined, learnMore: true });
                return this.quickOpenService.pick(entries, {
                    placeHolder: nls.localize('selectProblemMatcher', 'Select for which kind of errors and warnings to scan the task output'),
                    autoFocus: { autoFocusFirstEntry: true }
                }).then(function (selected) {
                    if (selected) {
                        if (selected.learnMore) {
                            _this.openDocumentation();
                            return undefined;
                        }
                        else if (selected.never) {
                            _this.customize(task, { problemMatcher: [] }, true);
                            return task;
                        }
                        else if (selected.matcher) {
                            var newTask = Objects.deepClone(task);
                            var matcherReference = "$" + selected.matcher.name;
                            newTask.problemMatchers = [matcherReference];
                            _this.customize(task, { problemMatcher: [matcherReference] }, true);
                            return newTask;
                        }
                        else {
                            return task;
                        }
                    }
                    else {
                        return undefined;
                    }
                });
            }
            return winjs_base_1.TPromise.as(task);
        };
        TaskService.prototype.getTasksForGroup = function (group) {
            return this.getTaskSets().then(function (values) {
                var result = [];
                for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                    var value = values_2[_i];
                    for (var _a = 0, _b = value.tasks; _a < _b.length; _a++) {
                        var task = _b[_a];
                        if (task.group === group) {
                            result.push(task);
                        }
                    }
                }
                return result;
            });
        };
        TaskService.prototype.canCustomize = function () {
            return this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V2_0_0;
        };
        TaskService.prototype.customize = function (task, properties, openConfig) {
            var _this = this;
            var configuration = this.getConfiguration();
            if (configuration.hasParseErrors) {
                this.messageService.show(severity_1.default.Warning, nls.localize('customizeParseErrors', 'The current task configuration has errors. Please fix the errors first before customizing a task.'));
                return winjs_base_1.TPromise.as(undefined);
            }
            var fileConfig = configuration.config;
            var index;
            var toCustomize;
            var taskConfig = tasks_1.CustomTask.is(task) ? task._source.config : undefined;
            if (taskConfig && taskConfig.element) {
                index = taskConfig.index;
                toCustomize = taskConfig.element;
            }
            else if (tasks_1.ContributedTask.is(task)) {
                toCustomize = {};
                var identifier_1 = Objects.assign(Object.create(null), task.defines);
                delete identifier_1['_key'];
                Object.keys(identifier_1).forEach(function (key) { return toCustomize[key] = identifier_1[key]; });
                if (task.problemMatchers && task.problemMatchers.length > 0 && Types.isStringArray(task.problemMatchers)) {
                    toCustomize.problemMatcher = task.problemMatchers;
                }
            }
            if (!toCustomize) {
                return winjs_base_1.TPromise.as(undefined);
            }
            if (properties) {
                for (var _i = 0, _a = Object.getOwnPropertyNames(properties); _i < _a.length; _i++) {
                    var property = _a[_i];
                    var value = properties[property];
                    if (value !== void 0 && value !== null) {
                        toCustomize[property] = value;
                    }
                }
            }
            else {
                if (toCustomize.problemMatcher === void 0 && task.problemMatchers === void 0 || task.problemMatchers.length === 0) {
                    toCustomize.problemMatcher = [];
                }
            }
            var promise;
            if (!fileConfig) {
                var value = {
                    version: '2.0.0',
                    tasks: [toCustomize]
                };
                var content = [
                    '{',
                    '\t// See https://go.microsoft.com/fwlink/?LinkId=733558',
                    '\t// for the documentation about the tasks.json format',
                ].join('\n') + JSON.stringify(value, null, '\t').substr(1);
                var editorConfig_1 = this.configurationService.getConfiguration();
                if (editorConfig_1.editor.insertSpaces) {
                    content = content.replace(/(\n)(\t+)/g, function (_, s1, s2) { return s1 + strings.repeat(' ', s2.length * editorConfig_1.editor.tabSize); });
                }
                promise = this.fileService.createFile(this.contextService.toResource('.vscode/tasks.json'), content).then(function () { }); // TODO@Dirk (https://github.com/Microsoft/vscode/issues/29454)
            }
            else {
                var value = { key: undefined, value: undefined };
                // We have a global task configuration
                if (index === -1) {
                    if (properties.problemMatcher !== void 0) {
                        fileConfig.problemMatcher = properties.problemMatcher;
                        value.key = 'tasks.problemMatchers';
                        value.value = fileConfig.problemMatcher;
                        promise = this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, value);
                    }
                    else if (properties.group !== void 0) {
                        fileConfig.group = properties.group;
                        value.key = 'tasks.group';
                        value.value = fileConfig.group;
                        promise = this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, value);
                    }
                }
                else {
                    if (!Array.isArray(fileConfig.tasks)) {
                        fileConfig.tasks = [];
                    }
                    value.key = 'tasks.tasks';
                    value.value = fileConfig.tasks;
                    if (index === void 0) {
                        fileConfig.tasks.push(toCustomize);
                    }
                    else {
                        fileConfig.tasks[index] = toCustomize;
                    }
                    promise = this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, value);
                }
            }
            ;
            if (!promise) {
                return winjs_base_1.TPromise.as(undefined);
            }
            return promise.then(function () {
                var event = {
                    properties: properties ? Object.getOwnPropertyNames(properties) : []
                };
                _this.telemetryService.publicLog(TaskService.CustomizationTelemetryEventName, event);
                if (openConfig) {
                    var resource = _this.contextService.toResource('.vscode/tasks.json'); // TODO@Dirk (https://github.com/Microsoft/vscode/issues/29454)
                    _this.editorService.openEditor({
                        resource: resource,
                        options: {
                            forceOpen: true,
                            pinned: false
                        }
                    }, false);
                }
            });
        };
        TaskService.prototype.openConfig = function (task) {
            var resource = this.contextService.toResource(task._source.config.file);
            return this.editorService.openEditor({
                resource: resource,
                options: {
                    forceOpen: true,
                    pinned: false
                }
            }, false).then(function () { return undefined; });
        };
        TaskService.prototype.createRunnableTask = function (sets, group) {
            var idMap = Object.create(null);
            var labelMap = Object.create(null);
            var identifierMap = Object.create(null);
            var workspaceTasks = [];
            var extensionTasks = [];
            sets.forEach(function (set) {
                set.tasks.forEach(function (task) {
                    idMap[task._id] = task;
                    labelMap[task._label] = task;
                    identifierMap[task.identifier] = task;
                    if (group && task.group === group) {
                        if (task._source.kind === tasks_1.TaskSourceKind.Workspace) {
                            workspaceTasks.push(task);
                        }
                        else {
                            extensionTasks.push(task);
                        }
                    }
                });
            });
            var resolver = {
                resolve: function (id) {
                    return idMap[id] || labelMap[id] || identifierMap[id];
                }
            };
            if (workspaceTasks.length > 0) {
                if (workspaceTasks.length > 1) {
                    this._outputChannel.append(nls.localize('moreThanOneBuildTask', 'There are many build tasks defined in the tasks.json. Executing the first one.\n'));
                }
                return { task: workspaceTasks[0], resolver: resolver };
            }
            if (extensionTasks.length === 0) {
                return undefined;
            }
            // We can only have extension tasks if we are in version 2.0.0. Then we can even run
            // multiple build tasks.
            if (extensionTasks.length === 1) {
                return { task: extensionTasks[0], resolver: resolver };
            }
            else {
                var id = UUID.generateUuid();
                var task = {
                    _id: id,
                    _source: { kind: tasks_1.TaskSourceKind.Composite, label: 'composite' },
                    _label: id,
                    type: 'composite',
                    name: id,
                    identifier: id,
                    dependsOn: extensionTasks.map(function (task) { return task._id; })
                };
                return { task: task, resolver: resolver };
            }
        };
        TaskService.prototype.createResolver = function (sets) {
            var labelMap = Object.create(null);
            var identifierMap = Object.create(null);
            sets.forEach(function (set) {
                set.tasks.forEach(function (task) {
                    labelMap[task._label] = task;
                    identifierMap[task.identifier] = task;
                });
            });
            return {
                resolve: function (id) {
                    return labelMap[id] || identifierMap[id];
                }
            };
        };
        TaskService.prototype.executeTask = function (task, resolver) {
            var _this = this;
            if (!this.storageService.get(TaskService.RanTaskBefore_Key, storage_1.StorageScope.GLOBAL)) {
                this.storageService.store(TaskService.RanTaskBefore_Key, true, storage_1.StorageScope.GLOBAL);
            }
            return problemMatcher_1.ProblemMatcherRegistry.onReady().then(function () {
                return _this.textFileService.saveAll().then(function (value) {
                    var executeResult = _this.getTaskSystem().run(task, resolver);
                    _this.getRecentlyUsedTasks().set(tasks_1.Task.getKey(task), tasks_1.Task.getKey(task), map_1.Touch.First);
                    if (executeResult.kind === taskSystem_1.TaskExecuteKind.Active) {
                        var active = executeResult.active;
                        if (active.same) {
                            if (active.background) {
                                _this.messageService.show(severity_1.default.Info, nls.localize('TaskSystem.activeSame.background', 'The task \'{0}\' is already active and in background mode. To terminate it use `Terminate Task...` from the Tasks menu.', task._label));
                            }
                            else {
                                _this.messageService.show(severity_1.default.Info, nls.localize('TaskSystem.activeSame.noBackground', 'The task \'{0}\' is already active. To terminate it use `Terminate Task...` from the Tasks menu.', task._label));
                            }
                        }
                        else {
                            throw new taskSystem_1.TaskError(severity_1.default.Warning, nls.localize('TaskSystem.active', 'There is already a task running. Terminate it first before executing another task.'), taskSystem_1.TaskErrors.RunningTask);
                        }
                    }
                    return executeResult.promise;
                });
            });
        };
        TaskService.prototype.restart = function (task) {
            var _this = this;
            if (!this._taskSystem) {
                return;
            }
            var id = Types.isString(task) ? task : task._id;
            this._taskSystem.terminate(id).then(function (response) {
                if (response.success) {
                    _this.emit(taskService_1.TaskServiceEvents.Terminated, {});
                    _this.run(task);
                }
                else {
                    _this.messageService.show(severity_1.default.Warning, nls.localize('TaskSystem.restartFailed', 'Failed to terminate and restart task {0}', Types.isString(task) ? task : task.name));
                }
                return response;
            });
        };
        TaskService.prototype.terminate = function (task) {
            if (!this._taskSystem) {
                return winjs_base_1.TPromise.as({ success: true, task: undefined });
            }
            var id = Types.isString(task) ? task : task._id;
            return this._taskSystem.terminate(id);
        };
        TaskService.prototype.terminateAll = function () {
            if (!this._taskSystem) {
                return winjs_base_1.TPromise.as([]);
            }
            return this._taskSystem.terminateAll();
        };
        TaskService.prototype.getTaskSystem = function () {
            var _this = this;
            if (this._taskSystem) {
                return this._taskSystem;
            }
            var engine = this.getExecutionEngine();
            if (engine === tasks_1.ExecutionEngine.Terminal) {
                this._taskSystem = new terminalTaskSystem_1.TerminalTaskSystem(this.terminalService, this.outputService, this.markerService, this.modelService, this.configurationResolverService, this.telemetryService, this.workbenchEditorService, this.contextService, TaskService.OutputChannelId);
            }
            else {
                var system = new processTaskSystem_1.ProcessTaskSystem(this.markerService, this.modelService, this.telemetryService, this.outputService, this.configurationResolverService, this.contextService, TaskService.OutputChannelId);
                system.hasErrors(this._configHasErrors);
                this._taskSystem = system;
            }
            this._taskSystemListeners.push(this._taskSystem.addListener(taskSystem_1.TaskSystemEvents.Active, function (event) { return _this.emit(taskService_1.TaskServiceEvents.Active, event); }));
            this._taskSystemListeners.push(this._taskSystem.addListener(taskSystem_1.TaskSystemEvents.Inactive, function (event) { return _this.emit(taskService_1.TaskServiceEvents.Inactive, event); }));
            this._taskSystemListeners.push(this._taskSystem.addListener(taskSystem_1.TaskSystemEvents.Terminated, function (event) { return _this.emit(taskService_1.TaskServiceEvents.Terminated, event); }));
            this._taskSystemListeners.push(this._taskSystem.addListener(taskSystem_1.TaskSystemEvents.Changed, function () { return _this.emit(taskService_1.TaskServiceEvents.Changed); }));
            return this._taskSystem;
        };
        TaskService.prototype.getTaskSets = function () {
            var _this = this;
            return this.extensionService.activateByEvent('onCommand:workbench.action.tasks.runTask').then(function () {
                return new winjs_base_1.TPromise(function (resolve, reject) {
                    var result = [];
                    var counter = 0;
                    var done = function (value) {
                        if (value) {
                            result.push(value);
                        }
                        if (--counter === 0) {
                            resolve(result);
                        }
                    };
                    var error = function () {
                        if (--counter === 0) {
                            resolve(result);
                        }
                    };
                    if (_this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V2_0_0 && _this._providers.size > 0) {
                        _this._providers.forEach(function (provider) {
                            counter++;
                            provider.provideTasks().done(done, error);
                        });
                    }
                    else {
                        resolve(result);
                    }
                });
            }).then(function (result) {
                return _this.getWorkspaceTasks().then(function (workspaceTaskResult) {
                    var workspaceTasksToDelete = [];
                    var configurations = workspaceTaskResult.configurations;
                    var legacyTaskConfigurations = workspaceTaskResult.set ? _this.getLegacyTaskConfigurations(workspaceTaskResult.set) : undefined;
                    if (configurations || legacyTaskConfigurations) {
                        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                            var set = result_1[_i];
                            for (var i = 0; i < set.tasks.length; i++) {
                                var task = set.tasks[i];
                                if (!tasks_1.ContributedTask.is(task)) {
                                    continue;
                                }
                                if (configurations) {
                                    var configuringTask = configurations.byIdentifier[task.defines._key];
                                    if (configuringTask) {
                                        set.tasks[i] = TaskConfig.createCustomTask(task, configuringTask);
                                        continue;
                                    }
                                }
                                if (legacyTaskConfigurations) {
                                    var configuringTask = legacyTaskConfigurations[task.defines._key];
                                    if (configuringTask) {
                                        set.tasks[i] = TaskConfig.createCustomTask(task, configuringTask);
                                        workspaceTasksToDelete.push(configuringTask);
                                        set.tasks[i] = configuringTask;
                                        continue;
                                    }
                                }
                            }
                        }
                    }
                    if (workspaceTaskResult.set) {
                        if (workspaceTasksToDelete.length > 0) {
                            var tasks = workspaceTaskResult.set.tasks;
                            var newSet = {
                                extension: workspaceTaskResult.set.extension,
                                tasks: []
                            };
                            var toDelete_1 = workspaceTasksToDelete.reduce(function (map, task) {
                                map[task._id] = true;
                                return map;
                            }, Object.create(null));
                            newSet.tasks = tasks.filter(function (task) { return !toDelete_1[task._id]; });
                            result.push(newSet);
                        }
                        else {
                            result.push(workspaceTaskResult.set);
                        }
                    }
                    return result;
                }, function () {
                    // If we can't read the tasks.json file provide at least the contributed tasks
                    return result;
                });
            });
        };
        TaskService.prototype.getLegacyTaskConfigurations = function (workspaceTasks) {
            var result;
            function getResult() {
                if (result) {
                    return result;
                }
                result = Object.create(null);
                return result;
            }
            for (var _i = 0, _a = workspaceTasks.tasks; _i < _a.length; _i++) {
                var task = _a[_i];
                if (tasks_1.CustomTask.is(task)) {
                    var commandName = task.command && task.command.name;
                    // This is for backwards compatibility with the 0.1.0 task annotation code
                    // if we had a gulp, jake or grunt command a task specification was a annotation
                    if (commandName === 'gulp' || commandName === 'grunt' || commandName === 'jake') {
                        var identifier = TaskConfig.getTaskIdentifier({
                            type: commandName,
                            task: task.name
                        });
                        getResult()[identifier._key] = task;
                    }
                }
            }
            return result;
        };
        TaskService.prototype.getWorkspaceTasks = function () {
            if (this._workspaceTasksPromise) {
                return this._workspaceTasksPromise;
            }
            this.updateWorkspaceTasks();
            return this._workspaceTasksPromise;
        };
        TaskService.prototype.updateWorkspaceTasks = function () {
            var _this = this;
            this._workspaceTasksPromise = this.computeWorkspaceTasks().then(function (value) {
                _this._configHasErrors = value.hasErrors;
                if (_this._taskSystem instanceof processTaskSystem_1.ProcessTaskSystem) {
                    _this._taskSystem.hasErrors(_this._configHasErrors);
                }
                return value;
            });
        };
        TaskService.prototype.computeWorkspaceTasks = function () {
            var _this = this;
            var configPromise;
            {
                var _a = this.getConfiguration(), config_1 = _a.config, hasParseErrors = _a.hasParseErrors;
                if (hasParseErrors) {
                    return winjs_base_1.TPromise.as({ set: undefined, hasErrors: true, configurations: undefined });
                }
                var engine = tasks_1.ExecutionEngine._default;
                if (config_1) {
                    engine = TaskConfig.ExecutionEngine.from(config_1);
                    if (engine === tasks_1.ExecutionEngine.Process) {
                        if (this.hasDetectorSupport(config_1)) {
                            configPromise = new processRunnerDetector_1.ProcessRunnerDetector(this.fileService, this.contextService, this.configurationResolverService, config_1).detect(true).then(function (value) {
                                var hasErrors = _this.printStderr(value.stderr);
                                var detectedConfig = value.config;
                                if (!detectedConfig) {
                                    return { config: config_1, hasErrors: hasErrors };
                                }
                                var result = Objects.clone(config_1);
                                var configuredTasks = Object.create(null);
                                if (!result.tasks) {
                                    if (detectedConfig.tasks) {
                                        result.tasks = detectedConfig.tasks;
                                    }
                                }
                                else {
                                    result.tasks.forEach(function (task) { return configuredTasks[task.taskName] = task; });
                                    detectedConfig.tasks.forEach(function (task) {
                                        if (!configuredTasks[task.taskName]) {
                                            result.tasks.push(task);
                                        }
                                    });
                                }
                                return { config: result, hasErrors: hasErrors };
                            });
                        }
                        else {
                            configPromise = winjs_base_1.TPromise.as({ config: config_1, hasErrors: false });
                        }
                    }
                    else {
                        configPromise = winjs_base_1.TPromise.as({ config: config_1, hasErrors: false });
                    }
                }
                else {
                    if (engine === tasks_1.ExecutionEngine.Terminal) {
                        configPromise = winjs_base_1.TPromise.as({ config: config_1, hasErrors: false });
                    }
                    else {
                        configPromise = new processRunnerDetector_1.ProcessRunnerDetector(this.fileService, this.contextService, this.configurationResolverService).detect(true).then(function (value) {
                            var hasErrors = _this.printStderr(value.stderr);
                            return { config: value.config, hasErrors: hasErrors };
                        });
                    }
                }
            }
            return configPromise.then(function (resolved) {
                return problemMatcher_1.ProblemMatcherRegistry.onReady().then(function () {
                    if (!resolved || !resolved.config) {
                        return { set: undefined, configurations: undefined, hasErrors: resolved !== void 0 ? resolved.hasErrors : false };
                    }
                    var problemReporter = new ProblemReporter(_this._outputChannel);
                    var parseResult = TaskConfig.parse(resolved.config, problemReporter);
                    var hasErrors = false;
                    if (!parseResult.validationStatus.isOK()) {
                        hasErrors = true;
                        _this.showOutput();
                    }
                    if (problemReporter.status.isFatal()) {
                        problemReporter.fatal(nls.localize('TaskSystem.configurationErrors', 'Error: the provided task configuration has validation errors and can\'t not be used. Please correct the errors first.'));
                        return { set: undefined, configurations: undefined, hasErrors: hasErrors };
                    }
                    var customizedTasks;
                    if (parseResult.configured && parseResult.configured.length > 0) {
                        customizedTasks = {
                            byIdentifier: Object.create(null)
                        };
                        for (var _i = 0, _a = parseResult.configured; _i < _a.length; _i++) {
                            var task = _a[_i];
                            customizedTasks.byIdentifier[task.configures._key] = task;
                        }
                    }
                    return { set: { tasks: parseResult.custom }, configurations: customizedTasks, hasErrors: hasErrors };
                });
            });
        };
        TaskService.prototype.getExecutionEngine = function () {
            var config = this.getConfiguration().config;
            if (!config) {
                return tasks_1.ExecutionEngine._default;
            }
            return TaskConfig.ExecutionEngine.from(config);
        };
        TaskService.prototype.getJsonSchemaVersion = function () {
            var config = this.getConfiguration().config;
            if (!config) {
                return tasks_1.JsonSchemaVersion.V2_0_0;
            }
            return TaskConfig.JsonSchemaVersion.from(config);
        };
        TaskService.prototype.getConfiguration = function () {
            var result = this.contextService.hasWorkspace() ? this.configurationService.getConfiguration('tasks', { resource: this.contextService.getLegacyWorkspace().resource }) : undefined;
            if (!result) {
                return { config: undefined, hasParseErrors: false };
            }
            var parseErrors = result.$parseErrors;
            if (parseErrors) {
                var isAffected = false;
                for (var i = 0; i < parseErrors.length; i++) {
                    if (/tasks\.json$/.test(parseErrors[i])) {
                        isAffected = true;
                        break;
                    }
                }
                if (isAffected) {
                    this._outputChannel.append(nls.localize('TaskSystem.invalidTaskJson', 'Error: The content of the tasks.json file has syntax errors. Please correct them before executing a task.\n'));
                    this.showOutput();
                    return { config: undefined, hasParseErrors: true };
                }
            }
            return { config: result, hasParseErrors: false };
        };
        TaskService.prototype.printStderr = function (stderr) {
            var _this = this;
            var result = false;
            if (stderr && stderr.length > 0) {
                stderr.forEach(function (line) {
                    result = true;
                    _this._outputChannel.append(line + '\n');
                });
                this._outputChannel.show(true);
            }
            return result;
        };
        TaskService.prototype.inTerminal = function () {
            if (this._taskSystem) {
                return this._taskSystem instanceof terminalTaskSystem_1.TerminalTaskSystem;
            }
            return this.getExecutionEngine() === tasks_1.ExecutionEngine.Terminal;
        };
        TaskService.prototype.hasDetectorSupport = function (config) {
            if (!config.command || !this.contextService.hasWorkspace()) {
                return false;
            }
            return processRunnerDetector_1.ProcessRunnerDetector.supports(config.command);
        };
        TaskService.prototype.configureAction = function () {
            return new ConfigureTaskRunnerAction(ConfigureTaskRunnerAction.ID, ConfigureTaskRunnerAction.TEXT, this, this.configurationService, this.editorService, this.fileService, this.contextService, this.outputService, this.messageService, this.quickOpenService, this.environmentService, this.configurationResolverService, this.extensionService, this.telemetryService);
        };
        TaskService.prototype.configureBuildTask = function () {
            return new ConfigureBuildTaskAction(ConfigureBuildTaskAction.ID, ConfigureBuildTaskAction.TEXT, this, this.configurationService, this.editorService, this.fileService, this.contextService, this.outputService, this.messageService, this.quickOpenService, this.environmentService, this.configurationResolverService, this.extensionService, this.telemetryService);
        };
        TaskService.prototype.beforeShutdown = function () {
            var _this = this;
            if (!this._taskSystem) {
                return false;
            }
            this.saveRecentlyUsedTasks();
            if (!this._taskSystem.isActiveSync()) {
                return false;
            }
            // The terminal service kills all terminal on shutdown. So there
            // is nothing we can do to prevent this here.
            if (this._taskSystem instanceof terminalTaskSystem_1.TerminalTaskSystem) {
                return false;
            }
            if (this._taskSystem.canAutoTerminate() || this.messageService.confirm({
                message: nls.localize('TaskSystem.runningTask', 'There is a task running. Do you want to terminate it?'),
                primaryButton: nls.localize({ key: 'TaskSystem.terminateTask', comment: ['&& denotes a mnemonic'] }, "&&Terminate Task"),
                type: 'question'
            })) {
                return this._taskSystem.terminateAll().then(function (responses) {
                    var success = true;
                    var code = undefined;
                    for (var _i = 0, responses_1 = responses; _i < responses_1.length; _i++) {
                        var response = responses_1[_i];
                        success = success && response.success;
                        // We only have a code in the old output runner which only has one task
                        // So we can use the first code.
                        if (code === void 0 && response.code !== void 0) {
                            code = response.code;
                        }
                    }
                    if (success) {
                        _this.emit(taskService_1.TaskServiceEvents.Terminated, {});
                        _this._taskSystem = null;
                        _this.disposeTaskSystemListeners();
                        return false; // no veto
                    }
                    else if (code && code === processes_1.TerminateResponseCode.ProcessNotFound) {
                        return !_this.messageService.confirm({
                            message: nls.localize('TaskSystem.noProcess', 'The launched task doesn\'t exist anymore. If the task spawned background processes exiting VS Code might result in orphaned processes. To avoid this start the last background process with a wait flag.'),
                            primaryButton: nls.localize({ key: 'TaskSystem.exitAnyways', comment: ['&& denotes a mnemonic'] }, "&&Exit Anyways"),
                            type: 'info'
                        });
                    }
                    return true; // veto
                }, function (err) {
                    return true; // veto
                });
            }
            else {
                return true; // veto
            }
        };
        TaskService.prototype.getConfigureAction = function (code) {
            switch (code) {
                case taskSystem_1.TaskErrors.NoBuildTask:
                    return this.configureBuildTask();
                default:
                    return this.configureAction();
            }
        };
        TaskService.prototype.handleError = function (err) {
            var _this = this;
            var showOutput = true;
            if (err instanceof taskSystem_1.TaskError) {
                var buildError = err;
                var needsConfig = buildError.code === taskSystem_1.TaskErrors.NotConfigured || buildError.code === taskSystem_1.TaskErrors.NoBuildTask || buildError.code === taskSystem_1.TaskErrors.NoTestTask;
                var needsTerminate = buildError.code === taskSystem_1.TaskErrors.RunningTask;
                if (needsConfig || needsTerminate) {
                    var closeAction = new CloseMessageAction();
                    var action = needsConfig
                        ? this.getConfigureAction(buildError.code)
                        : new actions_1.Action('workbench.action.tasks.terminate', nls.localize('TerminateAction.label', "Terminate Task"), undefined, true, function () { _this.runTerminateCommand(); return winjs_base_1.TPromise.as(undefined); });
                    closeAction.closeFunction = this.messageService.show(buildError.severity, { message: buildError.message, actions: [action, closeAction] });
                }
                else {
                    this.messageService.show(buildError.severity, buildError.message);
                }
            }
            else if (err instanceof Error) {
                var error = err;
                this.messageService.show(severity_1.default.Error, error.message);
            }
            else if (Types.isString(err)) {
                this.messageService.show(severity_1.default.Error, err);
            }
            else {
                this.messageService.show(severity_1.default.Error, nls.localize('TaskSystem.unknownError', 'An error has occurred while running a task. See task log for details.'));
            }
            if (showOutput) {
                this._outputChannel.show(true);
            }
        };
        TaskService.prototype.canRunCommand = function () {
            if (!this.contextService.hasWorkspace()) {
                this.messageService.show(severity_1.default.Info, nls.localize('TaskService.noWorkspace', 'Tasks are only available on a workspace folder.'));
                return false;
            }
            return true;
        };
        TaskService.prototype.showQuickPick = function (tasks, placeHolder, group, sort) {
            if (group === void 0) { group = false; }
            if (sort === void 0) { sort = false; }
            if (tasks === void 0 || tasks === null || tasks.length === 0) {
                return winjs_base_1.TPromise.as(undefined);
            }
            function TaskQickPickEntry(task) {
                return { label: task._label, task: task };
            }
            function fillEntries(entries, tasks, groupLabel, withBorder) {
                if (withBorder === void 0) { withBorder = false; }
                var first = true;
                for (var _i = 0, tasks_2 = tasks; _i < tasks_2.length; _i++) {
                    var task = tasks_2[_i];
                    if (first) {
                        first = false;
                        var entry = TaskQickPickEntry(task);
                        entry.separator = { label: groupLabel, border: withBorder };
                        entries.push(entry);
                    }
                    else {
                        entries.push(TaskQickPickEntry(task));
                    }
                }
            }
            var entries;
            if (group) {
                entries = [];
                if (tasks.length === 1) {
                    entries.push(TaskQickPickEntry(tasks[0]));
                }
                else {
                    var recentlyUsedTasks = this.getRecentlyUsedTasks();
                    var recent_1 = [];
                    var configured = [];
                    var detected = [];
                    var taskMap_1 = Object.create(null);
                    tasks.forEach(function (task) { return taskMap_1[tasks_1.Task.getKey(task)] = task; });
                    recentlyUsedTasks.keys().forEach(function (key) {
                        var task = taskMap_1[key];
                        if (task) {
                            recent_1.push(task);
                        }
                    });
                    for (var _i = 0, tasks_3 = tasks; _i < tasks_3.length; _i++) {
                        var task = tasks_3[_i];
                        if (!recentlyUsedTasks.has(tasks_1.Task.getKey(task))) {
                            if (task._source.kind === tasks_1.TaskSourceKind.Workspace) {
                                configured.push(task);
                            }
                            else {
                                detected.push(task);
                            }
                        }
                    }
                    var hasRecentlyUsed = recent_1.length > 0;
                    fillEntries(entries, recent_1, nls.localize('recentlyUsed', 'recently used tasks'));
                    configured = configured.sort(function (a, b) { return a._label.localeCompare(b._label); });
                    var hasConfigured = configured.length > 0;
                    fillEntries(entries, configured, nls.localize('configured', 'configured tasks'), hasRecentlyUsed);
                    detected = detected.sort(function (a, b) { return a._label.localeCompare(b._label); });
                    fillEntries(entries, detected, nls.localize('detected', 'detected tasks'), hasRecentlyUsed || hasConfigured);
                }
            }
            else {
                entries = tasks.map(function (task) { return { label: task._label, task: task }; });
                if (sort) {
                    entries = entries.sort(function (a, b) { return a.task._label.localeCompare(b.task._label); });
                }
            }
            return this.quickOpenService.pick(entries, { placeHolder: placeHolder, autoFocus: { autoFocusFirstEntry: true } }).then(function (entry) { return entry ? entry.task : undefined; });
        };
        TaskService.prototype.runTaskCommand = function (accessor, arg) {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (Types.isString(arg)) {
                this.getTask(arg).then(function (task) {
                    if (task) {
                        _this.run(task);
                    }
                    else {
                        _this.quickOpenService.show('task ');
                    }
                }, function () {
                    _this.quickOpenService.show('task ');
                });
            }
            else {
                this.quickOpenService.show('task ');
            }
        };
        TaskService.prototype.runBuildCommand = function () {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V0_1_0) {
                this.build();
                return;
            }
            var options = {
                location: progress_1.ProgressLocation.Window,
                title: nls.localize('TaskService.fetchingBuildTasks', 'Fetching build tasks...')
            };
            var promise = this.getTasksForGroup(tasks_1.TaskGroup.Build).then(function (tasks) {
                if (tasks.length === 0) {
                    _this.messageService.show(severity_1.default.Info, {
                        message: nls.localize('TaskService.noBuildTaskTerminal', 'No Build Task found. Press \'Configure Build Task\' to define one.'),
                        actions: [_this.configureBuildTask(), new CloseMessageAction()]
                    });
                    return;
                }
                var primaries = [];
                for (var _i = 0, tasks_4 = tasks; _i < tasks_4.length; _i++) {
                    var task = tasks_4[_i];
                    // We only have build tasks here
                    if (task.isDefaultGroupEntry) {
                        primaries.push(task);
                    }
                }
                if (primaries.length === 1) {
                    _this.run(primaries[0]);
                    return;
                }
                _this.showQuickPick(tasks, nls.localize('TaskService.pickBuildTask', 'Select the build task to run'), true).then(function (task) {
                    if (task) {
                        _this.run(task, { attachProblemMatcher: true });
                    }
                });
            });
            this.progressService.withProgress(options, function () { return promise; });
        };
        TaskService.prototype.runTestCommand = function () {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V0_1_0) {
                this.runTest();
                return;
            }
            var options = {
                location: progress_1.ProgressLocation.Window,
                title: nls.localize('TaskService.fetchingTestTasks', 'Fetching test tasks...')
            };
            var promise = this.getTasksForGroup(tasks_1.TaskGroup.Test).then(function (tasks) {
                if (tasks.length === 0) {
                    _this.messageService.show(severity_1.default.Info, {
                        message: nls.localize('TaskService.noTestTaskTerminal', 'No Test Task found. Press \'Configure Task Runner\' to define one.'),
                        actions: [_this.configureAction(), new CloseMessageAction()]
                    });
                    return;
                }
                var primaries = [];
                for (var _i = 0, tasks_5 = tasks; _i < tasks_5.length; _i++) {
                    var task = tasks_5[_i];
                    // We only have test task here.
                    if (task.isDefaultGroupEntry) {
                        primaries.push(task);
                    }
                }
                if (primaries.length === 1) {
                    _this.run(primaries[0]);
                    return;
                }
                _this.showQuickPick(tasks, nls.localize('TaskService.pickTestTask', 'Select the test task to run'), true).then(function (task) {
                    if (task) {
                        _this.run(task);
                    }
                });
            });
            this.progressService.withProgress(options, function () { return promise; });
        };
        TaskService.prototype.runTerminateCommand = function () {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (this.inTerminal()) {
                this.getActiveTasks().then(function (activeTasks) {
                    if (activeTasks.length === 0) {
                        _this.messageService.show(severity_1.default.Info, nls.localize('TaskService.noTaskRunning', 'No task is currently running.'));
                        return;
                    }
                    _this.showQuickPick(activeTasks, nls.localize('TaskService.tastToTerminate', 'Select task to terminate'), false, true).then(function (task) {
                        if (task) {
                            _this.terminate(task);
                        }
                    });
                });
            }
            else {
                this.isActive().then(function (active) {
                    if (active) {
                        _this.terminateAll().then(function (responses) {
                            // the output runner has only one task
                            var response = responses[0];
                            if (response.success) {
                                return;
                            }
                            if (response.code && response.code === processes_1.TerminateResponseCode.ProcessNotFound) {
                                _this.messageService.show(severity_1.default.Error, nls.localize('TerminateAction.noProcess', 'The launched process doesn\'t exist anymore. If the task spawned background tasks exiting VS Code might result in orphaned processes.'));
                            }
                            else {
                                _this.messageService.show(severity_1.default.Error, nls.localize('TerminateAction.failed', 'Failed to terminate running task'));
                            }
                        });
                    }
                });
            }
        };
        TaskService.prototype.runRestartTaskCommand = function (accessor, arg) {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (this.inTerminal()) {
                this.getActiveTasks().then(function (activeTasks) {
                    if (activeTasks.length === 0) {
                        _this.messageService.show(severity_1.default.Info, nls.localize('TaskService.noTaskToRestart', 'No task to restart.'));
                        return;
                    }
                    _this.showQuickPick(activeTasks, nls.localize('TaskService.tastToRestart', 'Select the task to restart'), false, true).then(function (task) {
                        if (task) {
                            _this.restart(task);
                        }
                    });
                });
            }
            else {
                this.getActiveTasks().then(function (activeTasks) {
                    if (activeTasks.length === 0) {
                        return;
                    }
                    var task = activeTasks[0];
                    _this.restart(task);
                });
            }
        };
        TaskService.prototype.runConfigureDefaultBuildTask = function () {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V2_0_0) {
                this.tasks().then((function (tasks) {
                    if (tasks.length === 0) {
                        _this.configureBuildTask().run();
                        return;
                    }
                    var defaultTask;
                    for (var _i = 0, tasks_6 = tasks; _i < tasks_6.length; _i++) {
                        var task = tasks_6[_i];
                        if (task.group === tasks_1.TaskGroup.Build && task.isDefaultGroupEntry) {
                            defaultTask = task;
                            break;
                        }
                    }
                    if (defaultTask) {
                        _this.messageService.show(severity_1.default.Info, nls.localize('TaskService.defaultBuildTaskExists', '{0} is already marked as the default build task.', defaultTask._label));
                        return;
                    }
                    _this.showQuickPick(tasks, nls.localize('TaskService.pickDefaultBuildTask', 'Select the task to be used as the default build task'), true).then(function (task) {
                        if (!task) {
                            return;
                        }
                        if (!tasks_1.CompositeTask.is(task)) {
                            _this.customize(task, { group: { kind: 'build', isDefault: true } }, true);
                        }
                    });
                }));
            }
            else {
                this.configureBuildTask().run();
            }
        };
        TaskService.prototype.runConfigureDefaultTestTask = function () {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (this.getJsonSchemaVersion() === tasks_1.JsonSchemaVersion.V2_0_0) {
                this.tasks().then((function (tasks) {
                    if (tasks.length === 0) {
                        _this.configureAction().run();
                    }
                    var defaultTask;
                    for (var _i = 0, tasks_7 = tasks; _i < tasks_7.length; _i++) {
                        var task = tasks_7[_i];
                        if (task.group === tasks_1.TaskGroup.Test && task.isDefaultGroupEntry) {
                            defaultTask = task;
                            break;
                        }
                    }
                    if (defaultTask) {
                        _this.messageService.show(severity_1.default.Info, nls.localize('TaskService.defaultTestTaskExists', '{0} is already marked as the default test task.', defaultTask._label));
                        return;
                    }
                    _this.showQuickPick(tasks, nls.localize('TaskService.pickDefaultTestTask', 'Select the task to be used as the default test task'), true).then(function (task) {
                        if (!task) {
                            return;
                        }
                        if (!tasks_1.CompositeTask.is(task)) {
                            _this.customize(task, { group: { kind: 'test', isDefault: true } }, true);
                        }
                    });
                }));
            }
            else {
                this.configureAction().run();
            }
        };
        TaskService.prototype.runShowTasks = function () {
            var _this = this;
            if (!this.canRunCommand()) {
                return;
            }
            if (!this._taskSystem) {
                this.messageService.show(severity_1.default.Info, nls.localize('TaskService.noTaskIsRunning', 'No task is running.'));
                return;
            }
            this.getActiveTasks().then(function (tasks) {
                if (tasks.length === 0) {
                    _this.messageService.show(severity_1.default.Info, nls.localize('TaskService.noTaskIsRunning', 'No task is running.'));
                }
                else if (tasks.length === 1) {
                    if (_this._taskSystem) {
                        _this._taskSystem.revealTask(tasks[0]);
                    }
                }
                else {
                    _this.showQuickPick(tasks, nls.localize('TaskService.pickShowTask', 'Select the task to show its output'), false, true).then(function (task) {
                        if (!task || !_this._taskSystem) {
                            return;
                        }
                        _this._taskSystem.revealTask(task);
                    });
                }
            });
        };
        // private static autoDetectTelemetryName: string = 'taskServer.autoDetect';
        TaskService.RecentlyUsedTasks_Key = 'workbench.tasks.recentlyUsedTasks';
        TaskService.RanTaskBefore_Key = 'workbench.tasks.ranTaskBefore';
        TaskService.CustomizationTelemetryEventName = 'taskService.customize';
        TaskService.TemplateTelemetryEventName = 'taskService.template';
        TaskService.SERVICE_ID = 'taskService';
        TaskService.OutputChannelId = 'tasks';
        TaskService.OutputChannelLabel = nls.localize('tasks', "Tasks");
        TaskService = __decorate([
            __param(0, modeService_1.IModeService), __param(1, configuration_1.IConfigurationService),
            __param(2, configurationEditing_1.IConfigurationEditingService),
            __param(3, markers_1.IMarkerService), __param(4, output_1.IOutputService),
            __param(5, message_1.IMessageService), __param(6, editorService_1.IWorkbenchEditorService),
            __param(7, files_1.IFileService), __param(8, workspace_1.IWorkspaceContextService),
            __param(9, telemetry_1.ITelemetryService), __param(10, textfiles_1.ITextFileService),
            __param(11, lifecycle_2.ILifecycleService),
            __param(12, modelService_1.IModelService), __param(13, extensions_2.IExtensionService),
            __param(14, quickOpen_1.IQuickOpenService),
            __param(15, environment_1.IEnvironmentService),
            __param(16, configurationResolver_1.IConfigurationResolverService),
            __param(17, terminal_1.ITerminalService),
            __param(18, editorService_1.IWorkbenchEditorService),
            __param(19, storage_1.IStorageService),
            __param(20, progress_1.IProgressService2),
            __param(21, opener_1.IOpenerService),
            __param(22, windows_1.IWindowService)
        ], TaskService);
        return TaskService;
    }(eventEmitter_1.EventEmitter));
    var workbenchActionsRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    workbenchActionsRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ConfigureTaskRunnerAction, ConfigureTaskRunnerAction.ID, ConfigureTaskRunnerAction.TEXT), 'Tasks: Configure Task Runner', tasksCategory);
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.showLog', title: { value: nls.localize('ShowLogAction.label', "Show Task Log"), original: 'Show Task Log' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.runTask', title: { value: nls.localize('RunTaskAction.label', "Run Task"), original: 'Run Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.restartTask', title: { value: nls.localize('RestartTaskAction.label', "Restart Running Task"), original: 'Restart Running Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.showTasks', title: { value: nls.localize('ShowTasksAction.label', "Show Running Tasks"), original: 'Show Running Tasks' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.terminate', title: { value: nls.localize('TerminateAction.label', "Terminate Task"), original: 'Terminate Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.build', title: { value: nls.localize('BuildAction.label', "Run Build Task"), original: 'Run Build Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.test', title: { value: nls.localize('TestAction.label', "Run Test Task"), original: 'Run Test Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.configureDefaultBuildTask', title: { value: nls.localize('ConfigureDefaultBuildTask.label', "Configure Default Build Task"), original: 'Configure Default Build Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    actions_2.MenuRegistry.addCommand({ id: 'workbench.action.tasks.configureDefaultTestTask', title: { value: nls.localize('ConfigureDefaultTestTask.label', "Configure Default Test Task"), original: 'Configure Default Test Task' }, category: { value: tasksCategory, original: 'Tasks' } });
    // MenuRegistry.addCommand( { id: 'workbench.action.tasks.rebuild', title: nls.localize('RebuildAction.label', 'Run Rebuild Task'), category: tasksCategory });
    // MenuRegistry.addCommand( { id: 'workbench.action.tasks.clean', title: nls.localize('CleanAction.label', 'Run Clean Task'), category: tasksCategory });
    // Task Service
    extensions_1.registerSingleton(taskService_1.ITaskService, TaskService);
    // Register Quick Open
    var quickOpenRegistry = platform_1.Registry.as(quickopen_1.Extensions.Quickopen);
    var tasksPickerContextKey = 'inTasksPicker';
    quickOpenRegistry.registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/tasks/browser/taskQuickOpen', 'QuickOpenHandler', 'task ', tasksPickerContextKey, nls.localize('quickOpen.task', "Run Task")));
    var actionBarRegistry = platform_1.Registry.as(actions_3.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actions_3.Scope.VIEWER, quickOpen_2.QuickOpenActionContributor);
    // Status bar
    var statusbarRegistry = platform_1.Registry.as(statusbar_1.Extensions.Statusbar);
    statusbarRegistry.registerStatusbarItem(new statusbar_1.StatusbarItemDescriptor(BuildStatusBarItem, statusbar_1.StatusbarAlignment.LEFT, 50 /* Medium Priority */));
    statusbarRegistry.registerStatusbarItem(new statusbar_1.StatusbarItemDescriptor(TaskStatusBarItem, statusbar_1.StatusbarAlignment.LEFT, 50 /* Medium Priority */));
    // Output channel
    var outputChannelRegistry = platform_1.Registry.as(output_1.Extensions.OutputChannels);
    outputChannelRegistry.registerChannel(TaskService.OutputChannelId, TaskService.OutputChannelLabel);
    // (<IWorkbenchContributionsRegistry>Registry.as(WorkbenchExtensions.Workbench)).registerWorkbenchContribution(TaskServiceParticipant);
    // tasks.json validation
    var schemaId = 'vscode://schemas/tasks';
    var schema = {
        id: schemaId,
        description: 'Task definition file',
        type: 'object',
        default: {
            version: '0.1.0',
            command: 'myCommand',
            isShellCommand: false,
            args: [],
            showOutput: 'always',
            tasks: [
                {
                    taskName: 'build',
                    showOutput: 'silent',
                    isBuildCommand: true,
                    problemMatcher: ['$tsc', '$lessCompile']
                }
            ]
        }
    };
    schema.definitions = __assign({}, jsonSchema_v1_1.default.definitions, jsonSchema_v2_1.default.definitions);
    schema.oneOf = jsonSchema_v2_1.default.oneOf.concat(jsonSchema_v1_1.default.oneOf);
    var jsonRegistry = platform_1.Registry.as(jsonContributionRegistry.Extensions.JSONContribution);
    jsonRegistry.registerSchema(schemaId, schema);
});
//# sourceMappingURL=task.contribution.js.map