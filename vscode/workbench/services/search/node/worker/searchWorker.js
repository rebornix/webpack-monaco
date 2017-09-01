/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "fs", "graceful-fs", "vs/base/common/errors", "vs/base/common/strings", "vs/base/common/winjs.base", "vs/base/common/mime", "vs/base/node/encoding", "vs/base/node/mime"], function (require, exports, fs, gracefulFs, errors_1, strings, winjs_base_1, baseMime, encoding_1, mime_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    gracefulFs.gracefulify(fs);
    var MAX_FILE_ERRORS = 5; // Don't report more than this number of errors, 1 per file, to avoid flooding the log when there's a general issue
    var numErrorsLogged = 0;
    function onError(error) {
        if (numErrorsLogged++ < MAX_FILE_ERRORS) {
            errors_1.onUnexpectedError(error);
        }
    }
    var SearchWorker = (function () {
        function SearchWorker() {
        }
        SearchWorker.prototype.initialize = function () {
            this.currentSearchEngine = new SearchWorkerEngine();
            return winjs_base_1.TPromise.wrap(undefined);
        };
        SearchWorker.prototype.cancel = function () {
            // Cancel the current search. It will stop searching and close its open files.
            if (this.currentSearchEngine) {
                this.currentSearchEngine.cancel();
            }
            return winjs_base_1.TPromise.wrap(null);
        };
        SearchWorker.prototype.search = function (args) {
            if (!this.currentSearchEngine) {
                // Worker timed out during search
                this.initialize();
            }
            return this.currentSearchEngine.searchBatch(args);
        };
        return SearchWorker;
    }());
    exports.SearchWorker = SearchWorker;
    var LF = 0x0a;
    var CR = 0x0d;
    var SearchWorkerEngine = (function () {
        function SearchWorkerEngine() {
            this.nextSearch = winjs_base_1.TPromise.wrap(null);
            this.isCanceled = false;
        }
        /**
         * Searches some number of the given paths concurrently, and starts searches in other paths when those complete.
         */
        SearchWorkerEngine.prototype.searchBatch = function (args) {
            var _this = this;
            var contentPattern = strings.createRegExp(args.pattern.pattern, args.pattern.isRegExp, { matchCase: args.pattern.isCaseSensitive, wholeWord: args.pattern.isWordMatch, multiline: false, global: true });
            var fileEncoding = encoding_1.encodingExists(args.fileEncoding) ? args.fileEncoding : encoding_1.UTF8;
            return this.nextSearch =
                this.nextSearch.then(function () { return _this._searchBatch(args, contentPattern, fileEncoding); });
        };
        SearchWorkerEngine.prototype._searchBatch = function (args, contentPattern, fileEncoding) {
            var _this = this;
            if (this.isCanceled) {
                return winjs_base_1.TPromise.wrap(null);
            }
            return new winjs_base_1.TPromise(function (batchDone) {
                var result = {
                    matches: [],
                    numMatches: 0,
                    limitReached: false
                };
                // Search in the given path, and when it's finished, search in the next path in absolutePaths
                var startSearchInFile = function (absolutePath) {
                    return _this.searchInFile(absolutePath, contentPattern, fileEncoding, args.maxResults && (args.maxResults - result.numMatches)).then(function (fileResult) {
                        // Finish early if search is canceled
                        if (_this.isCanceled) {
                            return;
                        }
                        if (fileResult) {
                            result.numMatches += fileResult.numMatches;
                            result.matches.push(fileResult.match.serialize());
                            if (fileResult.limitReached) {
                                // If the limit was reached, terminate early with the results so far and cancel in-progress searches.
                                _this.cancel();
                                result.limitReached = true;
                                return batchDone(result);
                            }
                        }
                    }, onError);
                };
                winjs_base_1.TPromise.join(args.absolutePaths.map(startSearchInFile)).then(function () {
                    batchDone(result);
                });
            });
        };
        SearchWorkerEngine.prototype.cancel = function () {
            this.isCanceled = true;
        };
        SearchWorkerEngine.prototype.searchInFile = function (absolutePath, contentPattern, fileEncoding, maxResults) {
            var _this = this;
            var fileMatch = null;
            var limitReached = false;
            var numMatches = 0;
            var perLineCallback = function (line, lineNumber) {
                var lineMatch = null;
                var match = contentPattern.exec(line);
                // Record all matches into file result
                while (match !== null && match[0].length > 0 && !_this.isCanceled && !limitReached) {
                    if (fileMatch === null) {
                        fileMatch = new FileMatch(absolutePath);
                    }
                    if (lineMatch === null) {
                        lineMatch = new LineMatch(line, lineNumber);
                        fileMatch.addMatch(lineMatch);
                    }
                    lineMatch.addMatch(match.index, match[0].length);
                    numMatches++;
                    if (maxResults && numMatches >= maxResults) {
                        limitReached = true;
                    }
                    match = contentPattern.exec(line);
                }
            };
            // Read lines buffered to support large files
            return this.readlinesAsync(absolutePath, perLineCallback, { bufferLength: 8096, encoding: fileEncoding }).then(function () { return fileMatch ? { match: fileMatch, limitReached: limitReached, numMatches: numMatches } : null; });
        };
        SearchWorkerEngine.prototype.readlinesAsync = function (filename, perLineCallback, options) {
            var _this = this;
            return new winjs_base_1.TPromise(function (resolve, reject) {
                fs.open(filename, 'r', null, function (error, fd) {
                    if (error) {
                        return resolve(null);
                    }
                    var buffer = new Buffer(options.bufferLength);
                    var line = '';
                    var lineNumber = 0;
                    var lastBufferHadTrailingCR = false;
                    var readFile = function (isFirstRead, clb) {
                        if (_this.isCanceled) {
                            return clb(null); // return early if canceled or limit reached
                        }
                        fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                            var decodeBuffer = function (buffer, start, end) {
                                if (options.encoding === encoding_1.UTF8 || options.encoding === encoding_1.UTF8_with_bom) {
                                    return buffer.toString(undefined, start, end); // much faster to use built in toString() when encoding is default
                                }
                                return encoding_1.decode(buffer.slice(start, end), options.encoding);
                            };
                            var lineFinished = function (offset) {
                                line += decodeBuffer(buffer, pos, i + offset);
                                perLineCallback(line, lineNumber);
                                line = '';
                                lineNumber++;
                                pos = i + offset;
                            };
                            if (error || bytesRead === 0 || _this.isCanceled) {
                                return clb(error); // return early if canceled or limit reached or no more bytes to read
                            }
                            var crlfCharSize = 1;
                            var crBytes = [CR];
                            var lfBytes = [LF];
                            var pos = 0;
                            var i = 0;
                            // Detect encoding and mime when this is the beginning of the file
                            if (isFirstRead) {
                                var mimeAndEncoding = mime_1.detectMimeAndEncodingFromBuffer({ buffer: buffer, bytesRead: bytesRead }, false);
                                if (mimeAndEncoding.mimes[mimeAndEncoding.mimes.length - 1] !== baseMime.MIME_TEXT) {
                                    return clb(null); // skip files that seem binary
                                }
                                // Check for BOM offset
                                switch (mimeAndEncoding.encoding) {
                                    case encoding_1.UTF8:
                                        pos = i = encoding_1.bomLength(encoding_1.UTF8);
                                        options.encoding = encoding_1.UTF8;
                                        break;
                                    case encoding_1.UTF16be:
                                        pos = i = encoding_1.bomLength(encoding_1.UTF16be);
                                        options.encoding = encoding_1.UTF16be;
                                        break;
                                    case encoding_1.UTF16le:
                                        pos = i = encoding_1.bomLength(encoding_1.UTF16le);
                                        options.encoding = encoding_1.UTF16le;
                                        break;
                                }
                                // when we are running with UTF16le/be, LF and CR are encoded as
                                // two bytes, like 0A 00 (LF) / 0D 00 (CR) for LE or flipped around
                                // for BE. We need to account for this when splitting the buffer into
                                // newlines, and when detecting a CRLF combo.
                                if (options.encoding === encoding_1.UTF16le) {
                                    crlfCharSize = 2;
                                    crBytes = [CR, 0x00];
                                    lfBytes = [LF, 0x00];
                                }
                                else if (options.encoding === encoding_1.UTF16be) {
                                    crlfCharSize = 2;
                                    crBytes = [0x00, CR];
                                    lfBytes = [0x00, LF];
                                }
                            }
                            if (lastBufferHadTrailingCR) {
                                if (buffer[i] === lfBytes[0] && (lfBytes.length === 1 || buffer[i + 1] === lfBytes[1])) {
                                    lineFinished(1 * crlfCharSize);
                                    i++;
                                }
                                else {
                                    lineFinished(0);
                                }
                                lastBufferHadTrailingCR = false;
                            }
                            /**
                             * This loop executes for every byte of every file in the workspace - it is highly performance-sensitive!
                             * Hence the duplication in reading the buffer to avoid a function call. Previously a function call was not
                             * being inlined by V8.
                             */
                            for (; i < bytesRead; ++i) {
                                if (buffer[i] === lfBytes[0] && (lfBytes.length === 1 || buffer[i + 1] === lfBytes[1])) {
                                    lineFinished(1 * crlfCharSize);
                                }
                                else if (buffer[i] === crBytes[0] && (crBytes.length === 1 || buffer[i + 1] === crBytes[1])) {
                                    if (i + crlfCharSize === bytesRead) {
                                        lastBufferHadTrailingCR = true;
                                    }
                                    else if (buffer[i + crlfCharSize] === lfBytes[0] && (lfBytes.length === 1 || buffer[i + crlfCharSize + 1] === lfBytes[1])) {
                                        lineFinished(2 * crlfCharSize);
                                        i += 2 * crlfCharSize - 1;
                                    }
                                    else {
                                        lineFinished(1 * crlfCharSize);
                                    }
                                }
                            }
                            line += decodeBuffer(buffer, pos, bytesRead);
                            readFile(/*isFirstRead=*/ false, clb); // Continue reading
                        });
                    };
                    readFile(/*isFirstRead=*/ true, function (error) {
                        if (error) {
                            return resolve(null);
                        }
                        if (line.length) {
                            perLineCallback(line, lineNumber); // handle last line
                        }
                        fs.close(fd, function (error) {
                            resolve(null);
                        });
                    });
                });
            });
        };
        return SearchWorkerEngine;
    }());
    exports.SearchWorkerEngine = SearchWorkerEngine;
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
});
//# sourceMappingURL=searchWorker.js.map