/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/keyCodes", "vs/platform/registry/common/platform", "vs/platform/actions/common/actions", "vs/platform/instantiation/common/extensions", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/node/extensionGalleryService", "vs/workbench/common/actionRegistry", "vs/workbench/parts/extensions/electron-browser/extensionTipsService", "vs/workbench/common/contributions", "vs/workbench/parts/output/common/output", "vs/workbench/browser/parts/editor/baseEditor", "vs/workbench/common/editor", "vs/platform/instantiation/common/descriptors", "../common/extensions", "vs/workbench/parts/extensions/node/extensionsWorkbenchService", "vs/workbench/parts/extensions/browser/extensionsActions", "vs/workbench/parts/extensions/electron-browser/extensionsActions", "vs/workbench/parts/extensions/common/extensionsInput", "vs/workbench/browser/viewlet", "vs/workbench/parts/extensions/browser/extensionEditor", "vs/workbench/parts/extensions/electron-browser/extensionsViewlet", "vs/workbench/browser/quickopen", "vs/platform/configuration/common/configurationRegistry", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/workbench/parts/extensions/common/extensionsFileTemplate", "vs/platform/commands/common/commands", "vs/workbench/parts/extensions/electron-browser/extensionsUtils", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/css!./media/extensions"], function (require, exports, nls_1, errors, keyCodes_1, platform_1, actions_1, extensions_1, extensionManagement_1, extensionGalleryService_1, actionRegistry_1, extensionTipsService_1, contributions_1, output_1, baseEditor_1, editor_1, descriptors_1, extensions_2, extensionsWorkbenchService_1, extensionsActions_1, extensionsActions_2, extensionsInput_1, viewlet_1, extensionEditor_1, extensionsViewlet_1, quickopen_1, configurationRegistry_1, jsonContributionRegistry, extensionsFileTemplate_1, commands_1, extensionsUtils_1, extensionManagementUtil_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Singletons
    extensions_1.registerSingleton(extensionManagement_1.IExtensionGalleryService, extensionGalleryService_1.ExtensionGalleryService);
    extensions_1.registerSingleton(extensionManagement_1.IExtensionTipsService, extensionTipsService_1.ExtensionTipsService);
    extensions_1.registerSingleton(extensions_2.IExtensionsWorkbenchService, extensionsWorkbenchService_1.ExtensionsWorkbenchService);
    var workbenchRegistry = platform_1.Registry.as(contributions_1.Extensions.Workbench);
    workbenchRegistry.registerWorkbenchContribution(extensionsViewlet_1.StatusUpdater);
    workbenchRegistry.registerWorkbenchContribution(extensionsUtils_1.KeymapExtensions);
    workbenchRegistry.registerWorkbenchContribution(extensionsUtils_1.BetterMergeDisabled);
    platform_1.Registry.as(output_1.Extensions.OutputChannels)
        .registerChannel(extensionManagement_1.ExtensionsChannelId, extensionManagement_1.ExtensionsLabel);
    // Quickopen
    platform_1.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/extensions/browser/extensionsQuickOpen', 'ExtensionsHandler', 'ext ', null, nls_1.localize('extensionsCommands', "Manage Extensions"), true));
    platform_1.Registry.as(quickopen_1.Extensions.Quickopen).registerQuickOpenHandler(new quickopen_1.QuickOpenHandlerDescriptor('vs/workbench/parts/extensions/browser/extensionsQuickOpen', 'GalleryExtensionsHandler', 'ext install ', null, nls_1.localize('galleryExtensionsCommands', "Install Gallery Extensions"), true));
    // Editor
    var editorDescriptor = new baseEditor_1.EditorDescriptor(extensionEditor_1.ExtensionEditor.ID, nls_1.localize('extension', "Extension"), 'vs/workbench/parts/extensions/browser/extensionEditor', 'ExtensionEditor');
    platform_1.Registry.as(editor_1.Extensions.Editors)
        .registerEditor(editorDescriptor, [new descriptors_1.SyncDescriptor(extensionsInput_1.ExtensionsInput)]);
    // Viewlet
    var viewletDescriptor = new viewlet_1.ViewletDescriptor('vs/workbench/parts/extensions/electron-browser/extensionsViewlet', 'ExtensionsViewlet', extensions_2.VIEWLET_ID, nls_1.localize('extensions', "Extensions"), 'extensions', 100);
    platform_1.Registry.as(viewlet_1.Extensions.Viewlets)
        .registerViewlet(viewletDescriptor);
    // Global actions
    var actionRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    var openViewletActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.OpenExtensionsViewletAction, extensionsActions_1.OpenExtensionsViewletAction.ID, extensionsActions_1.OpenExtensionsViewletAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 54 /* KEY_X */ });
    actionRegistry.registerWorkbenchAction(openViewletActionDescriptor, 'View: Show Extensions', nls_1.localize('view', "View"));
    var installActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.InstallExtensionsAction, extensionsActions_1.InstallExtensionsAction.ID, extensionsActions_1.InstallExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(installActionDescriptor, 'Extensions: Install Extensions', extensionManagement_1.ExtensionsLabel);
    var listOutdatedActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowOutdatedExtensionsAction, extensionsActions_1.ShowOutdatedExtensionsAction.ID, extensionsActions_1.ShowOutdatedExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(listOutdatedActionDescriptor, 'Extensions: Show Outdated Extensions', extensionManagement_1.ExtensionsLabel);
    var recommendationsActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowRecommendedExtensionsAction, extensionsActions_1.ShowRecommendedExtensionsAction.ID, extensionsActions_1.ShowRecommendedExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(recommendationsActionDescriptor, 'Extensions: Show Recommended Extensions', extensionManagement_1.ExtensionsLabel);
    var keymapRecommendationsActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowRecommendedKeymapExtensionsAction, extensionsActions_1.ShowRecommendedKeymapExtensionsAction.ID, extensionsActions_1.ShowRecommendedKeymapExtensionsAction.SHORT_LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 43 /* KEY_M */) });
    actionRegistry.registerWorkbenchAction(keymapRecommendationsActionDescriptor, 'Preferences: Keymaps', extensionManagement_1.PreferencesLabel);
    var languageExtensionsActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowLanguageExtensionsAction, extensionsActions_1.ShowLanguageExtensionsAction.ID, extensionsActions_1.ShowLanguageExtensionsAction.SHORT_LABEL);
    actionRegistry.registerWorkbenchAction(languageExtensionsActionDescriptor, 'Preferences: Language Extensions', extensionManagement_1.PreferencesLabel);
    var azureExtensionsActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowAzureExtensionsAction, extensionsActions_1.ShowAzureExtensionsAction.ID, extensionsActions_1.ShowAzureExtensionsAction.SHORT_LABEL);
    actionRegistry.registerWorkbenchAction(azureExtensionsActionDescriptor, 'Preferences: Azure Extensions', extensionManagement_1.PreferencesLabel);
    var workspaceRecommendationsActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction, extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction.ID, extensionsActions_1.ShowWorkspaceRecommendedExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(workspaceRecommendationsActionDescriptor, 'Extensions: Show Workspace Recommended Extensions', extensionManagement_1.ExtensionsLabel);
    var popularActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowPopularExtensionsAction, extensionsActions_1.ShowPopularExtensionsAction.ID, extensionsActions_1.ShowPopularExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(popularActionDescriptor, 'Extensions: Show Popular Extensions', extensionManagement_1.ExtensionsLabel);
    var enabledActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowEnabledExtensionsAction, extensionsActions_1.ShowEnabledExtensionsAction.ID, extensionsActions_1.ShowEnabledExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(enabledActionDescriptor, 'Extensions: Show Enabled Extensions', extensionManagement_1.ExtensionsLabel);
    var installedActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowInstalledExtensionsAction, extensionsActions_1.ShowInstalledExtensionsAction.ID, extensionsActions_1.ShowInstalledExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(installedActionDescriptor, 'Extensions: Show Installed Extensions', extensionManagement_1.ExtensionsLabel);
    var disabledActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ShowDisabledExtensionsAction, extensionsActions_1.ShowDisabledExtensionsAction.ID, extensionsActions_1.ShowDisabledExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(disabledActionDescriptor, 'Extensions: Show Disabled Extensions', extensionManagement_1.ExtensionsLabel);
    var updateAllActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.UpdateAllAction, extensionsActions_1.UpdateAllAction.ID, extensionsActions_1.UpdateAllAction.LABEL);
    actionRegistry.registerWorkbenchAction(updateAllActionDescriptor, 'Extensions: Update All Extensions', extensionManagement_1.ExtensionsLabel);
    var openExtensionsFolderActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_2.OpenExtensionsFolderAction, extensionsActions_2.OpenExtensionsFolderAction.ID, extensionsActions_2.OpenExtensionsFolderAction.LABEL);
    actionRegistry.registerWorkbenchAction(openExtensionsFolderActionDescriptor, 'Extensions: Open Extensions Folder', extensionManagement_1.ExtensionsLabel);
    var openExtensionsFileActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_1.ConfigureWorkspaceRecommendedExtensionsAction, extensionsActions_1.ConfigureWorkspaceRecommendedExtensionsAction.ID, extensionsActions_1.ConfigureWorkspaceRecommendedExtensionsAction.LABEL);
    actionRegistry.registerWorkbenchAction(openExtensionsFileActionDescriptor, 'Extensions: Configure Recommended Extensions (Workspace)', extensionManagement_1.ExtensionsLabel);
    var installVSIXActionDescriptor = new actions_1.SyncActionDescriptor(extensionsActions_2.InstallVSIXAction, extensionsActions_2.InstallVSIXAction.ID, extensionsActions_2.InstallVSIXAction.LABEL);
    actionRegistry.registerWorkbenchAction(installVSIXActionDescriptor, 'Extensions: Install from VSIX...', extensionManagement_1.ExtensionsLabel);
    var disableAllAction = new actions_1.SyncActionDescriptor(extensionsActions_1.DisableAllAction, extensionsActions_1.DisableAllAction.ID, extensionsActions_1.DisableAllAction.LABEL);
    actionRegistry.registerWorkbenchAction(disableAllAction, 'Extensions: Disable All Installed Extensions', extensionManagement_1.ExtensionsLabel);
    var disableAllWorkspaceAction = new actions_1.SyncActionDescriptor(extensionsActions_1.DisableAllWorkpsaceAction, extensionsActions_1.DisableAllWorkpsaceAction.ID, extensionsActions_1.DisableAllWorkpsaceAction.LABEL);
    actionRegistry.registerWorkbenchAction(disableAllWorkspaceAction, 'Extensions: Disable All Installed Extensions for this Workspace', extensionManagement_1.ExtensionsLabel);
    var enableAllAction = new actions_1.SyncActionDescriptor(extensionsActions_1.EnableAllAction, extensionsActions_1.EnableAllAction.ID, extensionsActions_1.EnableAllAction.LABEL);
    actionRegistry.registerWorkbenchAction(enableAllAction, 'Extensions: Enable All Installed Extensions', extensionManagement_1.ExtensionsLabel);
    var enableAllWorkspaceAction = new actions_1.SyncActionDescriptor(extensionsActions_1.EnableAllWorkpsaceAction, extensionsActions_1.EnableAllWorkpsaceAction.ID, extensionsActions_1.EnableAllWorkpsaceAction.LABEL);
    actionRegistry.registerWorkbenchAction(enableAllWorkspaceAction, 'Extensions: Enable All Installed Extensions for this Workspace', extensionManagement_1.ExtensionsLabel);
    var checkForUpdatesAction = new actions_1.SyncActionDescriptor(extensionsActions_1.CheckForUpdatesAction, extensionsActions_1.CheckForUpdatesAction.ID, extensionsActions_1.CheckForUpdatesAction.LABEL);
    actionRegistry.registerWorkbenchAction(checkForUpdatesAction, "Extensions: Check for Updates", extensionManagement_1.ExtensionsLabel);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(extensionsActions_1.EnableAutoUpdateAction, extensionsActions_1.EnableAutoUpdateAction.ID, extensionsActions_1.EnableAutoUpdateAction.LABEL), "Extensions: Enable Auto Updating Extensions", extensionManagement_1.ExtensionsLabel);
    actionRegistry.registerWorkbenchAction(new actions_1.SyncActionDescriptor(extensionsActions_1.DisableAutoUpdateAction, extensionsActions_1.DisableAutoUpdateAction.ID, extensionsActions_1.DisableAutoUpdateAction.LABEL), "Extensions: Disable Auto Updating Extensions", extensionManagement_1.ExtensionsLabel);
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration)
        .registerConfiguration({
        id: 'extensions',
        order: 30,
        title: nls_1.localize('extensionsConfigurationTitle', "Extensions"),
        type: 'object',
        properties: {
            'extensions.autoUpdate': {
                type: 'boolean',
                description: nls_1.localize('extensionsAutoUpdate', "Automatically update extensions"),
                default: true
            },
            'extensions.ignoreRecommendations': {
                type: 'boolean',
                description: nls_1.localize('extensionsIgnoreRecommendations', "Ignore extension recommendations"),
                default: false
            }
        }
    });
    var jsonRegistry = platform_1.Registry.as(jsonContributionRegistry.Extensions.JSONContribution);
    jsonRegistry.registerSchema(extensionsFileTemplate_1.ExtensionsConfigurationSchemaId, extensionsFileTemplate_1.ExtensionsConfigurationSchema);
    // Register Commands
    commands_1.CommandsRegistry.registerCommand('_extensions.manage', function (accessor, extensionId) {
        var extensionService = accessor.get(extensions_2.IExtensionsWorkbenchService);
        extensionId = extensionManagementUtil_1.adoptToGalleryExtensionId(extensionId);
        var extension = extensionService.local.filter(function (e) { return e.id === extensionId; });
        if (extension.length === 1) {
            extensionService.open(extension[0]).done(null, errors.onUnexpectedError);
        }
    });
});
//# sourceMappingURL=extensions.contribution.js.map