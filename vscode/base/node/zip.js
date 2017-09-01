/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "path", "fs", "vs/base/common/async", "vs/base/node/pfs", "vs/base/common/winjs.base", "yauzl"], function (require, exports, nls, path, fs_1, async_1, pfs_1, winjs_base_1, yauzl_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function modeFromEntry(entry) {
        var attr = entry.externalFileAttributes >> 16 || 33188;
        return [448 /* S_IRWXU */, 56 /* S_IRWXG */, 7 /* S_IRWXO */]
            .map(function (mask) { return attr & mask; })
            .reduce(function (a, b) { return a + b; }, attr & 61440 /* S_IFMT */);
    }
    function extractEntry(stream, fileName, mode, targetPath, options) {
        var dirName = path.dirname(fileName);
        var targetDirName = path.join(targetPath, dirName);
        var targetFileName = path.join(targetPath, fileName);
        return pfs_1.mkdirp(targetDirName).then(function () { return new winjs_base_1.TPromise(function (c, e) {
            var istream = fs_1.createWriteStream(targetFileName, { mode: mode });
            istream.once('finish', function () { return c(null); });
            istream.once('error', e);
            stream.once('error', e);
            stream.pipe(istream);
        }); });
    }
    function extractZip(zipfile, targetPath, options) {
        return new winjs_base_1.TPromise(function (c, e) {
            var throttler = new async_1.SimpleThrottler();
            var last = winjs_base_1.TPromise.as(null);
            zipfile.once('error', e);
            zipfile.once('close', function () { return last.then(c, e); });
            zipfile.on('entry', function (entry) {
                if (!options.sourcePathRegex.test(entry.fileName)) {
                    return;
                }
                var fileName = entry.fileName.replace(options.sourcePathRegex, '');
                // directory file names end with '/'
                if (/\/$/.test(fileName)) {
                    var targetFileName = path.join(targetPath, fileName);
                    last = pfs_1.mkdirp(targetFileName);
                    return;
                }
                var stream = async_1.ninvoke(zipfile, zipfile.openReadStream, entry);
                var mode = modeFromEntry(entry);
                last = throttler.queue(function () { return stream.then(function (stream) { return extractEntry(stream, fileName, mode, targetPath, options); }); });
            });
        });
    }
    function extract(zipPath, targetPath, options) {
        if (options === void 0) { options = {}; }
        var sourcePathRegex = new RegExp(options.sourcePath ? "^" + options.sourcePath : '');
        var promise = async_1.nfcall(yauzl_1.open, zipPath);
        if (options.overwrite) {
            promise = promise.then(function (zipfile) { return pfs_1.rimraf(targetPath).then(function () { return zipfile; }); });
        }
        return promise.then(function (zipfile) { return extractZip(zipfile, targetPath, { sourcePathRegex: sourcePathRegex }); });
    }
    exports.extract = extract;
    function read(zipPath, filePath) {
        return async_1.nfcall(yauzl_1.open, zipPath).then(function (zipfile) {
            return new winjs_base_1.TPromise(function (c, e) {
                zipfile.on('entry', function (entry) {
                    if (entry.fileName === filePath) {
                        async_1.ninvoke(zipfile, zipfile.openReadStream, entry).done(function (stream) { return c(stream); }, function (err) { return e(err); });
                    }
                });
                zipfile.once('close', function () { return e(new Error(nls.localize('notFound', "{0} not found inside zip.", filePath))); });
            });
        });
    }
    function buffer(zipPath, filePath) {
        return read(zipPath, filePath).then(function (stream) {
            return new winjs_base_1.TPromise(function (c, e) {
                var buffers = [];
                stream.once('error', e);
                stream.on('data', function (b) { return buffers.push(b); });
                stream.on('end', function () { return c(Buffer.concat(buffers)); });
            });
        });
    }
    exports.buffer = buffer;
});
//# sourceMappingURL=zip.js.map