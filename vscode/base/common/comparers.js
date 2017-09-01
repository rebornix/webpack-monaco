define(["require", "exports", "vs/base/common/scorer", "vs/base/common/strings", "vs/base/common/paths"], function (require, exports, scorer, strings, paths) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var intlFileNameCollator;
    var intlFileNameCollatorIsNumeric;
    function setFileNameComparer(collator) {
        intlFileNameCollator = collator;
        intlFileNameCollatorIsNumeric = collator.resolvedOptions().numeric;
    }
    exports.setFileNameComparer = setFileNameComparer;
    function compareFileNames(one, other) {
        if (intlFileNameCollator) {
            var a = one || '';
            var b = other || '';
            var result = intlFileNameCollator.compare(a, b);
            // Using the numeric option in the collator will
            // make compare(`foo1`, `foo01`) === 0. We must disambiguate.
            if (intlFileNameCollatorIsNumeric && result === 0 && a !== b) {
                return a < b ? -1 : 1;
            }
            return result;
        }
        return noIntlCompareFileNames(one, other);
    }
    exports.compareFileNames = compareFileNames;
    var FileNameMatch = /^(.*?)(\.([^.]*))?$/;
    function noIntlCompareFileNames(one, other) {
        var oneMatch = FileNameMatch.exec(one.toLowerCase());
        var otherMatch = FileNameMatch.exec(other.toLowerCase());
        var oneName = oneMatch[1] || '';
        var oneExtension = oneMatch[3] || '';
        var otherName = otherMatch[1] || '';
        var otherExtension = otherMatch[3] || '';
        if (oneName !== otherName) {
            return oneName < otherName ? -1 : 1;
        }
        if (oneExtension === otherExtension) {
            return 0;
        }
        return oneExtension < otherExtension ? -1 : 1;
    }
    exports.noIntlCompareFileNames = noIntlCompareFileNames;
    function compareFileExtensions(one, other) {
        if (intlFileNameCollator) {
            var oneMatch = one ? FileNameMatch.exec(one) : [];
            var otherMatch = other ? FileNameMatch.exec(other) : [];
            var oneName = oneMatch[1] || '';
            var oneExtension = oneMatch[3] || '';
            var otherName = otherMatch[1] || '';
            var otherExtension = otherMatch[3] || '';
            var result = intlFileNameCollator.compare(oneExtension, otherExtension);
            if (result === 0) {
                // Using the numeric option in the collator will
                // make compare(`foo1`, `foo01`) === 0. We must disambiguate.
                if (intlFileNameCollatorIsNumeric && oneExtension !== otherExtension) {
                    return oneExtension < otherExtension ? -1 : 1;
                }
                // Extensions are equal, compare filenames
                result = intlFileNameCollator.compare(oneName, otherName);
                if (intlFileNameCollatorIsNumeric && result === 0 && oneName !== otherName) {
                    return oneName < otherName ? -1 : 1;
                }
            }
            return result;
        }
        return noIntlCompareFileExtensions(one, other);
    }
    exports.compareFileExtensions = compareFileExtensions;
    function noIntlCompareFileExtensions(one, other) {
        var oneMatch = one ? FileNameMatch.exec(one.toLowerCase()) : [];
        var otherMatch = other ? FileNameMatch.exec(other.toLowerCase()) : [];
        var oneName = oneMatch[1] || '';
        var oneExtension = oneMatch[3] || '';
        var otherName = otherMatch[1] || '';
        var otherExtension = otherMatch[3] || '';
        if (oneExtension !== otherExtension) {
            return oneExtension < otherExtension ? -1 : 1;
        }
        if (oneName === otherName) {
            return 0;
        }
        return oneName < otherName ? -1 : 1;
    }
    function comparePaths(one, other) {
        var oneParts = one.split(paths.nativeSep);
        var otherParts = other.split(paths.nativeSep);
        var lastOne = oneParts.length - 1;
        var lastOther = otherParts.length - 1;
        var endOne, endOther, onePart, otherPart;
        for (var i = 0;; i++) {
            endOne = lastOne === i;
            endOther = lastOther === i;
            if (endOne && endOther) {
                return compareFileNames(oneParts[i], otherParts[i]);
            }
            else if (endOne) {
                return -1;
            }
            else if (endOther) {
                return 1;
            }
            else if ((onePart = oneParts[i].toLowerCase()) !== (otherPart = otherParts[i].toLowerCase())) {
                return onePart < otherPart ? -1 : 1;
            }
        }
    }
    exports.comparePaths = comparePaths;
    function compareAnything(one, other, lookFor) {
        var elementAName = one.toLowerCase();
        var elementBName = other.toLowerCase();
        // Sort prefix matches over non prefix matches
        var prefixCompare = compareByPrefix(one, other, lookFor);
        if (prefixCompare) {
            return prefixCompare;
        }
        // Sort suffix matches over non suffix matches
        var elementASuffixMatch = strings.endsWith(elementAName, lookFor);
        var elementBSuffixMatch = strings.endsWith(elementBName, lookFor);
        if (elementASuffixMatch !== elementBSuffixMatch) {
            return elementASuffixMatch ? -1 : 1;
        }
        // Understand file names
        var r = compareFileNames(elementAName, elementBName);
        if (r !== 0) {
            return r;
        }
        // Compare by name
        return elementAName.localeCompare(elementBName);
    }
    exports.compareAnything = compareAnything;
    function compareByPrefix(one, other, lookFor) {
        var elementAName = one.toLowerCase();
        var elementBName = other.toLowerCase();
        // Sort prefix matches over non prefix matches
        var elementAPrefixMatch = strings.startsWith(elementAName, lookFor);
        var elementBPrefixMatch = strings.startsWith(elementBName, lookFor);
        if (elementAPrefixMatch !== elementBPrefixMatch) {
            return elementAPrefixMatch ? -1 : 1;
        }
        else if (elementAPrefixMatch && elementBPrefixMatch) {
            if (elementAName.length < elementBName.length) {
                return -1;
            }
            if (elementAName.length > elementBName.length) {
                return 1;
            }
        }
        return 0;
    }
    exports.compareByPrefix = compareByPrefix;
    function compareByScore(elementA, elementB, accessor, lookFor, lookForNormalizedLower, scorerCache) {
        var labelA = accessor.getLabel(elementA);
        var labelB = accessor.getLabel(elementB);
        // treat prefix matches highest in any case
        var prefixCompare = compareByPrefix(labelA, labelB, lookFor);
        if (prefixCompare) {
            return prefixCompare;
        }
        // Give higher importance to label score
        var labelAScore = scorer.score(labelA, lookFor, scorerCache);
        var labelBScore = scorer.score(labelB, lookFor, scorerCache);
        if (labelAScore !== labelBScore) {
            return labelAScore > labelBScore ? -1 : 1;
        }
        // Score on full resource path comes next (if available)
        var resourcePathA = accessor.getResourcePath(elementA);
        var resourcePathB = accessor.getResourcePath(elementB);
        if (resourcePathA && resourcePathB) {
            var resourceAScore = scorer.score(resourcePathA, lookFor, scorerCache);
            var resourceBScore = scorer.score(resourcePathB, lookFor, scorerCache);
            if (resourceAScore !== resourceBScore) {
                return resourceAScore > resourceBScore ? -1 : 1;
            }
        }
        // At this place, the scores are identical so we check for string lengths and favor shorter ones
        if (labelA.length !== labelB.length) {
            return labelA.length < labelB.length ? -1 : 1;
        }
        if (resourcePathA && resourcePathB && resourcePathA.length !== resourcePathB.length) {
            return resourcePathA.length < resourcePathB.length ? -1 : 1;
        }
        // Finally compare by label or resource path
        if (labelA === labelB && resourcePathA && resourcePathB) {
            return compareAnything(resourcePathA, resourcePathB, lookForNormalizedLower);
        }
        return compareAnything(labelA, labelB, lookForNormalizedLower);
    }
    exports.compareByScore = compareByScore;
});
//# sourceMappingURL=comparers.js.map