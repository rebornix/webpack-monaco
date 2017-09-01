var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/json", "path", "vs/base/node/pfs", "vs/platform/extensions/common/extensionsRegistry", "vs/workbench/parts/snippets/electron-browser/snippetsService", "vs/editor/common/services/modeService", "vs/workbench/services/mode/common/workbenchModeService", "vs/editor/contrib/snippet/browser/snippetParser", "vs/editor/contrib/snippet/browser/snippetVariables"], function (require, exports, nls, json_1, path_1, pfs_1, extensionsRegistry_1, snippetsService_1, modeService_1, workbenchModeService_1, snippetParser_1, snippetVariables_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var snippetsExtensionPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('snippets', [workbenchModeService_1.languagesExtPoint], {
        description: nls.localize('vscode.extension.contributes.snippets', 'Contributes snippets.'),
        type: 'array',
        defaultSnippets: [{ body: [{ language: '', path: '' }] }],
        items: {
            type: 'object',
            defaultSnippets: [{ body: { language: '${1:id}', path: './snippets/${2:id}.json.' } }],
            properties: {
                language: {
                    description: nls.localize('vscode.extension.contributes.snippets-language', 'Language identifier for which this snippet is contributed to.'),
                    type: 'string'
                },
                path: {
                    description: nls.localize('vscode.extension.contributes.snippets-path', 'Path of the snippets file. The path is relative to the extension folder and typically starts with \'./snippets/\'.'),
                    type: 'string'
                }
            }
        }
    });
    var MainProcessTextMateSnippet = (function () {
        function MainProcessTextMateSnippet(_modeService, _snippetService) {
            var _this = this;
            this._modeService = _modeService;
            this._snippetService = _snippetService;
            snippetsExtensionPoint.setHandler(function (extensions) {
                for (var i = 0; i < extensions.length; i++) {
                    var tmSnippets = extensions[i].value;
                    for (var j = 0; j < tmSnippets.length; j++) {
                        _this._withSnippetContribution(extensions[i].description.name, extensions[i].description.extensionFolderPath, tmSnippets[j], extensions[i].collector);
                    }
                }
            });
        }
        MainProcessTextMateSnippet.prototype.getId = function () {
            return 'tmSnippetExtension';
        };
        MainProcessTextMateSnippet.prototype._withSnippetContribution = function (extensionName, extensionFolderPath, snippet, collector) {
            if (!snippet.language || (typeof snippet.language !== 'string') || !this._modeService.isRegisteredMode(snippet.language)) {
                collector.error(nls.localize('invalid.language', "Unknown language in `contributes.{0}.language`. Provided value: {1}", snippetsExtensionPoint.name, String(snippet.language)));
                return;
            }
            if (!snippet.path || (typeof snippet.path !== 'string')) {
                collector.error(nls.localize('invalid.path.0', "Expected string in `contributes.{0}.path`. Provided value: {1}", snippetsExtensionPoint.name, String(snippet.path)));
                return;
            }
            var normalizedAbsolutePath = path_1.join(extensionFolderPath, snippet.path);
            if (normalizedAbsolutePath.indexOf(extensionFolderPath) !== 0) {
                collector.warn(nls.localize('invalid.path.1', "Expected `contributes.{0}.path` ({1}) to be included inside extension's folder ({2}). This might make the extension non-portable.", snippetsExtensionPoint.name, normalizedAbsolutePath, extensionFolderPath));
            }
            var modeId = snippet.language;
            var languageIdentifier = this._modeService.getLanguageIdentifier(modeId);
            if (languageIdentifier) {
                readAndRegisterSnippets(this._snippetService, languageIdentifier, normalizedAbsolutePath, extensionName, collector);
            }
        };
        MainProcessTextMateSnippet = __decorate([
            __param(0, modeService_1.IModeService),
            __param(1, snippetsService_1.ISnippetsService)
        ], MainProcessTextMateSnippet);
        return MainProcessTextMateSnippet;
    }());
    exports.MainProcessTextMateSnippet = MainProcessTextMateSnippet;
    function readAndRegisterSnippets(snippetService, languageIdentifier, filePath, extensionName, collector) {
        return pfs_1.readFile(filePath).then(function (fileContents) {
            var snippets = parseSnippetFile(fileContents.toString(), extensionName, collector);
            snippetService.registerSnippets(languageIdentifier.id, snippets, filePath);
        }, function (err) {
            if (err && err.code === 'ENOENT') {
                snippetService.registerSnippets(languageIdentifier.id, [], filePath);
            }
            else {
                throw err;
            }
        });
    }
    exports.readAndRegisterSnippets = readAndRegisterSnippets;
    function parseSnippetFile(snippetFileContent, extensionName, collector) {
        var snippetsObj = json_1.parse(snippetFileContent);
        if (!snippetsObj || typeof snippetsObj !== 'object') {
            return [];
        }
        var topLevelProperties = Object.keys(snippetsObj);
        var result = [];
        var processSnippet = function (snippet, name) {
            var prefix = snippet['prefix'];
            var body = snippet['body'];
            if (Array.isArray(body)) {
                body = body.join('\n');
            }
            if (typeof prefix !== 'string' || typeof body !== 'string') {
                return;
            }
            snippet = {
                name: name,
                extensionName: extensionName,
                prefix: prefix,
                description: snippet['description'] || name,
                codeSnippet: body
            };
            var didRewrite = _rewriteBogousVariables(snippet);
            if (didRewrite && collector) {
                collector.warn(nls.localize('badVariableUse', "The \"{0}\"-snippet very likely confuses snippet-variables and snippet-placeholders. See https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax for more details.", name));
            }
            result.push(snippet);
        };
        topLevelProperties.forEach(function (topLevelProperty) {
            var scopeOrTemplate = snippetsObj[topLevelProperty];
            if (scopeOrTemplate['body'] && scopeOrTemplate['prefix']) {
                processSnippet(scopeOrTemplate, topLevelProperty);
            }
            else {
                var snippetNames = Object.keys(scopeOrTemplate);
                snippetNames.forEach(function (name) {
                    processSnippet(scopeOrTemplate[name], name);
                });
            }
        });
        return result;
    }
    function _rewriteBogousVariables(snippet) {
        var textmateSnippet = new snippetParser_1.SnippetParser().parse(snippet.codeSnippet, false);
        var placeholders = new Map();
        var placeholderMax = 0;
        for (var _i = 0, _a = textmateSnippet.placeholders; _i < _a.length; _i++) {
            var placeholder = _a[_i];
            placeholderMax = Math.max(placeholderMax, placeholder.index);
        }
        var didChange = false;
        var stack = textmateSnippet.children.slice();
        while (stack.length > 0) {
            var marker = stack.shift();
            if (marker instanceof snippetParser_1.Variable
                && marker.children.length === 0
                && !snippetVariables_1.EditorSnippetVariableResolver.VariableNames[marker.name]) {
                // a 'variable' without a default value and not being one of our supported
                // variables is automatically turing into a placeholder. This is to restore
                // a bug we had before. So `${foo}` becomes `${N:foo}`
                var index = placeholders.has(marker.name) ? placeholders.get(marker.name) : ++placeholderMax;
                placeholders.set(marker.name, index);
                var synthetic = new snippetParser_1.Placeholder(index).appendChild(new snippetParser_1.Text(marker.name));
                textmateSnippet.replace(marker, [synthetic]);
                didChange = true;
            }
            else {
                // recurse
                stack.push.apply(stack, marker.children);
            }
        }
        snippet.codeSnippet = textmateSnippet.toTextmateString();
        return didChange;
    }
    exports._rewriteBogousVariables = _rewriteBogousVariables;
});
//# sourceMappingURL=TMSnippets.js.map