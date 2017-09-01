/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "fs", "vs/base/common/winjs.base"], function (require, exports, fs, winjs_base_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Reads up to total bytes from the provided stream.
     */
    function readExactlyByStream(stream, totalBytes) {
        return new winjs_base_1.TPromise(function (complete, error) {
            var done = false;
            var buffer = new Buffer(totalBytes);
            var bytesRead = 0;
            stream.on('data', function (data) {
                var bytesToRead = Math.min(totalBytes - bytesRead, data.length);
                data.copy(buffer, bytesRead, 0, bytesToRead);
                bytesRead += bytesToRead;
                if (bytesRead === totalBytes) {
                    stream.destroy(); // Will trigger the close event eventually
                }
            });
            stream.on('error', function (e) {
                if (!done) {
                    done = true;
                    error(e);
                }
            });
            var onSuccess = function () {
                if (!done) {
                    done = true;
                    complete({ buffer: buffer, bytesRead: bytesRead });
                }
            };
            stream.on('close', onSuccess);
        });
    }
    exports.readExactlyByStream = readExactlyByStream;
    /**
     * Reads totalBytes from the provided file.
     */
    function readExactlyByFile(file, totalBytes) {
        return new winjs_base_1.TPromise(function (complete, error) {
            fs.open(file, 'r', null, function (err, fd) {
                if (err) {
                    return error(err);
                }
                function end(err, resultBuffer, bytesRead) {
                    fs.close(fd, function (closeError) {
                        if (closeError) {
                            return error(closeError);
                        }
                        if (err && err.code === 'EISDIR') {
                            return error(err); // we want to bubble this error up (file is actually a folder)
                        }
                        return complete({ buffer: resultBuffer, bytesRead: bytesRead });
                    });
                }
                var buffer = new Buffer(totalBytes);
                var bytesRead = 0;
                var zeroAttempts = 0;
                function loop() {
                    fs.read(fd, buffer, bytesRead, totalBytes - bytesRead, null, function (err, moreBytesRead) {
                        if (err) {
                            return end(err, null, 0);
                        }
                        // Retry up to N times in case 0 bytes where read
                        if (moreBytesRead === 0) {
                            if (++zeroAttempts === 10) {
                                return end(null, buffer, bytesRead);
                            }
                            return loop();
                        }
                        bytesRead += moreBytesRead;
                        if (bytesRead === totalBytes) {
                            return end(null, buffer, bytesRead);
                        }
                        return loop();
                    });
                }
                loop();
            });
        });
    }
    exports.readExactlyByFile = readExactlyByFile;
    /**
     * Reads a file until a matching string is found.
     *
     * @param file The file to read.
     * @param matchingString The string to search for.
     * @param chunkBytes The number of bytes to read each iteration.
     * @param maximumBytesToRead The maximum number of bytes to read before giving up.
     * @param callback The finished callback.
     */
    function readToMatchingString(file, matchingString, chunkBytes, maximumBytesToRead) {
        return new winjs_base_1.TPromise(function (complete, error) {
            return fs.open(file, 'r', null, function (err, fd) {
                if (err) {
                    return error(err);
                }
                function end(err, result) {
                    fs.close(fd, function (closeError) {
                        if (closeError) {
                            return error(closeError);
                        }
                        if (err && err.code === 'EISDIR') {
                            return error(err); // we want to bubble this error up (file is actually a folder)
                        }
                        return complete(result);
                    });
                }
                var buffer = new Buffer(maximumBytesToRead);
                var bytesRead = 0;
                var zeroAttempts = 0;
                function loop() {
                    fs.read(fd, buffer, bytesRead, chunkBytes, null, function (err, moreBytesRead) {
                        if (err) {
                            return end(err, null);
                        }
                        // Retry up to N times in case 0 bytes where read
                        if (moreBytesRead === 0) {
                            if (++zeroAttempts === 10) {
                                return end(null, null);
                            }
                            return loop();
                        }
                        bytesRead += moreBytesRead;
                        var newLineIndex = buffer.indexOf(matchingString);
                        if (newLineIndex >= 0) {
                            return end(null, buffer.toString('utf8').substr(0, newLineIndex));
                        }
                        if (bytesRead >= maximumBytesToRead) {
                            return end(new Error("Could not find " + matchingString + " in first " + maximumBytesToRead + " bytes of " + file), null);
                        }
                        return loop();
                    });
                }
                loop();
            });
        });
    }
    exports.readToMatchingString = readToMatchingString;
});
//# sourceMappingURL=stream.js.map