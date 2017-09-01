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
define(["require", "exports", "assert", "os", "path", "fs", "sinon", "vs/base/common/uri", "vs/platform/registry/common/platform", "vs/platform/environment/node/environmentService", "vs/platform/environment/node/argv", "vs/base/node/extfs", "vs/base/common/uuid", "vs/platform/configuration/common/configurationRegistry", "vs/workbench/services/configuration/node/configuration", "vs/platform/files/common/files"], function (require, exports, assert, os, path, fs, sinon, uri_1, platform_1, environmentService_1, argv_1, extfs, uuid, configurationRegistry_1, configuration_1, files_1) {
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
    suite('WorkspaceConfigurationService - Node', function () {
        function createWorkspace(callback) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var workspaceDir = path.join(parentDir, 'workspaceconfig', id);
            var workspaceSettingsDir = path.join(workspaceDir, '.vscode');
            var globalSettingsFile = path.join(workspaceDir, 'config.json');
            extfs.mkdirp(workspaceSettingsDir, 493, function (error) {
                callback(workspaceDir, globalSettingsFile, function (callback) { return extfs.del(parentDir, os.tmpdir(), function () { }, callback); });
            });
        }
        function createService(workspaceDir, globalSettingsFile) {
            var environmentService = new SettingsTestEnvironmentService(argv_1.parseArgs(process.argv), process.execPath, globalSettingsFile);
            var service = new configuration_1.WorkspaceServiceImpl(workspaceDir, environmentService, null);
            return service.initialize().then(function () { return service; });
        }
        test('defaults', function (done) {
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
            configurationRegistry.registerConfiguration({
                'id': '_test_workspace',
                'type': 'object',
                'properties': {
                    'workspace.service.testSetting': {
                        'type': 'string',
                        'default': 'isSet'
                    }
                }
            });
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var config = service.getConfiguration();
                    assert.equal(config.workspace.service.testSetting, 'isSet');
                    service.dispose();
                    cleanUp(done);
                });
            });
        });
        test('globals', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    fs.writeFileSync(globalSettingsFile, '{ "testworkbench.editor.tabs": true }');
                    service.reloadConfiguration().then(function () {
                        var config = service.getConfiguration();
                        assert.equal(config.testworkbench.editor.tabs, true);
                        service.dispose();
                        cleanUp(done);
                    });
                });
            });
        });
        test('reload configuration emits events', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    fs.writeFileSync(globalSettingsFile, '{ "testworkbench.editor.tabs": true }');
                    return service.initialize().then(function () {
                        service.onDidUpdateConfiguration(function (event) {
                            var config = service.getConfiguration();
                            assert.equal(config.testworkbench.editor.tabs, false);
                            service.dispose();
                            cleanUp(done);
                        });
                        fs.writeFileSync(globalSettingsFile, '{ "testworkbench.editor.tabs": false }');
                        // this has to trigger the event since the config changes
                        service.reloadConfiguration().done();
                    });
                });
            });
        });
        test('globals override defaults', function (done) {
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
            configurationRegistry.registerConfiguration({
                'id': '_test_workspace',
                'type': 'object',
                'properties': {
                    'workspace.service.testSetting': {
                        'type': 'string',
                        'default': 'isSet'
                    }
                }
            });
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    fs.writeFileSync(globalSettingsFile, '{ "workspace.service.testSetting": "isChanged" }');
                    service.reloadConfiguration().then(function () {
                        var config = service.getConfiguration();
                        assert.equal(config.workspace.service.testSetting, 'isChanged');
                        service.dispose();
                        cleanUp(done);
                    });
                });
            });
        });
        test('workspace settings', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    fs.writeFileSync(path.join(workspaceDir, '.vscode', 'settings.json'), '{ "testworkbench.editor.icons": true }');
                    service.reloadConfiguration().then(function () {
                        var config = service.getConfiguration();
                        assert.equal(config.testworkbench.editor.icons, true);
                        service.dispose();
                        cleanUp(done);
                    });
                });
            });
        });
        test('workspace settings override user settings', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    fs.writeFileSync(globalSettingsFile, '{ "testworkbench.editor.icons": false, "testworkbench.other.setting": true }');
                    fs.writeFileSync(path.join(workspaceDir, '.vscode', 'settings.json'), '{ "testworkbench.editor.icons": true }');
                    service.reloadConfiguration().then(function () {
                        var config = service.getConfiguration();
                        assert.equal(config.testworkbench.editor.icons, true);
                        assert.equal(config.testworkbench.other.setting, true);
                        service.dispose();
                        cleanUp(done);
                    });
                });
            });
        });
        test('workspace change triggers event', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    service.onDidUpdateConfiguration(function (event) {
                        var config = service.getConfiguration();
                        assert.equal(config.testworkbench.editor.icons, true);
                        assert.equal(service.getConfiguration().testworkbench.editor.icons, true);
                        service.dispose();
                        cleanUp(done);
                    });
                    var settingsFile = path.join(workspaceDir, '.vscode', 'settings.json');
                    fs.writeFileSync(settingsFile, '{ "testworkbench.editor.icons": true }');
                    var event = new files_1.FileChangesEvent([{ resource: uri_1.default.file(settingsFile), type: files_1.FileChangeType.ADDED }]);
                    service.handleWorkspaceFileEvents(event);
                });
            });
        });
        test('workspace reload should triggers event if content changed', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var settingsFile = path.join(workspaceDir, '.vscode', 'settings.json');
                    fs.writeFileSync(settingsFile, '{ "testworkbench.editor.icons": true }');
                    var target = sinon.stub();
                    service.onDidUpdateConfiguration(function (event) { return target(); });
                    fs.writeFileSync(settingsFile, '{ "testworkbench.editor.icons": false }');
                    service.reloadConfiguration().done(function () {
                        assert.ok(target.calledOnce);
                        service.dispose();
                        cleanUp(done);
                    });
                });
            });
        });
        test('workspace reload should not trigger event if nothing changed', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var settingsFile = path.join(workspaceDir, '.vscode', 'settings.json');
                    fs.writeFileSync(settingsFile, '{ "testworkbench.editor.icons": true }');
                    service.reloadConfiguration().done(function () {
                        var target = sinon.stub();
                        service.onDidUpdateConfiguration(function (event) { return target(); });
                        service.reloadConfiguration().done(function () {
                            assert.ok(!target.called);
                            service.dispose();
                            cleanUp(done);
                        });
                    });
                });
            });
        });
        test('workspace reload should not trigger event if there is no model', function (done) {
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var target = sinon.stub();
                    service.onDidUpdateConfiguration(function (event) { return target(); });
                    service.reloadConfiguration().done(function () {
                        assert.ok(!target.called);
                        service.dispose();
                        cleanUp(done);
                    });
                });
            });
        });
        test('lookup', function (done) {
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
            configurationRegistry.registerConfiguration({
                'id': '_test',
                'type': 'object',
                'properties': {
                    'workspaceLookup.service.testSetting': {
                        'type': 'string',
                        'default': 'isSet'
                    }
                }
            });
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var res = service.lookup('something.missing');
                    assert.ok(!res.default);
                    assert.ok(!res.user);
                    assert.ok(!res.workspace);
                    assert.ok(!res.value);
                    res = service.lookup('workspaceLookup.service.testSetting');
                    assert.equal(res.default, 'isSet');
                    assert.equal(res.value, 'isSet');
                    assert.ok(!res.user);
                    assert.ok(!res.workspace);
                    fs.writeFileSync(globalSettingsFile, '{ "workspaceLookup.service.testSetting": true }');
                    return service.reloadConfiguration().then(function () {
                        res = service.lookup('workspaceLookup.service.testSetting');
                        assert.equal(res.default, 'isSet');
                        assert.equal(res.user, true);
                        assert.equal(res.value, true);
                        assert.ok(!res.workspace);
                        var settingsFile = path.join(workspaceDir, '.vscode', 'settings.json');
                        fs.writeFileSync(settingsFile, '{ "workspaceLookup.service.testSetting": 55 }');
                        return service.reloadConfiguration().then(function () {
                            res = service.lookup('workspaceLookup.service.testSetting');
                            assert.equal(res.default, 'isSet');
                            assert.equal(res.user, true);
                            assert.equal(res.workspace, 55);
                            assert.equal(res.value, 55);
                            service.dispose();
                            cleanUp(done);
                        });
                    });
                });
            });
        });
        test('keys', function (done) {
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
            configurationRegistry.registerConfiguration({
                'id': '_test',
                'type': 'object',
                'properties': {
                    'workspaceLookup.service.testSetting': {
                        'type': 'string',
                        'default': 'isSet'
                    }
                }
            });
            function contains(array, key) {
                return array.indexOf(key) >= 0;
            }
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var keys = service.keys();
                    assert.ok(!contains(keys.default, 'something.missing'));
                    assert.ok(!contains(keys.user, 'something.missing'));
                    assert.ok(!contains(keys.workspace, 'something.missing'));
                    assert.ok(contains(keys.default, 'workspaceLookup.service.testSetting'));
                    assert.ok(!contains(keys.user, 'workspaceLookup.service.testSetting'));
                    assert.ok(!contains(keys.workspace, 'workspaceLookup.service.testSetting'));
                    fs.writeFileSync(globalSettingsFile, '{ "workspaceLookup.service.testSetting": true }');
                    return service.reloadConfiguration().then(function () {
                        keys = service.keys();
                        assert.ok(contains(keys.default, 'workspaceLookup.service.testSetting'));
                        assert.ok(contains(keys.user, 'workspaceLookup.service.testSetting'));
                        assert.ok(!contains(keys.workspace, 'workspaceLookup.service.testSetting'));
                        var settingsFile = path.join(workspaceDir, '.vscode', 'settings.json');
                        fs.writeFileSync(settingsFile, '{ "workspaceLookup.service.testSetting": 55 }');
                        return service.reloadConfiguration().then(function () {
                            keys = service.keys();
                            assert.ok(contains(keys.default, 'workspaceLookup.service.testSetting'));
                            assert.ok(contains(keys.user, 'workspaceLookup.service.testSetting'));
                            assert.ok(contains(keys.workspace, 'workspaceLookup.service.testSetting'));
                            var settingsFile = path.join(workspaceDir, '.vscode', 'tasks.json');
                            fs.writeFileSync(settingsFile, '{ "workspaceLookup.service.taskTestSetting": 55 }');
                            return service.reloadConfiguration().then(function () {
                                keys = service.keys();
                                assert.ok(!contains(keys.default, 'tasks.workspaceLookup.service.taskTestSetting'));
                                assert.ok(!contains(keys.user, 'tasks.workspaceLookup.service.taskTestSetting'));
                                assert.ok(contains(keys.workspace, 'tasks.workspaceLookup.service.taskTestSetting'));
                                service.dispose();
                                cleanUp(done);
                            });
                        });
                    });
                });
            });
        });
        test('values', function (done) {
            var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
            configurationRegistry.registerConfiguration({
                'id': '_test',
                'type': 'object',
                'properties': {
                    'workspaceLookup.service.testSetting': {
                        'type': 'string',
                        'default': 'isSet'
                    }
                }
            });
            createWorkspace(function (workspaceDir, globalSettingsFile, cleanUp) {
                return createService(workspaceDir, globalSettingsFile).then(function (service) {
                    var values = service.values();
                    var value = values['workspaceLookup.service.testSetting'];
                    assert.ok(value);
                    assert.equal(value.default, 'isSet');
                    fs.writeFileSync(globalSettingsFile, '{ "workspaceLookup.service.testSetting": true }');
                    return service.reloadConfiguration().then(function () {
                        values = service.values();
                        value = values['workspaceLookup.service.testSetting'];
                        assert.ok(value);
                        assert.equal(value.user, true);
                        var settingsFile = path.join(workspaceDir, '.vscode', 'settings.json');
                        fs.writeFileSync(settingsFile, '{ "workspaceLookup.service.testSetting": 55 }');
                        return service.reloadConfiguration().then(function () {
                            values = service.values();
                            value = values['workspaceLookup.service.testSetting'];
                            assert.ok(value);
                            assert.equal(value.user, true);
                            assert.equal(value.workspace, 55);
                            done();
                        });
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=configuration.test.js.map