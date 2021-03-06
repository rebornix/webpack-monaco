define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResolvedKeybindingItem = (function () {
        function ResolvedKeybindingItem(resolvedKeybinding, command, commandArgs, when, isDefault) {
            this.resolvedKeybinding = resolvedKeybinding;
            if (resolvedKeybinding) {
                var _a = resolvedKeybinding.getDispatchParts(), keypressFirstPart = _a[0], keypressChordPart = _a[1];
                this.keypressFirstPart = keypressFirstPart;
                this.keypressChordPart = keypressChordPart;
            }
            else {
                this.keypressFirstPart = null;
                this.keypressChordPart = null;
            }
            this.bubble = (command ? command.charCodeAt(0) === 94 /* Caret */ : false);
            this.command = this.bubble ? command.substr(1) : command;
            this.commandArgs = commandArgs;
            this.when = when;
            this.isDefault = isDefault;
        }
        return ResolvedKeybindingItem;
    }());
    exports.ResolvedKeybindingItem = ResolvedKeybindingItem;
});
//# sourceMappingURL=resolvedKeybindingItem.js.map