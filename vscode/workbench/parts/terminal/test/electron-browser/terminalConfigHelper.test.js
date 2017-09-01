/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/platform/configuration/common/configuration", "vs/base/common/platform", "vs/base/common/winjs.base", "vs/workbench/parts/terminal/electron-browser/terminalConfigHelper", "vs/editor/common/config/editorOptions"], function (require, exports, assert, configuration_1, platform_1, winjs_base_1, terminalConfigHelper_1, editorOptions_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
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
    suite('Workbench - TerminalConfigHelper', function () {
        var fixture;
        setup(function () {
            fixture = document.body;
        });
        test('TerminalConfigHelper - getFont fontFamily', function () {
            var configurationService;
            var configHelper;
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
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().fontFamily, 'bar', 'terminal.integrated.fontFamily should be selected over editor.fontFamily');
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo'
                },
                terminal: {
                    integrated: {
                        fontFamily: 0
                    }
                }
            });
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().fontFamily, 'foo', 'editor.fontFamily should be the fallback when terminal.integrated.fontFamily not set');
        });
        test('TerminalConfigHelper - getFont fontSize', function () {
            var configurationService;
            var configHelper;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo',
                    fontSize: 1
                },
                terminal: {
                    integrated: {
                        fontFamily: 'bar',
                        fontSize: 2
                    }
                }
            });
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().fontSize, '2px', 'terminal.integrated.fontSize should be selected over editor.fontSize');
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo',
                    fontSize: 0
                },
                terminal: {
                    integrated: {
                        fontFamily: 0,
                        fontSize: 0
                    }
                }
            });
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().fontSize, editorOptions_1.EDITOR_FONT_DEFAULTS.fontSize + "px", 'The default editor font size should be used when editor.fontSize is 0 and terminal.integrated.fontSize not set');
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo',
                    fontSize: 0
                },
                terminal: {
                    integrated: {
                        fontFamily: 0,
                        fontSize: -10
                    }
                }
            });
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().fontSize, editorOptions_1.EDITOR_FONT_DEFAULTS.fontSize + "px", 'The default editor font size should be used when editor.fontSize is < 0 and terminal.integrated.fontSize not set');
        });
        test('TerminalConfigHelper - getFont lineHeight', function () {
            var configurationService;
            var configHelper;
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo',
                    lineHeight: 1
                },
                terminal: {
                    integrated: {
                        fontFamily: 0,
                        lineHeight: 2
                    }
                }
            });
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().lineHeight, 2, 'terminal.integrated.lineHeight should be selected over editor.lineHeight');
            configurationService = new MockConfigurationService({
                editor: {
                    fontFamily: 'foo',
                    lineHeight: 1
                },
                terminal: {
                    integrated: {
                        fontFamily: 0,
                        lineHeight: 0
                    }
                }
            });
            configHelper = new terminalConfigHelper_1.TerminalConfigHelper(platform_1.Platform.Linux, configurationService, null, null, null);
            configHelper.panelContainer = fixture;
            assert.equal(configHelper.getFont().lineHeight, 1.2, 'editor.lineHeight should be 1.2 when terminal.integrated.lineHeight not set');
        });
    });
});
//# sourceMappingURL=terminalConfigHelper.test.js.map