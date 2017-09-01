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
define(["require", "exports", "crypto", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/common/uri", "vs/platform/files/common/files", "vs/platform/telemetry/common/telemetry", "vs/platform/workspace/common/workspace", "vs/platform/environment/common/environment"], function (require, exports, crypto, winjs_base_1, errors_1, uri_1, files_1, telemetry_1, workspace_1, environment_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SshProtocolMatcher = /^([^@:]+@)?([^:]+):/;
    var SshUrlMatcher = /^([^@:]+@)?([^:]+):(.+)$/;
    var AuthorityMatcher = /^([^@]+@)?([^:]+)(:\d+)?$/;
    var SecondLevelDomainMatcher = /([^@:.]+\.[^@:.]+)(:\d+)?$/;
    var RemoteMatcher = /^\s*url\s*=\s*(.+\S)\s*$/mg;
    var AnyButDot = /[^.]/g;
    var SecondLevelDomainWhitelist = [
        'github.com',
        'bitbucket.org',
        'visualstudio.com',
        'gitlab.com',
        'heroku.com',
        'azurewebsites.net',
        'ibm.com',
        'amazon.com',
        'amazonaws.com',
        'cloudapp.net',
        'rhcloud.com',
        'google.com'
    ];
    function stripLowLevelDomains(domain) {
        var match = domain.match(SecondLevelDomainMatcher);
        return match ? match[1] : null;
    }
    function extractDomain(url) {
        if (url.indexOf('://') === -1) {
            var match = url.match(SshProtocolMatcher);
            if (match) {
                return stripLowLevelDomains(match[2]);
            }
        }
        try {
            var uri = uri_1.default.parse(url);
            if (uri.authority) {
                return stripLowLevelDomains(uri.authority);
            }
        }
        catch (e) {
            // ignore invalid URIs
        }
        return null;
    }
    function getDomainsOfRemotes(text, whitelist) {
        var domains = new Set();
        var match;
        while (match = RemoteMatcher.exec(text)) {
            var domain = extractDomain(match[1]);
            if (domain) {
                domains.add(domain);
            }
        }
        var whitemap = whitelist.reduce(function (map, key) {
            map[key] = true;
            return map;
        }, Object.create(null));
        var elements = [];
        domains.forEach(function (e) { return elements.push(e); });
        return elements
            .map(function (key) { return whitemap[key] ? key : key.replace(AnyButDot, 'a'); });
    }
    exports.getDomainsOfRemotes = getDomainsOfRemotes;
    function stripPort(authority) {
        var match = authority.match(AuthorityMatcher);
        return match ? match[2] : null;
    }
    function normalizeRemote(host, path) {
        if (host && path) {
            return (path.indexOf('/') === 0) ? "" + host + path : host + "/" + path;
        }
        return null;
    }
    function extractRemote(url) {
        if (url.indexOf('://') === -1) {
            var match = url.match(SshUrlMatcher);
            if (match) {
                return normalizeRemote(match[2], match[3]);
            }
        }
        try {
            var uri = uri_1.default.parse(url);
            if (uri.authority) {
                return normalizeRemote(stripPort(uri.authority), uri.path);
            }
        }
        catch (e) {
            // ignore invalid URIs
        }
        return null;
    }
    function getRemotes(text) {
        var remotes = [];
        var match;
        while (match = RemoteMatcher.exec(text)) {
            var remote = extractRemote(match[1]);
            if (remote) {
                remotes.push(remote);
            }
        }
        return remotes;
    }
    exports.getRemotes = getRemotes;
    function getHashedRemotes(text) {
        return getRemotes(text).map(function (r) {
            return crypto.createHash('sha1').update(r).digest('hex');
        });
    }
    exports.getHashedRemotes = getHashedRemotes;
    var WorkspaceStats = (function () {
        function WorkspaceStats(fileService, contextService, telemetryService, environmentService) {
            this.fileService = fileService;
            this.contextService = contextService;
            this.telemetryService = telemetryService;
            this.environmentService = environmentService;
        }
        WorkspaceStats.prototype.searchArray = function (arr, regEx) {
            return arr.some(function (v) { return v.search(regEx) > -1; }) || undefined;
        };
        WorkspaceStats.prototype.getWorkspaceTags = function (configuration) {
            var _this = this;
            var tags = Object.create(null);
            var filesToOpen = configuration.filesToOpen, filesToCreate = configuration.filesToCreate, filesToDiff = configuration.filesToDiff;
            tags['workbench.filesToOpen'] = filesToOpen && filesToOpen.length || undefined;
            tags['workbench.filesToCreate'] = filesToCreate && filesToCreate.length || undefined;
            tags['workbench.filesToDiff'] = filesToDiff && filesToDiff.length || undefined;
            var workspace = this.contextService.getWorkspace();
            tags['workspace.roots'] = workspace ? workspace.roots.length : 0;
            tags['workspace.empty'] = !workspace;
            var folders = workspace ? workspace.roots : this.environmentService.appQuality !== 'stable' && this.findFolders(configuration);
            if (folders && folders.length && this.fileService) {
                return this.fileService.resolveFiles(folders.map(function (resource) { return ({ resource: resource }); })).then(function (results) {
                    var names = (_a = []).concat.apply(_a, results.map(function (result) { return result.success ? (result.stat.children || []) : []; })).map(function (c) { return c.name; });
                    tags['workspace.grunt'] = _this.searchArray(names, /^gruntfile\.js$/i);
                    tags['workspace.gulp'] = _this.searchArray(names, /^gulpfile\.js$/i);
                    tags['workspace.jake'] = _this.searchArray(names, /^jakefile\.js$/i);
                    tags['workspace.tsconfig'] = _this.searchArray(names, /^tsconfig\.json$/i);
                    tags['workspace.jsconfig'] = _this.searchArray(names, /^jsconfig\.json$/i);
                    tags['workspace.config.xml'] = _this.searchArray(names, /^config\.xml/i);
                    tags['workspace.vsc.extension'] = _this.searchArray(names, /^vsc-extension-quickstart\.md/i);
                    tags['workspace.ASP5'] = _this.searchArray(names, /^project\.json$/i) && _this.searchArray(names, /^.+\.cs$/i);
                    tags['workspace.sln'] = _this.searchArray(names, /^.+\.sln$|^.+\.csproj$/i);
                    tags['workspace.unity'] = _this.searchArray(names, /^Assets$/i) && _this.searchArray(names, /^Library$/i) && _this.searchArray(names, /^ProjectSettings/i);
                    tags['workspace.npm'] = _this.searchArray(names, /^package\.json$|^node_modules$/i);
                    tags['workspace.bower'] = _this.searchArray(names, /^bower\.json$|^bower_components$/i);
                    tags['workspace.yeoman.code.ext'] = _this.searchArray(names, /^vsc-extension-quickstart\.md$/i);
                    var mainActivity = _this.searchArray(names, /^MainActivity\.cs$/i) || _this.searchArray(names, /^MainActivity\.fs$/i);
                    var appDelegate = _this.searchArray(names, /^AppDelegate\.cs$/i) || _this.searchArray(names, /^AppDelegate\.fs$/i);
                    var androidManifest = _this.searchArray(names, /^AndroidManifest\.xml$/i);
                    var platforms = _this.searchArray(names, /^platforms$/i);
                    var plugins = _this.searchArray(names, /^plugins$/i);
                    var www = _this.searchArray(names, /^www$/i);
                    var properties = _this.searchArray(names, /^Properties/i);
                    var resources = _this.searchArray(names, /^Resources/i);
                    var jni = _this.searchArray(names, /^JNI/i);
                    if (tags['workspace.config.xml'] &&
                        !tags['workspace.language.cs'] && !tags['workspace.language.vb'] && !tags['workspace.language.aspx']) {
                        if (platforms && plugins && www) {
                            tags['workspace.cordova.high'] = true;
                        }
                        else {
                            tags['workspace.cordova.low'] = true;
                        }
                    }
                    if (mainActivity && properties && resources) {
                        tags['workspace.xamarin.android'] = true;
                    }
                    if (appDelegate && resources) {
                        tags['workspace.xamarin.ios'] = true;
                    }
                    if (androidManifest && jni) {
                        tags['workspace.android.cpp'] = true;
                    }
                    tags['workspace.reactNative'] = _this.searchArray(names, /^android$/i) && _this.searchArray(names, /^ios$/i) &&
                        _this.searchArray(names, /^index\.android\.js$/i) && _this.searchArray(names, /^index\.ios\.js$/i);
                    return tags;
                    var _a;
                }, function (error) { errors_1.onUnexpectedError(error); return null; });
            }
            else {
                return winjs_base_1.TPromise.as(tags);
            }
        };
        WorkspaceStats.prototype.findFolders = function (configuration) {
            var folder = this.findFolder(configuration);
            return folder && [folder];
        };
        WorkspaceStats.prototype.findFolder = function (_a) {
            var filesToOpen = _a.filesToOpen, filesToCreate = _a.filesToCreate, filesToDiff = _a.filesToDiff;
            if (filesToOpen && filesToOpen.length) {
                return this.parentURI(uri_1.default.file(filesToOpen[0].filePath));
            }
            else if (filesToCreate && filesToCreate.length) {
                return this.parentURI(uri_1.default.file(filesToCreate[0].filePath));
            }
            else if (filesToDiff && filesToDiff.length) {
                return this.parentURI(uri_1.default.file(filesToDiff[0].filePath));
            }
            return undefined;
        };
        WorkspaceStats.prototype.parentURI = function (uri) {
            var path = uri.path;
            var i = path.lastIndexOf('/');
            return i !== -1 ? uri.with({ path: path.substr(0, i) }) : undefined;
        };
        WorkspaceStats.prototype.reportWorkspaceTags = function (configuration) {
            var _this = this;
            this.getWorkspaceTags(configuration).then(function (tags) {
                _this.telemetryService.publicLog('workspce.tags', tags);
            }, function (error) { return errors_1.onUnexpectedError(error); });
        };
        WorkspaceStats.prototype.reportRemoteDomains = function (workspaceUris) {
            var _this = this;
            winjs_base_1.TPromise.join(workspaceUris.map(function (workspaceUri) {
                var path = workspaceUri.path;
                var uri = workspaceUri.with({ path: (path !== '/' ? path : '') + "/.git/config" });
                return _this.fileService.resolveContent(uri, { acceptTextOnly: true }).then(function (content) { return getDomainsOfRemotes(content.value, SecondLevelDomainWhitelist); }, function (err) { return []; } // ignore missing or binary file
                );
            })).then(function (domains) {
                var set = domains.reduce(function (set, list) { return list.reduce(function (set, item) { return set.add(item); }, set); }, new Set());
                var list = [];
                set.forEach(function (item) { return list.push(item); });
                _this.telemetryService.publicLog('workspace.remotes', { domains: list.sort() });
            }, errors_1.onUnexpectedError);
        };
        WorkspaceStats.prototype.reportRemotes = function (workspaceUris) {
            var _this = this;
            winjs_base_1.TPromise.join(workspaceUris.map(function (workspaceUri) {
                var path = workspaceUri.path;
                var uri = workspaceUri.with({ path: (path !== '/' ? path : '') + "/.git/config" });
                return _this.fileService.resolveContent(uri, { acceptTextOnly: true }).then(function (content) { return getHashedRemotes(content.value); }, function (err) { return []; } // ignore missing or binary file
                );
            })).then(function (hashedRemotes) { return _this.telemetryService.publicLog('workspace.hashedRemotes', { remotes: hashedRemotes }); }, errors_1.onUnexpectedError);
        };
        WorkspaceStats.prototype.reportAzureNode = function (workspaceUris, tags) {
            var _this = this;
            // TODO: should also work for `node_modules` folders several levels down
            var uris = workspaceUris.map(function (workspaceUri) {
                var path = workspaceUri.path;
                return workspaceUri.with({ path: (path !== '/' ? path : '') + "/node_modules" });
            });
            return this.fileService.resolveFiles(uris.map(function (resource) { return ({ resource: resource }); })).then(function (results) {
                var names = (_a = []).concat.apply(_a, results.map(function (result) { return result.success ? (result.stat.children || []) : []; })).map(function (c) { return c.name; });
                var referencesAzure = _this.searchArray(names, /azure/i);
                if (referencesAzure) {
                    tags['node'] = true;
                }
                return tags;
                var _a;
            }, function (err) {
                return tags;
            });
        };
        WorkspaceStats.prototype.reportAzureJava = function (workspaceUris, tags) {
            var _this = this;
            return winjs_base_1.TPromise.join(workspaceUris.map(function (workspaceUri) {
                var path = workspaceUri.path;
                var uri = workspaceUri.with({ path: (path !== '/' ? path : '') + "/pom.xml" });
                return _this.fileService.resolveContent(uri, { acceptTextOnly: true }).then(function (content) { return !!content.value.match(/azure/i); }, function (err) { return false; });
            })).then(function (javas) {
                if (javas.indexOf(true) !== -1) {
                    tags['java'] = true;
                }
                return tags;
            });
        };
        WorkspaceStats.prototype.reportAzure = function (uris) {
            var _this = this;
            var tags = Object.create(null);
            this.reportAzureNode(uris, tags).then(function (tags) {
                return _this.reportAzureJava(uris, tags);
            }).then(function (tags) {
                if (Object.keys(tags).length) {
                    _this.telemetryService.publicLog('workspace.azure', tags);
                }
            }).then(null, errors_1.onUnexpectedError);
        };
        WorkspaceStats.prototype.reportCloudStats = function () {
            var workspace = this.contextService.getWorkspace();
            var uris = workspace && workspace.roots;
            if (uris && uris.length && this.fileService) {
                this.reportRemoteDomains(uris);
                this.reportRemotes(uris);
                this.reportAzure(uris);
            }
        };
        ;
        WorkspaceStats = __decorate([
            __param(0, files_1.IFileService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, telemetry_1.ITelemetryService),
            __param(3, environment_1.IEnvironmentService)
        ], WorkspaceStats);
        return WorkspaceStats;
    }());
    exports.WorkspaceStats = WorkspaceStats;
});
//# sourceMappingURL=workspaceStats.js.map