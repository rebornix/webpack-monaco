/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "child_process", "string_decoder", "vs/base/common/errorMessage", "fs", "path", "vs/base/common/paths", "vs/base/common/scorer", "vs/base/common/objects", "vs/base/common/arrays", "vs/base/common/platform", "vs/base/common/strings", "vs/base/common/types", "vs/base/common/glob", "vs/base/node/extfs", "vs/base/node/flow"], function (require, exports, childProcess, string_decoder_1, errorMessage_1, fs, path, paths_1, scorer, objects, arrays, platform, strings, types, glob, extfs, flow) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Traversal;
    (function (Traversal) {
        Traversal[Traversal["Node"] = 1] = "Node";
        Traversal[Traversal["MacFind"] = 2] = "MacFind";
        Traversal[Traversal["WindowsDir"] = 3] = "WindowsDir";
        Traversal[Traversal["LinuxFind"] = 4] = "LinuxFind";
    })(Traversal || (Traversal = {}));
    var FileWalker = (function () {
        function FileWalker(config) {
            var _this = this;
            this.config = config;
            this.filePattern = config.filePattern;
            this.includePattern = config.includePattern && glob.parse(config.includePattern);
            this.maxResults = config.maxResults || null;
            this.maxFilesize = config.maxFilesize || null;
            this.walkedPaths = Object.create(null);
            this.resultCount = 0;
            this.isLimitHit = false;
            this.directoriesWalked = 0;
            this.filesWalked = 0;
            this.traversal = Traversal.Node;
            this.errors = [];
            if (this.filePattern) {
                this.normalizedFilePatternLowercase = strings.stripWildcards(this.filePattern).toLowerCase();
            }
            this.globalExcludePattern = config.excludePattern && glob.parse(config.excludePattern);
            this.folderExcludePatterns = new Map();
            config.folderQueries.forEach(function (folderQuery) {
                var folderExcludeExpression = objects.assign({}, folderQuery.excludePattern || {}, _this.config.excludePattern || {});
                // Add excludes for other root folders
                config.folderQueries
                    .map(function (rootFolderQuery) { return rootFolderQuery.folder; })
                    .filter(function (rootFolder) { return rootFolder !== folderQuery.folder; })
                    .forEach(function (otherRootFolder) {
                    // Exclude nested root folders
                    if (paths_1.isEqualOrParent(otherRootFolder, folderQuery.folder)) {
                        folderExcludeExpression[path.relative(folderQuery.folder, otherRootFolder)] = true;
                    }
                });
                _this.folderExcludePatterns.set(folderQuery.folder, new AbsoluteAndRelativeParsedExpression(folderExcludeExpression, folderQuery.folder));
            });
        }
        FileWalker.prototype.cancel = function () {
            this.isCanceled = true;
        };
        FileWalker.prototype.walk = function (folderQueries, extraFiles, onResult, done) {
            var _this = this;
            this.fileWalkStartTime = Date.now();
            // Support that the file pattern is a full path to a file that exists
            this.checkFilePatternAbsoluteMatch(function (exists, size) {
                if (_this.isCanceled) {
                    return done(null, _this.isLimitHit);
                }
                // Report result from file pattern if matching
                if (exists) {
                    _this.resultCount++;
                    onResult({
                        relativePath: _this.filePattern,
                        basename: path.basename(_this.filePattern),
                        size: size
                    });
                    // Optimization: a match on an absolute path is a good result and we do not
                    // continue walking the entire root paths array for other matches because
                    // it is very unlikely that another file would match on the full absolute path
                    return done(null, _this.isLimitHit);
                }
                // For each extra file
                if (extraFiles) {
                    extraFiles.forEach(function (extraFilePath) {
                        var basename = path.basename(extraFilePath);
                        if (_this.globalExcludePattern && _this.globalExcludePattern(extraFilePath, basename)) {
                            return; // excluded
                        }
                        // File: Check for match on file pattern and include pattern
                        _this.matchFile(onResult, { relativePath: extraFilePath /* no workspace relative path */, basename: basename });
                    });
                }
                var traverse = _this.nodeJSTraversal;
                if (!_this.maxFilesize) {
                    if (platform.isMacintosh) {
                        _this.traversal = Traversal.MacFind;
                        traverse = _this.findTraversal;
                        // Disable 'dir' for now (#11181, #11179, #11183, #11182).
                    } /* else if (platform.isWindows) {
                        this.traversal = Traversal.WindowsDir;
                        traverse = this.windowsDirTraversal;
                    } */
                    else if (platform.isLinux) {
                        _this.traversal = Traversal.LinuxFind;
                        traverse = _this.findTraversal;
                    }
                }
                var isNodeTraversal = traverse === _this.nodeJSTraversal;
                if (!isNodeTraversal) {
                    _this.cmdForkStartTime = Date.now();
                }
                // For each root folder
                flow.parallel(folderQueries, function (folderQuery, rootFolderDone) {
                    _this.call(traverse, _this, folderQuery, onResult, function (err) {
                        if (err) {
                            if (isNodeTraversal) {
                                rootFolderDone(err, undefined);
                            }
                            else {
                                // fallback
                                var errorMessage = errorMessage_1.toErrorMessage(err);
                                console.error(errorMessage);
                                _this.errors.push(errorMessage);
                                _this.nodeJSTraversal(folderQuery, onResult, function (err) { return rootFolderDone(err, undefined); });
                            }
                        }
                        else {
                            rootFolderDone(undefined, undefined);
                        }
                    });
                }, function (err, result) {
                    done(err ? err[0] : null, _this.isLimitHit);
                });
            });
        };
        FileWalker.prototype.call = function (fun, that) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            try {
                fun.apply(that, args);
            }
            catch (e) {
                args[args.length - 1](e);
            }
        };
        FileWalker.prototype.findTraversal = function (folderQuery, onResult, cb) {
            var _this = this;
            var rootFolder = folderQuery.folder;
            var isMac = platform.isMacintosh;
            var done = function (err) {
                done = function () { };
                cb(err);
            };
            var leftover = '';
            var first = true;
            var tree = this.initDirectoryTree();
            var cmd = this.spawnFindCmd(folderQuery);
            this.collectStdout(cmd, 'utf8', function (err, stdout, last) {
                if (err) {
                    done(err);
                    return;
                }
                // Mac: uses NFD unicode form on disk, but we want NFC
                var normalized = leftover + (isMac ? strings.normalizeNFC(stdout) : stdout);
                var relativeFiles = normalized.split('\n./');
                if (first && normalized.length >= 2) {
                    first = false;
                    relativeFiles[0] = relativeFiles[0].trim().substr(2);
                }
                if (last) {
                    var n = relativeFiles.length;
                    relativeFiles[n - 1] = relativeFiles[n - 1].trim();
                    if (!relativeFiles[n - 1]) {
                        relativeFiles.pop();
                    }
                }
                else {
                    leftover = relativeFiles.pop();
                }
                if (relativeFiles.length && relativeFiles[0].indexOf('\n') !== -1) {
                    done(new Error('Splitting up files failed'));
                    return;
                }
                _this.addDirectoryEntries(tree, rootFolder, relativeFiles, onResult);
                if (last) {
                    _this.matchDirectoryTree(tree, rootFolder, onResult);
                    done();
                }
            });
        };
        // protected windowsDirTraversal(rootFolder: string, onResult: (result: IRawFileMatch) => void, done: (err?: Error) => void): void {
        // 	const cmd = childProcess.spawn('cmd', ['/U', '/c', 'dir', '/s', '/b', '/a-d', rootFolder]);
        // 	this.readStdout(cmd, 'ucs2', (err: Error, stdout?: string) => {
        // 		if (err) {
        // 			done(err);
        // 			return;
        // 		}
        // 		const relativeFiles = stdout.split(`\r\n${rootFolder}\\`);
        // 		relativeFiles[0] = relativeFiles[0].trim().substr(rootFolder.length + 1);
        // 		const n = relativeFiles.length;
        // 		relativeFiles[n - 1] = relativeFiles[n - 1].trim();
        // 		if (!relativeFiles[n - 1]) {
        // 			relativeFiles.pop();
        // 		}
        // 		if (relativeFiles.length && relativeFiles[0].indexOf('\n') !== -1) {
        // 			done(new Error('Splitting up files failed'));
        // 			return;
        // 		}
        // 		this.matchFiles(rootFolder, relativeFiles, onResult);
        // 		done();
        // 	});
        // }
        /**
         * Public for testing.
         */
        FileWalker.prototype.spawnFindCmd = function (folderQuery) {
            var excludePattern = this.folderExcludePatterns.get(folderQuery.folder);
            var basenames = excludePattern.getBasenameTerms();
            var pathTerms = excludePattern.getPathTerms();
            var args = ['-L', '.'];
            if (basenames.length || pathTerms.length) {
                args.push('-not', '(', '(');
                for (var _i = 0, basenames_1 = basenames; _i < basenames_1.length; _i++) {
                    var basename = basenames_1[_i];
                    args.push('-name', basename);
                    args.push('-o');
                }
                for (var _a = 0, pathTerms_1 = pathTerms; _a < pathTerms_1.length; _a++) {
                    var path_1 = pathTerms_1[_a];
                    args.push('-path', path_1);
                    args.push('-o');
                }
                args.pop();
                args.push(')', '-prune', ')');
            }
            args.push('-type', 'f');
            return childProcess.spawn('find', args, { cwd: folderQuery.folder });
        };
        /**
         * Public for testing.
         */
        FileWalker.prototype.readStdout = function (cmd, encoding, cb) {
            var all = '';
            this.collectStdout(cmd, encoding, function (err, stdout, last) {
                if (err) {
                    cb(err);
                    return;
                }
                all += stdout;
                if (last) {
                    cb(null, all);
                }
            });
        };
        FileWalker.prototype.collectStdout = function (cmd, encoding, cb) {
            var _this = this;
            var done = function (err, stdout, last) {
                if (err || last) {
                    done = function () { };
                    _this.cmdForkResultTime = Date.now();
                }
                cb(err, stdout, last);
            };
            this.forwardData(cmd.stdout, encoding, done);
            var stderr = this.collectData(cmd.stderr);
            cmd.on('error', function (err) {
                done(err);
            });
            cmd.on('close', function (code) {
                if (code !== 0) {
                    done(new Error("find failed with error code " + code + ": " + _this.decodeData(stderr, encoding)));
                }
                else {
                    done(null, '', true);
                }
            });
        };
        FileWalker.prototype.forwardData = function (stream, encoding, cb) {
            var decoder = new string_decoder_1.StringDecoder(encoding);
            stream.on('data', function (data) {
                cb(null, decoder.write(data));
            });
            return decoder;
        };
        FileWalker.prototype.collectData = function (stream) {
            var buffers = [];
            stream.on('data', function (data) {
                buffers.push(data);
            });
            return buffers;
        };
        FileWalker.prototype.decodeData = function (buffers, encoding) {
            var decoder = new string_decoder_1.StringDecoder(encoding);
            return buffers.map(function (buffer) { return decoder.write(buffer); }).join('');
        };
        FileWalker.prototype.initDirectoryTree = function () {
            var tree = {
                rootEntries: [],
                pathToEntries: Object.create(null)
            };
            tree.pathToEntries['.'] = tree.rootEntries;
            return tree;
        };
        FileWalker.prototype.addDirectoryEntries = function (_a, base, relativeFiles, onResult) {
            var pathToEntries = _a.pathToEntries;
            this.cmdResultCount += relativeFiles.length;
            // Support relative paths to files from a root resource (ignores excludes)
            if (relativeFiles.indexOf(this.filePattern) !== -1) {
                var basename = path.basename(this.filePattern);
                this.matchFile(onResult, { base: base, relativePath: this.filePattern, basename: basename });
            }
            function add(relativePath) {
                var basename = path.basename(relativePath);
                var dirname = path.dirname(relativePath);
                var entries = pathToEntries[dirname];
                if (!entries) {
                    entries = pathToEntries[dirname] = [];
                    add(dirname);
                }
                entries.push({
                    base: base,
                    relativePath: relativePath,
                    basename: basename
                });
            }
            relativeFiles.forEach(add);
        };
        FileWalker.prototype.matchDirectoryTree = function (_a, rootFolder, onResult) {
            var rootEntries = _a.rootEntries, pathToEntries = _a.pathToEntries;
            var self = this;
            var excludePattern = this.folderExcludePatterns.get(rootFolder);
            var filePattern = this.filePattern;
            function matchDirectory(entries) {
                self.directoriesWalked++;
                var _loop_1 = function (i, n) {
                    var entry = entries[i];
                    var relativePath = entry.relativePath, basename = entry.basename;
                    // Check exclude pattern
                    // If the user searches for the exact file name, we adjust the glob matching
                    // to ignore filtering by siblings because the user seems to know what she
                    // is searching for and we want to include the result in that case anyway
                    if (excludePattern.test(relativePath, basename, function () { return filePattern !== basename ? entries.map(function (entry) { return entry.basename; }) : []; })) {
                        return "continue";
                    }
                    var sub = pathToEntries[relativePath];
                    if (sub) {
                        matchDirectory(sub);
                    }
                    else {
                        self.filesWalked++;
                        if (relativePath === filePattern) {
                            return "continue";
                        }
                        self.matchFile(onResult, entry);
                    }
                };
                for (var i = 0, n = entries.length; i < n; i++) {
                    _loop_1(i, n);
                }
                ;
            }
            matchDirectory(rootEntries);
        };
        FileWalker.prototype.nodeJSTraversal = function (folderQuery, onResult, done) {
            var _this = this;
            this.directoriesWalked++;
            extfs.readdir(folderQuery.folder, function (error, files) {
                if (error || _this.isCanceled || _this.isLimitHit) {
                    return done();
                }
                // Support relative paths to files from a root resource (ignores excludes)
                return _this.checkFilePatternRelativeMatch(folderQuery.folder, function (match, size) {
                    if (_this.isCanceled || _this.isLimitHit) {
                        return done();
                    }
                    // Report result from file pattern if matching
                    if (match) {
                        _this.resultCount++;
                        onResult({
                            base: folderQuery.folder,
                            relativePath: _this.filePattern,
                            basename: path.basename(_this.filePattern),
                            size: size
                        });
                    }
                    return _this.doWalk(folderQuery, '', files, onResult, done);
                });
            });
        };
        FileWalker.prototype.getStats = function () {
            return {
                fromCache: false,
                traversal: Traversal[this.traversal],
                errors: this.errors,
                fileWalkStartTime: this.fileWalkStartTime,
                fileWalkResultTime: Date.now(),
                directoriesWalked: this.directoriesWalked,
                filesWalked: this.filesWalked,
                resultCount: this.resultCount,
                cmdForkStartTime: this.cmdForkStartTime,
                cmdForkResultTime: this.cmdForkResultTime,
                cmdResultCount: this.cmdResultCount
            };
        };
        FileWalker.prototype.checkFilePatternAbsoluteMatch = function (clb) {
            if (!this.filePattern || !path.isAbsolute(this.filePattern)) {
                return clb(false);
            }
            return fs.stat(this.filePattern, function (error, stat) {
                return clb(!error && !stat.isDirectory(), stat && stat.size); // only existing files
            });
        };
        FileWalker.prototype.checkFilePatternRelativeMatch = function (basePath, clb) {
            if (!this.filePattern || path.isAbsolute(this.filePattern)) {
                return clb(null);
            }
            var absolutePath = path.join(basePath, this.filePattern);
            return fs.stat(absolutePath, function (error, stat) {
                return clb(!error && !stat.isDirectory() ? absolutePath : null, stat && stat.size); // only existing files
            });
        };
        FileWalker.prototype.doWalk = function (folderQuery, relativeParentPath, files, onResult, done) {
            var _this = this;
            var rootFolder = folderQuery.folder;
            // Execute tasks on each file in parallel to optimize throughput
            flow.parallel(files, function (file, clb) {
                // Check canceled
                if (_this.isCanceled || _this.isLimitHit) {
                    return clb(null, undefined);
                }
                // If the user searches for the exact file name, we adjust the glob matching
                // to ignore filtering by siblings because the user seems to know what she
                // is searching for and we want to include the result in that case anyway
                var siblings = files;
                if (_this.config.filePattern === file) {
                    siblings = [];
                }
                // Check exclude pattern
                var currentRelativePath = relativeParentPath ? [relativeParentPath, file].join(path.sep) : file;
                if (_this.folderExcludePatterns.get(folderQuery.folder).test(currentRelativePath, file, function () { return siblings; })) {
                    return clb(null, undefined);
                }
                // Use lstat to detect links
                var currentAbsolutePath = [rootFolder, currentRelativePath].join(path.sep);
                fs.lstat(currentAbsolutePath, function (error, lstat) {
                    if (error || _this.isCanceled || _this.isLimitHit) {
                        return clb(null, undefined);
                    }
                    // If the path is a link, we must instead use fs.stat() to find out if the
                    // link is a directory or not because lstat will always return the stat of
                    // the link which is always a file.
                    _this.statLinkIfNeeded(currentAbsolutePath, lstat, function (error, stat) {
                        if (error || _this.isCanceled || _this.isLimitHit) {
                            return clb(null, undefined);
                        }
                        // Directory: Follow directories
                        if (stat.isDirectory()) {
                            _this.directoriesWalked++;
                            // to really prevent loops with links we need to resolve the real path of them
                            return _this.realPathIfNeeded(currentAbsolutePath, lstat, function (error, realpath) {
                                if (error || _this.isCanceled || _this.isLimitHit) {
                                    return clb(null, undefined);
                                }
                                if (_this.walkedPaths[realpath]) {
                                    return clb(null, undefined); // escape when there are cycles (can happen with symlinks)
                                }
                                _this.walkedPaths[realpath] = true; // remember as walked
                                // Continue walking
                                return extfs.readdir(currentAbsolutePath, function (error, children) {
                                    if (error || _this.isCanceled || _this.isLimitHit) {
                                        return clb(null, undefined);
                                    }
                                    _this.doWalk(folderQuery, currentRelativePath, children, onResult, function (err) { return clb(err, undefined); });
                                });
                            });
                        }
                        else {
                            _this.filesWalked++;
                            if (currentRelativePath === _this.filePattern) {
                                return clb(null, undefined); // ignore file if its path matches with the file pattern because checkFilePatternRelativeMatch() takes care of those
                            }
                            if (_this.maxFilesize && types.isNumber(stat.size) && stat.size > _this.maxFilesize) {
                                return clb(null, undefined); // ignore file if max file size is hit
                            }
                            _this.matchFile(onResult, { base: rootFolder, relativePath: currentRelativePath, basename: file, size: stat.size });
                        }
                        // Unwind
                        return clb(null, undefined);
                    });
                });
            }, function (error) {
                if (error) {
                    error = arrays.coalesce(error); // find any error by removing null values first
                }
                return done(error && error.length > 0 ? error[0] : null);
            });
        };
        FileWalker.prototype.matchFile = function (onResult, candidate) {
            if (this.isFilePatternMatch(candidate.relativePath) && (!this.includePattern || this.includePattern(candidate.relativePath, candidate.basename))) {
                this.resultCount++;
                if (this.maxResults && this.resultCount > this.maxResults) {
                    this.isLimitHit = true;
                }
                if (!this.isLimitHit) {
                    onResult(candidate);
                }
            }
        };
        FileWalker.prototype.isFilePatternMatch = function (path) {
            // Check for search pattern
            if (this.filePattern) {
                if (this.filePattern === '*') {
                    return true; // support the all-matching wildcard
                }
                return scorer.matches(path, this.normalizedFilePatternLowercase);
            }
            // No patterns means we match all
            return true;
        };
        FileWalker.prototype.statLinkIfNeeded = function (path, lstat, clb) {
            if (lstat.isSymbolicLink()) {
                return fs.stat(path, clb); // stat the target the link points to
            }
            return clb(null, lstat); // not a link, so the stat is already ok for us
        };
        FileWalker.prototype.realPathIfNeeded = function (path, lstat, clb) {
            if (lstat.isSymbolicLink()) {
                return fs.realpath(path, function (error, realpath) {
                    if (error) {
                        return clb(error);
                    }
                    return clb(null, realpath);
                });
            }
            return clb(null, path);
        };
        return FileWalker;
    }());
    exports.FileWalker = FileWalker;
    var Engine = (function () {
        function Engine(config) {
            this.folderQueries = config.folderQueries;
            this.extraFiles = config.extraFiles;
            this.walker = new FileWalker(config);
        }
        Engine.prototype.search = function (onResult, onProgress, done) {
            var _this = this;
            this.walker.walk(this.folderQueries, this.extraFiles, onResult, function (err, isLimitHit) {
                done(err, {
                    limitHit: isLimitHit,
                    stats: _this.walker.getStats()
                });
            });
        };
        Engine.prototype.cancel = function () {
            this.walker.cancel();
        };
        return Engine;
    }());
    exports.Engine = Engine;
    /**
     * This class exists to provide one interface on top of two ParsedExpressions, one for absolute expressions and one for relative expressions.
     * The absolute and relative expressions don't "have" to be kept separate, but this keeps us from having to path.join every single
     * file searched, it's only used for a text search with a searchPath
     */
    var AbsoluteAndRelativeParsedExpression = (function () {
        function AbsoluteAndRelativeParsedExpression(expr, root) {
            this.root = root;
            this.init(expr);
        }
        /**
         * Split the IExpression into its absolute and relative components, and glob.parse them separately.
         */
        AbsoluteAndRelativeParsedExpression.prototype.init = function (expr) {
            var absoluteGlobExpr;
            var relativeGlobExpr;
            Object.keys(expr)
                .filter(function (key) { return expr[key]; })
                .forEach(function (key) {
                if (path.isAbsolute(key)) {
                    absoluteGlobExpr = absoluteGlobExpr || glob.getEmptyExpression();
                    absoluteGlobExpr[key] = expr[key];
                }
                else {
                    relativeGlobExpr = relativeGlobExpr || glob.getEmptyExpression();
                    relativeGlobExpr[key] = expr[key];
                }
            });
            this.absoluteParsedExpr = absoluteGlobExpr && glob.parse(absoluteGlobExpr, { trimForExclusions: true });
            this.relativeParsedExpr = relativeGlobExpr && glob.parse(relativeGlobExpr, { trimForExclusions: true });
        };
        AbsoluteAndRelativeParsedExpression.prototype.test = function (_path, basename, siblingsFn) {
            return (this.relativeParsedExpr && this.relativeParsedExpr(_path, basename, siblingsFn)) ||
                (this.absoluteParsedExpr && this.absoluteParsedExpr(path.join(this.root, _path), basename, siblingsFn));
        };
        AbsoluteAndRelativeParsedExpression.prototype.getBasenameTerms = function () {
            var basenameTerms = [];
            if (this.absoluteParsedExpr) {
                basenameTerms.push.apply(basenameTerms, glob.getBasenameTerms(this.absoluteParsedExpr));
            }
            if (this.relativeParsedExpr) {
                basenameTerms.push.apply(basenameTerms, glob.getBasenameTerms(this.relativeParsedExpr));
            }
            return basenameTerms;
        };
        AbsoluteAndRelativeParsedExpression.prototype.getPathTerms = function () {
            var pathTerms = [];
            if (this.absoluteParsedExpr) {
                pathTerms.push.apply(pathTerms, glob.getPathTerms(this.absoluteParsedExpr));
            }
            if (this.relativeParsedExpr) {
                pathTerms.push.apply(pathTerms, glob.getPathTerms(this.relativeParsedExpr));
            }
            return pathTerms;
        };
        return AbsoluteAndRelativeParsedExpression;
    }());
});
//# sourceMappingURL=fileSearch.js.map