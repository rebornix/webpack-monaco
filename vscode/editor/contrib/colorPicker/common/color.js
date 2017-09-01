/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/winjs.base", "vs/editor/common/modes", "vs/base/common/async", "vs/base/common/arrays"], function (require, exports, winjs_base_1, modes_1, async_1, arrays_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getColors(model) {
        var providers = modes_1.ColorProviderRegistry.ordered(model).reverse();
        var promises = providers.map(function (p) { return async_1.asWinJsPromise(function (token) { return p.provideColorRanges(model, token); }); });
        return winjs_base_1.TPromise.join(promises)
            .then(function (ranges) { return arrays_1.flatten(ranges.filter(function (r) { return Array.isArray(r); })); });
    }
    exports.getColors = getColors;
});
//# sourceMappingURL=color.js.map