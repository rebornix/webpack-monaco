define(["require", "exports", "vs/base/common/uri", "vs/base/common/platform", "vs/base/common/paths", "vs/base/common/strings"], function (require, exports, uri_1, platform, paths_1, strings_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getPathLabel(resource, rootProvider, userHomeProvider) {
        if (!resource) {
            return null;
        }
        if (typeof resource === 'string') {
            resource = uri_1.default.file(resource);
        }
        // return early if we can resolve a relative path label from the root
        var baseResource = rootProvider ? rootProvider.getRoot(resource) : null;
        if (baseResource) {
            var hasMultipleRoots = rootProvider.getWorkspace().roots.length > 1;
            var pathLabel = void 0;
            if (paths_1.isEqual(baseResource.fsPath, resource.fsPath, !platform.isLinux /* ignorecase */)) {
                pathLabel = ''; // no label if pathes are identical
            }
            else {
                pathLabel = paths_1.normalize(strings_1.ltrim(resource.fsPath.substr(baseResource.fsPath.length), paths_1.nativeSep), true);
            }
            if (hasMultipleRoots) {
                var rootName = paths_1.basename(baseResource.fsPath);
                pathLabel = pathLabel ? paths_1.join(rootName, pathLabel) : rootName; // always show root basename if there are multiple
            }
            return pathLabel;
        }
        // convert c:\something => C:\something
        if (platform.isWindows && resource.fsPath && resource.fsPath[1] === ':') {
            return paths_1.normalize(resource.fsPath.charAt(0).toUpperCase() + resource.fsPath.slice(1), true);
        }
        // normalize and tildify (macOS, Linux only)
        var res = paths_1.normalize(resource.fsPath, true);
        if (!platform.isWindows && userHomeProvider) {
            res = tildify(res, userHomeProvider.userHome);
        }
        return res;
    }
    exports.getPathLabel = getPathLabel;
    function tildify(path, userHome) {
        if (path && (platform.isMacintosh || platform.isLinux) && paths_1.isEqualOrParent(path, userHome, !platform.isLinux /* ignorecase */)) {
            path = "~" + path.substr(userHome.length);
        }
        return path;
    }
    exports.tildify = tildify;
    /**
     * Shortens the paths but keeps them easy to distinguish.
     * Replaces not important parts with ellipsis.
     * Every shorten path matches only one original path and vice versa.
     *
     * Algorithm for shortening paths is as follows:
     * 1. For every path in list, find unique substring of that path.
     * 2. Unique substring along with ellipsis is shortened path of that path.
     * 3. To find unique substring of path, consider every segment of length from 1 to path.length of path from end of string
     *    and if present segment is not substring to any other paths then present segment is unique path,
     *    else check if it is not present as suffix of any other path and present segment is suffix of path itself,
     *    if it is true take present segment as unique path.
     * 4. Apply ellipsis to unique segment according to whether segment is present at start/in-between/end of path.
     *
     * Example 1
     * 1. consider 2 paths i.e. ['a\\b\\c\\d', 'a\\f\\b\\c\\d']
     * 2. find unique path of first path,
     * 	a. 'd' is present in path2 and is suffix of path2, hence not unique of present path.
     * 	b. 'c' is present in path2 and 'c' is not suffix of present path, similarly for 'b' and 'a' also.
     * 	c. 'd\\c' is suffix of path2.
     *  d. 'b\\c' is not suffix of present path.
     *  e. 'a\\b' is not present in path2, hence unique path is 'a\\b...'.
     * 3. for path2, 'f' is not present in path1 hence unique is '...\\f\\...'.
     *
     * Example 2
     * 1. consider 2 paths i.e. ['a\\b', 'a\\b\\c'].
     * 	a. Even if 'b' is present in path2, as 'b' is suffix of path1 and is not suffix of path2, unique path will be '...\\b'.
     * 2. for path2, 'c' is not present in path1 hence unique path is '..\\c'.
     */
    var ellipsis = '\u2026';
    var unc = '\\\\';
    var home = '~';
    function shorten(paths) {
        var shortenedPaths = new Array(paths.length);
        // for every path
        var match = false;
        for (var pathIndex = 0; pathIndex < paths.length; pathIndex++) {
            var path = paths[pathIndex];
            if (path === '') {
                shortenedPaths[pathIndex] = "." + paths_1.nativeSep;
                continue;
            }
            if (!path) {
                shortenedPaths[pathIndex] = path;
                continue;
            }
            match = true;
            // trim for now and concatenate unc path (e.g. \\network) or root path (/etc, ~/etc) later
            var prefix = '';
            if (path.indexOf(unc) === 0) {
                prefix = path.substr(0, path.indexOf(unc) + unc.length);
                path = path.substr(path.indexOf(unc) + unc.length);
            }
            else if (path.indexOf(paths_1.nativeSep) === 0) {
                prefix = path.substr(0, path.indexOf(paths_1.nativeSep) + paths_1.nativeSep.length);
                path = path.substr(path.indexOf(paths_1.nativeSep) + paths_1.nativeSep.length);
            }
            else if (path.indexOf(home) === 0) {
                prefix = path.substr(0, path.indexOf(home) + home.length);
                path = path.substr(path.indexOf(home) + home.length);
            }
            // pick the first shortest subpath found
            var segments = path.split(paths_1.nativeSep);
            for (var subpathLength = 1; match && subpathLength <= segments.length; subpathLength++) {
                for (var start = segments.length - subpathLength; match && start >= 0; start--) {
                    match = false;
                    var subpath = segments.slice(start, start + subpathLength).join(paths_1.nativeSep);
                    // that is unique to any other path
                    for (var otherPathIndex = 0; !match && otherPathIndex < paths.length; otherPathIndex++) {
                        // suffix subpath treated specially as we consider no match 'x' and 'x/...'
                        if (otherPathIndex !== pathIndex && paths[otherPathIndex] && paths[otherPathIndex].indexOf(subpath) > -1) {
                            var isSubpathEnding = (start + subpathLength === segments.length);
                            // Adding separator as prefix for subpath, such that 'endsWith(src, trgt)' considers subpath as directory name instead of plain string.
                            // prefix is not added when either subpath is root directory or path[otherPathIndex] does not have multiple directories.
                            var subpathWithSep = (start > 0 && paths[otherPathIndex].indexOf(paths_1.nativeSep) > -1) ? paths_1.nativeSep + subpath : subpath;
                            var isOtherPathEnding = strings_1.endsWith(paths[otherPathIndex], subpathWithSep);
                            match = !isSubpathEnding || isOtherPathEnding;
                        }
                    }
                    // found unique subpath
                    if (!match) {
                        var result = '';
                        // preserve disk drive or root prefix
                        if (strings_1.endsWith(segments[0], ':') || prefix !== '') {
                            if (start === 1) {
                                // extend subpath to include disk drive prefix
                                start = 0;
                                subpathLength++;
                                subpath = segments[0] + paths_1.nativeSep + subpath;
                            }
                            if (start > 0) {
                                result = segments[0] + paths_1.nativeSep;
                            }
                            result = prefix + result;
                        }
                        // add ellipsis at the beginning if neeeded
                        if (start > 0) {
                            result = result + ellipsis + paths_1.nativeSep;
                        }
                        result = result + subpath;
                        // add ellipsis at the end if needed
                        if (start + subpathLength < segments.length) {
                            result = result + paths_1.nativeSep + ellipsis;
                        }
                        shortenedPaths[pathIndex] = result;
                    }
                }
            }
            if (match) {
                shortenedPaths[pathIndex] = path; // use full path if no unique subpaths found
            }
        }
        return shortenedPaths;
    }
    exports.shorten = shorten;
    var Type;
    (function (Type) {
        Type[Type["TEXT"] = 0] = "TEXT";
        Type[Type["VARIABLE"] = 1] = "VARIABLE";
        Type[Type["SEPARATOR"] = 2] = "SEPARATOR";
    })(Type || (Type = {}));
    /**
     * Helper to insert values for specific template variables into the string. E.g. "this $(is) a $(template)" can be
     * passed to this function together with an object that maps "is" and "template" to strings to have them replaced.
     * @param value string to which templating is applied
     * @param values the values of the templates to use
     */
    function template(template, values) {
        if (values === void 0) { values = Object.create(null); }
        var segments = [];
        var inVariable = false;
        var char;
        var curVal = '';
        for (var i = 0; i < template.length; i++) {
            char = template[i];
            // Beginning of variable
            if (char === '$' || (inVariable && char === '{')) {
                if (curVal) {
                    segments.push({ value: curVal, type: Type.TEXT });
                }
                curVal = '';
                inVariable = true;
            }
            else if (char === '}' && inVariable) {
                var resolved = values[curVal];
                // Variable
                if (typeof resolved === 'string') {
                    if (resolved.length) {
                        segments.push({ value: resolved, type: Type.VARIABLE });
                    }
                }
                else if (resolved) {
                    var prevSegment = segments[segments.length - 1];
                    if (!prevSegment || prevSegment.type !== Type.SEPARATOR) {
                        segments.push({ value: resolved.label, type: Type.SEPARATOR }); // prevent duplicate separators
                    }
                }
                curVal = '';
                inVariable = false;
            }
            else {
                curVal += char;
            }
        }
        // Tail
        if (curVal && !inVariable) {
            segments.push({ value: curVal, type: Type.TEXT });
        }
        return segments.filter(function (segment, index) {
            // Only keep separator if we have values to the left and right
            if (segment.type === Type.SEPARATOR) {
                var left = segments[index - 1];
                var right = segments[index + 1];
                return [left, right].every(function (segment) { return segment && segment.type === Type.VARIABLE && segment.value.length > 0; });
            }
            // accept any TEXT and VARIABLE
            return true;
        }).map(function (segment) { return segment.value; }).join('');
    }
    exports.template = template;
    function mnemonicLabel(label, forceDisableMnemonics) {
        if (!platform.isWindows || forceDisableMnemonics) {
            return label.replace(/\(&&\w\)|&&/g, ''); // no mnemonic support on mac/linux
        }
        return label.replace(/&&/g, '&');
    }
    exports.mnemonicLabel = mnemonicLabel;
    function unmnemonicLabel(label) {
        return label.replace(/&/g, '&&');
    }
    exports.unmnemonicLabel = unmnemonicLabel;
});
//# sourceMappingURL=labels.js.map