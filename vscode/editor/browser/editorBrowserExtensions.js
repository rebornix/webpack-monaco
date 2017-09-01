define(["require", "exports", "vs/platform/registry/common/platform"], function (require, exports, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function editorContribution(ctor) {
        EditorContributionRegistry.INSTANCE.registerEditorBrowserContribution(ctor);
    }
    exports.editorContribution = editorContribution;
    var EditorBrowserRegistry;
    (function (EditorBrowserRegistry) {
        function getEditorContributions() {
            return EditorContributionRegistry.INSTANCE.getEditorBrowserContributions();
        }
        EditorBrowserRegistry.getEditorContributions = getEditorContributions;
    })(EditorBrowserRegistry = exports.EditorBrowserRegistry || (exports.EditorBrowserRegistry = {}));
    var Extensions = {
        EditorContributions: 'editor.contributions'
    };
    var EditorContributionRegistry = (function () {
        function EditorContributionRegistry() {
            this.editorContributions = [];
        }
        EditorContributionRegistry.prototype.registerEditorBrowserContribution = function (ctor) {
            this.editorContributions.push(ctor);
        };
        EditorContributionRegistry.prototype.getEditorBrowserContributions = function () {
            return this.editorContributions.slice(0);
        };
        EditorContributionRegistry.INSTANCE = new EditorContributionRegistry();
        return EditorContributionRegistry;
    }());
    platform_1.Registry.add(Extensions.EditorContributions, EditorContributionRegistry.INSTANCE);
});
//# sourceMappingURL=editorBrowserExtensions.js.map