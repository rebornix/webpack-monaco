/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "vs/nls", "path", "vs/base/node/pfs", "vs/base/common/errors", "vs/base/common/objects", "vs/base/common/lifecycle", "vs/base/common/arrays", "vs/base/node/zip", "vs/base/common/winjs.base", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "../common/extensionNls", "vs/platform/environment/common/environment", "vs/base/common/async", "vs/base/common/event", "semver", "vs/base/common/collections", "vs/base/common/uri", "vs/platform/message/common/message"], function (require, exports, nls, path, pfs, errors, objects_1, lifecycle_1, arrays_1, zip_1, winjs_base_1, extensionManagement_1, extensionManagementUtil_1, extensionNls_1, environment_1, async_1, event_1, semver, collections_1, uri_1, message_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SystemExtensionsRoot = path.normalize(path.join(uri_1.default.parse(require.toUrl('')).fsPath, '..', 'extensions'));
    function parseManifest(raw) {
        return new winjs_base_1.TPromise(function (c, e) {
            try {
                var manifest = JSON.parse(raw);
                var metadata = manifest.__metadata || null;
                delete manifest.__metadata;
                c({ manifest: manifest, metadata: metadata });
            }
            catch (err) {
                e(new Error(nls.localize('invalidManifest', "Extension invalid: package.json is not a JSON file.")));
            }
        });
    }
    function validate(zipPath) {
        return zip_1.buffer(zipPath, 'extension/package.json')
            .then(function (buffer) { return parseManifest(buffer.toString('utf8')); })
            .then(function (_a) {
            var manifest = _a.manifest;
            return winjs_base_1.TPromise.as(manifest);
        });
    }
    function readManifest(extensionPath) {
        var promises = [
            pfs.readFile(path.join(extensionPath, 'package.json'), 'utf8')
                .then(function (raw) { return parseManifest(raw); }),
            pfs.readFile(path.join(extensionPath, 'package.nls.json'), 'utf8')
                .then(null, function (err) { return err.code !== 'ENOENT' ? winjs_base_1.TPromise.wrapError(err) : '{}'; })
                .then(function (raw) { return JSON.parse(raw); })
        ];
        return winjs_base_1.TPromise.join(promises).then(function (_a) {
            var _b = _a[0], manifest = _b.manifest, metadata = _b.metadata, translations = _a[1];
            return {
                manifest: extensionNls_1.localizeManifest(manifest, translations),
                metadata: metadata
            };
        });
    }
    var ExtensionManagementService = (function () {
        function ExtensionManagementService(environmentService, choiceService, galleryService) {
            this.environmentService = environmentService;
            this.choiceService = choiceService;
            this.galleryService = galleryService;
            this.disposables = [];
            this._onInstallExtension = new event_1.Emitter();
            this.onInstallExtension = this._onInstallExtension.event;
            this._onDidInstallExtension = new event_1.Emitter();
            this.onDidInstallExtension = this._onDidInstallExtension.event;
            this._onUninstallExtension = new event_1.Emitter();
            this.onUninstallExtension = this._onUninstallExtension.event;
            this._onDidUninstallExtension = new event_1.Emitter();
            this.onDidUninstallExtension = this._onDidUninstallExtension.event;
            this.extensionsPath = environmentService.extensionsPath;
            this.obsoletePath = path.join(this.extensionsPath, '.obsolete');
            this.obsoleteFileLimiter = new async_1.Limiter(1);
        }
        ExtensionManagementService.prototype.install = function (zipPath) {
            var _this = this;
            zipPath = path.resolve(zipPath);
            return validate(zipPath).then(function (manifest) {
                var id = extensionManagementUtil_1.getLocalExtensionIdFromManifest(manifest);
                return _this.isObsolete(id).then(function (isObsolete) {
                    if (isObsolete) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls.localize('restartCode', "Please restart Code before reinstalling {0}.", manifest.displayName || manifest.name)));
                    }
                    _this._onInstallExtension.fire({ id: id, zipPath: zipPath });
                    return _this.installExtension(zipPath, id)
                        .then(function (local) { return _this._onDidInstallExtension.fire({ id: id, zipPath: zipPath, local: local }); }, function (error) { _this._onDidInstallExtension.fire({ id: id, zipPath: zipPath, error: error }); return winjs_base_1.TPromise.wrapError(error); });
                });
            });
        };
        ExtensionManagementService.prototype.installFromGallery = function (extension, promptToInstallDependencies) {
            var _this = this;
            if (promptToInstallDependencies === void 0) { promptToInstallDependencies = true; }
            var id = extensionManagementUtil_1.getLocalExtensionIdFromGallery(extension, extension.version);
            return this.isObsolete(id).then(function (isObsolete) {
                if (isObsolete) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize('restartCode', "Please restart Code before reinstalling {0}.", extension.displayName || extension.name)));
                }
                _this._onInstallExtension.fire({ id: id, gallery: extension });
                return _this.installCompatibleVersion(extension, true, promptToInstallDependencies)
                    .then(function (local) { return _this._onDidInstallExtension.fire({ id: id, local: local, gallery: extension }); }, function (error) {
                    _this._onDidInstallExtension.fire({ id: id, gallery: extension, error: error });
                    return winjs_base_1.TPromise.wrapError(error);
                });
            });
        };
        ExtensionManagementService.prototype.installCompatibleVersion = function (extension, installDependencies, promptToInstallDependencies) {
            var _this = this;
            return this.galleryService.loadCompatibleVersion(extension)
                .then(function (compatibleVersion) { return _this.getDependenciesToInstall(extension, installDependencies)
                .then(function (dependencies) {
                if (!dependencies.length) {
                    return _this.downloadAndInstall(compatibleVersion);
                }
                if (promptToInstallDependencies) {
                    var message = nls.localize('installDependeciesConfirmation', "Installing '{0}' also installs its dependencies. Would you like to continue?", extension.displayName);
                    var options = [
                        nls.localize('install', "Yes"),
                        nls.localize('doNotInstall', "No")
                    ];
                    return _this.choiceService.choose(message_1.Severity.Info, message, options, 1, true)
                        .then(function (value) {
                        if (value === 0) {
                            return _this.installWithDependencies(compatibleVersion);
                        }
                        return winjs_base_1.TPromise.wrapError(errors.canceled());
                    }, function (error) { return winjs_base_1.TPromise.wrapError(errors.canceled()); });
                }
                else {
                    return _this.installWithDependencies(compatibleVersion);
                }
            }); });
        };
        ExtensionManagementService.prototype.getDependenciesToInstall = function (extension, checkDependecies) {
            if (!checkDependecies) {
                return winjs_base_1.TPromise.wrap([]);
            }
            // Filter out self
            var dependencies = extension.properties.dependencies ? extension.properties.dependencies.filter(function (id) { return id !== extension.id; }) : [];
            if (!dependencies.length) {
                return winjs_base_1.TPromise.wrap([]);
            }
            // Filter out installed dependencies
            return this.getInstalled().then(function (installed) {
                return dependencies.filter(function (dep) { return installed.every(function (i) { return i.manifest.publisher + "." + i.manifest.name !== dep; }); });
            });
        };
        ExtensionManagementService.prototype.installWithDependencies = function (extension) {
            var _this = this;
            return this.galleryService.getAllDependencies(extension)
                .then(function (allDependencies) { return _this.filterDependenciesToInstall(extension, allDependencies); })
                .then(function (toInstall) { return _this.filterObsolete.apply(_this, toInstall.map(function (i) { return extensionManagementUtil_1.getLocalExtensionIdFromGallery(i, i.version); })).then(function (obsolete) {
                if (obsolete.length) {
                    return winjs_base_1.TPromise.wrapError(new Error(nls.localize('restartCode', "Please restart Code before reinstalling {0}.", extension.displayName || extension.name)));
                }
                return _this.bulkInstallWithDependencies(extension, toInstall);
            }); });
        };
        ExtensionManagementService.prototype.bulkInstallWithDependencies = function (extension, dependecies) {
            var _this = this;
            for (var _i = 0, dependecies_1 = dependecies; _i < dependecies_1.length; _i++) {
                var dependency = dependecies_1[_i];
                var id = extensionManagementUtil_1.getLocalExtensionIdFromGallery(dependency, dependency.version);
                this._onInstallExtension.fire({ id: id, gallery: dependency });
            }
            return this.downloadAndInstall(extension)
                .then(function (localExtension) {
                return winjs_base_1.TPromise.join(dependecies.map(function (dep) { return _this.installCompatibleVersion(dep, false, false); }))
                    .then(function (installedLocalExtensions) {
                    for (var _i = 0, installedLocalExtensions_1 = installedLocalExtensions; _i < installedLocalExtensions_1.length; _i++) {
                        var installedLocalExtension = installedLocalExtensions_1[_i];
                        var gallery = _this.getGalleryExtensionForLocalExtension(dependecies, installedLocalExtension);
                        _this._onDidInstallExtension.fire({ id: installedLocalExtension.id, local: installedLocalExtension, gallery: gallery });
                    }
                    return localExtension;
                }, function (error) {
                    return _this.rollback(localExtension, dependecies).then(function () {
                        return winjs_base_1.TPromise.wrapError(Array.isArray(error) ? error[error.length - 1] : error);
                    });
                });
            })
                .then(function (localExtension) { return localExtension; }, function (error) {
                for (var _i = 0, dependecies_2 = dependecies; _i < dependecies_2.length; _i++) {
                    var dependency = dependecies_2[_i];
                    _this._onDidInstallExtension.fire({ id: extensionManagementUtil_1.getLocalExtensionIdFromGallery(dependency, dependency.version), gallery: dependency, error: error });
                }
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.rollback = function (localExtension, dependecies) {
            var _this = this;
            return this.doUninstall(localExtension)
                .then(function () { return _this.filterOutUninstalled(dependecies); })
                .then(function (installed) { return winjs_base_1.TPromise.join(installed.map(function (i) { return _this.doUninstall(i); })); })
                .then(function () { return null; });
        };
        ExtensionManagementService.prototype.filterDependenciesToInstall = function (extension, dependencies) {
            return this.getInstalled()
                .then(function (local) {
                return dependencies.filter(function (d) {
                    if (extension.uuid === d.uuid) {
                        return false;
                    }
                    var extensionId = extensionManagementUtil_1.getLocalExtensionIdFromGallery(d, d.version);
                    return local.every(function (local) { return local.id !== extensionId; });
                });
            });
        };
        ExtensionManagementService.prototype.filterOutUninstalled = function (extensions) {
            var _this = this;
            return this.getInstalled()
                .then(function (installed) { return installed.filter(function (local) { return !!_this.getGalleryExtensionForLocalExtension(extensions, local); }); });
        };
        ExtensionManagementService.prototype.getGalleryExtensionForLocalExtension = function (galleryExtensions, localExtension) {
            var filtered = galleryExtensions.filter(function (galleryExtension) { return extensionManagementUtil_1.getLocalExtensionIdFromGallery(galleryExtension, galleryExtension.version) === localExtension.id; });
            return filtered.length ? filtered[0] : null;
        };
        ExtensionManagementService.prototype.downloadAndInstall = function (extension) {
            var _this = this;
            var id = extensionManagementUtil_1.getLocalExtensionIdFromGallery(extension, extension.version);
            var metadata = {
                id: extension.uuid,
                publisherId: extension.publisherId,
                publisherDisplayName: extension.publisherDisplayName,
            };
            return this.galleryService.download(extension)
                .then(function (zipPath) { return validate(zipPath).then(function () { return zipPath; }); })
                .then(function (zipPath) { return _this.installExtension(zipPath, id, metadata); });
        };
        ExtensionManagementService.prototype.installExtension = function (zipPath, id, metadata) {
            if (metadata === void 0) { metadata = null; }
            var extensionPath = path.join(this.extensionsPath, id);
            return pfs.rimraf(extensionPath).then(function () {
                return zip_1.extract(zipPath, extensionPath, { sourcePath: 'extension', overwrite: true })
                    .then(function () { return readManifest(extensionPath); })
                    .then(function (_a) {
                    var manifest = _a.manifest;
                    return pfs.readdir(extensionPath).then(function (children) {
                        var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                        var readmeUrl = readme ? uri_1.default.file(path.join(extensionPath, readme)).toString() : null;
                        var changelog = children.filter(function (child) { return /^changelog(\.txt|\.md|)$/i.test(child); })[0];
                        var changelogUrl = changelog ? uri_1.default.file(path.join(extensionPath, changelog)).toString() : null;
                        var type = extensionManagement_1.LocalExtensionType.User;
                        var local = { type: type, id: id, manifest: manifest, metadata: metadata, path: extensionPath, readmeUrl: readmeUrl, changelogUrl: changelogUrl };
                        var manifestPath = path.join(extensionPath, 'package.json');
                        return pfs.readFile(manifestPath, 'utf8')
                            .then(function (raw) { return parseManifest(raw); })
                            .then(function (_a) {
                            var manifest = _a.manifest;
                            return objects_1.assign(manifest, { __metadata: metadata });
                        })
                            .then(function (manifest) { return pfs.writeFile(manifestPath, JSON.stringify(manifest, null, '\t')); })
                            .then(function () { return local; });
                    });
                });
            });
        };
        ExtensionManagementService.prototype.uninstall = function (extension, force) {
            var _this = this;
            if (force === void 0) { force = false; }
            return this.removeOutdatedExtensions().then(function () {
                return _this.scanUserExtensions().then(function (installed) {
                    var promises = installed
                        .filter(function (e) { return e.manifest.publisher === extension.manifest.publisher && e.manifest.name === extension.manifest.name; })
                        .map(function (e) { return _this.checkForDependenciesAndUninstall(e, installed, force); });
                    return winjs_base_1.TPromise.join(promises);
                });
            }).then(function () { });
        };
        ExtensionManagementService.prototype.checkForDependenciesAndUninstall = function (extension, installed, force) {
            var _this = this;
            return this.preUninstallExtension(extension)
                .then(function () { return _this.hasDependencies(extension, installed) ? _this.promptForDependenciesAndUninstall(extension, installed, force) : _this.promptAndUninstall(extension, installed, force); })
                .then(function () { return _this.postUninstallExtension(extension); }, function (error) {
                _this.postUninstallExtension(extension, error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.hasDependencies = function (extension, installed) {
            if (extension.manifest.extensionDependencies && extension.manifest.extensionDependencies.length) {
                return installed.some(function (i) { return extension.manifest.extensionDependencies.indexOf(extensionManagementUtil_1.getGalleryExtensionIdFromLocal(i)) !== -1; });
            }
            return false;
        };
        ExtensionManagementService.prototype.promptForDependenciesAndUninstall = function (extension, installed, force) {
            var _this = this;
            if (force) {
                var dependencies = arrays_1.distinct(this.getDependenciesToUninstallRecursively(extension, installed, [])).filter(function (e) { return e !== extension; });
                return this.uninstallWithDependencies(extension, dependencies, installed);
            }
            var message = nls.localize('uninstallDependeciesConfirmation', "Would you like to uninstall '{0}' only or its dependencies also?", extension.manifest.displayName || extension.manifest.name);
            var options = [
                nls.localize('uninstallOnly', "Only"),
                nls.localize('uninstallAll', "All"),
                nls.localize('cancel', "Cancel")
            ];
            return this.choiceService.choose(message_1.Severity.Info, message, options, 2, true)
                .then(function (value) {
                if (value === 0) {
                    return _this.uninstallWithDependencies(extension, [], installed);
                }
                if (value === 1) {
                    var dependencies = arrays_1.distinct(_this.getDependenciesToUninstallRecursively(extension, installed, [])).filter(function (e) { return e !== extension; });
                    return _this.uninstallWithDependencies(extension, dependencies, installed);
                }
                return winjs_base_1.TPromise.wrapError(errors.canceled());
            }, function (error) { return winjs_base_1.TPromise.wrapError(errors.canceled()); });
        };
        ExtensionManagementService.prototype.promptAndUninstall = function (extension, installed, force) {
            var _this = this;
            if (force) {
                return this.uninstallWithDependencies(extension, [], installed);
            }
            var message = nls.localize('uninstallConfirmation', "Are you sure you want to uninstall '{0}'?", extension.manifest.displayName || extension.manifest.name);
            var options = [
                nls.localize('ok', "OK"),
                nls.localize('cancel', "Cancel")
            ];
            return this.choiceService.choose(message_1.Severity.Info, message, options, 1, true)
                .then(function (value) {
                if (value === 0) {
                    return _this.uninstallWithDependencies(extension, [], installed);
                }
                return winjs_base_1.TPromise.wrapError(errors.canceled());
            }, function (error) { return winjs_base_1.TPromise.wrapError(errors.canceled()); });
        };
        ExtensionManagementService.prototype.uninstallWithDependencies = function (extension, dependencies, installed) {
            var _this = this;
            var dependenciesToUninstall = this.filterDependents(extension, dependencies, installed);
            var dependents = this.getDependents(extension, installed).filter(function (dependent) { return extension !== dependent && dependenciesToUninstall.indexOf(dependent) === -1; });
            if (dependents.length) {
                return winjs_base_1.TPromise.wrapError(new Error(this.getDependentsErrorMessage(extension, dependents)));
            }
            return winjs_base_1.TPromise.join([this.uninstallExtension(extension.id)].concat(dependenciesToUninstall.map(function (d) { return _this.doUninstall(d); }))).then(function () { return null; });
        };
        ExtensionManagementService.prototype.getDependentsErrorMessage = function (extension, dependents) {
            if (dependents.length === 1) {
                return nls.localize('singleDependentError', "Cannot uninstall extension '{0}'. Extension '{1}' depends on this.", extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name);
            }
            if (dependents.length === 2) {
                return nls.localize('twoDependentsError', "Cannot uninstall extension '{0}'. Extensions '{1}' and '{2}' depend on this.", extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
            }
            return nls.localize('multipleDependentsError', "Cannot uninstall extension '{0}'. Extensions '{1}', '{2}' and others depend on this.", extension.manifest.displayName || extension.manifest.name, dependents[0].manifest.displayName || dependents[0].manifest.name, dependents[1].manifest.displayName || dependents[1].manifest.name);
        };
        ExtensionManagementService.prototype.getDependenciesToUninstallRecursively = function (extension, installed, checked) {
            if (checked.indexOf(extension) !== -1) {
                return [];
            }
            checked.push(extension);
            if (!extension.manifest.extensionDependencies || extension.manifest.extensionDependencies.length === 0) {
                return [];
            }
            var dependenciesToUninstall = installed.filter(function (i) { return extension.manifest.extensionDependencies.indexOf(extensionManagementUtil_1.getGalleryExtensionIdFromLocal(i)) !== -1; });
            var depsOfDeps = [];
            for (var _i = 0, dependenciesToUninstall_1 = dependenciesToUninstall; _i < dependenciesToUninstall_1.length; _i++) {
                var dep = dependenciesToUninstall_1[_i];
                depsOfDeps.push.apply(depsOfDeps, this.getDependenciesToUninstallRecursively(dep, installed, checked));
            }
            return dependenciesToUninstall.concat(depsOfDeps);
        };
        ExtensionManagementService.prototype.filterDependents = function (extension, dependencies, installed) {
            installed = installed.filter(function (i) { return i !== extension && i.manifest.extensionDependencies && i.manifest.extensionDependencies.length > 0; });
            var result = dependencies.slice(0);
            for (var i = 0; i < dependencies.length; i++) {
                var dep = dependencies[i];
                var dependents = this.getDependents(dep, installed).filter(function (e) { return dependencies.indexOf(e) === -1; });
                if (dependents.length) {
                    result.splice(i - (dependencies.length - result.length), 1);
                }
            }
            return result;
        };
        ExtensionManagementService.prototype.getDependents = function (extension, installed) {
            return installed.filter(function (e) { return e.manifest.extensionDependencies && e.manifest.extensionDependencies.indexOf(extensionManagementUtil_1.getGalleryExtensionIdFromLocal(extension)) !== -1; });
        };
        ExtensionManagementService.prototype.doUninstall = function (extension) {
            var _this = this;
            return this.preUninstallExtension(extension)
                .then(function () { return _this.uninstallExtension(extension.id); })
                .then(function () { return _this.postUninstallExtension(extension); }, function (error) {
                _this.postUninstallExtension(extension, error);
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        ExtensionManagementService.prototype.preUninstallExtension = function (extension) {
            var _this = this;
            var extensionPath = path.join(this.extensionsPath, extension.id);
            return pfs.exists(extensionPath)
                .then(function (exists) { return exists ? null : winjs_base_1.TPromise.wrapError(new Error(nls.localize('notExists', "Could not find extension"))); })
                .then(function () { return _this._onUninstallExtension.fire(extension.id); });
        };
        ExtensionManagementService.prototype.uninstallExtension = function (id) {
            var _this = this;
            var extensionPath = path.join(this.extensionsPath, id);
            return this.setObsolete(id)
                .then(function () { return pfs.rimraf(extensionPath); })
                .then(function () { return _this.unsetObsolete(id); });
        };
        ExtensionManagementService.prototype.postUninstallExtension = function (extension, error) {
            return __awaiter(this, void 0, winjs_base_1.TPromise, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!error) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.galleryService.reportStatistic(extension.manifest.publisher, extension.manifest.name, extension.manifest.version, extensionManagement_1.StatisticType.Uninstall)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this._onDidUninstallExtension.fire({ id: extension.id, error: error });
                            return [2 /*return*/];
                    }
                });
            });
        };
        ExtensionManagementService.prototype.getInstalled = function (type) {
            if (type === void 0) { type = null; }
            var promises = [];
            if (type === null || type === extensionManagement_1.LocalExtensionType.System) {
                promises.push(this.scanSystemExtensions());
            }
            if (type === null || type === extensionManagement_1.LocalExtensionType.User) {
                promises.push(this.scanUserExtensions());
            }
            return winjs_base_1.TPromise.join(promises).then(arrays_1.flatten);
        };
        ExtensionManagementService.prototype.scanSystemExtensions = function () {
            return this.scanExtensions(SystemExtensionsRoot, extensionManagement_1.LocalExtensionType.System);
        };
        ExtensionManagementService.prototype.scanUserExtensions = function () {
            return this.scanExtensions(this.extensionsPath, extensionManagement_1.LocalExtensionType.User).then(function (extensions) {
                var byId = collections_1.values(collections_1.groupBy(extensions, function (p) { return extensionManagementUtil_1.getGalleryExtensionIdFromLocal(p); }));
                return byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.manifest.version, b.manifest.version); })[0]; });
            });
        };
        ExtensionManagementService.prototype.scanExtensions = function (root, type) {
            var limiter = new async_1.Limiter(10);
            return this.scanExtensionFolders(root)
                .then(function (extensionIds) { return winjs_base_1.TPromise.join(extensionIds.map(function (id) {
                var extensionPath = path.join(root, id);
                var each = function () { return pfs.readdir(extensionPath).then(function (children) {
                    var readme = children.filter(function (child) { return /^readme(\.txt|\.md|)$/i.test(child); })[0];
                    var readmeUrl = readme ? uri_1.default.file(path.join(extensionPath, readme)).toString() : null;
                    var changelog = children.filter(function (child) { return /^changelog(\.txt|\.md|)$/i.test(child); })[0];
                    var changelogUrl = changelog ? uri_1.default.file(path.join(extensionPath, changelog)).toString() : null;
                    return readManifest(extensionPath)
                        .then(function (_a) {
                        var manifest = _a.manifest, metadata = _a.metadata;
                        if (manifest.extensionDependencies) {
                            manifest.extensionDependencies = manifest.extensionDependencies.map(function (id) { return extensionManagementUtil_1.adoptToGalleryExtensionId(id); });
                        }
                        return { type: type, id: id, manifest: manifest, metadata: metadata, path: extensionPath, readmeUrl: readmeUrl, changelogUrl: changelogUrl };
                    });
                }).then(null, function () { return null; }); };
                return limiter.queue(each);
            })); })
                .then(function (result) { return result.filter(function (a) { return !!a; }); });
        };
        ExtensionManagementService.prototype.scanExtensionFolders = function (root) {
            return this.getObsoleteExtensions()
                .then(function (obsolete) { return pfs.readdir(root).then(function (extensions) { return extensions.filter(function (id) { return !obsolete[id]; }); }); });
        };
        ExtensionManagementService.prototype.removeDeprecatedExtensions = function () {
            return winjs_base_1.TPromise.join([
                this.removeOutdatedExtensions(),
                this.removeObsoleteExtensions()
            ]);
        };
        ExtensionManagementService.prototype.removeOutdatedExtensions = function () {
            var _this = this;
            return this.getOutdatedExtensionIds()
                .then(function (extensionIds) { return _this.removeExtensions(extensionIds); });
        };
        ExtensionManagementService.prototype.removeObsoleteExtensions = function () {
            var _this = this;
            return this.getObsoleteExtensions()
                .then(function (obsolete) { return Object.keys(obsolete); })
                .then(function (extensionIds) { return _this.removeExtensions(extensionIds); });
        };
        ExtensionManagementService.prototype.removeExtensions = function (extensionsIds) {
            var _this = this;
            return winjs_base_1.TPromise.join(extensionsIds.map(function (id) {
                return pfs.rimraf(path.join(_this.extensionsPath, id))
                    .then(function () { return _this.withObsoleteExtensions(function (obsolete) { return delete obsolete[id]; }); });
            }));
        };
        ExtensionManagementService.prototype.getOutdatedExtensionIds = function () {
            return this.scanExtensionFolders(this.extensionsPath)
                .then(function (folders) {
                var galleryFolders = folders
                    .map(function (folder) { return (objects_1.assign({ folder: folder }, extensionManagementUtil_1.getIdAndVersionFromLocalExtensionId(folder))); })
                    .filter(function (_a) {
                    var id = _a.id, version = _a.version;
                    return !!id && !!version;
                });
                var byId = collections_1.values(collections_1.groupBy(galleryFolders, function (p) { return p.id; }));
                return arrays_1.flatten(byId.map(function (p) { return p.sort(function (a, b) { return semver.rcompare(a.version, b.version); }).slice(1); }))
                    .map(function (a) { return a.folder; });
            });
        };
        ExtensionManagementService.prototype.isObsolete = function (id) {
            return this.filterObsolete(id).then(function (obsolete) { return obsolete.length === 1; });
        };
        ExtensionManagementService.prototype.filterObsolete = function () {
            var ids = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ids[_i] = arguments[_i];
            }
            return this.withObsoleteExtensions(function (allObsolete) {
                var obsolete = [];
                for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                    var id = ids_1[_i];
                    if (!!allObsolete[id]) {
                        obsolete.push(id);
                    }
                }
                return obsolete;
            });
        };
        ExtensionManagementService.prototype.setObsolete = function (id) {
            return this.withObsoleteExtensions(function (obsolete) {
                return objects_1.assign(obsolete, (_a = {}, _a[id] = true, _a));
                var _a;
            });
        };
        ExtensionManagementService.prototype.unsetObsolete = function (id) {
            return this.withObsoleteExtensions(function (obsolete) { return delete obsolete[id]; });
        };
        ExtensionManagementService.prototype.getObsoleteExtensions = function () {
            return this.withObsoleteExtensions(function (obsolete) { return obsolete; });
        };
        ExtensionManagementService.prototype.withObsoleteExtensions = function (fn) {
            var _this = this;
            return this.obsoleteFileLimiter.queue(function () {
                var result = null;
                return pfs.readFile(_this.obsoletePath, 'utf8')
                    .then(null, function (err) { return err.code === 'ENOENT' ? winjs_base_1.TPromise.as('{}') : winjs_base_1.TPromise.wrapError(err); })
                    .then(function (raw) { try {
                    return JSON.parse(raw);
                }
                catch (e) {
                    return {};
                } })
                    .then(function (obsolete) { result = fn(obsolete); return obsolete; })
                    .then(function (obsolete) {
                    if (Object.keys(obsolete).length === 0) {
                        return pfs.rimraf(_this.obsoletePath);
                    }
                    else {
                        var raw = JSON.stringify(obsolete);
                        return pfs.writeFile(_this.obsoletePath, raw);
                    }
                })
                    .then(function () { return result; });
            });
        };
        ExtensionManagementService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ExtensionManagementService = __decorate([
            __param(0, environment_1.IEnvironmentService),
            __param(1, message_1.IChoiceService),
            __param(2, extensionManagement_1.IExtensionGalleryService)
        ], ExtensionManagementService);
        return ExtensionManagementService;
    }());
    exports.ExtensionManagementService = ExtensionManagementService;
});
//# sourceMappingURL=extensionManagementService.js.map