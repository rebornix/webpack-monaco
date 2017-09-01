var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/platform/registry/common/platform"], function (require, exports, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Extensions;
    (function (Extensions) {
        Extensions.Workbench = 'workbench.contributions.kind';
    })(Extensions = exports.Extensions || (exports.Extensions = {}));
    var WorkbenchContributionsRegistry = (function (_super) {
        __extends(WorkbenchContributionsRegistry, _super);
        function WorkbenchContributionsRegistry() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WorkbenchContributionsRegistry.prototype.registerWorkbenchContribution = function (ctor) {
            _super.prototype._register.call(this, ctor);
        };
        WorkbenchContributionsRegistry.prototype.getWorkbenchContributions = function () {
            return _super.prototype._getInstances.call(this);
        };
        WorkbenchContributionsRegistry.prototype.setWorkbenchContributions = function (contributions) {
            _super.prototype._setInstances.call(this, contributions);
        };
        return WorkbenchContributionsRegistry;
    }(platform_1.BaseRegistry));
    platform_1.Registry.add(Extensions.Workbench, new WorkbenchContributionsRegistry());
});
//# sourceMappingURL=contributions.js.map