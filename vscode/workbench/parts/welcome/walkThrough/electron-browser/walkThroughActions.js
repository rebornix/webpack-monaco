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
define(["require", "exports", "vs/nls", "vs/workbench/services/editor/common/editorService", "vs/base/common/actions", "vs/workbench/parts/welcome/walkThrough/electron-browser/walkThroughPart"], function (require, exports, nls_1, editorService_1, actions_1, walkThroughPart_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WalkThroughArrowUpAction = (function (_super) {
        __extends(WalkThroughArrowUpAction, _super);
        function WalkThroughArrowUpAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        WalkThroughArrowUpAction.prototype.run = function () {
            var editor = this.editorService.getActiveEditor();
            if (editor instanceof walkThroughPart_1.WalkThroughPart) {
                editor.arrowUp();
            }
            return null;
        };
        WalkThroughArrowUpAction.ID = 'workbench.action.interactivePlayground.arrowUp';
        WalkThroughArrowUpAction.LABEL = nls_1.localize('editorWalkThrough.arrowUp', "Scroll Up (Line)");
        WalkThroughArrowUpAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], WalkThroughArrowUpAction);
        return WalkThroughArrowUpAction;
    }(actions_1.Action));
    exports.WalkThroughArrowUpAction = WalkThroughArrowUpAction;
    var WalkThroughArrowDownAction = (function (_super) {
        __extends(WalkThroughArrowDownAction, _super);
        function WalkThroughArrowDownAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        WalkThroughArrowDownAction.prototype.run = function () {
            var editor = this.editorService.getActiveEditor();
            if (editor instanceof walkThroughPart_1.WalkThroughPart) {
                editor.arrowDown();
            }
            return null;
        };
        WalkThroughArrowDownAction.ID = 'workbench.action.interactivePlayground.arrowDown';
        WalkThroughArrowDownAction.LABEL = nls_1.localize('editorWalkThrough.arrowDown', "Scroll Down (Line)");
        WalkThroughArrowDownAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], WalkThroughArrowDownAction);
        return WalkThroughArrowDownAction;
    }(actions_1.Action));
    exports.WalkThroughArrowDownAction = WalkThroughArrowDownAction;
    var WalkThroughPageUpAction = (function (_super) {
        __extends(WalkThroughPageUpAction, _super);
        function WalkThroughPageUpAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        WalkThroughPageUpAction.prototype.run = function () {
            var editor = this.editorService.getActiveEditor();
            if (editor instanceof walkThroughPart_1.WalkThroughPart) {
                editor.pageUp();
            }
            return null;
        };
        WalkThroughPageUpAction.ID = 'workbench.action.interactivePlayground.pageUp';
        WalkThroughPageUpAction.LABEL = nls_1.localize('editorWalkThrough.pageUp', "Scroll Up (Page)");
        WalkThroughPageUpAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], WalkThroughPageUpAction);
        return WalkThroughPageUpAction;
    }(actions_1.Action));
    exports.WalkThroughPageUpAction = WalkThroughPageUpAction;
    var WalkThroughPageDownAction = (function (_super) {
        __extends(WalkThroughPageDownAction, _super);
        function WalkThroughPageDownAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        WalkThroughPageDownAction.prototype.run = function () {
            var editor = this.editorService.getActiveEditor();
            if (editor instanceof walkThroughPart_1.WalkThroughPart) {
                editor.pageDown();
            }
            return null;
        };
        WalkThroughPageDownAction.ID = 'workbench.action.interactivePlayground.pageDown';
        WalkThroughPageDownAction.LABEL = nls_1.localize('editorWalkThrough.pageDown', "Scroll Down (Page)");
        WalkThroughPageDownAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], WalkThroughPageDownAction);
        return WalkThroughPageDownAction;
    }(actions_1.Action));
    exports.WalkThroughPageDownAction = WalkThroughPageDownAction;
});
//# sourceMappingURL=walkThroughActions.js.map