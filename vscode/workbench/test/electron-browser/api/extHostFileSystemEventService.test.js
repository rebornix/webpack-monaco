define(["require", "exports", "assert", "vs/workbench/api/node/extHostFileSystemEventService"], function (require, exports, assert, extHostFileSystemEventService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostFileSystemEventService', function () {
        test('FileSystemWatcher ignore events properties are reversed #26851', function () {
            var watcher1 = new extHostFileSystemEventService_1.ExtHostFileSystemEventService().createFileSystemWatcher('**/somethingInteresting', false, false, false);
            assert.equal(watcher1.ignoreChangeEvents, false);
            assert.equal(watcher1.ignoreCreateEvents, false);
            assert.equal(watcher1.ignoreDeleteEvents, false);
            var watcher2 = new extHostFileSystemEventService_1.ExtHostFileSystemEventService().createFileSystemWatcher('**/somethingBoring', true, true, true);
            assert.equal(watcher2.ignoreChangeEvents, true);
            assert.equal(watcher2.ignoreCreateEvents, true);
            assert.equal(watcher2.ignoreDeleteEvents, true);
        });
    });
});
//# sourceMappingURL=extHostFileSystemEventService.test.js.map