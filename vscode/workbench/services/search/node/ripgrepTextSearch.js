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
define(["require", "exports", "events", "path", "string_decoder", "child_process", "vscode-ripgrep", "vs/base/common/objects", "vs/base/common/platform", "vs/base/common/strings", "vs/base/common/paths", "vs/base/node/extfs", "vs/base/node/encoding", "vs/base/common/glob", "vs/base/common/winjs.base"], function (require, exports, events_1, path, string_decoder_1, cp, vscode_ripgrep_1, objects, platform, strings, paths, extfs, encoding, glob, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RipgrepEngine = (function () {
        function RipgrepEngine(config) {
            this.config = config;
            this.isDone = false;
            this.resultsHandledP = winjs_base_1.TPromise.wrap(null);
        }
        RipgrepEngine.prototype.cancel = function () {
            this.isDone = true;
            this.ripgrepParser.cancel();
            this.rgProc.kill();
        };
        // TODO@Rob - make promise-based once the old search is gone, and I don't need them to have matching interfaces anymore
        RipgrepEngine.prototype.search = function (onResult, onMessage, done) {
            var _this = this;
            if (!this.config.folderQueries.length && !this.config.extraFiles.length) {
                done(null, {
                    limitHit: false,
                    stats: null
                });
                return;
            }
            var rgArgs = getRgArgs(this.config);
            if (rgArgs.siblingClauses) {
                this.postProcessExclusions = glob.parseToAsync(rgArgs.siblingClauses, { trimForExclusions: true });
            }
            var cwd = platform.isWindows ? 'c:/' : '/';
            process.nextTick(function () {
                var escapedArgs = rgArgs.globArgs
                    .map(function (arg) { return arg.match(/^-/) ? arg : "'" + arg + "'"; })
                    .join(' ');
                var rgCmd = "rg " + escapedArgs + "\n - cwd: " + cwd + "\n";
                onMessage({ message: rgCmd });
                if (rgArgs.siblingClauses) {
                    onMessage({ message: " - Sibling clauses: " + JSON.stringify(rgArgs.siblingClauses) + "\n" });
                }
            });
            this.rgProc = cp.spawn(vscode_ripgrep_1.rgPath, rgArgs.globArgs, { cwd: cwd });
            this.ripgrepParser = new RipgrepParser(this.config.maxResults, cwd);
            this.ripgrepParser.on('result', function (match) {
                if (_this.postProcessExclusions) {
                    var handleResultP = _this.postProcessExclusions(match.path, undefined, function () { return getSiblings(match.path); })
                        .then(function (globMatch) {
                        if (!globMatch) {
                            onResult(match);
                        }
                    });
                    _this.resultsHandledP = winjs_base_1.TPromise.join([_this.resultsHandledP, handleResultP]);
                }
                else {
                    onResult(match);
                }
            });
            this.ripgrepParser.on('hitLimit', function () {
                _this.cancel();
                done(null, {
                    limitHit: true,
                    stats: null
                });
            });
            this.rgProc.stdout.on('data', function (data) {
                _this.ripgrepParser.handleData(data);
            });
            var gotData = false;
            this.rgProc.stdout.once('data', function () { return gotData = true; });
            var stderr = '';
            this.rgProc.stderr.on('data', function (data) {
                var message = data.toString();
                onMessage({ message: message });
                stderr += message;
            });
            this.rgProc.on('close', function (code) {
                // Trigger last result, then wait on async result handling
                _this.ripgrepParser.flush();
                _this.resultsHandledP.then(function () {
                    _this.rgProc = null;
                    if (!_this.isDone) {
                        _this.isDone = true;
                        var displayMsg = void 0;
                        if (stderr && !gotData && (displayMsg = _this.rgErrorMsgForDisplay(stderr))) {
                            done(new Error(displayMsg), {
                                limitHit: false,
                                stats: null
                            });
                        }
                        else {
                            done(null, {
                                limitHit: false,
                                stats: null
                            });
                        }
                    }
                });
            });
        };
        /**
         * Read the first line of stderr and return an error for display or undefined, based on a whitelist.
         * Ripgrep produces stderr output which is not from a fatal error, and we only want the search to be
         * "failed" when a fatal error was produced.
         */
        RipgrepEngine.prototype.rgErrorMsgForDisplay = function (msg) {
            var firstLine = msg.split('\n')[0];
            if (strings.startsWith(firstLine, 'Error parsing regex')) {
                return firstLine;
            }
            if (strings.startsWith(firstLine, 'error parsing glob')) {
                return firstLine;
            }
            return undefined;
        };
        return RipgrepEngine;
    }());
    exports.RipgrepEngine = RipgrepEngine;
    var RipgrepParser = (function (_super) {
        __extends(RipgrepParser, _super);
        function RipgrepParser(maxResults, rootFolder) {
            var _this = _super.call(this) || this;
            _this.maxResults = maxResults;
            _this.rootFolder = rootFolder;
            _this.numResults = 0;
            _this.stringDecoder = new string_decoder_1.StringDecoder();
            return _this;
        }
        RipgrepParser.prototype.cancel = function () {
            this.isDone = true;
        };
        RipgrepParser.prototype.flush = function () {
            this.handleDecodedData(this.stringDecoder.end());
            if (this.fileMatch) {
                this.onResult();
            }
        };
        RipgrepParser.prototype.handleData = function (data) {
            var dataStr = typeof data === 'string' ? data : this.stringDecoder.write(data);
            this.handleDecodedData(dataStr);
        };
        RipgrepParser.prototype.handleDecodedData = function (decodedData) {
            // If the previous data chunk didn't end in a newline, prepend it to this chunk
            var dataStr = this.remainder ?
                this.remainder + decodedData :
                decodedData;
            var dataLines = dataStr.split(/\r\n|\n/);
            this.remainder = dataLines[dataLines.length - 1] ? dataLines.pop() : null;
            for (var l = 0; l < dataLines.length; l++) {
                var outputLine = dataLines[l].trim();
                if (this.isDone) {
                    break;
                }
                var r = void 0;
                if (r = outputLine.match(RipgrepParser.RESULT_REGEX)) {
                    var lineNum = parseInt(r[1]) - 1;
                    var matchText = r[2];
                    // workaround https://github.com/BurntSushi/ripgrep/issues/416
                    // If the match line ended with \r, append a match end marker so the match isn't lost
                    if (r[3]) {
                        matchText += RipgrepParser.MATCH_END_MARKER;
                    }
                    // Line is a result - add to collected results for the current file path
                    this.handleMatchLine(outputLine, lineNum, matchText);
                }
                else if (r = outputLine.match(RipgrepParser.FILE_REGEX)) {
                    // Line is a file path - send all collected results for the previous file path
                    if (this.fileMatch) {
                        this.onResult();
                    }
                    this.fileMatch = new FileMatch(path.isAbsolute(r[1]) ? r[1] : path.join(this.rootFolder, r[1]));
                }
                else {
                    // Line is empty (or malformed)
                }
            }
        };
        RipgrepParser.prototype.handleMatchLine = function (outputLine, lineNum, text) {
            var lineMatch = new LineMatch(text, lineNum);
            this.fileMatch.addMatch(lineMatch);
            var lastMatchEndPos = 0;
            var matchTextStartPos = -1;
            // Track positions with color codes subtracted - offsets in the final text preview result
            var matchTextStartRealIdx = -1;
            var textRealIdx = 0;
            var hitLimit = false;
            var realTextParts = [];
            for (var i = 0; i < text.length - (RipgrepParser.MATCH_END_MARKER.length - 1);) {
                if (text.substr(i, RipgrepParser.MATCH_START_MARKER.length) === RipgrepParser.MATCH_START_MARKER) {
                    // Match start
                    var chunk_1 = text.slice(lastMatchEndPos, i);
                    realTextParts.push(chunk_1);
                    i += RipgrepParser.MATCH_START_MARKER.length;
                    matchTextStartPos = i;
                    matchTextStartRealIdx = textRealIdx;
                }
                else if (text.substr(i, RipgrepParser.MATCH_END_MARKER.length) === RipgrepParser.MATCH_END_MARKER) {
                    // Match end
                    var chunk_2 = text.slice(matchTextStartPos, i);
                    realTextParts.push(chunk_2);
                    if (!hitLimit) {
                        lineMatch.addMatch(matchTextStartRealIdx, textRealIdx - matchTextStartRealIdx);
                    }
                    matchTextStartPos = -1;
                    matchTextStartRealIdx = -1;
                    i += RipgrepParser.MATCH_END_MARKER.length;
                    lastMatchEndPos = i;
                    this.numResults++;
                    // Check hit maxResults limit
                    if (this.numResults >= this.maxResults) {
                        // Finish the line, then report the result below
                        hitLimit = true;
                    }
                }
                else {
                    i++;
                    textRealIdx++;
                }
            }
            var chunk = text.slice(lastMatchEndPos);
            realTextParts.push(chunk);
            // Replace preview with version without color codes
            var preview = realTextParts.join('');
            lineMatch.preview = preview;
            if (hitLimit) {
                this.cancel();
                this.onResult();
                this.emit('hitLimit');
            }
        };
        RipgrepParser.prototype.onResult = function () {
            this.emit('result', this.fileMatch.serialize());
            this.fileMatch = null;
        };
        RipgrepParser.RESULT_REGEX = /^\u001b\[m(\d+)\u001b\[m:(.*)(\r?)/;
        RipgrepParser.FILE_REGEX = /^\u001b\[m(.+)\u001b\[m$/;
        RipgrepParser.MATCH_START_MARKER = '\u001b[m\u001b[31m';
        RipgrepParser.MATCH_END_MARKER = '\u001b[m';
        return RipgrepParser;
    }(events_1.EventEmitter));
    exports.RipgrepParser = RipgrepParser;
    var FileMatch = (function () {
        function FileMatch(path) {
            this.path = path;
            this.lineMatches = [];
        }
        FileMatch.prototype.addMatch = function (lineMatch) {
            this.lineMatches.push(lineMatch);
        };
        FileMatch.prototype.isEmpty = function () {
            return this.lineMatches.length === 0;
        };
        FileMatch.prototype.serialize = function () {
            var lineMatches = [];
            var numMatches = 0;
            for (var i = 0; i < this.lineMatches.length; i++) {
                numMatches += this.lineMatches[i].offsetAndLengths.length;
                lineMatches.push(this.lineMatches[i].serialize());
            }
            return {
                path: this.path,
                lineMatches: lineMatches,
                numMatches: numMatches
            };
        };
        return FileMatch;
    }());
    exports.FileMatch = FileMatch;
    var LineMatch = (function () {
        function LineMatch(preview, lineNumber) {
            this.preview = preview.replace(/(\r|\n)*$/, '');
            this.lineNumber = lineNumber;
            this.offsetAndLengths = [];
        }
        LineMatch.prototype.getText = function () {
            return this.preview;
        };
        LineMatch.prototype.getLineNumber = function () {
            return this.lineNumber;
        };
        LineMatch.prototype.addMatch = function (offset, length) {
            this.offsetAndLengths.push([offset, length]);
        };
        LineMatch.prototype.serialize = function () {
            var result = {
                preview: this.preview,
                lineNumber: this.lineNumber,
                offsetAndLengths: this.offsetAndLengths
            };
            return result;
        };
        return LineMatch;
    }());
    exports.LineMatch = LineMatch;
    function foldersToRgExcludeGlobs(folderQueries, globalExclude, excludesToSkip) {
        var globArgs = [];
        var siblingClauses = {};
        folderQueries.forEach(function (folderQuery) {
            var totalExcludePattern = objects.assign({}, folderQuery.excludePattern || {}, globalExclude || {});
            var result = globExprsToRgGlobs(totalExcludePattern, folderQuery.folder, excludesToSkip);
            globArgs.push.apply(globArgs, result.globArgs);
            if (result.siblingClauses) {
                siblingClauses = objects.assign(siblingClauses, result.siblingClauses);
            }
        });
        return { globArgs: globArgs, siblingClauses: siblingClauses };
    }
    function foldersToIncludeGlobs(folderQueries, globalInclude) {
        var globArgs = [];
        folderQueries.forEach(function (folderQuery) {
            var totalIncludePattern = objects.assign({}, globalInclude || {}, folderQuery.includePattern || {});
            var result = globExprsToRgGlobs(totalIncludePattern, folderQuery.folder);
            globArgs.push.apply(globArgs, result.globArgs);
        });
        return globArgs;
    }
    function globExprsToRgGlobs(patterns, folder, excludesToSkip) {
        var globArgs = [];
        var siblingClauses = null;
        Object.keys(patterns)
            .forEach(function (key) {
            if (excludesToSkip && excludesToSkip.has(key)) {
                return;
            }
            var value = patterns[key];
            key = getAbsoluteGlob(folder, key);
            if (typeof value === 'boolean' && value) {
                globArgs.push(fixDriveC(key));
            }
            else if (value && value.when) {
                if (!siblingClauses) {
                    siblingClauses = {};
                }
                siblingClauses[key] = value;
            }
        });
        return { globArgs: globArgs, siblingClauses: siblingClauses };
    }
    /**
     * Resolves a glob like "node_modules/**" in "/foo/bar" to "/foo/bar/node_modules/**".
     * Special cases C:/foo paths to write the glob like /foo instead - see https://github.com/BurntSushi/ripgrep/issues/530.
     *
     * Exported for testing
     */
    function getAbsoluteGlob(folder, key) {
        var absolute = paths.isAbsolute(key) ?
            key :
            path.join(folder, key);
        return trimTrailingSlash(absolute);
    }
    exports.getAbsoluteGlob = getAbsoluteGlob;
    function trimTrailingSlash(str) {
        str = strings.rtrim(str, '\\');
        return strings.rtrim(str, '/');
    }
    function fixDriveC(path) {
        var root = paths.getRoot(path);
        return root.toLowerCase() === 'c:/' ?
            path.replace(/^c:[/\\]/i, '/') :
            path;
    }
    exports.fixDriveC = fixDriveC;
    function getRgArgs(config) {
        var args = ['--hidden', '--heading', '--line-number', '--color', 'ansi', '--colors', 'path:none', '--colors', 'line:none', '--colors', 'match:fg:red', '--colors', 'match:style:nobold'];
        args.push(config.contentPattern.isCaseSensitive ? '--case-sensitive' : '--ignore-case');
        // includePattern can't have siblingClauses
        foldersToIncludeGlobs(config.folderQueries, config.includePattern).forEach(function (globArg) {
            args.push('-g', globArg);
        });
        var siblingClauses;
        // Find excludes that are exactly the same in all folderQueries - e.g. from user settings, and that start with `**`.
        // To make the command shorter, don't resolve these against every folderQuery path - see #33189.
        var universalExcludes = findUniversalExcludes(config.folderQueries);
        var rgGlobs = foldersToRgExcludeGlobs(config.folderQueries, config.excludePattern, universalExcludes);
        rgGlobs.globArgs
            .forEach(function (rgGlob) { return args.push('-g', "!" + rgGlob); });
        if (universalExcludes) {
            universalExcludes
                .forEach(function (exclude) { return args.push('-g', "!" + trimTrailingSlash(exclude)); });
        }
        siblingClauses = rgGlobs.siblingClauses;
        if (config.maxFilesize) {
            args.push('--max-filesize', config.maxFilesize + '');
        }
        if (config.disregardIgnoreFiles) {
            // Don't use .gitignore or .ignore
            args.push('--no-ignore');
        }
        // Follow symlinks
        args.push('--follow');
        // Set default encoding if only one folder is opened
        if (config.folderQueries.length === 1 && config.folderQueries[0].fileEncoding && config.folderQueries[0].fileEncoding !== 'utf8') {
            args.push('--encoding', encoding.toCanonicalName(config.folderQueries[0].fileEncoding));
        }
        // Ripgrep handles -- as a -- arg separator. Only --.
        // - is ok, --- is ok, --some-flag is handled as query text. Need to special case.
        if (config.contentPattern.pattern === '--') {
            config.contentPattern.isRegExp = true;
            config.contentPattern.pattern = '\\-\\-';
        }
        var searchPatternAfterDoubleDashes;
        if (config.contentPattern.isWordMatch) {
            var regexp = strings.createRegExp(config.contentPattern.pattern, config.contentPattern.isRegExp, { wholeWord: config.contentPattern.isWordMatch });
            var regexpStr = regexp.source.replace(/\\\//g, '/'); // RegExp.source arbitrarily returns escaped slashes. Search and destroy.
            args.push('--regexp', regexpStr);
        }
        else if (config.contentPattern.isRegExp) {
            args.push('--regexp', config.contentPattern.pattern);
        }
        else {
            searchPatternAfterDoubleDashes = config.contentPattern.pattern;
            args.push('--fixed-strings');
        }
        // Folder to search
        args.push('--');
        if (searchPatternAfterDoubleDashes) {
            // Put the query after --, in case the query starts with a dash
            args.push(searchPatternAfterDoubleDashes);
        }
        args.push.apply(args, config.folderQueries.map(function (q) { return q.folder; }));
        args.push.apply(args, config.extraFiles);
        return { globArgs: args, siblingClauses: siblingClauses };
    }
    function getSiblings(file) {
        return new winjs_base_1.TPromise(function (resolve, reject) {
            extfs.readdir(path.dirname(file), function (error, files) {
                if (error) {
                    reject(error);
                }
                resolve(files);
            });
        });
    }
    function findUniversalExcludes(folderQueries) {
        if (folderQueries.length < 2) {
            // Nothing to simplify
            return null;
        }
        var firstFolder = folderQueries[0];
        if (!firstFolder.excludePattern) {
            return null;
        }
        var universalExcludes = new Set();
        Object.keys(firstFolder.excludePattern).forEach(function (key) {
            if (strings.startsWith(key, '**') && folderQueries.every(function (q) { return q.excludePattern && q.excludePattern[key] === true; })) {
                universalExcludes.add(key);
            }
        });
        return universalExcludes;
    }
});
//# sourceMappingURL=ripgrepTextSearch.js.map