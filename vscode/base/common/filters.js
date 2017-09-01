define(["require", "exports", "vs/base/common/strings", "vs/base/common/map"], function (require, exports, strings, map_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Combined filters
    /**
     * @returns A filter which combines the provided set
     * of filters with an or. The *first* filters that
     * matches defined the return value of the returned
     * filter.
     */
    function or() {
        var filter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filter[_i] = arguments[_i];
        }
        return function (word, wordToMatchAgainst) {
            for (var i = 0, len = filter.length; i < len; i++) {
                var match = filter[i](word, wordToMatchAgainst);
                if (match) {
                    return match;
                }
            }
            return null;
        };
    }
    exports.or = or;
    /**
     * @returns A filter which combines the provided set
     * of filters with an and. The combines matches are
     * returned if *all* filters match.
     */
    function and() {
        var filter = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filter[_i] = arguments[_i];
        }
        return function (word, wordToMatchAgainst) {
            var result = [];
            for (var i = 0, len = filter.length; i < len; i++) {
                var match = filter[i](word, wordToMatchAgainst);
                if (!match) {
                    return null;
                }
                result = result.concat(match);
            }
            return result;
        };
    }
    exports.and = and;
    // Prefix
    exports.matchesStrictPrefix = _matchesPrefix.bind(undefined, false);
    exports.matchesPrefix = _matchesPrefix.bind(undefined, true);
    function _matchesPrefix(ignoreCase, word, wordToMatchAgainst) {
        if (!wordToMatchAgainst || wordToMatchAgainst.length < word.length) {
            return null;
        }
        var matches;
        if (ignoreCase) {
            matches = strings.beginsWithIgnoreCase(wordToMatchAgainst, word);
        }
        else {
            matches = wordToMatchAgainst.indexOf(word) === 0;
        }
        if (!matches) {
            return null;
        }
        return word.length > 0 ? [{ start: 0, end: word.length }] : [];
    }
    // Contiguous Substring
    function matchesContiguousSubString(word, wordToMatchAgainst) {
        var index = wordToMatchAgainst.toLowerCase().indexOf(word.toLowerCase());
        if (index === -1) {
            return null;
        }
        return [{ start: index, end: index + word.length }];
    }
    exports.matchesContiguousSubString = matchesContiguousSubString;
    // Substring
    function matchesSubString(word, wordToMatchAgainst) {
        return _matchesSubString(word.toLowerCase(), wordToMatchAgainst.toLowerCase(), 0, 0);
    }
    exports.matchesSubString = matchesSubString;
    function _matchesSubString(word, wordToMatchAgainst, i, j) {
        if (i === word.length) {
            return [];
        }
        else if (j === wordToMatchAgainst.length) {
            return null;
        }
        else {
            if (word[i] === wordToMatchAgainst[j]) {
                var result = null;
                if (result = _matchesSubString(word, wordToMatchAgainst, i + 1, j + 1)) {
                    return join({ start: j, end: j + 1 }, result);
                }
            }
            return _matchesSubString(word, wordToMatchAgainst, i, j + 1);
        }
    }
    // CamelCase
    function isLower(code) {
        return 97 /* a */ <= code && code <= 122 /* z */;
    }
    function isUpper(code) {
        return 65 /* A */ <= code && code <= 90 /* Z */;
    }
    function isNumber(code) {
        return 48 /* Digit0 */ <= code && code <= 57 /* Digit9 */;
    }
    function isWhitespace(code) {
        return (code === 32 /* Space */
            || code === 9 /* Tab */
            || code === 10 /* LineFeed */
            || code === 13 /* CarriageReturn */);
    }
    function isAlphanumeric(code) {
        return isLower(code) || isUpper(code) || isNumber(code);
    }
    function join(head, tail) {
        if (tail.length === 0) {
            tail = [head];
        }
        else if (head.end === tail[0].start) {
            tail[0].start = head.start;
        }
        else {
            tail.unshift(head);
        }
        return tail;
    }
    function nextAnchor(camelCaseWord, start) {
        for (var i = start; i < camelCaseWord.length; i++) {
            var c = camelCaseWord.charCodeAt(i);
            if (isUpper(c) || isNumber(c) || (i > 0 && !isAlphanumeric(camelCaseWord.charCodeAt(i - 1)))) {
                return i;
            }
        }
        return camelCaseWord.length;
    }
    function _matchesCamelCase(word, camelCaseWord, i, j) {
        if (i === word.length) {
            return [];
        }
        else if (j === camelCaseWord.length) {
            return null;
        }
        else if (word[i] !== camelCaseWord[j].toLowerCase()) {
            return null;
        }
        else {
            var result = null;
            var nextUpperIndex = j + 1;
            result = _matchesCamelCase(word, camelCaseWord, i + 1, j + 1);
            while (!result && (nextUpperIndex = nextAnchor(camelCaseWord, nextUpperIndex)) < camelCaseWord.length) {
                result = _matchesCamelCase(word, camelCaseWord, i + 1, nextUpperIndex);
                nextUpperIndex++;
            }
            return result === null ? null : join({ start: j, end: j + 1 }, result);
        }
    }
    // Heuristic to avoid computing camel case matcher for words that don't
    // look like camelCaseWords.
    function analyzeCamelCaseWord(word) {
        var upper = 0, lower = 0, alpha = 0, numeric = 0, code = 0;
        for (var i = 0; i < word.length; i++) {
            code = word.charCodeAt(i);
            if (isUpper(code)) {
                upper++;
            }
            if (isLower(code)) {
                lower++;
            }
            if (isAlphanumeric(code)) {
                alpha++;
            }
            if (isNumber(code)) {
                numeric++;
            }
        }
        var upperPercent = upper / word.length;
        var lowerPercent = lower / word.length;
        var alphaPercent = alpha / word.length;
        var numericPercent = numeric / word.length;
        return { upperPercent: upperPercent, lowerPercent: lowerPercent, alphaPercent: alphaPercent, numericPercent: numericPercent };
    }
    function isUpperCaseWord(analysis) {
        var upperPercent = analysis.upperPercent, lowerPercent = analysis.lowerPercent;
        return lowerPercent === 0 && upperPercent > 0.6;
    }
    function isCamelCaseWord(analysis) {
        var upperPercent = analysis.upperPercent, lowerPercent = analysis.lowerPercent, alphaPercent = analysis.alphaPercent, numericPercent = analysis.numericPercent;
        return lowerPercent > 0.2 && upperPercent < 0.8 && alphaPercent > 0.6 && numericPercent < 0.2;
    }
    // Heuristic to avoid computing camel case matcher for words that don't
    // look like camel case patterns.
    function isCamelCasePattern(word) {
        var upper = 0, lower = 0, code = 0, whitespace = 0;
        for (var i = 0; i < word.length; i++) {
            code = word.charCodeAt(i);
            if (isUpper(code)) {
                upper++;
            }
            if (isLower(code)) {
                lower++;
            }
            if (isWhitespace(code)) {
                whitespace++;
            }
        }
        if ((upper === 0 || lower === 0) && whitespace === 0) {
            return word.length <= 30;
        }
        else {
            return upper <= 5;
        }
    }
    function matchesCamelCase(word, camelCaseWord) {
        if (!camelCaseWord || camelCaseWord.length === 0) {
            return null;
        }
        if (!isCamelCasePattern(word)) {
            return null;
        }
        if (camelCaseWord.length > 60) {
            return null;
        }
        var analysis = analyzeCamelCaseWord(camelCaseWord);
        if (!isCamelCaseWord(analysis)) {
            if (!isUpperCaseWord(analysis)) {
                return null;
            }
            camelCaseWord = camelCaseWord.toLowerCase();
        }
        var result = null;
        var i = 0;
        while (i < camelCaseWord.length && (result = _matchesCamelCase(word.toLowerCase(), camelCaseWord, 0, i)) === null) {
            i = nextAnchor(camelCaseWord, i + 1);
        }
        return result;
    }
    exports.matchesCamelCase = matchesCamelCase;
    // Matches beginning of words supporting non-ASCII languages
    // If `contiguous` is true then matches word with beginnings of the words in the target. E.g. "pul" will match "Git: Pull"
    // Otherwise also matches sub string of the word with beginnings of the words in the target. E.g. "gp" or "g p" will match "Git: Pull"
    // Useful in cases where the target is words (e.g. command labels)
    function matchesWords(word, target, contiguous) {
        if (contiguous === void 0) { contiguous = false; }
        if (!target || target.length === 0) {
            return null;
        }
        var result = null;
        var i = 0;
        while (i < target.length && (result = _matchesWords(word.toLowerCase(), target, 0, i, contiguous)) === null) {
            i = nextWord(target, i + 1);
        }
        return result;
    }
    exports.matchesWords = matchesWords;
    function _matchesWords(word, target, i, j, contiguous) {
        if (i === word.length) {
            return [];
        }
        else if (j === target.length) {
            return null;
        }
        else if (word[i] !== target[j].toLowerCase()) {
            return null;
        }
        else {
            var result = null;
            var nextWordIndex = j + 1;
            result = _matchesWords(word, target, i + 1, j + 1, contiguous);
            if (!contiguous) {
                while (!result && (nextWordIndex = nextWord(target, nextWordIndex)) < target.length) {
                    result = _matchesWords(word, target, i + 1, nextWordIndex, contiguous);
                    nextWordIndex++;
                }
            }
            return result === null ? null : join({ start: j, end: j + 1 }, result);
        }
    }
    function nextWord(word, start) {
        for (var i = start; i < word.length; i++) {
            var c = word.charCodeAt(i);
            if (isWhitespace(c) || (i > 0 && isWhitespace(word.charCodeAt(i - 1)))) {
                return i;
            }
        }
        return word.length;
    }
    // Fuzzy
    var SubstringMatching;
    (function (SubstringMatching) {
        SubstringMatching[SubstringMatching["Contiguous"] = 0] = "Contiguous";
        SubstringMatching[SubstringMatching["Separate"] = 1] = "Separate";
    })(SubstringMatching = exports.SubstringMatching || (exports.SubstringMatching = {}));
    exports.fuzzyContiguousFilter = or(exports.matchesPrefix, matchesCamelCase, matchesContiguousSubString);
    var fuzzySeparateFilter = or(exports.matchesPrefix, matchesCamelCase, matchesSubString);
    var fuzzyRegExpCache = new map_1.BoundedMap(10000); // bounded to 10000 elements
    function matchesFuzzy(word, wordToMatchAgainst, enableSeparateSubstringMatching) {
        if (enableSeparateSubstringMatching === void 0) { enableSeparateSubstringMatching = false; }
        if (typeof word !== 'string' || typeof wordToMatchAgainst !== 'string') {
            return null; // return early for invalid input
        }
        // Form RegExp for wildcard matches
        var regexp = fuzzyRegExpCache.get(word);
        if (!regexp) {
            regexp = new RegExp(strings.convertSimple2RegExpPattern(word), 'i');
            fuzzyRegExpCache.set(word, regexp);
        }
        // RegExp Filter
        var match = regexp.exec(wordToMatchAgainst);
        if (match) {
            return [{ start: match.index, end: match.index + match[0].length }];
        }
        // Default Filter
        return enableSeparateSubstringMatching ? fuzzySeparateFilter(word, wordToMatchAgainst) : exports.fuzzyContiguousFilter(word, wordToMatchAgainst);
    }
    exports.matchesFuzzy = matchesFuzzy;
    function createMatches(position) {
        var ret = [];
        if (!position) {
            return ret;
        }
        var last;
        for (var _i = 0, position_1 = position; _i < position_1.length; _i++) {
            var pos = position_1[_i];
            if (last && last.end === pos) {
                last.end += 1;
            }
            else {
                last = { start: pos, end: pos + 1 };
                ret.push(last);
            }
        }
        return ret;
    }
    exports.createMatches = createMatches;
    function initTable() {
        var table = [];
        var row = [0];
        for (var i = 1; i <= 100; i++) {
            row.push(-i);
        }
        for (var i = 0; i <= 100; i++) {
            var thisRow = row.slice(0);
            thisRow[0] = -i;
            table.push(thisRow);
        }
        return table;
    }
    var _table = initTable();
    var _scores = initTable();
    var _arrows = initTable();
    var _debug = false;
    function printTable(table, pattern, patternLen, word, wordLen) {
        function pad(s, n, pad) {
            if (pad === void 0) { pad = ' '; }
            while (s.length < n) {
                s = pad + s;
            }
            return s;
        }
        var ret = " |   |" + word.split('').map(function (c) { return pad(c, 3); }).join('|') + "\n";
        for (var i = 0; i <= patternLen; i++) {
            if (i === 0) {
                ret += ' |';
            }
            else {
                ret += pattern[i - 1] + "|";
            }
            ret += table[i].slice(0, wordLen + 1).map(function (n) { return pad(n.toString(), 3); }).join('|') + '\n';
        }
        return ret;
    }
    var _seps = Object.create(null);
    _seps['_'] = true;
    _seps['-'] = true;
    _seps['.'] = true;
    _seps[' '] = true;
    _seps['/'] = true;
    _seps['\\'] = true;
    _seps['\''] = true;
    _seps['"'] = true;
    _seps[':'] = true;
    var _ws = Object.create(null);
    _ws[' '] = true;
    _ws['\t'] = true;
    var Arrow;
    (function (Arrow) {
        Arrow[Arrow["Top"] = 1] = "Top";
        Arrow[Arrow["Diag"] = 2] = "Diag";
        Arrow[Arrow["Left"] = 4] = "Left";
    })(Arrow || (Arrow = {}));
    function fuzzyScore(pattern, word, patternMaxWhitespaceIgnore) {
        var patternLen = pattern.length > 100 ? 100 : pattern.length;
        var wordLen = word.length > 100 ? 100 : word.length;
        // Check for leading whitespace in the pattern and
        // start matching just after that position. This is
        // like `pattern = pattern.rtrim()` but doesn't create
        // a new string
        var patternStartPos = 0;
        if (patternMaxWhitespaceIgnore === undefined) {
            patternMaxWhitespaceIgnore = patternLen;
        }
        while (patternStartPos < patternMaxWhitespaceIgnore) {
            if (_ws[pattern[patternStartPos]]) {
                patternStartPos += 1;
            }
            else {
                break;
            }
        }
        if (patternStartPos === patternLen) {
            return [-100, []];
        }
        if (patternLen > wordLen) {
            return undefined;
        }
        var lowPattern = pattern.toLowerCase();
        var lowWord = word.toLowerCase();
        var patternPos = patternStartPos;
        var wordPos = 0;
        // Run a simple check if the characters of pattern occur
        // (in order) at all in word. If that isn't the case we
        // stop because no match will be possible
        while (patternPos < patternLen && wordPos < wordLen) {
            if (lowPattern[patternPos] === lowWord[wordPos]) {
                patternPos += 1;
            }
            wordPos += 1;
        }
        if (patternPos !== patternLen) {
            return undefined;
        }
        // There will be a mach, fill in tables
        for (patternPos = patternStartPos + 1; patternPos <= patternLen; patternPos++) {
            var lastLowWordChar = '';
            for (wordPos = 1; wordPos <= wordLen; wordPos++) {
                var score = -1;
                var lowWordChar = lowWord[wordPos - 1];
                if (lowPattern[patternPos - 1] === lowWordChar) {
                    if (wordPos === (patternPos - patternStartPos)) {
                        // common prefix: `foobar <-> foobaz`
                        if (pattern[patternPos - 1] === word[wordPos - 1]) {
                            score = 7;
                        }
                        else {
                            score = 5;
                        }
                    }
                    else if (lowWordChar !== word[wordPos - 1]) {
                        // hitting upper-case: `foo <-> forOthers`
                        if (pattern[patternPos - 1] === word[wordPos - 1]) {
                            score = 7;
                        }
                        else {
                            score = 5;
                        }
                    }
                    else if (_seps[lastLowWordChar]) {
                        // post separator: `foo <-> bar_foo`
                        score = 5;
                    }
                    else {
                        score = 1;
                    }
                }
                _scores[patternPos][wordPos] = score;
                var diag = _table[patternPos - 1][wordPos - 1] + (score > 1 ? 1 : score);
                var top_1 = _table[patternPos - 1][wordPos] + -1;
                var left = _table[patternPos][wordPos - 1] + -1;
                if (left >= top_1) {
                    // left or diag
                    if (left > diag) {
                        _table[patternPos][wordPos] = left;
                        _arrows[patternPos][wordPos] = 4 /* Left */;
                    }
                    else if (left === diag) {
                        _table[patternPos][wordPos] = left;
                        _arrows[patternPos][wordPos] = 4 /* Left */ | 2 /* Diag */;
                    }
                    else {
                        _table[patternPos][wordPos] = diag;
                        _arrows[patternPos][wordPos] = 2 /* Diag */;
                    }
                }
                else {
                    // top or diag
                    if (top_1 > diag) {
                        _table[patternPos][wordPos] = top_1;
                        _arrows[patternPos][wordPos] = 1 /* Top */;
                    }
                    else if (top_1 === diag) {
                        _table[patternPos][wordPos] = top_1;
                        _arrows[patternPos][wordPos] = 1 /* Top */ | 2 /* Diag */;
                    }
                    else {
                        _table[patternPos][wordPos] = diag;
                        _arrows[patternPos][wordPos] = 2 /* Diag */;
                    }
                }
                lastLowWordChar = lowWordChar;
            }
        }
        if (_debug) {
            console.log(printTable(_table, pattern, patternLen, word, wordLen));
            console.log(printTable(_arrows, pattern, patternLen, word, wordLen));
            console.log(printTable(_scores, pattern, patternLen, word, wordLen));
        }
        // _bucket is an array of [PrefixArray] we use to keep
        // track of scores and matches. After calling `_findAllMatches`
        // the best match (if available) is the first item in the array
        _bucket.length = 0;
        _topScore = -100;
        _patternStartPos = patternStartPos;
        _findAllMatches(patternLen, wordLen, 0, new LazyArray(), false);
        if (_bucket.length === 0) {
            return undefined;
        }
        return [_topScore, _bucket[0].toArray()];
    }
    exports.fuzzyScore = fuzzyScore;
    var _bucket = [];
    var _topScore = 0;
    var _patternStartPos = 0;
    function _findAllMatches(patternPos, wordPos, total, matches, lastMatched) {
        if (_bucket.length >= 10 || total < -25) {
            // stop when having already 10 results, or
            // when a potential alignment as already 5 gaps
            return;
        }
        var simpleMatchCount = 0;
        while (patternPos > _patternStartPos && wordPos > 0) {
            var score = _scores[patternPos][wordPos];
            var arrow = _arrows[patternPos][wordPos];
            if (arrow === 4 /* Left */) {
                // left
                wordPos -= 1;
                if (lastMatched) {
                    total -= 5; // new gap penalty
                }
                else if (!matches.isEmpty()) {
                    total -= 1; // gap penalty after first match
                }
                lastMatched = false;
                simpleMatchCount = 0;
            }
            else if (arrow & 2 /* Diag */) {
                if (arrow & 4 /* Left */) {
                    // left
                    _findAllMatches(patternPos, wordPos - 1, !matches.isEmpty() ? total - 1 : total, // gap penalty after first match
                    matches.slice(), lastMatched);
                }
                // diag
                total += score;
                patternPos -= 1;
                wordPos -= 1;
                matches.unshift(wordPos);
                lastMatched = true;
                // count simple matches and boost a row of
                // simple matches when they yield in a
                // strong match.
                if (score === 1) {
                    simpleMatchCount += 1;
                    if (patternPos === _patternStartPos) {
                        // when the first match is a weak
                        // match we discard it
                        return undefined;
                    }
                }
                else {
                    // boost
                    total += 1 + (simpleMatchCount * (score - 1));
                    simpleMatchCount = 0;
                }
            }
            else {
                return undefined;
            }
        }
        total -= wordPos >= 3 ? 9 : wordPos * 3; // late start penalty
        // dynamically keep track of the current top score
        // and insert the current best score at head, the rest at tail
        if (total > _topScore) {
            _topScore = total;
            _bucket.unshift(matches);
        }
        else {
            _bucket.push(matches);
        }
    }
    var LazyArray = (function () {
        function LazyArray() {
        }
        LazyArray.prototype.isEmpty = function () {
            return !this._data && (!this._parent || this._parent.isEmpty());
        };
        LazyArray.prototype.unshift = function (n) {
            if (!this._data) {
                this._data = [n];
            }
            else {
                this._data.unshift(n);
            }
        };
        LazyArray.prototype.slice = function () {
            var ret = new LazyArray();
            ret._parent = this;
            ret._parentLen = this._data ? this._data.length : 0;
            return ret;
        };
        LazyArray.prototype.toArray = function () {
            if (!this._data) {
                return this._parent.toArray();
            }
            var bucket = [];
            var element = this;
            while (element) {
                if (element._parent && element._parent._data) {
                    bucket.push(element._parent._data.slice(element._parent._data.length - element._parentLen));
                }
                element = element._parent;
            }
            return Array.prototype.concat.apply(this._data, bucket);
        };
        return LazyArray;
    }());
    function nextTypoPermutation(pattern, patternPos) {
        if (patternPos + 1 >= pattern.length) {
            return undefined;
        }
        return pattern.slice(0, patternPos)
            + pattern[patternPos + 1]
            + pattern[patternPos]
            + pattern.slice(patternPos + 2);
    }
    exports.nextTypoPermutation = nextTypoPermutation;
    function fuzzyScoreGraceful(pattern, word) {
        var ret = fuzzyScore(pattern, word);
        for (var patternPos = 1; patternPos < pattern.length - 1 && !ret; patternPos++) {
            var pattern2 = nextTypoPermutation(pattern, patternPos);
            ret = fuzzyScore(pattern2, word);
        }
        return ret;
    }
    exports.fuzzyScoreGraceful = fuzzyScoreGraceful;
});
//# sourceMappingURL=filters.js.map