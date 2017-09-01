define(["require", "exports", "./extHost.protocol"], function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function isMessageItem(item) {
        return item && item.title;
    }
    var ExtHostMessageService = (function () {
        function ExtHostMessageService(mainContext) {
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadMessageService);
        }
        ExtHostMessageService.prototype.showMessage = function (extension, severity, message, optionsOrFirstItem, rest) {
            var options = { extension: extension };
            var items;
            if (typeof optionsOrFirstItem === 'string' || isMessageItem(optionsOrFirstItem)) {
                items = [optionsOrFirstItem].concat(rest);
            }
            else {
                options.modal = optionsOrFirstItem && optionsOrFirstItem.modal;
                items = rest;
            }
            var commands = [];
            for (var handle = 0; handle < items.length; handle++) {
                var command = items[handle];
                if (typeof command === 'string') {
                    commands.push({ title: command, handle: handle, isCloseAffordance: false });
                }
                else if (typeof command === 'object') {
                    var title = command.title, isCloseAffordance = command.isCloseAffordance;
                    commands.push({ title: title, isCloseAffordance: isCloseAffordance, handle: handle });
                }
                else {
                    console.warn('Invalid message item:', command);
                }
            }
            return this._proxy.$showMessage(severity, message, options, commands).then(function (handle) {
                if (typeof handle === 'number') {
                    return items[handle];
                }
                return undefined;
            });
        };
        return ExtHostMessageService;
    }());
    exports.ExtHostMessageService = ExtHostMessageService;
});
//# sourceMappingURL=extHostMessageService.js.map