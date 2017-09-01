/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/common/objects", "vs/base/common/uuid", "vs/base/common/winjs.base", "vs/workbench/parts/extensions/common/extensions", "vs/workbench/parts/extensions/browser/extensionsActions", "vs/workbench/parts/extensions/node/extensionsWorkbenchService", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/platform/extensionManagement/node/extensionManagementService", "vs/workbench/parts/extensions/electron-browser/extensionTipsService", "vs/platform/extensionManagement/test/common/extensionEnablementService.test", "vs/platform/extensionManagement/node/extensionGalleryService", "vs/platform/url/common/url", "vs/platform/instantiation/test/common/instantiationServiceMock", "vs/base/common/event", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryUtils", "vs/platform/extensions/common/extensions", "vs/platform/workspace/common/workspace", "vs/workbench/test/workbenchTestServices", "vs/platform/configuration/common/configuration"], function (require, exports, assert, objects_1, uuid_1, winjs_base_1, extensions_1, ExtensionsActions, extensionsWorkbenchService_1, extensionManagement_1, extensionManagementUtil_1, extensionManagementService_1, extensionTipsService_1, extensionEnablementService_test_1, extensionGalleryService_1, url_1, instantiationServiceMock_1, event_1, telemetry_1, telemetryUtils_1, extensions_2, workspace_1, workbenchTestServices_1, configuration_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtensionsActions Test', function () {
        var instantiationService;
        var installEvent, didInstallEvent, uninstallEvent, didUninstallEvent;
        suiteSetup(function () {
            installEvent = new event_1.Emitter();
            didInstallEvent = new event_1.Emitter();
            uninstallEvent = new event_1.Emitter();
            didUninstallEvent = new event_1.Emitter();
            instantiationService = new instantiationServiceMock_1.TestInstantiationService();
            instantiationService.stub(url_1.IURLService, { onOpenURL: new event_1.Emitter().event });
            instantiationService.stub(telemetry_1.ITelemetryService, telemetryUtils_1.NullTelemetryService);
            instantiationService.stub(workspace_1.IWorkspaceContextService, new workbenchTestServices_1.TestContextService());
            instantiationService.stub(configuration_1.IConfigurationService, { onDidUpdateConfiguration: function () { }, getConfiguration: function () { return ({}); } });
            instantiationService.stub(extensionManagement_1.IExtensionGalleryService, extensionGalleryService_1.ExtensionGalleryService);
            instantiationService.stub(extensionManagement_1.IExtensionManagementService, extensionManagementService_1.ExtensionManagementService);
            instantiationService.stub(extensionManagement_1.IExtensionManagementService, 'onInstallExtension', installEvent.event);
            instantiationService.stub(extensionManagement_1.IExtensionManagementService, 'onDidInstallExtension', didInstallEvent.event);
            instantiationService.stub(extensionManagement_1.IExtensionManagementService, 'onUninstallExtension', uninstallEvent.event);
            instantiationService.stub(extensionManagement_1.IExtensionManagementService, 'onDidUninstallExtension', didUninstallEvent.event);
            instantiationService.stub(extensionManagement_1.IExtensionEnablementService, new extensionEnablementService_test_1.TestExtensionEnablementService(instantiationService));
            instantiationService.stub(extensionManagement_1.IExtensionTipsService, extensionTipsService_1.ExtensionTipsService);
            instantiationService.stub(extensionManagement_1.IExtensionTipsService, 'getKeymapRecommendations', function () { return []; });
        });
        setup(function () {
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', []);
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage());
            instantiationService.stub(extensions_2.IExtensionService, { getExtensions: function () { return winjs_base_1.TPromise.wrap([]); } });
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).reset();
            instantiationService.set(extensions_1.IExtensionsWorkbenchService, instantiationService.createInstance(extensionsWorkbenchService_1.ExtensionsWorkbenchService));
        });
        teardown(function () {
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).dispose();
        });
        test('Install action is disabled when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.InstallAction);
            assert.ok(!testObject.enabled);
        });
        test('Test Install action when state is installed', function (done) {
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            var testObject = instantiationService.createInstance(ExtensionsActions.InstallAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function () {
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(aGalleryExtension('a', { id: local.id })));
                workbenchService.queryGallery().done(function (paged) {
                    testObject.extension = paged.firstPage[0];
                    assert.ok(!testObject.enabled);
                    assert.equal('Install', testObject.label);
                    assert.equal('extension-action prominent install', testObject.class);
                    done();
                });
            });
        });
        test('Test Install action when state is installing', function (done) {
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            var testObject = instantiationService.createInstance(ExtensionsActions.InstallAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            workbenchService.queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                assert.ok(!testObject.enabled);
                assert.equal('Installing', testObject.label);
                assert.equal('extension-action install installing', testObject.class);
                done();
            });
        });
        test('Test Install action when state is uninstalled', function (done) {
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            var testObject = instantiationService.createInstance(ExtensionsActions.InstallAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            workbenchService.queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                assert.ok(testObject.enabled);
                assert.equal('Install', testObject.label);
                done();
            });
        });
        test('Test Install action when extension is system action', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.InstallAction);
            var local = aLocalExtension('a', {}, { type: extensionManagement_1.LocalExtensionType.System });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                uninstallEvent.fire(local.id);
                didUninstallEvent.fire({ id: local.id });
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test Install action when extension doesnot has gallery', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.InstallAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                uninstallEvent.fire(local.id);
                didUninstallEvent.fire({ id: local.id });
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Uninstall action is disabled when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.UninstallAction);
            assert.ok(!testObject.enabled);
        });
        test('Test Uninstall action when state is uninstalling', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UninstallAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                assert.ok(!testObject.enabled);
                assert.equal('Uninstalling', testObject.label);
                assert.equal('extension-action uninstall uninstalling', testObject.class);
                done();
            });
        });
        test('Test Uninstall action when state is installed and is user extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UninstallAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                assert.equal('Uninstall', testObject.label);
                assert.equal('extension-action uninstall', testObject.class);
                done();
            });
        });
        test('Test Uninstall action when state is installed and is system extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UninstallAction);
            var local = aLocalExtension('a', {}, { type: extensionManagement_1.LocalExtensionType.System });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                assert.equal('Uninstall', testObject.label);
                assert.equal('extension-action uninstall', testObject.class);
                done();
            });
        });
        test('Test Uninstall action after extension is installed', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UninstallAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                didInstallEvent.fire({ id: gallery.uuid, gallery: gallery, local: aLocalExtension('a', gallery, gallery) });
                assert.ok(testObject.enabled);
                assert.equal('Uninstall', testObject.label);
                assert.equal('extension-action uninstall', testObject.class);
                done();
            });
        });
        test('Test CombinedInstallAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.CombinedInstallAction);
            assert.ok(!testObject.enabled);
            assert.equal('extension-action prominent install no-extension', testObject.class);
        });
        test('Test CombinedInstallAction when extension is system extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.CombinedInstallAction);
            var local = aLocalExtension('a', {}, { type: extensionManagement_1.LocalExtensionType.System });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                assert.equal('extension-action prominent install no-extension', testObject.class);
                done();
            });
        });
        test('Test CombinedInstallAction when installAction is enabled', function (done) {
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            var testObject = instantiationService.createInstance(ExtensionsActions.CombinedInstallAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            workbenchService.queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                assert.ok(testObject.enabled);
                assert.equal('Install', testObject.label);
                assert.equal('extension-action prominent install', testObject.class);
                done();
            });
        });
        test('Test CombinedInstallAction when unInstallAction is enabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.CombinedInstallAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                assert.equal('Uninstall', testObject.label);
                assert.equal('extension-action uninstall', testObject.class);
                done();
            });
        });
        test('Test CombinedInstallAction when state is installing', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.CombinedInstallAction);
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            workbenchService.queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                assert.ok(!testObject.enabled);
                assert.equal('Installing', testObject.label);
                assert.equal('extension-action install installing', testObject.class);
                done();
            });
        });
        test('Test CombinedInstallAction when state is uninstalling', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.CombinedInstallAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                assert.ok(!testObject.enabled);
                assert.equal('Uninstalling', testObject.label);
                assert.equal('extension-action uninstall uninstalling', testObject.class);
                done();
            });
        });
        test('Test UpdateAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAction);
            assert.ok(!testObject.enabled);
        });
        test('Test UpdateAction when extension is uninstalled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAction);
            var gallery = aGalleryExtension('a', { version: '1.0.0' });
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test UpdateAction when extension is installed and not outdated', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAction);
            var local = aLocalExtension('a', { version: '1.0.0' });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(aGalleryExtension('a', { id: local.id, version: local.manifest.version })));
                instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (extensions) {
                    assert.ok(!testObject.enabled);
                    done();
                });
            });
        });
        test('Test UpdateAction when extension is installed outdated and system extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAction);
            var local = aLocalExtension('a', { version: '1.0.0' }, { type: extensionManagement_1.LocalExtensionType.System });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(aGalleryExtension('a', { id: local.id, version: '1.0.1' })));
                instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (extensions) {
                    assert.ok(!testObject.enabled);
                    done();
                });
            });
        });
        test('Test UpdateAction when extension is installed outdated and user extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAction);
            var local = aLocalExtension('a', { version: '1.0.0' });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(aGalleryExtension('a', { id: local.id, version: '1.0.1' })));
                instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (extensions) {
                    assert.ok(testObject.enabled);
                    done();
                });
            });
        });
        test('Test UpdateAction when extension is installing and outdated and user extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAction);
            var local = aLocalExtension('a', { version: '1.0.0' });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                var gallery = aGalleryExtension('a', { id: local.id, version: '1.0.1' });
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
                instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (extensions) {
                    installEvent.fire({ id: local.id, gallery: gallery });
                    assert.ok(!testObject.enabled);
                    done();
                });
            });
        });
        test('Test ManageExtensionAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            assert.ok(!testObject.enabled);
        });
        test('Test ManageExtensionAction when extension is installed', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                assert.equal('extension-action manage', testObject.class);
                assert.equal('', testObject.tooltip);
                done();
            });
        });
        test('Test ManageExtensionAction when extension is uninstalled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                assert.ok(!testObject.enabled);
                assert.equal('extension-action manage hide', testObject.class);
                assert.equal('', testObject.tooltip);
                done();
            });
        });
        test('Test ManageExtensionAction when extension is installing', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                assert.ok(!testObject.enabled);
                assert.equal('extension-action manage hide', testObject.class);
                assert.equal('', testObject.tooltip);
                done();
            });
        });
        test('Test ManageExtensionAction when extension is queried from gallery and installed', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                didInstallEvent.fire({ id: gallery.uuid, gallery: gallery, local: aLocalExtension('a', gallery, gallery) });
                assert.ok(testObject.enabled);
                assert.equal('extension-action manage', testObject.class);
                assert.equal('', testObject.tooltip);
                done();
            });
        });
        test('Test ManageExtensionAction when extension is system extension', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            var local = aLocalExtension('a', {}, { type: extensionManagement_1.LocalExtensionType.System });
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                assert.equal('extension-action manage hide', testObject.class);
                assert.equal('', testObject.tooltip);
                done();
            });
        });
        test('Test ManageExtensionAction when extension is uninstalling', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ManageExtensionAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                assert.ok(!testObject.enabled);
                assert.equal('extension-action manage', testObject.class);
                assert.equal('Uninstalling', testObject.tooltip);
                done();
            });
        });
        test('Test EnableForWorkspaceAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableForWorkspaceAction, 'id');
            assert.ok(!testObject.enabled);
        });
        test('Test EnableForWorkspaceAction when there extension is not disabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableForWorkspaceAction when there extension is disabled globally', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableForWorkspaceAction when extension is disabled for workspace', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test EnableForWorkspaceAction when the extension is disabled in both', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableGloballyAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableGloballyAction, 'id');
            assert.ok(!testObject.enabled);
        });
        test('Test EnableGloballyAction when the extension is not disabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableGloballyAction when the extension is disabled for workspace', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableGloballyAction when the extension is disabled globally', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test EnableGloballyAction when the extension is disabled in both', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test EnableAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            assert.ok(!testObject.enabled);
        });
        test('Test EnableAction when extension is installed and enabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableAction when extension is installed and disabled globally', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test EnableAction when extension is installed and disabled for workspace', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test EnableAction when extension is uninstalled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableAction when extension is installing', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test EnableAction when extension is uninstalling', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.EnableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableForWorkspaceAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableForWorkspaceAction, 'id');
            assert.ok(!testObject.enabled);
        });
        test('Test DisableForWorkspaceAction when the extension is disabled globally', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableForWorkspaceAction when the extension is disabled workspace', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableForWorkspaceAction when extension is enabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableForWorkspaceAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test DisableGloballyAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableGloballyAction, 'id');
            assert.ok(!testObject.enabled);
        });
        test('Test DisableGloballyAction when the extension is disabled globally', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableGloballyAction when the extension is disabled for workspace', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableGloballyAction when the extension is enabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableGloballyAction, 'id');
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test DisableAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            assert.ok(!testObject.enabled);
        });
        test('Test DisableAction when extension is installed and enabled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(testObject.enabled);
                done();
            });
        });
        test('Test DisableAction when extension is installed and disabled globally', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableAction when extension is installed and disabled for workspace', function (done) {
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false, true);
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableAction when extension is uninstalled', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableAction when extension is installing', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (page) {
                testObject.extension = page.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test DisableAction when extension is uninstalling', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.DisableAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test UpdateAllAction when no installed extensions', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAllAction, 'id', 'label');
            assert.ok(!testObject.enabled);
        });
        test('Test UpdateAllAction when installed extensions are not outdated', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAllAction, 'id', 'label');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [aLocalExtension('a'), aLocalExtension('b')]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test UpdateAllAction when some installed extensions are outdated', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAllAction, 'id', 'label');
            var local = [aLocalExtension('a', { version: '1.0.1' }), aLocalExtension('b', { version: '1.0.1' }), aLocalExtension('c', { version: '1.0.1' })];
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', local);
            workbenchService.queryLocal().done(function () {
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(aGalleryExtension('a', { id: local[0].id, version: '1.0.2' }), aGalleryExtension('b', { id: local[1].id, version: '1.0.2' }), aGalleryExtension('c', local[2].manifest)));
                workbenchService.queryGallery().done(function () {
                    assert.ok(testObject.enabled);
                    done();
                });
            });
        });
        test('Test UpdateAllAction when some installed extensions are outdated and some outdated are being installed', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAllAction, 'id', 'label');
            var local = [aLocalExtension('a', { version: '1.0.1' }), aLocalExtension('b', { version: '1.0.1' }), aLocalExtension('c', { version: '1.0.1' })];
            var gallery = [aGalleryExtension('a', { id: local[0].id, version: '1.0.2' }), aGalleryExtension('b', { id: local[1].id, version: '1.0.2' }), aGalleryExtension('c', local[2].manifest)];
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', local);
            workbenchService.queryLocal().done(function () {
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage.apply(void 0, gallery));
                workbenchService.queryGallery().done(function () {
                    installEvent.fire({ id: local[0].id, gallery: gallery[0] });
                    assert.ok(testObject.enabled);
                    done();
                });
            });
        });
        test('Test UpdateAllAction when some installed extensions are outdated and all outdated are being installed', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.UpdateAllAction, 'id', 'label');
            var local = [aLocalExtension('a', { version: '1.0.1' }), aLocalExtension('b', { version: '1.0.1' }), aLocalExtension('c', { version: '1.0.1' })];
            var gallery = [aGalleryExtension('a', { id: local[0].id, version: '1.0.2' }), aGalleryExtension('b', { id: local[1].id, version: '1.0.2' }), aGalleryExtension('c', local[2].manifest)];
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', local);
            workbenchService.queryLocal().done(function () {
                instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage.apply(void 0, gallery));
                workbenchService.queryGallery().done(function () {
                    installEvent.fire({ id: local[0].id, gallery: gallery[0] });
                    installEvent.fire({ id: local[1].id, gallery: gallery[1] });
                    assert.ok(!testObject.enabled);
                    done();
                });
            });
        });
        test('Test ReloadAction when there is no extension', function () {
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            assert.ok(!testObject.enabled);
        });
        test('Test ReloadAction when extension state is installing', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            workbenchService.queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension state is uninstalling', function (done) {
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension is newly installed', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.b' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                didInstallEvent.fire({ id: gallery.uuid, gallery: gallery, local: aLocalExtension('a', gallery, gallery) });
                assert.ok(testObject.enabled);
                assert.equal('Reload to activate', testObject.tooltip);
                assert.equal("Reload this window to activate the extension 'a'?", testObject.reloadMessaage);
                done();
            });
        });
        test('Test ReloadAction when extension is installed and uninstalled', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.b' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var gallery = aGalleryExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionGalleryService, 'query', aPage(gallery));
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryGallery().done(function (paged) {
                testObject.extension = paged.firstPage[0];
                var id = extensionManagementUtil_1.getLocalExtensionIdFromGallery(gallery, gallery.version);
                installEvent.fire({ id: id, gallery: gallery });
                didInstallEvent.fire({ id: id, gallery: gallery, local: aLocalExtension('a', gallery, { id: id }) });
                uninstallEvent.fire(id);
                didUninstallEvent.fire({ id: id });
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension is uninstalled', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.a' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                didUninstallEvent.fire({ id: local.id });
                assert.ok(testObject.enabled);
                assert.equal('Reload to deactivate', testObject.tooltip);
                assert.equal("Reload this window to deactivate the uninstalled extension 'a'?", testObject.reloadMessaage);
                done();
            });
        });
        test('Test ReloadAction when extension is uninstalled and installed', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.a', version: '1.0.0' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            instantiationService.get(extensions_1.IExtensionsWorkbenchService).queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                uninstallEvent.fire(local.id);
                didUninstallEvent.fire({ id: local.id });
                var gallery = aGalleryExtension('a');
                var id = extensionManagementUtil_1.getLocalExtensionIdFromGallery(gallery, gallery.version);
                installEvent.fire({ id: id, gallery: gallery });
                didInstallEvent.fire({ id: id, gallery: gallery, local: local });
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension is updated while running', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.a', version: '1.0.1' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a', { version: '1.0.1' });
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                var gallery = aGalleryExtension('a', { uuid: local.id, version: '1.0.2' });
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                didInstallEvent.fire({ id: gallery.uuid, gallery: gallery, local: aLocalExtension('a', gallery, gallery) });
                assert.ok(testObject.enabled);
                assert.equal('Reload to update', testObject.tooltip);
                assert.equal("Reload this window to activate the updated extension 'a'?", testObject.reloadMessaage);
                done();
            });
        });
        test('Test ReloadAction when extension is updated when not running', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.b' }]);
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a', { version: '1.0.1' });
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                var gallery = aGalleryExtension('a', { id: local.id, version: '1.0.2' });
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                didInstallEvent.fire({ id: gallery.uuid, gallery: gallery, local: aLocalExtension('a', gallery, gallery) });
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension is disabled when running', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.a' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                workbenchService.setEnablement(extensions[0], false);
                assert.ok(testObject.enabled);
                assert.equal('Reload to deactivate', testObject.tooltip);
                assert.equal("Reload this window to deactivate the extension 'a'?", testObject.reloadMessaage);
                done();
            });
        });
        test('Test ReloadAction when extension enablement is toggled when running', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.a', version: '1.0.0' }]);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                workbenchService.setEnablement(extensions[0], false);
                workbenchService.setEnablement(extensions[0], true);
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension is enabled when not running', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.b' }]);
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                workbenchService.setEnablement(extensions[0], true);
                assert.ok(testObject.enabled);
                assert.equal('Reload to activate', testObject.tooltip);
                assert.equal("Reload this window to activate the extension 'a'?", testObject.reloadMessaage);
                done();
            });
        });
        test('Test ReloadAction when extension enablement is toggled when not running', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.b' }]);
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a');
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                workbenchService.setEnablement(extensions[0], true);
                workbenchService.setEnablement(extensions[0], false);
                assert.ok(!testObject.enabled);
                done();
            });
        });
        test('Test ReloadAction when extension is updated when not running and enabled', function (done) {
            instantiationService.stubPromise(extensions_2.IExtensionService, 'getExtensions', [{ id: 'pub.b' }]);
            instantiationService.get(extensionManagement_1.IExtensionEnablementService).setEnablement('pub.a', false);
            var testObject = instantiationService.createInstance(ExtensionsActions.ReloadAction);
            var local = aLocalExtension('a', { version: '1.0.1' });
            var workbenchService = instantiationService.get(extensions_1.IExtensionsWorkbenchService);
            instantiationService.stubPromise(extensionManagement_1.IExtensionManagementService, 'getInstalled', [local]);
            workbenchService.queryLocal().done(function (extensions) {
                testObject.extension = extensions[0];
                var gallery = aGalleryExtension('a', { id: local.id, version: '1.0.2' });
                installEvent.fire({ id: gallery.uuid, gallery: gallery });
                didInstallEvent.fire({ id: gallery.uuid, gallery: gallery, local: aLocalExtension('a', gallery, gallery) });
                workbenchService.setEnablement(extensions[0], true);
                assert.ok(testObject.enabled);
                assert.equal('Reload to activate', testObject.tooltip);
                assert.equal("Reload this window to activate the extension 'a'?", testObject.reloadMessaage);
                done();
            });
        });
        function aLocalExtension(name, manifest, properties) {
            if (name === void 0) { name = 'someext'; }
            if (manifest === void 0) { manifest = {}; }
            if (properties === void 0) { properties = {}; }
            var localExtension = Object.create({ manifest: {} });
            objects_1.assign(localExtension, { type: extensionManagement_1.LocalExtensionType.User, manifest: {} }, properties);
            objects_1.assign(localExtension.manifest, { name: name, publisher: 'pub', version: '1.0.0' }, manifest);
            localExtension.metadata = { id: localExtension.id, publisherId: localExtension.manifest.publisher, publisherDisplayName: 'somename' };
            localExtension.id = extensionManagementUtil_1.getLocalExtensionIdFromManifest(localExtension.manifest);
            return localExtension;
        }
        function aGalleryExtension(name, properties, galleryExtensionProperties, assets) {
            if (properties === void 0) { properties = {}; }
            if (galleryExtensionProperties === void 0) { galleryExtensionProperties = {}; }
            if (assets === void 0) { assets = {}; }
            var galleryExtension = Object.create({});
            objects_1.assign(galleryExtension, { name: name, publisher: 'pub', uuid: uuid_1.generateUuid(), version: '1.0.0', properties: {}, assets: {} }, properties);
            objects_1.assign(galleryExtension.properties, { dependencies: [] }, galleryExtensionProperties);
            objects_1.assign(galleryExtension.assets, assets);
            galleryExtension.id = extensionManagementUtil_1.getGalleryExtensionId(galleryExtension.publisher, galleryExtension.name);
            return galleryExtension;
        }
        function aPage() {
            var objects = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                objects[_i] = arguments[_i];
            }
            return { firstPage: objects, total: objects.length, pageSize: objects.length, getPage: function () { return null; } };
        }
    });
});
//# sourceMappingURL=extensionsActions.test.js.map