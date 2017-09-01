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
define(["require", "exports", "vs/workbench/parts/files/common/editors/fileEditorInput", "vs/base/common/winjs.base", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/base/common/eventEmitter", "vs/base/common/paths", "vs/base/common/uri", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils", "vs/platform/storage/common/storageService", "vs/base/common/event", "vs/workbench/services/backup/common/backup", "vs/platform/configuration/common/configuration", "vs/platform/storage/common/storage", "vs/workbench/services/part/common/partService", "vs/workbench/services/textmodelResolver/common/textModelResolverService", "vs/editor/common/services/resolverService", "vs/workbench/services/untitled/common/untitledEditorService", "vs/platform/message/common/message", "vs/platform/workspace/common/workspace", "vs/platform/lifecycle/common/lifecycle", "vs/workbench/common/editor/editorStacksModel", "vs/platform/instantiation/common/serviceCollection", "vs/platform/instantiation/common/instantiationService", "vs/workbench/services/group/common/groupService", "vs/workbench/services/textfile/common/textFileService", "vs/platform/files/common/files", "vs/editor/common/services/modelService", "vs/editor/common/services/modeServiceImpl", "vs/editor/common/services/modelServiceImpl", "vs/workbench/services/textfile/common/textfiles", "vs/platform/environment/node/argv", "vs/platform/environment/node/environmentService", "vs/editor/common/services/modeService", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/history/common/history", "vs/platform/instantiation/common/instantiation", "vs/platform/configuration/test/common/testConfigurationService", "vs/platform/windows/common/windows", "vs/platform/workspace/test/common/testWorkspace", "vs/editor/common/model/textSource", "vs/platform/environment/common/environment", "vs/platform/theme/common/themeService", "vs/base/common/platform", "vs/base/common/uuid", "vs/platform/theme/test/common/testThemeService", "vs/workbench/parts/files/browser/files.contribution"], function (require, exports, fileEditorInput_1, winjs_base_1, instantiationServiceMock_1, eventEmitter_1, paths, uri_1, telemetry_1, telemetryUtils_1, storageService_1, event_1, backup_1, configuration_1, storage_1, partService_1, textModelResolverService_1, resolverService_1, untitledEditorService_1, message_1, workspace_1, lifecycle_1, editorStacksModel_1, serviceCollection_1, instantiationService_1, groupService_1, textFileService_1, files_1, modelService_1, modeServiceImpl_1, modelServiceImpl_1, textfiles_1, argv_1, environmentService_1, modeService_1, editorService_1, history_1, instantiation_1, testConfigurationService_1, windows_1, testWorkspace_1, textSource_1, environment_1, themeService_1, platform_1, uuid_1, testThemeService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createFileInput(instantiationService, resource) {
        return instantiationService.createInstance(fileEditorInput_1.FileEditorInput, resource, void 0);
    }
    exports.createFileInput = createFileInput;
    exports.TestEnvironmentService = new environmentService_1.EnvironmentService(argv_1.parseArgs(process.argv), process.execPath);
    var TestContextService = (function () {
        function TestContextService(workspace, options) {
            if (workspace === void 0) { workspace = testWorkspace_1.TestWorkspace; }
            if (options === void 0) { options = null; }
            this.workspace = workspace;
            this.id = uuid_1.generateUuid();
            this.options = options || Object.create(null);
            this._onDidChangeWorkspaceRoots = new event_1.Emitter();
        }
        Object.defineProperty(TestContextService.prototype, "onDidChangeWorkspaceName", {
            get: function () {
                return this._onDidChangeWorkspaceName.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestContextService.prototype, "onDidChangeWorkspaceRoots", {
            get: function () {
                return this._onDidChangeWorkspaceRoots.event;
            },
            enumerable: true,
            configurable: true
        });
        TestContextService.prototype.getFolders = function () {
            return this.workspace ? this.workspace.roots : [];
        };
        TestContextService.prototype.hasWorkspace = function () {
            return !!this.workspace;
        };
        TestContextService.prototype.hasFolderWorkspace = function () {
            return this.workspace && !this.workspace.configuration;
        };
        TestContextService.prototype.hasMultiFolderWorkspace = function () {
            return this.workspace && !!this.workspace.configuration;
        };
        TestContextService.prototype.getLegacyWorkspace = function () {
            return this.workspace ? { resource: this.workspace.roots[0] } : void 0;
        };
        TestContextService.prototype.getWorkspace = function () {
            return this.workspace;
        };
        TestContextService.prototype.getRoot = function (resource) {
            return this.isInsideWorkspace(resource) ? this.workspace.roots[0] : null;
        };
        TestContextService.prototype.setWorkspace = function (workspace) {
            this.workspace = workspace;
        };
        TestContextService.prototype.getOptions = function () {
            return this.options;
        };
        TestContextService.prototype.updateOptions = function () {
        };
        TestContextService.prototype.isInsideWorkspace = function (resource) {
            if (resource && this.workspace) {
                return paths.isEqualOrParent(resource.fsPath, this.workspace.roots[0].fsPath, !platform_1.isLinux /* ignorecase */);
            }
            return false;
        };
        TestContextService.prototype.toResource = function (workspaceRelativePath) {
            return uri_1.default.file(paths.join('C:\\', workspaceRelativePath));
        };
        return TestContextService;
    }());
    exports.TestContextService = TestContextService;
    var TestTextFileService = (function (_super) {
        __extends(TestTextFileService, _super);
        function TestTextFileService(lifecycleService, contextService, configurationService, telemetryService, editorService, fileService, untitledEditorService, instantiationService, messageService, backupFileService, windowsService, historyService) {
            return _super.call(this, lifecycleService, contextService, configurationService, telemetryService, fileService, untitledEditorService, instantiationService, messageService, exports.TestEnvironmentService, backupFileService, windowsService, historyService) || this;
        }
        TestTextFileService.prototype.setPromptPath = function (path) {
            this.promptPath = path;
        };
        TestTextFileService.prototype.setConfirmResult = function (result) {
            this.confirmResult = result;
        };
        TestTextFileService.prototype.setResolveTextContentErrorOnce = function (error) {
            this.resolveTextContentError = error;
        };
        TestTextFileService.prototype.resolveTextContent = function (resource, options) {
            if (this.resolveTextContentError) {
                var error = this.resolveTextContentError;
                this.resolveTextContentError = null;
                return winjs_base_1.TPromise.wrapError(error);
            }
            return this.fileService.resolveContent(resource, options).then(function (content) {
                var textSource = textSource_1.RawTextSource.fromString(content.value);
                return {
                    resource: content.resource,
                    name: content.name,
                    mtime: content.mtime,
                    etag: content.etag,
                    encoding: content.encoding,
                    value: textSource,
                    valueLogicalHash: null
                };
            });
        };
        TestTextFileService.prototype.promptForPath = function (defaultPath) {
            return this.promptPath;
        };
        TestTextFileService.prototype.confirmSave = function (resources) {
            return this.confirmResult;
        };
        TestTextFileService.prototype.onConfigurationChange = function (configuration) {
            _super.prototype.onConfigurationChange.call(this, configuration);
        };
        TestTextFileService.prototype.cleanupBackupsBeforeShutdown = function () {
            this.cleanupBackupsBeforeShutdownCalled = true;
            return winjs_base_1.TPromise.as(void 0);
        };
        TestTextFileService = __decorate([
            __param(0, lifecycle_1.ILifecycleService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, telemetry_1.ITelemetryService),
            __param(4, editorService_1.IWorkbenchEditorService),
            __param(5, files_1.IFileService),
            __param(6, untitledEditorService_1.IUntitledEditorService),
            __param(7, instantiation_1.IInstantiationService),
            __param(8, message_1.IMessageService),
            __param(9, backup_1.IBackupFileService),
            __param(10, windows_1.IWindowsService),
            __param(11, history_1.IHistoryService)
        ], TestTextFileService);
        return TestTextFileService;
    }(textFileService_1.TextFileService));
    exports.TestTextFileService = TestTextFileService;
    function workbenchInstantiationService() {
        var instantiationService = new instantiationServiceMock_1.TestInstantiationService(new serviceCollection_1.ServiceCollection([lifecycle_1.ILifecycleService, new TestLifecycleService()]));
        instantiationService.stub(workspace_1.IWorkspaceContextService, new TestContextService(testWorkspace_1.TestWorkspace));
        instantiationService.stub(configuration_1.IConfigurationService, new testConfigurationService_1.TestConfigurationService());
        instantiationService.stub(untitledEditorService_1.IUntitledEditorService, instantiationService.createInstance(untitledEditorService_1.UntitledEditorService));
        instantiationService.stub(storage_1.IStorageService, new TestStorageService());
        instantiationService.stub(editorService_1.IWorkbenchEditorService, new TestEditorService());
        instantiationService.stub(partService_1.IPartService, new TestPartService());
        instantiationService.stub(groupService_1.IEditorGroupService, new TestEditorGroupService());
        instantiationService.stub(modeService_1.IModeService, modeServiceImpl_1.ModeServiceImpl);
        instantiationService.stub(history_1.IHistoryService, new TestHistoryService());
        instantiationService.stub(modelService_1.IModelService, instantiationService.createInstance(modelServiceImpl_1.ModelServiceImpl));
        instantiationService.stub(files_1.IFileService, new TestFileService());
        instantiationService.stub(backup_1.IBackupFileService, new TestBackupFileService());
        instantiationService.stub(telemetry_1.ITelemetryService, telemetryUtils_1.NullTelemetryService);
        instantiationService.stub(message_1.IMessageService, new TestMessageService());
        instantiationService.stub(untitledEditorService_1.IUntitledEditorService, instantiationService.createInstance(untitledEditorService_1.UntitledEditorService));
        instantiationService.stub(windows_1.IWindowsService, new TestWindowsService());
        instantiationService.stub(textfiles_1.ITextFileService, instantiationService.createInstance(TestTextFileService));
        instantiationService.stub(resolverService_1.ITextModelService, instantiationService.createInstance(textModelResolverService_1.TextModelResolverService));
        instantiationService.stub(environment_1.IEnvironmentService, exports.TestEnvironmentService);
        instantiationService.stub(themeService_1.IThemeService, new testThemeService_1.TestThemeService());
        return instantiationService;
    }
    exports.workbenchInstantiationService = workbenchInstantiationService;
    var TestHistoryService = (function () {
        function TestHistoryService(root) {
            this.root = root;
        }
        TestHistoryService.prototype.reopenLastClosedEditor = function () {
        };
        TestHistoryService.prototype.add = function (input, options) {
        };
        TestHistoryService.prototype.forward = function (acrossEditors) {
        };
        TestHistoryService.prototype.back = function (acrossEditors) {
        };
        TestHistoryService.prototype.remove = function (input) {
        };
        TestHistoryService.prototype.clear = function () {
        };
        TestHistoryService.prototype.getHistory = function () {
            return [];
        };
        TestHistoryService.prototype.getLastActiveWorkspaceRoot = function () {
            return this.root;
        };
        return TestHistoryService;
    }());
    exports.TestHistoryService = TestHistoryService;
    var TestMessageService = (function () {
        function TestMessageService() {
            this.counter = 0;
        }
        TestMessageService.prototype.show = function (sev, message) {
            this.counter++;
            return null;
        };
        TestMessageService.prototype.getCounter = function () {
            return this.counter;
        };
        TestMessageService.prototype.hideAll = function () {
            // No-op
        };
        TestMessageService.prototype.confirm = function (confirmation) {
            return false;
        };
        return TestMessageService;
    }());
    exports.TestMessageService = TestMessageService;
    var TestPartService = (function () {
        function TestPartService() {
            this._onTitleBarVisibilityChange = new event_1.Emitter();
            this._onEditorLayout = new event_1.Emitter();
        }
        Object.defineProperty(TestPartService.prototype, "onTitleBarVisibilityChange", {
            get: function () {
                return this._onTitleBarVisibilityChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestPartService.prototype, "onEditorLayout", {
            get: function () {
                return this._onEditorLayout.event;
            },
            enumerable: true,
            configurable: true
        });
        TestPartService.prototype.layout = function () { };
        TestPartService.prototype.isCreated = function () {
            return true;
        };
        TestPartService.prototype.joinCreation = function () {
            return winjs_base_1.TPromise.as(null);
        };
        TestPartService.prototype.hasFocus = function (part) {
            return false;
        };
        TestPartService.prototype.isVisible = function (part) {
            return true;
        };
        TestPartService.prototype.getContainer = function (part) {
            return null;
        };
        TestPartService.prototype.isTitleBarHidden = function () {
            return false;
        };
        TestPartService.prototype.getTitleBarOffset = function () {
            return 0;
        };
        TestPartService.prototype.isStatusBarHidden = function () {
            return false;
        };
        TestPartService.prototype.isActivityBarHidden = function () {
            return false;
        };
        TestPartService.prototype.setActivityBarHidden = function (hidden) { };
        TestPartService.prototype.isSideBarHidden = function () {
            return false;
        };
        TestPartService.prototype.setSideBarHidden = function (hidden) { return winjs_base_1.TPromise.as(null); };
        TestPartService.prototype.isPanelHidden = function () {
            return false;
        };
        TestPartService.prototype.setPanelHidden = function (hidden) { return winjs_base_1.TPromise.as(null); };
        TestPartService.prototype.toggleMaximizedPanel = function () { };
        TestPartService.prototype.isPanelMaximized = function () {
            return false;
        };
        TestPartService.prototype.getSideBarPosition = function () {
            return 0;
        };
        TestPartService.prototype.addClass = function (clazz) { };
        TestPartService.prototype.removeClass = function (clazz) { };
        TestPartService.prototype.getWorkbenchElementId = function () { return ''; };
        TestPartService.prototype.toggleZenMode = function () { };
        TestPartService.prototype.resizePart = function (part, sizeChange) { };
        return TestPartService;
    }());
    exports.TestPartService = TestPartService;
    var TestStorageService = (function (_super) {
        __extends(TestStorageService, _super);
        function TestStorageService() {
            var _this = _super.call(this) || this;
            var context = new TestContextService();
            _this.storage = new storageService_1.StorageService(new storageService_1.InMemoryLocalStorage(), null, context.getWorkspace().id);
            return _this;
        }
        TestStorageService.prototype.store = function (key, value, scope) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            this.storage.store(key, value, scope);
        };
        TestStorageService.prototype.remove = function (key, scope) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            this.storage.remove(key, scope);
        };
        TestStorageService.prototype.get = function (key, scope, defaultValue) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            return this.storage.get(key, scope, defaultValue);
        };
        TestStorageService.prototype.getInteger = function (key, scope, defaultValue) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            return this.storage.getInteger(key, scope, defaultValue);
        };
        TestStorageService.prototype.getBoolean = function (key, scope, defaultValue) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            return this.storage.getBoolean(key, scope, defaultValue);
        };
        return TestStorageService;
    }(eventEmitter_1.EventEmitter));
    exports.TestStorageService = TestStorageService;
    var TestEditorGroupService = (function () {
        function TestEditorGroupService(callback) {
            this._onEditorsMoved = new event_1.Emitter();
            this._onEditorsChanged = new event_1.Emitter();
            this._onGroupOrientationChanged = new event_1.Emitter();
            this._onEditorOpenFail = new event_1.Emitter();
            this._onTabOptionsChanged = new event_1.Emitter();
            var services = new serviceCollection_1.ServiceCollection();
            services.set(storage_1.IStorageService, new TestStorageService());
            services.set(configuration_1.IConfigurationService, new testConfigurationService_1.TestConfigurationService());
            services.set(workspace_1.IWorkspaceContextService, new TestContextService());
            var lifecycle = new TestLifecycleService();
            services.set(lifecycle_1.ILifecycleService, lifecycle);
            services.set(telemetry_1.ITelemetryService, telemetryUtils_1.NullTelemetryService);
            var inst = new instantiationService_1.InstantiationService(services);
            this.stacksModel = inst.createInstance(editorStacksModel_1.EditorStacksModel, true);
        }
        TestEditorGroupService.prototype.fireChange = function () {
            this._onEditorsChanged.fire();
        };
        Object.defineProperty(TestEditorGroupService.prototype, "onEditorsChanged", {
            get: function () {
                return this._onEditorsChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestEditorGroupService.prototype, "onEditorOpenFail", {
            get: function () {
                return this._onEditorOpenFail.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestEditorGroupService.prototype, "onEditorsMoved", {
            get: function () {
                return this._onEditorsMoved.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestEditorGroupService.prototype, "onGroupOrientationChanged", {
            get: function () {
                return this._onGroupOrientationChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestEditorGroupService.prototype, "onTabOptionsChanged", {
            get: function () {
                return this._onTabOptionsChanged.event;
            },
            enumerable: true,
            configurable: true
        });
        TestEditorGroupService.prototype.focusGroup = function (arg1) {
        };
        TestEditorGroupService.prototype.activateGroup = function (arg1) {
        };
        TestEditorGroupService.prototype.moveGroup = function (arg1, arg2) {
        };
        TestEditorGroupService.prototype.arrangeGroups = function (arrangement) {
        };
        TestEditorGroupService.prototype.setGroupOrientation = function (orientation) {
        };
        TestEditorGroupService.prototype.getGroupOrientation = function () {
            return 'vertical';
        };
        TestEditorGroupService.prototype.resizeGroup = function (position, groupSizeChange) {
        };
        TestEditorGroupService.prototype.pinEditor = function (arg1, input) {
        };
        TestEditorGroupService.prototype.unpinEditor = function (arg1, input) {
        };
        TestEditorGroupService.prototype.moveEditor = function (input, from, to, moveOptions) {
        };
        TestEditorGroupService.prototype.getStacksModel = function () {
            return this.stacksModel;
        };
        TestEditorGroupService.prototype.getTabOptions = function () {
            return {};
        };
        return TestEditorGroupService;
    }());
    exports.TestEditorGroupService = TestEditorGroupService;
    var TestEditorService = (function () {
        function TestEditorService(callback) {
            this.callback = callback || (function (s) { });
            this.mockLineNumber = 15;
        }
        TestEditorService.prototype.openEditors = function (inputs) {
            return winjs_base_1.TPromise.as([]);
        };
        TestEditorService.prototype.replaceEditors = function (editors) {
            return winjs_base_1.TPromise.as([]);
        };
        TestEditorService.prototype.closeEditors = function (position, filter) {
            return winjs_base_1.TPromise.as(null);
        };
        TestEditorService.prototype.closeAllEditors = function (except) {
            return winjs_base_1.TPromise.as(null);
        };
        TestEditorService.prototype.isVisible = function (input, includeDiff) {
            return false;
        };
        TestEditorService.prototype.getActiveEditor = function () {
            var _this = this;
            this.callback('getActiveEditor');
            return {
                input: null,
                options: null,
                position: null,
                getId: function () { return null; },
                getControl: function () {
                    return {
                        getSelection: function () { return { positionLineNumber: _this.mockLineNumber }; }
                    };
                },
                focus: function () { },
                isVisible: function () { return true; }
            };
        };
        TestEditorService.prototype.getActiveEditorInput = function () {
            this.callback('getActiveEditorInput');
            return this.activeEditorInput;
        };
        TestEditorService.prototype.getVisibleEditors = function () {
            this.callback('getVisibleEditors');
            return [];
        };
        TestEditorService.prototype.openEditor = function (input, options, position) {
            this.callback('openEditor');
            this.activeEditorInput = input;
            this.activeEditorOptions = options;
            this.activeEditorPosition = position;
            return winjs_base_1.TPromise.as(null);
        };
        TestEditorService.prototype.closeEditor = function (position, input) {
            this.callback('closeEditor');
            return winjs_base_1.TPromise.as(null);
        };
        TestEditorService.prototype.createInput = function (input) {
            return null;
        };
        return TestEditorService;
    }());
    exports.TestEditorService = TestEditorService;
    var TestFileService = (function () {
        function TestFileService() {
            this._onFileChanges = new event_1.Emitter();
            this._onAfterOperation = new event_1.Emitter();
        }
        Object.defineProperty(TestFileService.prototype, "onFileChanges", {
            get: function () {
                return this._onFileChanges.event;
            },
            enumerable: true,
            configurable: true
        });
        TestFileService.prototype.fireFileChanges = function (event) {
            this._onFileChanges.fire(event);
        };
        Object.defineProperty(TestFileService.prototype, "onAfterOperation", {
            get: function () {
                return this._onAfterOperation.event;
            },
            enumerable: true,
            configurable: true
        });
        TestFileService.prototype.fireAfterOperation = function (event) {
            this._onAfterOperation.fire(event);
        };
        TestFileService.prototype.resolveFile = function (resource, options) {
            return winjs_base_1.TPromise.as({
                resource: resource,
                etag: Date.now().toString(),
                encoding: 'utf8',
                mtime: Date.now(),
                isDirectory: false,
                hasChildren: false,
                name: paths.basename(resource.fsPath)
            });
        };
        TestFileService.prototype.resolveFiles = function (toResolve) {
            var _this = this;
            return winjs_base_1.TPromise.join(toResolve.map(function (resourceAndOption) { return _this.resolveFile(resourceAndOption.resource, resourceAndOption.options); })).then(function (stats) { return stats.map(function (stat) { return ({ stat: stat, success: true }); }); });
        };
        TestFileService.prototype.existsFile = function (resource) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.resolveContent = function (resource, options) {
            return winjs_base_1.TPromise.as({
                resource: resource,
                value: 'Hello Html',
                etag: 'index.txt',
                encoding: 'utf8',
                mtime: Date.now(),
                name: paths.basename(resource.fsPath)
            });
        };
        TestFileService.prototype.resolveStreamContent = function (resource, options) {
            return winjs_base_1.TPromise.as({
                resource: resource,
                value: {
                    on: function (event, callback) {
                        if (event === 'data') {
                            callback('Hello Html');
                        }
                        if (event === 'end') {
                            callback();
                        }
                    }
                },
                etag: 'index.txt',
                encoding: 'utf8',
                mtime: Date.now(),
                name: paths.basename(resource.fsPath)
            });
        };
        TestFileService.prototype.updateContent = function (resource, value, options) {
            return winjs_base_1.TPromise.timeout(1).then(function () {
                return {
                    resource: resource,
                    etag: 'index.txt',
                    encoding: 'utf8',
                    mtime: Date.now(),
                    isDirectory: false,
                    hasChildren: false,
                    name: paths.basename(resource.fsPath)
                };
            });
        };
        TestFileService.prototype.moveFile = function (source, target, overwrite) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.copyFile = function (source, target, overwrite) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.createFile = function (resource, content) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.createFolder = function (resource) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.rename = function (resource, newName) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.touchFile = function (resource) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.del = function (resource, useTrash) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.importFile = function (source, targetFolder) {
            return winjs_base_1.TPromise.as(null);
        };
        TestFileService.prototype.watchFileChanges = function (resource) {
        };
        TestFileService.prototype.unwatchFileChanges = function (resource) {
        };
        TestFileService.prototype.updateOptions = function (options) {
        };
        TestFileService.prototype.getEncoding = function (resource) {
            return 'utf8';
        };
        TestFileService.prototype.dispose = function () {
        };
        return TestFileService;
    }());
    exports.TestFileService = TestFileService;
    var TestBackupFileService = (function () {
        function TestBackupFileService() {
        }
        TestBackupFileService.prototype.hasBackups = function () {
            return winjs_base_1.TPromise.as(false);
        };
        TestBackupFileService.prototype.hasBackup = function (resource) {
            return winjs_base_1.TPromise.as(false);
        };
        TestBackupFileService.prototype.loadBackupResource = function (resource) {
            var _this = this;
            return this.hasBackup(resource).then(function (hasBackup) {
                if (hasBackup) {
                    return _this.getBackupResource(resource);
                }
                return void 0;
            });
        };
        TestBackupFileService.prototype.registerResourceForBackup = function (resource) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestBackupFileService.prototype.deregisterResourceForBackup = function (resource) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestBackupFileService.prototype.getBackupResource = function (resource) {
            return null;
        };
        TestBackupFileService.prototype.backupResource = function (resource, content) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestBackupFileService.prototype.getWorkspaceFileBackups = function () {
            return winjs_base_1.TPromise.as([]);
        };
        TestBackupFileService.prototype.parseBackupContent = function (rawText) {
            return rawText.lines.join('\n');
        };
        TestBackupFileService.prototype.discardResourceBackup = function (resource) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestBackupFileService.prototype.discardAllWorkspaceBackups = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        return TestBackupFileService;
    }());
    exports.TestBackupFileService = TestBackupFileService;
    ;
    var TestWindowService = (function () {
        function TestWindowService() {
        }
        TestWindowService.prototype.isFocused = function () {
            return winjs_base_1.TPromise.as(false);
        };
        TestWindowService.prototype.getCurrentWindowId = function () {
            return 0;
        };
        TestWindowService.prototype.pickFileFolderAndOpen = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.pickFileAndOpen = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.pickFolderAndOpen = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.reloadWindow = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.openDevTools = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.toggleDevTools = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.closeWorkspace = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.openWorkspace = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.createAndOpenWorkspace = function (folders, path) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.saveAndOpenWorkspace = function (path) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.toggleFullScreen = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.setRepresentedFilename = function (fileName) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.getRecentlyOpened = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.focusWindow = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.closeWindow = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.setDocumentEdited = function (flag) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.isMaximized = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.maximizeWindow = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.unmaximizeWindow = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.onWindowTitleDoubleClick = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowService.prototype.showMessageBox = function (options) {
            return 0;
        };
        TestWindowService.prototype.showSaveDialog = function (options, callback) {
            return void 0;
        };
        TestWindowService.prototype.showOpenDialog = function (options, callback) {
            return void 0;
        };
        return TestWindowService;
    }());
    exports.TestWindowService = TestWindowService;
    var TestLifecycleService = (function () {
        function TestLifecycleService() {
            this._onDidChangePhase = new event_1.Emitter();
            this._onWillShutdown = new event_1.Emitter();
            this._onShutdown = new event_1.Emitter();
        }
        TestLifecycleService.prototype.fireShutdown = function (reason) {
            if (reason === void 0) { reason = lifecycle_1.ShutdownReason.QUIT; }
            this._onShutdown.fire(reason);
        };
        TestLifecycleService.prototype.fireWillShutdown = function (event) {
            this._onWillShutdown.fire(event);
        };
        Object.defineProperty(TestLifecycleService.prototype, "onDidChangePhase", {
            get: function () {
                return this._onDidChangePhase.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestLifecycleService.prototype, "onWillShutdown", {
            get: function () {
                return this._onWillShutdown.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestLifecycleService.prototype, "onShutdown", {
            get: function () {
                return this._onShutdown.event;
            },
            enumerable: true,
            configurable: true
        });
        return TestLifecycleService;
    }());
    exports.TestLifecycleService = TestLifecycleService;
    var TestWindowsService = (function () {
        function TestWindowsService() {
            this.windowCount = 1;
        }
        TestWindowsService.prototype.isFocused = function (windowId) {
            return winjs_base_1.TPromise.as(false);
        };
        TestWindowsService.prototype.pickFileFolderAndOpen = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.pickFileAndOpen = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.pickFolderAndOpen = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.reloadWindow = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.openDevTools = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.toggleDevTools = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.closeWorkspace = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.openWorkspace = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.createAndOpenWorkspace = function (windowId, folders, path) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.saveAndOpenWorkspace = function (windowId, path) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.toggleFullScreen = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.setRepresentedFilename = function (windowId, fileName) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.addRecentlyOpened = function (files) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.removeFromRecentlyOpened = function (paths) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.clearRecentlyOpened = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.getRecentlyOpened = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.focusWindow = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.closeWindow = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.isMaximized = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.maximizeWindow = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.unmaximizeWindow = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.onWindowTitleDoubleClick = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.setDocumentEdited = function (windowId, flag) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.quit = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.relaunch = function (options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.whenSharedProcessReady = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.toggleSharedProcess = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        // Global methods
        TestWindowsService.prototype.openWindow = function (paths, options) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.openNewWindow = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.showWindow = function (windowId) {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.getWindows = function () {
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.getWindowCount = function () {
            return winjs_base_1.TPromise.as(this.windowCount);
        };
        TestWindowsService.prototype.log = function (severity) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            return winjs_base_1.TPromise.as(void 0);
        };
        TestWindowsService.prototype.showItemInFolder = function (path) {
            return winjs_base_1.TPromise.as(void 0);
        };
        // This needs to be handled from browser process to prevent
        // foreground ordering issues on Windows
        TestWindowsService.prototype.openExternal = function (url) {
            return winjs_base_1.TPromise.as(true);
        };
        // TODO: this is a bit backwards
        TestWindowsService.prototype.startCrashReporter = function (config) {
            return winjs_base_1.TPromise.as(void 0);
        };
        return TestWindowsService;
    }());
    exports.TestWindowsService = TestWindowsService;
});
//# sourceMappingURL=workbenchTestServices.js.map