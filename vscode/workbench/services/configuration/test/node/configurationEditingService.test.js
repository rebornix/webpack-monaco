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
define(["require", "exports", "sinon", "assert", "os", "path", "fs", "vs/base/common/json", "vs/base/common/winjs.base", "vs/platform/registry/common/platform", "vs/platform/environment/common/environment", "vs/platform/environment/node/argv", "vs/platform/workspace/common/workspace", "vs/platform/environment/node/environmentService", "vs/base/node/extfs", "vs/workbench/test/workbenchTestServices", "vs/base/common/uuid", "vs/platform/configuration/common/configurationRegistry", "vs/workbench/services/configuration/node/configuration", "vs/workbench/services/files/node/fileService", "vs/workbench/services/configuration/node/configurationEditingService", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/files/common/files", "vs/workbench/services/configuration/common/configuration", "vs/platform/configuration/common/configuration", "vs/workbench/services/untitled/common/untitledEditorService", "vs/platform/lifecycle/common/lifecycle", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils", "vs/workbench/services/backup/common/backup", "vs/workbench/services/group/common/groupService", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/workbench/services/textfile/common/textfiles", "vs/editor/common/services/resolverService", "vs/workbench/services/textmodelResolver/common/textModelResolverService", "vs/editor/common/services/modeService", "vs/editor/common/services/modeServiceImpl", "vs/editor/common/services/modelService", "vs/editor/common/services/modelServiceImpl", "vs/platform/message/common/message", "vs/platform/configuration/test/common/testConfigurationService", "vs/platform/workspaces/common/workspaces"], function (require, exports, sinon, assert, os, path, fs, json, winjs_base_1, platform_1, environment_1, argv_1, workspace_1, environmentService_1, extfs, workbenchTestServices_1, uuid, configurationRegistry_1, configuration_1, fileService_1, configurationEditingService_1, configurationEditing_1, files_1, configuration_2, configuration_3, untitledEditorService_1, lifecycle_1, telemetry_1, telemetryUtils_1, backup_1, groupService_1, instantiationServiceMock_1, textfiles_1, resolverService_1, textModelResolverService_1, modeService_1, modeServiceImpl_1, modelService_1, modelServiceImpl_1, message_1, testConfigurationService_1, workspaces_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsTestEnvironmentService = (function (_super) {
        __extends(SettingsTestEnvironmentService, _super);
        function SettingsTestEnvironmentService(args, _execPath, customAppSettingsHome) {
            var _this = _super.call(this, args, _execPath) || this;
            _this.customAppSettingsHome = customAppSettingsHome;
            return _this;
        }
        Object.defineProperty(SettingsTestEnvironmentService.prototype, "appSettingsPath", {
            get: function () { return this.customAppSettingsHome; },
            enumerable: true,
            configurable: true
        });
        return SettingsTestEnvironmentService;
    }(environmentService_1.EnvironmentService));
    suite('ConfigurationEditingService', function () {
        var instantiationService;
        var testObject;
        var parentDir;
        var workspaceDir;
        var globalSettingsFile;
        var workspaceSettingsDir;
        var choiceService;
        suiteSetup(function () {
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
            configurationRegistry.registerConfiguration({
                'id': '_test',
                'type': 'object',
                'properties': {
                    'configurationEditing.service.testSetting': {
                        'type': 'string',
                        'default': 'isSet'
                    },
                    'configurationEditing.service.testSettingTwo': {
                        'type': 'string',
                        'default': 'isSet'
                    },
                    'configurationEditing.service.testSettingThree': {
                        'type': 'string',
                        'default': 'isSet'
                    }
                }
            });
        });
        setup(function () {
            return setUpWorkspace()
                .then(function () { return setUpServices(); });
        });
        function setUpWorkspace() {
            return new winjs_base_1.TPromise(function (c, e) {
                var id = uuid.generateUuid();
                parentDir = path.join(os.tmpdir(), 'vsctests', id);
                workspaceDir = path.join(parentDir, 'workspaceconfig', id);
                globalSettingsFile = path.join(workspaceDir, 'config.json');
                workspaceSettingsDir = path.join(workspaceDir, '.vscode');
                extfs.mkdirp(workspaceSettingsDir, 493, function (error) {
                    if (error) {
                        e(error);
                    }
                    else {
                        c(null);
                    }
                });
            });
        }
        function setUpServices(noWorkspace) {
            if (noWorkspace === void 0) { noWorkspace = false; }
            // Clear services if they are already created
            clearServices();
            instantiationService = new instantiationServiceMock_1.TestInstantiationService();
            var environmentService = new SettingsTestEnvironmentService(argv_1.parseArgs(process.argv), process.execPath, globalSettingsFile);
            instantiationService.stub(environment_1.IEnvironmentService, environmentService);
            var workspacesService = instantiationService.stub(workspaces_1.IWorkspacesService, {});
            var workspaceService = noWorkspace ? new configuration_1.EmptyWorkspaceServiceImpl(environmentService) : new configuration_1.WorkspaceServiceImpl(workspaceDir, environmentService, workspacesService);
            instantiationService.stub(workspace_1.IWorkspaceContextService, workspaceService);
            instantiationService.stub(configuration_3.IConfigurationService, workspaceService);
            instantiationService.stub(lifecycle_1.ILifecycleService, new workbenchTestServices_1.TestLifecycleService());
            instantiationService.stub(groupService_1.IEditorGroupService, new workbenchTestServices_1.TestEditorGroupService());
            instantiationService.stub(telemetry_1.ITelemetryService, telemetryUtils_1.NullTelemetryService);
            instantiationService.stub(modeService_1.IModeService, modeServiceImpl_1.ModeServiceImpl);
            instantiationService.stub(modelService_1.IModelService, instantiationService.createInstance(modelServiceImpl_1.ModelServiceImpl));
            instantiationService.stub(files_1.IFileService, new fileService_1.FileService(workspaceService, new testConfigurationService_1.TestConfigurationService(), { disableWatcher: true }));
            instantiationService.stub(untitledEditorService_1.IUntitledEditorService, instantiationService.createInstance(untitledEditorService_1.UntitledEditorService));
            instantiationService.stub(textfiles_1.ITextFileService, instantiationService.createInstance(workbenchTestServices_1.TestTextFileService));
            instantiationService.stub(resolverService_1.ITextModelService, instantiationService.createInstance(textModelResolverService_1.TextModelResolverService));
            instantiationService.stub(backup_1.IBackupFileService, new workbenchTestServices_1.TestBackupFileService());
            choiceService = instantiationService.stub(message_1.IChoiceService, {
                choose: function (severity, message, options, cancelId) {
                    return winjs_base_1.TPromise.as(cancelId);
                }
            });
            instantiationService.stub(message_1.IMessageService, {
                show: function (severity, message, options, cancelId) { }
            });
            testObject = instantiationService.createInstance(configurationEditingService_1.ConfigurationEditingService);
            return workspaceService.initialize();
        }
        teardown(function () {
            clearServices();
            return clearWorkspace();
        });
        function clearServices() {
            if (instantiationService) {
                var configuraitonService = instantiationService.get(configuration_3.IConfigurationService);
                if (configuraitonService) {
                    configuraitonService.dispose();
                }
                instantiationService = null;
            }
        }
        function clearWorkspace() {
            return new winjs_base_1.TPromise(function (c, e) {
                if (parentDir) {
                    extfs.del(parentDir, os.tmpdir(), function () { return c(null); }, function () { return c(null); });
                }
                else {
                    c(null);
                }
            }).then(function () { return parentDir = null; });
        }
        test('errors cases - invalid key', function () {
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'unknown.key', value: 'value' })
                .then(function () { return assert.fail('Should fail with ERROR_UNKNOWN_KEY'); }, function (error) { return assert.equal(error.code, configurationEditing_1.ConfigurationEditingErrorCode.ERROR_UNKNOWN_KEY); });
        });
        test('errors cases - invalid target', function () {
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'tasks.something', value: 'value' })
                .then(function () { return assert.fail('Should fail with ERROR_INVALID_TARGET'); }, function (error) { return assert.equal(error.code, configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_USER_TARGET); });
        });
        test('errors cases - no workspace', function () {
            return setUpServices(true)
                .then(function () { return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'configurationEditing.service.testSetting', value: 'value' }); })
                .then(function () { return assert.fail('Should fail with ERROR_NO_WORKSPACE_OPENED'); }, function (error) { return assert.equal(error.code, configurationEditing_1.ConfigurationEditingErrorCode.ERROR_NO_WORKSPACE_OPENED); });
        });
        test('errors cases - invalid configuration', function () {
            fs.writeFileSync(globalSettingsFile, ',,,,,,,,,,,,,,');
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'configurationEditing.service.testSetting', value: 'value' })
                .then(function () { return assert.fail('Should fail with ERROR_INVALID_CONFIGURATION'); }, function (error) { return assert.equal(error.code, configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION); });
        });
        test('errors cases - dirty', function () {
            instantiationService.stub(textfiles_1.ITextFileService, 'isDirty', true);
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'configurationEditing.service.testSetting', value: 'value' })
                .then(function () { return assert.fail('Should fail with ERROR_CONFIGURATION_FILE_DIRTY error.'); }, function (error) { return assert.equal(error.code, configurationEditing_1.ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY); });
        });
        test('dirty error is not thrown if not asked to save', function () {
            instantiationService.stub(textfiles_1.ITextFileService, 'isDirty', true);
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'configurationEditing.service.testSetting', value: 'value' }, { donotSave: true })
                .then(function () { return null; }, function (error) { return assert.fail('Should not fail.'); });
        });
        test('do not notify error', function () {
            instantiationService.stub(textfiles_1.ITextFileService, 'isDirty', true);
            var target = sinon.stub();
            instantiationService.stubPromise(message_1.IChoiceService, 'choose', target);
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'configurationEditing.service.testSetting', value: 'value' }, { donotNotifyError: true })
                .then(function () { return assert.fail('Should fail with ERROR_CONFIGURATION_FILE_DIRTY error.'); }, function (error) {
                assert.equal(false, target.calledOnce);
                assert.equal(error.code, configurationEditing_1.ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY);
            });
        });
        test('write one setting - empty file', function () {
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'configurationEditing.service.testSetting', value: 'value' })
                .then(function () {
                var contents = fs.readFileSync(globalSettingsFile).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['configurationEditing.service.testSetting'], 'value');
                assert.equal(instantiationService.get(configuration_3.IConfigurationService).lookup('configurationEditing.service.testSetting').value, 'value');
            });
        });
        test('write one setting - existing file', function () {
            fs.writeFileSync(globalSettingsFile, '{ "my.super.setting": "my.super.value" }');
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'configurationEditing.service.testSetting', value: 'value' })
                .then(function () {
                var contents = fs.readFileSync(globalSettingsFile).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['configurationEditing.service.testSetting'], 'value');
                assert.equal(parsed['my.super.setting'], 'my.super.value');
                var configurationService = instantiationService.get(configuration_3.IConfigurationService);
                assert.equal(configurationService.lookup('configurationEditing.service.testSetting').value, 'value');
                assert.equal(configurationService.lookup('my.super.setting').value, 'my.super.value');
            });
        });
        test('write workspace standalone setting - empty file', function () {
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'tasks.service.testSetting', value: 'value' })
                .then(function () {
                var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['tasks']);
                var contents = fs.readFileSync(target).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['service.testSetting'], 'value');
                var configurationService = instantiationService.get(configuration_3.IConfigurationService);
                assert.equal(configurationService.lookup('tasks.service.testSetting').value, 'value');
            });
        });
        test('write workspace standalone setting - existing file', function () {
            var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['launch']);
            fs.writeFileSync(target, '{ "my.super.setting": "my.super.value" }');
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'launch.service.testSetting', value: 'value' })
                .then(function () {
                var contents = fs.readFileSync(target).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['service.testSetting'], 'value');
                assert.equal(parsed['my.super.setting'], 'my.super.value');
                var configurationService = instantiationService.get(configuration_3.IConfigurationService);
                assert.equal(configurationService.lookup('launch.service.testSetting').value, 'value');
                assert.equal(configurationService.lookup('launch.my.super.setting').value, 'my.super.value');
            });
        });
        test('write workspace standalone setting - empty file - full JSON', function () {
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'tasks', value: { 'version': '1.0.0', tasks: [{ 'taskName': 'myTask' }] } })
                .then(function () {
                var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['tasks']);
                var contents = fs.readFileSync(target).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['version'], '1.0.0');
                assert.equal(parsed['tasks'][0]['taskName'], 'myTask');
            });
        });
        test('write workspace standalone setting - existing file - full JSON', function () {
            var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['launch']);
            fs.writeFileSync(target, '{ "my.super.setting": "my.super.value" }');
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'tasks', value: { 'version': '1.0.0', tasks: [{ 'taskName': 'myTask' }] } })
                .then(function () {
                var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['tasks']);
                var contents = fs.readFileSync(target).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['version'], '1.0.0');
                assert.equal(parsed['tasks'][0]['taskName'], 'myTask');
            });
        });
        test('write workspace standalone setting - existing file with JSON errors - full JSON', function () {
            var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['launch']);
            fs.writeFileSync(target, '{ "my.super.setting": '); // invalid JSON
            return testObject.writeConfiguration(configurationEditing_1.ConfigurationTarget.WORKSPACE, { key: 'tasks', value: { 'version': '1.0.0', tasks: [{ 'taskName': 'myTask' }] } })
                .then(function () {
                var target = path.join(workspaceDir, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS['tasks']);
                var contents = fs.readFileSync(target).toString('utf8');
                var parsed = json.parse(contents);
                assert.equal(parsed['version'], '1.0.0');
                assert.equal(parsed['tasks'][0]['taskName'], 'myTask');
            });
        });
    });
});
//# sourceMappingURL=configurationEditingService.test.js.map