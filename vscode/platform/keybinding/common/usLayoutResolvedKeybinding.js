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
define(["require", "exports", "vs/base/common/keyCodes", "vs/base/common/keybindingLabels"], function (require, exports, keyCodes_1, keybindingLabels_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Do not instantiate. Use KeybindingService to get a ResolvedKeybinding seeded with information about the current kb layout.
     */
    var USLayoutResolvedKeybinding = (function (_super) {
        __extends(USLayoutResolvedKeybinding, _super);
        function USLayoutResolvedKeybinding(actual, OS) {
            var _this = _super.call(this) || this;
            _this._os = OS;
            if (actual === null) {
                _this._firstPart = null;
                _this._chordPart = null;
            }
            else if (actual.type === 2 /* Chord */) {
                _this._firstPart = actual.firstPart;
                _this._chordPart = actual.chordPart;
            }
            else {
                _this._firstPart = actual;
                _this._chordPart = null;
            }
            return _this;
        }
        USLayoutResolvedKeybinding.prototype._keyCodeToUILabel = function (keyCode) {
            if (this._os === 2 /* Macintosh */) {
                switch (keyCode) {
                    case 15 /* LeftArrow */:
                        return '←';
                    case 16 /* UpArrow */:
                        return '↑';
                    case 17 /* RightArrow */:
                        return '→';
                    case 18 /* DownArrow */:
                        return '↓';
                }
            }
            return keyCodes_1.KeyCodeUtils.toString(keyCode);
        };
        USLayoutResolvedKeybinding.prototype._getUILabelForKeybinding = function (keybinding) {
            if (!keybinding) {
                return null;
            }
            if (keybinding.isDuplicateModifierCase()) {
                return '';
            }
            return this._keyCodeToUILabel(keybinding.keyCode);
        };
        USLayoutResolvedKeybinding.prototype.getLabel = function () {
            var firstPart = this._getUILabelForKeybinding(this._firstPart);
            var chordPart = this._getUILabelForKeybinding(this._chordPart);
            return keybindingLabels_1.UILabelProvider.toLabel(this._firstPart, firstPart, this._chordPart, chordPart, this._os);
        };
        USLayoutResolvedKeybinding.prototype._getAriaLabelForKeybinding = function (keybinding) {
            if (!keybinding) {
                return null;
            }
            if (keybinding.isDuplicateModifierCase()) {
                return '';
            }
            return keyCodes_1.KeyCodeUtils.toString(keybinding.keyCode);
        };
        USLayoutResolvedKeybinding.prototype.getAriaLabel = function () {
            var firstPart = this._getAriaLabelForKeybinding(this._firstPart);
            var chordPart = this._getAriaLabelForKeybinding(this._chordPart);
            return keybindingLabels_1.AriaLabelProvider.toLabel(this._firstPart, firstPart, this._chordPart, chordPart, this._os);
        };
        USLayoutResolvedKeybinding.prototype._keyCodeToElectronAccelerator = function (keyCode) {
            if (keyCode >= 93 /* NUMPAD_0 */ && keyCode <= 108 /* NUMPAD_DIVIDE */) {
                // Electron cannot handle numpad keys
                return null;
            }
            switch (keyCode) {
                case 16 /* UpArrow */:
                    return 'Up';
                case 18 /* DownArrow */:
                    return 'Down';
                case 15 /* LeftArrow */:
                    return 'Left';
                case 17 /* RightArrow */:
                    return 'Right';
            }
            return keyCodes_1.KeyCodeUtils.toString(keyCode);
        };
        USLayoutResolvedKeybinding.prototype._getElectronAcceleratorLabelForKeybinding = function (keybinding) {
            if (!keybinding) {
                return null;
            }
            if (keybinding.isDuplicateModifierCase()) {
                return null;
            }
            return this._keyCodeToElectronAccelerator(keybinding.keyCode);
        };
        USLayoutResolvedKeybinding.prototype.getElectronAccelerator = function () {
            if (this._chordPart !== null) {
                // Electron cannot handle chords
                return null;
            }
            var firstPart = this._getElectronAcceleratorLabelForKeybinding(this._firstPart);
            return keybindingLabels_1.ElectronAcceleratorLabelProvider.toLabel(this._firstPart, firstPart, null, null, this._os);
        };
        USLayoutResolvedKeybinding.prototype._getUserSettingsLabelForKeybinding = function (keybinding) {
            if (!keybinding) {
                return null;
            }
            if (keybinding.isDuplicateModifierCase()) {
                return '';
            }
            return keyCodes_1.KeyCodeUtils.toUserSettingsUS(keybinding.keyCode);
        };
        USLayoutResolvedKeybinding.prototype.getUserSettingsLabel = function () {
            var firstPart = this._getUserSettingsLabelForKeybinding(this._firstPart);
            var chordPart = this._getUserSettingsLabelForKeybinding(this._chordPart);
            var result = keybindingLabels_1.UserSettingsLabelProvider.toLabel(this._firstPart, firstPart, this._chordPart, chordPart, this._os);
            return (result ? result.toLowerCase() : result);
        };
        USLayoutResolvedKeybinding.prototype.isWYSIWYG = function () {
            return true;
        };
        USLayoutResolvedKeybinding.prototype.isChord = function () {
            return (this._chordPart ? true : false);
        };
        USLayoutResolvedKeybinding.prototype.getParts = function () {
            return [
                this._toResolvedKeybindingPart(this._firstPart),
                this._toResolvedKeybindingPart(this._chordPart)
            ];
        };
        USLayoutResolvedKeybinding.prototype._toResolvedKeybindingPart = function (keybinding) {
            if (!keybinding) {
                return null;
            }
            return new keyCodes_1.ResolvedKeybindingPart(keybinding.ctrlKey, keybinding.shiftKey, keybinding.altKey, keybinding.metaKey, this._getUILabelForKeybinding(keybinding), this._getAriaLabelForKeybinding(keybinding));
        };
        USLayoutResolvedKeybinding.prototype.getDispatchParts = function () {
            var firstPart = this._firstPart ? USLayoutResolvedKeybinding.getDispatchStr(this._firstPart) : null;
            var chordPart = this._chordPart ? USLayoutResolvedKeybinding.getDispatchStr(this._chordPart) : null;
            return [firstPart, chordPart];
        };
        USLayoutResolvedKeybinding.getDispatchStr = function (keybinding) {
            if (keybinding.isModifierKey()) {
                return null;
            }
            var result = '';
            if (keybinding.ctrlKey) {
                result += 'ctrl+';
            }
            if (keybinding.shiftKey) {
                result += 'shift+';
            }
            if (keybinding.altKey) {
                result += 'alt+';
            }
            if (keybinding.metaKey) {
                result += 'meta+';
            }
            result += keyCodes_1.KeyCodeUtils.toString(keybinding.keyCode);
            return result;
        };
        return USLayoutResolvedKeybinding;
    }(keyCodes_1.ResolvedKeybinding));
    exports.USLayoutResolvedKeybinding = USLayoutResolvedKeybinding;
});
//# sourceMappingURL=usLayoutResolvedKeybinding.js.map