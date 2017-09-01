define(["require", "exports", "crypto", "vs/base/common/strings", "vs/base/common/winjs.base"], function (require, exports, crypto, strings, winjs_base_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var AVOID_SLICED_STRINGS = true;
    var PREALLOC_BUFFER_CHARS = 1000;
    var emptyString = '';
    var asciiStrings = [];
    for (var i = 0; i < 128; i++) {
        asciiStrings[i] = String.fromCharCode(i);
    }
    function optimizeStringMemory(buff, s) {
        var len = s.length;
        if (len === 0) {
            return emptyString;
        }
        if (len === 1) {
            var charCode = s.charCodeAt(0);
            if (charCode < 128) {
                return asciiStrings[charCode];
            }
        }
        if (AVOID_SLICED_STRINGS) {
            // See https://bugs.chromium.org/p/v8/issues/detail?id=2869
            // See https://github.com/nodejs/help/issues/711
            if (len < PREALLOC_BUFFER_CHARS) {
                // Use the same buffer instance that we have allocated and that can fit `PREALLOC_BUFFER_CHARS` characters
                var byteLen = buff.write(s, 0);
                return buff.toString(undefined, 0, byteLen);
            }
            return Buffer.from(s).toString();
        }
        return s;
    }
    var ModelLineBasedBuilder = (function () {
        function ModelLineBasedBuilder(computeHash) {
            this.computeHash = computeHash;
            if (this.computeHash) {
                this.hash = crypto.createHash('sha1');
            }
            this.BOM = '';
            this.lines = [];
            this.currLineIndex = 0;
            this.buff = Buffer.alloc(3 /*any UTF16 code unit could expand to up to 3 UTF8 code units*/ * PREALLOC_BUFFER_CHARS);
        }
        ModelLineBasedBuilder.prototype.acceptLines = function (lines) {
            if (this.currLineIndex === 0) {
                // Remove the BOM (if present)
                if (strings.startsWithUTF8BOM(lines[0])) {
                    this.BOM = strings.UTF8_BOM_CHARACTER;
                    lines[0] = lines[0].substr(1);
                }
            }
            for (var i = 0, len = lines.length; i < len; i++) {
                this.lines[this.currLineIndex++] = optimizeStringMemory(this.buff, lines[i]);
            }
            if (this.computeHash) {
                this.hash.update(lines.join('\n') + '\n');
            }
        };
        ModelLineBasedBuilder.prototype.finish = function (length, carriageReturnCnt, containsRTL, isBasicASCII) {
            return {
                hash: this.computeHash ? this.hash.digest('hex') : null,
                value: {
                    BOM: this.BOM,
                    lines: this.lines,
                    length: length,
                    containsRTL: containsRTL,
                    totalCRCount: carriageReturnCnt,
                    isBasicASCII: isBasicASCII,
                }
            };
        };
        return ModelLineBasedBuilder;
    }());
    function computeHash(rawText) {
        var hash = crypto.createHash('sha1');
        for (var i = 0, len = rawText.lines.length; i < len; i++) {
            hash.update(rawText.lines[i] + '\n');
        }
        return hash.digest('hex');
    }
    exports.computeHash = computeHash;
    var ModelBuilder = (function () {
        function ModelBuilder(computeHash) {
            this.leftoverPrevChunk = '';
            this.leftoverEndsInCR = false;
            this.totalCRCount = 0;
            this.lineBasedBuilder = new ModelLineBasedBuilder(computeHash);
            this.totalLength = 0;
            this.containsRTL = false;
            this.isBasicASCII = true;
        }
        ModelBuilder.fromStringStream = function (stream) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                var done = false;
                var builder = new ModelBuilder(false);
                stream.on('data', function (chunk) {
                    builder.acceptChunk(chunk);
                });
                stream.on('error', function (error) {
                    if (!done) {
                        done = true;
                        e(error);
                    }
                });
                stream.on('end', function () {
                    if (!done) {
                        done = true;
                        c(builder.finish());
                    }
                });
            });
        };
        ModelBuilder.prototype._updateCRCount = function (chunk) {
            // Count how many \r are present in chunk to determine the majority EOL sequence
            var chunkCarriageReturnCnt = 0;
            var lastCarriageReturnIndex = -1;
            while ((lastCarriageReturnIndex = chunk.indexOf('\r', lastCarriageReturnIndex + 1)) !== -1) {
                chunkCarriageReturnCnt++;
            }
            this.totalCRCount += chunkCarriageReturnCnt;
        };
        ModelBuilder.prototype.acceptChunk = function (chunk) {
            if (chunk.length === 0) {
                return;
            }
            this.totalLength += chunk.length;
            this._updateCRCount(chunk);
            if (!this.containsRTL) {
                this.containsRTL = strings.containsRTL(chunk);
            }
            if (this.isBasicASCII) {
                this.isBasicASCII = strings.isBasicASCII(chunk);
            }
            // Avoid dealing with a chunk that ends in \r (push the \r to the next chunk)
            if (this.leftoverEndsInCR) {
                chunk = '\r' + chunk;
            }
            if (chunk.charCodeAt(chunk.length - 1) === 13 /* CarriageReturn */) {
                this.leftoverEndsInCR = true;
                chunk = chunk.substr(0, chunk.length - 1);
            }
            else {
                this.leftoverEndsInCR = false;
            }
            var lines = chunk.split(/\r\n|\r|\n/);
            if (lines.length === 1) {
                // no \r or \n encountered
                this.leftoverPrevChunk += lines[0];
                return;
            }
            lines[0] = this.leftoverPrevChunk + lines[0];
            this.lineBasedBuilder.acceptLines(lines.slice(0, lines.length - 1));
            this.leftoverPrevChunk = lines[lines.length - 1];
        };
        ModelBuilder.prototype.finish = function () {
            var finalLines = [this.leftoverPrevChunk];
            if (this.leftoverEndsInCR) {
                finalLines.push('');
            }
            this.lineBasedBuilder.acceptLines(finalLines);
            return this.lineBasedBuilder.finish(this.totalLength, this.totalCRCount, this.containsRTL, this.isBasicASCII);
        };
        return ModelBuilder;
    }());
    exports.ModelBuilder = ModelBuilder;
});
//# sourceMappingURL=modelBuilder.js.map