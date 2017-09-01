/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/common/uri", "vs/base/common/platform", "vs/base/common/winjs.base", "vs/platform/configuration/common/configuration", "vs/workbench/services/configurationResolver/node/configurationResolverService", "vs/workbench/test/workbenchTestServices", "vs/platform/configuration/test/common/testConfigurationService"], function (require, exports, assert, uri_1, platform, winjs_base_1, configuration_1, configurationResolverService_1, workbenchTestServices_1, testConfigurationService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Configuration Resolver Service', function () {
        var configurationResolverService;
        var envVariables = { key1: 'Value for Key1', key2: 'Value for Key2' };
        var mockCommandService;
        var editorService;
        var workspaceUri;
        setup(function () {
            mockCommandService = new MockCommandService();
            editorService = new workbenchTestServices_1.TestEditorService();
            workspaceUri = uri_1.default.parse('file:///VSCode/workspaceLocation');
            configurationResolverService = new configurationResolverService_1.ConfigurationResolverService(envVariables, editorService, workbenchTestServices_1.TestEnvironmentService, new testConfigurationService_1.TestConfigurationService(), mockCommandService);
        });
        teardown(function () {
            configurationResolverService = null;
        });
        test('substitute one', function () {
            if (platform.isWindows) {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, 'abc ${workspaceRoot} xyz'), 'abc \\VSCode\\workspaceLocation xyz');
            }
            else {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, 'abc ${workspaceRoot} xyz'), 'abc /VSCode/workspaceLocation xyz');
            }
        });
        test('workspace root folder name', function () {
            assert.strictEqual(configurationResolverService.resolve(workspaceUri, 'abc ${workspaceRootFolderName} xyz'), 'abc workspaceLocation xyz');
        });
        test('current selected line number', function () {
            assert.strictEqual(configurationResolverService.resolve(workspaceUri, 'abc ${lineNumber} xyz'), "abc " + editorService.mockLineNumber + " xyz");
        });
        test('substitute many', function () {
            if (platform.isWindows) {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, '${workspaceRoot} - ${workspaceRoot}'), '\\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation');
            }
            else {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, '${workspaceRoot} - ${workspaceRoot}'), '/VSCode/workspaceLocation - /VSCode/workspaceLocation');
            }
        });
        test('substitute one env variable', function () {
            if (platform.isWindows) {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, 'abc ${workspaceRoot} ${env:key1} xyz'), 'abc \\VSCode\\workspaceLocation Value for Key1 xyz');
            }
            else {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, 'abc ${workspaceRoot} ${env:key1} xyz'), 'abc /VSCode/workspaceLocation Value for Key1 xyz');
            }
        });
        test('substitute many env variable', function () {
            if (platform.isWindows) {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, '${workspaceRoot} - ${workspaceRoot} ${env:key1} - ${env:key2}'), '\\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation Value for Key1 - Value for Key2');
            }
            else {
                assert.strictEqual(configurationResolverService.resolve(workspaceUri, '${workspaceRoot} - ${workspaceRoot} ${env:key1} - ${env:key2}'), '/VSCode/workspaceLocation - /VSCode/workspaceLocation Value for Key1 - Value for Key2');
            }
        });
        test('substitute one configuration variable', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo'
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} xyz'), 'abc foo xyz');
        });
        test('substitute many configuration variables', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo'
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo bar xyz');
        });
        test('substitute nested configuration variables', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo ${workspaceRoot} ${config:terminal.integrated.fontFamily}'
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            if (platform.isWindows) {
                assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo \\VSCode\\workspaceLocation bar bar xyz');
            }
            else {
                assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo /VSCode/workspaceLocation bar bar xyz');
            }
        });
        test('substitute accidental self referenced configuration variables', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo ${workspaceRoot} ${config:terminal.integrated.fontFamily} ${config:editor.fontFamily}'
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            if (platform.isWindows) {
                assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo \\VSCode\\workspaceLocation bar  bar xyz');
            }
            else {
                assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} xyz'), 'abc foo /VSCode/workspaceLocation bar  bar xyz');
            }
        });
        test('substitute one env variable and a configuration variable', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo'
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            if (platform.isWindows) {
                assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${workspaceRoot} ${env:key1} xyz'), 'abc foo \\VSCode\\workspaceLocation Value for Key1 xyz');
            }
            else {
                assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${workspaceRoot} ${env:key1} xyz'), 'abc foo /VSCode/workspaceLocation Value for Key1 xyz');
            }
        });
        test('substitute many env variable and a configuration variable', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo'
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            if (platform.isWindows) {
                assert.strictEqual(service.resolve(workspaceUri, '${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} ${workspaceRoot} - ${workspaceRoot} ${env:key1} - ${env:key2}'), 'foo bar \\VSCode\\workspaceLocation - \\VSCode\\workspaceLocation Value for Key1 - Value for Key2');
            }
            else {
                assert.strictEqual(service.resolve(workspaceUri, '${config:editor.fontFamily} ${config:terminal.integrated.fontFamily} ${workspaceRoot} - ${workspaceRoot} ${env:key1} - ${env:key2}'), 'foo bar /VSCode/workspaceLocation - /VSCode/workspaceLocation Value for Key1 - Value for Key2');
            }
        });
        test('mixed types of configuration variables', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo',
                    lineNumbers: 123,
                    insertSpaces: false
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar'
                    }
                },
                json: {
                    schemas: [
                        {
                            fileMatch: [
                                '/myfile',
                                '/myOtherfile'
                            ],
                            url: 'schemaURL'
                        }
                    ]
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.fontFamily} ${config:editor.lineNumbers} ${config:editor.insertSpaces} xyz'), 'abc foo 123 false xyz');
        });
        test('configuration should not evaluate Javascript', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    abc: 'foo'
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor[\'abc\'.substr(0)]} xyz'), 'abc  xyz');
        });
        test('uses empty string as fallback', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {}
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.abc} xyz'), 'abc  xyz');
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.abc.def} xyz'), 'abc  xyz');
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:panel} xyz'), 'abc  xyz');
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:panel.abc} xyz'), 'abc  xyz');
        });
        test('is restricted to own properties', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {}
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.__proto__} xyz'), 'abc  xyz');
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.toString} xyz'), 'abc  xyz');
        });
        test('configuration variables with invalid accessor', function () {
            var configurationService;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo'
                }
            });
            var service = new configurationResolverService_1.ConfigurationResolverService(envVariables, new workbenchTestServices_1.TestEditorService(), workbenchTestServices_1.TestEnvironmentService, configurationService, mockCommandService);
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:} xyz'), 'abc ${config:} xyz');
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor..fontFamily} xyz'), 'abc  xyz');
            assert.strictEqual(service.resolve(workspaceUri, 'abc ${config:editor.none.none2} xyz'), 'abc  xyz');
        });
        test('interactive variable simple', function () {
            var configuration = {
                'name': 'Attach to Process',
                'type': 'node',
                'request': 'attach',
                'processId': '${command:interactiveVariable1}',
                'port': 5858,
                'sourceMaps': false,
                'outDir': null
            };
            var interactiveVariables = Object.create(null);
            interactiveVariables['interactiveVariable1'] = 'command1';
            interactiveVariables['interactiveVariable2'] = 'command2';
            configurationResolverService.resolveInteractiveVariables(configuration, interactiveVariables).then(function (resolved) {
                assert.deepEqual(resolved, {
                    'name': 'Attach to Process',
                    'type': 'node',
                    'request': 'attach',
                    'processId': 'command1',
                    'port': 5858,
                    'sourceMaps': false,
                    'outDir': null
                });
                assert.equal(1, mockCommandService.callCount);
            });
        });
        test('interactive variable complex', function () {
            var configuration = {
                'name': 'Attach to Process',
                'type': 'node',
                'request': 'attach',
                'processId': '${command:interactiveVariable1}',
                'port': '${command:interactiveVariable2}',
                'sourceMaps': false,
                'outDir': 'src/${command:interactiveVariable2}',
                'env': {
                    'processId': '__${command:interactiveVariable2}__',
                }
            };
            var interactiveVariables = Object.create(null);
            interactiveVariables['interactiveVariable1'] = 'command1';
            interactiveVariables['interactiveVariable2'] = 'command2';
            configurationResolverService.resolveInteractiveVariables(configuration, interactiveVariables).then(function (resolved) {
                assert.deepEqual(resolved, {
                    'name': 'Attach to Process',
                    'type': 'node',
                    'request': 'attach',
                    'processId': 'command1',
                    'port': 'command2',
                    'sourceMaps': false,
                    'outDir': 'src/command2',
                    'env': {
                        'processId': '__command2__',
                    }
                });
                assert.equal(2, mockCommandService.callCount);
            });
        });
    });
    var MockConfigurationService = (function () {
        function MockConfigurationService(configuration) {
            if (configuration === void 0) { configuration = {}; }
            this.configuration = configuration;
            this.serviceId = configuration_1.IConfigurationService;
        }
        MockConfigurationService.prototype.reloadConfiguration = function (section) { return winjs_base_1.TPromise.as(this.getConfiguration()); };
        MockConfigurationService.prototype.lookup = function (key, overrides) { return { value: configuration_1.getConfigurationValue(this.getConfiguration(), key), default: configuration_1.getConfigurationValue(this.getConfiguration(), key), user: configuration_1.getConfigurationValue(this.getConfiguration(), key), workspace: void 0, folder: void 0 }; };
        MockConfigurationService.prototype.keys = function () { return { default: [], user: [], workspace: [], folder: [] }; };
        MockConfigurationService.prototype.values = function () { return {}; };
        MockConfigurationService.prototype.getConfiguration = function () { return this.configuration; };
        MockConfigurationService.prototype.getConfigurationData = function () { return null; };
        MockConfigurationService.prototype.onDidUpdateConfiguration = function () { return { dispose: function () { } }; };
        return MockConfigurationService;
    }());
    var MockCommandService = (function () {
        function MockCommandService() {
            this.callCount = 0;
            this.onWillExecuteCommand = function () { return ({ dispose: function () { } }); };
        }
        MockCommandService.prototype.executeCommand = function (commandId) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.callCount++;
            return winjs_base_1.TPromise.as(commandId);
        };
        return MockCommandService;
    }());
});
//# sourceMappingURL=configurationResolverService.test.js.map