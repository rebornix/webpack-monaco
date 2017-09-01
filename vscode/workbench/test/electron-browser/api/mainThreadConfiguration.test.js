/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "sinon", "vs/base/common/uri", "vs/platform/registry/common/platform", "vs/platform/configuration/common/configurationRegistry", "vs/platform/workspace/common/workspace", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/workbench/api/electron-browser/mainThreadConfiguration", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/services/configuration/node/configurationEditingService", "./testThreadService", "vs/platform/configuration/common/configuration", "vs/platform/configuration/test/common/testConfigurationService"], function (require, exports, assert, sinon, uri_1, platform_1, configurationRegistry_1, workspace_1, instantiationServiceMock_1, mainThreadConfiguration_1, configurationEditing_1, configurationEditingService_1, testThreadService_1, configuration_1, testConfigurationService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostConfiguration', function () {
        var instantiationService;
        var target;
        suiteSetup(function () {
            platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
                'id': 'extHostConfiguration',
                'title': 'a',
                'type': 'object',
                'properties': {
                    'extHostConfiguration.resource': {
                        'description': 'extHostConfiguration.resource',
                        'type': 'boolean',
                        'default': true,
                        'scope': configurationRegistry_1.ConfigurationScope.RESOURCE
                    },
                    'extHostConfiguration.window': {
                        'description': 'extHostConfiguration.resource',
                        'type': 'boolean',
                        'default': true,
                        'scope': configurationRegistry_1.ConfigurationScope.WINDOW
                    }
                }
            });
        });
        setup(function () {
            instantiationService = new instantiationServiceMock_1.TestInstantiationService();
            instantiationService.stub(configuration_1.IConfigurationService, new testConfigurationService_1.TestConfigurationService());
            target = sinon.spy();
            instantiationService.stub(configurationEditing_1.IConfigurationEditingService, configurationEditingService_1.ConfigurationEditingService);
            instantiationService.stub(configurationEditing_1.IConfigurationEditingService, 'writeConfiguration', target);
        });
        test('update resource configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update resource configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update resource configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update window configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update window configuration without configuration target defaults to workspace in multi root workspace when resource is provided', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update window configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update window configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.window', 'value', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('update resource configuration without configuration target defaults to folder', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(null, 'extHostConfiguration.resource', 'value', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.FOLDER, target.args[0][0]);
        });
        test('update configuration with configuration target', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$updateConfigurationOption(configurationEditing_1.ConfigurationTarget.FOLDER, 'extHostConfiguration.window', 'value', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.FOLDER, target.args[0][0]);
        });
        test('remove resource configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove resource configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove resource configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove window configuration without configuration target defaults to workspace in multi root workspace when no resource is provided', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove window configuration without configuration target defaults to workspace in multi root workspace when resource is provided', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove window configuration without configuration target defaults to workspace in folder workspace when resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove window configuration without configuration target defaults to workspace in folder workspace when no resource is provider', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return false; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.window', null);
            assert.equal(configurationEditing_1.ConfigurationTarget.WORKSPACE, target.args[0][0]);
        });
        test('remove configuration without configuration target defaults to folder', function () {
            instantiationService.stub(workspace_1.IWorkspaceContextService, { hasMultiFolderWorkspace: function () { return true; } });
            var testObject = instantiationService.createInstance(mainThreadConfiguration_1.MainThreadConfiguration, testThreadService_1.OneGetThreadService(null));
            testObject.$removeConfigurationOption(null, 'extHostConfiguration.resource', uri_1.default.file('abc'));
            assert.equal(configurationEditing_1.ConfigurationTarget.FOLDER, target.args[0][0]);
        });
    });
});
//# sourceMappingURL=mainThreadConfiguration.test.js.map