define(["require", "exports", "assert", "vs/base/common/winjs.base", "vs/platform/telemetry/node/workbenchCommonProperties", "vs/platform/storage/common/storageService", "vs/platform/workspace/test/common/testWorkspace"], function (require, exports, assert, winjs_base_1, workbenchCommonProperties_1, storageService_1, testWorkspace_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Telemetry - common properties', function () {
        var commit = void 0;
        var version = void 0;
        var storageService;
        setup(function () {
            storageService = new storageService_1.StorageService(new storageService_1.InMemoryLocalStorage(), null, testWorkspace_1.TestWorkspace.id);
        });
        test('default', function () {
            return workbenchCommonProperties_1.resolveWorkbenchCommonProperties(storageService, commit, version).then(function (props) {
                assert.ok('commitHash' in props);
                assert.ok('sessionID' in props);
                assert.ok('timestamp' in props);
                assert.ok('common.platform' in props);
                assert.ok('common.nodePlatform' in props);
                assert.ok('common.nodeArch' in props);
                assert.ok('common.timesincesessionstart' in props);
                assert.ok('common.sequence' in props);
                // assert.ok('common.version.shell' in first.data); // only when running on electron
                // assert.ok('common.version.renderer' in first.data);
                assert.ok('common.osVersion' in props, 'osVersion');
                assert.ok('version' in props);
                assert.ok('common.firstSessionDate' in props, 'firstSessionDate');
                assert.ok('common.lastSessionDate' in props, 'lastSessionDate'); // conditional, see below, 'lastSessionDate'ow
                assert.ok('common.isNewSession' in props, 'isNewSession');
                // machine id et al
                assert.ok('common.instanceId' in props, 'instanceId');
                assert.ok('common.machineId' in props, 'machineId');
                if (process.platform === 'win32') {
                    assert.ok('common.sqm.userid' in props, 'userid');
                    assert.ok('common.sqm.machineid' in props, 'machineid');
                }
            });
        });
        test('lastSessionDate when aviablale', function () {
            storageService.store('telemetry.lastSessionDate', new Date().toUTCString());
            return workbenchCommonProperties_1.resolveWorkbenchCommonProperties(storageService, commit, version).then(function (props) {
                assert.ok('common.lastSessionDate' in props); // conditional, see below
                assert.ok('common.isNewSession' in props);
                assert.equal(props['common.isNewSession'], 0);
            });
        });
        test('values chance on ask', function () {
            return workbenchCommonProperties_1.resolveWorkbenchCommonProperties(storageService, commit, version).then(function (props) {
                var value1 = props['common.sequence'];
                var value2 = props['common.sequence'];
                assert.ok(value1 !== value2, 'seq');
                value1 = props['timestamp'];
                value2 = props['timestamp'];
                assert.ok(value1 !== value2, 'timestamp');
                value1 = props['common.timesincesessionstart'];
                return winjs_base_1.TPromise.timeout(10).then(function (_) {
                    value2 = props['common.timesincesessionstart'];
                    assert.ok(value1 !== value2, 'timesincesessionstart');
                });
            });
        });
    });
});
//# sourceMappingURL=commonProperties.test.js.map