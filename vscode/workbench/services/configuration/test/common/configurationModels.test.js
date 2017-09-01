define(["require", "exports", "assert", "vs/workbench/services/configuration/common/configurationModels", "vs/platform/configuration/common/configurationRegistry"], function (require, exports, assert, configurationModels_1, configurationRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ConfigurationService - Model', function () {
        test('Test scoped configs are undefined', function () {
            var settingsConfig = new configurationModels_1.FolderSettingsModel(JSON.stringify({
                awesome: true
            }));
            var testObject = new configurationModels_1.FolderConfigurationModel(settingsConfig, [], configurationRegistry_1.ConfigurationScope.WINDOW);
            assert.equal(testObject.getContentsFor('task'), undefined);
        });
        test('Test consolidate (settings and tasks)', function () {
            var settingsConfig = new configurationModels_1.FolderSettingsModel(JSON.stringify({
                awesome: true
            }));
            var tasksConfig = new configurationModels_1.ScopedConfigurationModel(JSON.stringify({
                awesome: false
            }), '', 'tasks');
            var expected = {
                awesome: true,
                tasks: {
                    awesome: false
                }
            };
            assert.deepEqual(new configurationModels_1.FolderConfigurationModel(settingsConfig, [tasksConfig], configurationRegistry_1.ConfigurationScope.WINDOW).contents, expected);
        });
        test('Test consolidate (settings and launch)', function () {
            var settingsConfig = new configurationModels_1.FolderSettingsModel(JSON.stringify({
                awesome: true
            }));
            var launchConfig = new configurationModels_1.ScopedConfigurationModel(JSON.stringify({
                awesome: false
            }), '', 'launch');
            var expected = {
                awesome: true,
                launch: {
                    awesome: false
                }
            };
            assert.deepEqual(new configurationModels_1.FolderConfigurationModel(settingsConfig, [launchConfig], configurationRegistry_1.ConfigurationScope.WINDOW).contents, expected);
        });
        test('Test consolidate (settings and launch and tasks) - launch/tasks wins over settings file', function () {
            var settingsConfig = new configurationModels_1.FolderSettingsModel(JSON.stringify({
                awesome: true,
                launch: {
                    launchConfig: 'defined',
                    otherLaunchConfig: 'alsoDefined'
                },
                tasks: {
                    taskConfig: 'defined',
                    otherTaskConfig: 'alsoDefined'
                }
            }));
            var tasksConfig = new configurationModels_1.ScopedConfigurationModel(JSON.stringify({
                taskConfig: 'overwritten',
            }), '', 'tasks');
            var launchConfig = new configurationModels_1.ScopedConfigurationModel(JSON.stringify({
                launchConfig: 'overwritten',
            }), '', 'launch');
            var expected = {
                awesome: true,
                launch: {
                    launchConfig: 'overwritten',
                    otherLaunchConfig: 'alsoDefined'
                },
                tasks: {
                    taskConfig: 'overwritten',
                    otherTaskConfig: 'alsoDefined'
                }
            };
            assert.deepEqual(new configurationModels_1.FolderConfigurationModel(settingsConfig, [launchConfig, tasksConfig], configurationRegistry_1.ConfigurationScope.WINDOW).contents, expected);
            assert.deepEqual(new configurationModels_1.FolderConfigurationModel(settingsConfig, [tasksConfig, launchConfig], configurationRegistry_1.ConfigurationScope.WINDOW).contents, expected);
        });
    });
});
//# sourceMappingURL=configurationModels.test.js.map