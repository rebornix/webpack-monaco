define(["require", "exports", "./contextMenuHandler"], function (require, exports, contextMenuHandler_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContextMenuService = (function () {
        function ContextMenuService(container, telemetryService, messageService, contextViewService) {
            this.contextMenuHandler = new contextMenuHandler_1.ContextMenuHandler(container, contextViewService, telemetryService, messageService);
        }
        ContextMenuService.prototype.dispose = function () {
            this.contextMenuHandler.dispose();
        };
        ContextMenuService.prototype.setContainer = function (container) {
            this.contextMenuHandler.setContainer(container);
        };
        // ContextMenu
        ContextMenuService.prototype.showContextMenu = function (delegate) {
            this.contextMenuHandler.showContextMenu(delegate);
        };
        return ContextMenuService;
    }());
    exports.ContextMenuService = ContextMenuService;
});
//# sourceMappingURL=contextMenuService.js.map