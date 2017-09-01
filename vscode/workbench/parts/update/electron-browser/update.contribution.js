/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/platform/registry/common/platform", "vs/workbench/common/contributions", "vs/workbench/parts/update/electron-browser/releaseNotesEditor", "vs/workbench/parts/update/electron-browser/releaseNotesInput", "vs/workbench/browser/parts/editor/baseEditor", "vs/workbench/browser/activity", "vs/workbench/common/editor", "vs/platform/instantiation/common/descriptors", "vs/workbench/common/actionRegistry", "vs/platform/actions/common/actions", "vs/platform/configuration/common/configurationRegistry", "./update", "vs/css!./media/update.contribution"], function (require, exports, nls, platform_1, contributions_1, releaseNotesEditor_1, releaseNotesInput_1, baseEditor_1, activity_1, editor_1, descriptors_1, actionRegistry_1, actions_1, configurationRegistry_1, update_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    platform_1.Registry.as(contributions_1.Extensions.Workbench)
        .registerWorkbenchContribution(update_1.ProductContribution);
    if (process.platform === 'win32' && process.arch === 'ia32') {
        platform_1.Registry.as(contributions_1.Extensions.Workbench)
            .registerWorkbenchContribution(update_1.Win3264BitContribution);
    }
    platform_1.Registry.as(activity_1.GlobalActivityExtensions)
        .registerActivity(update_1.UpdateContribution);
    // Editor
    var editorDescriptor = new baseEditor_1.EditorDescriptor(releaseNotesEditor_1.ReleaseNotesEditor.ID, nls.localize('release notes', "Release notes"), 'vs/workbench/parts/update/electron-browser/releaseNotesEditor', 'ReleaseNotesEditor');
    platform_1.Registry.as(editor_1.Extensions.Editors)
        .registerEditor(editorDescriptor, [new descriptors_1.SyncDescriptor(releaseNotesInput_1.ReleaseNotesInput)]);
    platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions)
        .registerWorkbenchAction(new actions_1.SyncActionDescriptor(update_1.ShowCurrentReleaseNotesAction, update_1.ShowCurrentReleaseNotesAction.ID, update_1.ShowCurrentReleaseNotesAction.LABEL), 'Show Release Notes');
    // Configuration: Update
    var configurationRegistry = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration);
    configurationRegistry.registerConfiguration({
        'id': 'update',
        'order': 15,
        'title': nls.localize('updateConfigurationTitle', "Update"),
        'type': 'object',
        'properties': {
            'update.channel': {
                'type': 'string',
                'enum': ['none', 'default'],
                'default': 'default',
                'description': nls.localize('updateChannel', "Configure whether you receive automatic updates from an update channel. Requires a restart after change.")
            }
        }
    });
});
//# sourceMappingURL=update.contribution.js.map