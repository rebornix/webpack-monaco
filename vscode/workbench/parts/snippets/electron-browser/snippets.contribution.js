define(["require", "exports", "vs/platform/commands/common/commands", "vs/base/node/pfs", "vs/platform/environment/common/environment", "vs/editor/common/services/modeService", "vs/platform/quickOpen/common/quickOpen", "vs/platform/windows/common/windows", "path", "vs/platform/actions/common/actions", "vs/platform/registry/common/platform", "vs/base/common/errors", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/nls", "./snippetsTracker", "./TMSnippets", "vs/base/common/winjs.base", "vs/workbench/common/contributions", "vs/workbench/parts/snippets/electron-browser/snippetsService", "vs/workbench/parts/snippets/electron-browser/insertSnippet", "vs/workbench/parts/snippets/electron-browser/tabCompletion"], function (require, exports, commands_1, pfs_1, environment_1, modeService_1, quickOpen_1, windows_1, path_1, actions_1, platform_1, errors, JSONContributionRegistry, nls, snippetsTracker, tmSnippets, winjs, workbenchContributions) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OpenSnippetsAction;
    (function (OpenSnippetsAction) {
        var id = 'workbench.action.openSnippets';
        commands_1.CommandsRegistry.registerCommand(id, function (accessor) {
            var modeService = accessor.get(modeService_1.IModeService);
            var quickOpenService = accessor.get(quickOpen_1.IQuickOpenService);
            var environmentService = accessor.get(environment_1.IEnvironmentService);
            var windowsService = accessor.get(windows_1.IWindowsService);
            function openFile(filePath) {
                return windowsService.openWindow([filePath], { forceReuseWindow: true });
            }
            var modeIds = modeService.getRegisteredModes();
            var picks = [];
            modeIds.forEach(function (modeId) {
                var name = modeService.getLanguageName(modeId);
                if (name) {
                    picks.push({ label: name, id: modeId });
                }
            });
            picks = picks.sort(function (e1, e2) {
                return e1.label.localeCompare(e2.label);
            });
            return quickOpenService.pick(picks, { placeHolder: nls.localize('openSnippet.pickLanguage', "Select Language for Snippet") }).then(function (language) {
                if (language) {
                    var snippetPath = path_1.join(environmentService.appSettingsHome, 'snippets', language.id + '.json');
                    return pfs_1.fileExists(snippetPath).then(function (success) {
                        if (success) {
                            return openFile(snippetPath);
                        }
                        var defaultContent = [
                            '{',
                            '/*',
                            '\t// Place your snippets for ' + language.label + ' here. Each snippet is defined under a snippet name and has a prefix, body and ',
                            '\t// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:',
                            '\t// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the ',
                            '\t// same ids are connected.',
                            '\t// Example:',
                            '\t"Print to console": {',
                            '\t\t"prefix": "log",',
                            '\t\t"body": [',
                            '\t\t\t"console.log(\'$1\');",',
                            '\t\t\t"$2"',
                            '\t\t],',
                            '\t\t"description": "Log output to console"',
                            '\t}',
                            '*/',
                            '}'
                        ].join('\n');
                        return pfs_1.writeFile(snippetPath, defaultContent).then(function () {
                            return openFile(snippetPath);
                        }, function (err) {
                            errors.onUnexpectedError(nls.localize('openSnippet.errorOnCreate', 'Unable to create {0}', snippetPath));
                        });
                    });
                }
                return winjs.TPromise.as(null);
            });
        });
        actions_1.MenuRegistry.appendMenuItem(actions_1.MenuId.CommandPalette, {
            command: {
                id: id,
                title: { value: nls.localize('openSnippet.label', "Open User Snippets"), original: 'Preferences: Open User Snippets' },
                category: nls.localize('preferences', "Preferences")
            }
        });
    })(OpenSnippetsAction || (OpenSnippetsAction = {}));
    var schemaId = 'vscode://schemas/snippets';
    var schema = {
        'id': schemaId,
        'defaultSnippets': [{
                'label': nls.localize('snippetSchema.json.default', "Empty snippet"),
                'body': { '${1:snippetName}': { 'prefix': '${2:prefix}', 'body': '${3:snippet}', 'description': '${4:description}' } }
            }],
        'type': 'object',
        'description': nls.localize('snippetSchema.json', 'User snippet configuration'),
        'additionalProperties': {
            'type': 'object',
            'required': ['prefix', 'body'],
            'properties': {
                'prefix': {
                    'description': nls.localize('snippetSchema.json.prefix', 'The prefix to used when selecting the snippet in intellisense'),
                    'type': 'string'
                },
                'body': {
                    'description': nls.localize('snippetSchema.json.body', 'The snippet content. Use \'$1\', \'${1:defaultText}\' to define cursor positions, use \'$0\' for the final cursor position. Insert variable values with \'${varName}\' and \'${varName:defaultText}\', e.g \'This is file: $TM_FILENAME\'.'),
                    'type': ['string', 'array'],
                    'items': {
                        'type': 'string'
                    }
                },
                'description': {
                    'description': nls.localize('snippetSchema.json.description', 'The snippet description.'),
                    'type': 'string'
                }
            },
            'additionalProperties': false
        }
    };
    platform_1.Registry
        .as(JSONContributionRegistry.Extensions.JSONContribution)
        .registerSchema(schemaId, schema);
    platform_1.Registry
        .as(workbenchContributions.Extensions.Workbench)
        .registerWorkbenchContribution(snippetsTracker.SnippetsTracker);
    platform_1.Registry
        .as(workbenchContributions.Extensions.Workbench)
        .registerWorkbenchContribution(tmSnippets.MainProcessTextMateSnippet);
});
//# sourceMappingURL=snippets.contribution.js.map