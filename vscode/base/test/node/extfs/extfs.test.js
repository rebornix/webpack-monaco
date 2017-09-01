/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "os", "path", "fs", "vs/base/common/uuid", "vs/base/common/strings", "vs/base/node/extfs", "vs/base/test/common/utils"], function (require, exports, assert, os, path, fs, uuid, strings, extfs, utils_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Extfs', function () {
        test('mkdirp', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.mkdirp(newDir, 493, function (error) {
                if (error) {
                    return utils_1.onError(error, done);
                }
                assert.ok(fs.existsSync(newDir));
                extfs.del(parentDir, os.tmpdir(), function () { }, done);
            }); // 493 = 0755
        });
        test('delSync - swallows file not found error', function () {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.delSync(newDir);
            assert.ok(!fs.existsSync(newDir));
        });
        test('delSync - simple', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.mkdirp(newDir, 493, function (error) {
                if (error) {
                    return utils_1.onError(error, done);
                }
                fs.writeFileSync(path.join(newDir, 'somefile.txt'), 'Contents');
                fs.writeFileSync(path.join(newDir, 'someOtherFile.txt'), 'Contents');
                extfs.delSync(newDir);
                assert.ok(!fs.existsSync(newDir));
                done();
            }); // 493 = 0755
        });
        test('delSync - recursive folder structure', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.mkdirp(newDir, 493, function (error) {
                if (error) {
                    return utils_1.onError(error, done);
                }
                fs.writeFileSync(path.join(newDir, 'somefile.txt'), 'Contents');
                fs.writeFileSync(path.join(newDir, 'someOtherFile.txt'), 'Contents');
                fs.mkdirSync(path.join(newDir, 'somefolder'));
                fs.writeFileSync(path.join(newDir, 'somefolder', 'somefile.txt'), 'Contents');
                extfs.delSync(newDir);
                assert.ok(!fs.existsSync(newDir));
                done();
            }); // 493 = 0755
        });
        test('copy, move and delete', function (done) {
            var id = uuid.generateUuid();
            var id2 = uuid.generateUuid();
            var sourceDir = require.toUrl('./fixtures');
            var parentDir = path.join(os.tmpdir(), 'vsctests', 'extfs');
            var targetDir = path.join(parentDir, id);
            var targetDir2 = path.join(parentDir, id2);
            extfs.copy(sourceDir, targetDir, function (error) {
                if (error) {
                    return utils_1.onError(error, done);
                }
                assert.ok(fs.existsSync(targetDir));
                assert.ok(fs.existsSync(path.join(targetDir, 'index.html')));
                assert.ok(fs.existsSync(path.join(targetDir, 'site.css')));
                assert.ok(fs.existsSync(path.join(targetDir, 'examples')));
                assert.ok(fs.statSync(path.join(targetDir, 'examples')).isDirectory());
                assert.ok(fs.existsSync(path.join(targetDir, 'examples', 'small.jxs')));
                extfs.mv(targetDir, targetDir2, function (error) {
                    if (error) {
                        return utils_1.onError(error, done);
                    }
                    assert.ok(!fs.existsSync(targetDir));
                    assert.ok(fs.existsSync(targetDir2));
                    assert.ok(fs.existsSync(path.join(targetDir2, 'index.html')));
                    assert.ok(fs.existsSync(path.join(targetDir2, 'site.css')));
                    assert.ok(fs.existsSync(path.join(targetDir2, 'examples')));
                    assert.ok(fs.statSync(path.join(targetDir2, 'examples')).isDirectory());
                    assert.ok(fs.existsSync(path.join(targetDir2, 'examples', 'small.jxs')));
                    extfs.mv(path.join(targetDir2, 'index.html'), path.join(targetDir2, 'index_moved.html'), function (error) {
                        if (error) {
                            return utils_1.onError(error, done);
                        }
                        assert.ok(!fs.existsSync(path.join(targetDir2, 'index.html')));
                        assert.ok(fs.existsSync(path.join(targetDir2, 'index_moved.html')));
                        extfs.del(parentDir, os.tmpdir(), function (error) {
                            if (error) {
                                return utils_1.onError(error, done);
                            }
                        }, function (error) {
                            if (error) {
                                return utils_1.onError(error, done);
                            }
                            assert.ok(!fs.existsSync(parentDir));
                            done();
                        });
                    });
                });
            });
        });
        test('readdir', function (done) {
            if (strings.canNormalize && typeof process.versions['electron'] !== 'undefined' /* needs electron */) {
                var id_1 = uuid.generateUuid();
                var parentDir_1 = path.join(os.tmpdir(), 'vsctests', id_1);
                var newDir_1 = path.join(parentDir_1, 'extfs', id_1, 'öäü');
                extfs.mkdirp(newDir_1, 493, function (error) {
                    if (error) {
                        return utils_1.onError(error, done);
                    }
                    assert.ok(fs.existsSync(newDir_1));
                    extfs.readdir(path.join(parentDir_1, 'extfs', id_1), function (error, children) {
                        assert.equal(children.some(function (n) { return n === 'öäü'; }), true); // Mac always converts to NFD, so
                        extfs.del(parentDir_1, os.tmpdir(), function () { }, done);
                    });
                }); // 493 = 0755
            }
            else {
                done();
            }
        });
        test('writeFileAndFlush', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            var testFile = path.join(newDir, 'flushed.txt');
            extfs.mkdirp(newDir, 493, function (error) {
                if (error) {
                    return utils_1.onError(error, done);
                }
                assert.ok(fs.existsSync(newDir));
                extfs.writeFileAndFlush(testFile, 'Hello World', null, function (error) {
                    if (error) {
                        return utils_1.onError(error, done);
                    }
                    assert.equal(fs.readFileSync(testFile), 'Hello World');
                    var largeString = (new Array(100 * 1024)).join('Large String\n');
                    extfs.writeFileAndFlush(testFile, largeString, null, function (error) {
                        if (error) {
                            return utils_1.onError(error, done);
                        }
                        assert.equal(fs.readFileSync(testFile), largeString);
                        extfs.del(parentDir, os.tmpdir(), function () { }, done);
                    });
                });
            });
        });
        test('realcase', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.mkdirp(newDir, 493, function (error) {
                // assume case insensitive file system
                if (process.platform === 'win32' || process.platform === 'darwin') {
                    var upper = newDir.toUpperCase();
                    var real = extfs.realcaseSync(upper);
                    if (real) {
                        assert.notEqual(real, upper);
                        assert.equal(real.toUpperCase(), upper);
                        assert.equal(real, newDir);
                    }
                }
                else {
                    var real = extfs.realcaseSync(newDir);
                    assert.equal(real, newDir);
                }
                extfs.del(parentDir, os.tmpdir(), function () { }, done);
            });
        });
        test('realpath', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.mkdirp(newDir, 493, function (error) {
                extfs.realpath(newDir, function (error, realpath) {
                    assert.ok(realpath);
                    assert.ok(!error);
                    extfs.del(parentDir, os.tmpdir(), function () { }, done);
                });
            });
        });
        test('realpathSync', function (done) {
            var id = uuid.generateUuid();
            var parentDir = path.join(os.tmpdir(), 'vsctests', id);
            var newDir = path.join(parentDir, 'extfs', id);
            extfs.mkdirp(newDir, 493, function (error) {
                var realpath;
                try {
                    realpath = extfs.realpathSync(newDir);
                }
                catch (error) {
                    assert.ok(!error);
                }
                assert.ok(realpath);
                extfs.del(parentDir, os.tmpdir(), function () { }, done);
            });
        });
    });
});
//# sourceMappingURL=extfs.test.js.map