define(["require", "exports", "vs/platform/registry/common/platform", "./gettingStarted", "vs/workbench/common/contributions"], function (require, exports, platform_1, gettingStarted_1, contributions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    platform_1.Registry
        .as(contributions_1.Extensions.Workbench)
        .registerWorkbenchContribution(gettingStarted_1.GettingStarted);
});
//# sourceMappingURL=gettingStarted.contribution.js.map