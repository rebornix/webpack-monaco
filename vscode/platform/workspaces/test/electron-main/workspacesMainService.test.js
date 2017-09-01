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
define(["require", "exports", "assert", "fs", "os", "path", "vs/base/node/extfs", "vs/base/node/pfs", "vs/platform/environment/node/environmentService", "vs/platform/environment/node/argv", "vs/platform/workspaces/electron-main/workspacesMainService", "vs/platform/workspaces/common/workspaces", "vs/platform/log/common/log", "vs/base/common/uri"], function (require, exports, assert, fs, os, path, extfs, pfs, environmentService_1, argv_1, workspacesMainService_1, workspaces_1, log_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('WorkspacesMainService', function () {
        var parentDir = path.join(os.tmpdir(), 'vsctests', 'service');
        var workspacesHome = path.join(parentDir, 'Workspaces');
        var TestEnvironmentService = (function (_super) {
            __extends(TestEnvironmentService, _super);
            function TestEnvironmentService() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Object.defineProperty(TestEnvironmentService.prototype, "workspacesHome", {
                get: function () {
                    return workspacesHome;
                },
                enumerable: true,
                configurable: true
            });
            return TestEnvironmentService;
        }(environmentService_1.EnvironmentService));
        var TestWorkspacesMainService = (function (_super) {
            __extends(TestWorkspacesMainService, _super);
            function TestWorkspacesMainService() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TestWorkspacesMainService.prototype.deleteUntitledWorkspaceSync = function (workspace) {
                this.deleteWorkspaceCall = workspace;
                _super.prototype.deleteUntitledWorkspaceSync.call(this, workspace);
            };
            return TestWorkspacesMainService;
        }(workspacesMainService_1.WorkspacesMainService));
        var environmentService = new TestEnvironmentService(argv_1.parseArgs(process.argv), process.execPath);
        var logService = new log_1.LogMainService(environmentService);
        var service;
        setup(function (done) {
            service = new TestWorkspacesMainService(environmentService, logService);
            // Delete any existing backups completely and then re-create it.
            extfs.del(workspacesHome, os.tmpdir(), function () {
                pfs.mkdirp(workspacesHome).then(function () {
                    done();
                });
            });
        });
        teardown(function (done) {
            extfs.del(workspacesHome, os.tmpdir(), done);
        });
        test('createWorkspace (folders)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                assert.ok(workspace);
                assert.ok(fs.existsSync(workspace.configPath));
                assert.ok(service.isUntitledWorkspace(workspace));
                var ws = JSON.parse(fs.readFileSync(workspace.configPath).toString());
                assert.equal(ws.folders.length, 2); //
                assert.equal(ws.folders[0].path, process.cwd());
                assert.equal(ws.folders[1].path, os.tmpdir());
                done();
            });
        });
        test('createWorkspaceSync (folders)', function () {
            var workspace = service.createWorkspaceSync([process.cwd(), os.tmpdir()]);
            assert.ok(workspace);
            assert.ok(fs.existsSync(workspace.configPath));
            assert.ok(service.isUntitledWorkspace(workspace));
            var ws = JSON.parse(fs.readFileSync(workspace.configPath).toString());
            assert.equal(ws.folders.length, 2); //
            assert.equal(ws.folders[0].path, process.cwd());
            assert.equal(ws.folders[1].path, os.tmpdir());
        });
        test('resolveWorkspaceSync', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                assert.ok(service.resolveWorkspaceSync(workspace.configPath));
                // make it a valid workspace path
                var newPath = path.join(path.dirname(workspace.configPath), "workspace." + workspaces_1.WORKSPACE_EXTENSION);
                fs.renameSync(workspace.configPath, newPath);
                workspace.configPath = newPath;
                var resolved = service.resolveWorkspaceSync(workspace.configPath);
                assert.equal(2, resolved.folders.length);
                assert.equal(resolved.configPath, workspace.configPath);
                assert.ok(resolved.id);
                fs.writeFileSync(workspace.configPath, JSON.stringify({ something: 'something' })); // invalid workspace
                var resolvedInvalid = service.resolveWorkspaceSync(workspace.configPath);
                assert.ok(!resolvedInvalid);
                done();
            });
        });
        test('resolveWorkspace', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                return service.resolveWorkspace(workspace.configPath).then(function (ws) {
                    assert.ok(ws);
                    // make it a valid workspace path
                    var newPath = path.join(path.dirname(workspace.configPath), "workspace." + workspaces_1.WORKSPACE_EXTENSION);
                    fs.renameSync(workspace.configPath, newPath);
                    workspace.configPath = newPath;
                    return service.resolveWorkspace(workspace.configPath).then(function (resolved) {
                        assert.equal(2, resolved.folders.length);
                        assert.equal(resolved.configPath, workspace.configPath);
                        assert.ok(resolved.id);
                        fs.writeFileSync(workspace.configPath, JSON.stringify({ something: 'something' })); // invalid workspace
                        return service.resolveWorkspace(workspace.configPath).then(function (resolvedInvalid) {
                            assert.ok(!resolvedInvalid);
                            done();
                        });
                    });
                });
            });
        });
        test('resolveWorkspaceSync (support relative paths)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                fs.writeFileSync(workspace.configPath, JSON.stringify({ folders: [{ path: './ticino-playground/lib' }] }));
                var resolved = service.resolveWorkspaceSync(workspace.configPath);
                assert.equal(uri_1.default.file(resolved.folders[0].path).fsPath, uri_1.default.file(path.join(path.dirname(workspace.configPath), 'ticino-playground', 'lib')).fsPath);
                done();
            });
        });
        test('resolveWorkspaceSync (support relative paths #2)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                fs.writeFileSync(workspace.configPath, JSON.stringify({ folders: [{ path: './ticino-playground/lib/../other' }] }));
                var resolved = service.resolveWorkspaceSync(workspace.configPath);
                assert.equal(uri_1.default.file(resolved.folders[0].path).fsPath, uri_1.default.file(path.join(path.dirname(workspace.configPath), 'ticino-playground', 'other')).fsPath);
                done();
            });
        });
        test('resolveWorkspaceSync (support relative paths #3)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                fs.writeFileSync(workspace.configPath, JSON.stringify({ folders: [{ path: 'ticino-playground/lib' }] }));
                var resolved = service.resolveWorkspaceSync(workspace.configPath);
                assert.equal(uri_1.default.file(resolved.folders[0].path).fsPath, uri_1.default.file(path.join(path.dirname(workspace.configPath), 'ticino-playground', 'lib')).fsPath);
                done();
            });
        });
        test('saveWorkspace (untitled)', function (done) {
            var savedEvent;
            var listener = service.onWorkspaceSaved(function (e) {
                savedEvent = e;
            });
            var deletedEvent;
            var listener2 = service.onUntitledWorkspaceDeleted(function (e) {
                deletedEvent = e;
            });
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                var workspaceConfigPath = path.join(os.tmpdir(), "myworkspace." + Date.now() + "." + workspaces_1.WORKSPACE_EXTENSION);
                return service.saveWorkspace(workspace, workspaceConfigPath).then(function (savedWorkspace) {
                    assert.ok(savedWorkspace.id);
                    assert.notEqual(savedWorkspace.id, workspace.id);
                    assert.equal(savedWorkspace.configPath, workspaceConfigPath);
                    assert.equal(service.deleteWorkspaceCall, workspace);
                    var ws = JSON.parse(fs.readFileSync(savedWorkspace.configPath).toString());
                    assert.equal(ws.folders.length, 2);
                    assert.equal(ws.folders[0].path, process.cwd()); // absolute
                    assert.equal(ws.folders[1].path, path.relative(path.dirname(workspaceConfigPath), os.tmpdir())); // relative
                    assert.equal(savedWorkspace, savedEvent.workspace);
                    assert.equal(workspace.configPath, savedEvent.oldConfigPath);
                    assert.deepEqual(deletedEvent, workspace);
                    listener.dispose();
                    listener2.dispose();
                    extfs.delSync(workspaceConfigPath);
                    done();
                });
            });
        });
        test('saveWorkspace (saved workspace)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                var workspaceConfigPath = path.join(os.tmpdir(), "myworkspace." + Date.now() + "." + workspaces_1.WORKSPACE_EXTENSION);
                var newWorkspaceConfigPath = path.join(os.tmpdir(), "mySavedWorkspace." + Date.now() + "." + workspaces_1.WORKSPACE_EXTENSION);
                return service.saveWorkspace(workspace, workspaceConfigPath).then(function (savedWorkspace) {
                    return service.saveWorkspace(savedWorkspace, newWorkspaceConfigPath).then(function (newSavedWorkspace) {
                        assert.ok(newSavedWorkspace.id);
                        assert.notEqual(newSavedWorkspace.id, workspace.id);
                        assert.equal(newSavedWorkspace.configPath, newWorkspaceConfigPath);
                        var ws = JSON.parse(fs.readFileSync(newSavedWorkspace.configPath).toString());
                        assert.equal(ws.folders.length, 2);
                        assert.equal(ws.folders[0].path, process.cwd()); // absolute path because outside of tmpdir
                        assert.equal(ws.folders[1].path, path.relative(path.dirname(workspaceConfigPath), os.tmpdir())); // relative path because inside of tmpdir
                        extfs.delSync(workspaceConfigPath);
                        extfs.delSync(newWorkspaceConfigPath);
                        done();
                    });
                });
            });
        });
        test('deleteUntitledWorkspaceSync (untitled)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                assert.ok(fs.existsSync(workspace.configPath));
                service.deleteUntitledWorkspaceSync(workspace);
                assert.ok(!fs.existsSync(workspace.configPath));
                done();
            });
        });
        test('deleteUntitledWorkspaceSync (saved)', function (done) {
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (workspace) {
                var workspaceConfigPath = path.join(os.tmpdir(), "myworkspace." + Date.now() + "." + workspaces_1.WORKSPACE_EXTENSION);
                return service.saveWorkspace(workspace, workspaceConfigPath).then(function (savedWorkspace) {
                    assert.ok(fs.existsSync(savedWorkspace.configPath));
                    service.deleteUntitledWorkspaceSync(savedWorkspace);
                    assert.ok(fs.existsSync(savedWorkspace.configPath));
                    done();
                });
            });
        });
        test('getUntitledWorkspaceSync', function (done) {
            var untitled = service.getUntitledWorkspacesSync();
            assert.equal(0, untitled.length);
            return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (untitledOne) {
                untitled = service.getUntitledWorkspacesSync();
                assert.equal(1, untitled.length);
                assert.equal(untitledOne.id, untitled[0].id);
                return service.createWorkspace([process.cwd(), os.tmpdir()]).then(function (untitledTwo) {
                    untitled = service.getUntitledWorkspacesSync();
                    assert.equal(2, untitled.length);
                    service.deleteUntitledWorkspaceSync(untitledOne);
                    service.deleteUntitledWorkspaceSync(untitledTwo);
                    untitled = service.getUntitledWorkspacesSync();
                    assert.equal(0, untitled.length);
                    done();
                });
            });
        });
    });
});
//# sourceMappingURL=workspacesMainService.test.js.map