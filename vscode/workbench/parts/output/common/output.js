define(["require", "exports", "vs/platform/registry/common/platform", "vs/platform/instantiation/common/instantiation", "vs/platform/contextkey/common/contextkey", "vs/workbench/common/editor/resourceEditorInput", "vs/nls", "vs/base/common/uri"], function (require, exports, platform_1, instantiation_1, contextkey_1, resourceEditorInput_1, nls, uri_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Mime type used by the output editor.
     */
    exports.OUTPUT_MIME = 'text/x-code-output';
    /**
     * Output resource scheme.
     */
    exports.OUTPUT_SCHEME = 'output';
    /**
     * Id used by the output editor.
     */
    exports.OUTPUT_MODE_ID = 'Log';
    /**
     * Output panel id
     */
    exports.OUTPUT_PANEL_ID = 'workbench.panel.output';
    exports.Extensions = {
        OutputChannels: 'workbench.contributions.outputChannels'
    };
    exports.OUTPUT_SERVICE_ID = 'outputService';
    exports.MAX_OUTPUT_LENGTH = 10000 /* Max. number of output lines to show in output */ * 100 /* Guestimated chars per line */;
    exports.CONTEXT_IN_OUTPUT = new contextkey_1.RawContextKey('inOutput', false);
    exports.IOutputService = instantiation_1.createDecorator(exports.OUTPUT_SERVICE_ID);
    var OutputChannelRegistry = (function () {
        function OutputChannelRegistry() {
            this.channels = new Map();
        }
        OutputChannelRegistry.prototype.registerChannel = function (id, label) {
            if (!this.channels.has(id)) {
                this.channels.set(id, { id: id, label: label });
            }
        };
        OutputChannelRegistry.prototype.getChannels = function () {
            var result = [];
            this.channels.forEach(function (value) { return result.push(value); });
            return result;
        };
        OutputChannelRegistry.prototype.getChannel = function (id) {
            return this.channels.get(id);
        };
        OutputChannelRegistry.prototype.removeChannel = function (id) {
            this.channels.delete(id);
        };
        return OutputChannelRegistry;
    }());
    platform_1.Registry.add(exports.Extensions.OutputChannels, new OutputChannelRegistry());
    var OutputEditors = (function () {
        function OutputEditors() {
        }
        OutputEditors.getInstance = function (instantiationService, channel) {
            if (OutputEditors.instances[channel.id]) {
                return OutputEditors.instances[channel.id];
            }
            var resource = uri_1.default.from({ scheme: exports.OUTPUT_SCHEME, path: channel.id });
            OutputEditors.instances[channel.id] = instantiationService.createInstance(resourceEditorInput_1.ResourceEditorInput, nls.localize('output', "Output"), channel ? nls.localize('channel', "for '{0}'", channel.label) : '', resource);
            return OutputEditors.instances[channel.id];
        };
        OutputEditors.instances = Object.create(null);
        return OutputEditors;
    }());
    exports.OutputEditors = OutputEditors;
});
//# sourceMappingURL=output.js.map