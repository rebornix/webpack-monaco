define(["require", "exports", "vs/platform/registry/common/platform", "vs/base/common/eventEmitter"], function (require, exports, platform, eventEmitter_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Extensions = {
        JSONContribution: 'base.contributions.json'
    };
    function normalizeId(id) {
        if (id.length > 0 && id.charAt(id.length - 1) === '#') {
            return id.substring(0, id.length - 1);
        }
        return id;
    }
    var JSONContributionRegistry = (function () {
        function JSONContributionRegistry() {
            this.schemasById = {};
            this.eventEmitter = new eventEmitter_1.EventEmitter();
        }
        JSONContributionRegistry.prototype.addRegistryChangedListener = function (callback) {
            return this.eventEmitter.addListener('registryChanged', callback);
        };
        JSONContributionRegistry.prototype.registerSchema = function (uri, unresolvedSchemaContent) {
            this.schemasById[normalizeId(uri)] = unresolvedSchemaContent;
            this.eventEmitter.emit('registryChanged', {});
        };
        JSONContributionRegistry.prototype.getSchemaContributions = function () {
            return {
                schemas: this.schemasById,
            };
        };
        return JSONContributionRegistry;
    }());
    var jsonContributionRegistry = new JSONContributionRegistry();
    platform.Registry.add(exports.Extensions.JSONContribution, jsonContributionRegistry);
});
//# sourceMappingURL=jsonContributionRegistry.js.map