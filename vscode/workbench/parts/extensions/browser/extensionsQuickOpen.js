/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/parts/quickopen/common/quickOpen", "vs/base/parts/quickopen/browser/quickOpenModel", "vs/workbench/browser/quickopen", "vs/workbench/parts/extensions/common/extensions", "vs/workbench/services/viewlet/browser/viewlet"], function (require, exports, nls, winjs_base_1, quickOpen_1, quickOpenModel_1, quickopen_1, extensions_1, viewlet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimpleEntry = (function (_super) {
        __extends(SimpleEntry, _super);
        function SimpleEntry(label, action) {
            var _this = _super.call(this) || this;
            _this.label = label;
            _this.action = action;
            return _this;
        }
        SimpleEntry.prototype.getLabel = function () {
            return this.label;
        };
        SimpleEntry.prototype.getAriaLabel = function () {
            return this.label;
        };
        SimpleEntry.prototype.run = function (mode) {
            if (mode === quickOpen_1.Mode.PREVIEW) {
                return false;
            }
            this.action();
            return true;
        };
        return SimpleEntry;
    }(quickOpenModel_1.QuickOpenEntry));
    var ExtensionsHandler = (function (_super) {
        __extends(ExtensionsHandler, _super);
        function ExtensionsHandler(viewletService) {
            var _this = _super.call(this) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        ExtensionsHandler.prototype.getResults = function (text) {
            var _this = this;
            var label = nls.localize('manage', "Press Enter to manage your extensions.");
            var action = function () {
                _this.viewletService.openViewlet(extensions_1.VIEWLET_ID, true)
                    .then(function (viewlet) { return viewlet; })
                    .done(function (viewlet) {
                    viewlet.search('');
                    viewlet.focus();
                });
            };
            return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel([new SimpleEntry(label, action)]));
        };
        ExtensionsHandler.prototype.getEmptyLabel = function (input) {
            return '';
        };
        ExtensionsHandler.prototype.getAutoFocus = function (searchValue) {
            return { autoFocusFirstEntry: true };
        };
        ExtensionsHandler = __decorate([
            __param(0, viewlet_1.IViewletService)
        ], ExtensionsHandler);
        return ExtensionsHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.ExtensionsHandler = ExtensionsHandler;
    var GalleryExtensionsHandler = (function (_super) {
        __extends(GalleryExtensionsHandler, _super);
        function GalleryExtensionsHandler(viewletService) {
            var _this = _super.call(this) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        GalleryExtensionsHandler.prototype.getResults = function (text) {
            var _this = this;
            var entries = [];
            if (text) {
                var label = nls.localize('searchFor', "Press Enter to search for '{0}' in the Marketplace.", text);
                var action = function () {
                    _this.viewletService.openViewlet(extensions_1.VIEWLET_ID, true)
                        .then(function (viewlet) { return viewlet; })
                        .done(function (viewlet) {
                        viewlet.search(text);
                        viewlet.focus();
                    });
                };
                entries.push(new SimpleEntry(label, action));
            }
            return winjs_base_1.TPromise.as(new quickOpenModel_1.QuickOpenModel(entries));
        };
        GalleryExtensionsHandler.prototype.getEmptyLabel = function (input) {
            return nls.localize('noExtensionsToInstall', "Type an extension name");
        };
        GalleryExtensionsHandler.prototype.getAutoFocus = function (searchValue) {
            return { autoFocusFirstEntry: true };
        };
        GalleryExtensionsHandler = __decorate([
            __param(0, viewlet_1.IViewletService)
        ], GalleryExtensionsHandler);
        return GalleryExtensionsHandler;
    }(quickopen_1.QuickOpenHandler));
    exports.GalleryExtensionsHandler = GalleryExtensionsHandler;
});
//# sourceMappingURL=extensionsQuickOpen.js.map