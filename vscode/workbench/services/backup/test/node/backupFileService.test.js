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
define(["require", "exports", "assert", "vs/base/common/platform", "crypto", "os", "fs", "path", "vs/base/node/extfs", "vs/base/node/pfs", "vs/base/common/uri", "vs/workbench/services/backup/node/backupFileService", "vs/workbench/services/files/node/fileService", "vs/platform/environment/node/environmentService", "vs/platform/environment/node/argv", "vs/editor/common/model/textSource", "vs/workbench/test/workbenchTestServices", "vs/platform/workspace/common/workspace", "vs/platform/configuration/test/common/testConfigurationService"], function (require, exports, assert, platform, crypto, os, fs, path, extfs, pfs, uri_1, backupFileService_1, fileService_1, environmentService_1, argv_1, textSource_1, workbenchTestServices_1, workspace_1, testConfigurationService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestEnvironmentService = (function (_super) {
        __extends(TestEnvironmentService, _super);
        function TestEnvironmentService(_backupHome, _backupWorkspacesPath) {
            var _this = _super.call(this, argv_1.parseArgs(process.argv), process.execPath) || this;
            _this._backupHome = _backupHome;
            _this._backupWorkspacesPath = _backupWorkspacesPath;
            return _this;
        }
        Object.defineProperty(TestEnvironmentService.prototype, "backupHome", {
            get: function () { return this._backupHome; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestEnvironmentService.prototype, "backupWorkspacesPath", {
            get: function () { return this._backupWorkspacesPath; },
            enumerable: true,
            configurable: true
        });
        return TestEnvironmentService;
    }(environmentService_1.EnvironmentService));
    var parentDir = path.join(os.tmpdir(), 'vsctests', 'service');
    var backupHome = path.join(parentDir, 'Backups');
    var workspacesJsonPath = path.join(backupHome, 'workspaces.json');
    var workspaceResource = uri_1.default.file(platform.isWindows ? 'c:\\workspace' : '/workspace');
    var workspaceBackupPath = path.join(backupHome, crypto.createHash('md5').update(workspaceResource.fsPath).digest('hex'));
    var fooFile = uri_1.default.file(platform.isWindows ? 'c:\\Foo' : '/Foo');
    var barFile = uri_1.default.file(platform.isWindows ? 'c:\\Bar' : '/Bar');
    var untitledFile = uri_1.default.from({ scheme: 'untitled', path: 'Untitled-1' });
    var fooBackupPath = path.join(workspaceBackupPath, 'file', crypto.createHash('md5').update(fooFile.fsPath).digest('hex'));
    var fooBackupPathLegacy = path.join(workspaceBackupPath, 'file', crypto.createHash('md5').update(fooFile.fsPath.toLowerCase()).digest('hex'));
    var barBackupPath = path.join(workspaceBackupPath, 'file', crypto.createHash('md5').update(barFile.fsPath).digest('hex'));
    var untitledBackupPath = path.join(workspaceBackupPath, 'untitled', crypto.createHash('md5').update(untitledFile.fsPath).digest('hex'));
    var TestBackupFileService = (function (_super) {
        __extends(TestBackupFileService, _super);
        function TestBackupFileService(workspace, backupHome, workspacesJsonPath) {
            var _this = this;
            var fileService = new fileService_1.FileService(new workbenchTestServices_1.TestContextService(new workspace_1.Workspace(workspace.fsPath, workspace.fsPath, [workspace])), new testConfigurationService_1.TestConfigurationService(), { disableWatcher: true });
            _this = _super.call(this, workspaceBackupPath, fileService) || this;
            return _this;
        }
        TestBackupFileService.prototype.getBackupResource = function (resource, legacyMacWindowsFormat) {
            return _super.prototype.getBackupResource.call(this, resource, legacyMacWindowsFormat);
        };
        return TestBackupFileService;
    }(backupFileService_1.BackupFileService));
    suite('BackupFileService', function () {
        var service;
        setup(function (done) {
            service = new TestBackupFileService(workspaceResource, backupHome, workspacesJsonPath);
            // Delete any existing backups completely and then re-create it.
            extfs.del(backupHome, os.tmpdir(), function () {
                pfs.mkdirp(backupHome).then(function () {
                    pfs.writeFile(workspacesJsonPath, '').then(function () {
                        done();
                    });
                });
            });
        });
        teardown(function (done) {
            extfs.del(backupHome, os.tmpdir(), done);
        });
        suite('getBackupResource', function () {
            test('should get the correct backup path for text files', function () {
                // Format should be: <backupHome>/<workspaceHash>/<scheme>/<filePathHash>
                var backupResource = fooFile;
                var workspaceHash = crypto.createHash('md5').update(workspaceResource.fsPath).digest('hex');
                var filePathHash = crypto.createHash('md5').update(backupResource.fsPath).digest('hex');
                var expectedPath = uri_1.default.file(path.join(backupHome, workspaceHash, 'file', filePathHash)).fsPath;
                assert.equal(service.getBackupResource(backupResource).fsPath, expectedPath);
            });
            test('should get the correct backup path for untitled files', function () {
                // Format should be: <backupHome>/<workspaceHash>/<scheme>/<filePath>
                var backupResource = uri_1.default.from({ scheme: 'untitled', path: 'Untitled-1' });
                var workspaceHash = crypto.createHash('md5').update(workspaceResource.fsPath).digest('hex');
                var filePathHash = crypto.createHash('md5').update(backupResource.fsPath).digest('hex');
                var expectedPath = uri_1.default.file(path.join(backupHome, workspaceHash, 'untitled', filePathHash)).fsPath;
                assert.equal(service.getBackupResource(backupResource).fsPath, expectedPath);
            });
        });
        suite('loadBackupResource', function () {
            test('should return whether a backup resource exists', function (done) {
                pfs.mkdirp(path.dirname(fooBackupPath)).then(function () {
                    fs.writeFileSync(fooBackupPath, 'foo');
                    service = new TestBackupFileService(workspaceResource, backupHome, workspacesJsonPath);
                    service.loadBackupResource(fooFile).then(function (resource) {
                        assert.ok(resource);
                        assert.equal(path.basename(resource.fsPath), path.basename(fooBackupPath));
                        return service.hasBackups().then(function (hasBackups) {
                            assert.ok(hasBackups);
                            done();
                        });
                    });
                });
            });
            test('should return whether a backup resource exists - legacy support (read old lowercase format as fallback)', function (done) {
                if (platform.isLinux) {
                    done();
                    return; // only on mac and windows
                }
                pfs.mkdirp(path.dirname(fooBackupPath)).then(function () {
                    fs.writeFileSync(fooBackupPathLegacy, 'foo');
                    service = new TestBackupFileService(workspaceResource, backupHome, workspacesJsonPath);
                    service.loadBackupResource(fooFile).then(function (resource) {
                        assert.ok(resource);
                        assert.equal(path.basename(resource.fsPath), path.basename(fooBackupPathLegacy));
                        return service.hasBackups().then(function (hasBackups) {
                            assert.ok(hasBackups);
                            done();
                        });
                    });
                });
            });
            test('should return whether a backup resource exists - legacy support #2 (both cases present, return case sensitive backup)', function (done) {
                if (platform.isLinux) {
                    done();
                    return; // only on mac and windows
                }
                pfs.mkdirp(path.dirname(fooBackupPath)).then(function () {
                    fs.writeFileSync(fooBackupPath, 'foo');
                    fs.writeFileSync(fooBackupPathLegacy, 'foo');
                    service = new TestBackupFileService(workspaceResource, backupHome, workspacesJsonPath);
                    service.loadBackupResource(fooFile).then(function (resource) {
                        assert.ok(resource);
                        assert.equal(path.basename(resource.fsPath), path.basename(fooBackupPath));
                        return service.hasBackups().then(function (hasBackups) {
                            assert.ok(hasBackups);
                            done();
                        });
                    });
                });
            });
        });
        suite('backupResource', function () {
            test('text file', function (done) {
                service.backupResource(fooFile, 'test').then(function () {
                    assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 1);
                    assert.equal(fs.existsSync(fooBackupPath), true);
                    assert.equal(fs.readFileSync(fooBackupPath), fooFile.toString() + "\ntest");
                    done();
                });
            });
            test('untitled file', function (done) {
                service.backupResource(untitledFile, 'test').then(function () {
                    assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'untitled')).length, 1);
                    assert.equal(fs.existsSync(untitledBackupPath), true);
                    assert.equal(fs.readFileSync(untitledBackupPath), untitledFile.toString() + "\ntest");
                    done();
                });
            });
        });
        suite('discardResourceBackup', function () {
            test('text file', function (done) {
                service.backupResource(fooFile, 'test').then(function () {
                    assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 1);
                    service.discardResourceBackup(fooFile).then(function () {
                        assert.equal(fs.existsSync(fooBackupPath), false);
                        assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 0);
                        done();
                    });
                });
            });
            test('untitled file', function (done) {
                service.backupResource(untitledFile, 'test').then(function () {
                    assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'untitled')).length, 1);
                    service.discardResourceBackup(untitledFile).then(function () {
                        assert.equal(fs.existsSync(untitledBackupPath), false);
                        assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'untitled')).length, 0);
                        done();
                    });
                });
            });
            test('text file - legacy support (dicard lowercase backup file if present)', function (done) {
                if (platform.isLinux) {
                    done();
                    return; // only on mac and windows
                }
                pfs.mkdirp(path.dirname(fooBackupPath)).then(function () {
                    fs.writeFileSync(fooBackupPathLegacy, 'foo');
                    service = new TestBackupFileService(workspaceResource, backupHome, workspacesJsonPath);
                    service.backupResource(fooFile, 'test').then(function () {
                        assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 2);
                        service.discardResourceBackup(fooFile).then(function () {
                            assert.equal(fs.existsSync(fooBackupPath), false);
                            assert.equal(fs.existsSync(fooBackupPathLegacy), false);
                            assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 0);
                            done();
                        });
                    });
                });
            });
        });
        suite('discardAllWorkspaceBackups', function () {
            test('text file', function (done) {
                service.backupResource(fooFile, 'test').then(function () {
                    assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 1);
                    service.backupResource(barFile, 'test').then(function () {
                        assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'file')).length, 2);
                        service.discardAllWorkspaceBackups().then(function () {
                            assert.equal(fs.existsSync(fooBackupPath), false);
                            assert.equal(fs.existsSync(barBackupPath), false);
                            assert.equal(fs.existsSync(path.join(workspaceBackupPath, 'file')), false);
                            done();
                        });
                    });
                });
            });
            test('untitled file', function (done) {
                service.backupResource(untitledFile, 'test').then(function () {
                    assert.equal(fs.readdirSync(path.join(workspaceBackupPath, 'untitled')).length, 1);
                    service.discardAllWorkspaceBackups().then(function () {
                        assert.equal(fs.existsSync(untitledBackupPath), false);
                        assert.equal(fs.existsSync(path.join(workspaceBackupPath, 'untitled')), false);
                        done();
                    });
                });
            });
            test('should disable further backups', function (done) {
                service.discardAllWorkspaceBackups().then(function () {
                    service.backupResource(untitledFile, 'test').then(function () {
                        assert.equal(fs.existsSync(workspaceBackupPath), false);
                        done();
                    });
                });
            });
        });
        suite('getWorkspaceFileBackups', function () {
            test('("file") - text file', function (done) {
                service.backupResource(fooFile, "test").then(function () {
                    service.getWorkspaceFileBackups().then(function (textFiles) {
                        assert.deepEqual(textFiles.map(function (f) { return f.fsPath; }), [fooFile.fsPath]);
                        service.backupResource(barFile, "test").then(function () {
                            service.getWorkspaceFileBackups().then(function (textFiles) {
                                assert.deepEqual(textFiles.map(function (f) { return f.fsPath; }), [fooFile.fsPath, barFile.fsPath]);
                                done();
                            });
                        });
                    });
                });
            });
            test('("file") - untitled file', function (done) {
                service.backupResource(untitledFile, "test").then(function () {
                    service.getWorkspaceFileBackups().then(function (textFiles) {
                        assert.deepEqual(textFiles.map(function (f) { return f.fsPath; }), [untitledFile.fsPath]);
                        done();
                    });
                });
            });
            test('("untitled") - untitled file', function (done) {
                service.backupResource(untitledFile, "test").then(function () {
                    service.getWorkspaceFileBackups().then(function (textFiles) {
                        assert.deepEqual(textFiles.map(function (f) { return f.fsPath; }), ['Untitled-1']);
                        done();
                    });
                });
            });
        });
        test('parseBackupContent', function () {
            test('should separate metadata from content', function () {
                var textSource = textSource_1.RawTextSource.fromString('metadata\ncontent');
                assert.equal(service.parseBackupContent(textSource), 'content');
            });
        });
    });
    suite('BackupFilesModel', function () {
        test('simple', function () {
            var model = new backupFileService_1.BackupFilesModel();
            var resource1 = uri_1.default.file('test.html');
            assert.equal(model.has(resource1), false);
            model.add(resource1);
            assert.equal(model.has(resource1), true);
            assert.equal(model.has(resource1, 0), true);
            assert.equal(model.has(resource1, 1), false);
            model.remove(resource1);
            assert.equal(model.has(resource1), false);
            model.add(resource1);
            assert.equal(model.has(resource1), true);
            assert.equal(model.has(resource1, 0), true);
            assert.equal(model.has(resource1, 1), false);
            model.clear();
            assert.equal(model.has(resource1), false);
            model.add(resource1, 1);
            assert.equal(model.has(resource1), true);
            assert.equal(model.has(resource1, 0), false);
            assert.equal(model.has(resource1, 1), true);
            var resource2 = uri_1.default.file('test1.html');
            var resource3 = uri_1.default.file('test2.html');
            var resource4 = uri_1.default.file('test3.html');
            model.add(resource2);
            model.add(resource3);
            model.add(resource4);
            assert.equal(model.has(resource1), true);
            assert.equal(model.has(resource2), true);
            assert.equal(model.has(resource3), true);
            assert.equal(model.has(resource4), true);
        });
        test('resolve', function (done) {
            pfs.mkdirp(path.dirname(fooBackupPath)).then(function () {
                fs.writeFileSync(fooBackupPath, 'foo');
                var model = new backupFileService_1.BackupFilesModel();
                model.resolve(workspaceBackupPath).then(function (model) {
                    assert.equal(model.has(uri_1.default.file(fooBackupPath)), true);
                    done();
                });
            });
        });
        test('get', function () {
            var model = new backupFileService_1.BackupFilesModel();
            assert.deepEqual(model.get(), []);
            var file1 = uri_1.default.file('/root/file/foo.html');
            var file2 = uri_1.default.file('/root/file/bar.html');
            var untitled = uri_1.default.file('/root/untitled/bar.html');
            model.add(file1);
            model.add(file2);
            model.add(untitled);
            assert.deepEqual(model.get().map(function (f) { return f.fsPath; }), [file1.fsPath, file2.fsPath, untitled.fsPath]);
        });
    });
});
//# sourceMappingURL=backupFileService.test.js.map