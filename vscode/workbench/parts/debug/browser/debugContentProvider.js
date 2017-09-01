/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/mime", "vs/editor/common/services/modelService", "vs/editor/common/services/modeService", "vs/editor/common/services/resolverService", "vs/workbench/parts/debug/common/debug"], function (require, exports, nls_1, winjs_base_1, mime_1, modelService_1, modeService_1, resolverService_1, debug_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugContentProvider = (function () {
        function DebugContentProvider(textModelResolverService, debugService, modelService, modeService) {
            this.debugService = debugService;
            this.modelService = modelService;
            this.modeService = modeService;
            textModelResolverService.registerTextModelContentProvider(debug_1.DEBUG_SCHEME, this);
        }
        DebugContentProvider.prototype.getId = function () {
            return 'debug.contentprovider';
        };
        DebugContentProvider.prototype.provideTextContent = function (resource) {
            var _this = this;
            var process;
            if (resource.query) {
                var keyvalues = resource.query.split('&');
                for (var _i = 0, keyvalues_1 = keyvalues; _i < keyvalues_1.length; _i++) {
                    var keyvalue = keyvalues_1[_i];
                    var pair = keyvalue.split('=');
                    if (pair.length === 2 && pair[0] === 'session') {
                        process = this.debugService.findProcessByUUID(decodeURIComponent(pair[1]));
                        break;
                    }
                }
            }
            if (!process) {
                // fallback: use focused process
                process = this.debugService.getViewModel().focusedProcess;
            }
            if (!process) {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('unable', "Unable to resolve the resource without a debug session")));
            }
            var source = process.sources.get(resource.toString());
            var rawSource;
            if (source) {
                rawSource = source.raw;
            }
            else {
                // Remove debug: scheme
                rawSource = { path: resource.with({ scheme: '', query: '' }).toString(true) };
            }
            return process.session.source({ sourceReference: source ? source.reference : undefined, source: rawSource }).then(function (response) {
                var mime = response.body.mimeType || mime_1.guessMimeTypes(resource.toString())[0];
                var modePromise = _this.modeService.getOrCreateMode(mime);
                var model = _this.modelService.createModel(response.body.content, modePromise, resource);
                return model;
            }, function (err) {
                _this.debugService.sourceIsNotAvailable(resource);
                var modePromise = _this.modeService.getOrCreateMode(mime_1.MIME_TEXT);
                var model = _this.modelService.createModel(err.message, modePromise, resource);
                return model;
            });
        };
        DebugContentProvider = __decorate([
            __param(0, resolverService_1.ITextModelService),
            __param(1, debug_1.IDebugService),
            __param(2, modelService_1.IModelService),
            __param(3, modeService_1.IModeService)
        ], DebugContentProvider);
        return DebugContentProvider;
    }());
    exports.DebugContentProvider = DebugContentProvider;
});
//# sourceMappingURL=debugContentProvider.js.map