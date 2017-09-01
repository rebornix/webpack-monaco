/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Based on material from:
    /*!
    BEGIN THIRD PARTY
    */
    /*!
    * string_score.js: String Scoring Algorithm 0.1.22
    *
    * http://joshaven.com/string_score
    * https://github.com/joshaven/string_score
    *
    * Copyright (C) 2009-2014 Joshaven Potter <yourtech@gmail.com>
    * Special thanks to all of the contributors listed here https://github.com/joshaven/string_score
    * MIT License: http://opensource.org/licenses/MIT
    *
    * Date: Tue Mar 1 2011
    * Updated: Tue Mar 10 2015
    */
    /**
     * Compute a score for the given string and the given query.
     *
     * Rules:
     * Character score: 1
     * Same case bonus: 1
     * Upper case bonus: 1
     * Consecutive match bonus: 5
     * Start of word/path bonus: 7
     * Start of string bonus: 8
     */
    var wordPathBoundary = ['-', '_', ' ', '/', '\\', '.'];
    function score(target, query, cache) {
        if (!target || !query) {
            return 0; // return early if target or query are undefined
        }
        var hash = target + query;
        var cached = cache && cache[hash];
        if (typeof cached === 'number') {
            return cached;
        }
        var queryLen = query.length;
        var targetLower = target.toLowerCase();
        var queryLower = query.toLowerCase();
        var index = 0;
        var startAt = 0;
        var score = 0;
        var _loop_1 = function () {
            var indexOf = targetLower.indexOf(queryLower[index], startAt);
            if (indexOf < 0) {
                score = 0; // This makes sure that the query is contained in the target
                return "break";
            }
            // Character match bonus
            score += 1;
            // Consecutive match bonus
            if (startAt === indexOf) {
                score += 5;
            }
            // Same case bonus
            if (target[indexOf] === query[indexOf]) {
                score += 1;
            }
            // Start of word bonus
            if (indexOf === 0) {
                score += 8;
            }
            else if (wordPathBoundary.some(function (w) { return w === target[indexOf - 1]; })) {
                score += 7;
            }
            else if (isUpper(target.charCodeAt(indexOf))) {
                score += 1;
            }
            startAt = indexOf + 1;
            index++;
        };
        while (index < queryLen) {
            var state_1 = _loop_1();
            if (state_1 === "break")
                break;
        }
        if (cache) {
            cache[hash] = score;
        }
        return score;
    }
    exports.score = score;
    function isUpper(code) {
        return 65 <= code && code <= 90;
    }
    /**
     * A fast method to check if a given string would produce a score > 0 for the given query.
     */
    function matches(target, queryLower) {
        if (!target || !queryLower) {
            return false; // return early if target or query are undefined
        }
        var queryLen = queryLower.length;
        var targetLower = target.toLowerCase();
        var index = 0;
        var lastIndexOf = -1;
        while (index < queryLen) {
            var indexOf = targetLower.indexOf(queryLower[index], lastIndexOf + 1);
            if (indexOf < 0) {
                return false;
            }
            lastIndexOf = indexOf;
            index++;
        }
        return true;
    }
    exports.matches = matches;
});
/*!
END THIRD PARTY
*/ 
//# sourceMappingURL=scorer.js.map