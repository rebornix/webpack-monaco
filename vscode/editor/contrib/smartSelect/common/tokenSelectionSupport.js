var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/editor/common/core/range", "vs/editor/common/services/modelService", "./tokenTree"], function (require, exports, winjs_base_1, range_1, modelService_1, tokenTree_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TokenSelectionSupport = (function () {
        function TokenSelectionSupport(modelService) {
            this._modelService = modelService;
        }
        TokenSelectionSupport.prototype.getRangesToPosition = function (resource, position) {
            return winjs_base_1.TPromise.as(this.getRangesToPositionSync(resource, position));
        };
        TokenSelectionSupport.prototype.getRangesToPositionSync = function (resource, position) {
            var model = this._modelService.getModel(resource), entries = [];
            if (model) {
                this._doGetRangesToPosition(model, position).forEach(function (range) {
                    entries.push({
                        type: void 0,
                        range: range
                    });
                });
            }
            return entries;
        };
        TokenSelectionSupport.prototype._doGetRangesToPosition = function (model, position) {
            var tree = tokenTree_1.build(model), node, lastRange;
            node = tokenTree_1.find(tree, position);
            var ranges = [];
            while (node) {
                if (!lastRange || !range_1.Range.equalsRange(lastRange, node.range)) {
                    ranges.push(node.range);
                }
                lastRange = node.range;
                node = node.parent;
            }
            ranges = ranges.reverse();
            return ranges;
        };
        TokenSelectionSupport = __decorate([
            __param(0, modelService_1.IModelService)
        ], TokenSelectionSupport);
        return TokenSelectionSupport;
    }());
    exports.TokenSelectionSupport = TokenSelectionSupport;
});
//# sourceMappingURL=tokenSelectionSupport.js.map