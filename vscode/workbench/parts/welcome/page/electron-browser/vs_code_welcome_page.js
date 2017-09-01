define(["require", "exports", "vs/base/common/strings", "vs/nls"], function (require, exports, strings_1, nls_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function used() {
    }
    exports.used = used;
    exports.default = function () { return "\n<div class=\"welcomePageContainer\">\n\t<div class=\"welcomePage\">\n\t\t<div class=\"title\">\n\t\t\t<h1 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.vscode', "Visual Studio Code")) + "</h1>\n\t\t\t<p class=\"subtitle detail\">" + strings_1.escape(nls_1.localize('welcomePage.editingEvolved', "Editing evolved")) + "</p>\n\t\t</div>\n\t\t<div class=\"row\">\n\t\t\t<div class=\"splash\">\n\t\t\t\t<div class=\"section start\">\n\t\t\t\t\t<h2 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.start', "Start")) + "</h2>\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li><a href=\"command:workbench.action.files.newUntitledFile\">" + strings_1.escape(nls_1.localize('welcomePage.newFile', "New file")) + "</a></li>\n\t\t\t\t\t\t<li class=\"mac-only\"><a href=\"command:workbench.action.files.openFileFolder\">" + strings_1.escape(nls_1.localize('welcomePage.openFolder', "Open folder...")) + "</a></li>\n\t\t\t\t\t\t<li class=\"windows-only linux-only\"><a href=\"command:workbench.action.files.openFolder\">" + strings_1.escape(nls_1.localize('welcomePage.openFolder', "Open folder...")) + "</a></li>\n\t\t\t\t\t\t<li><a href=\"command:git.clone\">" + strings_1.escape(nls_1.localize('welcomePage.cloneGitRepository', "Clone Git repository...")) + "</a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"section recent\">\n\t\t\t\t\t<h2 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.recent', "Recent")) + "</h2>\n\t\t\t\t\t<ul class=\"list\">\n\t\t\t\t\t\t<!-- Filled programmatically -->\n\t\t\t\t\t\t<li class=\"moreRecent\"><a href=\"command:workbench.action.openRecent\">" + strings_1.escape(nls_1.localize('welcomePage.moreRecent', "More...")) + "</a><span class=\"path detail if_shortcut\" data-command=\"workbench.action.openRecent\">(<span class=\"shortcut\" data-command=\"workbench.action.openRecent\"></span>)</span></li>\n\t\t\t\t\t</ul>\n\t\t\t\t\t<p class=\"none detail\">" + strings_1.escape(nls_1.localize('welcomePage.noRecentFolders', "No recent folders")) + "</p>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"section help\">\n\t\t\t\t\t<h2 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.help', "Help")) + "</h2>\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li class=\"keybindingsReferenceLink\"><a href=\"command:workbench.action.keybindingsReference\">" + strings_1.escape(nls_1.localize('welcomePage.keybindingsCheatsheet', "Printable keyboard cheatsheet")) + "</a></li>\n\t\t\t\t\t\t<li><a href=\"command:workbench.action.openIntroductoryVideosUrl\">" + strings_1.escape(nls_1.localize('welcomePage.introductoryVideos', "Introductory videos")) + "</a></li>\n\t\t\t\t\t\t<li><a href=\"command:workbench.action.openTipsAndTricksUrl\">" + strings_1.escape(nls_1.localize('welcomePage.tipsAndTricks', "Tips and Tricks")) + "</a></li>\n\t\t\t\t\t\t<li><a href=\"command:workbench.action.openDocumentationUrl\">" + strings_1.escape(nls_1.localize('welcomePage.productDocumentation', "Product documentation")) + "</a></li>\n\t\t\t\t\t\t<li><a href=\"https://github.com/Microsoft/vscode\">" + strings_1.escape(nls_1.localize('welcomePage.gitHubRepository', "GitHub repository")) + "</a></li>\n\t\t\t\t\t\t<li><a href=\"http://stackoverflow.com/questions/tagged/vscode?sort=votes&pageSize=50\">" + strings_1.escape(nls_1.localize('welcomePage.stackOverflow', "Stack Overflow")) + "</a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t<p class=\"showOnStartup\"><input type=\"checkbox\" id=\"showOnStartup\"> <label class=\"caption\" for=\"showOnStartup\">" + strings_1.escape(nls_1.localize('welcomePage.showOnStartup', "Show welcome page on startup")) + "</label></p>\n\t\t\t</div>\n\t\t\t<div class=\"commands\">\n\t\t\t\t<div class=\"section customize\">\n\t\t\t\t\t<h2 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.customize', "Customize")) + "</h2>\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li class=\"showLanguageExtensions\"><button role=\"group\" data-href=\"command:workbench.extensions.action.showLanguageExtensions\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.installExtensionPacks', "Tools and languages")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.installExtensionPacksDescription', "Install support for {0} and {1}"))
        .replace('{0}', "<span class=\"extensionPackList\"></span>")
        .replace('{1}', "<a href=\"command:workbench.extensions.action.showLanguageExtensions\">" + strings_1.escape(nls_1.localize('welcomePage.moreExtensions', "more")) + "</a>") + "\n\t\t\t\t\t\t</span></button></li>\n\t\t\t\t\t\t<li class=\"showRecommendedKeymapExtensions\"><button role=\"group\" data-href=\"command:workbench.extensions.action.showRecommendedKeymapExtensions\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.installKeymapDescription', "Install keyboard shortcuts")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.installKeymapExtension', "Install the keyboard shortcuts of {0} and {1}"))
        .replace('{0}', "<span class=\"keymapList\"></span>")
        .replace('{1}', "<a href=\"command:workbench.extensions.action.showRecommendedKeymapExtensions\">" + strings_1.escape(nls_1.localize('welcomePage.others', "others")) + "</a>") + "\n\t\t\t\t\t\t</span></button></li>\n\t\t\t\t\t\t<li class=\"selectTheme\"><button data-href=\"command:workbench.action.selectTheme\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.colorTheme', "Color theme")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.colorThemeDescription', "Make the editor and your code look the way you love")) + "</span></button></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"section learn\">\n\t\t\t\t\t<h2 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.learn', "Learn")) + "</h2>\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li class=\"showCommands\"><button data-href=\"command:workbench.action.showCommands\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.showCommands', "Find and run all commands")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.showCommandsDescription', "Rapidly access and search commands from the Command Palette ({0})")).replace('{0}', '<span class="shortcut" data-command="workbench.action.showCommands"></span>') + "</span></button></li>\n\t\t\t\t\t\t<li class=\"showInterfaceOverview\"><button data-href=\"command:workbench.action.showInterfaceOverview\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.interfaceOverview', "Interface overview")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.interfaceOverviewDescription', "Get a visual overlay highlighting the major components of the UI")) + "</span></button></li>\n\t\t\t\t\t\t<li class=\"deployToAzure\"><button data-href=\"https://code.visualstudio.com/tutorials/nodejs-deployment/getting-started?utm_source=VSCode&utm_medium=WelcomePage\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.deployToAzure', "Deploy applications to the cloud")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.deployToAzureDescription', "Learn how to deploy your Node apps to Azure App Service")) + "</span></button></li>\n\t\t\t\t\t\t<li class=\"showInteractivePlayground\"><button data-href=\"command:workbench.action.showInteractivePlayground\"><h3 class=\"caption\">" + strings_1.escape(nls_1.localize('welcomePage.interactivePlayground', "Interactive playground")) + "</h3> <span class=\"detail\">" + strings_1.escape(nls_1.localize('welcomePage.interactivePlaygroundDescription', "Try essential editor features out in a short walkthrough")) + "</span></button></li>\n\t\t\t\t\t</ul>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n"; };
});
//# sourceMappingURL=vs_code_welcome_page.js.map