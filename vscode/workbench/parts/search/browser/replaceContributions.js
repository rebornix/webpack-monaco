define(["require", "exports", "vs/platform/instantiation/common/extensions", "vs/workbench/parts/search/common/replace", "vs/workbench/parts/search/browser/replaceService", "vs/platform/registry/common/platform", "vs/workbench/common/contributions"], function (require, exports, extensions_1, replace_1, replaceService_1, platform_1, contributions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function registerContributions() {
        extensions_1.registerSingleton(replace_1.IReplaceService, replaceService_1.ReplaceService);
        platform_1.Registry.as(contributions_1.Extensions.Workbench).registerWorkbenchContribution(replaceService_1.ReplacePreviewContentProvider);
    }
    exports.registerContributions = registerContributions;
});
//# sourceMappingURL=replaceContributions.js.map