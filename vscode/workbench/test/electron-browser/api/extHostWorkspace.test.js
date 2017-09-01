/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/common/uri", "vs/workbench/api/node/extHostWorkspace", "./testThreadService"], function (require, exports, assert, uri_1, extHostWorkspace_1, testThreadService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('ExtHostWorkspace', function () {
        test('asRelativePath', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', roots: [uri_1.default.file('/Coding/Applications/NewsWoWBot')], name: 'Test' });
            assert.equal(ws.getRelativePath('/Coding/Applications/NewsWoWBot/bernd/das/brot'), 'bernd/das/brot');
            assert.equal(ws.getRelativePath('/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart'), '/Apps/DartPubCache/hosted/pub.dartlang.org/convert-2.0.1/lib/src/hex.dart');
            assert.equal(ws.getRelativePath(''), '');
            assert.equal(ws.getRelativePath('/foo/bar'), '/foo/bar');
            assert.equal(ws.getRelativePath('in/out'), 'in/out');
        });
        test('asRelativePath, same paths, #11402', function () {
            var root = '/home/aeschli/workspaces/samples/docker';
            var input = '/home/aeschli/workspaces/samples/docker';
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', roots: [uri_1.default.file(root)], name: 'Test' });
            assert.equal(ws.getRelativePath(input), input);
            var input2 = '/home/aeschli/workspaces/samples/docker/a.file';
            assert.equal(ws.getRelativePath(input2), 'a.file');
        });
        test('asRelativePath, no workspace', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), null);
            assert.equal(ws.getRelativePath(''), '');
            assert.equal(ws.getRelativePath('/foo/bar'), '/foo/bar');
        });
        test('asRelativePath, multiple folders', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', roots: [uri_1.default.file('/Coding/One'), uri_1.default.file('/Coding/Two')], name: 'Test' });
            assert.equal(ws.getRelativePath('/Coding/One/file.txt'), 'One/file.txt');
            assert.equal(ws.getRelativePath('/Coding/Two/files/out.txt'), 'Two/files/out.txt');
            assert.equal(ws.getRelativePath('/Coding/Two2/files/out.txt'), '/Coding/Two2/files/out.txt');
        });
        test('slightly inconsistent behaviour of asRelativePath and getWorkspaceFolder, #31553', function () {
            var mrws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', roots: [uri_1.default.file('/Coding/One'), uri_1.default.file('/Coding/Two')], name: 'Test' });
            assert.equal(mrws.getRelativePath('/Coding/One/file.txt'), 'One/file.txt');
            assert.equal(mrws.getRelativePath('/Coding/One/file.txt', true), 'One/file.txt');
            assert.equal(mrws.getRelativePath('/Coding/One/file.txt', false), 'file.txt');
            assert.equal(mrws.getRelativePath('/Coding/Two/files/out.txt'), 'Two/files/out.txt');
            assert.equal(mrws.getRelativePath('/Coding/Two/files/out.txt', true), 'Two/files/out.txt');
            assert.equal(mrws.getRelativePath('/Coding/Two/files/out.txt', false), 'files/out.txt');
            assert.equal(mrws.getRelativePath('/Coding/Two2/files/out.txt'), '/Coding/Two2/files/out.txt');
            assert.equal(mrws.getRelativePath('/Coding/Two2/files/out.txt', true), '/Coding/Two2/files/out.txt');
            assert.equal(mrws.getRelativePath('/Coding/Two2/files/out.txt', false), '/Coding/Two2/files/out.txt');
            var srws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', roots: [uri_1.default.file('/Coding/One')], name: 'Test' });
            assert.equal(srws.getRelativePath('/Coding/One/file.txt'), 'file.txt');
            assert.equal(srws.getRelativePath('/Coding/One/file.txt', false), 'file.txt');
            assert.equal(srws.getRelativePath('/Coding/One/file.txt', true), 'One/file.txt');
            assert.equal(srws.getRelativePath('/Coding/Two2/files/out.txt'), '/Coding/Two2/files/out.txt');
            assert.equal(srws.getRelativePath('/Coding/Two2/files/out.txt', true), '/Coding/Two2/files/out.txt');
            assert.equal(srws.getRelativePath('/Coding/Two2/files/out.txt', false), '/Coding/Two2/files/out.txt');
        });
        test('getPath, legacy', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', name: 'Test', roots: [] });
            assert.equal(ws.getPath(), undefined);
            ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), null);
            assert.equal(ws.getPath(), undefined);
            ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), undefined);
            assert.equal(ws.getPath(), undefined);
            ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', name: 'Test', roots: [uri_1.default.file('Folder'), uri_1.default.file('Another/Folder')] });
            assert.equal(ws.getPath().replace(/\\/g, '/'), '/Folder');
            ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', name: 'Test', roots: [uri_1.default.file('/Folder')] });
            assert.equal(ws.getPath().replace(/\\/g, '/'), '/Folder');
        });
        test('WorkspaceFolder has name and index', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', roots: [uri_1.default.file('/Coding/One'), uri_1.default.file('/Coding/Two')], name: 'Test' });
            var _a = ws.getWorkspaceFolders(), one = _a[0], two = _a[1];
            assert.equal(one.name, 'One');
            assert.equal(one.index, 0);
            assert.equal(two.name, 'Two');
            assert.equal(two.index, 1);
        });
        test('getContainingWorkspaceFolder', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', name: 'Test', roots: [uri_1.default.file('/Coding/One'), uri_1.default.file('/Coding/Two'), uri_1.default.file('/Coding/Two/Nested')] });
            var folder = ws.getWorkspaceFolder(uri_1.default.file('/foo/bar'));
            assert.equal(folder, undefined);
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/One/file/path.txt'));
            assert.equal(folder.name, 'One');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two/file/path.txt'));
            assert.equal(folder.name, 'Two');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two/Nest'));
            assert.equal(folder.name, 'Two');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two/Nested/file'));
            assert.equal(folder.name, 'Nested');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two/Nested/f'));
            assert.equal(folder.name, 'Nested');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two/Nested'));
            assert.equal(folder.name, 'Two');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two/Nested/'));
            assert.equal(folder.name, 'Two');
            folder = ws.getWorkspaceFolder(uri_1.default.file('/Coding/Two'));
            assert.equal(folder, undefined);
        });
        test('Multiroot change event should have a delta, #29641', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', name: 'Test', roots: [] });
            var sub = ws.onDidChangeWorkspace(function (e) {
                assert.deepEqual(e.added, []);
                assert.deepEqual(e.removed, []);
            });
            ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', roots: [] });
            sub.dispose();
            sub = ws.onDidChangeWorkspace(function (e) {
                assert.deepEqual(e.removed, []);
                assert.equal(e.added.length, 1);
                assert.equal(e.added[0].uri.toString(), 'foo:bar');
            });
            ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', roots: [uri_1.default.parse('foo:bar')] });
            sub.dispose();
            sub = ws.onDidChangeWorkspace(function (e) {
                assert.deepEqual(e.removed, []);
                assert.equal(e.added.length, 1);
                assert.equal(e.added[0].uri.toString(), 'foo:bar2');
            });
            ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', roots: [uri_1.default.parse('foo:bar'), uri_1.default.parse('foo:bar2')] });
            sub.dispose();
            sub = ws.onDidChangeWorkspace(function (e) {
                assert.equal(e.removed.length, 2);
                assert.equal(e.removed[0].uri.toString(), 'foo:bar');
                assert.equal(e.removed[1].uri.toString(), 'foo:bar2');
                assert.equal(e.added.length, 1);
                assert.equal(e.added[0].uri.toString(), 'foo:bar3');
            });
            ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', roots: [uri_1.default.parse('foo:bar3')] });
            sub.dispose();
        });
        test('Multiroot change event is immutable', function () {
            var ws = new extHostWorkspace_1.ExtHostWorkspace(new testThreadService_1.TestThreadService(), { id: 'foo', name: 'Test', roots: [] });
            var sub = ws.onDidChangeWorkspace(function (e) {
                assert.throws(function () {
                    e.added = [];
                });
                assert.throws(function () {
                    e.added[0] = null;
                });
            });
            ws.$acceptWorkspaceData({ id: 'foo', name: 'Test', roots: [] });
            sub.dispose();
        });
    });
});
//# sourceMappingURL=extHostWorkspace.test.js.map