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
define(["require", "exports", "assert", "sinon", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionEnablementService", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/base/common/event", "vs/platform/storage/common/storageService", "vs/platform/storage/common/storage", "vs/platform/workspace/common/workspace", "vs/platform/environment/common/environment"], function (require, exports, assert, sinon, extensionManagement_1, extensionEnablementService_1, instantiationServiceMock_1, event_1, storageService_1, storage_1, workspace_1, environment_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function storageService(instantiationService) {
        var service = instantiationService.get(storage_1.IStorageService);
        if (!service) {
            var workspaceContextService = instantiationService.get(workspace_1.IWorkspaceContextService);
            if (!workspaceContextService) {
                workspaceContextService = instantiationService.stub(workspace_1.IWorkspaceContextService, {
                    hasWorkspace: function () {
                        return true;
                    },
                });
            }
            service = instantiationService.stub(storage_1.IStorageService, instantiationService.createInstance(storageService_1.StorageService, new storageService_1.InMemoryLocalStorage(), new storageService_1.InMemoryLocalStorage()));
        }
        return service;
    }
    var TestExtensionEnablementService = (function (_super) {
        __extends(TestExtensionEnablementService, _super);
        function TestExtensionEnablementService(instantiationService) {
            return _super.call(this, storageService(instantiationService), instantiationService.get(workspace_1.IWorkspaceContextService), instantiationService.get(environment_1.IEnvironmentService) || instantiationService.stub(environment_1.IEnvironmentService, {}), instantiationService.get(extensionManagement_1.IExtensionManagementService) || instantiationService.stub(extensionManagement_1.IExtensionManagementService, { onDidUninstallExtension: new event_1.Emitter() })) || this;
        }
        TestExtensionEnablementService.prototype.reset = function () {
            var _this = this;
            this.getGloballyDisabledExtensions().forEach(function (d) { return _this.setEnablement(d, true); });
            this.getWorkspaceDisabledExtensions().forEach(function (d) { return _this.setEnablement(d, true, true); });
        };
        return TestExtensionEnablementService;
    }(extensionEnablementService_1.ExtensionEnablementService));
    exports.TestExtensionEnablementService = TestExtensionEnablementService;
    suite('ExtensionEnablementService Test', function () {
        var instantiationService;
        var testObject;
        var didUninstallEvent = new event_1.Emitter();
        setup(function () {
            instantiationService = new instantiationServiceMock_1.TestInstantiationService();
            instantiationService.stub(extensionManagement_1.IExtensionManagementService, { onDidUninstallExtension: didUninstallEvent.event, });
            testObject = new TestExtensionEnablementService(instantiationService);
        });
        teardown(function () {
            testObject.dispose();
        });
        test('test when no extensions are disabled globally', function () {
            assert.deepEqual([], testObject.getGloballyDisabledExtensions());
        });
        test('test when no extensions are disabled for workspace', function () {
            assert.deepEqual([], testObject.getWorkspaceDisabledExtensions());
        });
        test('test when no extensions are disabled for workspace when there is no workspace', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () {
                instantiationService.stub(workspace_1.IWorkspaceContextService, 'hasWorkspace', false);
                assert.deepEqual([], testObject.getWorkspaceDisabledExtensions());
            })
                .then(done, done);
        });
        test('test disable an extension globally', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function () { return assert.deepEqual(['pub.a'], testObject.getGloballyDisabledExtensions()); })
                .then(done, done);
        });
        test('test disable an extension globally should return truthy promise', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function (value) { return assert.ok(value); })
                .then(done, done);
        });
        test('test disable an extension globally triggers the change event', function (done) {
            var target = sinon.spy();
            testObject.onEnablementChanged(target);
            testObject.setEnablement('pub.a', false)
                .then(function () { return assert.ok(target.calledWithExactly('pub.a')); })
                .then(done, done);
        });
        test('test disable an extension globally again should return a falsy promise', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function (value) { return assert.ok(!value); })
                .then(done, done);
        });
        test('test disable an extension for workspace', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return assert.deepEqual(['pub.a'], testObject.getWorkspaceDisabledExtensions()); })
                .then(done, done);
        });
        test('test disable an extension for workspace returns a truthy promise', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function (value) { return assert.ok(value); })
                .then(done, done);
        });
        test('test disable an extension for workspace again should return a falsy promise', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', false, true); })
                .then(function (value) { return assert.ok(!value); })
                .then(done, done);
        });
        test('test disable an extension for workspace and then globally', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function () {
                assert.deepEqual(['pub.a'], testObject.getWorkspaceDisabledExtensions());
                assert.deepEqual(['pub.a'], testObject.getGloballyDisabledExtensions());
            })
                .then(done, done);
        });
        test('test disable an extension for workspace and then globally return a truthy promise', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function (value) { return assert.ok(value); })
                .then(done, done);
        });
        test('test disable an extension for workspace and then globally triggers the change event', function (done) {
            var target = sinon.spy();
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.onEnablementChanged(target); })
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function () { return assert.ok(target.calledWithExactly('pub.a')); })
                .then(done, done);
        });
        test('test disable an extension globally and then for workspace', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.setEnablement('pub.a', false, true); })
                .then(function () {
                assert.deepEqual(['pub.a'], testObject.getWorkspaceDisabledExtensions());
                assert.deepEqual(['pub.a'], testObject.getGloballyDisabledExtensions());
            })
                .then(done, done);
        });
        test('test disable an extension globally and then for workspace return a truthy promise', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.setEnablement('pub.a', false, true); })
                .then(function (value) { return assert.ok(value); })
                .then(done, done);
        });
        test('test disable an extension globally and then for workspace triggers the change event', function (done) {
            var target = sinon.spy();
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.onEnablementChanged(target); })
                .then(function () { return testObject.setEnablement('pub.a', false, true); })
                .then(function () { return assert.ok(target.calledWithExactly('pub.a')); })
                .then(done, done);
        });
        test('test disable an extension for workspace when there is no workspace throws error', function (done) {
            instantiationService.stub(workspace_1.IWorkspaceContextService, 'hasWorkspace', false);
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return assert.fail('should throw an error'); }, function (error) { return assert.ok(error); })
                .then(done, done);
        });
        test('test enable an extension globally', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.setEnablement('pub.a', true); })
                .then(function () { return assert.deepEqual([], testObject.getGloballyDisabledExtensions()); })
                .then(done, done);
        });
        test('test enable an extension globally return truthy promise', function (done) {
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.setEnablement('pub.a', true); })
                .then(function (value) { return assert.ok(value); })
                .then(done, done);
        });
        test('test enable an extension globally triggers change event', function (done) {
            var target = sinon.spy();
            testObject.setEnablement('pub.a', false)
                .then(function () { return testObject.onEnablementChanged(target); })
                .then(function () { return testObject.setEnablement('pub.a', true); })
                .then(function () { return assert.ok(target.calledWithExactly('pub.a')); })
                .then(done, done);
        });
        test('test enable an extension globally when already enabled return falsy promise', function (done) {
            testObject.setEnablement('pub.a', true)
                .then(function (value) { return assert.ok(!value); })
                .then(done, done);
        });
        test('test enable an extension for workspace', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', true, true); })
                .then(function () { return assert.deepEqual([], testObject.getWorkspaceDisabledExtensions()); })
                .then(done, done);
        });
        test('test enable an extension for workspace return truthy promise', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', true, true); })
                .then(function (value) { return assert.ok(value); })
                .then(done, done);
        });
        test('test enable an extension for workspace triggers change event', function (done) {
            var target = sinon.spy();
            testObject.setEnablement('pub.b', false, true)
                .then(function () { return testObject.onEnablementChanged(target); })
                .then(function () { return testObject.setEnablement('pub.b', true, true); })
                .then(function () { return assert.ok(target.calledWithExactly('pub.b')); })
                .then(done, done);
        });
        test('test enable an extension for workspace when already enabled return falsy promise', function (done) {
            testObject.setEnablement('pub.a', true, true)
                .then(function (value) { return assert.ok(!value); })
                .then(done, done);
        });
        test('test enable an extension for workspace when disabled in workspace and gloablly', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function () { return testObject.setEnablement('pub.a', true, true); })
                .then(function () {
                assert.deepEqual(['pub.a'], testObject.getGloballyDisabledExtensions());
                assert.deepEqual([], testObject.getWorkspaceDisabledExtensions());
            })
                .then(done, done);
        });
        test('test enable an extension globally when disabled in workspace and gloablly', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function () { return testObject.setEnablement('pub.a', true); })
                .then(function () {
                assert.deepEqual(['pub.a'], testObject.getWorkspaceDisabledExtensions());
                assert.deepEqual([], testObject.getGloballyDisabledExtensions());
            })
                .then(done, done);
        });
        test('test remove an extension from disablement list when uninstalled', function (done) {
            testObject.setEnablement('pub.a', false, true)
                .then(function () { return testObject.setEnablement('pub.a', false); })
                .then(function () { return didUninstallEvent.fire({ id: 'pub.a-1.0.0' }); })
                .then(function () {
                assert.deepEqual([], testObject.getWorkspaceDisabledExtensions());
                assert.deepEqual([], testObject.getGloballyDisabledExtensions());
            })
                .then(done, done);
        });
    });
});
//# sourceMappingURL=extensionEnablementService.test.js.map