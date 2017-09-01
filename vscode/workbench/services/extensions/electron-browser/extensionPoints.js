/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", "vs/nls", "vs/base/common/platform", "vs/base/node/pfs", "vs/base/common/winjs.base", "vs/base/common/collections", "path", "vs/base/common/json", "vs/base/common/types", "vs/platform/extensions/node/extensionValidator", "semver", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/base/common/jsonErrorMessages"], function (require, exports, nls, Platform, pfs, winjs_base_1, collections_1, path_1, json, Types, extensionValidator_1, semver, extensionManagementUtil_1, jsonErrorMessages_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MANIFEST_FILE = 'package.json';
    var devMode = !!process.env['VSCODE_DEV'];
    var nlsConfig = {
        locale: Platform.locale,
        pseudo: Platform.locale === 'pseudo'
    };
    var ExtensionManifestHandler = (function () {
        function ExtensionManifestHandler(ourVersion, log, absoluteFolderPath, isBuiltin) {
            this._ourVersion = ourVersion;
            this._log = log;
            this._absoluteFolderPath = absoluteFolderPath;
            this._isBuiltin = isBuiltin;
            this._absoluteManifestPath = path_1.join(absoluteFolderPath, MANIFEST_FILE);
        }
        return ExtensionManifestHandler;
    }());
    var ExtensionManifestParser = (function (_super) {
        __extends(ExtensionManifestParser, _super);
        function ExtensionManifestParser() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExtensionManifestParser.prototype.parse = function () {
            var _this = this;
            return pfs.readFile(this._absoluteManifestPath).then(function (manifestContents) {
                try {
                    return JSON.parse(manifestContents.toString());
                }
                catch (e) {
                    _this._log.error(_this._absoluteFolderPath, nls.localize('jsonParseFail', "Failed to parse {0}: {1}.", _this._absoluteManifestPath, jsonErrorMessages_1.getParseErrorMessage(e.message)));
                }
                return null;
            }, function (err) {
                if (err.code === 'ENOENT') {
                    return null;
                }
                _this._log.error(_this._absoluteFolderPath, nls.localize('fileReadFail', "Cannot read file {0}: {1}.", _this._absoluteManifestPath, err.message));
                return null;
            });
        };
        return ExtensionManifestParser;
    }(ExtensionManifestHandler));
    var ExtensionManifestNLSReplacer = (function (_super) {
        __extends(ExtensionManifestNLSReplacer, _super);
        function ExtensionManifestNLSReplacer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExtensionManifestNLSReplacer.prototype.replaceNLS = function (extensionDescription) {
            var _this = this;
            var extension = path_1.extname(this._absoluteManifestPath);
            var basename = this._absoluteManifestPath.substr(0, this._absoluteManifestPath.length - extension.length);
            return pfs.fileExists(basename + '.nls' + extension).then(function (exists) {
                if (!exists) {
                    return extensionDescription;
                }
                return ExtensionManifestNLSReplacer.findMessageBundles(basename).then(function (messageBundle) {
                    if (!messageBundle.localized) {
                        return extensionDescription;
                    }
                    return pfs.readFile(messageBundle.localized).then(function (messageBundleContent) {
                        var errors = [];
                        var messages = json.parse(messageBundleContent.toString(), errors);
                        return ExtensionManifestNLSReplacer.resolveOriginalMessageBundle(messageBundle.original, errors).then(function (originalMessages) {
                            if (errors.length > 0) {
                                errors.forEach(function (error) {
                                    _this._log.error(_this._absoluteFolderPath, nls.localize('jsonsParseFail', "Failed to parse {0} or {1}: {2}.", messageBundle.localized, messageBundle.original, jsonErrorMessages_1.getParseErrorMessage(error.error)));
                                });
                                return extensionDescription;
                            }
                            ExtensionManifestNLSReplacer._replaceNLStrings(extensionDescription, messages, originalMessages, _this._log, _this._absoluteFolderPath);
                            return extensionDescription;
                        });
                    }, function (err) {
                        _this._log.error(_this._absoluteFolderPath, nls.localize('fileReadFail', "Cannot read file {0}: {1}.", messageBundle.localized, err.message));
                        return null;
                    });
                });
            });
        };
        /**
         * Parses original message bundle, returns null if the original message bundle is null.
         */
        ExtensionManifestNLSReplacer.resolveOriginalMessageBundle = function (originalMessageBundle, errors) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                if (originalMessageBundle) {
                    pfs.readFile(originalMessageBundle).then(function (originalBundleContent) {
                        c(json.parse(originalBundleContent.toString(), errors));
                    });
                }
                else {
                    c(null);
                }
            });
        };
        /**
         * Finds localized message bundle and the original (unlocalized) one.
         * If the localized file is not present, returns null for the original and marks original as localized.
         */
        ExtensionManifestNLSReplacer.findMessageBundles = function (basename) {
            return new winjs_base_1.TPromise(function (c, e, p) {
                function loop(basename, locale) {
                    var toCheck = basename + ".nls." + locale + ".json";
                    pfs.fileExists(toCheck).then(function (exists) {
                        if (exists) {
                            c({ localized: toCheck, original: basename + ".nls.json" });
                        }
                        var index = locale.lastIndexOf('-');
                        if (index === -1) {
                            c({ localized: basename + ".nls.json", original: null });
                        }
                        else {
                            locale = locale.substring(0, index);
                            loop(basename, locale);
                        }
                    });
                }
                if (devMode || nlsConfig.pseudo || !nlsConfig.locale) {
                    return c({ localized: basename + '.nls.json', original: null });
                }
                loop(basename, nlsConfig.locale);
            });
        };
        /**
         * This routine makes the following assumptions:
         * The root element is an object literal
         */
        ExtensionManifestNLSReplacer._replaceNLStrings = function (literal, messages, originalMessages, log, messageScope) {
            function processEntry(obj, key, command) {
                var value = obj[key];
                if (Types.isString(value)) {
                    var str = value;
                    var length_1 = str.length;
                    if (length_1 > 1 && str[0] === '%' && str[length_1 - 1] === '%') {
                        var messageKey = str.substr(1, length_1 - 2);
                        var message = messages[messageKey];
                        if (message) {
                            if (nlsConfig.pseudo) {
                                // FF3B and FF3D is the Unicode zenkaku representation for [ and ]
                                message = '\uFF3B' + message.replace(/[aouei]/g, '$&$&') + '\uFF3D';
                            }
                            obj[key] = command && (key === 'title' || key === 'category') && originalMessages ? { value: message, original: originalMessages[messageKey] } : message;
                        }
                        else {
                            log.warn(messageScope, nls.localize('missingNLSKey', "Couldn't find message for key {0}.", messageKey));
                        }
                    }
                }
                else if (Types.isObject(value)) {
                    for (var k in value) {
                        if (value.hasOwnProperty(k)) {
                            k === 'commands' ? processEntry(value, k, true) : processEntry(value, k, command);
                        }
                    }
                }
                else if (Types.isArray(value)) {
                    for (var i = 0; i < value.length; i++) {
                        processEntry(value, i, command);
                    }
                }
            }
            for (var key in literal) {
                if (literal.hasOwnProperty(key)) {
                    processEntry(literal, key);
                }
            }
            ;
        };
        return ExtensionManifestNLSReplacer;
    }(ExtensionManifestHandler));
    var ExtensionManifestValidator = (function (_super) {
        __extends(ExtensionManifestValidator, _super);
        function ExtensionManifestValidator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExtensionManifestValidator.prototype.validate = function (_extensionDescription) {
            var _this = this;
            var extensionDescription = _extensionDescription;
            extensionDescription.isBuiltin = this._isBuiltin;
            var notices = [];
            if (!extensionValidator_1.isValidExtensionDescription(this._ourVersion, this._absoluteFolderPath, extensionDescription, notices)) {
                notices.forEach(function (error) {
                    _this._log.error(_this._absoluteFolderPath, error);
                });
                return null;
            }
            // in this case the notices are warnings
            notices.forEach(function (error) {
                _this._log.warn(_this._absoluteFolderPath, error);
            });
            // id := `publisher.name`
            extensionDescription.id = extensionDescription.publisher + "." + extensionDescription.name;
            // main := absolutePath(`main`)
            if (extensionDescription.main) {
                extensionDescription.main = path_1.join(this._absoluteFolderPath, extensionDescription.main);
            }
            extensionDescription.extensionFolderPath = this._absoluteFolderPath;
            return extensionDescription;
        };
        return ExtensionManifestValidator;
    }(ExtensionManifestHandler));
    var ExtensionScanner = (function () {
        function ExtensionScanner() {
        }
        /**
         * Read the extension defined in `absoluteFolderPath`
         */
        ExtensionScanner.scanExtension = function (version, log, absoluteFolderPath, isBuiltin) {
            absoluteFolderPath = path_1.normalize(absoluteFolderPath);
            var parser = new ExtensionManifestParser(version, log, absoluteFolderPath, isBuiltin);
            return parser.parse().then(function (extensionDescription) {
                if (extensionDescription === null) {
                    return null;
                }
                var nlsReplacer = new ExtensionManifestNLSReplacer(version, log, absoluteFolderPath, isBuiltin);
                return nlsReplacer.replaceNLS(extensionDescription);
            }).then(function (extensionDescription) {
                if (extensionDescription === null) {
                    return null;
                }
                var validator = new ExtensionManifestValidator(version, log, absoluteFolderPath, isBuiltin);
                return validator.validate(extensionDescription);
            });
        };
        /**
         * Scan a list of extensions defined in `absoluteFolderPath`
         */
        ExtensionScanner.scanExtensions = function (version, log, absoluteFolderPath, isBuiltin) {
            var _this = this;
            var obsolete = winjs_base_1.TPromise.as({});
            if (!isBuiltin) {
                obsolete = pfs.readFile(path_1.join(absoluteFolderPath, '.obsolete'), 'utf8')
                    .then(function (raw) { return JSON.parse(raw); })
                    .then(null, function (err) { return ({}); });
            }
            return obsolete.then(function (obsolete) {
                return pfs.readDirsInDir(absoluteFolderPath)
                    .then(function (folders) {
                    if (isBuiltin) {
                        return folders;
                    }
                    // TODO: align with extensionsService
                    var nonGallery = [];
                    var gallery = [];
                    folders.forEach(function (folder) {
                        if (obsolete[folder]) {
                            return;
                        }
                        var _a = extensionManagementUtil_1.getIdAndVersionFromLocalExtensionId(folder), id = _a.id, version = _a.version;
                        if (!id || !version) {
                            nonGallery.push(folder);
                            return;
                        }
                        gallery.push({ folder: folder, id: id, version: version });
                    });
                    var byId = collections_1.values(collections_1.groupBy(gallery, function (p) { return p.id; }));
                    var latest = byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); })[0]; })
                        .map(function (a) { return a.folder; });
                    return nonGallery.concat(latest);
                })
                    .then(function (folders) { return winjs_base_1.TPromise.join(folders.map(function (f) { return _this.scanExtension(version, log, path_1.join(absoluteFolderPath, f), isBuiltin); })); })
                    .then(function (extensionDescriptions) { return extensionDescriptions.filter(function (item) { return item !== null; }); })
                    .then(null, function (err) {
                    log.error(absoluteFolderPath, err);
                    return [];
                });
            });
        };
        /**
         * Combination of scanExtension and scanExtensions: If an extension manifest is found at root, we load just this extension,
         * otherwise we assume the folder contains multiple extensions.
         */
        ExtensionScanner.scanOneOrMultipleExtensions = function (version, log, absoluteFolderPath, isBuiltin) {
            var _this = this;
            return pfs.fileExists(path_1.join(absoluteFolderPath, MANIFEST_FILE)).then(function (exists) {
                if (exists) {
                    return _this.scanExtension(version, log, absoluteFolderPath, isBuiltin).then(function (extensionDescription) {
                        if (extensionDescription === null) {
                            return [];
                        }
                        return [extensionDescription];
                    });
                }
                return _this.scanExtensions(version, log, absoluteFolderPath, isBuiltin);
            }, function (err) {
                log.error(absoluteFolderPath, err);
                return [];
            });
        };
        return ExtensionScanner;
    }());
    exports.ExtensionScanner = ExtensionScanner;
});
//# sourceMappingURL=extensionPoints.js.map